import type {
  PaceZones,
  PlanEngine,
  PlanParams,
  WeekTemplate,
  WeekContext,
  CalendarConfig,
  DayPlan,
  SessionTarget,
} from './types';
import { band, marathonPaceSpk, offset } from './derive';
import { applyStructuredCalendar } from './calendar-blocks';

/* ----------------------------------------------------------------------------
 * Norwegian Singles — Auckland Marathon 20-week build.
 *
 * The amateur adaptation of the Norwegian double-threshold system
 * (Bakken / Ingebrigtsen), validated by the ICS plan (ns-marathon-plan.ics).
 * Three controlled sub-threshold sessions per week; everything else is
 * genuinely easy. Quality capped at 22% of weekly volume.
 *
 * Three pillars (per the locked VELOCITY spec):
 *   1. Three sub-threshold interval sessions per week + one easy long run.
 *      Sub-threshold means LT1-adjacent (~2 mmol), NOT LT2. "I could do
 *      several more reps" is the calibration test. The classic NS failure
 *      mode is running reps too hot.
 *   2. Quality cap: accumulated sub-T time stays within 20-25% of weekly
 *      volume. This engine pins 22%.
 *   3. Everything else is genuinely easy — Z1, conversational. No
 *      moderate days, no VO2-max work, no doubles.
 *
 * Session library (ICS-exact labels per phase):
 *   Base Early (wks 3-6):    Short=20×400m / Medium=6×5min / Long=4×8min
 *   Base Mid   (wks 7-12):   Short=24×400m / Medium=7×5min / Long=5×8min
 *   Specificity (wks 13-18): Short=20×400m / Medium=6×5min+MP / Long=4×8min
 *   Taper 1    (wk 19):      Short=12×400m / Medium=4×5min+MP / Sat=strides
 *   Taper 2    (wk 20):      Sharpener / easy / rest / race
 *
 * Weekly skeleton (Mon–Sun, dow 0–6):
 *   Mon — Recovery (HR ≤122)
 *   Tue — NS Short  (short-rep sub-T, interval zone)
 *   Wed — Easy 8km + strides (HR ≤130)
 *   Thu — NS Medium (medium-rep sub-T, threshold zone; +MP finish in Specificity)
 *   Fri — Easy / Rest (HR ≤125)
 *   Sat — NS Long   (long-rep sub-T, threshold zone) → easy strides in Taper
 *   Sun — Long Run  (HR ≤140; +MP finish section in Specificity)
 * -------------------------------------------------------------------------- */

const PHILOSOPHY =
  'Three controlled sub-threshold sessions a week — Short (400m reps), Medium (5min reps), ' +
  'Long (8min reps) — everything else genuinely easy. The amateur adaptation of Norwegian ' +
  "double-threshold, aligned to Matt's 20-week Auckland Marathon ICS build. " +
  'Quality capped at 22% of volume; the classic failure mode is running reps too hot.';

const QUALITY_FRACTION = 0.22;

// ─── ICS-aligned long run table (1-indexed by week number) ──────────────────
// 0 = engine defers: race day (wk 20) or tune-up race (wk 16 = Devonport).
// wk 6 = down week (long = 22km), wk 10 = down week (long = 26km).
const LONG_KM: readonly number[] = [
  0,                    // [0] unused — weeks are 1-indexed
  16, 18,               // wks  1– 2  Transition
  20, 22, 24, 22,       // wks  3– 6  Base Early  (wk 6 = down week)
  28, 30, 32, 26,       // wks  7–10  Base Mid    (wk 10 = down week)
  32, 34,               // wks 11–12  Base Mid
  28, 30, 32,           // wks 13–15  Specificity (long run + MP finish)
   0,                   // wk 16      Devonport tune-up (engine defers to calendar)
  30, 32,               // wks 17–18  Specificity
  18,                   // wk 19      Taper 1
   0,                   // wk 20      Auckland Marathon — race day
];

// MP finish km embedded in the long run for Specificity+ weeks. 0 = no MP finish.
const MP_FINISH_KM: readonly number[] = [
  0, 0, 0,              // wks 0–2
  0, 0, 0, 0,           // wks 3–6
  0, 0, 0, 0,           // wks 7–10
  0, 0,                 // wks 11–12
  6, 8, 10,             // wks 13–15
  0,                    // wk 16 Devonport
  12, 12,               // wks 17–18
  5,                    // wk 19 taper
  0,                    // wk 20 race
];

