import { Card, CardLabel } from '@/components/ui/card';
import { CheckCircle2, XCircle, MinusCircle, AlertCircle, CalendarDays } from 'lucide-react';
import type { WeeklyReport, DayReport } from '@/lib/analysis/weekly-report-pure';
import {
  formatWeekRange,
  formatNextReport,
  formatGeneratedAt,
  dayAbbrevFromIso,
  complianceTextClass,
  complianceBorderClass,
  complianceLabel,
  formatVolume,
  dayStatusClass,
  dayStatusSymbol,
} from '@/lib/analysis/weekly-report-display-pure';

/* -------------------------------------------------------------------------- */
/* Props                                                                       */
/* -------------------------------------------------------------------------- */

export interface WeeklyReportHeroProps {
  /**
   * The last generated weekly report payload.
   * When null (feature disabled or no report generated yet), renders the
   * empty/prompt state — never renders nothing, never crashes.
   */
  report: WeeklyReport | null;
}

/* -------------------------------------------------------------------------- */
/* Component                                                                   */
/* -------------------------------------------------------------------------- */

/**
 * WeeklyReportHero — dominant Card shown as the first element on Patrol when
 * the weekly push report feature is enabled and a report exists.
 *
 * Rendering contract:
 *   - report !== null  → full week summary with day grid, volume, compliance
 *   - report === null  → prompt card ("Enable in Settings…")
 *
 * Design invariants:
 *   - Uses Card component throughout — no raw styled divs
 *   - Dark-mode-first: inherits nn-card tokens, uses accent/signal colours
 *   - UTC date arithmetic delegated to weekly-report-display-pure helpers
 *   - No DB imports; data flows in via prop
 */
export function WeeklyReportHero({ report }: WeeklyReportHeroProps) {
  if (!report) {
    return <WeeklyReportPromptCard />;
  }

  const textClass = complianceTextClass(report.overallCompliance);
  const borderClass = complianceBorderClass(report.overallCompliance);
  const verdictLabel = complianceLabel(report.overallCompliance);

  return (
    <Card className={`space-y-5 border ${borderClass}`}>
      {/* Header row: label + compliance verdict */}
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <CardLabel>weekly report</CardLabel>
          <div className="font-display tracking-wide-display text-2xl uppercase leading-none text-bone">
            {formatWeekRange(report.weekStart, report.weekEnd)}
          </div>
          <div className="font-mono text-xs text-bone-mute">
            {report.phase}
          </div>
        </div>
        <div className="flex-shrink-0 text-right space-y-0.5">
          <div className={`font-display tracking-wide-display text-xl uppercase leading-none ${textClass}`}>
            {verdictLabel}
          </div>
          <div className="font-mono text-[10px] text-bone-mute uppercase tracking-widest">
            overall compliance
          </div>
        </div>
      </div>

      {/* Volume + long run row */}
      <div className="flex flex-wrap gap-6 border-t border-ink-line pt-4">
        <div className="space-y-0.5">
          <div className="font-mono text-[10px] uppercase tracking-widest text-bone-mute">
            volume
          </div>
          <div className="font-mono text-sm text-bone">
            {formatVolume(report.volumeKm, report.volumeTargetKm)}
          </div>
        </div>
        <div className="space-y-0.5">
          <div className="font-mono text-[10px] uppercase tracking-widest text-bone-mute">
            long run
          </div>
          <div className={`font-mono text-sm ${report.longRunCompliant ? 'text-green-500' : 'text-red-500'}`}>
            {report.longRunCompliant ? 'Compliant' : 'Not met'}
          </div>
        </div>
      </div>

      {/* Day rows grid */}
      {report.days.length > 0 ? (
        <div className="border border-ink-line divide-y divide-ink-line">
          {report.days.map((day) => (
            <DayRow key={day.date} day={day} />
          ))}
        </div>
      ) : (
        <div className="font-mono text-xs text-bone-mute border border-ink-line p-4">
          No session data for this week.
        </div>
      )}

      {/* Footer: generated timestamp + next report */}
      <div className="flex items-center justify-between flex-wrap gap-2 border-t border-ink-line pt-3">
        <span className="font-mono text-[10px] text-bone-mute">
          Generated {formatGeneratedAt(report.generatedAt)}
        </span>
        <span className="font-mono text-[10px] text-bone-dim flex items-center gap-1">
          <CalendarDays size={10} strokeWidth={1.5} aria-hidden="true" />
          {formatNextReport(report.nextReportDate)}
        </span>
      </div>
    </Card>
  );
}

/* -------------------------------------------------------------------------- */
/* Day row sub-component                                                       */
/* -------------------------------------------------------------------------- */

function DayRow({ day }: { day: DayReport }) {
  const statusClass = dayStatusClass(day.status);
  const symbol = dayStatusSymbol(day.status);
  const abbrev = dayAbbrevFromIso(day.date);
  const isRest = day.status === 'rest';

  return (
    <div className="grid grid-cols-[44px_1fr_auto_28px] items-center gap-3 px-3 py-2.5">
      {/* Day abbreviation */}
      <span className="font-display tracking-wide-display uppercase text-xs text-bone-dim">
        {abbrev}
      </span>

      {/* Prescribed session */}
      <div className="min-w-0">
        <span className={`font-mono text-xs ${isRest ? 'text-bone-mute' : 'text-bone'}`}>
          {day.prescribed ?? 'Rest'}
        </span>
        {day.actual && (
          <span className="font-mono text-[10px] text-bone-mute ml-2">
            → {day.actual}
          </span>
        )}
        {!day.actual && !isRest && day.status !== 'compliant' && (
          <span className="font-mono text-[10px] text-bone-mute ml-2">—</span>
        )}
      </div>

      {/* Status label (screen-reader text for the symbol) */}
      <span className={`font-mono text-[10px] uppercase tracking-widest ${statusClass} hidden sm:block`}>
        {isRest ? 'rest' : day.status}
      </span>

      {/* Status symbol */}
      <span
        className={`font-mono text-sm text-right ${statusClass}`}
        aria-label={isRest ? 'rest' : day.status}
      >
        {symbol}
      </span>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Empty / prompt state                                                        */
/* -------------------------------------------------------------------------- */

function WeeklyReportPromptCard() {
  return (
    <Card className="border-ink-line space-y-3">
      <div className="flex items-center gap-2">
        <CalendarDays size={14} strokeWidth={1.5} className="text-bone-mute" aria-hidden="true" />
        <CardLabel className="text-bone-mute">weekly report</CardLabel>
      </div>
      <div className="font-mono text-sm text-bone-dim leading-relaxed">
        Enable weekly report in Settings to see your Monday summary here.
        You&apos;ll get a compliance snapshot covering every session, your volume
        vs. target, and whether the long run landed.
      </div>
      <a
        href="/settings#weekly-report"
        className="font-mono text-xs text-bone-dim hover:text-accent transition-colors"
      >
        Settings → Weekly Report →
      </a>
    </Card>
  );
}
