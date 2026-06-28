import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Stepper } from '@/components/ui/stepper';
import { CopyButton } from '@/components/setup/copy-button';

const STEPS = ['Welcome', 'Strava', 'Connect', 'Sync', 'Race', 'Plan', 'Life Events'];

export default function StravaAppPage() {
  return (
    <div className="space-y-10">
      <Stepper steps={STEPS} current={2} />

      <div className="space-y-3">
        <span className="nn-caps">step 02 — strava setup</span>
        <h1 className="font-display tracking-wide-display text-5xl uppercase">
          Register your<br />Strava app
        </h1>
        <p className="text-bone-dim max-w-2xl">
          Strava requires each user to register their own developer app — a
          one-time, two-minute process. You'll end up with a Client ID and
          Client Secret to paste on the next screen. Follow the three steps
          below exactly.
        </p>
      </div>

      {/* Step 1 — Open Strava */}
      <div className="space-y-4 border-l-2 border-accent pl-6">
        <div className="flex items-baseline gap-3">
          <span className="font-mono text-accent text-sm font-medium">01</span>
          <h2 className="font-display tracking-wide-display text-2xl uppercase">
            Open the Strava API page
          </h2>
        </div>
        <p className="text-bone-dim text-sm">
          Click the button below. You'll land on Strava's API settings.
          Log in to Strava first if you aren't already.
        </p>
        <a
          href="https://www.strava.com/settings/api"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button variant="primary" size="md">
            Open strava.com/settings/api →
          </Button>
        </a>
        <p className="font-mono text-[10px] text-bone-mute">
          ↳ if you see "Create &amp; Manage Your App", click it to create your first app
        </p>
      </div>

      {/* Step 2 — Fill in the form */}
      <div className="space-y-4 border-l-2 border-ink-line pl-6">
        <div className="flex items-baseline gap-3">
          <span className="font-mono text-bone-dim text-sm font-medium">02</span>
          <h2 className="font-display tracking-wide-display text-2xl uppercase">
            Fill in the registration form
          </h2>
        </div>
        <p className="text-bone-dim text-sm">
          Most fields are decorative — Strava doesn't verify them for personal
          apps. Fill them in as shown. The Authorization Callback Domain is the
          only one that must be exact.
        </p>

        <div className="border border-ink-line bg-ink-shadow p-5 space-y-3 max-w-xl">
          <div className="nn-caps text-bone-mute mb-3">what to enter in the strava form</div>

          {/* Regular fields */}
          {[
            { field: 'Application Name', value: 'VELOCITY',              note: 'or anything — decorative'       },
            { field: 'Category',          value: 'Choose any',            note: 'not verified by Strava'         },
            { field: 'Club',              value: 'Leave blank',           note: 'optional'                       },
            { field: 'Website',           value: 'http://localhost:3000', note: 'or anything — not verified'     },
          ].map(({ field, value, note }) => (
            <div key={field} className="grid grid-cols-[170px_1fr] gap-3 items-baseline">
              <span className="font-mono text-[11px] text-bone-mute">{field}</span>
              <div>
                <code className="font-mono text-[11px] text-bone">{value}</code>
                <span className="font-mono text-[10px] text-bone-mute ml-2">· {note}</span>
              </div>
            </div>
          ))}

          {/* Authorization Callback Domain — highlighted */}
          <div className="mt-3 pt-3 border-t border-ink-line-bold">
            <div className="flex items-start gap-3 p-3 border border-accent/50 bg-accent/5">
              <span className="font-mono text-accent text-sm font-bold mt-0.5 flex-shrink-0">!</span>
              <div className="space-y-2 flex-1 min-w-0">
                <div className="font-mono text-[11px] text-accent font-semibold uppercase tracking-widest">
                  Authorization Callback Domain
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <code className="font-mono text-sm text-bone bg-ink px-2.5 py-1 border border-ink-line">
                    localhost
                  </code>
                  <CopyButton value="localhost" label="Copy" />
                </div>
                <p className="font-mono text-[10px] text-bone-mute leading-relaxed">
                  Exactly the word <code className="text-bone">localhost</code> —
                  no port number, no http://, no trailing slash.
                  This is where most people go wrong.
                </p>
              </div>
            </div>
          </div>
        </div>

        <p className="text-bone-dim text-sm">
          Check the API Agreement box and click the submit button.
        </p>
      </div>

      {/* Step 3 — Find your credentials */}
      <div className="space-y-4 border-l-2 border-ink-line pl-6">
        <div className="flex items-baseline gap-3">
          <span className="font-mono text-bone-dim text-sm font-medium">03</span>
          <h2 className="font-display tracking-wide-display text-2xl uppercase">
            Note your credentials
          </h2>
        </div>
        <p className="text-bone-dim text-sm">
          After submitting, Strava shows your new app. You need two values from
          that screen — have them ready before clicking the button below.
        </p>

        <div className="border border-ink-line bg-ink-shadow p-5 space-y-4 max-w-xl">
          <div className="nn-caps text-bone-mute mb-1">what to look for on strava</div>

          <div className="border border-ink-line bg-ink p-3 space-y-1">
            <div className="font-mono text-[10px] text-bone-mute uppercase tracking-widest">
              Client ID
            </div>
            <div className="font-mono text-xl text-bone tabular-nums">166708</div>
            <div className="font-mono text-[10px] text-bone-mute">
              ↳ a short number — usually 5–7 digits, shown at the top of your app
            </div>
          </div>

          <div className="border border-ink-line bg-ink p-3 space-y-1">
            <div className="font-mono text-[10px] text-bone-mute uppercase tracking-widest">
              Client Secret
            </div>
            <div className="font-mono text-sm text-bone-dim tracking-widest">
              a3f8d2e1b9c7f4a2d8e3b1c9f6…
            </div>
            <div className="font-mono text-[10px] text-bone-mute">
              ↳ a long alphanumeric string — copy the whole thing
            </div>
          </div>

          <div className="font-mono text-[10px] text-bone-mute pt-2 border-t border-ink-line leading-relaxed">
            ↳ the secret is stored in your OS keychain — it never leaves this machine in plain text
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-ink-line pt-6">
        <Link href="/setup">
          <Button variant="ghost">← Back</Button>
        </Link>
        <Link href="/setup/connect">
          <Button variant="primary">I have my credentials →</Button>
        </Link>
      </div>
    </div>
  );
}