// ─── Volume scale applied to params.weeklyVolumeCapKm ───────────────────────
// Max is 1.0 — the cap is a hard ceiling. Down weeks and taper weeks scale down.
const VOLUME_SCALE: readonly number[] = [
  0,                         // [0] unused
  0.80, 0.88,                // wks  1– 2  Transition
  0.92, 0.96, 1.00, 0.76,   // wks  3– 6  (wk 6 = down)
  1.00, 1.00, 1.00, 0.80,   // wks  7–10  (wk 10 = down)
  1.00, 1.00,                // wks 11–12
  1.00, 1.00, 1.00, 0.82,   // wks 13–16  (wk 16 = Devonport)
  1.00, 1.00,                // wks 17–18
  0.62, 0.38,                // wks 19–20  Taper
];

// ─── Sub-phase logic ─────────────────────────────────────────────────────────

type SubPhase =
  | 'base-early'   // wks 1-6:  20×400m / 6×5min / 4×8min
  | 'base-mid'     // wks 7-12: 24×400m / 7×5min / 5×8min
  | 'specificity'  // wks 13-18: 20×400m / 6×5min+MP / 4×8min
  | 'taper-1'      // wk 19:    12×400m / 4×5min+MP / easy strides
  | 'taper-2';     // wk 20:    sharpener / shakeouts / race

function getSubPhase(w: number): SubPhase {
  if (w <= 6) return 'base-early';
  if (w <= 12) return 'base-mid';
  if (w <= 18) return 'specificity';
  if (w === 19) return 'taper-1';
  return 'taper-2';
}

function getPhaseName(w: number): string {
  if (w <= 2) return 'Transition';
  if (w <= 12) return 'Base';
  if (w <= 18) return 'Specificity';
  return 'Taper';
}

// ─── Pace zones ──────────────────────────────────────────────────────────────

function paceZones(params: PlanParams): PaceZones {
  const mp = marathonPaceSpk(params);
  return {
    recovery: offset(mp, 90, 130),
    easy: offset(mp, 55, 95),       // strict Z1
    long: offset(mp, 50, 90),       // long run: easy, never the hero
    marathon: band(mp, 6),
    // Sub-threshold: LT1-adjacent (~2 mmol), clearly NOT LT2.
    // 'threshold' = long-rep end; 'interval' = short-rep end.
    threshold: band(mp - 8, 6),     // 8min reps / 5min reps: ~MP−8s/km
    interval: band(mp - 14, 6),     // 400m reps: ~MP−14s/km
    repetition: band(mp - 20, 8),   // sharpener (final taper) only
  };
}

// ─── Session builders ─────────────────────────────────────────────────────────

function easySession(label: string, km: number, zone: ReturnType<typeof paceZones>['easy']): SessionTarget {
  return {
    label,
    type: 'easy',
    paceZone: zone,
    distanceKmMin: Math.max(0, Math.round(km * 0.85)),
    distanceKmMax: Math.round(km * 1.15),
  };
}

function nsShortSession(sp: SubPhase, zones: PaceZones): SessionTarget {
  switch (sp) {
    case 'base-mid':
      return {
        label: 'NS Short – 24×400m sub-T (HR ≤147)',
        type: 'tempo',
        paceZone: zones.interval,
        distanceKmMin: 14,
        distanceKmMax: 16,
        notes: 'WU 2km. 24×400m at sub-threshold 45s jog. Start HR 143, build to ≤147 — do not open at the cap. CD 2km.',
      };
    case 'taper-1':
      return {
        label: 'NS Short – 12×400m sub-T (HR ≤147)',
        type: 'tempo',
        paceZone: zones.interval,
        distanceKmMin: 8,
        distanceKmMax: 10,
        notes: 'WU 2km. 12×400m at sub-threshold 45s jog. Start HR 143, build to ≤147 — do not open at the cap. CD 2km.',
      };
    case 'taper-2':
      return {
        label: 'Sharpener – WU + 6×400m at MP/strides',
        type: 'repetition',
        paceZone: zones.marathon,
        distanceKmMin: 6,
        distanceKmMax: 8,
        notes: 'WU 2km. 6×400m at goal-marathon to slightly quicker effort 200m jog. + 4 strides. CD 1km. Stay fresh — not a workout.',
      };
    default: // base-early, specificity
      return {
        label: 'NS Short – 20×400m sub-T (HR ≤147)',
        type: 'tempo',
        paceZone: zones.interval,
        distanceKmMin: 12,
        distanceKmMax: 14,
        notes: 'WU 2km. 20×400m at sub-threshold 45s jog. Start HR 143, build to ≤147 — do not open at the cap. CD 2km.',
      };
  }
}

