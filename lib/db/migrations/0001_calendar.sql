-- Night Ninjas — Shadow Tracker
-- Migration 0001 — Calendar tables (races, recurring_sessions, calendar_events)
--
-- Apply with:
--   sqlite3 "%APPDATA%\NightNinjas\shadow-tracker.db" < lib/db/migrations/0001_calendar.sql
--
-- Or use Drizzle:
--   npx drizzle-kit push    (interactive — type "No, abort" if it asks to drop __drizzle_migrations)

CREATE TABLE IF NOT EXISTS races (
  id              INTEGER PRIMARY KEY AUTOINCREMENT,
  name            TEXT    NOT NULL,
  distance_km     REAL    NOT NULL,
  race_date       TEXT    NOT NULL,
  target_time_s   INTEGER,
  is_goal         INTEGER NOT NULL DEFAULT 0,
  level           TEXT,
  notes           TEXT,
  created_at      INTEGER NOT NULL DEFAULT (unixepoch())
);

CREATE INDEX IF NOT EXISTS races_date_idx ON races(race_date);

CREATE TABLE IF NOT EXISTS recurring_sessions (
  id                       INTEGER PRIMARY KEY AUTOINCREMENT,
  name                     TEXT    NOT NULL,
  dow                      INTEGER NOT NULL,
  session_type             TEXT    NOT NULL,
  typical_distance_km_min  REAL,
  typical_distance_km_max  REAL,
  pace_label               TEXT,
  venue                    TEXT,
  is_active                INTEGER NOT NULL DEFAULT 1,
  is_ninja_loop            INTEGER NOT NULL DEFAULT 0,
  notes                    TEXT,
  created_at               INTEGER NOT NULL DEFAULT (unixepoch())
);

CREATE TABLE IF NOT EXISTS calendar_events (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  event_type   TEXT    NOT NULL,
  title        TEXT,
  start_date   TEXT    NOT NULL,
  end_date     TEXT,
  impact       TEXT    NOT NULL,
  notes        TEXT,
  created_at   INTEGER NOT NULL DEFAULT (unixepoch())
);

CREATE INDEX IF NOT EXISTS calendar_events_start_idx ON calendar_events(start_date);
CREATE INDEX IF NOT EXISTS calendar_events_type_idx  ON calendar_events(event_type);
