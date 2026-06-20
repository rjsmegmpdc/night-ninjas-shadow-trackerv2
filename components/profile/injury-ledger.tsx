import { ShieldAlert } from 'lucide-react';
import { getInterruptionsView } from '@/lib/analysis/interruptions';
import {
  bodyAreaVulnerability,
  type VulnerabilityLevel,
} from '@/lib/analysis/injury-vulnerability-pure';

/**
 * Phase 5 - injury & illness history ledger. A read over the Phase 4
 * interruptions: a per-body-area vulnerability score (recency + severity +
 * active state) plus the chronological history. Athlete-logged; informs only.
 */

const LEVEL_TONE: Record<VulnerabilityLevel, string> = {
  low: 'text-bone-mute border-ink-line',
  elevated: 'text-signal-warn border-signal-warn/40',
  high: 'text-signal-miss border-signal-miss/40',
};

const TYPE_LABEL: Record<string, string> = {
  injury: 'Injury',
  illness: 'Illness',
  travel: 'Travel',
  other: 'Other',
};

export async function InjuryLedger() {
  const view = await getInterruptionsView();
  const today = new Date().toISOString().slice(0, 10);
  const areas = bodyAreaVulnerability(view.all, today);
  const history = [...view.all].sort((a, b) => (a.startDate < b.startDate ? 1 : -1));

  return (
    <div className="border border-ink-line rounded-xl p-6 space-y-5">
      <div className="flex items-center gap-2">
        <ShieldAlert size={16} strokeWidth={1.5} className="text-bone-mute" />
        <div className="font-display tracking-wide-display uppercase text-xs text-bone-mute">injury &amp; illness ledger</div>
      </div>

      {history.length === 0 ? (
        <p className="text-sm text-bone-dim leading-relaxed">
          Nothing logged. Log injuries, illness or travel on the{' '}
          <a href="/journal" className="text-accent hover:text-accent-hover">Wellness page</a>{' '}
          and a per-area vulnerability read appears here.
        </p>
      ) : (
        <>
          {areas.length > 0 && (
            <div className="space-y-2">
              <div className="font-mono text-[10px] uppercase tracking-widest text-bone-mute">area vulnerability</div>
              <div className="flex flex-wrap gap-2">
                {areas.map((a) => (
                  <span
                    key={a.bodyRegion}
                    className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 font-mono text-xs ${LEVEL_TONE[a.level]}`}
                  >
                    <span className="capitalize text-bone">{a.bodyRegion}</span>
                    <span className="tabular-nums">{a.score}/10</span>
                    {a.activeNow && <span className="text-signal-miss">· active</span>}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-2">
            <div className="font-mono text-[10px] uppercase tracking-widest text-bone-mute">history</div>
            <ul className="space-y-1.5">
              {history.map((i) => (
                <li key={i.id} className="flex items-baseline justify-between gap-3 font-mono text-xs">
                  <span className="text-bone">
                    {TYPE_LABEL[i.type] ?? i.type}
                    {i.bodyRegion && <span className="text-bone-dim"> · {i.bodyRegion}</span>}
                    <span className="text-bone-mute"> · {i.severity}</span>
                  </span>
                  <span className="text-bone-mute whitespace-nowrap">
                    {i.startDate}
                    {i.endDate ? ` → ${i.endDate}` : ' · ongoing'}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  );
}
