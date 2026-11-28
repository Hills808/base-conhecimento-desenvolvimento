import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import assert from 'node:assert/strict';
import { loadTypeScript } from './load-typescript.mjs';
const data = name => loadTypeScript(path.resolve('src/data', name + '.ts'));
const { missions } = data('formation');
const { guidedIds, getGuidedLesson, exampleCode, setupLesson } = data('guidedCourse');
const { guidedWorkshops, sameOutput } = data('guidedWorkshops');
const { guidedVideos } = data('guidedVideos');
const root=fs.mkdtempSync(path.join(os.tmpdir(),'curva-formation-'));
const dotnet=process.env.CURVA_DOTNET||'dotnet';
const env={...process.env,DOTNET_CLI_TELEMETRY_OPTOUT:'1',DOTNET_SKIP_FIRST_TIME_EXPERIENCE:'1',DOTNET_NOLOGO:'1'};
const run=(args,options={})=>execFileSync(dotnet,args,{cwd:root,env,encoding:'utf8',...options}).trim().replace(/\r\n/g, '\n');
try {
 fs.writeFileSync(path.join(root,'Mesa.csproj'),'<Project Sdk="Microsoft.NET.Sdk"><PropertyGroup><OutputType>Exe</OutputType><TargetFramework>net10.0</TargetFramework><ImplicitUsings>enable</ImplicitUsings><Nullable>enable</Nullable></PropertyGroup></Project>');
 // The Windows console's legacy code page would otherwise change accented results when redirected to Node.
 fs.writeFileSync(path.join(root, 'TestEncoding.cs'), 'static class TestEncoding { [System.Runtime.CompilerServices.ModuleInitializer] internal static void Init() { System.Console.InputEncoding = new System.Text.UTF8Encoding(false); System.Console.OutputEncoding = new System.Text.UTF8Encoding(false); } }');
 for(const m of missions.filter(m=>m.id!=='H01')) {
  fs.writeFileSync(path.join(root,'Program.cs'),m.code);
  run(['build','--nologo','--verbosity','quiet','--ignore-failed-sources']);
  const dll=path.join(root,'bin/Debug/net10.0/Mesa.dll');
  if(m.id==='C01') assert.equal(run([dll]),'5\n3');
  if(m.id==='C02') for(const [input,last] of [['30','35'],['abc','Digite um número inteiro.'],['','Digite um número inteiro.'],['-1','4']]) assert.equal(run([dll],{input:input+'\n'}).split('\n').at(-1),last);
  if(m.id==='C03') {
   assert.equal(run([dll]),'Atrasada');
   fs.writeFileSync(path.join(root,'Program.cs'),m.code.replace('int minutos = 30;','int minutos = int.Parse(args[0]);'));
   run(['build','--nologo','--verbosity','quiet','--no-restore']);
   for(const [input,result] of [['-1','Duração inválida'],['0','Dentro do prazo'],['29','Dentro do prazo'],['30','Atrasada'],['31','Atrasada']]) assert.equal(run([dll,input]),result);
  }
  console.log(`${m.id}: compilação e casos aprovados.`);
 }
 let lastProgram;
 function execute(program, input) {
  if (program !== lastProgram) {
    fs.writeFileSync(path.join(root, 'Program.cs'), program);
    run(['build', '--nologo', '--verbosity', 'quiet', '--no-restore']);
    lastProgram = program;
  }
  const dll = path.join(root, 'bin/Debug/net10.0/Mesa.dll');
  const stdin = typeof input === 'string' ? input + '\n' : '';
  return run([dll], { input: stdin, timeout: 5000 });
 }
 const verify = (program, output, label, input) => assert.equal(execute(program, input), output, label);
 assert.equal(new Set(guidedIds).size, guidedIds.length, 'Every lesson has a stable unique ID');
 assert.deepEqual(Object.keys(guidedWorkshops).sort(), [...guidedIds].sort());
 assert.deepEqual(Object.keys(guidedVideos).sort(), [...guidedIds].sort());
 const lessons = guidedIds.map(getGuidedLesson).filter(Boolean);
 for (const lesson of lessons) {
  assert.equal(lesson.options.length, lesson.feedback.length);
  assert.ok(Number.isInteger(lesson.correct) && lesson.correct >= 0 && lesson.correct < lesson.options.length);
  if (lesson.reviewLesson) assert.ok(lessons.some(item => item.id === lesson.reviewLesson), lesson.title);
  verify(lesson.code, lesson.output, lesson.title, lesson.input);
  for (const item of lesson.explore?.cases ?? []) {
   const program = exampleCode(lesson.code, lesson.explore.replace, item);
   assert.match(program.split('\n')[item.line - 1], /Console\.WriteLine/, lesson.title);
   verify(program, item.output, lesson.title + ' / ' + item.value, item.input);
  }
  for (const item of lesson.solutionCases ?? []) {
   verify(lesson.answerCode, item.output, lesson.title + ' / ' + (item.input ?? ''), item.input);
  }
  console.log(lesson.id + ' — ' + lesson.title + ': saídas conferidas.');
 }
 verify(setupLesson.code, setupLesson.output, setupLesson.title);
 for (const id of guidedIds) {
  const { trace, task, repair } = guidedWorkshops[id];
  const lesson = getGuidedLesson(id) ?? setupLesson;
  const lines = lesson.code.split('\n');
  assert.ok(trace.length && trace.every(step => Number.isInteger(step.line) && lines[step.line - 1]?.trim() && step.observation.trim()), id + ' trace');
  assert.ok(task.errors.length && task.errors.every(error => !sameOutput(error.guess, task.output) && error.feedback.trim()), id + ' feedback');
  const video = guidedVideos[id];
  assert.match(video.id, /^[a-zA-Z0-9_-]{11}$/);
  assert.ok((video.start ?? 0) >= 0 && (video.end ?? video.duration) > (video.start ?? 0) && (video.end ?? video.duration) <= video.duration, id + ' video');
  verify(task.code, task.output, id + ' previsão', task.input);
  const initial = repair.tests.map(test => execute(repair.code, test.input));
  assert.ok(repair.tests.some((test, i) => initial[i] !== test.output), id + ' precisa reproduzir a falha');
  for (const test of repair.tests) verify(repair.solution, test.output, id + ' correção', test.input);
  console.log(id + ': previsão, defeito e correção conferidos.');
 }
} finally {fs.rmSync(root,{recursive:true,force:true});}
