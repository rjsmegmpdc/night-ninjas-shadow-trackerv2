import { redirect } from 'next/navigation';

// Old route preserved as a redirect — wizard now uses /setup/weekly for step 6.
export default function VolumeRedirect() {
  redirect('/setup/weekly');
}
