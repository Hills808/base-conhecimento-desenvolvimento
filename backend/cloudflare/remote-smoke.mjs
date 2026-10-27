// Explicit one-time remote smoke test. Uses an already-empty snapshot block only.
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { setTimeout as pause } from 'node:timers/promises';
import { validate } from './transfer.mjs';
const endpoint = process.argv[2];
if (endpoint !== 'https://curva-aberta-notes.henrique-2013ale.workers.dev/rest/v1/shared_study_notes' || !process.argv.includes('--allow-empty-fixture')) throw Error('Explicit production endpoint and empty-fixture opt-in required');
const rows = validate(JSON.parse(await readFile(new URL('./migration-data/notes.json', import.meta.url), 'utf8')));
const original = rows.find(row => row.content === '');
if (!original) throw Error('No empty block available; no note was modified');
const config = JSON.parse(await readFile(new URL('./wrangler.jsonc', import.meta.url), 'utf8'));
const account = process.env.CLOUDFLARE_ACCOUNT_ID;
const token = process.env.CLOUDFLARE_API_TOKEN;
if (!account || !token) throw Error('Existing CI credentials required; never print them');
const dbURL = `https://api.cloudflare.com/client/v4/accounts/${account}/d1/database/${config.d1_databases[0].database_id}/query`;
const url = endpoint + '?scope=eq.' + original.scope;
const origin = 'https://hills808.github.io';
const request = (method='GET', content, revision=0, headers={}) => fetch(url + (method==='PATCH' ? '&revision=eq.'+revision : ''), { method, signal: AbortSignal.timeout(30000), cache:'no-store', headers: {Origin:origin, ...(method==='PATCH' ? {'Content-Type':'application/json','x-curva-revision':String(revision)} : {}), ...headers}, ...(method==='PATCH' ? {body:JSON.stringify({content})} : {}) });
const read = async () => { const r=await request(); assert.equal(r.status,200,'anonymous read'); return (await r.json())[0]; };
let last = null;
try {
  const initial=await read();
  assert.ok(['scope','content','revision','updated_at'].every(k=>initial[k]===original[k]), 'Fixture changed; refusing to write');
  assert.equal((await request('OPTIONS')).status,204,'CORS preflight');
  assert.equal((await request('GET',undefined,0,{Origin:'https://other.example'})).status,403,'disallowed origin');
  assert.equal((await request('PATCH','😀'.repeat(50001),original.revision)).status,413,'50,001 rejected');
  const large='😀'.repeat(50000);
  const published=await request('PATCH',large,original.revision);
  assert.equal(published.status,200,'50,000 Unicode points accepted');
  last=(await published.json())[0];
  assert.equal(last.content,large,'large response exact');
  assert.equal((await read()).content,large,'second anonymous client reads same note');
  assert.equal((await request('PATCH','stale-fixture',original.revision)).status,409,'stale revision conflicts');
  // Wait for the server cooldown before two simultaneous edits.
  await pause(3200);
  const edits=['migration-fixture-A','migration-fixture-B'];
  const concurrent=await Promise.all(edits.map(text=>request('PATCH',text,last.revision)));
  assert.deepEqual(concurrent.map(r=>r.status).sort(),[200,409],'exactly one concurrent edit wins');
  const winner=concurrent.find(r=>r.status===200);
  last=(await winner.json())[0];
  assert.ok(edits.includes(last.content),'winning edit preserved');
  assert.equal((await read()).content,last.content,'second client sees winning edit');
  await pause(3200);
  const cleared=await request('PATCH','',last.revision);
  assert.equal(cleared.status,200,'public deletion');
  last=(await cleared.json())[0];
  assert.equal(last.content,'','deletion response empty');
  assert.equal((await read()).content,'','shared deletion visible');
  console.log('REMOTE PASS: anonymous read/write/delete, two clients, concurrent conflict, 50,000 emojis, 50,001 rejection, CORS.');
} finally {
  // Restore only our last confirmed fixture state; never overwrite a concurrent visitor edit.
  if (last) {
    const response=await fetch(dbURL,{method:'POST',signal:AbortSignal.timeout(30000),headers:{Authorization:'Bearer '+token,'Content-Type':'application/json'},body:JSON.stringify({sql:'UPDATE shared_study_notes SET content = ?1, revision = ?2, updated_at = ?3 WHERE scope = ?4 AND revision = ?5 AND content = ?6 AND updated_at IS ?7 RETURNING scope',params:[original.content,original.revision,original.updated_at,original.scope,last.revision,last.content,last.updated_at]})});
    const result=await response.json();
    if (!response.ok || !result.success || result.result?.[0]?.results?.length!==1) throw Error('Conditional fixture restoration failed; inspect without overwriting visitor data');
    console.log('Fixture restored including original revision and timestamp; no real note was changed.');
  }
}
