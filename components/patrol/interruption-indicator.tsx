import Link from 'next/link';
import { AlertTriangle } from 'lucide-react';
import { durationDays, type Interruption } from '@/lib/analysis/interruptions-pure';
import { Card } from '@/components/ui/card';

/**
 * Phase 4 - compact Patrol banner listing active interruptions. Injury and
 * illness also pause automatic coach adjustments (surfaced on the coach card);
 * travel / other show here as context only. Renders nothing when there are no
 * active interruptions.
 */
export function InterruptionIndicator({ active }: { active: Interruption[] }) {
  if (active.length === 0) return null;
  const today = new Date().toISOString().slice(0, 10);
  const pausesAuto = active.some((i) => i.type === 'injury' || i.type === 'illness');

  return (
    <Card className="p-5 border-signal-warn/50 bg-signal-warn/5">
      <div className="flex items-start gap-3">
        <AlertTriangle size={20} strokeWidth={1.5} className="text-signal-warn shrink-0 mt-0.5" />
        <div className="flex-1 space-y-1">
          <div className="font-display tracking-wide-display uppercase text-xs text-bone-mute">
            wellness - active interruption{active.length === 1 ? '' : 's'}
          </div>
          <ul className="space-y-0.5">
            {active.map((i) => {
              const days = durationDays(i, today);
              return (
                <li key={i.id} className="font-mono text-sm text-bone">
                  {labelFor(i)} - {days} day{days === 1 ? '' : 's'}
                </li>
              );
            })}
          </ul>
          {pausesAuto && (
            <div className="font-mono text-xs text-signal-warn">
              Automatic coach adjustments are paused while an injury or illness is active.
            </div>
          )}
          <Link href="/journal" className="font-mono text-xs text-bone-dim hover:text-bone pt-0.5 inline-block">
            Manage on journal →
          </Link>
        </div>
      </div>
    </Card>
  );
}

function labelFor(i: Interruption): string {
  const region = i.type === 'injury' && i.bodyRegion ? ` (${i.bodyRegion})` : '';
  return `${i.type}${region} · ${i.severity}`;
}
