import { redirect } from 'next/navigation';

// Old route preserved as a redirect — wizard now uses /setup/races for step 5.
export default function GoalRedirect() {
  redirect('/setup/races');
}
