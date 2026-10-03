import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Check, ExternalLink, Download, Lightbulb, ShieldAlert, Sparkles, CircleHelp } from "lucide-react";
import curriculum from "./data/laboratory.json";
import resources from "./data/resources.json";
import LabWorkshop, { WorkshopIntro, WorkshopStudy } from "./LabWorkshop";
import AgentPlayground from "./AgentPlayground";
import { labCheckpoints } from "./data/lab-checkpoints";
import LabCheckpoint from "./LabCheckpoint";
import LearningPath from './LearningPath';
import PracticeStudio from './PracticeStudio';
import mastery from './data/lab-mastery.json';
import StudyFocus from "./StudyFocus";
import { guidance } from "./studyGuidance";

const { steps, phases } = curriculum;
const levelEntry = [
  { name: "Começo do zero", test: "Ainda não sei ler uma resposta de API. Comece aqui." },
  { name: "Organizar o agente", test: "Já faço uma chamada GET e entendo um JSON simples." },
  { name: "Construir com C#", test: "Já descrevo o que entra e sai de uma tool." },
  { name: "Confiabilidade", test: "Já consigo executar API e tool localmente." },
  { name: "Projeto avançado", test: "Já testei falhas, permissões e regressões; quero integrar e defender decisões." }
];
const storageKey = "curva-aberta-laboratorio-v2";
type Progress = { done: string[]; checks: Record<string, boolean>; passed: string[]; drafts: Record<string, string>; last: number; completedAt: Record<string, string>; reviews: Record<string, boolean> };
const empty: Progress = { done: [], checks: {}, passed: [], drafts: {}, last: 0, completedAt: {}, reviews: {} };
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
    const passed = Array.isArray(value.passed) ? [...new Set<string>(value.passed.filter((id: unknown) => typeof id === "string" && steps.some(s => labCheckpoints[s.id].some((_, i) => id === `${s.id}-${i}`))))] : [];
    const drafts: Record<string, string> = {};
    steps.forEach(s => { if (typeof value.drafts?.[s.id] === "string") drafts[s.id] = value.drafts[s.id].slice(0, 700); });
    const completedAt: Record<string, string> = {};
    const reviews: Record<string, boolean> = {};
    done.forEach(id => { if (typeof value.completedAt?.[id] === "string") completedAt[id] = value.completedAt[id]; if (value.reviews?.[id] === true) reviews[id] = true; });
    return { done, checks, passed, drafts, last: validStep(value.last) ? value.last : 0, completedAt, reviews };
  } catch { return empty; }
}

