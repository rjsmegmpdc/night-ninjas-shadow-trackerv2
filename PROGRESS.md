## Branch
main (clean — feat/loading-perf merged)

## Session: 2026-06-29

### Completed

**Phase 27 — Loading Performance**

- **`lib/store/settings.ts`** — `get()` wrapped in React `cache()`. Deduplicates per-request SQLite reads; multiple server components reading the same setting key share one DB hit per render.
- **`app/(app)/patrol/page.tsx`** — Two waterfall eliminations:
  1. `getActivitiesInRange` now runs in parallel with `resolveWeekContext` (both only need pure date strings).
  2. `getTrailingChronicKm(6)` and `getMidEntryDismissedPeriod()` merged into the existing 12-item `Promise.all` block, removing a standalone sequential pair.
- **14 × `loading.tsx`** — Instant `animate-pulse` skeleton on every app route. Next.js streams the skeleton immediately while the async page component resolves data. Routes covered: calendar, club, coach-log, profile, strike, vo2max, journal, shoes, race, dojo, test-lab, help, recon, settings.

TypeScript: 0 errors. Tests: 609/609 passed.

### In progress
- Nothing

### Blocked
- Nothing

### Next session should
- Manual smoke test: navigate between several routes — skeleton should flash instantly then resolve
- Manual smoke test: compliance bar scroll behaviour — expanded → traffic lights → popover → "session detail" link
- Manual smoke test: quick-log strip, mid-entry banner, setup wizard full flow
- "Shoes Scienve" DB entry: user must fix in Calendar page (rename the group run — it's a DB value, not source code)

## Key decisions made (Phase 27)
- `cache()` on `get()` only (not `set()`) — writes go directly per server action, never deduplicated
- `loading.tsx` skeleton is intentionally generic (3 stacked cards) — fast to render, universally applicable, no per-route branching

## Files changed this session
- lib/store/settings.ts (cache wrapper)
- app/(app)/patrol/page.tsx (parallel fetches)
- app/(app)/calendar/loading.tsx (new)
- app/(app)/club/loading.tsx (new)
- app/(app)/coach-log/loading.tsx (new)
- app/(app)/profile/loading.tsx (new)
- app/(app)/strike/loading.tsx (new)
- app/(app)/vo2max/loading.tsx (new)
- app/(app)/journal/loading.tsx (new)
- app/(app)/shoes/loading.tsx (new)
- app/(app)/race/loading.tsx (new)
- app/(app)/dojo/loading.tsx (new)
- app/(app)/test-lab/loading.tsx (new)
- app/(app)/help/loading.tsx (new)
- app/(app)/recon/loading.tsx (new)
- app/(app)/settings/loading.tsx (new)
- PHASES.md (Phase 27 entry, version 0.2.27)
- PROGRESS.md (this file)

---

## Previous session (2026-06-29, feat/tonight-mission-top → main)

### Completed

**Phase 26 — Patrol Dashboard Reorder + Sticky Compliance Bar**

- **`components/patrol/compliance-bar.tsx`** — new sticky client component replacing WeekComplianceBlock. Expanded state: slim bar with % + status + 3 coloured dots. Scrolled state (>30px): traffic-light dots only, sticks under nav, clicking opens explanation popover with link to session detail in coaching drawer.
- **`app/(app)/patrol/page.tsx`** — Tonight's Mission moved to top (before header); Program Matrix moved directly under Tonight's Mission; ComplianceBar placed first (above header); WeekComplianceBlock removed; `id` attrs added to coaching-detail and session-compliance elements.
- **`components/nav/topnav.tsx`** — Active nav bucket now shows filled `bg-accent/10` pill + inner glow (depressed state) on top of existing underline.

### In progress
- Nothing

### Blocked
- Nothing

### Next session should
- Manual smoke test: compliance bar scroll behaviour — expanded → traffic lights → popover → "session detail" link
- Manual smoke test: quick-log strip, mid-entry banner, setup wizard full flow
- Loading performance: static shell caching / prefetch improvements (deferred from this session)

## Key decisions made (Phase 26)
- Scroll position listener (`window.scrollY > 30`) used over IntersectionObserver — simpler, more predictable cross-browser
- WeekComplianceBlock component kept on disk; only patrol page import swapped (safe, no breaking change)
- Rightmost popover (miss) aligns `right-0` to prevent off-screen overflow

## Files changed this session
- components/patrol/compliance-bar.tsx (new)
- app/(app)/patrol/page.tsx (reorder + compliance swap)
- components/nav/topnav.tsx (active state)
- PHASES.md (Phase 26 entry, version 0.2.26)
- PROGRESS.md (this file)
