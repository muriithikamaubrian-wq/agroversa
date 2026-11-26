// Schema version — migrates local data when the app updates.
const SCHEMA_VERSION = 2;

function migrateData(d) {
  if (!d) return d;
  const v = d._sv || 1;
  if (v < 2) {
    // v2: add record IDs and timestamps to all collections for sync
    const now = Date.now();
    const ensure = (arr) => arr.forEach(r => {
      if (!r.rid) r.rid = 'rec-' + now + '-' + Math.random().toString(36).slice(2, 8);
      if (!r._ts) r._ts = now;
      if (!r._del) r._del = 0;
    });
    if (d.ing) ensure(d.ing);
    if (d.an) ensure(d.an);
    if (d.runs) ensure(d.runs);
    if (d.batches) ensure(d.batches);
    if (d.perf) ensure(d.perf);
    if (d.gr) ensure(d.gr);
    if (d.wt) ensure(d.wt);
    if (d.mt) ensure(d.mt);
    if (d.ev) ensure(d.ev || (d.ev = []));
    if (d.mv) ensure(d.mv || (d.mv = []));
    d._sv = SCHEMA_VERSION;
  }
  return d;
}
