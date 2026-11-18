# Project structure

Build: the files listed in `build.manifest.json` are joined, in order, into `dist/agroversa.html`.

Where each piece of the app lives

| Feature | File |
|---|---|
| Create account, sign in, checklists, sign out | `apps/desktop/src/auth/AuthScreen.js` |
| Forgot password, pattern, device unlock, fingerprint | `apps/desktop/src/auth/Recovery.js` |
| Password hashing | `packages/application/src/services/AuthService.js` |
| Sidebar, floating glass pill, top bar | `apps/desktop/src/layouts/AppLayout.js` |
| Dashboard shortcuts, Quick add tile | `screens/Dashboard/dashboard.js` |
| Species, avatars, stages with duration, requirements, group details | `screens/Animals/animals.js` |
| Ingredients, nutrient profiles, stock, movements, ingredient history | `screens/Inventory/inventory.js` |
| Setup, ingredient pop-up, scaling, calculation, saving, batches, history | `screens/Formulations/formulations.js` |
| Groups, quick add, feed pop-up, weight, mortality, records | `screens/Productivity/productivity.js` |
| Graph sections, data tables, print, export | `screens/Reports/reports.js` |
| Notifications list | `screens/Notifications/notifications.js` |
| Profile, theme, password, security | `screens/Settings/settings.js` |
| Nutrient totals, cost, feasibility | `packages/engine/src/calculations/nutrientAnalysis.js` |
| Least cost and targeting optimizer | `packages/engine/src/formulation/leastCostEngine.js` |
| Units, eggs and trays | `packages/engine/src/calculations/units.js` |
| Batch numbers (`B.S-001-151126`, `SC.` prefix) | `packages/engine/src/traceability/batchNumber.js` |
| Feed intake, days lasting, FCR | `packages/engine/src/productivity/feedIntake.js` |
| Chart data and time ranges | `packages/engine/src/reports/chartData.js` |
| Charts | `apps/desktop/src/components/charts/charts.js` |
| Calendar and events | `apps/desktop/src/components/calendar/calendar.js` |
| Pop-ups and delete confirmation | `apps/desktop/src/components/modals/` |
| Alerts and device notifications | `packages/application/src/services/NotificationService.js` |
| Storage, users, save, load, starter data | `packages/database/src/storage.js` |

Each engine file exists twice where a typed version has been written: the `.ts` is typed and tested, the `.js` is what the app runs. The `.js` is retired once the `.ts` is wired in.
