import { Venue } from '../types';
import { VENUES } from '../data/venues';

export interface SqliteStats {
  engine: string;
  zeroDependency: boolean;
  status: 'connected' | 'offline' | 'syncing';
  dbFilePath?: string;
  dbFileName?: string;
  fileSizeBytes?: number;
  totalVenues?: number;
  lastAuditAction?: string;
  recentLogs?: Array<{
    id: number;
    event_id: string;
    action: string;
    timestamp: string;
    details: string;
  }>;
  syncedAt?: string;
}

export type SyncStatus = 'connected' | 'syncing' | 'offline' | 'cached';

class DataSyncService {
  private eventSource: EventSource | null = null;
  private subscribers: Set<(venues: Venue[], stats?: SqliteStats) => void> = new Set();
  private lastStats: SqliteStats = {
    engine: 'node:sqlite (Node.js Standard Library)',
    zeroDependency: true,
    status: 'connected',
    totalVenues: VENUES.length,
    dbFileName: 'garba_radar.db',
  };
  private currentVenues: Venue[] = VENUES;
  private isConnected = false;

  constructor() {
    // Attempt local storage cache restoration if available
    const cached = localStorage.getItem('garba_radar_sqlite_cache');
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) {
          this.currentVenues = parsed;
        }
      } catch (e) {
        console.error('Failed to parse cached venues', e);
      }
    }
  }

  public subscribe(callback: (venues: Venue[], stats?: SqliteStats) => void): () => void {
    this.subscribers.add(callback);
    // Send immediate snapshot
    callback(this.currentVenues, this.lastStats);

    if (!this.eventSource) {
      this.connectSse();
    }

    return () => {
      this.subscribers.delete(callback);
      if (this.subscribers.size === 0 && this.eventSource) {
        this.eventSource.close();
        this.eventSource = null;
      }
    };
  }

  private notifyAll(venues: Venue[], stats?: SqliteStats) {
    this.currentVenues = venues;
    if (stats) this.lastStats = stats;
    try {
      localStorage.setItem('garba_radar_sqlite_cache', JSON.stringify(venues));
    } catch {}

    for (const sub of this.subscribers) {
      try {
        sub(venues, this.lastStats);
      } catch (err) {
        console.error('Error in subscriber callback:', err);
      }
    }
  }

  public connectSse() {
    if (typeof window === 'undefined') return;

    if (this.eventSource) {
      this.eventSource.close();
    }

    try {
      const sse = new EventSource('/api/events/sync');
      this.eventSource = sse;

      sse.addEventListener('initial_sync', (event) => {
        try {
          const data = JSON.parse(event.data);
          this.isConnected = true;
          const stats = { ...data.stats, status: 'connected' as const };
          this.notifyAll(data.venues, stats);
        } catch (err) {
          console.error('Failed to parse initial_sync:', err);
        }
      });

      sse.addEventListener('sync_update', (event) => {
        try {
          const data = JSON.parse(event.data);
          this.isConnected = true;
          const stats = { ...data.stats, status: 'connected' as const };
          this.notifyAll(data.venues, stats);
        } catch (err) {
          console.error('Failed to parse sync_update:', err);
        }
      });

      sse.onopen = () => {
        this.isConnected = true;
        this.lastStats = { ...this.lastStats, status: 'connected' };
      };

      sse.onerror = () => {
        this.isConnected = false;
        this.lastStats = { ...this.lastStats, status: 'offline' };
        // Fallback to REST polling if SSE has temporary connection break
        setTimeout(() => {
          this.fetchVenues();
        }, 3000);
      };
    } catch (e) {
      console.warn('SSE connection could not be established; falling back to REST', e);
      this.fetchVenues();
    }
  }

  public async fetchVenues(): Promise<Venue[]> {
    try {
      const res = await fetch('/api/events');
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.venues)) {
          this.notifyAll(data.venues);
          return data.venues;
        }
      }
    } catch (e) {
      console.warn('REST fetch failed, using memory/local venues', e);
    }
    return this.currentVenues;
  }

  public async fetchStats(): Promise<SqliteStats | null> {
    try {
      const res = await fetch('/api/status');
      if (res.ok) {
        const data = await res.json();
        this.lastStats = { ...data, status: 'connected' };
        return this.lastStats;
      }
    } catch (e) {
      console.warn('Stats fetch failed', e);
    }
    return null;
  }

  public async createVenue(venue: Partial<Venue>): Promise<{ success: boolean; venue?: Venue; error?: string }> {
    try {
      const res = await fetch('/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(venue),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to save event to SQLite');
      }

      // Optimistically add if not already received via SSE
      if (data.venue && !this.currentVenues.some((v) => v.id === data.venue.id)) {
        const nextVenues = [data.venue, ...this.currentVenues];
        this.notifyAll(nextVenues, data.stats);
      }

      return { success: true, venue: data.venue };
    } catch (err: any) {
      console.error('Error creating venue:', err);
      return { success: false, error: err.message || 'Unknown network error' };
    }
  }

  public async deleteVenue(id: string): Promise<{ success: boolean; error?: string }> {
    try {
      const res = await fetch(`/api/events/${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to delete event from SQLite');
      }

      const nextVenues = this.currentVenues.filter((v) => v.id !== id);
      this.notifyAll(nextVenues, data.stats);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }

  public async resetToDefaults(): Promise<{ success: boolean; venues?: Venue[]; error?: string }> {
    try {
      const res = await fetch('/api/events/reset', {
        method: 'POST',
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to reset SQLite database');
      }
      this.notifyAll(data.venues, data.stats);
      return { success: true, venues: data.venues };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }

  public getCurrentVenues(): Venue[] {
    return this.currentVenues;
  }

  public getLastStats(): SqliteStats {
    return this.lastStats;
  }
}

export const dataSync = new DataSyncService();
