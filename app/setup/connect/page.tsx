import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardLabel } from '@/components/ui/card';
import { Input, Label } from '@/components/ui/input';
import { Stepper } from '@/components/ui/stepper';

const STEPS = ['Welcome', 'Strava', 'Connect', 'Sync', 'Race', 'Plan', 'Life Events'];

export default function ConnectPage() {
  return (
    <div className="space-y-10">
      <Stepper steps={STEPS} current={3} />

      <div className="space-y-3">
        <span className="nn-caps">step 03 — credentials</span>
        <h1 className="font-display tracking-wide-display text-5xl uppercase">
          Paste your<br />credentials
        </h1>
        <p className="text-bone-dim max-w-2xl">
          From the Strava API page you just registered. Client ID goes in the
          database; Client Secret is stored in your OS keychain and never
          written to disk in plain text.
        </p>
      </div>

      <form action="/api/strava/auth" method="POST" className="space-y-6 max-w-xl">
        <Card className="space-y-5">
          <CardLabel>strava api credentials</CardLabel>
          <div>
            <Label htmlFor="clientId">Client ID</Label>
            <Input
              id="clientId"
              name="clientId"
              required
              placeholder="166708"
              autoComplete="off"
            />
            <p className="text-bone-mute text-xs mt-1.5 font-mono">
              ↳ the short number at the top of your Strava app
            </p>
          </div>
          <div>
            <Label htmlFor="clientSecret">Client Secret</Label>
            <Input
              id="clientSecret"
              name="clientSecret"
              type="password"
              required
              placeholder="••••••••••••••••••••••••••••••••••••••••"
              autoComplete="off"
            />
            <p className="text-bone-mute text-xs mt-1.5 font-mono">
              ↳ stored in OS keychain — never in plain text
            </p>
          </div>
        </Card>

        <div className="flex items-center justify-between">
          <Link href="/setup/strava-app">
            <Button variant="ghost" type="button">← Back</Button>
          </Link>
          <Button variant="primary" type="submit">
            Authorise on Strava →
          </Button>
        </div>
      </form>
    </div>
  );
}
