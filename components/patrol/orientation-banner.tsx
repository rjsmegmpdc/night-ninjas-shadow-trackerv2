'use client';

import { X } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { dismissPatrolOrientation } from '@/lib/actions/orientation';

export function OrientationBanner() {
  return (
    <Card active className="px-5 py-4 space-y-3">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-0.5">
          <div className="nn-caps text-accent">welcome to VELOCITY</div>
          <p className="font-display tracking-wide-display text-lg uppercase">
            What you did vs what the plan said.
          </p>
        </div>
        <form action={dismissPatrolOrientation}>
          <button
            type="submit"
            className="font-mono text-xs text-bone-mute hover:text-bone transition-colors mt-1 flex items-center gap-1"
            aria-label="Dismiss orientation"
          >
            Dismiss <X size={14} />
          </button>
        </form>
      </div>
      <div className="text-bone-dim text-sm leading-relaxed space-y-2 max-w-2xl">
        <p>
          <strong className="text-bone">Each morning:</strong> open{' '}
          <a href="/patrol" className="font-display tracking-wide-display uppercase text-accent hover:underline">Dashboard</a>{' '}
          — this screen. See your prescribed sessions, what you actually ran, and any compliance flags.
        </p>
        <p>
          <strong className="text-bone">Each Sunday:</strong> open{' '}
          <a href="/recon" className="font-display tracking-wide-display uppercase text-accent hover:underline">Analytics</a>{' '}
          — your weekly review. Volume trend, session hit rate, and patterns across the last 12 weeks.
        </p>
        <p>
          <strong className="text-bone">When life happens:</strong> open{' '}
          <a href="/calendar" className="font-display tracking-wide-display uppercase text-accent hover:underline">Calendar</a>{' '}
          — add a commitment (holiday, injury, busy week). The plan engine adapts targets so missed
          sessions show as adjusted, not failures.
        </p>
        <p className="font-mono text-xs text-bone-mute pt-1">
          ↳ need more detail? <a href="/help" className="text-bone-dim hover:text-accent underline transition-colors">Read the reference guide</a>
        </p>
      </div>
    </Card>
  );
}
