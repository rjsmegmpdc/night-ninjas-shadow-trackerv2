'use server';

/**
 * Phase 5 - profile preferences. Saves the athlete's strength-modality
 * preference + target frequency to settings.
 */

import { revalidatePath } from 'next/cache';
import { setStrengthPreferences, type StrengthModality } from '@/lib/store/settings';

export interface ProfileResult {
  ok: boolean;
  error?: string;
}

const MODALITIES: StrengthModality[] = ['weights', 'pilates', 'yoga', 'mixed', 'none'];

export async function saveStrengthPreferences(formData: FormData): Promise<ProfileResult> {
  const modalityRaw = String(formData.get('modality') ?? 'none');
  const modality = (MODALITIES as string[]).includes(modalityRaw) ? (modalityRaw as StrengthModality) : 'none';
  const target = Math.max(0, Math.min(3, Math.round(Number(formData.get('targetPerWeek') ?? '0') || 0)));

  try {
    await setStrengthPreferences({ modality, targetPerWeek: target });
  } catch {
    return { ok: false, error: 'Could not save your preference.' };
  }
  revalidatePath('/profile');
  return { ok: true };
}
