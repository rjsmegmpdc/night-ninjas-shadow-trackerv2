import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Stepper } from '@/components/ui/stepper';

const STEPS = ['Welcome', 'Strava', 'Connect', 'Sync', 'Race', 'Plan', 'Life Events'];

export default function LifeEventsPage() {
  return (
    <div className="space-y-10">
      <Stepper steps={STEPS} current={7} />

      <div className="space-y-3">
        <span className="nn-caps">step 07 — life events</span>
        <h1 className="font-display tracking-wide-display text-5xl uppercase">
          Log what life<br />
          <span className="text-accent">throws at you</span>
        </h1>
        <p className="text-bone-dim max-w-2xl">
          Three events affect your training that Strava will never know about.
          Log them in seconds — the matrix adjusts instantly.
        </p>
      </div>

      {/* Three event types */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-ink-line border border-ink-line">
        {[
          {
            icon: '⚡',
            label: 'injury',
            title: '+ Injury',
            body: 'Log a niggle, strain, or serious injury. Mark the body region and severity. The coach engine won\'t schedule load on top of it.',
          },
          {
            icon: '🤒',
            label: 'sick',
            title: '+ Sick',
            body: 'A sick day affects recovery just like a hard session. Log it so the plan doesn\'t count missed runs as skipped workouts.',
          },
          {
            icon: '✈',
            label: 'away',
            title: '+ Away',
            body: 'Travel, work trips, holidays. Set from/to dates and the training impact level. The matrix marks those days automatically.',
          },
        ].map((item) => (
          <div key={item.label} className="bg-ink-shadow p-6 space-y-3">
            <div className="flex items-center gap-3">
              <span className="font-mono text-lg" aria-hidden>{item.icon}</span>
              <span className="font-display tracking-wide-display text-xl uppercase text-bone">
                {item.title}
              </span>
            </div>
            <p className="text-bone-dim text-sm leading-relaxed">{item.body}</p>
          </div>
        ))}
      </div>

      {/* Quick log strip preview */}
      <div className="space-y-3">
        <div className="nn-caps text-bone-mute">where to find it</div>
        <div className="flex items-center gap-2 px-4 py-3 border border-ink-line bg-ink-shadow">
          <span className="nn-caps text-bone-mute text-[10px]">log</span>
          {['+ injury', '+ sick', '+ away'].map((chip) => (
            <div
              key={chip}
              className="font-mono text-[10px] uppercase tracking-widest px-2.5 py-1 border border-ink-line text-bone-mute"
            >
              {chip}
            </div>
          ))}
          <span className="font-mono text-[10px] text-bone-mute ml-2">
            ← this strip is always at the top of your Dashboard
          </span>
        </div>
        <p className="font-mono text-xs text-bone-mute">
          ↳ click any chip to open a one-line form. most entries take under 10 seconds.
        </p>
      </div>

      <div className="flex items-center justify-between border-t border-ink-line pt-6">
        <Link href="/setup/dojo">
          <Button variant="ghost">← Back</Button>
        </Link>
        <Link href="/patrol">
          <Button variant="primary" size="lg">
            Open my Dashboard →
          </Button>
        </Link>
      </div>
    </div>
  );
}
