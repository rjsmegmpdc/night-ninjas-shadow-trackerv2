'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';

/**
 * Theme system — 4 named color schemes.
 *
 * Each scheme maps directly to a data-theme value on <html>, which activates
 * the matching CSS variable block in globals.css.
 *
 * No-flash strategy: a small inline script in the root layout reads
 * localStorage BEFORE React hydrates and sets data-theme on <html>. This
 * provider takes over after hydration to handle changes.
 *
 * localStorage key: 'nn-theme' = 'ninja' | 'daybreak' | 'midnight' | 'light'
 * Default: 'ninja'
 */

export type ColorScheme = 'ninja' | 'daybreak' | 'midnight' | 'light';

export const SCHEMES: ColorScheme[] = ['ninja', 'daybreak', 'midnight', 'light'];

const STORAGE_KEY = 'nn-theme';
const DEFAULT_SCHEME: ColorScheme = 'ninja';

interface ThemeContextValue {
  scheme: ColorScheme;
  setScheme: (s: ColorScheme) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

function coerce(v: string | null): ColorScheme {
  if (v === 'ninja' || v === 'daybreak' || v === 'midnight' || v === 'light') return v;
  return DEFAULT_SCHEME;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [scheme, setSchemeState] = useState<ColorScheme>(DEFAULT_SCHEME);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    setSchemeState(coerce(stored));
  }, []);

  const setScheme = useCallback((s: ColorScheme) => {
    setSchemeState(s);
    localStorage.setItem(STORAGE_KEY, s);
    document.documentElement.setAttribute('data-theme', s);
  }, []);

  return (
    <ThemeContext.Provider value={{ scheme, setScheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    return {
      scheme: DEFAULT_SCHEME as ColorScheme,
      setScheme: () => {},
    };
  }
  return ctx;
}

/**
 * Inline script string that runs before React hydration to apply the
 * stored theme. Prevents FOUC (flash of wrong theme) by setting data-theme
 * synchronously from localStorage.
 *
 * Embed via dangerouslySetInnerHTML in the root layout's <head>.
 */
export const NO_FLASH_SCRIPT = `
(function() {
  try {
    var stored = localStorage.getItem('${STORAGE_KEY}');
    var valid = ['ninja', 'daybreak', 'midnight', 'light'];
    var scheme = (stored && valid.indexOf(stored) !== -1) ? stored : '${DEFAULT_SCHEME}';
    document.documentElement.setAttribute('data-theme', scheme);
  } catch (e) { /* defaults to Ninja via :root CSS */ }
})();
`.trim();
