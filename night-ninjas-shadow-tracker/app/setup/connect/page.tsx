import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardLabel } from '@/components/ui/card';
import { Input, Label } from '@/components/ui/input';
import { Stepper } from '@/components/ui/stepper';

const STEPS = ['Welcome', 'Strava App', 'Connect', 'Dojo', 'Races', 'Weekly', 'Sync'];

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
          From the Strava API page you just registered. Both fields are
          stored locally — Client ID in the database, Client Secret in your
          OS keychain.
        </p>
      </div>

      <form action="/api/strava/auth" method="POST" className="space-y-6 max-w-xl">
        <Card className="space-y-5">
          <div>
            <Label htmlFor="clientId">Client ID</Label>
            <Input
              id="clientId"
              name="clientId"
              required
              placeholder="166708"
              autoComplete="off"
            />
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
            <p className="text-bone-mute text-xs mt-2 font-mono">
              ↳ stored in OS keychain, never in plain text
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
