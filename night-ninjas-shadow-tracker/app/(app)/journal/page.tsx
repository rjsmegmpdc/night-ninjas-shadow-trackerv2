import { PageStub } from '@/components/ui/page-stub';

export default function JournalPage() {
  return (
    <PageStub
      pageLabel="journal · wellness instrumentation"
      pageTitle="Daily Log"
      description="Track sleep quality, work stress, energy and perceived effort daily. The instrumentation that explains why your body breaks at certain volumes — and lets you predict it next time."
      pendingItems={[
        'Today\'s entry form: 1–10 sliders for sleep / stress / energy / RPE',
        'Optional notes textarea',
        'Calendar heatmap: last 90 days × 4 metrics',
        'Correlation panel: stress × volume → injury risk indicator',
        'Health-source overlay (when Garmin/Coros lands in Phase 3): HRV, body battery, resting HR',
        'Export journal to CSV / markdown for retrospective writing',
      ]}
    />
  );
}
