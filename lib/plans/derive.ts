import type { PaceZone, PaceZones, PlanParams } from './types';

/* ----------------------------------------------------------------------------
 * Pace derivation utilities.
 *
 * All plans start from "marathon pace" derived from the goal time/distance,
 * then apply method-specific deltas to produce the other zones.
 * -------------------------------------------------------------------------- */

/** Marathon pace in seconds per km, derived from goal. */
export function marathonPaceSpk(params: PlanParams): number {
  // For marathon goal, MP = goalTime / goalDistance.
  // For shorter goals (HM, 10K), we extrapolate using Riegel's formula
  // to get an equivalent marathon pace.
  if (Math.abs(params.goalDistanceKm - 42.195) < 0.1) {
    return params.goalTimeS / params.goalDistanceKm;
  }
  return riegelMarathonEquivalentSpk(params);
}

/**
 * Riegel's formula: T2 = T1 * (D2/D1)^1.06
 * Used to estimate marathon time from a shorter goal.
 */
export function riegelMarathonEquivalentSpk(params: PlanParams): number {
  const t2 = params.goalTimeS * Math.pow(42.195 / params.goalDistanceKm, 1.06);
  return t2 / 42.195;
}

/** Build a band centred on `centreSpk` with +/- `bandSecHalf` width. */
export function band(centreSpk: number, bandSecHalf: number): PaceZone {
  return {
    minSpk: Math.round(centreSpk - bandSecHalf),
    maxSpk: Math.round(centreSpk + bandSecHalf),
  };
}

/** Build a band by offsetting from a reference (centre +offsetMin to +offsetMax). */
export function offset(refSpk: number, offsetMin: number, offsetMax: number): PaceZone {
  return {
    minSpk: Math.round(refSpk + offsetMin),
    maxSpk: Math.round(refSpk + offsetMax),
  };
}

/** Format seconds-per-km as M:SS. */
export function formatSpk(spk: number): string {
  if (!isFinite(spk) || spk <= 0) return '--:--';
  const m = Math.floor(spk / 60);
  const s = Math.round(spk - m * 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

/** Format seconds as H:MM:SS or M:SS. */
export function formatDuration(s: number): string {
  if (!isFinite(s) || s <= 0) return '--:--';
  const h = Math.floor(s / 3600);
  const m = Math.floor((s - h * 3600) / 60);
  const sec = Math.round(s - h * 3600 - m * 60);
  if (h > 0) {
    return `${h}:${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  }
  return `${m}:${sec.toString().padStart(2, '0')}`;
}

/** Pretty-print a PaceZone band as "M:SS — M:SS/km". */
export function formatBand(z: PaceZone): string {
  return `${formatSpk(z.minSpk)}–${formatSpk(z.maxSpk)}/km`;
}

/** Empty zones — used by the Custom dojo as a starting point. */
export function emptyPaceZones(): PaceZones {
  const zero: PaceZone = { minSpk: 0, maxSpk: 0 };
  return {
    recovery: zero,
    easy: zero,
    long: zero,
    marathon: zero,
    threshold: zero,
    interval: zero,
    repetition: zero,
  };
}
