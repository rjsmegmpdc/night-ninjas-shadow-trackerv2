'use client';

import { useState, useTransition } from 'react';
import { updateWeeklyReportSettings } from '@/lib/actions/weekly-report';

/* -------------------------------------------------------------------------- */
/* Types                                                                       */
/* -------------------------------------------------------------------------- */

/**
 * DOW values follow the internal convention: Mon=0..Sun=6.
 * This is the same convention used everywhere in the analysis layer.
 */
export type WeeklyReportDow = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export interface WeeklyReportToggleProps {
  /** Initial enabled state from the server-read settings store. */
  initialEnabled: boolean;
  /** Initial report day (Mon=0..Sun=6) from the server-read settings store. */
  initialDow: WeeklyReportDow;
}

/* -------------------------------------------------------------------------- */
/* Day picker options                                                          */
/* -------------------------------------------------------------------------- */

const DOW_OPTIONS: Array<{ value: WeeklyReportDow; label: string }> = [
  { value: 0, label: 'Monday' },
  { value: 1, label: 'Tuesday' },
  { value: 2, label: 'Wednesday' },
  { value: 3, label: 'Thursday' },
  { value: 4, label: 'Friday' },
  { value: 5, label: 'Saturday' },
  { value: 6, label: 'Sunday' },
];

/* -------------------------------------------------------------------------- */
/* Component                                                                   */
/* -------------------------------------------------------------------------- */

/**
 * WeeklyReportToggle — on/off toggle + day-of-week picker for the weekly
 * push report feature.
 *
 * Pattern: optimistic useState + useTransition, identical to FirstDayOfWeekToggle.
 *
 *   - Toggle enabled/disabled: on change, calls server action immediately.
 *   - Day picker: shown only when enabled. Calls server action on change.
 *   - Both fields update together via `updateWeeklyReportSettings(enabled, dow)`.
 *   - Disabled during pending transition to prevent double-fire.
 */
export function WeeklyReportToggle({
  initialEnabled,
  initialDow,
}: WeeklyReportToggleProps) {
  const [enabled, setEnabled] = useState(initialEnabled);
  const [dow, setDow] = useState<WeeklyReportDow>(initialDow);
  const [isPending, startTransition] = useTransition();

  const handleToggle = (next: boolean) => {
    if (next === enabled) return;
    setEnabled(next);
    startTransition(() => {
      updateWeeklyReportSettings(next, dow);
    });
  };

  const handleDowChange = (nextDow: WeeklyReportDow) => {
    if (nextDow === dow) return;
    setDow(nextDow);
    startTransition(() => {
      updateWeeklyReportSettings(enabled, nextDow);
    });
  };

  return (
    <div className="space-y-4">
      {/* Enable / disable toggle */}
      <div className="flex flex-wrap gap-2" role="group" aria-label="Weekly report toggle">
        <button
          type="button"
          onClick={() => handleToggle(true)}
          disabled={isPending}
          aria-pressed={enabled}
          className={
            'px-3 py-1.5 border font-display tracking-wide-display uppercase text-xs transition-colors ' +
            (enabled
              ? 'border-accent bg-accent/10 text-accent'
              : 'border-ink-line text-bone-dim hover:border-bone-mute')
          }
        >
          On
        </button>
        <button
          type="button"
          onClick={() => handleToggle(false)}
          disabled={isPending}
          aria-pressed={!enabled}
          className={
            'px-3 py-1.5 border font-display tracking-wide-display uppercase text-xs transition-colors ' +
            (!enabled
              ? 'border-accent bg-accent/10 text-accent'
              : 'border-ink-line text-bone-dim hover:border-bone-mute')
          }
        >
          Off
        </button>
      </div>

      {/* Day picker — visible only when enabled */}
      {enabled && (
        <div className="space-y-2">
          <label
            htmlFor="weekly-report-dow"
            className="font-mono text-[10px] uppercase tracking-widest text-bone-mute"
          >
            Report day
          </label>
          <select
            id="weekly-report-dow"
            value={dow}
            onChange={(e) => handleDowChange(Number(e.target.value) as WeeklyReportDow)}
            disabled={isPending}
            className={
              'bg-ink border border-ink-line text-bone font-mono text-sm px-3 py-1.5 ' +
              'focus:outline-none focus:border-accent transition-colors ' +
              (isPending ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-bone-mute')
            }
          >
            {DOW_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
}
