import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Stepper } from '@/components/ui/stepper';

const STEPS = ['Welcome', 'Strava', 'Connect', 'Sync', 'Race', 'Plan', 'Life Events'];

const MATRIX_HEADER = ['', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const MATRIX_ROWS = [
  { date: '9 Jun',  cells: ['8k',  '—', '12k', '—', '6k',  '22k', '—'],  state: 'past'   },
  { date: '16 Jun', cells: ['9k',  '—', '13k', '—',  '—',  '24k', '—'],  state: 'past'   },
  { date: '23 Jun', cells: ['10k', '—',  '—',  '—', '8k',   '—',  '—'],  state: 'now'    },
  { date: '30 Jun', cells: ['10k', '—', '14k', '—', '8k',  '26k', '—'],  state: 'future' },
] as const;

export default function WelcomePage() {
  return (
    <div className="space-y-12">
      <Stepper steps={STEPS} current={1} />

      <div className="grid md:grid-cols-[1fr_1fr] gap-12 items-start">

        {/* Value prop */}
        <div className="space-y-8">
          <div className="space-y-3">
            <span className="nn-caps">welcome</span>
            <h1 className="font-display tracking-wide-display text-6xl leading-none uppercase">
              Every run.<br />
              <span className="text-accent">One view.</span>
            </h1>
          </div>

          <div className="space-y-4 text-bone-dim text-base max-w-md">
            <p>
              VELOCITY builds a calendar matrix from your Strava history. Past
              runs, this week's plan, what's coming up — all on one screen the
              moment you open the app.
            </p>
            <p className="text-bone">
              The matrix is the reason to open this app. Connect Strava once
              and it appears, pre-filled with 90 days of your history.
            </p>
            <p>
              Injuries, sick days, holidays — log them in seconds. The matrix
              adjusts. No cloud. No subscription. Everything stays on this
              machine.
            </p>
          </div>

          <div className="flex items-center gap-4 pt-2">
            <Link href="/setup/strava-app">
              <Button variant="primary" size="lg">
                Connect Strava to begin →
              </Button>
            </Link>
            <span className="font-mono text-xs text-bone-mute">
              ~5 min · 7 steps
            </span>
          </div>
        </div>

        {/* Matrix preview */}
        <div className="space-y-2">
          <div className="nn-caps text-bone-mute">what you'll see</div>
          <div className="border border-ink-line overflow-hidden">
            <div className="grid grid-cols-8 gap-px bg-ink-line">
              {MATRIX_HEADER.map((h, i) => (
                <div
                  key={i}
                  className="bg-ink-shadow px-2 py-1.5 font-mono text-[10px] text-bone-mute text-center"
                >
                  {h}
                </div>
              ))}
              {MATRIX_ROWS.flatMap((row) => [
                <div
                  key={`${row.date}-label`}
                  className={
                    'bg-ink px-2 py-2 font-mono text-[10px] ' +
                    (row.state === 'now' ? 'text-accent font-semibold' : 'text-bone-mute')
                  }
                >
                  {row.date}
                  {row.state === 'now' && (
                    <div className="text-[8px] text-accent/70 uppercase tracking-widest leading-tight">
                      now
                    </div>
                  )}
                </div>,
                ...row.cells.map((c, i) => (
                  <div
                    key={`${row.date}-${i}`}
                    className={
                      'bg-ink px-2 py-2 font-mono text-[10px] text-center ' +
                      (c === '—'
                        ? 'text-ink-line-bold'
                        : row.state === 'future'
                        ? 'text-bone-mute italic'
                        : row.state === 'now'
                        ? 'text-bone'
                        : 'text-bone-dim')
                    }
                  >
                    {c}
                  </div>
                )),
              ])}
            </div>
          </div>
          <div className="font-mono text-[9px] text-bone-mute leading-relaxed">
            ↳ your actual Strava data · 90 days on first sync · plan targets shown alongside actuals
          </div>
        </div>
      </div>

      {/* Trust strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-ink-line border border-ink-line">
        {[
          { label: 'data location', value: 'this machine' },
          { label: 'cloud sync',    value: 'never'        },
          { label: 'telemetry',     value: 'disabled'     },
          { label: 'your data',     value: 'yours'        },
        ].map((cell) => (
          <div key={cell.label} className="bg-ink p-5">
            <div className="nn-caps mb-1">{cell.label}</div>
            <div className="font-display tracking-wide-display text-lg">{cell.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
