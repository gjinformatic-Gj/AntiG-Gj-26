import { DatabaseSync } from 'node:sqlite';
import path from 'node:path';
import fs from 'node:fs';
import { VENUES } from '../data/venues.ts';
import { Venue } from '../types/index.ts';

const DB_FILE_PATH = path.resolve(process.cwd(), 'garba_radar.db');

let dbInstance: DatabaseSync | null = null;

export function getDatabase(): DatabaseSync {
  if (!dbInstance) {
    dbInstance = new DatabaseSync(DB_FILE_PATH);
    initSchema(dbInstance);
  }
  return dbInstance;
}

function initSchema(db: DatabaseSync) {
  // Create venues_events table
  db.exec(`
    CREATE TABLE IF NOT EXISTS venues_events (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      subtitle TEXT,
      location TEXT NOT NULL,
      area TEXT NOT NULL,
      lat REAL NOT NULL,
      lng REAL NOT NULL,
      distance_km REAL DEFAULT 0,
      travel_minutes INTEGER DEFAULT 0,
      rating REAL DEFAULT 4.8,
      reviews_count INTEGER DEFAULT 0,
      artist_name TEXT NOT NULL,
      artist_subtitle TEXT,
      artist_image TEXT,
      artist_badge TEXT,
      artist_genre TEXT,
      curfew TEXT DEFAULT 'Allowed until 12:00 AM',
      curfew_time TEXT DEFAULT '12:00 AM',
      is_overnight INTEGER DEFAULT 0,
      price_single INTEGER NOT NULL,
      price_couple INTEGER NOT NULL,
      price_season INTEGER NOT NULL,
      original_price INTEGER,
      amenities TEXT,
      image TEXT,
      rush_level TEXT DEFAULT 'Normal',
      passes_left INTEGER DEFAULT 100,
      is_official INTEGER DEFAULT 0,
      is_celebrity INTEGER DEFAULT 0,
      sold_percent INTEGER DEFAULT 50,
      dance_surface TEXT DEFAULT 'Wooden Sprung Floor',
      parking_type TEXT DEFAULT 'Valet Available',
      sound_system TEXT DEFAULT 'Line Array Surround',
      gates_open TEXT DEFAULT '7:00 PM',
      aarti_time TEXT DEFAULT '8:00 PM',
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS sync_audit_log (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      event_id TEXT,
      action TEXT NOT NULL,
      timestamp TEXT DEFAULT CURRENT_TIMESTAMP,
      details TEXT
    );
  `);

  // Check if we need to seed initial venues
  const countRow = db.prepare('SELECT COUNT(*) as cnt FROM venues_events').get() as { cnt: number } | undefined;
  if (!countRow || countRow.cnt === 0) {
    seedInitialVenues(db);
  }
}

function seedInitialVenues(db: DatabaseSync) {
  const insertStmt = db.prepare(`
    INSERT INTO venues_events (
      id, name, subtitle, location, area, lat, lng,
      distance_km, travel_minutes, rating, reviews_count,
      artist_name, artist_subtitle, artist_image, artist_badge, artist_genre,
      curfew, curfew_time, is_overnight,
      price_single, price_couple, price_season, original_price,
      amenities, image, rush_level, passes_left,
      is_official, is_celebrity, sold_percent,
      dance_surface, parking_type, sound_system,
      gates_open, aarti_time
    ) VALUES (
      ?, ?, ?, ?, ?, ?, ?,
      ?, ?, ?, ?,
      ?, ?, ?, ?, ?,
      ?, ?, ?,
      ?, ?, ?, ?,
      ?, ?, ?, ?,
      ?, ?, ?,
      ?, ?, ?,
      ?, ?
    )
  `);

  for (const v of VENUES) {
    insertStmt.run(
      v.id,
      v.name,
      v.subtitle || '',
      v.location,
      v.area,
      v.coordinates.lat,
      v.coordinates.lng,
      v.distanceKm || 0,
      v.travelMinutes || 0,
      v.rating || 4.5,
      v.reviewsCount || 0,
      v.artist.name,
      v.artist.subtitle || '',
      v.artist.image || '',
      v.artist.badge || '',
      v.artist.genre || '',
      v.curfew || '',
      v.curfewTime || '',
      v.isOvernight ? 1 : 0,
      v.prices.single,
      v.prices.couple,
      v.prices.season,
      v.originalPrice || v.prices.single * 1.5,
      JSON.stringify(v.amenities || []),
      v.image || '',
      v.rushLevel || 'Normal',
      v.passesLeft || 50,
      v.isOfficial ? 1 : 0,
      v.isCelebrity ? 1 : 0,
      v.soldPercent || 50,
      v.danceSurface || '',
      v.parkingType || '',
      v.soundSystem || '',
      v.gatesOpen || '7:00 PM',
      v.aartiTime || '8:00 PM'
    );
  }

  db.prepare(`
    INSERT INTO sync_audit_log (event_id, action, details)
    VALUES (?, ?, ?)
  `).run('system', 'SEED', `Seeded ${VENUES.length} default garba grounds into local SQLite.`);
}

