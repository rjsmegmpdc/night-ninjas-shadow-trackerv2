import { PageStub } from '@/components/ui/page-stub';

export default function StrikePage() {
  return (
    <PageStub
      pageLabel="strike · personal records"
      pageTitle="Best Weeks"
      description="Your biggest training weeks ranked by composite score (volume × intensity × consistency × long-run). Surfaces what your body actually did when it was firing."
      pendingItems={[
        'Wire to topWeeks() from lib/analysis/best-week.ts',
        'Top 10 weeks ranked card list with km / runs / suffer / long-run',
        'Click-through to detail view showing every session in that week',
        'PB section: 5K / 10K / HM / Marathon best efforts (parsed from activity types)',
        'Pattern surfacing: "your strike weeks usually follow a recovery week"',
        'Annotation: tag strike weeks with retrospective notes ("had taper magic")',
      ]}
    />
  );
}
