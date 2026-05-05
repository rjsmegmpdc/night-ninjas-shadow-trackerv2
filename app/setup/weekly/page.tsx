import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Stepper } from '@/components/ui/stepper';
import { GroupRunSection } from '@/components/calendar/group-run-section';
import { NinjaLoopSection } from '@/components/calendar/ninja-loop-section';
import { CapacitySection } from '@/components/calendar/capacity-section';
import { CommitmentSection } from '@/components/calendar/commitment-section';
import { autoRefreshIfDue } from '@/lib/actions/refresh-holidays';

const STEPS = ['Welcome', 'Strava App', 'Connect', 'Dojo', 'Races', 'Weekly', 'Sync'];

export default async function WeeklyPage() {
  // Make sure holiday cache is populated before showing the Ninja Loop section.
  await autoRefreshIfDue();

  return (
    <div className="space-y-10">
      <Stepper steps={STEPS} current={6} />

      <div className="space-y-3">
        <span className="nn-caps">step 06 — weekly pattern</span>
        <h1 className="font-display tracking-wide-display text-5xl uppercase">
          What does your<br />
          week look like?
        </h1>
        <p className="text-bone-dim max-w-2xl">
          Recurring group runs, Ninja Loop on public holidays, and capacity caps.
          The plan engine slots your group runs into the week template, marks
          holidays as group-run days, and never schedules above your caps.
        </p>
      </div>

      <GroupRunSection />
      <NinjaLoopSection />
      <CapacitySection />

      <div className="space-y-3 pt-4 border-t border-ink-line">
        <h2 className="font-display tracking-wide-display text-2xl uppercase">
          Optional · known commitments
        </h2>
        <p className="text-bone-dim text-sm max-w-xl">
          Holidays, work trips, birthdays — events you already know are coming.
          You can also add these later anytime from the Calendar page.
        </p>
      </div>

      <CommitmentSection />

      <div className="flex items-center justify-between border-t border-ink-line pt-6">
        <Link href="/setup/races">
          <Button variant="ghost">← Back</Button>
        </Link>
        <Link href="/setup/sync">
          <Button variant="primary">Next: pull your history →</Button>
        </Link>
      </div>
    </div>
  );
}
