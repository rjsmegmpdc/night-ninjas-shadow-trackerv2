import { hansons } from './hansons';
import { lydiard } from './lydiard';
import { custom } from './custom';
import type { Dojo, PlanEngine } from './types';

/**
 * Registry of all available plan engines, keyed by Dojo identifier.
 * To add a new plan: implement PlanEngine, then add the import + entry here.
 */
export const ENGINES: Record<Dojo, PlanEngine> = {
  hansons,
  lydiard,
  custom,
};

export function getEngine(dojo: Dojo): PlanEngine {
  return ENGINES[dojo];
}

export const ALL_ENGINES: PlanEngine[] = [hansons, lydiard, custom];

export * from './types';
export * from './derive';