function nsMediumSession(sp: SubPhase, zones: PaceZones): SessionTarget {
  switch (sp) {
    case 'base-mid':
      return {
        label: 'NS Medium – 7×5min sub-T (HR ≤147)',
        type: 'tempo',
        paceZone: zones.threshold,
        distanceKmMin: 13,
        distanceKmMax: 15,
        notes: 'WU 2km. 7×5min at sub-threshold (HR ≤147) 90s jog. Build into each rep; finish at the cap. CD 2km.',
      };
    case 'specificity':
      return {
        label: 'NS Medium – 6×5min sub-T + MP finish (HR ≤147)',
        type: 'tempo',
        paceZone: zones.threshold,
        distanceKmMin: 13,
        distanceKmMax: 15,
        notes: 'WU 2km. 6×5min sub-T (HR ≤147) 90s jog. Then 2–3km at goal-marathon effort (HR ~147–154). CD 2km.',
      };
    case 'taper-1':
      return {
        label: 'NS Medium – 4×5min sub-T + MP finish (HR ≤147)',
        type: 'tempo',
        paceZone: zones.threshold,
        distanceKmMin: 10,
        distanceKmMax: 12,
        notes: 'WU 2km. 4×5min sub-T (HR ≤147) 90s jog. Then 2–3km at goal-marathon effort (HR ~147–154). CD 2km.',
      };
    case 'taper-2':
      return {
        label: 'Easy 5km + strides (HR ≤130)',
        type: 'easy',
        paceZone: zones.easy,
        distanceKmMin: 4,
        distanceKmMax: 6,
        notes: '5km easy. HR ≤130. + 4 strides (15–20s fast and relaxed; ignore HR).',
      };
    default: // base-early
      return {
        label: 'NS Medium – 6×5min sub-T (HR ≤147)',
        type: 'tempo',
        paceZone: zones.threshold,
        distanceKmMin: 11,
        distanceKmMax: 13,
        notes: 'WU 2km. 6×5min at sub-threshold (HR ≤147) 90s jog. Build into each rep; finish at the cap. CD 2km.',
      };
  }
}

function nsLongSession(sp: SubPhase, zones: PaceZones): SessionTarget {
  switch (sp) {
    case 'base-mid':
      return {
        label: 'NS Long – 5×8min sub-T (HR ≤147)',
        type: 'tempo',
        paceZone: zones.threshold,
        distanceKmMin: 14,
        distanceKmMax: 16,
        notes: 'WU 2km. 5×8min at sub-threshold (HR ≤147) 90s jog. Build into each rep; finish at the cap. CD 2km.',
      };
    case 'taper-1':
      return {
        label: 'Easy 6km + strides (HR ≤130)',
        type: 'easy',
        paceZone: zones.easy,
        distanceKmMin: 5,
        distanceKmMax: 7,
        notes: '6km easy. HR ≤130. + 4 strides (15–20s fast and relaxed; ignore HR).',
      };
    case 'taper-2':
      return {
        label: 'Pre-race Primer – 4km easy + strides',
        type: 'easy',
        paceZone: zones.easy,
        distanceKmMin: 4,
        distanceKmMax: 5,
        notes: '4km easy + 4 strides + 2×30s at marathon effort. Legs primed not tired. Chest strap on.',
      };
    default: // base-early, specificity
      return {
        label: 'NS Long – 4×8min sub-T (HR ≤147)',
        type: 'tempo',
        paceZone: zones.threshold,
        distanceKmMin: 12,
        distanceKmMax: 14,
        notes: 'WU 2km. 4×8min at sub-threshold (HR ≤147) 90s jog. Build into each rep; finish at the cap. CD 2km.',
      };
  }
}

