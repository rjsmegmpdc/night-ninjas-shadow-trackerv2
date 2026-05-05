# Night Ninjas — Shadow Tracker

> Local-first running training analyser. Quiet, disciplined work in the dark.

Pulls your Strava history. Compares your week against a proper plan
(Hansons, Lydiard, or your own). Tells you what you missed, what you
nailed, and where the patterns are.

**No cloud. No subscription. No telemetry. Your data stays on your machine.**

---

## What it does

| Surface       | What it shows                                                       |
| ------------- | ------------------------------------------------------------------- |
| **Patrol**    | This week vs. plan — sessions, paces, compliance flags              |
| **Recon**     | Weekly compliance reports across the last 12 weeks                  |
| **Strike**    | Your top 10 training weeks, ranked by composite score               |
| **Dojo**      | Active plan, pace zones, weekly cap, custom-week editor             |
| **Journal**   | Daily wellness — sleep, work stress, energy, perceived effort       |
| **Settings**  | Re-run wizard, manage Strava, export data, wipe everything          |

---

## What's in v0.1.0 (this scaffold)

- ✅ Full Next.js 15 + TypeScript app shell with Night Ninjas branding
- ✅ Local SQLite storage in your user data directory
- ✅ OS keychain integration for Strava credentials
- ✅ Plan engine with Hansons (full), Lydiard (skeleton), Custom (default week)
- ✅ Wizard with 7 steps including OAuth flow
- ✅ Patrol dashboard with the design system applied (mock data)
- ✅ API routes for Strava auth, callback, sync, setup status
- ⏳ Patrol with live data (next iteration)
- ⏳ Strava sync implementation (paginated activity pull)
- ⏳ Recon, Strike, Dojo, Journal, Settings pages (stubs in place)

---

## Quick start

### Requirements

