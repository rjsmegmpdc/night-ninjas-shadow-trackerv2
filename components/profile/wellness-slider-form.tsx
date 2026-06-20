'use client';

import { useRef, useState, useTransition } from 'react';
import { HeartPulse } from 'lucide-react';
import { logWellness, type WellnessResult } from '@/lib/actions/wellness';

/**
 * Phase 5 - daily wellness slider. One-tap morning self-assessment (sleep
 * quality, sleep hours, energy) written to the journal table. The single most
 * predictive metric a runner can self-report; feeds recovery + risk reads.
 */
const inputClass =
  'w-full bg-ink-shadow border border-ink-line rounded-lg px-3 py-2 font-mono text-bone placeholder:text-bone-mute focus:border-accent focus:outline-none';

export function WellnessSliderForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<WellnessResult | null>(null);
  const [sleepQuality, setSleepQuality] = useState(7);
  const [energy, setEnergy] = useState(7);

  const today = new Date().toISOString().slice(0, 10);

  const submit = () => {
    if (!formRef.current) return;
    const fd = new FormData(formRef.current);
    setResult(null);
    startTransition(async () => {
      setResult(await logWellness(fd));
    });
  };

  return (
    <div className="border border-ink-line rounded-xl p-6 space-y-4">
      <div className="flex items-center gap-2">
        <HeartPulse size={16} strokeWidth={1.5} className="text-bone-mute" />
        <div className="font-display tracking-wide-display uppercase text-xs text-bone-mute">morning wellness</div>
      </div>

      <form ref={formRef} onSubmit={(e) => { e.preventDefault(); submit(); }} className="space-y-4">
        <div className="grid sm:grid-cols-2 gap-3">
          <label className="space-y-1.5 block">
            <span className="font-mono text-[10px] uppercase tracking-widest text-bone-mute block">date</span>
            <input name="date" type="date" className={inputClass} defaultValue={today} />
          </label>
          <label className="space-y-1.5 block">
            <span className="font-mono text-[10px] uppercase tracking-widest text-bone-mute block">sleep (hours)</span>
            <input name="sleepHours" type="number" step="0.5" min={0} max={16} className={inputClass} placeholder="7.5" />
          </label>
        </div>

        <Range name="sleepQuality" label="sleep quality" value={sleepQuality} onChange={setSleepQuality} />
        <Range name="energy" label="energy" value={energy} onChange={setEnergy} />

        <button
          type="submit"
          disabled={isPending}
          className="px-5 py-2 bg-accent text-ink rounded-lg font-display tracking-wide-display uppercase text-sm hover:bg-accent-hover disabled:opacity-50"
        >
          {isPending ? 'Saving...' : 'Log today'}
        </button>
      </form>

      {result && (
        <div
          className={
            'rounded-lg p-3 text-sm ' +
            (result.ok
              ? 'bg-signal-ok/10 border border-signal-ok/40 text-signal-ok'
              : 'bg-signal-miss/10 border border-signal-miss/40 text-signal-miss')
          }
        >
          {result.ok ? 'Logged.' : result.error}
        </div>
      )}
    </div>
  );
}

function Range({
  name, label, value, onChange,
}: { name: string; label: string; value: number; onChange: (n: number) => void }) {
  return (
    <label className="space-y-1.5 block">
      <span className="font-mono text-[10px] uppercase tracking-widest text-bone-mute flex items-center justify-between">
        <span>{label}</span>
        <span className="text-accent tabular-nums">{value}/10</span>
      </span>
      <input
        name={name}
        type="range"
        min={1}
        max={10}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-accent"
      />
    </label>
  );
}
