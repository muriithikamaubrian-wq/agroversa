// Sync engine — change tracking, sync queue, retry, conflict detection,
// soft deletion, sync status, sync history. Talks to the central server.

let SYNC_STATUS = 'offline'; // offline | idle | syncing | synced | failed
let SYNC_QUEUE = [];
let SYNC_HISTORY = [];
let SYNC_RUNNING = false;
let SYNC_RETRY_MS = 10000;
let SYNC_TIMER = null;

const syncServerUrl = () => ls.get('av_sync_url') || '';
const setSyncServerUrl = (u) => ls.set('av_sync_url', u);

function syncInit() {
  // Load queue and history from storage
  try { SYNC_QUEUE = JSON.parse(ls.get('av_sync_queue') || '[]'); } catch { SYNC_QUEUE = []; }
  try { SYNC_HISTORY = JSON.parse(ls.get('av_sync_hist') || '[]'); } catch { SYNC_HISTORY = []; }
  if (!syncServerUrl()) { SYNC_STATUS = 'offline'; return; }
  SYNC_STATUS = navigator.onLine ? 'idle' : 'offline';
  syncRun();
  // Retry on reconnect
  addEventListener('online', () => { SYNC_STATUS = 'idle'; SYNC_RETRY_MS = 10000; syncRun(); });
  addEventListener('offline', () => { SYNC_STATUS = 'offline'; });
  // Retry on tab focus
  addEventListener('visibilitychange', () => { if (!document.hidden && SYNC_STATUS === 'failed') syncRun(); });
  // Periodic retry
  setInterval(() => { if (SYNC_STATUS === 'failed' && syncServerUrl()) syncRun(); }, 30000);
}

// Track a change — called automatically on every save()
function syncTrack(collection, rid, action, data) {
  if (!rid) return;
  const item = {
    id: 'ch-' + Date.now() + '-' + Math.random().toString(36).slice(2, 6),
    collection, rid, action: action || 'update',
    data: data ? JSON.parse(JSON.stringify(data)) : null,
    ts: Date.now(),
    retries: 0
  };
  SYNC_QUEUE.push(item);
  ls.set('av_sync_queue', JSON.stringify(SYNC_QUEUE));
  if (SYNC_STATUS === 'idle' || SYNC_STATUS === 'synced') syncRun();
}

async function syncRun() {
  if (SYNC_RUNNING) return;
  const url = syncServerUrl();
  if (!url || !navigator.onLine) { SYNC_STATUS = navigator.onLine ? 'idle' : 'offline'; return; }
  if (!SYNC_QUEUE.length && SYNC_STATUS === 'synced') return;
  SYNC_RUNNING = true;
  SYNC_STATUS = 'syncing';
  try {
    // Push pending changes
    const pending = SYNC_QUEUE.slice();
    if (pending.length) {
      const res = await fetch(url + '/sync/push', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: U, deviceId: deviceId(),
          deviceName: deviceName(),
          schema: SCHEMA_VERSION,
          changes: pending
        })
      });
      if (!res.ok) throw new Error('Push failed: ' + res.status);
      const result = await res.json();
      // Handle conflicts — server returns resolved versions
      if (result.conflicts && result.conflicts.length) {
        result.conflicts.forEach(c => {
          // Last-write-wins: keep server version (newer), store other for reference
          const coll = D[c.collection];
          if (coll) {
            const local = coll.find(r => r.rid === c.rid);
            if (local && c.other) {
              local._conflict = c.other; // Keep for "Use the other" button
            }
          }
        });
      }
      // Remove successfully synced items
      const syncedIds = new Set(result.ok || pending.map(p => p.id));
      SYNC_QUEUE = SYNC_QUEUE.filter(q => !syncedIds.has(q.id));
      ls.set('av_sync_queue', JSON.stringify(SYNC_QUEUE));
    }
    // Pull changes from server
    const pullRes = await fetch(url + '/sync/pull?username=' + q(U) + '&deviceId=' + q(deviceId()) + '&since=' + (ls.get('av_sync_since') || 0));
    if (!pullRes.ok) throw new Error('Pull failed: ' + pullRes.status);
    const pullData = await pullRes.json();
    if (pullData.changes && pullData.changes.length) {
      syncApplyChanges(pullData.changes);
      ls.set('av_sync_since', pullData.latestTs || Date.now());
      save();
    }
    // Update device info on server
    await fetch(url + '/device/heartbeat', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: U, deviceId: deviceId(), deviceName: deviceName() })
    });
    SYNC_STATUS = 'synced';
    SYNC_RETRY_MS = 10000;
    syncLog('synced', pending.length + ' pushed, ' + (pullData.changes ? pullData.changes.length : 0) + ' pulled');
  } catch (e) {
    SYNC_STATUS = 'failed';
    // Exponential backoff: 10s, 20s, 40s, 80s... max 5min
    SYNC_RETRY_MS = Math.min(SYNC_RETRY_MS * 2, 300000);
    syncLog('failed', e.message);
    if (SYNC_TIMER) clearTimeout(SYNC_TIMER);
    SYNC_TIMER = setTimeout(() => syncRun(), SYNC_RETRY_MS);
  } finally {
    SYNC_RUNNING = false;
  }
}

