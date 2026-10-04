import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import ts from 'typescript';
import { test } from 'node:test';

const events = new EventTarget();
const disk = new Map(); let blocked = false;
globalThis.localStorage = { getItem: key => disk.get(key) ?? null, setItem: (key, value) => { if (blocked) throw new Error('blocked'); disk.set(key, value); } };
globalThis.window = events;
globalThis.CustomEvent = class extends Event { constructor(type, options) { super(type); this.detail = options?.detail; } };
const cache = new Map();
function load(file) {
  if (cache.has(file)) return cache.get(file).exports;
  if (file.endsWith('.json')) return JSON.parse(fs.readFileSync(file, 'utf8'));
  const module = { exports: {} }; cache.set(file, module);
  const code = ts.transpileModule(fs.readFileSync(file, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true } }).outputText;
  const require = spec => { const target = path.resolve(path.dirname(file), spec); return load(fs.existsSync(target) ? target : `${target}.ts`); };
  vm.runInThisContext(`(function(require,module,exports){${code}\n})`, { filename: file })(require, module, module.exports);
  return module.exports;
}
const src = name => load(path.resolve('src', `${name}.ts`));
const storage = src('studyStorage'), focus = src('focusSession'), progress = src('moduleProgress'), drafts = src('practiceDrafts'), practice = src('learningPractice'), backup = src('studyBackup');
test('pause preserves seconds and wall time survives delayed ticks', () => {
  for (const seconds of [601, 59, 1, 0]) assert.equal(focus.remainingSeconds(null, seconds, 1000), seconds);
  assert.equal(focus.remainingSeconds(602000, 1500, 1000), 601);
  assert.equal(focus.remainingSeconds(602000, 1500, 603000), 0);
});
test('focus migrates old sessions and accepts a 140-character goal', () => {
  assert.equal(focus.parseFocus({ duration: 25, stepId: 'http', goal: 'a'.repeat(140) }).goal.length, 140);
  assert.equal(focus.parseFocus({ duration: 25, stepId: 'http' }).remaining, 1500);
  assert.equal(focus.parseFocus({ duration: -1, stepId: 'http' }), null);
});
test('malformed maps and dates do not become progress', () => {
  const value = progress.parseModuleProgress({ done: ['2-0', '2-0', '9-9'], drafts: [], completedAt: { '2-0': 'wrong' }, lastByModule: { 2: 99 }, passed: ['mod-2-0-999'] });
  assert.deepEqual(value.done, ['2-0']); assert.deepEqual(value.drafts, {}); assert.deepEqual(value.completedAt, {}); assert.deepEqual(value.lastByModule, {}); assert.deepEqual(value.passed, []);
});
test('unavailable storage keeps progress across readers and emits an honest status', () => {
  blocked = true; const old = storage.readStored(progress.moduleProgressKey);
  assert.equal(progress.saveModuleProgress(progress.parseModuleProgress({ drafts: { '2-0': 'Minha evidência' } })), false);
  assert.equal(progress.readModuleProgress().drafts['2-0'], 'Minha evidência');
  assert(storage.failedStorageKeys().includes(progress.moduleProgressKey));
  blocked = false; storage.writeStored(progress.moduleProgressKey, old); assert(!storage.failedStorageKeys().includes(progress.moduleProgressKey));
});
test('practice draft persists without registering an attempt', () => {
  drafts.saveDraft('mod-2-0', 'Uma resposta ainda em construção', 'contract');
  assert.equal(drafts.readDrafts()['mod-2-0'].obstacle, 'contract'); assert.equal(practice.readPractice()['mod-2-0'], undefined);
});
test('advance review only after its due date', () => {
  const previous = { due: '2026-10-10T00:00:00.000Z', interval: 0 };
  assert.equal(practice.nextPractice(previous, new Date('2026-10-09'), true).interval, 0);
  assert.equal(practice.nextPractice(previous, new Date('2026-10-10'), true).interval, 1);
  assert.equal(practice.nextPractice(previous, new Date('2026-10-10'), false).interval, 0);
});
test('backup round-trip and merge preserve conflicting text by default', () => {
  const value = backup.parseBackup(JSON.stringify(backup.makeBackup())); assert.equal(value.version, 1);
  const current = progress.parseModuleProgress({ drafts: { '2-0': 'atual' } }); const incoming = progress.parseModuleProgress({ drafts: { '2-0': 'importado', '2-1': 'novo' } });
  const merged = backup.mergeSection(progress.moduleProgressKey, current, incoming, false);
  assert.equal(merged.drafts['2-0'], 'atual'); assert.equal(merged.drafts['2-1'], 'novo');
  assert.equal(backup.mergeSection(progress.moduleProgressKey, current, incoming, true).drafts['2-0'], 'importado');
});
test('unknown, oversized, corrupt imports cannot overwrite progress', () => {
  assert.throws(() => backup.parseBackup(JSON.stringify({ format: 'curva-aberta', version: 1, exportedAt: new Date().toISOString(), data: { arbitrary: {} } })));
  assert.throws(() => backup.parseBackup('x'.repeat(2_000_001)));
  assert.throws(() => backup.parseBackup('{broken'));
});
test('a durable recovery point is required before import', () => {
  const before = backup.makeBackup(); blocked = true;
  assert.throws(() => backup.restoreBackup(before, false)); blocked = false;
  assert.equal(backup.restoreBackup(before, false), true);
  assert.equal(storage.readStored('curva-aberta-backup-recovery-v1').format, 'curva-aberta');
});

const { loadTypeScript } = await import('./load-typescript.mjs');
const React = await import('react'); const { renderToString } = await import('react-dom/server');
test('focus renders a restored long goal and exact paused seconds', () => {
  const runtime = loadTypeScript(path.resolve('src/studyStorage.ts'));
  runtime.writeStored('curva-aberta-focus-v1', { mode: 'focus', duration: 25, remaining: 601, endsAt: null, goal: 'a'.repeat(140), stepId: 'test-step', stepTitle: 'Test' });
  const Component = loadTypeScript(path.resolve('src/StudyFocus.tsx')).default;
  const html = renderToString(React.createElement(Component, { stepId: 'test-step', stepTitle: 'Test', suggestedGoal: 'Ler JSON' }));
  assert(html.includes('10:01')); assert(html.includes('a'.repeat(140))); assert(html.includes('Reiniciar'));
});
test('material metadata does not infer a language or duration from an unknown URL', () => {
  const { getResourceMeta } = loadTypeScript(path.resolve('src/resourceMeta.ts'));
  const value = getResourceMeta({ url: 'https://example.test/pt/video', type: 'Vídeo', section: 'Estudo' });
  assert.equal(value.language, 'Idioma não verificado'); assert.equal(value.time, 'Duração não verificada'); assert.equal(value.estimatedMinutes, null);
});
test('restored module evidence still needs its reasoning verification', () => {
  const value = progress.parseModuleProgress({ done: ['2-0'], drafts: { '2-0': 'Minha entrega antiga' } });
  assert.equal(progress.isStageVerified(value, 2, 0), false);
  value.passed = ['mod-2-0-0']; assert.equal(progress.isStageVerified(value, 2, 0), true);
});
