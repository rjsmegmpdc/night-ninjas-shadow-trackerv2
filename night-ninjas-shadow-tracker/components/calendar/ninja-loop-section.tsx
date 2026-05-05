import { eq, and, gte } from 'drizzle-orm';
import { Moon, RefreshCw, AlertTriangle } from 'lucide-react';
import { getDb, schema } from '@/lib/db';
import {
  enableNinjaLoopHolidays,
  disableNinjaLoopHolidays,
} from '@/lib/actions/calendar-events';
import {
  refreshNzHolidays,
  getRefreshStatus,
} from '@/lib/actions/refresh-holidays';
import { Card, CardLabel } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { upcomingHolidays } from '@/lib/data/nz-holidays';

/**
 * NinjaLoopSection — toggle that bulk-creates calendar events for every
 * upcoming NZ public holiday so the plan engine schedules a Ninja Loop
 * group run on each one.
 *
 * Source of truth: sohnemann/New-Zealand-Public-Holidays iCal on GitHub,
 * fetched and cached locally. Manual refresh button + auto-refresh on
 * 1 September each year.
 */
export async function NinjaLoopSection() {
  const today = new Date().toISOString().slice(0, 10);

  const [ninjaLoops, upcoming, status] = await Promise.all([
    getDb()
      .select()
      .from(schema.calendarEvents)
      .where(
        and(
          eq(schema.calendarEvents.eventType, 'ninja_loop_holiday'),
          gte(schema.calendarEvents.startDate, today)
        )
      )
      .all(),
    upcomingHolidays(6),
    getRefreshStatus(),
  ]);

  const enabled = ninjaLoops.length > 0;
  const lastRefresh = status.lastRefreshAt
    ? new Date(status.lastRefreshAt)
    : null;
  const lastRefreshLabel = lastRefresh
    ? formatRelative(lastRefresh)
    : 'never';

  return (
    <Card
      className={
        'space-y-5 ' + (enabled ? 'border-ninja-red/40' : 'border-ink-line')
      }
    >
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2 flex-1">
          <CardLabel
            className={
              'flex items-center gap-2 ' + (enabled ? 'text-ninja-red' : '')
            }
          >
            <Moon size={14} strokeWidth={1.5} />
            ninja loop · NZ public holidays
          </CardLabel>
          <p className="text-bone-dim text-sm leading-relaxed max-w-xl">
            When enabled, every NZ public holiday in your training window
            auto-creates a Ninja Loop group run. Tradition since 2016.
          </p>
        </div>

        <form
          action={
            enabled ? disableNinjaLoopHolidays : enableNinjaLoopHolidays
          }
        >
          <Button
            variant={enabled ? 'critical' : 'primary'}
            size="md"
            type="submit"
          >
            {enabled ? 'Disable' : 'Enable'}
          </Button>
        </form>
      </div>

      {/* Holiday source + refresh row */}
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-3 border-t border-ink-line">
        <div className="flex flex-col gap-0.5">
          <span className="nn-caps">source</span>
          <span className="font-mono text-xs text-bone-dim">
            {status.lastSource ?? 'sohnemann iCal · not yet fetched'}
          </span>
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="nn-caps">last refresh</span>
          <span className="font-mono text-xs text-bone-dim tabular-nums">
            {lastRefreshLabel}
          </span>
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="nn-caps">next auto</span>
          <span className="font-mono text-xs text-bone-dim tabular-nums">
            {status.nextAutoRefreshAt}
          </span>
        </div>
        <div className="flex-1" />
        <form action={refreshNzHolidays}>
          <Button variant="outline" size="sm" type="submit">
            <RefreshCw size={14} strokeWidth={1.5} className="mr-2" />
            Refresh from GitHub iCal
          </Button>
        </form>
      </div>

      {status.lastError && (
        <div className="flex items-start gap-2 p-3 border border-ninja-red/40 bg-ink-shadow">
          <AlertTriangle
            size={14}
            strokeWidth={1.5}
            className="text-ninja-red mt-0.5 flex-shrink-0"
          />
          <div className="font-mono text-xs text-bone-dim leading-relaxed">
            <div className="text-ninja-red mb-0.5">last refresh failed</div>
            {status.lastError}
          </div>
        </div>
      )}

      {/* Upcoming holidays preview */}
      {upcoming.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-px bg-ink-line border border-ink-line">
          {upcoming.map((h) => {
            const isScheduled = ninjaLoops.some((l) => l.startDate === h.date);
            return (
              <div key={h.date} className="bg-ink p-4">
                <div className="font-mono text-xs text-bone-mute tabular-nums">
                  {h.date}
                </div>
                <div
                  className={
                    'font-display tracking-wide-display uppercase text-sm mt-1 ' +
                    (isScheduled ? 'text-ninja-red' : 'text-bone-dim')
                  }
                >
                  {h.name}
                </div>
                <div className="font-mono text-[10px] text-bone-mute mt-1 uppercase tracking-widest">
                  {isScheduled ? '◆ scheduled' : '○ not scheduled'}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="font-mono text-xs text-bone-mute py-3">
          ↳ no holidays cached yet · click refresh to fetch from sohnemann iCal
        </div>
      )}

      <div className="font-mono text-[10px] text-bone-mute uppercase tracking-widest">
        ↳ {ninjaLoops.length} ninja loops on the calendar
      </div>
    </Card>
  );
}

function formatRelative(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const iso = date.toISOString().slice(0, 10);
  if (diffDays === 0) return `today (${iso})`;
  if (diffDays === 1) return `1 day ago (${iso})`;
  if (diffDays < 30) return `${diffDays} days ago (${iso})`;
  if (diffDays < 365)
    return `${Math.floor(diffDays / 30)} months ago (${iso})`;
  return `${Math.floor(diffDays / 365)} years ago (${iso})`;
}
