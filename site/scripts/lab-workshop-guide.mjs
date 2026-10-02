import {readFileSync,writeFileSync} from 'node:fs';
import ts from 'typescript';
const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8');
const code=ts.transpileModule(read('src/data/lab-workshops.ts'),{compilerOptions:{module:ts.ModuleKind.ES2022}}).outputText;
const {workshops}=await import('data:text/javascript;base64,'+Buffer.from(code).toString('base64'));
const lab=JSON.parse(read('src/data/laboratory.json'));
let text='# Oficinas: da primeira resposta à integração de agentes e MCP\n\nRevisão: 02/10/2026. Dados e assistente fictícios. Exercícios originais em português. Simulações e pseudocódigo são identificados; não substituem ambiente real ou avaliação de modelo. C# é referência revisada contra documentação, não executada no ambiente do site.\n\nComece por HTTP e JSON se nunca viu APIs. A cada etapa: entender → observar → reproduzir → variar → explicar → conferir a entrega. Os estados resolved, partial, ambiguous e out_of_scope, o comando /perfil e APP → ROUTER → AGENT → TOOL são convenções do projeto. MCP, HTTP, schemas, autorização e métodos de teste são conhecimentos gerais.\n\n';
const aliases={0:['etapa-1-hoje-uma-chamada-http-no-bruno','próxima-ação-concreta'],7:['etapa-2-primeiro-servidor-mcp-em-c'],8:['etapas-3-e-4-api-local-e-tool-que-a-consulta'],10:['etapas-5-a-7-agente-rag-e-skill','depois-da-primeira-tool-resources-rag-e-skill'],12:['testes-que-dão-confiança'],13:['projeto-de-estudo-catálogo-de-procedimentos-fictícios']};
text+='<a id="a-ordem-única-desta-trilha"></a>\n\n';
for(const [i,s] of lab.steps.entries()){
 const w=workshops[s.id];
 text+=`<a id="etapa-${i+1}"></a>\n`+(aliases[i]||[]).map(id=>`<a id="${id}"></a>\n`).join('')+'\n';
 text+=`## ${i+1}. ${s.title}\n\nNível ${s.phase}. Pré-requisito: ${s.prerequisite}\n\n### ${w.question}\n\n${w.bridge}\n\nConquista inicial: ${w.smallWin}\n\n`;
 for(const [term,definition,example] of w.terms)text+=`- **${term}**: ${definition} Exemplo: ${example}\n`;
 text+=`\n### Estudar com intenção\n\nPergunta: ${w.study.question}\n\nBloco sugerido: ${w.study.budget} (não é duração oficial do material).\n\nAté onde ir: ${w.study.stop}\n\nAo fechar: ${w.study.after}\n\n`;
 for(const r of s.resources)text+=`- [${r.title}](${r.url}) · ${r.language} · ${r.format}. ${r.focus}\n`;
 for(const [n,part] of w.steps.entries())text+=`\n### Faça comigo ${n+1}: ${part.title}\n\n${part.action}\n\n\`\`\`text\n${part.code}\n\`\`\`\n\nO que acontece: ${part.explanation}\n\nResultado esperado: ${part.expected}\n`;
 text+=`\n### Tente uma variação\n\n${w.variation.task}\n\nResposta para comparar após tentar: ${w.variation.answer}\n\nPor quê: ${w.variation.reason}\n\n### Se travar\n\n`;
 for(const [symptom,check,fix] of w.mistakes)text+=`- ${symptom}. Confira: ${check} Próximo passo: ${fix}\n`;
 text+='\n### Sua entrega independente\n\n'+s.tasks.map((x,n)=>`${n+1}. ${x}`).join('\n')+'\n\nGuarde: '+s.deliverable+'\n\nCritérios (autoavaliação com evidência):\n\n'+s.checks.map(x=>'- [ ] '+x).join('\n')+'\n\n';
}
const output='public/lab/guia-primeira-integracao.md';
if(process.argv.includes('--check')){
 if(read(output)!==text)throw new Error('Oficinas offline fora de sincronia: node scripts/lab-workshop-guide.mjs');
 if(read('public/lab/guia-laboratorio.md')!==text)throw new Error('Guia principal fora de sincronia.');
}else {writeFileSync(new URL('../'+output,import.meta.url),text);writeFileSync(new URL('../public/lab/guia-laboratorio.md',import.meta.url),text);}
