import { NextResponse, type NextRequest } from 'next/server';
import { syncActivities } from '@/lib/sources/strava';
import { markSetupComplete, setLastSyncAt } from '@/lib/store/settings';

/**
 * POST /api/strava/sync
 *
 * Form-submitted from the wizard's last step (with full=true) and from
 * the settings page (manual sync). On success, marks setup complete and
 * redirects to /patrol.
 */
export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const full = formData.get('full') === 'true';

  try {
    const result = await syncActivities({ full });
    await setLastSyncAt(new Date());
    await markSetupComplete();

    // First-run sync from wizard → straight to dashboard.
    return NextResponse.redirect(new URL('/patrol', req.url), { status: 303 });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'sync_failed';
    // Bounce back to sync step with error info — UI can render it.
    return NextResponse.redirect(
      new URL(`/setup/sync?error=${encodeURIComponent(msg)}`, req.url),
      { status: 303 }
    );
  }
}

/**
 * GET /api/strava/sync
 *
 * For dashboard-triggered manual syncs that want a JSON response rather
 * than a redirect.
 */
export async function GET() {
  try {
    const result = await syncActivities({ full: false });
    await setLastSyncAt(new Date());
    return NextResponse.json({ ok: true, ...result });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'sync_failed';
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
