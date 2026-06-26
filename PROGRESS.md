## Branch
feat/weekly-report-patrol-hero

## Session: 2026-06-26

### Completed
- lib/analysis/weekly-report-pure.ts — pure module: getThisMondayIso, shouldGenerateReport, buildWeeklyReport, DayReport, WeeklyReport types
- lib/store/settings.ts — four new KEY entries + six typed accessors (get/set pairs for weeklyReportEnabled, weeklyReportDay, weeklyReportLastGeneratedWeek, weeklyReportPayload)
- lib/actions/weekly-report.ts — server action: generateWeeklyReportIfDue, getPersistedWeeklyReport, updateWeeklyReportSettings
- lib/analysis/weekly-report-pure.test.ts — 24 tests (8 happy path, 16 negative/edge); all 496 tests pass

### In progress
- Nothing active

### Blocked
- Nothing blocked

### Next session should
- Build the Patrol hero card component (frontend) that reads the persisted report via getPersistedWeeklyReport and renders the DayReport grid
- Wire updateWeeklyReportSettings into the Settings page UI
- Consider Phase 19 backlog: shadcn Tooltip/Progress/Alert/Skeleton; ComplianceRow responsive layout; Patrol chip cluster redesign

## Key decisions made
- Display: PERSISTENT — persist full report payload JSON (weeklyReportPayload in
  settings store). Frontend reads snapshot on every Patrol load.
- QA STANDARD (standing, all future VELOCITY work): negative tests required for
  all UI components and integrations — error states, null/empty props, disabled
  states, invalid inputs, failed async, renders-when-data-absent.
- phase label falls back to "No active plan" when getActivePlan() returns null
  or week number falls outside programWeeks range; no crash, no empty state panic.
- buildWeeklyReport accepts longRunTargetKm as a separate param (not derived
  from weekTemplate inside the pure function) so it stays mockable in tests.

## Files changed this session
- lib/analysis/weekly-report-pure.ts (new, ~195 lines)
- lib/analysis/weekly-report-pure.test.ts (new, ~240 lines)
- lib/store/settings.ts (edited — +52 lines: 4 keys + 6 accessors)
- lib/actions/weekly-report.ts (new, ~165 lines)
- PROGRESS.md (this file)
