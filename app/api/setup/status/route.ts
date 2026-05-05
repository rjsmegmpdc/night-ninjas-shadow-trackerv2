import { NextResponse } from 'next/server';
import { isSetupComplete, getLastSyncAt } from '@/lib/store/settings';

/**
 * GET /api/setup/status
 *
 * Returns first-run readiness info. Used by the dashboard to decide if it
 * should show a "complete setup" banner, and by the sidebar to badge the
 * settings entry when setup is incomplete.
 */
export async function GET() {
  try {
    const ready = await isSetupComplete();
    const lastSync = await getLastSyncAt();
    return NextResponse.json({
      ready,
      lastSyncAt: lastSync?.toISOString() ?? null,
    });
  } catch {
    // DB doesn't exist yet — first ever boot.
    return NextResponse.json({ ready: false, lastSyncAt: null });
  }
}
