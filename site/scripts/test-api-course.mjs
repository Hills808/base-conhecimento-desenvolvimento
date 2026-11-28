import assert from 'node:assert/strict';
import { execFileSync, spawn } from 'node:child_process';
import { once } from 'node:events';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { loadTypeScript } from './load-typescript.mjs';

const site = path.resolve(import.meta.dirname, '..');
const api = path.join(site, 'public/lab/api');
const { firstProgram, oneFilter } = loadTypeScript(path.join(site, 'src/data/apiExamples.ts'));
const finalProgram = fs.readFileSync(path.join(api, 'Chamados.cs'), 'utf8');
const operation = JSON.parse(fs.readFileSync(path.join(api, 'openapi.json'), 'utf8')).paths['/chamados'].get;
const examples = operation.responses['200'].content['application/json'].examples;
const root = fs.mkdtempSync(path.join(os.tmpdir(), 'curva-api-'));
const env = { ...process.env, DOTNET_NOLOGO: '1', DOTNET_CLI_TELEMETRY_OPTOUT: '1' };

async function runCases(name, source, cases) {
  const dir = path.join(root, name);
  fs.mkdirSync(dir);
  fs.writeFileSync(path.join(dir, 'Chamados.cs'), source);
  execFileSync('dotnet', ['build', 'Chamados.cs', '--output', 'compiled', '--verbosity', 'quiet'], { cwd: dir, env, stdio: 'inherit' });
  const server = spawn('dotnet', ['compiled/Chamados.dll', '--urls', 'http://127.0.0.1:0'], { cwd: dir, env, stdio: ['ignore', 'pipe', 'inherit'] });
  const closed = once(server, 'close');
  let timer;
  try {
    const url = await new Promise((resolve, reject) => {
      timer = setTimeout(() => reject(new Error('A API local não ficou pronta.')), 15000);
      let log = '';
      server.stdout.on('data', chunk => {
        log += chunk.toString();
        const match = log.match(/http:\/\/127\.0\.0\.1:(\d+)\b/);
        if (match && Number(match[1]) > 0) resolve(match[0]);
      });
      server.once('error', reject);
      server.once('exit', code => reject(new Error('A API encerrou com código ' + code)));
    });
    for (const [query, status, expected] of cases) {
      const response = await fetch(url + '/chamados' + query, { signal: AbortSignal.timeout(5000) });
      assert.equal(response.status, status, name + query);
      assert.match(response.headers.get('content-type'), /application\/json/);
      assert.deepEqual(await response.json(), expected, name + query);
    }
    console.log(name + ' · ' + cases.length + ' chamadas HTTP conferidas.');
  } finally {
    clearTimeout(timer);
    server.kill();
    await closed;
  }
}

try {
  await runCases('primeira-rota', firstProgram, [['', 200, ['primeiro chamado']]]);
  const intermediate = firstProgram.replace(/^app\.MapGet\(.*$/m, oneFilter);
  const two = [{ id: 101, status: 'aberto' }, { id: 103, status: 'fechado' }];
  await runCases('um-filtro', intermediate, [['', 200, two], ['?status=fechado', 200, [two[1]]]]);

  assert.deepEqual(operation.parameters.map(p => [p.name, p.in, p.required]), [['status', 'query', false], ['categoria', 'query', false]]);
  const all = examples.todos.value;
  const selected = (...ids) => all.filter(t => ids.includes(t.id));
  await runCases('contrato-v1', finalProgram, [
    ['', 200, all], ['?status=aberto', 200, selected(101, 102, 104)],
    ['?categoria=rede', 200, selected(101, 103, 104)],
    ['?status=aberto&categoria=rede', 200, examples.abertosDeRede.value],
    ['?status=fechado&categoria=acesso', 200, examples.semCorrespondencias.value],
    ['?status=pausado', 400, operation.responses['400'].content['application/json'].example],
    ['?categoria=outra', 400, { erro: 'Use rede ou acesso em categoria.' }],
    ['?prioridade=alta', 200, all]
  ]);
} finally {
  fs.rmSync(root, { recursive: true, force: true });
}
