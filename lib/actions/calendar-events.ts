'use server';

import { revalidatePath } from 'next/cache';
import { eq, and } from 'drizzle-orm';
import { getDb, schema } from '@/lib/db';
import { allCachedHolidays } from '@/lib/data/nz-holidays';

function revalidateEvents() {
  revalidatePath('/setup/weekly');
  revalidatePath('/calendar');
  revalidatePath('/patrol');
}

const VALID_EVENT_TYPES = [
  'holiday', 'work_trip', 'birthday', 'sickness', 'caregiving', 'ninja_loop_holiday', 'other',
] as const;
type EventType = typeof VALID_EVENT_TYPES[number];

const VALID_IMPACTS = ['none', 'reduced', 'travel_only', 'no_training', 'group_run'] as const;
type Impact = typeof VALID_IMPACTS[number];

function toEventType(v: string | undefined): EventType {
  return (VALID_EVENT_TYPES as readonly string[]).includes(v ?? '') ? (v as EventType) : 'other';
}
function toImpact(v: string | undefined): Impact {
  return (VALID_IMPACTS as readonly string[]).includes(v ?? '') ? (v as Impact) : 'reduced';
}

export async function createCalendarEvent(formData: FormData) {
  const eventType = toEventType(formData.get('eventType')?.toString());
  const title = formData.get('title')?.toString().trim() || null;
  const startDate = formData.get('startDate')?.toString().trim();
  const endDate = formData.get('endDate')?.toString().trim() || null;
  const impact = toImpact(formData.get('impact')?.toString());
  const notes = formData.get('notes')?.toString().trim() || null;

  if (!startDate) throw new Error('Start date required.');

  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(startDate)) {
    throw new Error(`Invalid start date format: ${startDate}`);
  }
  if (endDate && !dateRegex.test(endDate)) {
    throw new Error(`Invalid end date format: ${endDate}`);
  }
  if (endDate && endDate < startDate) {
    throw new Error(`End date ${endDate} is before start date ${startDate}`);
  }

  await getDb().insert(schema.calendarEvents).values({
    eventType,
    title,
    startDate,
    endDate,
    impact,
    notes,
  });

  revalidateEvents();
}

export async function deleteCalendarEvent(formData: FormData) {
  const id = parseInt(formData.get('id')?.toString() || '0', 10);
  if (!id) return;
  await getDb().delete(schema.calendarEvents).where(eq(schema.calendarEvents.id, id));
  revalidateEvents();
}

/* ----------------------------------------------------------------------------
 * Ninja Loop bulk actions — creates calendar events for every NZ public
 * holiday between today and a year out. Idempotent: skips dates that
 * already have a ninja_loop_holiday entry.
 * -------------------------------------------------------------------------- */

export async function enableNinjaLoopHolidays() {
  const db = getDb();
  const today = new Date().toISOString().slice(0, 10);
  const yearOut = new Date();
  yearOut.setFullYear(yearOut.getFullYear() + 1);
  const cutoff = yearOut.toISOString().slice(0, 10);

  // Read from DB cache — populated by refreshNzHolidays() from govt.nz.
  const cached = await allCachedHolidays();

  await db.transaction(async (tx) => {
    const existing = await tx
      .select({ startDate: schema.calendarEvents.startDate })
      .from(schema.calendarEvents)
      .where(eq(schema.calendarEvents.eventType, 'ninja_loop_holiday'))
      .all();
    const existingDates = new Set(existing.map((e) => e.startDate));

    const toAdd = cached.filter(
      (h) => h.date >= today && h.date <= cutoff && !existingDates.has(h.date)
    );

    if (toAdd.length > 0) {
      await tx.insert(schema.calendarEvents).values(
        toAdd.map((h) => ({
          eventType: 'ninja_loop_holiday' as const,
          title: `Ninja Loop · ${h.name}`,
          startDate: h.date,
          endDate: null,
          impact: 'group_run' as const,
        }))
      );
    }
  });

  revalidateEvents();
}

export async function disableNinjaLoopHolidays() {
  await getDb()
    .delete(schema.calendarEvents)
    .where(eq(schema.calendarEvents.eventType, 'ninja_loop_holiday'));
  revalidateEvents();
}
