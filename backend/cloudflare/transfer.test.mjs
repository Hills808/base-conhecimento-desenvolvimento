import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { DatabaseSync } from 'node:sqlite';
import { validate } from './transfer.mjs';
test('transfer requires all fixed scopes, valid Unicode, revisions and timestamps', () => {
 const db = new DatabaseSync(':memory:');
 db.exec(readFileSync(new URL('./migrations/0001_shared_notes.sql', import.meta.url), 'utf8'));
 const rows = db.prepare('SELECT * FROM shared_study_notes').all().map(row => ({ ...row }));
 assert.equal(validate(structuredClone(rows)).length, 59);
 assert.throws(() => validate(rows.slice(1)), /59/);
 const duplicate = structuredClone(rows); duplicate[0] = duplicate[1];
 assert.throws(() => validate(duplicate), /59/);
 for (const change of [{ content: 'x'.repeat(50001) }, { revision: -1 }, { updated_at: 'bad' }, { content: 'x\0y' }, { content: '\ud800' }]) {
  const bad = structuredClone(rows); Object.assign(bad[0], change);
  assert.throws(() => validate(bad), /Invalid/);
 }
 rows[0].content = '😀'.repeat(50000);
 assert.equal(validate(rows).some(row => Array.from(row.content).length === 50000), true);
 db.close();
});
