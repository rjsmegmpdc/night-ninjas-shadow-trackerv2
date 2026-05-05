import { PageStub } from '@/components/ui/page-stub';

export default function DojoPage() {
  return (
    <PageStub
      pageLabel="dojo · your training method"
      pageTitle="Plan Configuration"
      description="View and edit your active dojo, pace zones, weekly volume cap, and (for the Custom dojo) the per-day session pattern."
      pendingItems={[
        'Read active plan from DB (plans WHERE is_active=true)',
        'Display all 7 pace zones with formatBand() output',
        'Edit volume cap + long run cap inline with optimistic save',
        'Switch dojo: archives current plan, creates new one with copied params',
        'Custom-dojo week editor: drag-and-drop session targets per day',
        'Show 12-week preview of upcoming weeks rendered by the engine',
      ]}
    />
  );
}
