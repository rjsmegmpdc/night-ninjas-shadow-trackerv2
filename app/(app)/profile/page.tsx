import { logPageView } from '@/lib/store/instrument';
import { getAthleteProfile, getNsHrCalibration, getStrengthPreferences } from '@/lib/store/settings';
import { Vo2ProfileForm } from '@/components/vo2max/vo2-profile-form';
import { NsCalibrationCard } from '@/components/vo2max/ns-calibration-card';
import { StrengthPrefsForm } from '@/components/profile/strength-prefs-form';
import { WellnessSliderForm } from '@/components/profile/wellness-slider-form';
import { InjuryLedger } from '@/components/profile/injury-ledger';

/**
 * Phase 5 - athlete profile. The single place the athlete tells the system who
 * they are: body & calibration (reused from R2.5), HR caps, strength
 * preference, a daily wellness check-in, and the injury/illness ledger. Where
 * generic gives way to personal.
 */
export default async function ProfilePage() {
  logPageView('/profile');
  const [profile, nsCalibration, strength] = await Promise.all([
    getAthleteProfile(),
    getNsHrCalibration(),
    getStrengthPreferences(),
  ]);

  return (
    <div className="px-4 sm:px-8 lg:px-12 py-8 sm:py-10 max-w-5xl mx-auto space-y-8">
      <header className="border-b border-ink-line pb-6 space-y-1">
        <span className="nn-caps">profile - athlete</span>
        <h1 className="font-display tracking-wide-display text-4xl sm:text-5xl uppercase">Profile</h1>
        <div className="font-mono text-bone-dim text-sm max-w-2xl">
          Who you are as an athlete - calibration, preferences, and the history the
          plan reads, so generic gives way to personal.
        </div>
      </header>

      <Vo2ProfileForm profile={profile} />
      <NsCalibrationCard calibration={nsCalibration} />
      <StrengthPrefsForm prefs={strength} />
      <WellnessSliderForm />
      <InjuryLedger />
    </div>
  );
}