function mapRowToVenue(row: any): Venue {
  let amenities: string[] = [];
  try {
    amenities = row.amenities ? JSON.parse(row.amenities) : [];
  } catch {
    amenities = [];
  }

  return {
    id: row.id,
    name: row.name,
    subtitle: row.subtitle || '',
    location: row.location,
    area: row.area,
    coordinates: {
      lat: Number(row.lat),
      lng: Number(row.lng),
    },
    distanceKm: Number(row.distance_km || 0),
    travelMinutes: Number(row.travel_minutes || 0),
    rating: Number(row.rating || 4.8),
    reviewsCount: Number(row.reviews_count || 0),
    artist: {
      name: row.artist_name,
      subtitle: row.artist_subtitle || '',
      image: row.artist_image || '',
      badge: row.artist_badge || undefined,
      genre: row.artist_genre || undefined,
    },
    curfew: row.curfew,
    curfewTime: row.curfew_time,
    isOvernight: Boolean(row.is_overnight),
    prices: {
      single: Number(row.price_single),
      couple: Number(row.price_couple),
      season: Number(row.price_season),
    },
    originalPrice: row.original_price ? Number(row.original_price) : undefined,
    amenities,
    image: row.image,
    rushLevel: (row.rush_level as 'Normal' | 'Brisk' | 'Near Capacity') || 'Normal',
    passesLeft: row.passes_left ? Number(row.passes_left) : undefined,
    isOfficial: Boolean(row.is_official),
    isCelebrity: Boolean(row.is_celebrity),
    soldPercent: row.sold_percent ? Number(row.sold_percent) : undefined,
    danceSurface: row.dance_surface || '',
    parkingType: row.parking_type || '',
    soundSystem: row.sound_system || '',
    gatesOpen: row.gates_open || '',
    aartiTime: row.aarti_time || '',
  };
}

export function getAllVenuesFromDb(): Venue[] {
  const db = getDatabase();
  const rows = db.prepare('SELECT * FROM venues_events ORDER BY rowid DESC').all();
  return rows.map(mapRowToVenue);
}

export function getVenueByIdFromDb(id: string): Venue | null {
  const db = getDatabase();
  const row = db.prepare('SELECT * FROM venues_events WHERE id = ?').get(id);
  if (!row) return null;
  return mapRowToVenue(row);
}

