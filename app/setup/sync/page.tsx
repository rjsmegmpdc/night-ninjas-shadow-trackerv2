import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardLabel } from '@/components/ui/card';
import { Stepper } from '@/components/ui/stepper';
import { SyncProgress } from '@/components/sync/sync-progress';

const STEPS = ['Welcome', 'Strava', 'Connect', 'Sync', 'Race', 'Plan', 'Life Events'];

export default async function SyncPage({
  searchParams,
}: {
  searchParams: Promise<{ jobId?: string; error?: string }>;
}) {
  const sp = await searchParams;
  const jobId = sp.jobId ? parseInt(sp.jobId, 10) : null;
  const error = sp.error;

  return (
    <div className="space-y-10">
      <Stepper steps={STEPS} current={4} />

      <div className="space-y-3">
        <span className="nn-caps">step 04 — initial sync</span>
        <h1 className="font-display tracking-wide-display text-5xl uppercase">
          Pull your<br />
          <span className="text-accent">history</span>
        </h1>
        <p className="text-bone-dim max-w-2xl">
          VELOCITY pulls your last 90 days from Strava. When it finishes, your
          calendar matrix appears — 90 days of your real training on screen.
          The full archive can be pulled from Settings any time after that.
        </p>
      </div>

      {!jobId && !error && (
        <Card className="space-y-6 max-w-xl">
          <CardLabel>about the initial sync</CardLabel>
          <ul className="space-y-3 text-bone-dim text-sm">
            {[
              'Pulls the last 90 days — enough to show your training matrix immediately.',
              'All activity types: runs, rides, swims, workouts, everything.',
              'Resumable — safe to close and re-open if the network drops or rate limit kicks in.',
              'Takes ~30 seconds for most users.',
            ].map((line) => (
              <li key={line} className="flex gap-3">
                <span className="text-accent font-mono flex-shrink-0">▸</span>
                <span>{line}</span>
              </li>
            ))}
          </ul>

          <form action="/api/strava/sync" method="POST" className="pt-2">
            <input type="hidden" name="full" value="true" />
            <Button variant="critical" size="lg" type="submit" className="w-full">
              Begin Sync — show me my matrix
            </Button>
          </form>
        </Card>
      )}

      {jobId && (
        <Card className="space-y-6 max-w-2xl">
          <CardLabel>live progress</CardLabel>
          <SyncProgress jobId={jobId} />

          <div className="pt-4 border-t border-ink-line space-y-4">
            <div className="font-mono text-xs text-bone-mute leading-relaxed">
              ↳ full archive available from Settings · race &amp; plan setup is optional — two more quick steps
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              <Link href="/setup/races">
                <Button variant="primary" size="md">Continue setup →</Button>
              </Link>
              <Link href="/patrol">
                <Button variant="ghost" size="md">Skip to Dashboard</Button>
              </Link>
            </div>
          </div>
        </Card>
      )}

      {error && (
        <Card className="space-y-4 max-w-xl border-accent/40">
          <CardLabel className="text-accent">sync failed</CardLabel>
          <div className="font-mono text-xs text-bone-dim">{error}</div>
          <form action="/api/strava/sync" method="POST">
            <input type="hidden" name="full" value="true" />
            <Button variant="outline" size="md" type="submit">Retry</Button>
          </form>
        </Card>
      )}

      <div className="flex items-center justify-start">
        <Link href="/setup/connect">
          <Button variant="ghost">← Back</Button>
        </Link>
      </div>
    </div>
  );
}
