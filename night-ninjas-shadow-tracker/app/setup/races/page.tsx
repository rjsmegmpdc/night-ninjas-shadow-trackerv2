import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Stepper } from '@/components/ui/stepper';
import { RaceSection } from '@/components/calendar/race-section';

const STEPS = ['Welcome', 'Strava App', 'Connect', 'Dojo', 'Races', 'Weekly', 'Sync'];

export default async function RacesPage() {
  return (
    <div className="space-y-10">
      <Stepper steps={STEPS} current={5} />

      <div className="space-y-3">
        <span className="nn-caps">step 05 — your race calendar</span>
        <h1 className="font-display tracking-wide-display text-5xl uppercase">
          What are you<br />
          training for?
        </h1>
        <p className="text-bone-dim max-w-2xl">
          Set your A-race first — the goal that drives the program. Add tune-up
          races (5K, 10K, half marathon) as confidence builders along the way.
          Race dates anchor the periodisation.
        </p>
      </div>

      <RaceSection />

      <p className="font-mono text-xs text-bone-mute max-w-xl">
        ↳ holidays, work trips, and other commitments are added in the next
        step (volume + weekly pattern). Sickness and unexpected events can be
        logged anytime from the Calendar page after setup.
      </p>

      <div className="flex items-center justify-between border-t border-ink-line pt-6">
        <Link href="/setup/dojo">
          <Button variant="ghost">← Back</Button>
        </Link>
        <Link href="/setup/weekly">
          <Button variant="primary">Next: weekly pattern →</Button>
        </Link>
      </div>
    </div>
  );
}
