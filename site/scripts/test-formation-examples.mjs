import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import vm from 'node:vm';
import { execFileSync } from 'node:child_process';
import assert from 'node:assert/strict';
import ts from 'typescript';
const module={exports:{}};
vm.runInNewContext(ts.transpileModule(fs.readFileSync('src/data/formation.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText,{exports:module.exports});
const root=fs.mkdtempSync(path.join(os.tmpdir(),'curva-formation-'));
const dotnet=process.env.CURVA_DOTNET||'dotnet';
const env={...process.env,DOTNET_CLI_TELEMETRY_OPTOUT:'1',DOTNET_SKIP_FIRST_TIME_EXPERIENCE:'1',DOTNET_NOLOGO:'1'};
const run=(args,options={})=>execFileSync(dotnet,args,{cwd:root,env,encoding:'utf8',...options}).trim();
try {
 fs.writeFileSync(path.join(root,'Mesa.csproj'),'<Project Sdk="Microsoft.NET.Sdk"><PropertyGroup><OutputType>Exe</OutputType><TargetFramework>net10.0</TargetFramework><ImplicitUsings>enable</ImplicitUsings><Nullable>enable</Nullable></PropertyGroup></Project>');
 for(const m of module.exports.missions.filter(m=>m.id!=='H01')) {
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
} finally {fs.rmSync(root,{recursive:true,force:true});}
