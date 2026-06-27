import { Check, Minus, X } from 'lucide-react';
import type { WeekCompliance } from '@/lib/analysis/compliance';

/**
 * WeekComplianceBlock — full-width promoted compliance status for the
 * Dashboard hero. Larger and more visually prominent than WeekComplianceChip.
 *
 * Shows: large percentage, semantic colour band, hit/soft/miss breakdown.
 * Renders null when no sessions have come due yet (early Monday).
 */
export function WeekComplianceBlock({ compliance }: { compliance: WeekCompliance }) {
  const today = new Date();
  const todayDow = (today.getDay() + 6) % 7; // Mon=0..Sun=6

  let scheduled = 0;
  let hits = 0;
  let softs = 0;

  for (const day of compliance.days) {
    if (day.dow > todayDow) continue;
    if (day.sessions.length === 0) continue;
    scheduled++;

    let worst: 'hit' | 'soft' | 'miss' = 'hit';
    for (const s of day.sessions) {
      if (s.flag === 'miss' || s.flag === 'none') { worst = 'miss'; break; }
      if (s.flag !== 'ok' && worst === 'hit') worst = 'soft';
    }

    if (worst === 'hit') hits++;
    else if (worst === 'soft') softs++;
  }

  if (scheduled === 0) return null;

  const misses = scheduled - hits - softs;
  const pct = Math.round((hits / scheduled) * 100);
  const isOk = pct >= 80;
  const isSoft = pct >= 50 && pct < 80;

  const accent = isOk ? 'text-signal-ok' : isSoft ? 'text-signal-warn' : 'text-signal-miss';
  const border = isOk ? 'border-signal-ok/40' : isSoft ? 'border-signal-warn/40' : 'border-signal-miss/40';
  const bg = isOk ? 'bg-signal-ok/5' : isSoft ? 'bg-signal-warn/5' : 'bg-signal-miss/5';
  const Icon = isOk ? Check : isSoft ? Minus : X;
  const statusLabel = isOk ? 'On track' : isSoft ? 'Slipping' : 'Behind';

  return (
    <div className={`flex items-center gap-6 px-5 py-4 border ${border} ${bg}`}>
      <div className="flex items-center gap-3">
        <Icon size={22} strokeWidth={1.5} className={accent} />
        <span className={`font-display tracking-wide-display text-4xl uppercase tabular-nums ${accent}`}>
          {pct}%
        </span>
      </div>
      <div className="border-l border-ink-line pl-6 space-y-0.5">
        <div className={`font-display tracking-wide-display uppercase text-sm ${accent}`}>
          {statusLabel}
        </div>
        <div className="font-mono text-xs text-bone-mute">
          Week compliance · sessions due so far
        </div>
      </div>
      <div className="ml-auto flex items-center gap-6">
        <div className="text-center">
          <div className="font-mono tabular-nums text-signal-ok text-lg">{hits}</div>
          <div className="font-mono text-[9px] uppercase tracking-widest text-bone-mute">hit</div>
        </div>
        <div className="text-center">
          <div className="font-mono tabular-nums text-signal-warn text-lg">{softs}</div>
          <div className="font-mono text-[9px] uppercase tracking-widest text-bone-mute">partial</div>
        </div>
        <div className="text-center">
          <div className="font-mono tabular-nums text-signal-miss text-lg">{misses}</div>
          <div className="font-mono text-[9px] uppercase tracking-widest text-bone-mute">miss</div>
        </div>
      </div>
    </div>
  );
}
