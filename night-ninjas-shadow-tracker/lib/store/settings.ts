import 'server-only';
import { eq } from 'drizzle-orm';
import { getDb, schema } from '@/lib/db';

/* ----------------------------------------------------------------------------
 * Settings — typed key/value access against the settings table.
 *
 * The schema is loose intentionally: we want to evolve config without
 * migration churn. But each accessor below is typed so application code
 * is still type-safe.
 *
 * Secrets (Strava client_secret, OAuth tokens) DO NOT live here — they
 * go in the OS keychain via `lib/store/secrets.ts`.
 * -------------------------------------------------------------------------- */

const KEY = {
  SETUP_COMPLETE: 'setup.complete',
  STRAVA_CLIENT_ID: 'strava.client_id',
  STRAVA_ATHLETE_ID: 'strava.athlete_id',
  STRAVA_LAST_SYNC_AT: 'strava.last_sync_at',
  USER_TIMEZONE: 'user.timezone',
} as const;

async function get(key: string): Promise<string | null> {
  const row = await getDb()
    .select()
    .from(schema.settings)
    .where(eq(schema.settings.key, key))
    .get();
  return row?.value ?? null;
}

async function set(key: string, value: string): Promise<void> {
  await getDb()
    .insert(schema.settings)
    .values({ key, value })
    .onConflictDoUpdate({
      target: schema.settings.key,
      set: { value, updatedAt: new Date() },
    });
}

/* ----------------------------------------------------------------------------
 * Public API — typed accessors only.
 * -------------------------------------------------------------------------- */

export async function isSetupComplete(): Promise<boolean> {
  try {
    return (await get(KEY.SETUP_COMPLETE)) === 'true';
  } catch {
    // First boot — DB may not exist yet. Treat as not-complete.
    return false;
  }
}

export async function markSetupComplete(): Promise<void> {
  await set(KEY.SETUP_COMPLETE, 'true');
}

export async function getStravaClientId(): Promise<string | null> {
  return get(KEY.STRAVA_CLIENT_ID);
}

export async function setStravaClientId(id: string): Promise<void> {
  await set(KEY.STRAVA_CLIENT_ID, id);
}

export async function getStravaAthleteId(): Promise<string | null> {
  return get(KEY.STRAVA_ATHLETE_ID);
}

export async function setStravaAthleteId(id: string): Promise<void> {
  await set(KEY.STRAVA_ATHLETE_ID, id);
}

export async function getLastSyncAt(): Promise<Date | null> {
  const v = await get(KEY.STRAVA_LAST_SYNC_AT);
  return v ? new Date(v) : null;
}

export async function setLastSyncAt(d: Date): Promise<void> {
  await set(KEY.STRAVA_LAST_SYNC_AT, d.toISOString());
}

export async function getUserTimezone(): Promise<string> {
  return (await get(KEY.USER_TIMEZONE)) ?? 'Pacific/Auckland';
}

export async function setUserTimezone(tz: string): Promise<void> {
  await set(KEY.USER_TIMEZONE, tz);
}
