import { NextResponse, type NextRequest } from 'next/server';
import { exchangeCodeForTokens } from '@/lib/sources/strava';

/**
 * GET /api/strava/callback
 *
 * Strava redirects here after the user authorises. We exchange the `code`
 * for access + refresh tokens (stored in keychain), then forward the user
 * to the next wizard step.
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get('code');
  const error = searchParams.get('error');
  const scope = searchParams.get('scope');

  if (error) {
    return NextResponse.redirect(
      new URL(`/setup/connect?error=${encodeURIComponent(error)}`, req.url),
      { status: 303 }
    );
  }

  if (!code) {
    return NextResponse.redirect(
      new URL('/setup/connect?error=missing_code', req.url),
      { status: 303 }
    );
  }

  // Strava issues scopes as comma-separated string.
  // We require activity:read_all for full history sync.
  if (scope && !scope.includes('activity:read_all')) {
    return NextResponse.redirect(
      new URL('/setup/connect?error=insufficient_scope', req.url),
      { status: 303 }
    );
  }

  try {
    await exchangeCodeForTokens(code);
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'token_exchange_failed';
    return NextResponse.redirect(
      new URL(`/setup/connect?error=${encodeURIComponent(msg)}`, req.url),
      { status: 303 }
    );
  }

  return NextResponse.redirect(new URL('/setup/sync', req.url), { status: 303 });
}
