## Branch
feat/ns-engine-ics-alignment

## Session: 2026-06-28 (NS engine ICS alignment)

### Completed
- `lib/plans/norwegian-singles.ts` — full rewrite to match ICS plan (ns-marathon-plan.ics):
  - `defaultProgramWeeks: 20` (was 18), `defaultLongRunCapKm: 34` (was 26), `status: 'full'` (was 'scaffold')
  - ICS-exact long run progression via LONG_KM table (wks 1-20): 16→18→20→22→24→22(down)→28→30→32→26(down)→32→34→28+6MP→30+8MP→32+10MP→Devonport→30+12MP→32+12MP→18+5MP→Race
  - MP finish embedded in long run label + notes for wks 13-15, 17-19
  - Phase-accurate sub-T session labels: Base Early=20×400m/6×5min/4×8min; Base Mid=24×400m/7×5min/5×8min; Specificity=20×400m/6×5min+MP/4×8min; Taper 1=12×400m/4×5min+MP; Taper 2=6×400m sharpener/shakeouts/race
  - Phase names: Transition/Base/Specificity/Taper
  - VOLUME_SCALE capped at 1.0 max (weeklyVolumeCapKm is a hard ceiling)
- 3 engine snapshots updated (intentional — engine output changed by design)
- All 588 tests pass. Evaluator: PASS.

### In progress
- Nothing

### Blocked
- Pre-existing TS errors in lib/ai/client.ts, lib/sources/strava-api.ts, lib/ai/fueling.ts — not from this branch.

### Next session should
- Merge feat/framework-metrics (framework-specific stat rows — completed, evaluator PASS)
- Merge feat/ns-engine-ics-alignment (this branch)
- Update PHASES.md test count: 472 → 588
- Dev server smoke test: confirm framework stats visible on Dashboard (never visually confirmed)
- Audio for Night Ninjas ads (lower priority, deferred)

## Key decisions made
- Option 1 (align engine to ICS) over DB import or JSON overrides — cleanest single code path for solo app
- VOLUME_SCALE max 1.0 — cap is a hard ceiling, not a peak target

## Files changed this session
- lib/plans/norwegian-singles.ts (full rewrite)
- lib/plans/__snapshots__/engine-snapshot.test.ts.snap (3 NS snapshots updated)
- PROGRESS.md (this file)

---

## Branch
feat/framework-metrics

## Session: 2026-06-28

### Completed
- `lib/analysis/framework-stats.ts` — pure dispatch module for all 9 dojos. `getFrameworkStats()` returns 4 `FrameworkStat` objects per dojo: NS (sub-T%, easy HR, rep HR, long run), Hansons (volume, MP-tempo, long run, sessions), Pfitzinger (volume, LT pace, long run, medium-long count), Daniels (T-pace, I-pace, VDOT, volume), Lydiard (phase, aerobic volume, long run, aerobic %), Higdon (long run, volume, week type, sessions), Polarised (easy%, hard%, grey%, volume), Ultra (time-on-feet, vertical gain, back-to-back, volume), Custom/fallback (existing 4 generic stats). HR missing: graceful `— no HR` with `neutral` status.
- `lib/analysis/framework-stats.test.ts` — 35 new tests across 8 describe blocks; all pass.
- `lib/analysis/week-queries.ts` — extended `WeekStats` with `totalElevationGainM` (sum of elevationGainM across runs) and `backToBackKm` (Sat+Sun km combined) for Ultra framework. Added `dowOf()` helper (same component-based UTC-safe pattern as compliance.ts).
- `components/patrol/framework-stat-row.tsx` — server component rendering the 4-stat grid with status colour dispatch (ok=signal-ok, warn=signal-warn, miss=signal-miss, neutral=bone). Same `grid grid-cols-2 md:grid-cols-4 gap-px` layout as the old hardcoded block.
- `app/(app)/patrol/page.tsx` — replaced hardcoded 4-stat block with `<FrameworkStatRow stats={frameworkStats} />`. Added `vo2Rows` to the parallel `Promise.all` fetch; resolves VO2max observations → VDOT approximation for Daniels. Imports: `FrameworkStatRow`, `getFrameworkStats`, `resolveVo2`, `Vo2Source`.
- Tests: 588/588 passing (35 new + 553 pre-existing). Evaluator: PASS.

### In progress
- Nothing

### Blocked
- Pre-existing TS errors in lib/ai/client.ts, lib/sources/strava-api.ts, lib/ai/fueling.ts — not from this branch.

### Next session should
- ICS/Brief as baseline for calendar matrix — Matt's decision pending on import approach (ICS direct import vs NS engine update)
- Audio for other two Night Ninjas ads (Shadow in the Data, The Gap)
- Backlog: update test count in PHASES.md from 472 → 588; add E2E/integration test coverage backlog item

## Key decisions made
- Custom framework: unchanged (uses generic 4 stats)
- Daniels VDOT: read from vo2maxObservations table, pass as nullable — VO2max ≈ VDOT approximation
- HR missing: graceful per-metric fallback, never crashes, shows neutral status
- All frameworks built in one pass (no incremental rollout)

## Files changed this session
- lib/analysis/framework-stats.ts (new)
- lib/analysis/framework-stats.test.ts (new)
- lib/analysis/week-queries.ts (extended WeekStats + aggregateWeekStats)
- components/patrol/framework-stat-row.tsx (new)
- app/(app)/patrol/page.tsx (4-stat block replaced, imports added)
- PROGRESS.md (this file)

---

## Branch
feat/weekly-report-patrol-hero

## Session: 2026-06-26 (code-review fixes)

