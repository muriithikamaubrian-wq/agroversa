# AgroVersa — Testing Guide

This guide walks you through building the app, starting the sync server, and testing every feature that was added in the sync PR.

---

## Prerequisites

| Tool | Why | How to check |
|------|-----|--------------|
| **Node.js 20.11+** | Build the app, run tests | `node --version` |
| **Docker Desktop** | Run PostgreSQL + sync server with one command | `docker --version` |
| **A browser** | Open the app (Chrome recommended for fingerprint + notifications) | — |
| **A phone** (optional) | Test mobile UI, push notifications, fingerprint | Chrome on Android |

If you don't have Docker, you can run PostgreSQL and the server manually (see Section 3B below).

---

## Section 1 — Build the app

The build script reads `build.manifest.json`, concatenates all CSS and JS files into a single `dist/agroversa.html`, and copies install files (manifest, service worker, icons) into `dist/`.

```bash
# From the project root:
npm run build
```

**Expected output:**
```
Built dist/ (XX KB app, N install files) from 39 script and 2 style files
```

If you see errors:
- `Cannot find module` → run `npm install` first (only needed for `jsdom` dev dependency)
- `ENOENT` for a file → check that `build.manifest.json` lists files that exist

**After build, you should have:**
```
dist/
  agroversa.html      ← the whole app in one file
  index.html          ← same file (for hosting)
  manifest.webmanifest
  sw.js
  icon-192.png
  icon-512.png
  apple-touch-icon.png
```

### Quick test without a server
Just open `dist/agroversa.html` in your browser. The app works fully offline. You can create an account, add ingredients, formulate feed, etc.

---

## Section 2 — Start the sync server

### Option A: Docker (recommended, one command)

```bash
# From the project root:
docker-compose up -d
```

This starts two containers:
1. **PostgreSQL 16** on port 5432 (database)
2. **AgroVersa sync server** on port 3000 (API + serves the built app)

**Check it's running:**
```bash
docker-compose ps
```
Both services should show `Up` and `healthy`.

**View server logs:**
```bash
docker-compose logs server
```
You should see: `AgroVersa sync server on port 3000`

**Stop the server:**
```bash
docker-compose down
```

### Option B: Manual (without Docker)

You need PostgreSQL running separately.

```bash
# 1. Start PostgreSQL and create the database
createdb agroversa

# 2. Install server dependencies
cd apps/server
npm install

# 3. Start the server
DATABASE_URL=postgres://postgres:postgres@localhost:5432/agroversa npm start
```

### Verify the server is responding

Open this in your browser or terminal:
```bash
curl http://localhost:3000/devices?username=test
```
You should get `[]` (empty array). If you get a connection error, the server isn't running.

---

## Section 3 — Test sync, linked devices, and notifications

### Step 1: Open the app

Open `http://localhost:3000` in your browser (the server serves the built app from `dist/`).

> If you opened `dist/agroversa.html` directly as a file, that's fine for testing without sync. To test sync, you need the server URL, so use `http://localhost:3000` instead.

### Step 2: Create an account

1. Click **Create an account**
2. Enter a full name (e.g. "Brian")
3. Enter a username (e.g. "brian") — 3-20 characters, letters/numbers/dots/underscores
4. Enter a password — at least 8 characters, must include a letter and a number
5. Confirm the password
6. Click **Create account**

You should land on the Dashboard with sample data (Maize, Soybean meal, etc.).

### Step 3: Configure the sync server

1. Click **Settings** (gear icon in sidebar, or bottom nav on mobile)
2. Scroll to the **Sync** section
3. In the **Sync server address** field, enter: `http://localhost:3000`
4. The field saves automatically when you tab away or press Enter

**What you should see after entering the URL:**
- A **Sync now** button appears
- A **Send test notification** button appears
- A sync status chip appears in the top bar (shows "synced" or "idle")

### Step 4: Test sync

1. Click **Sync now**
2. Watch the sync chip in the top bar — it should show "syncing…" then "synced"
3. Scroll down to **Sync history** — you should see an entry like:
   ```
   ✓ 2026-11-27T12:30:00.000Z: 7 pushed, 0 pulled
   ```

