/**
 * Plan engine types.
 *
 * Each plan (Lydiard / Hansons / Custom) implements `PlanEngine`. The engine
 * derives weekly templates from a goal + level, and the report compares
 * actual activities against the template.
 *
 * Adding a new plan = one new file implementing `PlanEngine`. No surgery
 * elsewhere.
 */

export type Dojo = 'lydiard' | 'hansons' | 'custom';
export type Level = 'beginner' | 'intermediate' | 'advanced';

/** Day-of-week. ISO order — Mon=0, Sun=6. */
export type Dow = 0 | 1 | 2 | 3 | 4 | 5 | 6;

/* ----------------------------------------------------------------------------
 * Pace zones — the universal currency. Every plan reduces to these.
 * Stored as seconds-per-km. min/max define an acceptable band.
 * -------------------------------------------------------------------------- */
export interface PaceZone {
  minSpk: number; // sec/km, faster end of band (smaller number)
  maxSpk: number; // sec/km, slower end of band
}

export interface PaceZones {
  recovery: PaceZone;
  easy: PaceZone;
  long: PaceZone;
  marathon: PaceZone;   // marathon pace (MP)
  threshold: PaceZone;  // tempo / lactate threshold
  interval: PaceZone;   // 5K-ish race pace
  repetition: PaceZone; // 1500m / mile race pace
}

/* ----------------------------------------------------------------------------
 * Session prescription — what the plan asks for on a given day.
 * -------------------------------------------------------------------------- */
export type SessionType =
  | 'recovery'     // Very easy, often optional
  | 'easy'         // Aerobic base
  | 'long'         // Long run
  | 'tempo'        // Threshold / marathon-pace effort
  | 'interval'     // VO2max work
  | 'repetition'   // Speed / form / neuromuscular
  | 'cross'        // Bike, swim, etc — duration-based
  | 'strength'     // Resistance work — duration-based
  | 'rest';        // Explicit rest day

export interface SessionTarget {
  /** Display label. e.g. "Tue tempo @ MP" */
  label: string;
  type: SessionType;
  /** Pace band for run-types. Undefined for cross/strength/rest. */
  paceZone?: PaceZone;
  /** Target distance range (km). Undefined = any. */
  distanceKmMin?: number;
  distanceKmMax?: number;
  /** Target duration range (minutes). Used for cross/strength. */
  durationMinMin?: number;
  durationMinMax?: number;
  /** Optional descriptive notes shown in tooltips. */
  notes?: string;
}

export interface DayPlan {
  dow: Dow;
  /** Multiple sessions allowed per day (e.g. easy run + strength). */
  sessions: SessionTarget[];
}

/* ----------------------------------------------------------------------------
 * WeekTemplate — what the runner is meant to do this week.
 * -------------------------------------------------------------------------- */
export interface WeekTemplate {
  weekNumber: number;       // 1-indexed, week of the program
  phaseName: string;        // "Base", "Build", "Peak", "Taper"
  totalKmTarget: number;    // weekly volume target
  longRunKmTarget: number;  // longest single run target
  days: DayPlan[];
  /** Notes shown at the top of the weekly report. */
  notes?: string;
}

/* ----------------------------------------------------------------------------
 * Plan parameters — what the user picks in the wizard.
 * -------------------------------------------------------------------------- */
export interface PlanParams {
  goalDistanceKm: number;     // 42.195 = marathon, 21.0975 = HM, 10 = 10K
  goalTimeS: number;          // target finish time, seconds
  level: Level;
  /** Optional volume cap — for users like Matt who break above 85km/wk. */
  weeklyVolumeCapKm?: number;
  /** Optional long-run cap — Hansons defaults to 26km. */
  longRunCapKm?: number;
  /** Total program length in weeks. Each plan defines its default. */
  programWeeks?: number;
  /** Date the program starts (ISO YYYY-MM-DD). Drives week numbering. */
  startDate: string;
}

/* ----------------------------------------------------------------------------
 * PlanEngine — the contract every dojo implements.
 * -------------------------------------------------------------------------- */
export interface PlanEngine {
  /** Identifier — must match the Dojo union. */
  dojo: Dojo;
  /** Human-readable name. */
  displayName: string;
  /** One-paragraph philosophy summary (shown in the dojo picker). */
  philosophy: string;
  /** Default program length in weeks if user doesn't override. */
  defaultProgramWeeks: number;
  /** Default long-run cap in km. */
  defaultLongRunCapKm: number;

  /**
   * Derive pace zones for the given parameters. The same goal may produce
   * subtly different zones across plans — Hansons tempo is at MP, Daniels
   * tempo is at lactate threshold (faster).
   */
  derivePaceZones(params: PlanParams): PaceZones;

  /**
   * Render the week template for a given week number.
   * weekNumber is 1-indexed and capped at programWeeks.
   */
  renderWeek(params: PlanParams, weekNumber: number): WeekTemplate;
}