### Completed
- FIX 1 (BLOCKING): Replaced `currentWeekRange(today)` (local-time) with `getThisMondayIso + addUtcDays` (UTC) in `generateWeeklyReportIfDue`. Week bounds now consistent with watermark and `shouldGenerateReport`. Exported `addUtcDays` from `weekly-report-pure.ts` to enable this.
- FIX 2 (SHOULD FIX): Added `enabled` check to `getPersistedWeeklyReport` (Option A). Disabling the feature now causes the function to return null immediately — stale snapshot is not surfaced.
- FIX 3 (SHOULD FIX): Gated `<WeeklyReportHero>` render in `patrol/page.tsx` on `weeklyReportEnabled`. Read flag server-side at `PatrolDashboard` entry; skip all report calls and skip the hero when disabled.
- Tests: Added 4 UTC boundary regression tests in `weekly-report-pure.test.ts` for the NZ Monday-local/Sunday-UTC scenario (`new Date('2026-06-22T10:00:00+12:00')`). All 553 tests pass.

### In progress
- Nothing active

### Blocked
- Pre-existing TS error in components/patrol/shoe-recommendation-card.tsx (line 21 — unterminated string literal). Pre-dates this branch; not introduced by this session.
- `getPersistedWeeklyReport` enabled-gate test: cannot be unit-tested (server action with DB dependency — see TESTING.md `lib/actions/*.ts` exclusion). Behaviour verified by reading the implementation; integration/manual test required for full coverage.

### Next session should
- Consider Phase 19 backlog: shadcn Tooltip/Progress/Alert/Skeleton; ComplianceRow responsive layout; Patrol chip cluster redesign
- Manual smoke-test: disable weekly report in Settings, open Patrol — confirm hero is absent and no stale card shows; re-enable, open Patrol — confirm hero appears
- Consider pulling WeeklyReportHero outside PatrolDashboard into PatrolPage so it shows even when no active plan is configured

## Session: 2026-06-26 (frontend pass)

### Completed
- lib/analysis/weekly-report-display-pure.ts — pure display helpers: formatWeekRange, formatWeekRange, formatNextReport, formatGeneratedAt, dayAbbrevFromIso, complianceTextClass/BorderClass/Label, formatVolume, dayStatusClass, dayStatusSymbol (~130 lines)
- lib/analysis/weekly-report-display-pure.test.ts — 53 tests (UTC safety, all compliance variants, boundary cases, negative cases including 0/0 volume, future timestamps, edge day-of-week values); all pass
- components/patrol/weekly-report-hero.tsx — WeeklyReportHero Card component with full report view and prompt state; DayRow sub-component; prop interface: { report: WeeklyReport | null } (~140 lines)
- components/settings/weekly-report-toggle.tsx — WeeklyReportToggle client component; optimistic useState + useTransition pattern matching FirstDayOfWeekToggle; on/off buttons + day picker select; aria-pressed, labels, disabled states (~110 lines)
- app/(app)/patrol/page.tsx — wired WeeklyReportHero as first element in PatrolDashboard return; generateWeeklyReportIfDue + getPersistedWeeklyReport fallback called on every Patrol load
- app/(app)/settings/page.tsx — added Weekly Report section with WeeklyReportToggle; getWeeklyReportEnabled + getWeeklyReportDay read server-side and passed as initial props

### In progress
- Nothing active

### Blocked
- Pre-existing TS error in components/patrol/shoe-recommendation-card.tsx (line 21 — unterminated string literal). Pre-dates this branch; not introduced by this session. Does not affect test suite or runtime.

### Next session should
- Consider Phase 19 backlog: shadcn Tooltip/Progress/Alert/Skeleton; ComplianceRow responsive layout; Patrol chip cluster redesign
- Manual smoke-test: open Patrol with feature disabled (confirm prompt card renders); enable in Settings; open Patrol again (confirm hero renders)
- Consider pulling WeeklyReportHero outside PatrolDashboard into PatrolPage so it shows even when no active plan is configured

## Key decisions made
- Display: PERSISTENT — persist full report payload JSON (weeklyReportPayload in settings store). Frontend reads snapshot on every Patrol load.
- QA STANDARD (standing, all future VELOCITY work): negative tests required for all UI components and integrations — error states, null/empty props, disabled states, invalid inputs, failed async, renders-when-data-absent.
- phase label falls back to "No active plan" when getActivePlan() returns null or week number falls outside programWeeks range; no crash, no empty state panic.
- buildWeeklyReport accepts longRunTargetKm as a separate param (not derived from weekTemplate inside the pure function) so it stays mockable in tests.
- Component tests not possible per project architecture (no component test harness — environment: 'node', include: 'lib/**/*.test.ts'). Pure display-logic helpers extracted to weekly-report-display-pure.ts and fully unit-tested instead. This satisfies the QA standard at the testable boundary.
- WeeklyReportHero always renders something (prompt card) when report is null — never crashes, never renders nothing.

## Files changed this session

### Prior session (backend)
- lib/analysis/weekly-report-pure.ts (new, ~195 lines)
- lib/analysis/weekly-report-pure.test.ts (new, ~240 lines)
- lib/store/settings.ts (edited — +52 lines: 4 keys + 6 accessors)
- lib/actions/weekly-report.ts (new, ~165 lines)

### This session (frontend)
- lib/analysis/weekly-report-display-pure.ts (new, ~130 lines)
- lib/analysis/weekly-report-display-pure.test.ts (new, ~240 lines, 53 tests)
- components/patrol/weekly-report-hero.tsx (new, ~140 lines)
- components/settings/weekly-report-toggle.tsx (new, ~110 lines)
- app/(app)/patrol/page.tsx (edited — +8 lines: imports + hero integration)
- app/(app)/settings/page.tsx (edited — +30 lines: imports + section + Promise.all)
- PROGRESS.md (this file)
