# Adding a feature

1. **Put the code in the right folder.** A new screen goes in `apps/desktop/src/screens/<Name>/<name>.js` and adds its view with `V.<route>=function(){ return '...html...' }`. A calculation goes in `packages/engine/src/`. Saving or loading goes in `packages/database/src/`.
2. **Add the file to `build.manifest.json`** in the right place. Files that other files use while loading (helpers, constants, storage, state, icons) come first. Screens come after `app/routes.js`. `app/main.js` is always last.
3. **Add the route** to `SEC` in `packages/shared/src/constants.js` if it should appear in the menu, and an icon in `NI` in `components/icons/icons.js`.
4. **Build and test:** `npm run build`, then `npm run test:all`.

Conventions
- Every file starts with a one-line comment saying what it is for.
- Data lives in one object, `D`, saved with `save()`. Add new fields with a default in `load()` so older accounts keep working.
- Anything that deletes asks for confirmation with `ask(message, 'functionName', 'id')`.
- Money is shown in KSh; weights are stored in kg and litres, eggs as a count (30 eggs = 1 tray).
