'use client';

import { useState, useEffect } from 'react';
import type { WeekCompliance } from '@/lib/analysis/compliance';

type PopoverKey = 'hit' | 'partial' | 'miss' | null;

const LIGHTS = [
  {
    key: 'hit' as const,
    label: 'Hit',
    dotBg: 'bg-signal-ok',
    color: 'text-signal-ok',
    explain: 'Sessions completed within target pace zone and distance.',
  },
  {
    key: 'partial' as const,
    label: 'Partial',
    dotBg: 'bg-signal-warn',
    color: 'text-signal-warn',
    explain: 'Session done but outside target pace, distance, or effort.',
  },
  {
    key: 'miss' as const,
    label: 'Miss',
    dotBg: 'bg-signal-miss',
    color: 'text-signal-miss',
    explain: 'Scheduled session not logged for this day.',
  },
];

export function ComplianceBar({ compliance }: { compliance: WeekCompliance }) {
  const [isSticky, setIsSticky] = useState(false);
  const [popover, setPopover] = useState<PopoverKey>(null);

  const today = new Date();
  const todayDow = (today.getDay() + 6) % 7;
  let scheduled = 0, hits = 0, softs = 0;
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
  const statusLabel = isOk ? 'On track' : isSoft ? 'Slipping' : 'Behind';
  const statusColor = isOk ? 'text-signal-ok' : isSoft ? 'text-signal-warn' : 'text-signal-miss';
  const borderColor = isOk ? 'border-signal-ok/30' : isSoft ? 'border-signal-warn/30' : 'border-signal-miss/30';
  const bgColor = isOk ? 'bg-signal-ok/5' : isSoft ? 'bg-signal-warn/5' : 'bg-signal-miss/5';

  const counts: Record<'hit' | 'partial' | 'miss', number> = {
    hit: hits,
    partial: softs,
    miss: misses,
  };

  useEffect(() => {
    const handler = () => setIsSticky(window.scrollY > 30);
    window.addEventListener('scroll', handler, { passive: true });
    handler();
    return () => window.removeEventListener('scroll', handler);
  }, []);

  useEffect(() => {
    if (!popover) return;
    const handler = (e: MouseEvent) => {
      if ((e.target as Element)?.closest('[data-compliance-popover]')) return;
      setPopover(null);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [popover]);

  const openDetail = () => {
    setPopover(null);
    const details = document.getElementById('coaching-detail') as HTMLDetailsElement | null;
    if (details && !details.open) details.open = true;
    const target = document.getElementById('session-compliance');
    target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="sticky top-16 z-40 -mx-4 sm:-mx-8 lg:-mx-12">
      <div className={`border-b ${borderColor} transition-colors duration-200 ${isSticky ? 'bg-ink/95 backdrop-blur-sm' : bgColor}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12">

          {isSticky ? (
            /* ── Scrolled: traffic lights ─────────────────────────────── */
            <div className="flex items-center gap-5 py-1.5">
              <span className={`font-mono text-xs tabular-nums ${statusColor}`}>{pct}%</span>
              <span className={`font-mono text-[10px] uppercase tracking-widest ${statusColor} hidden sm:inline`}>
                {statusLabel}
              </span>
              <div className="flex items-center gap-4">
                {LIGHTS.map((l, i) => {
                  const count = counts[l.key];
                  const isLast = i === LIGHTS.length - 1;
                  return (
                    <div key={l.key} className="relative">
                      <button
                        type="button"
                        onClick={() => setPopover(popover === l.key ? null : l.key)}
                        className="flex items-center gap-1.5 hover:opacity-70 transition-opacity"
                        aria-label={`${l.label}: ${count}`}
                      >
                        <span className={`w-3 h-3 rounded-full flex-shrink-0 ${l.dotBg} ${count === 0 ? 'opacity-25' : ''}`} />
                        <span className={`font-mono text-xs tabular-nums ${l.color}`}>{count}</span>
                      </button>
                      {popover === l.key && (
                        <div
                          data-compliance-popover
                          className={`absolute top-full mt-2 w-56 bg-ink-panel border border-ink-line shadow-xl z-50 p-3 space-y-2 ${isLast ? 'right-0' : 'left-0'}`}
                        >
                          <div className={`font-display tracking-wide-display uppercase text-xs ${l.color}`}>
                            {l.label} · {count} session{count !== 1 ? 's' : ''}
                          </div>
                          <p className="font-mono text-[10px] text-bone-dim leading-relaxed">{l.explain}</p>
                          <button
                            type="button"
                            onClick={openDetail}
                            className="font-mono text-[10px] text-accent hover:opacity-70 transition-opacity"
                          >
                            → session detail
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              <span className="ml-auto font-mono text-[10px] text-bone-mute hidden sm:inline">week compliance</span>
            </div>
          ) : (
            /* ── Expanded: compact info bar ───────────────────────────── */
            <div className="flex items-center gap-4 py-2.5">
              <span className={`font-display tracking-wide-display text-xl uppercase tabular-nums leading-none ${statusColor}`}>
                {pct}%
              </span>
              <span className={`font-mono text-xs ${statusColor}`}>{statusLabel}</span>
              <span className="font-mono text-[10px] text-bone-mute">· week compliance</span>
              <div className="ml-auto flex items-center gap-5">
                {LIGHTS.map((l) => {
                  const count = counts[l.key];
                  return (
                    <div key={l.key} className="flex items-center gap-1.5">
                      <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${l.dotBg} ${count === 0 ? 'opacity-25' : ''}`} />
                      <span className={`font-mono text-xs tabular-nums ${l.color}`}>{count}</span>
                      <span className="font-mono text-[9px] text-bone-mute uppercase tracking-widest hidden sm:inline">
                        {l.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
