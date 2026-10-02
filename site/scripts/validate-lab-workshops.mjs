import {readFileSync,existsSync} from 'node:fs';
import assert from 'node:assert/strict';
import ts from 'typescript';
const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8');
async function load(p){const code=ts.transpileModule(read(p),{compilerOptions:{module:ts.ModuleKind.ES2022}}).outputText;return import('data:text/javascript;base64,'+Buffer.from(code).toString('base64'));}
const {workshops}=await load('src/data/lab-workshops.ts');
const {demoCases,simulateDemo,chooseDemoRoute}=await load('src/data/agent-simulation.ts');
const lab=JSON.parse(read('src/data/laboratory.json'));
assert.deepEqual(Object.keys(workshops).sort(),lab.steps.map(s=>s.id).sort());
for(const s of lab.steps){
 const w=workshops[s.id];
 assert.equal(w.steps.length,3);assert.ok(w.terms.length>=2);assert.ok(w.mistakes.length>=2);
 for(const part of w.steps)for(const k of ['title','action','code','explanation','expected'])assert.ok(part[k].length>12,`${s.id}: ${k}`);
 assert.ok(w.variation.answer&&w.variation.reason&&w.study.stop);
 assert.equal(new Set(s.resources.map(r=>r.url)).size,s.resources.length,'Duplicate resource');
}
for(const filename of ['ApiPerfil.Program.cs','PerfilMcp.Program.cs','debrief-SKILL.md','roteiro-projeto-avancado.md','primeiro-mcp.md'])assert.ok(existsSync(new URL('../public/lab/'+filename,import.meta.url)),filename);
const results=Object.fromEntries(demoCases.map(c=>[c.id,simulateDemo(c)]));
assert.equal(results.collision.route,'perfil');
assert.equal(chooseDemoRoute('/perfilXYZ agenda'),'agenda','Only exact command tokens take precedence');
assert.equal(results.denied.lookup,false);assert.equal(results.denied.result.error.code,'ACCESS_DENIED');assert.ok(!('data' in results.denied.result));
assert.equal(results.schema.lookup,false);assert.equal(results.schema.result.error.code,'INVALID_ARGUMENT');
assert.equal(results.missing.result.status,'partial');assert.deepEqual(results.missing.result.missingFields,['biografia']);
assert.equal(results.normal.result.status,'resolved');
assert.equal(results.ambiguous.lookup,false);assert.equal(results.ambiguous.route,'ambiguous');
assert.equal(results.scope.calls.length,0);assert.equal(results.injection.writes,0);
assert.deepEqual(results.injection.calls,['consultar_perfil']);
assert.ok(!JSON.stringify(results).includes('valorCarteira'));
console.log('Oficinas válidas: 14 etapas/42 exemplos; 8 cenários didáticos, precedência, ausência, argumentos, acesso e ausência de escrita conferidos. Não valida um modelo real.');
