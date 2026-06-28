'use client';

import { Sun, Moon, Sunset, SunMedium } from 'lucide-react';
import { useTheme, type ColorScheme } from './theme-provider';
import { useState, useEffect } from 'react';

const ORDER: ColorScheme[] = ['ninja', 'daybreak', 'midnight', 'light'];

const META: Record<ColorScheme, { label: string; next: string; Icon: React.ElementType }> = {
  ninja:    { label: 'Ninja',    next: 'Daybreak', Icon: Moon },
  daybreak: { label: 'Daybreak', next: 'Midnight', Icon: Sunset },
  midnight: { label: 'Midnight', next: 'Light',    Icon: SunMedium },
  light:    { label: 'Light',    next: 'Ninja',    Icon: Sun },
};

export function ThemeToggle() {
  const { scheme, setScheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const cycle = () => {
    const idx = ORDER.indexOf(scheme);
    setScheme(ORDER[(idx + 1) % ORDER.length]);
  };

  if (!mounted) {
    return (
      <button className="p-2 text-bone-mute" aria-label="Theme toggle" type="button" disabled>
        <Moon size={16} strokeWidth={1.5} />
      </button>
    );
  }

  const { label, next, Icon } = META[scheme];

  return (
    <button
      type="button"
      onClick={cycle}
      className="p-2 text-bone-mute hover:text-bone transition-colors"
      title={`Theme: ${label} (click for ${next})`}
      aria-label={`Theme: ${label}`}
    >
      <Icon size={16} strokeWidth={1.5} />
    </button>
  );
}
