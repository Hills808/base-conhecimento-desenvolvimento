import { test } from 'node:test';
import assert from 'node:assert/strict';
import worker from './worker.mjs';

test('private management, public download and limits with simulated R2', async () => {
  const storage = new Map();
  const bucket = {
    async head(key) { return storage.get(key) || null; },
    async get(key) { return storage.get(key) || null; },
    async put(key, bytes, options) { assert.equal(options.onlyIf.get('if-none-match'), '*'); if (storage.has(key)) return null; const object = { body: bytes, size: bytes.length, customMetadata: options.customMetadata }; storage.set(key, object); return object; },
    async delete(key) { storage.delete(key); }
  };
  const secret = 'a'.repeat(40);
  const env = { ATTACHMENTS: bucket, ATTACHMENTS_ADMIN_SECRET: secret, DB: { prepare() { return { bind(scope) { return { async first() { return scope === 'mod-0-0' ? { scope } : null; } }; } }; } } };
  const url = 'https://example.test/attachments?scope=mod-0-0';
  const upload = (name, body, password = secret) => worker.fetch(new Request(url, { method: 'POST', headers: { Authorization: `Bearer ${password}`, 'X-File-Name': encodeURIComponent(name) }, body }), env);
  try {
    assert.equal((await upload('x.txt', 'hello', 'wrong')).status, 401);
    assert.equal((await upload('x.exe', 'hello')).status, 415);
    assert.equal((await upload('fake.pdf', 'hello')).status, 415);
    assert.equal((await upload('large.txt', 'x'.repeat(5 * 1024 * 1024 + 1))).status, 413);
    const uploads = await Promise.all(Array.from({ length: 6 }, (_, i) => upload(`${i}.txt`, `file ${i}`)));
    assert.deepEqual(uploads.map(r => r.status).sort(), [201, 201, 201, 201, 201, 409]);
    const listed = await (await worker.fetch(new Request(url), env)).json();
    assert.equal(listed.length, 5);
    assert.equal(new Set(listed.map(x => x.slot)).size, 5);
    const download = await worker.fetch(new Request(`${url}&slot=0`), env);
    assert.equal(download.status, 200);
    assert.match(download.headers.get('Content-Disposition'), /^attachment;/);
    assert.match(await download.text(), /^file \d$/);
    assert.equal((await worker.fetch(new Request(`${url}&slot=0`, { method: 'DELETE' }), env)).status, 401);
    assert.equal((await worker.fetch(new Request(`${url}&slot=0`, { method: 'DELETE', headers: { Authorization: `Bearer ${secret}` } }), env)).status, 200);
    assert.equal((await worker.fetch(new Request(`${url}&slot=0`), env)).status, 404);
    assert.equal((await upload('novo.md', 'olá')).status, 201);
    delete env.ATTACHMENTS_ADMIN_SECRET;
    assert.equal((await upload('x.txt', 'hello')).status, 401);
  } finally { storage.clear(); }
});
