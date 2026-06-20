'use client';

import { useRef, useState, useTransition } from 'react';
import { Dumbbell } from 'lucide-react';
import { saveStrengthPreferences } from '@/lib/actions/profile';
import type { StrengthPreferences } from '@/lib/store/settings';

/**
 * Phase 5 - auxiliary strength-work preference. Modality + target frequency.
 * The plan engine can later label/structure 'Strength' days to match.
 */
const inputClass =
  'w-full bg-ink-shadow border border-ink-line rounded-lg px-3 py-2 font-mono text-bone focus:border-accent focus:outline-none';

export function StrengthPrefsForm({ prefs }: { prefs: StrengthPreferences }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);

  const submit = () => {
    if (!formRef.current) return;
    const fd = new FormData(formRef.current);
    setSaved(false);
    startTransition(async () => {
      await saveStrengthPreferences(fd);
      setSaved(true);
    });
  };

  return (
    <div className="border border-ink-line rounded-xl p-6 space-y-4">
      <div className="flex items-center gap-2">
        <Dumbbell size={16} strokeWidth={1.5} className="text-bone-mute" />
        <div className="font-display tracking-wide-display uppercase text-xs text-bone-mute">strength preference</div>
      </div>
      <p className="text-sm text-bone-dim leading-relaxed">
        Your preferred non-running strength work and how often you want it. The plan
        labels strength days to match.
      </p>

      <form ref={formRef} onSubmit={(e) => { e.preventDefault(); submit(); }} className="space-y-4">
        <div className="grid sm:grid-cols-2 gap-3">
          <label className="space-y-1.5 block">
            <span className="font-mono text-[10px] uppercase tracking-widest text-bone-mute block">modality</span>
            <select name="modality" className={inputClass} defaultValue={prefs.modality}>
              <option value="weights">Traditional weights</option>
              <option value="pilates">Pilates</option>
              <option value="yoga">Yoga</option>
              <option value="mixed">Mixed</option>
              <option value="none">None</option>
            </select>
          </label>
          <label className="space-y-1.5 block">
            <span className="font-mono text-[10px] uppercase tracking-widest text-bone-mute block">sessions / week</span>
            <select name="targetPerWeek" className={inputClass} defaultValue={String(prefs.targetPerWeek)}>
              <option value="0">0</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
            </select>
          </label>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={isPending}
            className="px-5 py-2 bg-ink-panel border border-ink-line rounded-lg text-bone hover:border-ink-line-bold disabled:opacity-50 font-display tracking-wide-display uppercase text-sm"
          >
            {isPending ? 'Saving...' : 'Save preference'}
          </button>
          {saved && <span className="font-mono text-xs text-signal-ok">Saved.</span>}
        </div>
      </form>
    </div>
  );
}
