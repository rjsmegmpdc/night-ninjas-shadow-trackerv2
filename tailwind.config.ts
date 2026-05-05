import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Night Ninjas palette — see DESIGN.md for the full token system.
        // Always reference these via CSS variables in components, not raw hex,
        // so we can theme/skin without hunting for usages.
        ink: {
          DEFAULT: 'var(--nn-ink)',          // True black, page background
          shadow: 'var(--nn-ink-shadow)',    // Surface 1 — cards, panels
          panel: 'var(--nn-ink-panel)',      // Surface 2 — elevated panels
          line: 'var(--nn-ink-line)',        // Borders, dividers
        },
        bone: {
          DEFAULT: 'var(--nn-bone)',         // Primary text
          dim: 'var(--nn-bone-dim)',         // Secondary text
          mute: 'var(--nn-bone-mute)',       // Tertiary / disabled
        },
        accent: {
          DEFAULT: 'var(--nn-accent)',         // Canonical Night Ninjas accent (orange) — PBs, current week, alerts
          hover: 'var(--nn-accent-hover)',
        },
        signal: {
          ok: 'var(--nn-signal-ok)',         // Compliance hit
          warn: 'var(--nn-signal-warn)',     // Borderline
          miss: 'var(--nn-signal-miss)',     // Compliance missed (uses accent)
        },
        matrix: {
          long: 'var(--nn-matrix-long)',         // Long runs in program matrix
          strength: 'var(--nn-matrix-strength)', // Cross/strength in program matrix
        },
      },
      fontFamily: {
        // Bebas Neue — display & wordmark match.
        // IBM Plex Sans — body & UI.
        // JetBrains Mono — paces, distances, times. Tabular figures.
        display: ['var(--font-bebas)', 'sans-serif'],
        sans: ['var(--font-plex)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-jetbrains)', 'ui-monospace', 'monospace'],
      },
      letterSpacing: {
        // Bebas needs more tracking at small sizes
        'wide-display': '0.04em',
        'wider-display': '0.08em',
      },
      borderRadius: {
        // Brutalist - no soft edges. 2px max for inputs/buttons.
        none: '0',
        sm: '2px',
        DEFAULT: '2px',
        md: '2px',
        lg: '0',
        full: '9999px', // Only for circles (avatars, stat dots)
      },
      animation: {
        'fade-in': 'fade-in 200ms ease-out',
        'slide-up': 'slide-up 240ms ease-out',
        'pulse-red': 'pulse-red 1.6s ease-in-out infinite',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-up': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'pulse-red': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.55' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
