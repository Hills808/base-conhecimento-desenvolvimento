import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Check, ExternalLink, Download, Lightbulb, ShieldAlert, Sparkles, CircleHelp } from "lucide-react";
import curriculum from "./data/laboratory.json";
import resources from "./data/resources.json";
import StudyFocus from "./StudyFocus";
import { guidance } from "./studyGuidance";
import "./laboratory.css";

const { steps, phases } = curriculum;
const storageKey = "curva-aberta-laboratorio-v2";
type Progress = { done: string[]; checks: Record<string, boolean>; last: number; completedAt: Record<string, string>; reviews: Record<string, boolean> };
const empty: Progress = { done: [], checks: {}, last: 0, completedAt: {}, reviews: {} };
const validStep = (n: number) => Number.isInteger(n) && n >= 0 && n < steps.length;
function fromUrl() {
  const raw = new URLSearchParams(location.search).get("etapa");
  if (raw === null) return null;
  const n = Number(raw) - 1;
  return validStep(n) ? n : null;
}
function readProgress(): Progress {
  try {
    const value = JSON.parse(localStorage.getItem(storageKey) || "null");
    if (!value || typeof value !== "object") return empty;
    const done = Array.isArray(value.done) ? [...new Set<string>(value.done.filter((id: unknown) => typeof id === "string" && steps.some(s => s.id === id)))] : [];
    const checks: Record<string, boolean> = {};
    steps.forEach(s => s.checks.forEach((_, i) => { checks[`${s.id}-${i}`] = value.checks?.[`${s.id}-${i}`] === true; }));
    const completedAt: Record<string, string> = {};
    const reviews: Record<string, boolean> = {};
    done.forEach(id => { if (typeof value.completedAt?.[id] === "string") completedAt[id] = value.completedAt[id]; if (value.reviews?.[id] === true) reviews[id] = true; });
    return { done, checks, last: validStep(value.last) ? value.last : 0, completedAt, reviews };
  } catch { return empty; }
}

