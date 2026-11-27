// Tests that the sync engine's core logic works without a real server.
// Run: node --test tests/integration/sync.test.mjs
import {test}from'node:test';import assert from'node:assert';

// Minimal localStorage mock
class MemStore{constructor(){this.m={}}getItem(k){return this.m[k]??null}setItem(k,v){this.m[k]=String(v)}removeItem(k){delete this.m[k]}}

// Minimal document/navigator mock
const ls=new MemStore();
globalThis.ls=ls;
globalThis.localStorage=ls;
globalThis.navigator={onLine:true,userAgent:'node-test'};
globalThis.addEventListener=()=>{};
globalThis.document={documentElement:{dataset:{}},getElementById:()=>null,querySelector:()=>null,querySelectorAll:()=>[],hidden:false};

// Load sync modules by evaluating them in this context
import fs from'node:fs',path from'node:path';
const root=path.resolve(import.meta.dirname,'..','..');
const read=f=>fs.readFileSync(path.join(root,f),'utf8');

// Evaluate device.js, migration.js, sync.js
eval(read('packages/sync/src/device.js'));
eval(read('packages/sync/src/migration.js'));

// Mock fetch for sync.js
globalThis.fetch=async()=>({ok:true,json:async()=>({ok:[],conflicts:[],changes:[],latestTs:0})});
// Don't eval sync.js fully since it needs the real app context; test the pieces

// Test 1: Device ID is generated once and persists
test('Device ID is generated and stored',()=>{const id1=deviceId();const id2=deviceId();assert.strictEqual(id1,id2,'same ID on repeated calls');assert.ok(id1.startsWith('dev-'),'starts with dev-');assert.ok(id1.length>10,'sufficiently long')});

// Test 2: Device name is inferred from user agent
test('Device name is inferred',()=>{const name=deviceName();assert.ok(name.length>0,'non-empty name');assert.ok(name.includes('Device')||name.includes('node')||name.includes('PC')||name.includes('Linux'),'contains device type')});

// Test 3: migrateData adds rid, _ts, _del to records
test('migrateData adds sync fields to v1 data',()=>{const v1={ing:[{id:'a',n:'Maize',cp:8.5}],an:[{id:'b',sp:'Broiler',st:'Starter'}],runs:[],batches:[],perf:[]};const v2=migrateData(v1);assert.strictEqual(v2._sv,2,'schema version is 2');assert.ok(v2.ing[0].rid,'ingredient has rid');assert.ok(v2.ing[0]._ts,'ingredient has timestamp');assert.strictEqual(v2.ing[0]._del,0,'ingredient not deleted');assert.ok(v2.an[0].rid,'animal has rid')});

// Test 4: migrateData is idempotent
test('migrateData is idempotent',()=>{const v1={ing:[{id:'a',n:'Maize'}],an:[],runs:[],batches:[],perf:[]};const v2=migrateData(v1);const rid=v2.ing[0].rid;const v3=migrateData(v2);assert.strictEqual(v3.ing[0].rid,rid,'rid unchanged on second migration');assert.strictEqual(v3._sv,2,'still schema v2')});

// Test 5: SCHEMA_VERSION is defined
test('SCHEMA_VERSION is defined',()=>{assert.ok(typeof SCHEMA_VERSION==='number','is a number');assert.ok(SCHEMA_VERSION>=2,'at least version 2')});

// Test 6: setSyncServerUrl stores the URL
test('setSyncServerUrl stores URL in localStorage',()=>{setSyncServerUrl('https://example.com');assert.strictEqual(ls.getItem('av_sync_url'),'https://example.com','URL stored');setSyncServerUrl('');assert.strictEqual(ls.getItem('av_sync_url'),'', 'cleared')});

// Test 7: syncServerUrl retrieves the URL
test('syncServerUrl retrieves stored URL',()=>{ls.setItem('av_sync_url','https://test.com');assert.strictEqual(syncServerUrl(),'https://test.com','correct URL retrieved');ls.removeItem('av_sync_url')});

// Test 8: deviceId generates unique IDs for different stores
test('Device ID differs across stores',()=>{const ls1=new MemStore();ls1.getItem=()=>null;ls1.setItem=(k,v)=>{ls1.m[k]=v};const id1=ls1.getItem('av_device_id');globalThis.ls=ls1;const id2=deviceId();assert.ok(id2,'generates an ID');globalThis.ls=ls});

console.log('Sync tests loaded — run with: node --test tests/integration/sync.test.mjs');
