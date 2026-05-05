import { PageStub } from '@/components/ui/page-stub';

export default function ReconPage() {
  return (
    <PageStub
      pageLabel="recon · weekly intelligence"
      pageTitle="Compliance Report"
      description="Week-by-week analysis of how your actuals matched the plan template. Identifies patterns of under-volume, pace drift, and missed sessions."
      pendingItems={[
        'Render WeekCompliance from evaluateWeek() against last 12 weeks',
        'Volume vs target line chart (recharts) — mono palette + ninja red current marker',
        'Pace adherence heatmap by day-of-week × week',
        'Suffer score trend with rolling 4-week average',
        'Auto-generated callouts ("3 missed Tuesday sessions in last 4 weeks")',
        'Export weekly recon as markdown to clipboard',
      ]}
    />
  );
}