export function insertVenueToDb(venue: Venue): Venue {
  const db = getDatabase();
  const insertStmt = db.prepare(`
    INSERT OR REPLACE INTO venues_events (
      id, name, subtitle, location, area, lat, lng,
      distance_km, travel_minutes, rating, reviews_count,
      artist_name, artist_subtitle, artist_image, artist_badge, artist_genre,
      curfew, curfew_time, is_overnight,
      price_single, price_couple, price_season, original_price,
      amenities, image, rush_level, passes_left,
      is_official, is_celebrity, sold_percent,
      dance_surface, parking_type, sound_system,
      gates_open, aarti_time, updated_at
    ) VALUES (
      ?, ?, ?, ?, ?, ?, ?,
      ?, ?, ?, ?,
      ?, ?, ?, ?, ?,
      ?, ?, ?,
      ?, ?, ?, ?,
      ?, ?, ?, ?,
      ?, ?, ?,
      ?, ?, ?,
      ?, ?, CURRENT_TIMESTAMP
    )
  `);

  insertStmt.run(
    venue.id,
    venue.name,
    venue.subtitle || '',
    venue.location,
    venue.area,
    venue.coordinates.lat,
    venue.coordinates.lng,
    venue.distanceKm || 0,
    venue.travelMinutes || 0,
    venue.rating || 4.8,
    venue.reviewsCount || 0,
    venue.artist.name,
    venue.artist.subtitle || '',
    venue.artist.image || '',
    venue.artist.badge || '',
    venue.artist.genre || '',
    venue.curfew || '',
    venue.curfewTime || '',
    venue.isOvernight ? 1 : 0,
    venue.prices.single,
    venue.prices.couple,
    venue.prices.season,
    venue.originalPrice || venue.prices.single * 1.5,
    JSON.stringify(venue.amenities || []),
    venue.image || '',
    venue.rushLevel || 'Normal',
    venue.passesLeft || 100,
    venue.isOfficial ? 1 : 0,
    venue.isCelebrity ? 1 : 0,
    venue.soldPercent || 30,
    venue.danceSurface || '',
    venue.parkingType || '',
    venue.soundSystem || '',
    venue.gatesOpen || '7:00 PM',
    venue.aartiTime || '8:00 PM'
  );

  db.prepare(`
    INSERT INTO sync_audit_log (event_id, action, details)
    VALUES (?, ?, ?)
  `).run(venue.id, 'CREATE_OR_UPDATE', `Added/Updated event "${venue.name}" in SQLite`);

  return venue;
}

export function deleteVenueFromDb(id: string): boolean {
  const db = getDatabase();
  const venue = getVenueByIdFromDb(id);
  const result = db.prepare('DELETE FROM venues_events WHERE id = ?').run(id);
  db.prepare(`
    INSERT INTO sync_audit_log (event_id, action, details)
    VALUES (?, ?, ?)
  `).run(id, 'DELETE', `Deleted venue ${venue ? venue.name : id} from SQLite`);
  return result.changes > 0;
}

export function resetDbToDefaults(): Venue[] {
  const db = getDatabase();
  db.exec('DELETE FROM venues_events');
  seedInitialVenues(db);
  return getAllVenuesFromDb();
}

export function getDbStats() {
  const db = getDatabase();
  const countRow = db.prepare('SELECT COUNT(*) as cnt FROM venues_events').get() as { cnt: number };
  const lastLog = db.prepare('SELECT * FROM sync_audit_log ORDER BY id DESC LIMIT 1').get() as any;
  const auditLogs = db.prepare('SELECT * FROM sync_audit_log ORDER BY id DESC LIMIT 10').all();

  let fileSizeBytes = 0;
  try {
    if (fs.existsSync(DB_FILE_PATH)) {
      fileSizeBytes = fs.statSync(DB_FILE_PATH).size;
    }
  } catch {
    fileSizeBytes = 0;
  }

  return {
    engine: 'node:sqlite (Node.js Standard Library)',
    zeroDependency: true,
    status: 'connected',
    dbFilePath: DB_FILE_PATH,
    dbFileName: 'garba_radar.db',
    fileSizeBytes,
    totalVenues: countRow ? countRow.cnt : 0,
    lastAuditAction: lastLog ? `${lastLog.action} (${lastLog.timestamp})` : 'None',
    recentLogs: auditLogs,
    syncedAt: new Date().toISOString(),
  };
}