function longRunSession(w: number, longKm: number, mpKm: number, zones: PaceZones): SessionTarget {
  if (mpKm > 0) {
    const easyKm = longKm - mpKm;
    return {
      label: `Long Run ${longKm}km + last ${mpKm}km at MP`,
      type: 'long',
      paceZone: zones.long,
      distanceKmMin: Math.round(longKm * 0.97),
      distanceKmMax: Math.round(longKm * 1.03),
      notes: `${longKm}km. First ${easyKm}km easy (HR ≤140) then last ${mpKm}km at goal-marathon effort (HR ~147–154). Marathon pace from training / Devonport result.`,
    };
  }
  return {
    label: `Long Run ${longKm}km (HR ≤140)`,
    type: 'long',
    paceZone: zones.long,
    distanceKmMin: Math.round(longKm * 0.95),
    distanceKmMax: Math.round(longKm * 1.05),
    notes: `${longKm}km. Easy effort throughout, HR ≤140. Not a workout — just a longer easy run.`,
  };
}

// ─── Week renderer ───────────────────────────────────────────────────────────

function renderWeek(params: PlanParams, weekNumber: number, context?: WeekContext): WeekTemplate {
  const zones = paceZones(params);
  const cap = params.weeklyVolumeCapKm ?? 75;
  const w = Math.min(weekNumber, 20);
  const sp = getSubPhase(w);
  const scale = VOLUME_SCALE[w] ?? 1.0;
  const weekKm = cap * scale;

  const longKm = LONG_KM[w] ?? 0;
  const mpKm = MP_FINISH_KM[w] ?? 0;

  // Taper 2 (race week) — structured separately.
  if (sp === 'taper-2') {
    return applyStructuredCalendar(raceWeekTemplate(weekNumber, zones), context, zones, NS_CALENDAR);
  }

  // Week 1 uses 2 sub-T sessions (no Sat NS Long) as a transition entry.
  const threeSessions = w > 1;

  // Easy fill: Mon recovery, Wed strides, Fri rest/easy.
  // Rough per-day easy estimate for target km display (quality + long dominate).
  const qualityKm = weekKm * QUALITY_FRACTION;
  const easyKm = Math.max(weekKm - qualityKm - longKm, 0);
  const monKm = easyKm * 0.30;
  const wedKm = 8;   // ICS: fixed 8km + strides
  const friKm = easyKm * 0.25;

  const days: DayPlan[] = [
    {
      dow: 0,
      sessions: [easySession('Recovery – rest or 30–40min easy (HR ≤122)', monKm, zones.recovery)],
    },
    {
      dow: 1,
      sessions: [nsShortSession(sp, zones)],
    },
    {
      dow: 2,
      sessions: [easySession('Easy 8km + strides (HR ≤130)', wedKm, zones.easy)],
    },
    {
      dow: 3,
      sessions: [nsMediumSession(sp, zones)],
    },
    {
      dow: 4,
      sessions: [easySession('Easy / Rest (HR ≤125)', friKm, zones.easy)],
    },
    {
      dow: 5,
      sessions: [
        threeSessions
          ? nsLongSession(sp, zones)
          : easySession('Easy 6km (HR ≤130)', 6, zones.easy),
      ],
    },
    {
      dow: 6,
      sessions: [
        longKm > 0
          ? longRunSession(w, longKm, mpKm, zones)
          : { label: 'Rest', type: 'rest' as const },
      ],
    },
  ];

  const raw: WeekTemplate = {
    weekNumber,
    phaseName: getPhaseName(w),
    totalKmTarget: Math.round(weekKm),
    longRunKmTarget: longKm,
    days,
    notes: buildWeekNotes(w, sp, mpKm),
    adaptations: [],
  };

  return applyStructuredCalendar(raw, context, zones, NS_CALENDAR);
}

