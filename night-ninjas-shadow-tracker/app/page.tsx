import { redirect } from 'next/navigation';
import { isSetupComplete } from '@/lib/store/settings';

export default async function RootPage() {
  // First-run gate. If the wizard hasn't completed, send users there.
  // Otherwise drop them straight onto Patrol (the dashboard).
  const ready = await isSetupComplete();
  redirect(ready ? '/patrol' : '/setup');
}
