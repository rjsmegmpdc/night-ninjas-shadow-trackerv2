'use server';

/**
 * Phase 5 - daily wellness slider. Upserts one journal row per date with the
 * athlete's morning self-assessment (sleep quality, sleep hours, energy). Only
 * the fields actually entered are written, so a partial submit never clobbers
 * an existing value for that day. This is the first app-side writer of the
 * (previously unused) journal table.
 */

import { revalidatePath } from 'next/cache';
import { sql } from 'drizzle-orm';
import { getDb, schema } from '@/lib/db';

export interface WellnessResult {
  ok: boolean;
  error?: string;
}

/** Parse an optional numeric field; clamps to [lo, hi]. Returns a 3-state result. */
function parseScale(
  raw: string,
  lo: number,
  hi: number,
  label: string,
  round: boolean
): { provided: false } | { provided: true; ok: true; value: number } | { provided: true; ok: false; error: string } {
  const s = raw.trim();
  if (s === '') return { provided: false };
  const n = Number(s);
  if (!Number.isFinite(n)) return { provided: true, ok: false, error: `${label} must be a number.` };
  const clamped = Math.max(lo, Math.min(hi, round ? Math.round(n) : n));
  return { provided: true, ok: true, value: clamped };
}

export async function logWellness(formData: FormData): Promise<WellnessResult> {
  const date = String(formData.get('date') ?? '').trim() || new Date().toISOString().slice(0, 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return { ok: false, error: 'Date must be YYYY-MM-DD.' };

  const sq = parseScale(String(formData.get('sleepQuality') ?? ''), 1, 10, 'Sleep quality', true);
  const en = parseScale(String(formData.get('energy') ?? ''), 1, 10, 'Energy', true);
  const sh = parseScale(String(formData.get('sleepHours') ?? ''), 0, 16, 'Sleep hours', false);

  for (const f of [sq, en, sh]) {
    if (f.provided && !f.ok) return { ok: false, error: f.error };
  }
  if (!sq.provided && !en.provided && !sh.provided) {
    return { ok: false, error: 'Enter at least one of sleep quality, hours, or energy.' };
  }

  const insertVals: typeof schema.journal.$inferInsert = { date };
  const updates: Record<string, unknown> = { updatedAt: sql`(unixepoch())` };
  if (sq.provided && sq.ok) { insertVals.sleepQuality = sq.value; updates.sleepQuality = sq.value; }
  if (en.provided && en.ok) { insertVals.energy = en.value; updates.energy = en.value; }
  if (sh.provided && sh.ok) { insertVals.sleepHours = sh.value; updates.sleepHours = sh.value; }

  try {
    await getDb()
      .insert(schema.journal)
      .values(insertVals)
      .onConflictDoUpdate({ target: schema.journal.date, set: updates });
  } catch {
    return { ok: false, error: 'Could not save. Has the database been migrated?' };
  }

  revalidatePath('/profile');
  return { ok: true };
}
