import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Stepper } from '@/components/ui/stepper';
import { RaceSection } from '@/components/calendar/race-section';

const STEPS = ['Welcome', 'Strava', 'Connect', 'Sync', 'Race', 'Plan', 'Life Events'];

export default async function RacesPage() {
  return (
    <div className="space-y-10">
      <Stepper steps={STEPS} current={5} />

      <div className="space-y-3">
        <div className="flex items-baseline gap-4">
          <span className="nn-caps">step 05 — goal race</span>
          <span className="font-mono text-[10px] text-bone-mute border border-ink-line px-2 py-0.5">
            optional
          </span>
        </div>
        <h1 className="font-display tracking-wide-display text-5xl uppercase">
          What are you<br />
          training for?
        </h1>
        <p className="text-bone-dim max-w-2xl">
          Set your A-race and the plan engine anchors periodisation to that
          date — taper week, build phases, everything. Add tune-up races
          (5K, 10K, half) as confidence builders along the way.
        </p>
        <p className="font-mono text-xs text-bone-mute">
          ↳ skip this if you're not targeting a race right now — you can add races any time from the Calendar page
        </p>
      </div>

      <RaceSection />

      <div className="flex items-center justify-between border-t border-ink-line pt-6">
        <Link href="/setup/sync">
          <Button variant="ghost">← Back</Button>
        </Link>
        <div className="flex items-center gap-3">
          <Link href="/setup/life-events">
            <Button variant="ghost">Skip →</Button>
          </Link>
          <Link href="/setup/dojo">
            <Button variant="primary">Next: Training Plan →</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
