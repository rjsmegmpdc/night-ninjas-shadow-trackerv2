import type {
  PaceZones,
  PlanEngine,
  PlanParams,
  WeekTemplate,
  DayPlan,
  SessionTarget,
} from './types';
import { band, marathonPaceSpk, offset } from './derive';

/* ----------------------------------------------------------------------------
 * Hansons Marathon Method.
 *
 * Six days running, Wednesday rest day. Long run capped at ~26km (16 miles).
 * Tempo runs done AT marathon pace — the signature workout. Cumulative
 * fatigue is the training stimulus, not single-session distance.
 * -------------------------------------------------------------------------- */

const PHILOSOPHY =
  'Six days running, Wednesday rest day. Long run capped at 26 km — Hansons argue 35 km long runs cause more harm than benefit. Tempo runs done at marathon pace, not half-marathon pace. Cumulative fatigue is the training stimulus.';

function paceZones(params: PlanParams): PaceZones {
  const mp = marathonPaceSpk(params);
  return {
    // Recovery: 90–120 sec slower than MP. Used for shake-out runs.
    recovery: offset(mp, 90, 120),
    // Easy: 45–80 sec slower than MP. The default for Mon/Fri/Sat.
    easy: offset(mp, 45, 80),
    // Long: 25–55 sec slower than MP. Sundays.
    long: offset(mp, 25, 55),
    // Marathon: tight band ±5 sec around MP. The Thursday tempo.
    marathon: band(mp, 5),
    // Threshold: 10 sec/km faster than MP — Hansons "strength" pace.
    threshold: band(mp - 10, 6),
    // Interval: 5K–10K race pace, ~30 sec/km faster than MP.
    interval: band(mp - 30, 8),
    // Repetition: 1500m–mile race pace, ~50 sec/km faster than MP.
    repetition: band(mp - 50, 10),
  };
}

function isPeakPhase(weekNumber: number, programWeeks: number): boolean {
  // Peak runs from roughly week 7 of an 18-week plan onwards.
  return weekNumber > Math.floor(programWeeks * 0.4);
}

function isTaperPhase(weekNumber: number, programWeeks: number): boolean {
  return weekNumber >= programWeeks - 2;
}

function weekVolumeKm(params: PlanParams, weekNumber: number): number {
  // Hansons Beginner ramps from ~25km/wk in week 1 to ~92km/wk peak.
  // Apply user's volume cap if set.
  const cap = params.weeklyVolumeCapKm ?? 92;
  const peakWeek = Math.floor((params.programWeeks ?? 18) * 0.7);
  const startKm = 25;
  const t = Math.min(1, weekNumber / peakWeek);
  const ramped = startKm + (cap - startKm) * t;
  // Taper: cut 30% in last 2 weeks
  if (isTaperPhase(weekNumber, params.programWeeks ?? 18)) {
    return ramped * 0.7;
  }
  return Math.round(ramped);
}

function longRunKm(params: PlanParams, weekNumber: number): number {
  const cap = params.longRunCapKm ?? 26;
  // Builds from 13 km in week 1 to cap by ~week 10, holds, then tapers.
  const programWeeks = params.programWeeks ?? 18;
  const peakWeek = Math.floor(programWeeks * 0.6);
  if (isTaperPhase(weekNumber, programWeeks)) {
    return Math.round(cap * 0.6);
  }
  if (weekNumber >= peakWeek) return cap;
  const t = weekNumber / peakWeek;
  return Math.round(13 + (cap - 13) * t);
}

function renderDay(
  zones: PaceZones,
  dow: 0 | 1 | 2 | 3 | 4 | 5 | 6,
  longKm: number,
  isPeak: boolean
): DayPlan {
  const easySession: SessionTarget = {
    label: 'Easy run',
    type: 'easy',
    paceZone: zones.easy,
    distanceKmMin: 5,
    distanceKmMax: 12,
  };

  switch (dow) {
    case 0: // Mon
      return { dow, sessions: [easySession] };
    case 1: // Tue — speed (early) or strength (peak)
      return {
        dow,
        sessions: [
          {
            label: isPeak ? 'Strength workout' : 'Speed intervals',
            type: isPeak ? 'tempo' : 'interval',
            paceZone: isPeak ? zones.threshold : zones.interval,
            distanceKmMin: 8,
            distanceKmMax: 14,
            notes: isPeak
              ? 'Long reps at MP minus ~10s/km, short rest.'
              : 'Short reps (400m–1.6km) at 5K–10K pace.',
          },
        ],
      };
    case 2: // Wed — rest, optional cross-train
      return {
        dow,
        sessions: [
          {
            label: 'Optional cross-train',
            type: 'cross',
            durationMinMin: 30,
            durationMinMax: 60,
            notes: 'Easy bike or swim. Skip if tired.',
          },
        ],
      };
    case 3: // Thu — tempo at MP
      return {
        dow,
        sessions: [
          {
            label: 'Tempo at MP',
            type: 'tempo',
            paceZone: zones.marathon,
            distanceKmMin: 9,
            distanceKmMax: 16,
            notes: 'The signature Hansons workout. Run at marathon goal pace.',
          },
        ],
      };
    case 4: // Fri
      return {
        dow,
        sessions: [{ ...easySession, distanceKmMin: 5, distanceKmMax: 8 }],
      };
    case 5: // Sat — easy on tired legs
      return {
        dow,
        sessions: [
          {
            ...easySession,
            label: 'Easy run (cumulative fatigue)',
            distanceKmMin: 8,
            distanceKmMax: 12,
            notes: 'Sets up Sunday long run on tired legs.',
          },
        ],
      };
    case 6: // Sun — long run
      return {
        dow,
        sessions: [
          {
            label: 'Long run',
            type: 'long',
            paceZone: zones.long,
            distanceKmMin: longKm * 0.85,
            distanceKmMax: longKm,
          },
        ],
      };
  }
}

function renderWeek(params: PlanParams, weekNumber: number): WeekTemplate {
  const zones = paceZones(params);
  const programWeeks = params.programWeeks ?? 18;
  const peak = isPeakPhase(weekNumber, programWeeks);
  const taper = isTaperPhase(weekNumber, programWeeks);
  const longKm = longRunKm(params, weekNumber);
  const totalKm = weekVolumeKm(params, weekNumber);

  const phaseName = taper ? 'Taper' : peak ? 'Peak' : 'Build';

  return {
    weekNumber,
    phaseName,
    totalKmTarget: totalKm,
    longRunKmTarget: longKm,
    days: ([0, 1, 2, 3, 4, 5, 6] as const).map((d) =>
      renderDay(zones, d, longKm, peak)
    ),
  };
}

/* ----------------------------------------------------------------------------
 * Engine export.
 * -------------------------------------------------------------------------- */
export const hansons: PlanEngine = {
  dojo: 'hansons',
  displayName: 'Hansons Marathon Method',
  philosophy: PHILOSOPHY,
  defaultProgramWeeks: 18,
  defaultLongRunCapKm: 26,
  derivePaceZones: paceZones,
  renderWeek,
};