**Test that changes sync:**
1. Go to **Inventory** → add a new ingredient (e.g. "Cottonseed cake")
2. Go back to **Settings** → **Sync now**
3. The sync history should show "N pushed, 0 pulled"

### Step 5: Test linked devices

1. In Settings, scroll to **Linked devices**
2. You should see:
   ```
   Your account is on 1 device.
   PC ABC123        [This device]
   Last active 2026-11-27T...
   ```

**To test a second device:**
1. Open a different browser (or an incognito window)
2. Go to `http://localhost:3000`
3. Click **Sign in** (not Create account)
4. Enter the same username and password
5. The account data should download from the server

**Back on the first device:**
1. Refresh Settings
2. Linked devices should now show **2 devices**
3. The second device should be listed with a **Log out** (trash) button
4. Click **Log out** on the remote device → it disappears from the list

### Step 6: Test notifications

**Enable browser notifications:**
1. In Settings → **Security** section
2. Click **Turn on device notifications**
3. Your browser will ask permission → click **Allow**
4. The status should change to "On"

**Test the notification:**
1. Click **Send test notification** (in the Sync section)
2. You should see "Test sent. Check your devices."
3. A notification should appear on your device

**Test in-app notification alerts:**
1. Go to **Inventory** → edit an ingredient's stock to below 100 kg (the low-stock threshold)
2. The bell icon in the top bar should show a red badge with a number
3. Click the bell → Notifications screen
4. You should see: "⚠ [Ingredient] is low: X kg left."
5. Click **Mark all as read** → the badge disappears
6. Individual notifications show **bold** when unread, **dimmed** when read

### Step 7: Test password sync

1. In Settings → **Password** section
2. Enter your current password
3. Enter a new password (8+ chars, letter + number)
4. Click **Change password**
5. You should see "Password changed."
6. On the second device (incognito window), sign out and sign back in with the **new** password — it should work

---

## Section 4 — Test Excel import/export

### Animals screen

**Export:**
1. Go to **Animals**
2. Click the **download icon** (⬇) in the toolbar
3. A file called `agroversa-animals.csv` downloads

**Inspect the CSV:**
Open it in Excel, Google Sheets, or a text editor. You should see:
```
Species,Stage,Duration From,Duration Unit,Duration To,Duration Unit,Crude protein Min (%),Crude protein Max (%),Energy (ME) Min (kcal/kg),Energy (ME) Max (kcal/kg),...
Broiler,Starter,1,day,3,week,22,26,3000,3300,...
Layer,Production,18,week,72,week,16,19,2650,2900,...
```

**Import:**
1. Edit the CSV — add a new row, e.g.:
   ```
   Duck,Starter,1,day,3,week,20,24,2900,3100,...
   ```
2. Save the file
3. In AgroVersa → Animals → click the **plus icon** (➕) in the toolbar
4. Select your edited CSV file
5. A preview modal appears showing:
   - How many stages will be imported
   - A table with Species, Stage, Requirements count
   - Any errors (bad rows are skipped)
6. Click **Import**
7. The new species/stage should appear in the Animals list

### Inventory screen

**Export:**
1. Go to **Inventory** → **Ingredients** tab
2. Click the **download icon** (⬇) in the toolbar
3. A file called `agroversa-ingredients.csv` downloads

**Inspect the CSV:**
```
Name,Crude protein (%),Energy (ME) (kcal/kg),Calcium (%),Phosphorus (%),Lysine (%),Price/kg,Max %,Stock kg
Maize,8.5,3350,0.02,0.28,0.26,70,2000
Soybean meal,46,2230,0.3,0.65,2.9,55,800
```

**Import:**
1. Edit the CSV — add a new row, e.g.:
   ```
   Cottonseed cake,41,2600,0.2,1.1,1.6,45,500
   ```
2. Save the file
3. In AgroVersa → Inventory → click the **plus icon** (➕) in the toolbar
4. Select your edited CSV file
5. A preview modal appears showing:
   - How many ingredients will be **added** vs **updated**
   - A table with Name, Price/kg, Stock kg, Action (Add new / Update)
