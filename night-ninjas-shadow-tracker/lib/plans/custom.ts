import type {
  PaceZones,
  PlanEngine,
  PlanParams,
  WeekTemplate,
  DayPlan,
} from './types';
import { band, marathonPaceSpk, offset } from './derive';

/* ----------------------------------------------------------------------------
 * Custom dojo.
 *
 * The user defines their own weekly structure via the wizard and edits it
 * later in /dojo. Pace zones default to a reasonable middle ground (between
 * Hansons and Lydiard); the user can adjust each band manually.
 *
 * The custom week JSON is stored on the active plan row; this engine reads
 * it back. If no customWeekJson exists yet, we render a sensible default.
 * -------------------------------------------------------------------------- */

const PHILOSOPHY =
  'Your plan, your rules. Define your own weekly session pattern, set pace zones manually, and adjust as you learn what works for your body.';

function paceZones(params: PlanParams): PaceZones {
  const mp = marathonPaceSpk(params);
  return {
    recovery: offset(mp, 90, 130),
    easy: offset(mp, 50, 90),
    long: offset(mp, 30, 70),
    marathon: band(mp, 5),
    threshold: band(mp - 10, 7),
    interval: band(mp - 32, 9),
    repetition: band(mp - 50, 11),
  };
}

function defaultWeek(params: PlanParams): DayPlan[] {
  const z = paceZones(params);
  return [
    { dow: 0, sessions: [{ label: 'Mon easy', type: 'easy', paceZone: z.easy, distanceKmMin: 6, distanceKmMax: 10 }] },
    { dow: 1, sessions: [{ label: 'Tue quality', type: 'tempo', paceZone: z.threshold, distanceKmMin: 8, distanceKmMax: 12 }] },
    { dow: 2, sessions: [{ label: 'Wed rest/cross', type: 'cross', durationMinMin: 30, durationMinMax: 60 }] },
    { dow: 3, sessions: [{ label: 'Thu easy', type: 'easy', paceZone: z.easy, distanceKmMin: 6, distanceKmMax: 10 }] },
    { dow: 4, sessions: [{ label: 'Fri rest', type: 'rest' }] },
    { dow: 5, sessions: [{ label: 'Sat moderate', type: 'easy', paceZone: z.easy, distanceKmMin: 8, distanceKmMax: 14 }] },
    { dow: 6, sessions: [{ label: 'Sun long', type: 'long', paceZone: z.long, distanceKmMin: 16, distanceKmMax: 24 }] },
  ];
}

function renderWeek(params: PlanParams, weekNumber: number): WeekTemplate {
  // For custom dojo, the same week structure repeats every week unless
  // the user has saved variations. Volume cap respects user setting.
  const cap = params.weeklyVolumeCapKm ?? 70;
  const longCap = params.longRunCapKm ?? 24;

  return {
    weekNumber,
    phaseName: 'Custom',
    totalKmTarget: cap,
    longRunKmTarget: longCap,
    days: defaultWeek(params),
    notes: 'Custom plan. Edit your weekly structure in the Dojo screen.',
  };
}

export const custom: PlanEngine = {
  dojo: 'custom',
  displayName: 'Custom',
  philosophy: PHILOSOPHY,
  defaultProgramWeeks: 16,
  defaultLongRunCapKm: 24,
  derivePaceZones: paceZones,
  renderWeek,
};
