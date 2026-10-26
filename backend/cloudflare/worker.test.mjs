import { test } from 'node:test';
import assert from 'node:assert/strict';
import { DatabaseSync } from 'node:sqlite';
import { readFileSync } from 'node:fs';
import worker from './worker.mjs';

function setup() {
  const db = new DatabaseSync(':memory:');
  db.exec(readFileSync(new URL('./migrations/0001_shared_notes.sql', import.meta.url), 'utf8'));
  const env = { WRITES_ENABLED: 'true', DB: { prepare(sql) { return { bind(...args) { return { async first() { return db.prepare(sql).get(...args) || null; } }; } }; } } };
  const call = (method = 'GET', content, revision = 0, extra = {}) => worker.fetch(new Request(`https://notes.example/rest/v1/shared_study_notes?scope=eq.mod-0-0&revision=eq.${revision}`, { method, headers: { Origin: 'https://hills808.github.io', 'Content-Type': 'application/json', 'x-curva-revision': String(revision), ...extra }, ...(method === 'PATCH' ? { body: JSON.stringify({ content }) } : {}) }), env);
  return { db, env, call };
}

test('59 seeded blocks, anonymous read, CORS, no cache, maintenance and methods', async () => {
  const { db, env, call } = setup();
  assert.equal(db.prepare('SELECT count(*) n FROM shared_study_notes').get().n, 59);
  const response = await call();
  assert.equal(response.status, 200);
  assert.equal(response.headers.get('Cache-Control'), 'no-store');
  assert.equal(response.headers.get('Access-Control-Allow-Origin'), 'https://hills808.github.io');
  assert.equal((await response.json())[0].content, '');
  assert.equal((await call('GET', null, 0, { Origin: 'https://other.example' })).status, 403);
  assert.equal((await call('DELETE')).status, 405);
  assert.equal((await call('OPTIONS')).status, 204);
  env.WRITES_ENABLED = 'false';
  assert.equal((await call('PATCH', 'maintenance')).status, 503);
  db.close();
});

test('50,000 Unicode code points accepted; 50,001, NUL and oversized bodies rejected', async () => {
  const { db, call } = setup();
  assert.equal((await call('PATCH', '😀'.repeat(50001))).status, 413);
  assert.equal((await call('PATCH', 'x\0y')).status, 400);
  assert.equal((await call('PATCH', '\ud800')).status, 400);
  assert.equal((await call('PATCH', 'x'.repeat(600101))).status, 413);
  const response = await call('PATCH', '😀'.repeat(50000));
  assert.equal(response.status, 200);
  const row = (await response.json())[0];
  assert.equal(Array.from(row.content).length, 50000);
  assert.equal(row.revision, 1);
  assert.equal((await call()).status, 200);
  assert.throws(() => db.prepare('UPDATE shared_study_notes SET content = ? WHERE scope = ?').run('x'.repeat(50001), 'mod-0-0'), /CHECK/);
  db.close();
});

test('atomic revision, cooldown, concurrent edits and public deletion', async () => {
  const { db, call } = setup();
  const responses = await Promise.all([call('PATCH', 'first'), call('PATCH', 'second')]);
  assert.deepEqual(responses.map(r => r.status).sort(), [200, 409]);
  assert.equal((await call('PATCH', 'stale', 0)).status, 409);
  assert.equal((await call('PATCH', 'too soon', 1)).status, 429);
  db.exec("UPDATE shared_study_notes SET updated_at = '2000-01-01T00:00:00.000Z' WHERE scope = 'mod-0-0'");
  assert.equal((await call('PATCH', '', 1)).status, 200);
  assert.equal((await (await call()).json())[0].content, '');
  db.close();
});

test('unknown scopes, missing revision, injected SQL and unexpected fields fail closed', async () => {
  const { db, env, call } = setup();
  assert.equal((await call('PATCH', 'bad', 0, { 'x-curva-revision': '-1' })).status, 400);
  for (const scope of ['eq.unknown', "eq.mod-0-0' OR 1=1"]) {
    const response = await worker.fetch(new Request(`https://notes.example/rest/v1/shared_study_notes?scope=${encodeURIComponent(scope)}`), env);
    assert.ok([400, 404].includes(response.status));
  }
  const response = await worker.fetch(new Request('https://notes.example/rest/v1/shared_study_notes?scope=eq.mod-0-0&revision=eq.0', { method: 'PATCH', headers: { 'Content-Type': 'application/json', 'x-curva-revision': '0' }, body: JSON.stringify({ content: 'text', revision: 99 }) }), env);
  assert.equal(response.status, 400);
  assert.equal(db.prepare('SELECT count(*) n FROM shared_study_notes WHERE revision <> 0').get().n, 0);
  db.close();
});
