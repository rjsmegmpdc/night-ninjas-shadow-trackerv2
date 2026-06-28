'use client';

import { useTheme, type ColorScheme } from '@/components/theme/theme-provider';

type SchemeMeta = {
  label: string;
  tagline: string;
  swatches: { bg: string; accent: string; text: string };
};

const SCHEME_META: Record<ColorScheme, SchemeMeta> = {
  ninja: {
    label: 'Ninja',
    tagline: 'dark · brand default',
    swatches: { bg: '#0A0A0A', accent: '#FF5F00', text: '#F5F5F0' },
  },
  daybreak: {
    label: 'Daybreak',
    tagline: 'warm paper · morning',
    swatches: { bg: '#FBF8F1', accent: '#E2521A', text: '#1E1B16' },
  },
  midnight: {
    label: 'Midnight',
    tagline: 'cool blue · night use',
    swatches: { bg: '#080B12', accent: '#4FA8FF', text: '#E4E9F2' },
  },
  light: {
    label: 'Light',
    tagline: 'paper-bone · standard',
    swatches: { bg: '#F5F1E8', accent: '#FF5F00', text: '#1A1815' },
  },
};

const ORDER: ColorScheme[] = ['ninja', 'daybreak', 'midnight', 'light'];

export function ThemeSwitcher() {
  const { scheme, setScheme } = useTheme();

  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
      {ORDER.map((key) => {
        const meta = SCHEME_META[key];
        const active = scheme === key;
        return (
          <button
            key={key}
            type="button"
            onClick={() => setScheme(key)}
            aria-pressed={active}
            title={meta.tagline}
            className={
              'text-left p-3 border transition-colors space-y-2 ' +
              (active
                ? 'border-accent bg-accent/5'
                : 'border-ink-line hover:border-ink-line-bold')
            }
          >
            {/* Color swatch preview */}
            <div
              className="w-full h-7 flex items-center justify-center gap-1.5 border border-black/10"
              style={{ backgroundColor: meta.swatches.bg }}
            >
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: meta.swatches.text }} />
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: meta.swatches.accent }} />
              <span
                className="w-2.5 h-2.5 rounded-full border"
                style={{ backgroundColor: meta.swatches.bg, borderColor: meta.swatches.text + '40' }}
              />
            </div>

            {/* Label */}
            <div className="space-y-0.5">
              <div className={'nn-caps text-[10px] ' + (active ? 'text-accent' : 'text-bone')}>
                {meta.label}
              </div>
              <div className="font-mono text-[9px] text-bone-mute leading-tight">
                {meta.tagline}
              </div>
            </div>

            {active && (
              <div className="font-mono text-[9px] text-accent">✓ active</div>
            )}
          </button>
        );
      })}
    </div>
  );
}
