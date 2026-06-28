import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Stepper } from '@/components/ui/stepper';
import { selectDojo } from '@/lib/actions/dojo';
import { DojoPicker } from '@/components/dojo/dojo-picker';
import { getHrAvailability } from '@/lib/analysis/hr-availability';
import { getDb, schema } from '@/lib/db';
import { eq } from 'drizzle-orm';

const STEPS = ['Welcome', 'Strava', 'Connect', 'Sync', 'Race', 'Plan', 'Life Events'];

export default async function DojoPage() {
  const db = getDb();
  const row = await db
    .select()
    .from(schema.settings)
    .where(eq(schema.settings.key, 'plan.dojo'))
    .get();
  const selectedDojo = (row?.value ?? null) as
    | 'lydiard' | 'hansons' | 'norwegian-singles' | 'daniels' | 'pfitzinger' | 'higdon' | 'polarised' | 'ultra' | 'custom' | null;

  let hrAvailability = null;
  if (selectedDojo === 'norwegian-singles') {
    const { seedNsDefaultsOnce } = await import('@/lib/store/settings');
    await seedNsDefaultsOnce();
    hrAvailability = await getHrAvailability(42);
  }

  return (
    <div className="space-y-10">
      <Stepper steps={STEPS} current={6} />

      <div className="space-y-3">
        <div className="flex items-baseline gap-4">
          <span className="nn-caps">step 06 — training plan</span>
          <span className="font-mono text-[10px] text-bone-mute border border-ink-line px-2 py-0.5">
            optional
          </span>
        </div>
        <h1 className="font-display tracking-wide-display text-5xl uppercase">
          Choose your<br />training method
        </h1>
        <p className="text-bone-dim max-w-2xl">
          Each dojo brings a different philosophy. The plan engine derives
          pace zones, weekly structure, taper, and compliance checks from
          this choice. You can change it any time from Settings.
        </p>
        <p className="font-mono text-xs text-bone-mute">
          ↳ skip this if you just want to track what you run without a structured plan
        </p>
      </div>

      <DojoPicker
        selectedDojo={selectedDojo}
        defaultLevel="intermediate"
        onSelectFormAction={selectDojo}
        hrAvailability={hrAvailability}
      />

      <div className="flex items-center justify-between border-t border-ink-line pt-6">
        <Link href="/setup/races">
          <Button variant="ghost">← Back</Button>
        </Link>
        <Link href="/setup/life-events">
          <Button variant="ghost">Skip →</Button>
        </Link>
      </div>
    </div>
  );
}
