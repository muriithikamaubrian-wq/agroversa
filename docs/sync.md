# AgroVersa Sync

## Overview

AgroVersa syncs data across devices using a central PostgreSQL server. The app works offline; changes queue locally and sync when internet returns.

## Features

| Feature | How it works |
|---------|-------------|
| Device ID | Generated once per install, stored in localStorage as `av_device_id` |
| Record ID | Each record gets a `rid` (e.g. `rec-1700000000-a1b2c3`) via `migrateData()` |
| Change tracking | `save()` calls `syncTrack()` for every record with a `rid` |
| Sync queue | Pending changes stored in localStorage as `av_sync_queue` |
| Retry | Exponential backoff: 10s → 20s → 40s → 80s → 160s → 300s max. Also retries on `online` event and tab focus |
| Conflict detection | Server compares timestamps; newer edit wins. Other version kept as `_conflict` on the record |
| Soft deletion | Records marked `_del:1` instead of removed; server stores delete actions |
| Sync status | `syncChip()` returns a chip showing offline/idle/syncing/synced/failed |
| Sync history | Last 50 sync events stored in localStorage as `av_sync_hist` |
| Schema version | `SCHEMA_VERSION=2` in `migration.js`. `migrateData()` adds `rid`, `_ts`, `_del` to old records |

## Setup

### 1. Start the server

```bash
# Using Docker (recommended)
docker-compose up -d

# Or manually
cd apps/server
npm install
DATABASE_URL=postgres://postgres:postgres@localhost:5432/agroversa npm start
```

The server runs on port 3000.

### 2. Configure the app

In AgroVersa → Settings → Sync:
- Enter the server address (e.g. `https://your-server.com`)
- Tap "Sync now"

### 3. Cross-device login

1. Create account on Device A (while online, with sync server configured)
2. On Device B, install the app, enter the same sync server URL
3. Sign in with the same username and password
4. Account data downloads to Device B

### 4. Push notifications

For push notifications when the app is closed:
- Server must run on HTTPS
- Generate VAPID keys: `npx web-push generate-vapid-keys`
- Set `VAPID_PUBLIC` and `VAPID_PRIVATE` environment variables
- The app subscribes to push on sign-in

## API endpoints

| Method | Path | Purpose |
|--------|------|---------|
| POST | `/account/register` | Create account on server |
| POST | `/account/login` | Authenticate + download data |
| POST | `/account/password` | Sync password change |
| POST | `/sync/push` | Push queued changes |
| GET | `/sync/pull` | Pull changes since last sync |
| POST | `/device/heartbeat` | Update device last-active |
| GET | `/devices` | List linked devices |
| POST | `/device/logout` | Log out a remote device |
| POST | `/push/subscribe` | Store push subscription |
| POST | `/notify/test` | Send test push notification |
| POST | `/notify` | Send push notification to all devices |

## Conflict resolution

Last-write-wins: the server compares `_ts` timestamps. The newer edit replaces the older one. The losing version is stored as `_conflict` on the record and shown in Settings with a "Use the other" button.

## Limitations

- Browser storage (localStorage) is used locally. SQLite for PC/Android is planned.
- Password reset via pattern only works on the local device.
- Stock edits from two offline devices resolve to the newer edit (not summed).
