# DESIGN.md

The Night Ninjas — Shadow Tracker design system. Single source of truth for
brand tokens, type, motion, and aesthetic intent. If a component doesn't
match this document, the component is wrong.

---

## Aesthetic intent

Brutalist-industrial with a stealth / spec-ops veneer. The product is for
people who train when no one is watching — dawn runs, dark winter sessions,
the discipline of showing up. The UI honours that mood:

- Hard edges, almost no rounding (2px max, only on inputs and buttons)
- Heavy weight contrast in type (display very heavy, body normal)
- Monochrome dominance — the screen is mostly black and bone
- Red is surgical. It marks PBs, current state, and missed compliance.
  Never decorative. Never used for "fun."
- Data is tabular, mono-spaced, terminal-like
- Motion is fast and decisive (150–240ms). No springs. No bounce.

What the product is NOT:

- Not Strava-cheery (kudos, fire emojis, gradients)
- Not Apple-Fitness-medical (rings, soft pastels)
- Not Whoop-clinical (deep blue, lots of percentages with no character)

---

## Colour tokens

All colours live as CSS custom properties on `:root` in `app/globals.css`.
Components reference them through Tailwind classes mapped to these tokens
in `tailwind.config.ts`. Never use raw hex in components.

### Ink (backgrounds + structure)

| Token              | Hex       | Usage                                |
| ------------------ | --------- | ------------------------------------ |
| `--nn-ink`         | `#0A0A0A` | Page background — true black-leaning |
| `--nn-ink-shadow`  | `#121212` | Surface 1 — cards, panels            |
| `--nn-ink-panel`   | `#1A1A1A` | Surface 2 — elevated panels, modals  |
| `--nn-ink-line`    | `#262626` | Borders, dividers, hairlines         |

### Bone (text)

| Token              | Hex       | Usage                                |
| ------------------ | --------- | ------------------------------------ |
| `--nn-bone`        | `#F5F5F0` | Primary text — body, headings        |
| `--nn-bone-dim`    | `#A3A3A0` | Secondary text — labels, captions    |
| `--nn-bone-mute`   | `#5C5C5A` | Tertiary, disabled, decorative meta  |

### Accent (surgical use only)

The Night Ninjas brand orange. Pulled from the club's running schedule
poster — this is the actual community identity, not a value we picked.
Used sparingly: PBs, current week marker, primary alerts, race-day,
critical CTAs.

| Token                | Hex       | Usage                                |
| -------------------- | --------- | ------------------------------------ |
| `--nn-accent`        | `#FF5F00` | PBs, current week, missed compliance, primary CTA on critical screens |
| `--nn-accent-hover`  | `#FF7A2E` | Interactive hover (dark mode)        |
| `--nn-accent-hover`  | `#CC4C00` | Interactive hover (light mode — deeper burnt-orange for contrast on paper-bone) |

### Signal (compliance)

| Token              | Hex       | Usage                                |
| ------------------ | --------- | ------------------------------------ |
| `--nn-signal-ok`   | `#84CC16` | Compliance hit — used **sparingly**  |
| `--nn-signal-warn` | `#EAB308` | Borderline — within 10% of target    |
| `--nn-signal-miss` | `#DC2626` | Missed target — note this is red, not orange. "Missed" is a semantic red signal regardless of brand colour. |

> Green is used only on compliance indicators. Never as a fill, only as
> a small dot or short bar. Same restraint applies to the brand accent —
> if everything is orange, nothing is.

---

## Typography

Three faces. Never more.

### Display — Bebas Neue

Heavy condensed sans. Matches the existing Night Ninjas wordmark. Used for:

- All H1–H3 page titles
- Stat values (paces, distances, times) when over 24px
- Navigation labels
- Buttons (uppercase, tracked)

Tracking adjustments (in `tailwind.config.ts`):
- `tracking-wide-display` (+0.04em) for body-sized display text
- `tracking-wider-display` (+0.08em) for tiny caps labels (10–12px)

### Body — IBM Plex Sans

Technical, characterful, distinctive. Used for:

- All body copy
- Form inputs
- Captions and labels
- Anything that isn't display or data

Weights used: 400 (normal), 500 (medium), 600 (semibold). No 700+.

### Data — JetBrains Mono

Terminal aesthetic. Tabular figures. Used for:

- Pace strings (`5:43/km`)
- Time strings (`1:32:14`)
- Distance with decimals (`12.4 km`)
- Any numeric column in a table
- Code/config display (CLI fragments, JSON snippets)

Always use `font-mono` with `tabular-nums` so columns align.

---

## Spacing & layout

8px base grid. Everything derives from it.

| Scale | px  | Tailwind | Use                              |
| ----- | --- | -------- | -------------------------------- |
| `0.5` | 4   | `p-0.5`  | Hairline gaps                    |
| `1`   | 8   | `p-2`    | Tight component padding          |
| `2`   | 16  | `p-4`    | Default card padding             |
| `3`   | 24  | `p-6`    | Section padding                  |
| `4`   | 32  | `p-8`    | Page section breaks              |
| `6`   | 48  | `p-12`   | Major section breaks             |
| `8`   | 64  | `p-16`   | Hero / wizard step padding       |

Card pattern: `bg-ink-shadow border border-ink-line p-6`. No drop shadows.
Depth comes from the shade gradient between ink levels, not from glow.

---

## Motion

Three approved animations only. Anything else gets pushback.

| Name         | Duration | Easing         | Use                                       |
| ------------ | -------- | -------------- | ----------------------------------------- |
| `fade-in`    | 200ms    | `ease-out`     | Initial content reveal                    |
| `slide-up`   | 240ms    | `ease-out`     | Step transitions (wizard, modals)         |
| `pulse-red`  | 1600ms   | `ease-in-out`  | Live current-state markers (current week) |

Page transitions: instant. No "spinner of doom." If something is loading,
show a single thin red line at the top of the page (1px tall, full-width).

---

## Iconography

Lucide icons exclusively. Stripped to `strokeWidth={1.5}`. No filled
variants. Default size 16px in body, 20px in buttons, 24px in nav.

---

## Voice & copy

Direct. Terse. Imperative when prescribing.

- "TONIGHT'S MISSION" not "Today's recommended workout"
- "12.4 KM AT 5:32/KM" not "You ran 12.4 km at an average pace of 5:32/km"
- "MISSED" not "You did not complete this session"
- Empty states: "NO DATA. RUN MORE." (yes, really.)

Naming patterns used through the product:

| Term      | Means                                          |
| --------- | ---------------------------------------------- |
| Patrol    | The current week's training loop               |
| Mission   | A planned session                              |
| Recon     | The weekly compliance report                   |
| Strike    | Best week / PB                                 |
| Dojo      | Plan / training method                         |
| Shadow    | Activities not assigned to any plan            |

Use these consistently across nav and copy. Don't slip into "Workout" or
"Training Plan."

---

## What this design system rejects

If you find yourself reaching for any of these, stop. Reconsider.

- Soft pastels of any kind
- Purple → pink → blue gradients
- Rounded cards with `rounded-2xl`
- Glassmorphism / frosted blur
- Friendly emoji in core UI (🏃 ❤️ 🔥)
- "Confetti" celebrations for PBs (a single red ring is enough)
- Skeleton loaders that pulse for 2+ seconds
- Hero images of stock-photo runners
- Floating gradient orbs in the background

The product is for runners who train in the dark.
The interface should feel like it.
