import { NextResponse, type NextRequest } from 'next/server';
import { setStravaClientId } from '@/lib/store/settings';
import { setStravaClientSecret } from '@/lib/store/secrets';
import { buildAuthUrl } from '@/lib/sources/strava';

/**
 * POST /api/strava/auth
 *
 * Captures Client ID + Client Secret from the connect form, persists them
 * (id → DB, secret → keychain), then redirects to Strava's OAuth page.
 */
export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const clientId = formData.get('clientId')?.toString().trim();
  const clientSecret = formData.get('clientSecret')?.toString().trim();

  if (!clientId || !clientSecret) {
    return NextResponse.json(
      { error: 'Both clientId and clientSecret are required.' },
      { status: 400 }
    );
  }

  if (!/^\d+$/.test(clientId)) {
    return NextResponse.json(
      { error: 'clientId should be all digits (Strava issues numeric IDs).' },
      { status: 400 }
    );
  }

  await setStravaClientId(clientId);
  await setStravaClientSecret(clientSecret);

  const authUrl = await buildAuthUrl();
  return NextResponse.redirect(authUrl, { status: 303 });
}