- **Node.js 20.11+** ([download](https://nodejs.org))
- **A Strava account** with at least one activity logged
- **A C++ build chain** for the native dependencies (`better-sqlite3`, `keytar`):
  - **Windows**: `npm install --global windows-build-tools` (run PowerShell as admin)
  - **macOS**: Xcode Command Line Tools (`xcode-select --install`)
  - **Linux**: `build-essential` + `libsecret-1-dev` (`sudo apt install build-essential libsecret-1-dev`)

### Install + run

```bash
cd night-ninjas-shadow-tracker
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The first-run wizard
will guide you through the 7 setup steps.

---

## Setup walkthrough

### 1. Welcome

The brand landing. Click **Begin Setup**.

### 2. Register your Strava app

Strava requires every user to register their own API application — this
keeps Shadow Tracker as a personal tool rather than a multi-tenant service
that would need Strava's review.

1. Visit [strava.com/settings/api](https://www.strava.com/settings/api)
2. Click **Create & Manage Your App**
3. Fill the fields (the values are decorative for personal use):
   - **Application Name**: `Shadow Tracker` (or anything)
   - **Category**: any
   - **Website**: anything (e.g. `localhost`)
   - **Authorization Callback Domain**: **`localhost`** (exactly — no port, no protocol)
4. Agree to the API Agreement and submit
5. Note your **Client ID** (numeric) and **Client Secret** (long alphanumeric)

### 3. Connect

Paste your Client ID and Client Secret. The Client ID goes into the local
SQLite database; the Client Secret goes into your OS keychain (Windows
Credential Manager / macOS Keychain / Linux libsecret). Neither leaves
this machine.

### 4. Choose your dojo

| Dojo        | Best for                                                          |
| ----------- | ----------------------------------------------------------------- |
| **Hansons** | First-to-fourth marathon. Cumulative-fatigue training stimulus.   |
| **Lydiard** | Aerobic-base building. High volume. Periodised over 24 weeks.     |
| **Custom**  | You know what you're doing. Define your own weekly structure.     |

### 5. Goal

Distance + target time + experience level. The plan engine derives all
seven pace zones from these inputs.

### 6. Volume

Set your weekly volume cap and long-run cap. **This is the most underrated
injury-prevention setting in the app.** If you've previously broken down at
85 km/wk, set your cap to 80. The plan will respect it.

### 7. Sync

Pulls every activity from your Strava account into the local database.
~30 sec to a few minutes depending on history.

After this completes, you're dropped onto **Patrol** and the wizard
won't run again unless you trigger it from Settings.

---

## Where your data lives

The app uses three storage locations:

| What                    | Where                                                              |
| ----------------------- | ------------------------------------------------------------------ |
| Activity DB             | OS-specific data dir (see below) — `shadow-tracker.db`             |
| Strava client_secret    | OS keychain — service `NightNinjas-ShadowTracker`                  |
| Strava OAuth tokens     | OS keychain — same service                                          |
| App settings (non-secret) | Activity DB, `settings` table                                    |
| User wellness journal   | Activity DB, `journal` table                                       |

**Data directory by platform:**

- **Windows**: `%APPDATA%\NightNinjas` (typically `C:\Users\<you>\AppData\Roaming\NightNinjas`)
- **macOS**: `~/Library/Application Support/NightNinjas`
- **Linux**: `~/.config/night-ninjas`

To override, set `NN_DATA_DIR` in `.env.local`.

To wipe everything, delete the data directory and the keychain entries.
Settings → Wipe everything will do this for you.

---

## Architecture

```
┌─────────────────┐
│ Next.js 15 app  │  React 19 + Server Components + App Router
│  (localhost)    │
└────────┬────────┘
         │
    ┌────┴─────┐
    │          │
┌───▼───┐ ┌────▼────────┐
│ SQLite │ │ OS keychain │
│  file  │ │  (secrets)  │
└────────┘ └─────────────┘
         │
    ┌────┴─────┐
    │ Strava   │ ← OAuth + activity sync (only outbound network)
    │   API    │
    └──────────┘
```

### Plan engine

Each dojo implements `PlanEngine` (see `lib/plans/types.ts`). To add a new
plan:

1. Create `lib/plans/your-plan.ts` exporting a `PlanEngine`
2. Register it in `lib/plans/index.ts`
3. Done — the wizard, dojo picker, and compliance engine pick it up
   automatically

The contract is:

```ts
interface PlanEngine {
  dojo: 'hansons' | 'lydiard' | 'custom';
  displayName: string;
  philosophy: string;
  defaultProgramWeeks: number;
  defaultLongRunCapKm: number;
  derivePaceZones(params: PlanParams): PaceZones;
  renderWeek(params: PlanParams, weekNumber: number): WeekTemplate;
}
```

### Compliance engine

`evaluateWeek()` in `lib/analysis/compliance.ts` takes a `WeekTemplate`
and the actual `Activity[]` for that week, then returns flags per session:

| Flag     | Meaning                                           |
| -------- | ------------------------------------------------- |
| `ok`     | Inside the prescribed pace band and distance      |
| `warn`   | Within 10% of the band edge                       |
| `fast`   | Faster than the band                              |
| `slow`   | Slower than the band                              |
| `short`  | Below the prescribed distance                     |
| `none`   | No matching activity logged for this day          |

---

## Brand & design

See [`DESIGN.md`](./DESIGN.md) for the full design system —
colour tokens, typography, motion rules, voice/copy patterns, and the
explicit list of things the design system **rejects** (looking at you,
purple gradients).

---

## Development

```bash
# Run dev server
npm run dev

# Build for production
npm run build && npm start

# Generate Drizzle migrations from schema changes
npm run db:generate

# Apply migrations
npm run db:migrate

# Open Drizzle Studio (DB browser)
npm run db:studio

# Lint
npm run lint
```

### Project structure

```
night-ninjas-shadow-tracker/
├── app/                   # Next.js App Router pages
│   ├── setup/             # First-run wizard (7 steps)
│   ├── (app)/             # Main app (Patrol, Recon, Strike, Dojo, Journal, Settings)
│   └── api/               # Backend routes (Strava OAuth, sync, status)
├── components/
│   ├── brand/             # Logo, Wordmark
│   ├── ui/                # Button, Card, Input, Stat, Stepper, PageStub
│   └── nav/               # Sidebar
├── lib/
│   ├── db/                # Drizzle schema + connection
│   ├── plans/             # Plan engines (Hansons, Lydiard, Custom)
│   ├── sources/           # Strava API client
│   ├── analysis/          # Best-week, compliance
│   └── store/             # Settings (DB) + secrets (keychain)
├── DESIGN.md              # Canonical brand reference
└── README.md              # This file
```

---

## Privacy

| Question                                    | Answer                                              |
| ------------------------------------------- | --------------------------------------------------- |
| Does my data leave this machine?            | No.                                                 |
| Is there telemetry / analytics?             | No. `NEXT_TELEMETRY_DISABLED=1` is set by default.  |
| Where do my Strava tokens live?             | OS keychain. Encrypted at rest by the operating system. |
| What outbound network calls happen?         | Only to `strava.com` for OAuth + activity sync.     |
| Does it work offline?                       | Yes, except for syncing new activities.             |

---

## Licence

Personal use. Built by and for the Night Ninjas community.
The Night Ninjas brand and `est. 2016` mark are not licensed for
redistribution outside the community.
