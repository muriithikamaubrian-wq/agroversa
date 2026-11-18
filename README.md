# AgroVersa

Feed formulation, inventory, production and productivity for farms. Works offline.

## Use it
- **Just open** `dist/agroversa.html` in a browser. It is the whole app in one file.
- **Rebuild after changing code:** `npm run build` (needs Node 20.11 or newer, no packages).
- **Run the tests:** `npm install` once, then `npm run test:all`.

Accounts and records are stored in the browser on that device. Clearing site data removes them.

## How the code is organised
The code lives in the folders below. `build.manifest.json` lists the files in the order they are joined into `dist/agroversa.html`.

| Folder | What is in it |
|---|---|
| `apps/desktop/src/screens/` | One folder per screen: Dashboard, Animals, Inventory, Formulations, Productivity, Reports, Notifications, Settings |
| `apps/desktop/src/auth/` | Create account, sign in, forgot password, pattern, fingerprint |
| `apps/desktop/src/components/` | Pop-ups, charts, calendar, typed dates, icons, picture picker |
| `apps/desktop/src/layouts/` | The page frame: sidebar, floating glass pill, top bar |
| `apps/desktop/src/app/` | App state, the table of screens, and the start-up code |
| `apps/desktop/src/styles/` | `themes.css` (colours) and `global.css` (layout) |
| `packages/engine/` | Calculation code: nutrients and feasibility, optimizer, units and trays, batch numbers, feed intake, chart data. The `.ts` files are typed and tested; the `.js` files are what the app runs today |
| `packages/database/` | Browser storage, users, saving, loading and starter data |
| `packages/application/` | Services: password hashing, animal lookups, notifications |
| `packages/shared/` | Helpers and constants used everywhere, plus shared types |
| `assets/` | Logos, icons, avatars, backgrounds, fonts |
| `docs/` | `project-structure.md` and `adding-a-feature.md` |

## Next steps
1. Turn the `.js` files into typed modules one folder at a time (engine first, the `.ts` versions already exist).
2. Add HiGHS for exact least-cost results, SQLite for storage, then the Tauri shell.
