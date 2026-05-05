import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardLabel } from '@/components/ui/card';
import { Stepper } from '@/components/ui/stepper';

const STEPS = ['Welcome', 'Strava App', 'Connect', 'Dojo', 'Races', 'Weekly', 'Sync'];

export default function SyncPage() {
  return (
    <div className="space-y-10">
      <Stepper steps={STEPS} current={7} />

      <div className="space-y-3">
        <span className="nn-caps">step 07 — initial sync</span>
        <h1 className="font-display tracking-wide-display text-5xl uppercase">
          Pull your<br />history
        </h1>
        <p className="text-bone-dim max-w-2xl">
          Shadow Tracker will fetch every activity from your Strava account
          and store it locally. This runs once now; from then on, only
          incremental syncs.
        </p>
      </div>

      <Card className="space-y-6 max-w-xl">
        <div>
          <CardLabel>about the sync</CardLabel>
        </div>
        <ul className="space-y-3 text-bone-dim text-sm">
          <li className="flex gap-3">
            <span className="text-ninja-red font-mono">▸</span>
            <span>Pages through your activities 200 at a time.</span>
          </li>
          <li className="flex gap-3">
            <span className="text-ninja-red font-mono">▸</span>
            <span>
              Strava limits API calls to 200 per 15 minutes — we auto-pause if
              we hit that cap.
            </span>
          </li>
          <li className="flex gap-3">
            <span className="text-ninja-red font-mono">▸</span>
            <span>
              Typical first sync for an established runner: 30 seconds to a
              few minutes.
            </span>
          </li>
          <li className="flex gap-3">
            <span className="text-ninja-red font-mono">▸</span>
            <span>
              Activity data is stored in <span className="font-mono text-bone">shadow-tracker.db</span> in
              your user data directory. Nothing leaves this machine.
            </span>
          </li>
        </ul>

        <form action="/api/strava/sync" method="POST" className="pt-2">
          <input type="hidden" name="full" value="true" />
          <Button variant="critical" size="lg" type="submit" className="w-full">
            Begin Sync
          </Button>
        </form>
      </Card>

      <div className="flex items-center justify-start">
        <Link href="/setup/volume">
          <Button variant="ghost">← Back</Button>
        </Link>
      </div>
    </div>
  );
}
