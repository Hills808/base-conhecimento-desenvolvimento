import { test } from 'node:test';
import assert from 'node:assert/strict';
import { DatabaseSync } from 'node:sqlite';
import { readFileSync } from 'node:fs';
import worker from './worker.mjs';

function localD1(sqlite) {
  return {
    prepare(sql) { return { bind(...params) { return { sql, params, async first() { return sqlite.prepare(sql).get(...params) ?? null; } }; } }; },
    async batch(statements) {
      sqlite.exec('BEGIN');
      try {
        const results = statements.map(({ sql, params }) => {
          const stmt = sqlite.prepare(sql);
          if (/^\s*SELECT/i.test(sql)) return { results: stmt.all(...params).map(row => Object.fromEntries(Object.entries(row).map(([key, value]) => [key, value instanceof Uint8Array ? Array.from(value) : value]))) };
          const result = stmt.run(...params);
          return { meta: { changes: result.changes }, results: [] };
        });
        sqlite.exec('COMMIT');
        return results;
      } catch (error) { sqlite.exec('ROLLBACK'); throw error; }
    },
  };
}
test('D1 chunks: boundaries, concurrency, public download and authorization', async () => {
  const sqlite = new DatabaseSync(':memory:');
  sqlite.exec(readFileSync(new URL('./attachments-schema.sql', import.meta.url), 'utf8'));
  const notes = new DatabaseSync(':memory:');
  notes.exec("CREATE TABLE shared_study_notes (scope TEXT PRIMARY KEY); INSERT INTO shared_study_notes VALUES ('mod-0-0');");
  const env = { ATTACHMENTS_DB: localD1(sqlite), DB: localD1(notes), ATTACHMENTS_ADMIN_SECRET: 's'.repeat(40) };
  const url = 'https://example.test/attachments?scope=mod-0-0';
  const upload = (name, data, key = env.ATTACHMENTS_ADMIN_SECRET) => worker.fetch(new Request(url, { method: 'POST', headers: { authorization: `Bearer ${key}`, 'x-file-name': encodeURIComponent(name) }, body: data }), env);
  assert.equal((await upload('a.txt', 'text', 'bad')).status, 401);
  const bytes = new Uint8Array(5 * 1024 * 1024).fill(65);
  assert.equal((await upload('m�ximo.txt', bytes)).status, 201);
  const response = await worker.fetch(new Request(`${url}&slot=0`), env);
  assert.equal(response.status, 200);
  assert.match(response.headers.get('content-disposition'), /attachment;/);
  assert.deepEqual(new Uint8Array(await response.arrayBuffer()), bytes);
  assert.equal((await upload('too-big.txt', new Uint8Array(bytes.length + 1).fill(65))).status, 413);
  const others = await Promise.all(Array.from({length: 5}, (_, i) => upload(`${i}.txt`, `file ${i}`)));
  assert.deepEqual(others.map(r => r.status).sort(), [201, 201, 201, 201, 409]);
  assert.equal((await worker.fetch(new Request(`${url}&slot=0`, {method:'DELETE'}), env)).status, 401);
  assert.equal((await worker.fetch(new Request(`${url}&slot=0`, {method:'DELETE', headers: {authorization:`Bearer ${env.ATTACHMENTS_ADMIN_SECRET}`}}), env)).status, 200);
  assert.equal((await worker.fetch(new Request(`${url}&slot=0`), env)).status, 404);
  assert.equal(sqlite.prepare("SELECT count(*) AS n FROM attachment_chunks WHERE object_key='attachments/mod-0-0/0'").get().n, 0);
  sqlite.close(); notes.close();
});