function syncApplyChanges(changes) {
  changes.forEach(ch => {
    if (!D[ch.collection]) return;
    const arr = D[ch.collection];
    const idx = arr.findIndex(r => r.rid === ch.rid);
    if (ch.action === 'delete') {
      // Soft delete — mark as deleted or remove if already soft-deleted locally
      if (idx >= 0) arr[idx]._del = 1, arr[idx]._ts = ch.ts;
    } else {
      if (idx >= 0) {
        // Update — last-write-wins
        if (ch.ts >= (arr[idx]._ts || 0)) {
          Object.assign(arr[idx], ch.data, { _ts: ch.ts, _del: 0 });
        }
      } else {
        // Insert
        arr.push({ ...ch.data, rid: ch.rid, _ts: ch.ts, _del: 0 });
      }
    }
  });
}

function syncLog(status, detail) {
  SYNC_HISTORY.unshift({ status, detail, ts: new Date().toISOString() });
  if (SYNC_HISTORY.length > 50) SYNC_HISTORY.pop();
  ls.set('av_sync_hist', JSON.stringify(SYNC_HISTORY));
}

// Sync status chip for the top bar
function syncChip() {
  if (!syncServerUrl()) return '';
  const pending = SYNC_QUEUE.length;
  const map = {
    offline: ['offline', 'mut'],
    idle: ['idle', 'mut'],
    syncing: ['syncing…', 'warn'],
    synced: [pending ? pending + ' pending' : 'synced', 'ok'],
    failed: ['retry', 'bad']
  };
  const [label, cls] = map[SYNC_STATUS] || ['—', 'mut'];
  return `<span class="chip ${cls}" style="font-size:11px;padding:2px 8px" onclick="syncRun()" title="${E(detail||'')}" role="button" tabindex="0">${E(label)}</span>`;
}

// Get linked devices from server
async function linkedDevices() {
  const url = syncServerUrl();
  if (!url) return [];
  try {
    const res = await fetch(url + '/devices?username=' + q(U));
    if (!res.ok) return [];
    return await res.json();
  } catch { return []; }
}

// Log out a remote device
async function logOutDevice(devId) {
  const url = syncServerUrl();
  if (!url) return;
  try {
    await fetch(url + '/device/logout', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: U, deviceId: devId })
    });
  } catch {}
}

// Register account on server for cross-device login
async function syncRegisterAccount(username, hash, salt, fn, pic) {
  const url = syncServerUrl();
  if (!url) return { ok: false, error: 'No sync server configured.' };
  try {
    const res = await fetch(url + '/account/register', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, hash, salt, fn, pic })
    });
    const data = await res.json();
    return data;
  } catch (e) { return { ok: false, error: 'Cannot reach the sync server.' }; }
}

// Sign in on a new device using server credentials
async function syncSignIn(username, password) {
  const url = syncServerUrl();
  if (!url) return { ok: false, error: 'No sync server configured.' };
  try {
    const res = await fetch(url + '/account/login', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password, deviceId: deviceId(), deviceName: deviceName() })
    });
    const data = await res.json();
    if (data.ok && data.data) {
      // Load data from server into this device
      D = migrateData(data.data);
      D._sv = SCHEMA_VERSION;
      save();
      ls.set('av_sync_since', data.latestTs || Date.now());
    }
    return data;
  } catch (e) { return { ok: false, error: 'Cannot reach the sync server.' }; }
}

// Sync password change to server
async function syncPasswordChange(username, hash, salt) {
  const url = syncServerUrl();
  if (!url) return;
  try {
    await fetch(url + '/account/password', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, hash, salt })
    });
  } catch {}
}

// Send a test notification via server
async function syncTestNotification() {
  const url = syncServerUrl();
  if (!url) return { ok: false, error: 'No sync server.' };
  try {
    const res = await fetch(url + '/notify/test', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: U, deviceId: deviceId() })
    });
    return await res.json();
  } catch { return { ok: false, error: 'Cannot reach server.' }; }
}

// Resolve a conflict by choosing the other version
function resolveConflict(collection, rid) {
  const arr = D[collection];
  if (!arr) return;
  const r = arr.find(x => x.rid === rid);
  if (r && r._conflict) {
    Object.assign(r, r._conflict, { _conflict: null });
    save();
    render();
  }
}

// Trigger sync now (manual button)
async function syncNow() {
  if (SYNC_RUNNING) {
    // Wait for the running sync to finish
    let tries = 0;
    while (SYNC_RUNNING && tries < 30) { await new Promise(r => setTimeout(r, 200)); tries++; }
    return;
  }
  SYNC_RETRY_MS = 10000;
  await syncRun();
}
