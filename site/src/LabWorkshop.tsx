import { workshops } from './data/lab-workshops';
import './lab-workshop.css';
export function WorkshopIntro({id}:{id:string}) {
 const w=workshops[id];
 return <div className="workshop-intro"><span className="eyebrow">A PERGUNTA DESTA OFICINA</span><h3>{w.question}</h3><p>{w.bridge}</p><p className="workshop-win"><strong>Uma conquista possível hoje:</strong> {w.smallWin}</p><details><summary>Traduza os termos antes de continuar</summary><dl>{w.terms.map(([term,meaning,example])=><div key={term}><dt>{term}</dt><dd>{meaning}<small>Por exemplo: {example}</small></dd></div>)}</dl></details></div>;
}
export function WorkshopStudy({id}:{id:string}) {
 const s=workshops[id].study;
 return <div className="workshop-study"><strong>Leia para responder: {s.question}</strong><p><b>Um bloco sugerido:</b> {s.budget}. É uma sugestão de estudo, não a duração oficial do material.</p><p><b>Até onde ir:</b> {s.stop}</p><p><b>Ao fechar o material:</b> {s.after}</p></div>;
}
export default function LabWorkshop({id}:{id:string}) {
 const w=workshops[id];
 const kit=import.meta.env.BASE_URL+'lab/';
 const files:Record<string,[string,string][]>={mcp:[['primeiro-mcp.md','Roteiro completo: projeto, Inspector e resultados'],['PerfilMcp.Program.cs','Servidor MCP local completo']],dotnet:[['ApiPerfil.Program.cs','Código completo da API local']],skills:[['debrief-SKILL.md','Skill de debrief comentada']],projeto:[['projeto-preparacao-atendimento.md','Documentação completa: projeto passo a passo'],['roteiro-projeto-avancado.md','Roteiro e matriz de aceite']]};
 return <div className="workshop"><p>Leia o passo, observe o exemplo e confira o resultado. Os blocos identificam quando são código, dados de demonstração ou pseudocódigo.</p>{w.steps.map((s,i)=><details key={s.title} className="workshop-step" open={i===0}><summary><span>{i+1}</span>{s.title}</summary><div><p>{s.action}</p><pre tabIndex={0} aria-label={`Exemplo: ${s.title}`}><code>{s.code}</code></pre><p><strong>O que está acontecendo:</strong> {s.explanation}</p><p className="workshop-expected"><strong>Como reconhecer que funcionou:</strong> {s.expected}</p></div></details>)}{files[id]?.map(([file,title])=><p key={file}><a href={kit+file} download>{title} ↓</a></p>)}<div className="workshop-variation"><span className="eyebrow">MUDE UMA COISA · TENTE ANTES DE ABRIR</span><h4>Um teste pequeno para ganhar confiança</h4><p>{w.variation.task}</p><details><summary>Comparar com uma resposta explicada</summary><p><strong>{w.variation.answer}</strong></p><p>{w.variation.reason}</p><p>Compare o raciocínio; este exercício não corrige texto automaticamente.</p></details></div><details className="workshop-trouble"><summary>Travou? Investigue pelo sintoma</summary>{w.mistakes.map(([symptom,check,fix])=><div key={symptom}><h4>{symptom}</h4><p><b>Confira:</b> {check}</p><p><b>Próximo passo:</b> {fix}</p></div>)}</details></div>;
}
