import 'server-only';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import { dbFilePath } from './data-dir';
import * as schema from './schema';

/**
 * Single shared DB connection for the local SQLite file.
 *
 * Better-sqlite3 is synchronous and embedded — no server, no connection
 * pool, no async overhead. The whole DB is one file in the user's data
 * directory and ours alone.
 */
let _db: ReturnType<typeof drizzle<typeof schema>> | null = null;

export function getDb() {
  if (!_db) {
    const sqlite = new Database(dbFilePath());
    sqlite.pragma('journal_mode = WAL');
    sqlite.pragma('foreign_keys = ON');
    sqlite.pragma('synchronous = NORMAL');
    _db = drizzle(sqlite, { schema });
  }
  return _db;
}

export { schema };