export default function Laboratory() {
  const [progress, setProgress] = useState<Progress>(readProgress);
  const [current, setCurrent] = useState(() => fromUrl() ?? readProgress().last);
  const [notice, setNotice] = useState("");
  const [hours, setHours] = useState("4");
  const [mapOpen, setMapOpen] = useState(() => !matchMedia("(max-width: 700px)").matches);
  const heading = useRef<HTMLHeadingElement>(null);
  const step = steps[current];
  const finished = progress.done.includes(step.id);
  const ready = step.checks.every((_, i) => progress.checks[`${step.id}-${i}`]);
  const guide = guidance[step.id];
  const completedDate = progress.completedAt[step.id];
  const reviewDate = completedDate ? new Date(new Date(completedDate).getTime() + 7 * 86400000) : null;
  const totalMin = steps.reduce((sum, s) => sum + Number(s.hours.split("–")[0]), 0);
  const totalMax = steps.reduce((sum, s) => sum + Number(s.hours.split("–")[1].split(" ")[0]), 0);
  const kit = `${import.meta.env.BASE_URL}lab/`;

  useEffect(() => {
    const sync = () => setCurrent(fromUrl() ?? 0);
    window.addEventListener("popstate", sync);
    return () => window.removeEventListener("popstate", sync);
  }, []);
  function save(next: Progress) {
    setProgress(next);
    try { localStorage.setItem(storageKey, JSON.stringify(next)); }
    catch { setNotice("Seu navegador não permitiu salvar. O progresso vale somente nesta sessão."); }
  }
  function go(index: number) {
    if (!validStep(index)) return;
    setCurrent(index); save({ ...progress, last: index });
    if (matchMedia("(max-width: 700px)").matches) setMapOpen(false);
    const url = new URL(location.href); url.searchParams.set("etapa", String(index + 1));
    history.pushState({}, "", url.pathname + url.search);
    requestAnimationFrame(() => { heading.current?.focus(); heading.current?.scrollIntoView({block:"start", behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth"}); });
  }
  function toggleCheck(index: number) {
    const key = `${step.id}-${index}`;
    const checked = !progress.checks[key];
    save({ ...progress, checks: { ...progress.checks, [key]: checked }, done: checked ? progress.done : progress.done.filter(id => id !== step.id) });
  }
  function complete() {
    if (!ready) return;
    const completedAt = { ...progress.completedAt };
    const reviews = { ...progress.reviews };
    if (finished) { delete completedAt[step.id]; delete reviews[step.id]; }
    else completedAt[step.id] = new Date().toISOString();
    save({ ...progress, done: finished ? progress.done.filter(id => id !== step.id) : [...progress.done, step.id], completedAt, reviews });
    setNotice(finished ? "Etapa reaberta para revisão." : "Etapa registrada. Guarde também a entrega do exercício.");
  }
  function markReviewed() {
    save({ ...progress, reviews: { ...progress.reviews, [step.id]: !progress.reviews[step.id] } });
    setNotice(progress.reviews[step.id] ? "Revisão reaberta." : "Revisão curta registrada. Você reforçou esta etapa.");
  }
  return <section className="lab" aria-label="Percurso guiado de APIs, agentes e MCP">
    <div className="lab-welcome">
      <div><span className="eyebrow">SEU PERCURSO DE TRABALHO</span><h2>Da primeira API à integração confiável.</h2><p>14 etapas em uma sequência única. Leia o essencial, siga o material principal, pratique e comprove a entrega. Você pode revisar ou explorar qualquer etapa.</p></div>
      <div className="lab-progress"><strong>{progress.done.length}<span> / {steps.length}</span></strong><span>etapas com entrega registrada</span><progress value={progress.done.length} max={steps.length} aria-label="Progresso no laboratório"/><small>Salvo somente neste navegador. O progresso antigo de três níveis não equivale às novas entregas.</small></div>
    </div>
    <details className="lab-onboarding" open={progress.done.length === 0 ? true : undefined}>
      <summary>Primeiro acesso? Veja como começar e organizar seu ritmo</summary>
      <div className="lab-onboarding-grid"><div><h3>Hoje: uma tarefa pequena</h3><p>Comece pela etapa 1. Faça uma sessão de 45 minutos: 10 para entender, 15 para o material e 20 para praticar. Se faltar tempo, retome a mesma entrega.</p><p>Já domina um assunto? Faça o exercício e os três critérios de verificação; só então pule o estudo principal.</p><button className="lab-action" onClick={()=>go(0)}>Começar pela etapa 1 <ArrowRight size={16}/></button></div><div><h3>Um planejamento realista</h3><label htmlFor="study-hours">Disponibilidade semanal</label><select id="study-hours" value={hours} onChange={e=>setHours(e.target.value)}><option value="3">3 horas por semana</option><option value="4">4 horas por semana</option><option value="6">6 horas por semana</option><option value="8">8 horas por semana</option></select><p>Estimativa: {Math.ceil(totalMin/Number(hours))}–{Math.ceil(totalMax/Number(hours))} semanas ({totalMin}–{totalMax} h de estudo e prática). É uma referência editorial, não prazo obrigatório. A experiência anterior muda esse tempo.</p></div></div>
      <p className="lab-small">Materiais de leitura gratuitos; certificação não é requisito. O início usa dados públicos fictícios e ferramentas locais. Nas integrações com modelos, contas e APIs podem ter custos: use respostas simuladas para testar contratos antes de escolher um serviço.</p>
    </details>
    <section className="milestone-map" aria-label="Marcos de prática">
      <div><span className="eyebrow">MARCOS DE PRÁTICA</span><h3>Seu progresso representa entregas, não tempo de tela.</h3></div>
      <ol>{phases.map((phase, index) => { const phaseSteps = steps.filter(s => s.phase === index); const completed = phaseSteps.filter(s => progress.done.includes(s.id)).length; return <li key={phase.title} className={completed === phaseSteps.length ? "earned" : ""}><span>{completed === phaseSteps.length ? <Check size={15} aria-label="Marco conquistado"/> : `${String(index + 1).padStart(2, "0")}`}</span><div><strong>{phase.title}</strong><small>{completed}/{phaseSteps.length} entregas · {completed === phaseSteps.length ? "Marco conquistado" : "em construção"}</small></div></li>; })}</ol>
    </section>
    <div className="lab-layout">
      <details className="lab-map-shell" open={mapOpen} onToggle={e=>setMapOpen(e.currentTarget.open)}><summary>Ver caminho completo · {current+1}/14</summary><nav className="lab-map" aria-label="Etapas do laboratório">
        <h3>Seu caminho</h3>
        {phases.map((phase, phaseIndex)=><div className="lab-phase" key={phase.title}><h4><span>NÍVEL {phaseIndex+1}</span>{phase.title}</h4>{steps.map((s,index)=>s.phase===phaseIndex && <button key={s.id} onClick={()=>go(index)} aria-current={current===index?"step":undefined} className={current===index?"selected":""}><span className="lab-step-number">{progress.done.includes(s.id)?<Check size={16} aria-label="Concluída"/>:String(index+1).padStart(2,"0")}</span><span>{s.title}<small>{s.hours}</small></span></button>)}</div>)}
      </nav></details>
      <article className="lab-lesson">
        <header><span className="eyebrow">NÍVEL {step.phase+1} · ETAPA {String(current+1).padStart(2,"0")} DE 14 · {step.hours}</span><h2 ref={heading} tabIndex={-1}>{step.title}</h2><p className="lab-goal">{step.goal}</p><p className="lab-prerequisite"><strong>Antes desta etapa:</strong> {step.prerequisite}</p></header>
        <StudyFocus stepId={step.id} stepTitle={step.title} suggestedGoal={guide.focusGoal} />
        <section><h3>01. Entenda o essencial</h3><div className="lab-concepts">{step.concepts.map(c=><span key={c}>{c}</span>)}</div>{step.lesson.map(p=><p key={p}>{p}</p>)}{step.example && <pre tabIndex={0} aria-label="Exemplo didático"><code>{step.example}</code></pre>}</section>
        <section className="learning-cues" aria-label="Dicas desta etapa"><h3>Entre no ponto certo</h3><div className="learning-cues-grid"><article className="cue tip"><Lightbulb size={19}/><div><strong>Dica prática</strong><p>{guide.tip}</p></div></article><article className="cue attention"><ShieldAlert size={19}/><div><strong>Ponto de atenção</strong><p>{guide.attention}</p></div></article><article className="cue curiosity"><Sparkles size={19}/><div><strong>Curiosidade técnica</strong><p>{guide.curiosity}</p></div></article></div></section>
        <section><h3>02. Estude com apoio</h3><p className="lab-small">Comece pelo primeiro material. Os demais servem para dúvidas e aprofundamento. Veja exatamente o trecho a estudar em cada cartão.</p><div className="lab-materials">{step.resources.map((r,index)=><a key={r.url} href={r.url} target="_blank" rel="noopener noreferrer"><span className="lab-resource-label">{index===0?"PRINCIPAL":"APOIO"} · {r.format} · {r.language}</span><strong>{r.title} <ExternalLink size={15}/></strong><span>{r.focus}</span><small>Abre em outra aba</small></a>)}</div></section>
        <section><h3>03. Faça a entrega</h3><ol className="lab-tasks">{step.tasks.map(t=><li key={t}>{t}</li>)}</ol><div className="lab-deliverable"><strong>O que guardar</strong><p>{step.deliverable}</p></div><details className="lab-help"><summary>Travou? Confira este ponto</summary><p>{step.help}</p></details></section>
        <section className="lab-checks"><h3>04. Confira antes de avançar</h3><p className="lab-small">Marque o que você demonstrou com a entrega. Assistir ou ler, por si só, não conclui a etapa.</p>{step.checks.map((check,index)=><label key={check}><input type="checkbox" checked={!!progress.checks[`${step.id}-${index}`]} onChange={()=>toggleCheck(index)}/><span>{check}</span></label>)}<button className="lab-action" disabled={!ready} onClick={complete}><Check size={17}/>{finished?"Reabrir etapa":"Registrar entrega concluída"}</button>{!ready && <small>Os três critérios precisam estar marcados para registrar a conclusão.</small>}</section>
        <section className="lab-recall"><div><span className="eyebrow">CHECK DE 30 SEGUNDOS</span><h3><CircleHelp size={20}/>Você consegue explicar?</h3><p>{guide.question}</p><details><summary>Ver uma resposta possível</summary><p>{guide.answer}</p></details></div>{finished && <aside><strong>Revisão futura</strong><p>{progress.reviews[step.id] ? "Revisão curta registrada." : `Volte em ${reviewDate?.toLocaleDateString("pt-BR")} e responda à pergunta sem consultar o material.`}</p><button className="focus-quiet" onClick={markReviewed}>{progress.reviews[step.id] ? "Reabrir revisão" : "Registrar revisão de 2 min"}</button></aside>}</section>
        <div className="lab-pagination"><button onClick={()=>go(current-1)} disabled={current===0}><ArrowLeft size={17}/> Etapa anterior</button><button onClick={()=>go(current+1)} disabled={current===steps.length-1}>Próxima etapa <ArrowRight size={17}/></button></div>
      </article>
    </div>
    <div className="lab-support">
      <details><summary>Kit de prática: arquivos para começar</summary><p>Exemplos fictícios para as atividades. Os contratos são convenções didáticas deste projeto, não requisitos do protocolo MCP.</p><ul>{[["resposta-parcial.json","Resposta com dados ausentes"],["contrato-tool.json","Schema do resultado de uma tool"],["casos-regressao.csv","Matriz inicial de regressão"],["guia-laboratorio.md","Trilha completa para consulta offline"]].map(([file,title])=><li key={file}><a href={kit+file} download><Download size={15}/> {title}</a></li>)}</ul></details>
      <details><summary>Glossário e diferenças que evitam confusão</summary><dl><dt>API / tool / MCP</dt><dd>API é uma interface entre sistemas; tool é uma capacidade invocável pelo agente; MCP é um protocolo para expor e acessar capacidades.</dd><dt>Prompt / Skill / runtime</dt><dd>Prompt orienta comportamento; Skill organiza um procedimento e seus recursos; runtime executa e aplica os controles disponíveis no ambiente.</dd><dt>Contrato / DTO / schema</dt><dd>Contrato define o acordo; DTO transporta dados no código; schema descreve sua estrutura e permite validação.</dd><dt>RAG / fonte</dt><dd>RAG recupera material para apoiar a resposta. Uma citação precisa apontar a evidência que de fato sustenta o conteúdo.</dd><dt>Avançado neste percurso</dt><dd>Diagnosticar falhas entre camadas, testar segurança e comportamento, justificar decisões e entregar uma integração revisável. Isso exige prática, revisão e continuidade.</dd></dl></details>
      <details><summary>Biblioteca extra: vídeos, cursos e referências</summary><p>Consulta opcional. A ordem de estudo está nas etapas acima. Vídeos podem usar versões anteriores; uma página Microsoft em português não garante áudio em português.</p><ul>{resources.filter(r=>r.module===9).map(r=><li key={r.url}><a href={r.url} target="_blank" rel="noopener noreferrer">{r.title} <ExternalLink size={13}/></a></li>)}</ul></details>
    </div>
    <p className="lab-small">Curadoria revisada em 28/09/2026. Arquitetura, comandos, estados e casos são exemplos de um assistente fictício; não descrevem sistemas de nenhuma empresa. Use apenas dados de demonstração.</p>
    <p role="status" aria-live="polite" className="lab-notice">{notice}</p>
  </section>;
}