// Race week: wk 20 (Oct 26 – Nov 1, 2026).
function raceWeekTemplate(weekNumber: number, zones: PaceZones): WeekTemplate {
  const days: DayPlan[] = [
    { dow: 0, sessions: [{ label: 'Recovery – rest or 30–40min easy (HR ≤122)', type: 'recovery' as const, paceZone: zones.recovery }] },
    { dow: 1, sessions: [{ label: 'Sharpener – WU + 6×400m at MP/strides', type: 'repetition' as const, paceZone: zones.marathon, distanceKmMin: 6, distanceKmMax: 8, notes: 'WU 2km. 6×400m at goal-marathon to slightly quicker effort 200m jog. + 4 strides. CD 1km. Stay fresh — not a workout.' }] },
    { dow: 2, sessions: [{ label: 'Easy 6km (HR ≤130)', type: 'easy' as const, paceZone: zones.easy, distanceKmMin: 5, distanceKmMax: 7 }] },
    { dow: 3, sessions: [{ label: 'Easy 5km + strides (HR ≤130)', type: 'easy' as const, paceZone: zones.easy, distanceKmMin: 4, distanceKmMax: 6 }] },
    { dow: 4, sessions: [{ label: 'Rest / Shakeout', type: 'rest' as const }] },
    { dow: 5, sessions: [{ label: 'Pre-race Primer – 4km easy + strides', type: 'easy' as const, paceZone: zones.easy, distanceKmMin: 4, distanceKmMax: 5, notes: '4km easy + 4 strides + 2×30s at marathon effort. Legs primed not tired. Chest strap on.' }] },
    { dow: 6, sessions: [{ label: 'AUCKLAND MARATHON – RACE DAY', type: 'long' as const, paceZone: zones.marathon, distanceKmMin: 42, distanceKmMax: 43, notes: 'Goal race. Even effort to goal marathon pace; negative split if able. Fuel + hydrate to plan.' }] },
  ];
  return {
    weekNumber,
    phaseName: 'Taper',
    totalKmTarget: 30,
    longRunKmTarget: 42,
    days,
    notes: 'Race week. Stay fresh. The hay is in the barn.',
    adaptations: [],
  };
}

function buildWeekNotes(w: number, sp: SubPhase, mpKm: number): string {
  if (w <= 2) return 'Transition entry: build the habit before the load. Sub-threshold means controlled — several reps in the tank at all times.';
  if (w === 6 || w === 10) return `Down week (wk ${w}): long run reduced, quality held. Recovery without detraining.`;
  if (w === 16) return 'Devonport Half Marathon week. Sub-T sessions trimmed; the race is the stimulus.';
  if (sp === 'specificity' && mpKm > 0) return `Specificity: Thursday NS Medium now includes ${mpKm}km MP finish, and the long run has a marathon-effort close. The goal race HR zone is 147–154.`;
  if (sp === 'taper-1') return 'Taper 1: sub-T rep count halved, Saturday drops to strides. Load sheds; sharpness stays.';
  return 'Quality capped at 22% of weekly volume. The classic failure is running reps too hot — sub-threshold means controlled.';
}

// ─── Calendar config ──────────────────────────────────────────────────────────

const NS_CALENDAR: CalendarConfig = {
  taper: {
    schedule: [
      { withinDays: 14, factor: 0.85 },
      { withinDays: 7, factor: 0.6 },
    ],
    raceWeekStyle: 'short-shakeouts',
  },
  volumeScale: {
    // When life compresses a week, hold the sub-T touches and shed easy volume.
    reducedFactor: 0.65,
    travelOnlyFactor: 0.45,
    noTrainingZeroesOut: true,
  },
  tuneups: {
    enabled: true,
    taperDays: 2,
    recoveryDays: 2,
  },
  honourRecurringSessions: true,
  annotateNinjaLoops: true,
};

// ─── Entry weekly load ────────────────────────────────────────────────────────

function entryWeeklyLoadKm(level: 'beginner' | 'intermediate' | 'advanced'): number {
  switch (level) {
    case 'beginner':     return 30;
    case 'intermediate': return 45;
    case 'advanced':     return 60;
  }
}

// ─── Export ───────────────────────────────────────────────────────────────────

export const norwegianSingles: PlanEngine = {
  dojo: 'norwegian-singles',
  stateProfile: {
    // NS never digs deep fatigue holes; intervene earlier than most methods.
    // The three sub-T touches are the signature — they are protected.
    // Easy volume is the buffer that gets cut when TSB drops.
    tsbFloor: { base: -15, build: -18, peak: -18, taper: -6 },
    protectedTypes: ['tempo'],
    preferIntensityCut: false,
  },
  displayName: 'Norwegian Singles',
  philosophy: PHILOSOPHY,
  defaultProgramWeeks: 20,
  defaultLongRunCapKm: 34,
  status: 'full',
  calendarConfig: NS_CALENDAR,
  derivePaceZones: paceZones,
  renderWeek,
  entryWeeklyLoadKm,
};
