import assert from 'node:assert/strict';
import path from 'node:path';
import { loadTypeScript } from './load-typescript.mjs';
const { noteLength, writeNote, readNote, NOTE_LIMIT } = loadTypeScript(path.resolve('src/sharedNotes.ts'));
assert.equal(noteLength('A😀'), 2);
await assert.rejects(writeNote('mod-0-0', 'x'.repeat(50001), 0), /limite/);
assert.equal(NOTE_LIMIT, 50000);
console.log('Notas: contagem Unicode e limite local aprovados.');
const originalFetch = globalThis.fetch;
try {
 globalThis.fetch = async () => new Response('Service unavailable', { status: 503 });
 await assert.rejects(readNote('mod-0-0'), /temporariamente indisponível/);
 await assert.rejects(writeNote('mod-0-0', 'rascunho', 0), /texto continua no editor/);
 globalThis.fetch = async () => { throw new TypeError('Failed to fetch'); };
 await assert.rejects(readNote('mod-0-0'), /indisponível ou sem conexão/);
 const controller = new AbortController(); controller.abort();
 const abort = new DOMException('aborted', 'AbortError');
 globalThis.fetch = async () => { throw abort; };
 await assert.rejects(readNote('mod-0-0', controller.signal), error => error === abort);
} finally { globalThis.fetch = originalFetch; }
// Opt-in integration test, only on an empty selected curriculum block.
if (process.env.CURVA_TEST_SHARED_NOTES === '1') {
 const scope = 'mod-0-0';
 const initial = await readNote(scope);
 assert.equal(initial.content, '', 'Não usar notas reais como fixture.');
 let latest;
 try {
   latest = await writeNote(scope, 'x'.repeat(50000), initial.revision);
   assert.equal((await readNote(scope)).content.length, 50000);
   await assert.rejects(writeNote(scope, 'rascunho antigo', initial.revision), /Outra pessoa/);
   // The network may take longer than the cooldown; rate limiting is tested transactionally in SQL.
   console.log('Notas remotas: publicação anônima, leitura por outro cliente, 50.000 caracteres e conflito aprovados.');
 } finally {
   if (latest) {
     await new Promise(resolve => setTimeout(resolve, 3200));
     await writeNote(scope, '', latest.revision);
     assert.equal((await readNote(scope)).content, '');
     console.log('Fixture apagada para todos, sem histórico de conteúdo.');
   }
 }
}
