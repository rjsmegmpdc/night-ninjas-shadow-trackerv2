import { PageStub } from '@/components/ui/page-stub';

export default function SettingsPage() {
  return (
    <PageStub
      pageLabel="settings · configuration"
      pageTitle="System"
      description="Re-run the wizard, manage your Strava connection, set timezone, and export or wipe local data."
      pendingItems={[
        'Re-run setup wizard (clears settings.setup_complete)',
        'Show data directory path with "open in Explorer/Finder" button',
        'Disconnect Strava — wipes keychain entries via clearStravaSecrets()',
        'Manual sync trigger with progress feedback',
        'Export full DB as JSON (one-file backup)',
        'Wipe everything (with two-step confirmation, ninja-red critical button)',
        'Display current data size, activity count, last sync timestamp',
      ]}
    />
  );
}
