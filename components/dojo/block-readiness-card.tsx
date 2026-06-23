import { CalendarCheck } from 'lucide-react';
import type { WeekTemplate } from '@/lib/plans/types';

const DOW_SHORT = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const;

const SESSION_ACCENT: Record<string, string> = {
  easy:       'bg-session-easy',
  long:       'bg-session-long',
  tempo:      'bg-session-tempo',
  interval:   'bg-session-interval',
  repetition: 'bg-session-interval',
  recovery:   'bg-session-easy opacity-50',
  cross:      'bg-session-cross',
  strength:   'bg-session-cross',
  rest:       'bg-ink-shadow',
};

export function BlockReadinessCard({
  week1Template,
  daysUntilStart,
  entryKmRequired,
  dojoName,
}: {
  week1Template: WeekTemplate;
  daysUntilStart: number;
  entryKmRequired: number;
  dojoName: string;
}) {
  const blockStartText =
    daysUntilStart > 1
      ? `Block starts in ${daysUntilStart} days`
      : daysUntilStart === 1
        ? 'Block starts tomorrow'
        : daysUntilStart === 0
          ? 'Block starts today'
          : `Week ${Math.floor(-daysUntilStart / 7) + 1} underway`;

  return (
    <div className="border border-ink-line rounded-xl p-6 space-y-5 max-w-3xl">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <CalendarCheck size={16} strokeWidth={1.5} className="text-accent" />
          <div className="font-display tracking-wide-display uppercase text-xs text-bone-mute">
            week 1 preview
          </div>
        </div>
        <div className="font-mono text-[10px] text-accent">{blockStartText}</div>
      </div>

      <p className="text-sm text-bone-dim leading-relaxed">
        {dojoName} week 1 — {week1Template.totalKmTarget} km target.
        Entry recommendation: ≥{entryKmRequired} km/wk coming in.
      </p>

      {/* 7-day session strip */}
      <div className="grid grid-cols-7 gap-px">
        {DOW_SHORT.map((dayLabel, dow) => {
          const dayPlan = week1Template.days.find((d) => d.dow === dow);
          const sess = dayPlan?.sessions.find((s) => s.type !== 'rest') ?? dayPlan?.sessions[0];
          const type = sess?.type ?? 'rest';
          const accent = SESSION_ACCENT[type] ?? 'bg-ink-shadow';
          return (
            <div key={dow} className="flex flex-col items-center gap-1">
              <div className="font-mono text-[9px] text-bone-mute">{dayLabel}</div>
              <div
                className={`w-full h-8 rounded ${accent} flex items-center justify-center`}
                title={sess?.label ?? 'Rest'}
              >
                <span className="font-mono text-[8px] text-bone/60 uppercase tracking-wider px-0.5 text-center leading-tight">
                  {type === 'rest' ? '—' : type.slice(0, 3)}
                </span>
              </div>
              {sess?.distanceKmMax != null && (
                <div className="font-mono text-[8px] text-bone-mute">
                  {sess.distanceKmMax}k
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-2 gap-px bg-ink-line border border-ink-line rounded-lg overflow-hidden">
        <div className="bg-ink p-3">
          <div className="font-display text-xl text-bone tabular-nums leading-none">
            {week1Template.totalKmTarget} km
          </div>
          <div className="font-mono text-[9px] uppercase tracking-widest text-bone-mute mt-1">
            week 1 volume target
          </div>
        </div>
        <div className="bg-ink p-3">
          <div className="font-display text-xl text-bone tabular-nums leading-none">
            ≥{entryKmRequired} km
          </div>
          <div className="font-mono text-[9px] uppercase tracking-widest text-bone-mute mt-1">
            recommended entry load
          </div>
        </div>
      </div>

      <div className="font-mono text-[10px] text-bone-mute leading-relaxed">
        ↳ Ramp detail on the Dashboard. Adjust per-block volume cap above if needed.
      </div>
    </div>
  );
}
