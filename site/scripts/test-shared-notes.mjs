import assert from 'node:assert/strict';
import path from 'node:path';
import { loadTypeScript } from './load-typescript.mjs';
const { noteLength, writeNote, readNote, NOTE_LIMIT } = loadTypeScript(path.resolve('src/sharedNotes.ts'));
assert.equal(noteLength('A😀'), 2);
await assert.rejects(writeNote('mod-0-0', 'x'.repeat(30001), 0), /limite/);
assert.equal(NOTE_LIMIT, 30000);
console.log('Notas: contagem Unicode e limite local aprovados.');
// Opt-in integration test, only on an empty selected curriculum block.
if (process.env.CURVA_TEST_SHARED_NOTES === '1') {
 const scope = 'mod-0-0';
 const initial = await readNote(scope);
 assert.equal(initial.content, '', 'Não usar notas reais como fixture.');
 let latest;
 try {
   latest = await writeNote(scope, 'x'.repeat(30000), initial.revision);
   assert.equal((await readNote(scope)).content.length, 30000);
   await assert.rejects(writeNote(scope, 'rascunho antigo', initial.revision), /Outra pessoa/);
   // The network may take longer than the cooldown; rate limiting is tested transactionally in SQL.
   console.log('Notas remotas: publicação anônima, leitura por outro cliente, 30.000 caracteres e conflito aprovados.');
 } finally {
   if (latest) {
     await new Promise(resolve => setTimeout(resolve, 3200));
     await writeNote(scope, '', latest.revision);
     assert.equal((await readNote(scope)).content, '');
     console.log('Fixture apagada para todos, sem histórico de conteúdo.');
   }
 }
}