6. Click **Import**
7. The new ingredient should appear in the Inventory table

---

## Section 5 — Test fingerprint lock

### Enable fingerprint
1. In Settings → **Security** section
2. Click **Use fingerprint to sign in**
3. Follow the browser prompts to set up fingerprint/WebAuthn
4. The security text should now say: "Fingerprint sign-in is on. The app also locks after 10 seconds of inactivity."

### Test the 10-second inactivity lock
1. Stay on any screen in the app
2. **Do not touch the keyboard, mouse, or screen for 10 seconds**
3. A full-screen lock overlay should appear:
   - 🔒 icon
   - "AgroVersa is locked"
   - "Tap unlock or enter your password"
   - An **Unlock with fingerprint** button (if fingerprint is available)
   - A password input field
   - An **Unlock** button

### Unlock with fingerprint
1. Click **Unlock with fingerprint**
2. Follow the browser biometric prompt
3. The lock overlay should disappear
4. The 10-second timer resets

### Unlock with password
1. Type your account password
2. Click **Unlock** (or press Enter)
3. The lock overlay should disappear
4. The 10-second timer resets

### Disable the lock
1. Go to Settings → Security
2. Click **Turn off fingerprint sign-in**
3. The lock will no longer appear after inactivity

---

## Section 6 — Run the tests

### Engine tests (formulation calculations)
```bash
npm test
```
Expected: 5 tests pass.

### Smoke test (app builds and loads)
```bash
npm run test:smoke
```
Expected: app builds, loads in jsdom, dashboard renders.

### Sync unit tests (device ID, migration, schema)
```bash
node --test tests/integration/sync.test.mjs
```
Expected: 8 tests pass:
1. Device ID is generated and stored
2. Device name is inferred
3. migrateData adds sync fields to v1 data
4. migrateData is idempotent
5. SCHEMA_VERSION is defined
6. setSyncServerUrl stores URL in localStorage
7. syncServerUrl retrieves stored URL
8. Device ID differs across stores

### All tests
```bash
npm run test:all
```
Runs engine tests, builds the app, then runs smoke tests.

---

## Section 7 — Test on mobile

### Open on your phone
1. Make sure your phone and computer are on the same Wi-Fi
2. Find your computer's local IP: `ipconfig` (Windows) or `ifconfig` (Mac/Linux)
3. On your phone, open `http://192.168.x.x:3000` (replace with your IP)

### Test the mobile notification button
1. The **bell icon** should be in the top-right area, 44×44px (easy to tap)
2. When you tap it, there should be a subtle background flash (active state)
3. The notification badge (red dot with number) should be clearly visible
4. Tap **Notifications** → you should see the list, "Mark all as read" button

### Install as an app
1. In Chrome on your phone → menu (⋮) → **Install app**
2. AgroVersa should appear as a standalone app icon
3. Open it — it should work full-screen with the floating glass bottom nav

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| `docker-compose up` fails | Make sure Docker Desktop is running. Check `docker --version` |
| Server shows "DB init failed" | PostgreSQL might already be using port 5432. Stop it or change the port in `docker-compose.yml` |
| Sync chip shows "offline" | You opened the app as a `file://` URL. Use `http://localhost:3000` instead |
| Sync chip shows "failed" | Check the server is running: `curl http://localhost:3000/devices?username=test` |
| Notifications don't appear | Check browser notification permissions. Chrome → Settings → Site Settings → Notifications |
| Fingerprint doesn't work | Chrome requires HTTPS for WebAuthn. Use `localhost` (treated as secure) or set up HTTPS |
| Excel import shows "No valid rows" | Check your CSV has a header row matching the export format. Download the export first as a template |
| Lock doesn't appear after 10s | Fingerprint must be enabled first. Check Settings → Security says "Fingerprint sign-in is on" |
| Second device can't sign in | The server must be reachable from the second device. Use the computer's IP, not `localhost` |
| `npm run build` fails | Run `npm install` first. Check Node version: `node --version` (needs 20.11+) |
