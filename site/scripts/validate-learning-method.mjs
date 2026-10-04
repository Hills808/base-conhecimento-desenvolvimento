import { readFileSync } from 'node:fs';
import assert from 'node:assert/strict';
import { loadTypeScript } from './load-typescript.mjs';
import { fileURLToPath } from 'node:url';
const read=path=>readFileSync(new URL('../'+path,import.meta.url),'utf8');
const lab=JSON.parse(read('src/data/laboratory.json'));
const mastery=JSON.parse(read('src/data/lab-mastery.json'));
const transfer=JSON.parse(read('src/data/module-transfer.json'));
assert.deepEqual(Object.keys(mastery).sort(),lab.steps.map(s=>s.id).sort());
for(const step of lab.steps){
 const item=mastery[step.id];
 for(const field of ['recall','scenario','expected','transfer'])assert.ok(item[field]?.length>35,`${step.id}: ${field} incomplete`);
 assert.ok(item.sequence.length>=3&&item.rubric.length>=3);
 assert.ok(read('public/lab/treinos-autonomia.md').includes(item.scenario));
}
for(let id=0;id<9;id++){
 assert.equal(transfer[id].length,5);
 const offline=read(`public/kits/treinos-${id}.md`);
 for(const item of transfer[id]){assert.equal(item.length,3);assert.ok(item.every(t=>t.length>40));assert.ok(offline.includes(item[0]));}
}
const {nextPractice,readPractice,savePractice}=loadTypeScript(fileURLToPath(new URL('../src/learningPractice.ts', import.meta.url)));
const now=new Date('2026-09-30T12:00:00Z');
const first=nextPractice(undefined,now,true);
assert.equal(first.due,'2026-10-01T12:00:00.000Z');assert.equal(first.interval,0);
const prior={...first};
assert.deepEqual(nextPractice(prior,new Date('2026-09-30T14:00:00Z'),true),first,'Early review must not advance the interval');
const second=nextPractice(prior,new Date(first.due),true);
assert.equal(second.interval,1);assert.equal(second.due,'2026-10-08T12:00:00.000Z');
const third=nextPractice(second,new Date(second.due),true);
assert.equal(third.interval,2);assert.equal(third.due,'2026-11-07T12:00:00.000Z');
const support=nextPractice(third,new Date('2026-10-10T12:00:00Z'),false);
assert.equal(support.interval,0);assert.equal(support.due,'2026-10-11T12:00:00.000Z');
globalThis.localStorage={getItem:()=>'{bad',setItem:()=>{throw new Error('Unavailable');}};
assert.deepEqual(readPractice(),{});assert.equal(savePractice({id:'test'}),false);
console.log('Método válido: 59 casos e guias; revisão inicial, antecipada, progressiva, com apoio e armazenamento indisponível conferidos.');
