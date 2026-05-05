import { Card, CardLabel } from '@/components/ui/card';
import { Stat } from '@/components/ui/stat';
import { Button } from '@/components/ui/button';
import { Check, X, AlertCircle, Minus } from 'lucide-react';

/**
 * Patrol — this week's training loop.
 *
 * Currently rendering MOCK DATA to showcase the design system. Will wire
 * to live DB queries + plan engine output in next iteration.
 */
export default function PatrolPage() {
  return (
    <div className="px-12 py-10 max-w-7xl mx-auto space-y-10">
      {/* Header */}
      <header className="flex items-end justify-between border-b border-ink-line pb-6">
        <div className="space-y-1">
          <span className="nn-caps">this week's patrol</span>
          <h1 className="font-display tracking-wide-display text-5xl uppercase">
            Week 7 — <span className="text-ninja-red">Build Phase</span>
          </h1>
          <div className="font-mono text-bone-dim text-sm">
            28 Apr — 04 May 2026 · Hansons Marathon Method · Goal 3:30
          </div>
        </div>
        <Button variant="outline" size="sm">
          Sync now
        </Button>
      </header>

      {/* Top stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-ink-line border border-ink-line">
        <div className="bg-ink p-6">
          <Stat label="this week" value="62.4" unit="km" size="lg" accent />
          <div className="font-mono text-xs text-bone-mute mt-2">
            target 80 · 78%
          </div>
        </div>
        <div className="bg-ink p-6">
          <Stat label="long run" value="22.8" unit="km" size="lg" />
          <div className="font-mono text-xs text-bone-mute mt-2">
            target 26 · short
          </div>
        </div>
        <div className="bg-ink p-6">
          <Stat label="avg pace" value="5:24" unit="/km" size="lg" />
          <div className="font-mono text-xs text-bone-mute mt-2">
            5 sessions completed
          </div>
        </div>
        <div className="bg-ink p-6">
          <Stat label="avg HR" value="142" unit="bpm" size="lg" />
          <div className="font-mono text-xs text-bone-mute mt-2">
            zone 2 dominant
          </div>
        </div>
      </div>

      {/* Two-column body */}
      <div className="grid lg:grid-cols-[3fr_2fr] gap-8">
        {/* Sessions */}
        <Card className="space-y-5">
          <div className="flex items-center justify-between">
            <CardLabel>session compliance</CardLabel>
            <span className="font-mono text-xs text-bone-mute">
              5 of 6 logged
            </span>
          </div>
          <div className="divide-y divide-ink-line">
            {SESSIONS.map((s, i) => (
              <SessionRow key={i} session={s} />
            ))}
          </div>
        </Card>

        {/* Side column — wellness + next mission */}
        <div className="space-y-5">
          <Card className="space-y-4">
            <CardLabel>wellness · last 7 days</CardLabel>
            <div className="space-y-3">
              <WellnessBar label="Sleep quality" value={7.2} max={10} />
              <WellnessBar label="Work stress" value={6.4} max={10} reversed />
              <WellnessBar label="Energy" value={6.8} max={10} />
              <WellnessBar label="Perceived effort" value={7.5} max={10} />
            </div>
            <div className="pt-3 border-t border-ink-line font-mono text-xs text-bone-mute">
              ↳ work stress trending up. consider easy day Wed.
            </div>
          </Card>

          <Card className="border-ninja-red/40 space-y-4">
            <CardLabel className="text-ninja-red">
              tonight's mission
            </CardLabel>
            <div>
              <div className="font-display tracking-wide-display text-2xl uppercase mb-1">
                Tempo at MP
              </div>
              <div className="font-mono text-bone-dim text-sm">
                3 × 3km @ 4:53–5:03/km · 12km total
              </div>
            </div>
            <div className="font-mono text-xs text-bone-dim leading-relaxed">
              The signature Hansons workout. Hold marathon goal pace through
              all reps with 2-min jog recovery.
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

/* ---------- Session row ---------------------------------------------------- */

type Flag = 'ok' | 'fast' | 'slow' | 'short' | 'none';

interface SessionMock {
  day: string;
  label: string;
  type: string;
  km?: number;
  pace?: string;
  flag: Flag;
  flagDetail: string;
}

const SESSIONS: SessionMock[] = [
  { day: 'Mon', label: 'Easy run', type: 'easy', km: 8.4, pace: '5:51', flag: 'ok', flagDetail: 'in band' },
  { day: 'Tue', label: 'Strength workout', type: 'tempo', km: 12.1, pace: '4:48', flag: 'ok', flagDetail: 'quality session' },
  { day: 'Wed', label: 'Optional cross-train', type: 'cross', flag: 'none', flagDetail: 'rest taken' },
  { day: 'Thu', label: 'Tempo at MP', type: 'tempo', km: 11.0, pace: '5:08', flag: 'slow', flagDetail: '5s/km off MP' },
  { day: 'Fri', label: 'Easy run', type: 'easy', km: 6.2, pace: '5:42', flag: 'ok', flagDetail: 'in band' },
  { day: 'Sat', label: 'Easy run (cumulative fatigue)', type: 'easy', km: 8.7, pace: '5:38', flag: 'ok', flagDetail: 'in band' },
  { day: 'Sun', label: 'Long run', type: 'long', km: 22.8, pace: '5:31', flag: 'short', flagDetail: '3.2km short' },
];

function SessionRow({ session }: { session: SessionMock }) {
  const FlagIcon = {
    ok: Check,
    fast: AlertCircle,
    slow: AlertCircle,
    short: AlertCircle,
    none: Minus,
  }[session.flag];

  const flagColor = {
    ok: 'text-signal-ok',
    fast: 'text-signal-warn',
    slow: 'text-signal-warn',
    short: 'text-signal-miss',
    none: 'text-bone-mute',
  }[session.flag];

  return (
    <div className="py-3 grid grid-cols-[60px_1fr_120px_80px_28px] gap-4 items-center">
      <span className="font-display tracking-wide-display uppercase text-bone-dim text-sm">
        {session.day}
      </span>
      <div>
        <div className="text-bone">{session.label}</div>
        <div className="font-mono text-xs text-bone-mute mt-0.5">
          {session.flagDetail}
        </div>
      </div>
      <span className="font-mono tabular-nums text-bone">
        {session.km ? `${session.km.toFixed(1)} km` : '—'}
      </span>
      <span className="font-mono tabular-nums text-bone-dim text-sm">
        {session.pace ? `${session.pace}/km` : '—'}
      </span>
      <FlagIcon size={18} strokeWidth={1.5} className={flagColor} />
    </div>
  );
}

/* ---------- Wellness bar -------------------------------------------------- */

function WellnessBar({
  label,
  value,
  max,
  reversed = false,
}: {
  label: string;
  value: number;
  max: number;
  reversed?: boolean;
}) {
  const pct = (value / max) * 100;
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="font-mono text-xs text-bone-dim">{label}</span>
        <span className="font-mono text-sm text-bone tabular-nums">
          {value.toFixed(1)} / {max}
        </span>
      </div>
      <div className="h-1 bg-ink-line">
        <div
          className={
            reversed
              ? value > max * 0.7
                ? 'h-full bg-ninja-red'
                : 'h-full bg-bone-dim'
              : 'h-full bg-bone'
          }
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
