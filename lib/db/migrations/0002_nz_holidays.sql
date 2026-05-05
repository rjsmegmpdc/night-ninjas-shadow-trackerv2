-- Night Ninjas — Shadow Tracker
-- Migration 0002 — NZ holidays cache table
--
-- Apply with:
--   sqlite3 "%APPDATA%\NightNinjas\shadow-tracker.db" < lib/db/migrations/0002_nz_holidays.sql
--
-- Or use Drizzle:
--   npx drizzle-kit push    (interactive — Y to accept new table)

CREATE TABLE IF NOT EXISTS nz_holidays (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  date        TEXT    NOT NULL,
  name        TEXT    NOT NULL,
  region      TEXT,
  year        INTEGER NOT NULL,
  source      TEXT    NOT NULL,
  fetched_at  INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS nz_holidays_date_idx ON nz_holidays(date);
CREATE INDEX IF NOT EXISTS nz_holidays_year_idx ON nz_holidays(year);
