'use server';

import { revalidatePath } from 'next/cache';
import { eq } from 'drizzle-orm';
import { getDb, schema } from '@/lib/db';

export const KEY_WEEKLY = 'capacity.weekly_cap_km';
export const KEY_LONG = 'capacity.long_run_cap_km';

export async function saveCapacity(formData: FormData) {
  const weekly = formData.get('weeklyVolumeCapKm')?.toString().trim() || '';
  const long = formData.get('longRunCapKm')?.toString().trim() || '';

  const db = getDb();
  for (const [key, value] of [
    [KEY_WEEKLY, weekly],
    [KEY_LONG, long],
  ] as const) {
    if (value) {
      await db
        .insert(schema.settings)
        .values({ key, value })
        .onConflictDoUpdate({
          target: schema.settings.key,
          set: { value, updatedAt: new Date() },
        });
    } else {
      await db.delete(schema.settings).where(eq(schema.settings.key, key));
    }
  }

  revalidatePath('/setup/weekly');
  revalidatePath('/calendar');
  revalidatePath('/patrol');
}
