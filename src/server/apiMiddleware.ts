import type { IncomingMessage, ServerResponse } from 'node:http';
import {
  getAllVenuesFromDb,
  getVenueByIdFromDb,
  insertVenueToDb,
  deleteVenueFromDb,
  resetDbToDefaults,
  getDbStats,
} from './db.ts';
import { Venue } from '../types/index.ts';

// Track active SSE subscribers for real-time live sync
const sseClients = new Set<ServerResponse>();

export function broadcastSync(eventType: string, payload: any) {
  const message = `event: ${eventType}\ndata: ${JSON.stringify(payload)}\n\n`;
  for (const client of sseClients) {
    try {
      client.write(message);
    } catch {
      sseClients.delete(client);
    }
  }
}

function parseJsonBody(req: IncomingMessage): Promise<any> {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', (chunk) => {
      data += chunk;
      // Protect against gigantic payloads
      if (data.length > 5 * 1024 * 1024) {
        reject(new Error('Payload too large'));
      }
    });
    req.on('end', () => {
      if (!data) return resolve({});
      try {
        resolve(JSON.parse(data));
      } catch (err) {
        reject(err);
      }
    });
    req.on('error', reject);
  });
}

export async function handleApiRoute(
  req: IncomingMessage,
  res: ServerResponse,
  next?: () => void
): Promise<boolean> {
  const url = req.url || '';

  // Only handle /api paths
  if (!url.startsWith('/api')) {
    if (next) next();
    return false;
  }

  // Set standard CORS headers for development flexibility
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.end();
    return true;
  }

  // 1. SSE Real-Time Sync Stream: GET /api/events/sync
  if (url === '/api/events/sync' && req.method === 'GET') {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
      'Access-Control-Allow-Origin': '*',
    });

    sseClients.add(res);

    // Send immediate initial sync snapshot
    const initialVenues = getAllVenuesFromDb();
    const stats = getDbStats();
    res.write(
      `event: initial_sync\ndata: ${JSON.stringify({
        venues: initialVenues,
        stats,
        message: 'Connected to local SQLite dynamic sync engine',
      })}\n\n`
    );

    // Keepalive heartbeat ping every 15s to avoid dropped connections
    const interval = setInterval(() => {
      try {
        res.write(': keepalive\n\n');
      } catch {
        clearInterval(interval);
      }
    }, 15000);

    req.on('close', () => {
      clearInterval(interval);
      sseClients.delete(res);
    });

    return true;
  }

  // 2. Database Status: GET /api/status
  if (url === '/api/status' && req.method === 'GET') {
    res.setHeader('Content-Type', 'application/json');
    const stats = getDbStats();
    res.statusCode = 200;
    res.end(JSON.stringify({ success: true, ...stats }));
    return true;
  }

  // 3. Reset to Defaults: POST /api/events/reset
  if (url === '/api/events/reset' && req.method === 'POST') {
    res.setHeader('Content-Type', 'application/json');
    try {
      const venues = resetDbToDefaults();
      const stats = getDbStats();
      broadcastSync('sync_update', {
        action: 'RESET',
        venues,
        stats,
        timestamp: new Date().toISOString(),
      });
      res.statusCode = 200;
      res.end(JSON.stringify({ success: true, count: venues.length, venues, stats }));
    } catch (e: any) {
      res.statusCode = 500;
      res.end(JSON.stringify({ success: false, error: e.message }));
    }
    return true;
  }

  // 4. Query All Venues: GET /api/events
  if ((url === '/api/events' || url.startsWith('/api/events?')) && req.method === 'GET') {
    res.setHeader('Content-Type', 'application/json');
    try {
      const venues = getAllVenuesFromDb();
      res.statusCode = 200;
      res.end(JSON.stringify({ success: true, count: venues.length, venues }));
    } catch (e: any) {
      res.statusCode = 500;
      res.end(JSON.stringify({ success: false, error: e.message }));
    }
    return true;
  }

  // 5. Add New Event: POST /api/events
  if (url === '/api/events' && req.method === 'POST') {
    res.setHeader('Content-Type', 'application/json');
    try {
      const body = await parseJsonBody(req);
      if (!body.name || !body.location) {
        res.statusCode = 400;
        res.end(JSON.stringify({ success: false, error: 'Name and location are required' }));
        return true;
      }

      const newId = body.id || `venue-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
      const venue: Venue = {
        id: newId,
        name: body.name,
        subtitle: body.subtitle || '',
        location: body.location,
        area: body.area || 'Ahmedabad',
        coordinates: {
          lat: Number(body.coordinates?.lat || 23.03),
          lng: Number(body.coordinates?.lng || 72.52),
        },
        distanceKm: Number(body.distanceKm || 2.5),
        travelMinutes: Number(body.travelMinutes || 10),
        rating: Number(body.rating || 4.8),
        reviewsCount: Number(body.reviewsCount || 120),
        artist: {
          name: body.artist?.name || 'Live Folk Troupe',
          subtitle: body.artist?.subtitle || 'Traditional Raas Ensemble',
          image: body.artist?.image || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500&auto=format&fit=crop&q=80',
          badge: body.artist?.badge,
          genre: body.artist?.genre,
        },
        curfew: body.curfew || 'Allowed until 12:00 AM',
        curfewTime: body.curfewTime || '12:00 AM Curfew',
        isOvernight: Boolean(body.isOvernight),
        prices: {
          single: Number(body.prices?.single || 499),
          couple: Number(body.prices?.couple || 999),
          season: Number(body.prices?.season || 2999),
        },
        originalPrice: body.originalPrice ? Number(body.originalPrice) : undefined,
        amenities: Array.isArray(body.amenities) ? body.amenities : ['Valet Parking', 'Food Stalls', 'Security'],
        image: body.image || 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&auto=format&fit=crop&q=80',
        rushLevel: body.rushLevel || 'Normal',
        passesLeft: body.passesLeft !== undefined ? Number(body.passesLeft) : 100,
        isOfficial: Boolean(body.isOfficial),
        isCelebrity: Boolean(body.isCelebrity),
        soldPercent: body.soldPercent !== undefined ? Number(body.soldPercent) : 40,
        danceSurface: body.danceSurface || 'Wooden Sprung Floor',
        parkingType: body.parkingType || 'Valet Available',
        soundSystem: body.soundSystem || 'Line Array JBL VTX',
        gatesOpen: body.gatesOpen || '7:00 PM',
        aartiTime: body.aartiTime || '8:00 PM',
      };

      const saved = insertVenueToDb(venue);
      const allVenues = getAllVenuesFromDb();
      const stats = getDbStats();

      // Real-time broadcast to all connected clients!
      broadcastSync('sync_update', {
        action: 'ADD_EVENT',
        newVenue: saved,
        venues: allVenues,
        stats,
        timestamp: new Date().toISOString(),
      });

      res.statusCode = 201;
      res.end(JSON.stringify({ success: true, venue: saved, stats }));
    } catch (e: any) {
      res.statusCode = 500;
      res.end(JSON.stringify({ success: false, error: e.message }));
    }
    return true;
  }

  // 6. Delete Event: DELETE /api/events/:id
  const deleteMatch = url.match(/^\/api\/events\/([a-zA-Z0-9_-]+)$/);
  if (deleteMatch && req.method === 'DELETE') {
    const id = deleteMatch[1];
    res.setHeader('Content-Type', 'application/json');
    try {
      const success = deleteVenueFromDb(id);
      if (!success) {
        res.statusCode = 404;
        res.end(JSON.stringify({ success: false, error: 'Event not found in SQLite' }));
        return true;
      }
      const allVenues = getAllVenuesFromDb();
      const stats = getDbStats();
      broadcastSync('sync_update', {
        action: 'DELETE_EVENT',
        deletedId: id,
        venues: allVenues,
        stats,
        timestamp: new Date().toISOString(),
      });
      res.statusCode = 200;
      res.end(JSON.stringify({ success: true, deletedId: id, stats }));
    } catch (e: any) {
      res.statusCode = 500;
      res.end(JSON.stringify({ success: false, error: e.message }));
    }
    return true;
  }

  // If no matching /api route
  if (next) {
    next();
  } else {
    res.statusCode = 404;
    res.end(JSON.stringify({ error: 'Endpoint not found' }));
  }
  return true;
}
