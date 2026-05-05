import { eq, asc } from 'drizzle-orm';
import { Trash2, Trophy, Flag } from 'lucide-react';
import { getDb, schema } from '@/lib/db';
import { createRace, deleteRace } from '@/lib/actions/races';
import { Card, CardLabel } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input, Label } from '@/components/ui/input';
import { formatDuration } from '@/lib/plans/derive';

/**
 * RaceSection — goal race + tune-up races, with full CRUD inline.
 * Server component: queries DB directly, posts via server actions.
 */
export async function RaceSection() {
  const races = await getDb()
    .select()
    .from(schema.races)
    .orderBy(asc(schema.races.raceDate))
    .all();

  const goalRace = races.find((r) => r.isGoal);
  const tuneUps = races.filter((r) => !r.isGoal);

  return (
    <div className="space-y-6">
      {/* Goal race — single, prominent */}
      <Card className="space-y-5 border-ninja-red/40">
        <div className="flex items-center justify-between">
          <CardLabel className="text-ninja-red flex items-center gap-2">
            <Trophy size={14} strokeWidth={1.5} />
            goal race · A-race
          </CardLabel>
          {goalRace && <DeleteButton id={goalRace.id} action={deleteRace} />}
        </div>

        {goalRace ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Field label="Race" value={goalRace.name} mono={false} />
            <Field
              label="Date"
              value={goalRace.raceDate}
              mono
            />
            <Field
              label="Distance"
              value={`${goalRace.distanceKm} km`}
              mono
            />
            <Field
              label="Target"
              value={goalRace.targetTimeS ? formatDuration(goalRace.targetTimeS) : '—'}
              mono
              accent
            />
            {goalRace.level && (
              <Field label="Level" value={goalRace.level} />
            )}
          </div>
        ) : (
          <form action={createRace} className="space-y-4">
            <input type="hidden" name="isGoal" value="true" />
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="goal-name">Race name</Label>
                <Input
                  id="goal-name"
                  name="name"
                  required
                  placeholder="Auckland Marathon"
                />
              </div>
              <div>
                <Label htmlFor="goal-date">Race date</Label>
                <Input
                  id="goal-date"
                  name="raceDate"
                  type="date"
                  required
                />
              </div>
              <div>
                <Label htmlFor="goal-distance">Distance (km)</Label>
                <Input
                  id="goal-distance"
                  name="distanceKm"
                  type="number"
                  step="0.001"
                  defaultValue="42.195"
                  required
                />
              </div>
              <div>
                <Label htmlFor="goal-time">Target time</Label>
                <Input
                  id="goal-time"
                  name="targetTime"
                  type="text"
                  placeholder="3:30:00"
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="goal-level">Experience level</Label>
                <select
                  id="goal-level"
                  name="level"
                  defaultValue="intermediate"
                  className="flex h-10 w-full bg-ink-panel border border-ink-line px-3 text-sm text-bone font-mono focus-visible:outline-none focus-visible:border-ninja-red"
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
            </div>
            <Button variant="primary" type="submit">
              Set Goal Race
            </Button>
          </form>
        )}
      </Card>

      {/* Tune-up races */}
      <Card className="space-y-5">
        <div className="flex items-center justify-between">
          <CardLabel className="flex items-center gap-2">
            <Flag size={14} strokeWidth={1.5} />
            tune-up races
          </CardLabel>
          <span className="font-mono text-xs text-bone-mute">
            {tuneUps.length} scheduled
          </span>
        </div>

        {tuneUps.length > 0 && (
          <div className="divide-y divide-ink-line border-y border-ink-line">
            {tuneUps.map((r) => (
              <div
                key={r.id}
                className="py-3 grid grid-cols-[1fr_90px_70px_70px_28px] gap-4 items-center"
              >
                <div className="text-bone truncate">{r.name}</div>
                <span className="font-mono text-xs text-bone-dim tabular-nums">
                  {r.raceDate}
                </span>
                <span className="font-mono text-xs text-bone-dim tabular-nums">
                  {r.distanceKm} km
                </span>
                <span className="font-mono text-xs text-bone-dim tabular-nums">
                  {r.targetTimeS ? formatDuration(r.targetTimeS) : '—'}
                </span>
                <DeleteButton id={r.id} action={deleteRace} />
              </div>
            ))}
          </div>
        )}

        <form action={createRace} className="space-y-3 pt-2">
          <input type="hidden" name="isGoal" value="false" />
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
            <Input name="name" placeholder="Round the Bays" required className="md:col-span-2" />
            <Input name="raceDate" type="date" required />
            <Input name="distanceKm" type="number" step="0.1" placeholder="km" required />
            <Input name="targetTime" type="text" placeholder="time (opt)" />
          </div>
          <Button variant="outline" size="sm" type="submit">
            + Add tune-up
          </Button>
        </form>
      </Card>
    </div>
  );
}

function Field({
  label,
  value,
  mono = true,
  accent = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
  accent?: boolean;
}) {
  return (
    <div>
      <div className="nn-caps mb-1">{label}</div>
      <div
        className={
          (mono ? 'font-mono tabular-nums ' : 'font-sans ') +
          'text-base ' +
          (accent ? 'text-ninja-red' : 'text-bone')
        }
      >
        {value}
      </div>
    </div>
  );
}

function DeleteButton({
  id,
  action,
}: {
  id: number;
  action: (fd: FormData) => Promise<void>;
}) {
  return (
    <form action={action}>
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        className="text-bone-mute hover:text-ninja-red transition-colors p-1"
        title="Delete"
      >
        <Trash2 size={16} strokeWidth={1.5} />
      </button>
    </form>
  );
}
