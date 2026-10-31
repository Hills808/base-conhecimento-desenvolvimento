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

const autonomy = src('autonomyProgress');
const exampleEvidence = () => ({ ...autonomy.emptyEvidence(), plan:'Minha previsão detalhada antes de executar a regra e seus limites.', build:'Entrada 25: esperado foco, obtido foco; código e saída em Program.cs.', explain:'Eu escolhi >= para incluir a fronteira de 25; o teste de 24 cobre a outra saída.', checks:[true,true,true] });
test('autonomy cannot skip prerequisites or complete from checks alone', () => {
 const now = Date.parse('2026-10-30T12:00:00Z');
 let value = autonomy.parseAutonomy({records:{prever:{...autonomy.emptyEvidence(),checks:[true,true,true]}}});
 assert.equal(autonomy.completeStage(value,0,now),value);
 value.records.prever=exampleEvidence(); value.records.decidir=exampleEvidence();
 assert.equal(autonomy.canOpen(value,1,now),false);
 assert.equal(autonomy.completeStage(value,1,now),value);
 value=autonomy.completeStage(value,0,now);
 assert.equal(autonomy.canOpen(value,1,now),true);
 assert.equal(autonomy.canOpen(value,2,now),false);
 assert.equal(autonomy.canOpen(value,1,now+86400000),false);
 assert.equal(autonomy.completeStage(value,0,now+1000),value, 'repeated completion cannot postpone a review');
});
test('autonomy help requires a reconstruction note and completion is validated on restore', () => {
 const record = {...exampleEvidence(), help:'ai', helpNote:''};
 assert.equal(autonomy.evidenceReady(record),false);
 record.helpNote='Recebi uma pista sobre limites e refiz o teste com 25 sem consultar.';
 assert.equal(autonomy.evidenceReady(record),true);
 const cleaned = autonomy.parseAutonomy({last:999,records:{unknown:record,prever:{completedAt:new Date().toISOString(),checks:[true,true,true]}}});
 assert.equal(cleaned.last,0); assert.equal(cleaned.records.unknown,undefined);
 assert.equal(autonomy.verifiedEvidence(cleaned.records.prever),false);
});
test('autonomy review requires due date, reconstruction and explanation before advancing', () => {
 const now=Date.parse('2026-10-30T12:00:00Z');
 let value=autonomy.completeStage(autonomy.parseAutonomy({records:{prever:exampleEvidence()}}),0,now);
 value.records.prever.reviewDraft='Expliquei sem consultar a diferença entre atribuir um valor e imprimir uma expressão.';
 value.records.prever.reviewBuild='Refiz em arquivo vazio com 15 e 12; obtive 27 e 54 e conferi minha previsão.';
 value.records.prever.reviewChecks=[true,true,true];
 assert.equal(autonomy.completeReview(value,0,now),value);
 const reviewed=autonomy.completeReview(value,0,now+86400000);
 assert.equal(reviewed.records.prever.reviewRound,1);
 assert.equal(Date.parse(reviewed.records.prever.reviewDue),now+4*86400000);
 assert.equal(autonomy.canOpen(reviewed,1,now+86400000),true);
 assert.equal(autonomy.completeReview(reviewed,0,now+86400000),reviewed);
});
test('autonomy drafts survive storage fallback and backup preserves current evidence', () => {
 const record=exampleEvidence(); blocked=true;
 assert.equal(autonomy.saveAutonomy({last:0,records:{prever:record}}),false);
 assert.equal(autonomy.readAutonomy().records.prever.build,record.build); blocked=false;
 const exported=backup.parseBackup(JSON.stringify(backup.makeBackup()));
 assert.equal(exported.data[autonomy.autonomyKey].records.prever.build,record.build);
 const current=autonomy.parseAutonomy({records:{prever:record}}), incoming=autonomy.parseAutonomy({records:{prever:{...record,build:'Versão importada que não deve substituir meu texto atual por padrão.'}}});
 assert.equal(backup.mergeSection(autonomy.autonomyKey,current,incoming,false).records.prever.build,record.build);
 assert.notEqual(backup.mergeSection(autonomy.autonomyKey,current,incoming,true).records.prever.build,record.build);
});

test('formation diagnosis targets a gap without completing a mission', () => {
  const f=src('formationProgress'); const p=f.parseFormation({diagnostic:{0:1,1:1,2:0,3:0}});
  assert.equal(f.suggestedMission(p).id,'C03'); assert.deepEqual(p.attempts,{});
  assert.equal(f.completeMission(p,'C03'),p);
});
test('formation completion needs correct predictions and practice, but not text length or calendar gates', () => {
  const f=src('formationProgress'); const p=f.parseFormation({attempts:{C03:{...f.freshAttempt(),answers:{0:1,1:1},checked:true,checks:[true,true]}}});
  assert(f.canComplete('C03',p.attempts.C03));
  const done=f.completeMission(p,'C03',Date.parse('2026-10-01'));
  assert.equal(done.attempts.C03.note,''); assert.equal(f.dueMissions(done,Date.parse('2026-10-09')).length,1);
  assert(f.canComplete('C03',done.attempts.C03));
  assert(!f.canComplete('C03',{...p.attempts.C03,answers:{0:0,1:1}}));
  assert.equal(f.completeMission(done,'C03'),done);
});
test('formation drafts and diagnoses round-trip through backup and preserve conflicts', () => {
  const f=src('formationProgress'); const current=f.parseFormation({last:'C02',diagnostic:{0:1},attempts:{C02:{...f.freshAttempt(),note:'Meu rascunho',step:2}}});
  f.saveFormation(current);
  const b=backup.parseBackup(JSON.stringify(backup.makeBackup())); assert.equal(b.data[f.formationKey].attempts.C02.note,'Meu rascunho');
  const incoming=f.parseFormation({attempts:{C02:{...f.freshAttempt(),note:'Outra resposta'},H01:f.freshAttempt()}});
  const merged=backup.mergeSection(f.formationKey,current,incoming,false);
  assert.equal(merged.attempts.C02.note,'Meu rascunho'); assert(merged.attempts.H01);
  assert.equal(backup.mergeSection(f.formationKey,current,incoming,true).attempts.C02.note,'Outra resposta');
});
test('formation rejects invalid IDs and keeps drafts when storage is blocked', () => {
 const f=src('formationProgress');const p=f.parseFormation({last:'BAD',diagnostic:{99:1},attempts:{BAD:{},C01:{step:99,answers:{0:100},note:'texto'}}});
 assert.equal(p.last,'C01');assert.deepEqual(p.diagnostic,{});assert.equal(p.attempts.BAD,undefined);assert.equal(p.attempts.C01.step,0);assert.deepEqual(p.attempts.C01.answers,{});
 blocked=true;assert.equal(f.saveFormation(p),false);assert.equal(f.readFormation().attempts.C01.note,'texto');blocked=false;f.saveFormation(p);
});