export default function Laboratory() {
  const [progress, setProgress] = useState<Progress>(readProgress);
  const [current, setCurrent] = useState(() => fromUrl() ?? progress.last);
  const [notice, setNotice] = useState("");
  const [hours, setHours] = useState("4");
  const [levelFilter, setLevelFilter] = useState<number | "all">(() => steps[current].phase);
  const [languageFilter, setLanguageFilter] = useState<"all" | "pt">("all");
  const [primerAnswer, setPrimerAnswer] = useState(false);
  const [showRecall, setShowRecall] = useState<Record<string, boolean>>({});
  const [mapOpen, setMapOpen] = useState(() => !matchMedia("(max-width: 700px)").matches);
  const heading = useRef<HTMLHeadingElement>(null);
  const lesson = useRef<HTMLElement>(null);
  const step = steps[current];
  const finished = progress.done.includes(step.id);
  const checksReady = step.checks.every((_, i) => progress.checks[`${step.id}-${i}`]);
  const quizReady = labCheckpoints[step.id].every((_, i) => progress.passed.includes(`${step.id}-${i}`));
  const ready = checksReady && quizReady;
  const guide = guidance[step.id];

  const portugueseCount = step.resources.filter(r => r.language.startsWith("Português")).length;
  const effectiveLanguage = portugueseCount ? languageFilter : "all";
  const visibleResources = effectiveLanguage === "pt" ? step.resources.filter(r => r.language.startsWith("Português")) : step.resources;
  const completedDate = progress.completedAt[step.id];
  const reviewDate = completedDate ? new Date(new Date(completedDate).getTime() + 7 * 86400000) : null;
  const totalMin = steps.reduce((sum, s) => sum + Number(s.hours.split("–")[0]), 0);
  const totalMax = steps.reduce((sum, s) => sum + Number(s.hours.split("–")[1].split(" ")[0]), 0);
  const kit = `${import.meta.env.BASE_URL}lab/`;

  function visitSection(target: string) {
    const element = lesson.current?.querySelector<HTMLElement>(target);
    const title = element?.querySelector<HTMLElement>("h2, h3") ?? element;
    if (!title) return;
    title.setAttribute("tabindex", "-1");
    title.focus({ preventScroll: true });
    title.scrollIntoView({ block: "start", behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  }

  useEffect(() => {
    const publish = () => window.dispatchEvent(new CustomEvent("curva-aberta-study-context", { detail: { step: current, title: step.title, tip: guide.tip, attention: guide.attention, curiosity: guide.curiosity, question: guide.question, answer: guide.answer } }));
    publish();
    const deferred = window.setTimeout(publish, 0);
    return () => window.clearTimeout(deferred);
  }, [current, step.title, guide]);

  useEffect(() => {
    const sync = () => {
      const index = fromUrl() ?? 0;
      setCurrent(index);
      setLevelFilter(steps[index].phase);
    };
    window.addEventListener("popstate", sync);
    return () => window.removeEventListener("popstate", sync);
  }, []);
  function save(next: Progress) {
    setProgress(next);
    try { localStorage.setItem(storageKey, JSON.stringify(next)); window.dispatchEvent(new Event("curva-aberta-progress-change")); }
    catch { setNotice("Seu navegador não permitiu salvar. O progresso vale somente nesta sessão."); }
  }
  function go(index: number) {
    if (!validStep(index)) return;
    if (levelFilter !== "all" && steps[index].phase !== levelFilter) setLevelFilter(steps[index].phase);
    setCurrent(index); save({ ...progress, last: index });
    if (matchMedia("(max-width: 700px)").matches) setMapOpen(false);
    const url = new URL(location.href); url.searchParams.set("etapa", String(index + 1));
    history.pushState({}, "", url.pathname + url.search);
    requestAnimationFrame(() => { heading.current?.focus(); heading.current?.scrollIntoView({block:"start", behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth"}); });
  }
  function chooseLevel(level: number | "all") {
    setLevelFilter(level);
    if (level !== "all" && step.phase !== level) go(steps.findIndex(s => s.phase === level));
  }
  function toggleCheck(index: number) {
    const key = `${step.id}-${index}`;
    const checked = !progress.checks[key];
    const completedAt = { ...progress.completedAt };
    const reviews = { ...progress.reviews };
    if (!checked) { delete completedAt[step.id]; delete reviews[step.id]; }
    save({ ...progress, checks: { ...progress.checks, [key]: checked }, done: checked ? progress.done : progress.done.filter(id => id !== step.id), completedAt, reviews });
  }
  function passQuestion(index: number) {
    const key = `${step.id}-${index}`;
    if (!progress.passed.includes(key)) save({ ...progress, passed: [...progress.passed, key] });
  }
  function resetQuestions() {
    save({ ...progress, passed: progress.passed.filter(key => !key.startsWith(`${step.id}-`)) });
  }
  function complete() {
    if (!finished && !ready) return;
    const completedAt = { ...progress.completedAt };
    const reviews = { ...progress.reviews };
    if (finished) { delete completedAt[step.id]; delete reviews[step.id]; }
    else completedAt[step.id] = new Date().toISOString();
    save({ ...progress, done: finished ? progress.done.filter(id => id !== step.id) : [...progress.done, step.id], completedAt, reviews });
    if (!finished) window.dispatchEvent(new CustomEvent("curva-aberta-study-complete", { detail: { source: "laboratory", step: current } }));
    setNotice(finished ? "Etapa reaberta para revisão." : "Etapa registrada. Guarde também a entrega do exercício.");
  }
  function markReviewed() {
    save({ ...progress, reviews: { ...progress.reviews, [step.id]: !progress.reviews[step.id] } });
    setNotice(progress.reviews[step.id] ? "Revisão reaberta." : "Revisão curta registrada. Você reforçou esta etapa.");
  }
  return <section className="lab" aria-label="Percurso guiado de APIs, agentes e MCP">
    <div className="lab-resume-strip"><div><strong>Sua etapa atual</strong><span>Nível {step.phase} · {current + 1} de {steps.length}: {step.title}</span></div><button className="lab-action" onClick={()=>visitSection("header")}>Estudar esta etapa <ArrowRight size={16}/></button></div>
    <div className="lab-welcome">
      <div><span className="eyebrow">LABORATÓRIO GUIADO · DO ZERO AO AVANÇADO</span><h2>Da primeira API à integração confiável.</h2><p>{steps.length} etapas em cinco níveis. Você acompanha o mesmo assistente fictício: ler um perfil, escolher uma tool, integrar por MCP e provar que a resposta é confiável. Pode começar sem programar; hoje basta compreender um pedido e uma resposta.</p></div>
      <div className="lab-progress"><strong>{progress.done.length}<span> / {steps.length}</span></strong><span>etapas com entrega registrada</span><progress value={progress.done.length} max={steps.length} aria-label="Progresso no laboratório"/><small>Salvo somente neste navegador. O progresso antigo de três níveis não equivale às novas entregas.</small></div>
    </div>
    <LearningPath id={9} gates={['http','contratos','integracao','seguranca'].map(id=>({prompt:mastery[id as keyof typeof mastery].scenario,proof:mastery[id as keyof typeof mastery].expected}))} onSelect={level=>go(steps.findIndex(s=>s.phase===level))}/>
    <section className="lab-level-picker" aria-label="Escolher nível do laboratório"><div><span className="eyebrow">UM PASSO DE CADA VEZ</span><h3>Onde você quer começar?</h3><p>Se API ou JSON ainda parecem outra língua, escolha o nível 0. Mostramos só as etapas desse nível no mapa; as demais continuam disponíveis. Você não precisa decidir o percurso inteiro hoje.</p></div><div className="lab-level-options" role="group" aria-label="Filtrar etapas por nível">{phases.map((phase, index)=><button key={phase.title} className={levelFilter === index ? "active" : ""} aria-pressed={levelFilter === index} onClick={()=>chooseLevel(index)}><strong>Nível {index} · {levelEntry[index].name}</strong><small>{levelEntry[index].test}</small></button>)}<button className={levelFilter === "all" ? "active" : ""} aria-pressed={levelFilter === "all"} onClick={()=>chooseLevel("all")}><strong>Ver o caminho inteiro</strong><small>{steps.length} etapas, do básico ao projeto</small></button></div></section>
    <details className="lab-onboarding" open={progress.done.length === 0 ? true : undefined}>
      <summary>Seu primeiro contato: uma atividade de 5 minutos, sem instalar nada</summary>
      <div className="lab-zero"><p><strong>O projeto que vamos construir:</strong> um assistente prepara um atendimento usando o perfil de Lia Demo. Ele consulta dados autorizados, explica o que falta e pode sugerir um rascunho; não envia mensagens nem recomenda investimentos. Cada etapa acrescenta uma peça, sem exigir aprender tudo de uma vez.</p><span className="eyebrow">AULA 0 · COMECE AQUI</span><h3>Primeiro, entenda um pedido e uma resposta</h3><p>Imagine que um aplicativo pergunta a outro: “Qual é o post número 1?”. Esse pedido é uma <strong>requisição</strong>. O endereço é uma <strong>URL</strong>; <code>GET</code> quer dizer “quero ler”. O outro programa devolve uma <strong>resposta</strong>. Os dados podem vir em <code>JSON</code>, um texto com nomes de campos e valores.</p><div className="lab-zero-example"><code>GET /posts/1</code><span>pedido → resposta</span><code>{'{"id":1,"title":"Exemplo"}'}</code></div><p>Leia como uma pequena ficha: <code>id</code> é o nome de um campo e <code>1</code> é seu valor. <code>title</code> é outro campo. Não precisa decorar os símbolos agora.</p><div className="lab-zero-try"><strong>Experimente sem criar conta</strong><ol><li><a href="https://jsonplaceholder.typicode.com/posts/1" target="_blank" rel="noopener noreferrer">Abra esta resposta de demonstração <ExternalLink size={15}/></a> em outra aba. Se aparecer texto sem formatação, está tudo certo.</li><li>Encontre <code>id</code> e <code>title</code>. Qual é o número do <code>id</code>?</li><li>Volte aqui e confira a explicação. Na próxima etapa você fará isso com mais calma.</li></ol><button type="button" className="lab-answer-toggle" aria-expanded={primerAnswer} onClick={()=>setPrimerAnswer(v=>!v)}>{primerAnswer ? "Ocultar explicação" : "Conferir comigo"}</button>{primerAnswer && <p className="lab-zero-answer" role="status"><strong>Resposta:</strong> o <code>id</code> é <code>1</code>. <code>title</code> contém texto. A resposta mostra esses dados, mas não informa, por exemplo, o nome do autor. Quando algo não está nela, a atitude correta é dizer que não veio.</p>}</div><p className="lab-zero-reassure">Por enquanto, você não precisa instalar Bruno, saber C# ou entender agentes. Tudo isso entra depois, na hora certa.</p></div>
      <div className="lab-onboarding-grid"><div><h3>Depois destes 5 minutos</h3><p>Vá para a etapa 1. A ordem é simples: entenda a explicação, use um material de apoio e acompanhe o exemplo resolvido. Tente o exercício sozinho somente depois. Se não conseguir hoje, pare no ponto em que está e retome dali.</p><button className="lab-action" onClick={()=>go(0)}>Ir para a etapa 1 <ArrowRight size={16}/></button></div><div><h3>Seu ritmo é ajustável</h3><label htmlFor="study-hours">Tempo disponível por semana</label><select id="study-hours" value={hours} onChange={e=>setHours(e.target.value)}><option value="3">3 horas por semana</option><option value="4">4 horas por semana</option><option value="6">6 horas por semana</option><option value="8">8 horas por semana</option></select><p>Faça a primeira atividade no seu tempo. Voltar e repetir faz parte do estudo.</p><details className="lab-time-estimate"><summary>Ver estimativa para as 14 etapas</summary><p>Referência aproximada: {Math.ceil(totalMin/Number(hours))}–{Math.ceil(totalMax/Number(hours))} semanas ({totalMin}–{totalMax} h). Não é prazo nem meta de velocidade.</p></details></div></div>
      <p className="lab-small">Materiais de leitura gratuitos; certificação não é requisito. O início usa dados públicos fictícios e ferramentas locais. Nas integrações com modelos, contas e APIs podem ter custos: use respostas simuladas para testar contratos antes de escolher um serviço.</p>
    </details>
    <section className="milestone-map" aria-label="Marcos de prática">
      <div><span className="eyebrow">MARCOS DE PRÁTICA</span><h3>{levelFilter === "all" ? "Seu progresso representa entregas, não tempo de tela." : `Agora: ${phases[levelFilter].title}.`}</h3><p>{levelFilter === "all" ? "Veja o caminho completo sem obrigação de concluí-lo rapidamente." : "Mostramos só o marco do nível escolhido. As outras etapas continuam guardadas para depois."}</p></div>
      <ol>{phases.map((phase, index) => { if (levelFilter !== "all" && index !== levelFilter) return null; const phaseSteps = steps.filter(s => s.phase === index); const completed = phaseSteps.filter(s => progress.done.includes(s.id)).length; return <li key={phase.title} className={completed === phaseSteps.length ? "earned" : ""}><span>{completed === phaseSteps.length ? <Check size={15} aria-label="Marco conquistado"/> : `${String(index + 1).padStart(2, "0")}`}</span><div><strong>{phase.title}</strong><small>{completed}/{phaseSteps.length} entregas · {completed === phaseSteps.length ? "Marco conquistado" : "em construção"}</small></div></li>; })}</ol>
    </section>
    <div className="lab-layout">
      <details className="lab-map-shell" open={mapOpen} onToggle={e=>setMapOpen(e.currentTarget.open)}><summary>Ver etapas {levelFilter === "all" ? "de todos os níveis" : `do nível ${levelFilter}`} · {current+1}/{steps.length}</summary><nav className="lab-map" aria-label="Etapas do laboratório">
        <h3>Seu caminho</h3>
        {phases.map((phase, phaseIndex)=>levelFilter !== "all" && phaseIndex !== levelFilter ? null : <div className="lab-phase" key={phase.title}><h4><span>NÍVEL {phaseIndex}</span>{phase.title}</h4><p>{phase.subtitle}</p>{steps.map((s,index)=>s.phase===phaseIndex && <button key={s.id} onClick={()=>go(index)} aria-current={current===index?"step":undefined} className={current===index?"selected":""}><span className="lab-step-number">{progress.done.includes(s.id)?<Check size={16} aria-label="Concluída"/>:String(index+1).padStart(2,"0")}</span><span>{s.title}<small>{s.hours}</small></span></button>)}</div>)}
      </nav></details>
      <article className="lab-lesson" ref={lesson}>
        <nav className="lab-lesson-index" aria-label="Atalhos desta aula"><span>Nesta aula</span>{[[".lab-essential","Entender"],[".lab-study","Materiais"],[".lab-practice","Praticar"],[".lab-quiz","Testar"],[".lab-checks","Entrega"]].map(([target,label])=><button key={target} onClick={()=>visitSection(target)}>{label}</button>)}</nav>
        <header><span className="eyebrow">NÍVEL {step.phase} · ETAPA {String(current+1).padStart(2,"0")} DE {steps.length} · {step.hours}</span><h2 ref={heading} tabIndex={-1}>{step.title}</h2><p className="lab-goal">{step.goal}</p><WorkshopIntro key={step.id} id={step.id}/><p className="lab-prerequisite"><strong>O que é bom saber antes:</strong> {step.prerequisite}</p></header>
        <section className="lab-essential"><h3>01. Entenda o essencial</h3><div className="lab-concepts">{step.concepts.map(c=><span key={c}>{c}</span>)}</div>{step.lesson.map(p=><p key={p}>{p}</p>)}{step.example && <pre tabIndex={0} aria-label="Exemplo didático"><code>{step.example}</code></pre>}</section>
        <details className="lab-focus-shell"><summary>Quer usar um cronômetro? Modo foco opcional</summary><StudyFocus stepId={step.id} stepTitle={step.title} suggestedGoal={guide.focusGoal} /></details>
        <section className="learning-cues" aria-label="Dicas desta etapa"><h3>Entre no ponto certo</h3><div className="learning-cues-grid"><article className="cue tip"><Lightbulb size={19}/><div><strong>Dica prática</strong><p>{guide.tip}</p></div></article><article className="cue attention"><ShieldAlert size={19}/><div><strong>Ponto de atenção</strong><p>{guide.attention}</p></div></article><article className="cue curiosity"><Sparkles size={19}/><div><strong>Curiosidade técnica</strong><p>{guide.curiosity}</p></div></article></div></section>
        <section className="lab-study"><h3>02. Estude com apoio</h3><WorkshopStudy id={step.id}/><p className="lab-small">O cartão principal indica o primeiro material; leia o trecho indicado, não o curso inteiro. Depois volte para o exemplo guiado. Conteúdos em inglês têm instruções em português nesta página.</p><div className="lab-material-filter" role="group" aria-label="Idioma dos materiais"><button className={effectiveLanguage === "all" ? "active" : ""} aria-pressed={effectiveLanguage === "all"} onClick={()=>setLanguageFilter("all")}>Todos os materiais ({step.resources.length})</button><button className={effectiveLanguage === "pt" ? "active" : ""} aria-pressed={effectiveLanguage === "pt"} disabled={!portugueseCount} onClick={()=>setLanguageFilter("pt")}>Só em português ({portugueseCount})</button></div>{!portugueseCount && <p className="lab-small">Ainda não há tutorial oficial desta ferramenta em português nesta etapa. O exemplo resolvido abaixo explica a operação em português.</p>}<div className="lab-materials">{visibleResources.map((r,index)=><a key={r.url} href={r.url} target="_blank" rel="noopener noreferrer"><span className="lab-resource-label">{index===0?"COMECE POR AQUI":"APOIO"} · {r.format} · {r.language}</span><strong>{r.title} <ExternalLink size={15}/></strong><span>{r.focus}</span><small>Abre em outra aba</small></a>)}</div></section>
        <section className="lab-practice"><h3>03. Faça com apoio, depois sozinho</h3><LabWorkshop key={step.id} id={step.id}/><h4 className="lab-your-turn">Agora é sua vez · tente sem olhar a resposta</h4><p className="lab-small">Pode consultar o exemplo acima se travar. O objetivo é entender o caminho, não acertar de primeira.</p><ol className="lab-tasks">{step.tasks.map(t=><li key={t}>{t}</li>)}</ol>{step.id === "http" && <p className="lab-kit-shortcut">O arquivo citado está aqui: <a href={kit+"primeiro-json.json"} target="_blank" rel="noopener noreferrer">abrir primeiro-json.json <ExternalLink size={15}/></a>. É um exemplo curto e fictício para praticar.</p>}<div className="lab-deliverable"><strong>O que guardar</strong><p>{step.deliverable}</p></div><details className="lab-help"><summary>Travou na entrega? Confira este ponto</summary><p>{step.help}</p></details></section>
        {["prompts","rotas","mcp","integracao","seguranca"].includes(step.id) && <AgentPlayground key={`demo-${step.id}`}/>}
        <LabCheckpoint key={step.id} stepId={step.id} passed={progress.passed} onPass={passQuestion} onReset={resetQuestions}/>
        <PracticeStudio key={`practice-${step.id}`} id={`lab-${step.id}`} title={step.title} module={9} stage={current} lab exercise={mastery[step.id as keyof typeof mastery]}/>
        <section className="lab-checks"><h3>05. Confira sua entrega</h3><p className="lab-small">O teste acima verifica uma decisão. Agora use o arquivo, coleção ou projeto que você produziu para marcar o que realmente demonstrou. A página não inspeciona seus arquivos.</p>{step.checks.map((check,index)=><label key={check}><input type="checkbox" checked={!!progress.checks[`${step.id}-${index}`]} onChange={()=>toggleCheck(index)}/><span>{check}</span></label>)}<button className="lab-action" disabled={!finished && !ready} onClick={complete}><Check size={17}/>{finished?"Reabrir etapa":"Registrar entrega concluída"}</button>{!finished && !ready && <small>{!quizReady ? "Conclua as situações de raciocínio acima. " : ""}{!checksReady ? "Marque os critérios comprovados pela sua entrega." : ""}</small>}</section>
        <section className="lab-recall"><div><span className="eyebrow">EXPLIQUE COM SUAS PALAVRAS</span><h3><CircleHelp size={20}/>Você consegue explicar?</h3><p>{guide.question}</p><label htmlFor={`recall-${step.id}`}>Escreva uma resposta curta antes de comparar:</label><textarea id={`recall-${step.id}`} maxLength={700} value={progress.drafts[step.id] ?? ""} onChange={event=>save({ ...progress, drafts: { ...progress.drafts, [step.id]: event.target.value } })} placeholder="O que você diria a outra pessoa?"/><button className="lab-answer-toggle" type="button" aria-expanded={!!showRecall[step.id]} onClick={()=>setShowRecall(v=>({ ...v, [step.id]: !v[step.id] }))}>{showRecall[step.id] ? "Ocultar comparação" : "Comparar com uma resposta possível"}</button>{showRecall[step.id] && <div className="lab-recall-feedback" role="status"><strong>Resposta possível</strong><p>{guide.answer}</p><p>{progress.drafts[step.id]?.trim() ? "Compare as ideias, não as palavras exatas. Se faltar um ponto importante, ajuste sua resposta acima e tente explicar de novo." : "Se ainda não soube responder, releia o exemplo guiado e tente escrever uma frase com suas palavras. Este campo não é corrigido automaticamente."}</p></div>}</div>{finished && <aside><strong>Revisão futura</strong><p>{progress.reviews[step.id] ? "Revisão curta registrada." : `Volte em ${reviewDate?.toLocaleDateString("pt-BR")} e responda à pergunta sem consultar o material.`}</p><button className="focus-quiet" onClick={markReviewed}>{progress.reviews[step.id] ? "Reabrir revisão" : "Registrar revisão de 2 min"}</button></aside>}</section>
        {step.id === "projeto" && <section className="lab-final-rubric"><span className="eyebrow">DOMÍNIO POR EVIDÊNCIAS</span><h3>Antes da revisão do projeto</h3><p>Não basta uma média de acertos. Use a documentação do projeto como roteiro: ela explica o que criar primeiro, onde cada arquivo entra, o que testar e quando considerar uma fatia pronta.</p><div className="lab-rubric-table"><table><thead><tr><th>Competência</th><th>Evidência para revisão</th></tr></thead><tbody>{[["Descoberta","Perguntas, fora de escopo e critérios escritos antes da implementação."],["Contratos","Entradas, schemas, origem de campos e estados coerentes na API, DTO e tool."],["Segurança","Identidade autenticada, autorização server-side, allowlist, read-only e falha fechada testados."],["Qualidade","Conjunto de validação separado e resultado por cenário, com regressão intencional detectada."],["Autonomia","Duas alternativas justificadas e uma mudança inédita implementada e testada."],["Entrega","README reproduzível, PR, revisão, versões, limites e recuperação documentados."]].map(([area,evidence])=><tr key={area}><th scope="row">{area}</th><td>{evidence}</td></tr>)}</tbody></table></div><p><strong>Bloqueadores:</strong> exposição indevida, tool proibida, envio de follow-up ou valor financeiro inventado impedem concluir, mesmo que os outros testes passem.</p><div className="lab-final-links"><a href={kit+"projeto-preparacao-atendimento.md"} download><Download size={16}/> Baixar documentação completa do projeto</a><a href={kit+"roteiro-projeto-avancado.md"} download><Download size={16}/> Baixar roteiro e matriz de aceite</a></div></section>}
        <div className="lab-pagination"><button onClick={()=>go(current-1)} disabled={current===0}><ArrowLeft size={17}/> Etapa anterior</button><button onClick={()=>go(current+1)} disabled={current===steps.length-1}>Próxima etapa <ArrowRight size={17}/></button></div>
      </article>
    </div>
    <div className="lab-support">
      <details><summary>Kit de prática: arquivos para começar</summary><p>Exemplos fictícios para as atividades. Os contratos são convenções didáticas deste projeto, não requisitos do protocolo MCP.</p><ul>{[["guia-primeira-integracao.md","Oficinas comentadas: os 14 passos"],["projeto-preparacao-atendimento.md","Documentação completa do projeto final"],["ApiPerfil.Program.cs","API local completa em C#"],["primeiro-mcp.md","Seu primeiro MCP: instruções completas"],["PerfilMcp.Program.cs","Código completo do servidor MCP local"],["debrief-SKILL.md","Skill de debrief fictício"],["primeiro-json.json","Primeiro JSON para a etapa 1"],["resposta-parcial.json","Resposta com dados ausentes"],["contrato-tool.json","Schema do resultado de uma tool"],["casos-regressao.csv","Matriz inicial de regressão"],["guia-laboratorio.md","Trilha completa para consulta offline"],["roteiro-projeto-avancado.md","Projeto avançado: roteiro e rubrica"]].map(([file,title])=><li key={file}><a href={kit+file} download><Download size={15}/> {title}</a></li>)}</ul></details>
      <details><summary>Glossário e diferenças que evitam confusão</summary><dl><dt>API / tool / MCP</dt><dd>API é uma interface entre sistemas; tool é uma capacidade invocável pelo agente; MCP é um protocolo para expor e acessar capacidades.</dd><dt>Prompt / Skill / runtime</dt><dd>Prompt orienta comportamento; Skill organiza um procedimento e seus recursos; runtime executa e aplica os controles disponíveis no ambiente.</dd><dt>Contrato / DTO / schema</dt><dd>Contrato define o acordo; DTO transporta dados no código; schema descreve sua estrutura e permite validação.</dd><dt>RAG / fonte</dt><dd>RAG recupera material para apoiar a resposta. Uma citação precisa apontar a evidência que de fato sustenta o conteúdo.</dd><dt>Avançado neste percurso</dt><dd>Diagnosticar falhas entre camadas, testar segurança e comportamento, justificar decisões e entregar uma integração revisável. Isso exige prática, revisão e continuidade.</dd></dl></details>
      <details><summary>Biblioteca extra: vídeos, cursos e referências</summary><p>Consulta opcional. A ordem de estudo está nas etapas acima. Vídeos podem usar versões anteriores; uma página Microsoft em português não garante áudio em português.</p><ul>{resources.filter(r=>r.module===9).map(r=><li key={r.url}><a href={r.url} target="_blank" rel="noopener noreferrer">{r.title} <ExternalLink size={13}/></a></li>)}</ul></details>
    </div>
    <p className="lab-small">Curadoria revisada em 02/10/2026. Arquitetura, comandos, estados e casos são exemplos de um assistente fictício; não descrevem sistemas de nenhuma empresa. Use apenas dados de demonstração.</p>
    <p role="status" aria-live="polite" className="lab-notice">{notice}</p>
  </section>;
}
