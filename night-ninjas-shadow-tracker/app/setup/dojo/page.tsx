import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Stepper } from '@/components/ui/stepper';
import { ALL_ENGINES } from '@/lib/plans';

const STEPS = ['Welcome', 'Strava App', 'Connect', 'Dojo', 'Races', 'Weekly', 'Sync'];

export default function DojoPage() {
  return (
    <div className="space-y-10">
      <Stepper steps={STEPS} current={4} />

      <div className="space-y-3">
        <span className="nn-caps">step 04 — pick your dojo</span>
        <h1 className="font-display tracking-wide-display text-5xl uppercase">
          Choose your<br />training method
        </h1>
        <p className="text-bone-dim max-w-2xl">
          Each dojo brings a different philosophy. The plan engine derives
          your pace zones, weekly structure, and compliance checks from
          this choice. You can change later.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {ALL_ENGINES.map((engine) => (
          <Card
            key={engine.dojo}
            className="space-y-5 hover:border-ninja-red transition-colors duration-150 cursor-pointer"
          >
            <div className="space-y-1">
              <span className="nn-caps text-bone-mute font-mono">
                {engine.dojo}
              </span>
              <h3 className="font-display tracking-wide-display text-2xl uppercase">
                {engine.displayName}
              </h3>
            </div>
            <p className="text-bone-dim text-sm leading-relaxed">
              {engine.philosophy}
            </p>
            <div className="grid grid-cols-2 gap-2 pt-3 border-t border-ink-line">
              <div>
                <div className="nn-caps text-[10px]">Default</div>
                <div className="font-mono text-sm">
                  {engine.defaultProgramWeeks} weeks
                </div>
              </div>
              <div>
                <div className="nn-caps text-[10px]">Long cap</div>
                <div className="font-mono text-sm">
                  {engine.defaultLongRunCapKm} km
                </div>
              </div>
            </div>
            <Link href={`/setup/races?dojo=${engine.dojo}`} className="block">
              <Button variant="outline" className="w-full">
                Select →
              </Button>
            </Link>
          </Card>
        ))}
      </div>

      <div className="flex items-center justify-start">
        <Link href="/setup/connect">
          <Button variant="ghost">← Back</Button>
        </Link>
      </div>
    </div>
  );
}
