## Branch
feat/theme-switcher (ready to merge)

## Session: 2026-06-28

### Completed

**Phase 25 — Color Scheme Switcher**

4 named color schemes available under Settings → Display. Default is Ninja (brand dark).

- **`app/globals.css`** — Added `html[data-theme="daybreak"]` and `html[data-theme="midnight"]` CSS blocks. Fixed `html[data-theme="light"]` block — added 5 missing tokens (`--nn-ink-line-bold`, `--nn-accent-glow`, `--nn-accent-faint`, `--nn-selection-bg`, `--nn-selection-fg`) for token parity across all 4 themes.
- **`components/theme/theme-provider.tsx`** — Full rewrite. `ThemePreference / AppliedTheme / system-resolution` removed; replaced with `ColorScheme = 'ninja' | 'daybreak' | 'midnight' | 'light'`. Default `ninja`. Context exports `{ scheme, setScheme }`. `NO_FLASH_SCRIPT` updated to validate against the 4 scheme names and fall back to `ninja`.
- **`components/theme/theme-toggle.tsx`** — Updated to use new `ColorScheme` API. Cycles Ninja→Daybreak→Midnight→Light. Icons: Moon→Sunset→SunMedium→Sun.
- **`components/theme/theme-switcher.tsx`** — NEW. Client component with 4-option card grid. Each card shows a 3-dot color swatch preview (bg / accent / text dots) + scheme name + tagline. Active scheme shows accent border and ✓ active. Renders under Settings → Display.
- **`app/(app)/settings/page.tsx`** — Added `Palette` import, `ThemeSwitcher` import, and a Color Scheme card in the Display section above FirstDayOfWeekToggle.

**Themes:**

| Name | Key | Background | Accent | Use case |
|---|---|---|---|---|
| Ninja | `ninja` | #0A0A0A | #FF5F00 | Default — brand dark |
| Daybreak | `daybreak` | #FBF8F1 | #E2521A | Warm paper, morning use |
| Midnight | `midnight` | #080B12 | #4FA8FF | Cool blue-black, night use |
| Light | `light` | #F5F1E8 | #FF5F00 | Standard paper-bone light |

Evaluator gate: PASS. TypeScript: 0 errors. Tests: 609/609 passed.

### In progress
- Nothing

### Blocked
- Nothing

### Next session should
- Manual smoke test: visit Settings → Display → switch through all 4 schemes; confirm swatch preview matches rendered result; confirm preference persists on reload
- Manual smoke test: quick-log strip (log injury, confirm InterruptionIndicator updates)
- Manual smoke test: mid-entry banner (set plan start in past to trigger)
- Manual smoke test: setup wizard full flow end-to-end

## Key decisions made (Phase 25)
- Ninja is the default (brand identity). System-pref resolution removed — single explicit choice per user.
- `data-theme` attribute drives all styling; no JS-applied class names. Themes work instantly (CSS custom property override).
- `NO_FLASH_SCRIPT` runs before hydration to prevent FOUC. Falls back to `ninja` if localStorage is unavailable or holds an unknown value.
- `html[data-theme="midnight"]` uses `color-scheme: dark` explicitly (not relying on the global default) for clarity.

## Files changed this session
- app/globals.css (daybreak + midnight blocks; light block parity fix)
- components/theme/theme-provider.tsx (full rewrite — ColorScheme, 4 schemes)
- components/theme/theme-toggle.tsx (updated — new API, 4-cycle icons)
- components/theme/theme-switcher.tsx (new — Settings card picker)
- app/(app)/settings/page.tsx (ThemeSwitcher added to Display section)
- PROGRESS.md (this file)

---

## Previous session (2026-06-28, feat/setup-wizard-redesign → main)

### Completed

**Phase 24 — Setup Wizard Redesign**

Rebuilt the 7-step setup wizard with a new user flow and product framing:
- **New step order:** Welcome → Strava → Connect → Sync → Race → Plan → Life Events
  - Previously: Welcome → Strava App → Connect → Dojo → Races → Weekly → Sync
  - Key change: Sync is now step 4 (the hero payoff — matrix appears); Race and Plan are optional and come after
- **`app/setup/page.tsx`** — Welcome redesigned; Calendar Matrix is the hero. Shows a live data preview mockup (four rows of sample runs: past/now/future). Removed Logo component, added value prop copy focused on the matrix.
- **`app/setup/strava-app/page.tsx`** — Visual 3-stage guide replacing the old bulleted list:
  - Stage 01: Open strava.com/settings/api button
  - Stage 02: Form field mockup with every field labelled; Authorization Callback Domain highlighted with warning border and copy button
  - Stage 03: Credential mockup (Client ID as number, Client Secret as masked string)
- **`components/setup/copy-button.tsx`** — New client component; clipboard API with 2s "copied" feedback, signal-ok accent on confirmation
- **`app/setup/connect/page.tsx`** — STEPS array updated; minor copy improvements
- **`app/setup/sync/page.tsx`** — Moved to step 4; copy changed to "show me my matrix" framing; Continue → /setup/races; Back → /setup/connect
- **`app/setup/races/page.tsx`** — Step 5 with "optional" badge; Skip → /setup/life-events; Next → /setup/dojo; Back → /setup/sync
- **`app/setup/dojo/page.tsx`** — Step 6 with "optional" badge; Skip → /setup/life-events; Back → /setup/races
- **`app/setup/life-events/page.tsx`** — NEW step 7; explains injury/sick/away with preview of the quick-log chip strip; Continue → /patrol
- **`lib/actions/dojo.ts`** — Redirect after dojo selection changed from /setup/races to /setup/life-events
- **`app/api/strava/callback/route.ts`** — OAuth success redirect changed from /setup/dojo to /setup/sync (evaluator catch — critical fix)
- **`app/setup/weekly/page.tsx`** — Converted to redirect shim → /setup/life-events (evaluator catch — weekly dropped from wizard flow; content still accessible from Calendar page)

**Phase 23 — TypeScript fixes (feat/fix-ts-errors → main)**
- `lib/ai/client.ts:45` — TextBlock citations type predicate
- `lib/sources/strava-api.ts:114` — StravaActivity index signature
- `lib/ai/fueling.ts:52` — AiModel double-resolution bug
- `lib/analysis/weekly-report-pure.test.ts:9,17` — ComplianceFlag import

## Key decisions made (Phase 24)
- Sync first, plan optional: the matrix is the payoff, not the plan. Users can see 90 days of their data before committing to a training method.
- Weekly config removed from wizard: group runs and capacity caps are advanced config; accessible from Calendar page.
- /setup/weekly preserved as redirect shim (not deleted) — existing revalidatePaths in server actions still target it; redirect avoids broken routes.
- OAuth callback fix was a missed edge: the wizard page links were all updated but the server-side redirect was not — evaluator caught it.
