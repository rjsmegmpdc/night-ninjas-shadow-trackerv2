import { redirect } from 'next/navigation';

/**
 * /setup/weekly was step 6 in the original wizard.
 * The wizard was redesigned in Phase 24 — weekly pattern config moved
 * to Calendar page and is no longer part of the setup flow.
 * Redirect any lingering links (bookmarks, server action revalidatePaths)
 * to the current terminal step instead.
 */
export default function WeeklyPage() {
  redirect('/setup/life-events');
}
