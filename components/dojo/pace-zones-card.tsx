import { Timer } from 'lucide-react';
import { formatBand, formatSpk, formatDuration } from '@/lib/plans/derive';
import type { PaceZones } from '@/lib/plans/types';

interface ZoneSpec {
  key: keyof PaceZones;
  name: string;
  description: string;
}

const ZONE_SPECS: ZoneSpec[] = [
  { key: 'recovery',    name: 'Recovery',       description: 'Shake-out / optional easy. Very low effort.' },
  { key: 'easy',        name: 'Easy',            description: 'Mon / Fri / Sat aerobic base. Conversational.' },
  { key: 'long',        name: 'Long',            description: 'Sunday long run. Slightly faster than easy.' },
  { key: 'marathon',    name: 'Marathon (MP)',   description: 'The signature Hansons tempo. Goal race pace.' },
  { key: 'threshold',   name: 'Threshold',       description: 'Strength workout. MP minus ~10s. Comfortably hard.' },
  { key: 'interval',    name: 'Interval',        description: 'Track / 5K–10K race effort.' },
  { key: 'repetition',  name: 'Repetition',      description: '1500m–mile race pace. Short, full recovery.' },
];

export function PaceZonesCard({
  paceZones,
  goalTimeS,
  dojoName,
}: {
  paceZones: PaceZones;
  goalTimeS: number;
  dojoName: string;
}) {
  return (
    <div className="border border-ink-line rounded-xl p-6 space-y-5 max-w-3xl">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <Timer size={16} strokeWidth={1.5} className="text-accent" />
          <div className="font-display tracking-wide-display uppercase text-xs text-bone-mute">
            training paces
          </div>
        </div>
        <div className="font-mono text-[10px] text-bone-mute tabular-nums">
          goal {formatDuration(goalTimeS)} · MP {formatSpk(paceZones.marathon.minSpk)}–{formatSpk(paceZones.marathon.maxSpk)}/km
        </div>
      </div>

      <p className="text-sm text-bone-dim leading-relaxed">
        {dojoName} pace zones derived from your goal time. Hitting the right
        zone matters more than hitting a specific number.
      </p>

      <div className="divide-y divide-ink-line">
        {ZONE_SPECS.map(({ key, name, description }) => {
          const zone = paceZones[key];
          if (!zone || zone.minSpk <= 0 || zone.maxSpk <= 0) return null;
          return (
            <div key={key} className="py-3 grid grid-cols-[7rem_1fr_auto] items-baseline gap-x-4 gap-y-1">
              <div className="font-mono text-[11px] uppercase tracking-widest text-bone-dim">
                {name}
              </div>
              <div className="font-mono text-[10px] text-bone-mute hidden sm:block">
                {description}
              </div>
              <div className="font-mono text-sm text-bone tabular-nums whitespace-nowrap">
                {formatBand(zone)}
              </div>
            </div>
          );
        })}
      </div>

      <div className="font-mono text-[10px] text-bone-mute">
        Paces update automatically when your goal time changes.
      </div>
    </div>
  );
}
