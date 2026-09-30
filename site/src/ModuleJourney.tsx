import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Check, Compass, Download, ExternalLink, CircleAlert } from "lucide-react";
import type { Module } from "./data/modules";
import { moduleGuidance } from "./data/module-guidance";
import { moduleKits } from "./data/module-kits";
import { competencyLevels, moduleLessons } from "./data/module-lessons";
import { readModuleProgress, saveModuleProgress, isStageVerified, type ModuleProgress } from "./moduleProgress";
import StudyFocus from "./StudyFocus";
import LabCheckpoint from "./LabCheckpoint";
import LearningPath from './LearningPath';
import PracticeStudio from './PracticeStudio';
import transferCases from './data/module-transfer.json';
import "./laboratory.css";
import "./module-curriculum.css";

export default function ModuleJourney({ module }: { module: Module }) {
  const [progress, setProgress] = useState<ModuleProgress>(readModuleProgress);
  const readLevel = () => {
    const raw = new URLSearchParams(location.search).get('nivel');
    const value = raw === null ? readModuleProgress().lastByModule[module.id] ?? 0 : Number(raw);
    return Number.isInteger(value) && value >= 0 && value < module.stages.length ? value : 0;
  };
  const [activeStage, setActiveStage] = useState(readLevel);
  const [language, setLanguage] = useState('all');
  const [format, setFormat] = useState('all');
  const [notice, setNotice] = useState('');
  const heading = useRef<HTMLHeadingElement>(null);
  const stage = module.stages[activeStage];
  const guide = moduleGuidance[module.id].stages[activeStage];
  const lesson = moduleLessons[module.id][activeStage];
  const key = `${module.id}-${activeStage}`;
  const quizKey = `mod-${key}`;
  const complete = module.stages.filter((_, index) => isStageVerified(progress, module.id, index)).length;
  const quizReady = lesson.questions.every((_, index) => progress.passed.includes(`${quizKey}-${index}`));
  const checksReady = guide.checks.every((_, index) => progress.checks[`${key}-${index}`]);
  const ready = quizReady && checksReady;
  const finished = isStageVerified(progress, module.id, activeStage);
  const priorEvidence = progress.done.includes(key) && !finished;
  const reviewDate = progress.completedAt[key] ? new Date(new Date(progress.completedAt[key]).getTime() + 7 * 86400000) : null;
  const visibleMaterials = lesson.materials.filter(item => (language !== 'pt' || item.language.startsWith('Português')) && (format === 'all' || item.format === format));
  const formats = [...new Set(lesson.materials.map(item => item.format))];
  const firstIncomplete = module.stages.findIndex((_, index) => !isStageVerified(progress, module.id, index));
  const transfer = transferCases[String(module.id) as keyof typeof transferCases][activeStage];

  function save(next: ModuleProgress, level = activeStage) { const updated = { ...next, lastModule: module.id, lastByModule: { ...next.lastByModule, [module.id]: level } }; setProgress(updated); saveModuleProgress(updated); }
  useEffect(() => {
    const publish = () => window.dispatchEvent(new CustomEvent("curva-aberta-study-context", { detail: { moduleId: module.id, stage: activeStage } }));
    const timer = window.setTimeout(publish, 0);
    const pop = () => setActiveStage(readLevel());
    window.addEventListener('popstate', pop);
    return () => { window.clearTimeout(timer); window.removeEventListener('popstate', pop); };
  }, [module.id, activeStage]);
  function selectStage(index: number, focus = true) {
    setActiveStage(index); setLanguage('all'); setFormat('all'); setNotice('');
    save({ ...progress, lastModule: module.id, lastByModule: { ...progress.lastByModule, [module.id]: index } }, index);
    const url = new URL(location.href); url.searchParams.set('nivel', String(index));
    window.history.pushState({}, '', url);
    if (focus) window.requestAnimationFrame(() => { heading.current?.focus({ preventScroll: true }); heading.current?.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'start' }); });
  }
  function toggleCheck(index: number) {
    const checkKey = `${key}-${index}`;
    const checked = !progress.checks[checkKey];
    const next = { ...progress, checks: { ...progress.checks, [checkKey]: checked } };
    if (!checked && next.done.includes(key)) {
      next.done = next.done.filter(item => item !== key);
      next.completedAt = { ...next.completedAt }; next.reviews = { ...next.reviews };
      delete next.completedAt[key]; delete next.reviews[key];
    }
    save(next);
  }
  function completeStage() {
    if (!ready) return;
    if (finished) {
      const next = { ...progress, done: progress.done.filter(item => item !== key), completedAt: { ...progress.completedAt }, reviews: { ...progress.reviews } };
      delete next.completedAt[key]; delete next.reviews[key]; save(next); setNotice('Entrega reaberta; sua prática e respostas continuam salvas.'); return;
    }
    save({ ...progress, done: [...new Set([...progress.done, key])], completedAt: { ...progress.completedAt, [key]: new Date().toISOString() }, lastModule: module.id, lastByModule: { ...progress.lastByModule, [module.id]: activeStage } });
    setNotice('Entrega registrada. Daqui a sete dias, tente uma variação sem consultar.');
    window.dispatchEvent(new CustomEvent('curva-aberta-study-complete', { detail: { source: 'module', key } }));
  }

  return <section className="module-journey curriculum-journey" aria-labelledby="journey-heading">
    <header className="journey-intro"><div><span className="eyebrow ink">DO PRIMEIRO CONTATO À AUTONOMIA</span><h2 id="journey-heading">Um caminho. Cinco níveis.</h2><p>{moduleGuidance[module.id].orientation}</p></div><div className="journey-progress" aria-label={`${complete} de ${module.stages.length} entregas verificadas`}><strong>{complete}<span>/{module.stages.length}</span></strong><small>entregas com verificação</small><progress value={complete} max={module.stages.length} aria-label="Progresso do módulo"/></div></header>
    <LearningPath id={module.id} gates={transferCases[String(module.id) as keyof typeof transferCases].slice(0,4).map(item=>({prompt:item[0],proof:item[1]}))} onSelect={selectStage}/>
    <div className="curriculum-start"><Compass size={23}/><div><strong>{complete === module.stages.length ? 'Todos os níveis têm evidência registrada.' : `Seu próximo passo sugerido: nível ${firstIncomplete}.`}</strong><p>Se está começando, acompanhe o nível 0. Se já tem experiência, tente o desafio e a verificação do nível adequado. Os caminhos continuam abertos; avance quando conseguir executar e explicar.</p>{firstIncomplete >= 0 && firstIncomplete !== activeStage && <button onClick={() => selectStage(firstIncomplete)}>Abrir o próximo passo <ArrowRight size={16}/></button>}</div></div>
    <details className="curriculum-standard"><summary>O que significa chegar ao avançado aqui?</summary><p>Executar uma tarefa nova, investigar falhas, justificar decisões e entregar um projeto que outra pessoa consegue revisar. A trilha oferece uma base e prática progressiva; marcar etapas não certifica experiência profissional nem domínio de toda a área.</p><p>Fluxo de cada nível: entenda → estude um trecho → acompanhe o exemplo → tente sozinho → confira → guarde evidências. As horas são estimativas de estudo e prática, não duração dos cursos.</p></details>
    <div className="journey-stages" role="tablist" aria-label={`Níveis de ${module.title}`}>
      {module.stages.map((item, index) => <button key={item.name} id={`level-${module.id}-${index}`} role="tab" aria-selected={activeStage === index} aria-controls={`lesson-${module.id}`} tabIndex={activeStage === index ? 0 : -1} className={`journey-stage ${activeStage === index ? 'active' : ''} ${isStageVerified(progress,module.id,index) ? 'done' : ''}`} onClick={() => selectStage(index, false)} onKeyDown={event => {
        const next = event.key === 'ArrowRight' ? (index + 1) % 5 : event.key === 'ArrowLeft' ? (index + 4) % 5 : event.key === 'Home' ? 0 : event.key === 'End' ? 4 : null;
        if (next !== null) { event.preventDefault(); selectStage(next, false); document.getElementById(`level-${module.id}-${next}`)?.focus(); }
      }}><span>{isStageVerified(progress,module.id,index) ? <Check size={16}/> : index}</span><strong>{competencyLevels[index].name}</strong><small>{competencyLevels[index].cue}</small></button>)}
    </div>
    <article className="journey-card" role="tabpanel" id={`lesson-${module.id}`} aria-labelledby={`level-${module.id}-${activeStage}`}>
      <header className="journey-card-head"><span>NÍVEL {activeStage} · {competencyLevels[activeStage].name.toUpperCase()} · {lesson.hours}</span><h3 ref={heading} tabIndex={-1}>{stage.name}</h3><p>{stage.practice}</p><div className="curriculum-prerequisite"><strong>Antes deste nível:</strong> {lesson.prerequisite}</div></header>
      {priorEvidence && <p className="curriculum-migration"><CircleAlert size={18}/> Sua entrega anterior foi preservada. Complete a nova verificação para confirmar este nível.</p>}
      <section className="curriculum-block"><span className="journey-label">01 / ENTENDA O ESSENCIAL</span><h4>O que você vai conseguir fazer</h4><p>{lesson.explanation}</p><ul className="curriculum-concepts">{stage.learn.map(item => <li key={item}>{item}</li>)}</ul><div className="curriculum-result"><strong>Resultado esperado</strong><p>{guide.outcome}</p></div></section>
      <details className="curriculum-focus"><summary>Organizar uma sessão com o modo foco</summary><StudyFocus stepId={`modulo-${key}`} stepTitle={stage.name} suggestedGoal={lesson.challenge[0]}/></details>
      <section className="curriculum-block journey-materials" aria-labelledby={`materials-${key}`}><div><span className="journey-label">02 / ESTUDE COM APOIO</span><h4 id={`materials-${key}`}>Um trecho por vez.</h4><p>A explicação e o exercício desta página estão em português. Use os links para estudar o ponto indicado; a biblioteca completa continua abaixo da trilha.</p></div>
        <div><div className="curriculum-filters"><label>Idioma<select value={language} onChange={e => setLanguage(e.target.value)}><option value="all">Todos</option><option value="pt">Português</option></select></label><label>Formato<select value={format} onChange={e => setFormat(e.target.value)}><option value="all">Todos</option>{formats.map(value => <option key={value}>{value}</option>)}</select></label></div><div className="curriculum-resources">{visibleMaterials.map((item) => <a key={item.url} href={item.url} target="_blank" rel="noopener noreferrer"><span>{lesson.materials.indexOf(item) === 0 ? 'PRINCIPAL' : 'APOIO'} · {item.format}</span><strong>{item.title}<ExternalLink size={16}/></strong><small>{item.language} · {item.time}</small><p><b>Use para:</b> {item.focus}</p><small>{item.certificate}</small></a>)}</div>{!visibleMaterials.length && <p className="curriculum-empty">Nenhum material combina com estes filtros. A explicação e o exemplo em português continuam abaixo. <button onClick={() => { setLanguage('all'); setFormat('all'); }}>Ver todos os materiais desta etapa</button></p>}</div>
      </section>
      <section className="curriculum-block"><span className="journey-label">03 / ACOMPANHE UM EXEMPLO</span><h4>Faça comigo, sem pular passos.</h4><p className="curriculum-situation">Situação: {guide.situation}</p><ol className="curriculum-steps">{lesson.walkthrough.map((item,index) => <li key={item}><span>{index+1}</span><p>{item}</p></li>)}</ol><div className="curriculum-example"><span>EXEMPLO DIDÁTICO · DADOS FICTÍCIOS</span><pre><code>{lesson.example}</code></pre></div><div className="curriculum-result"><strong>Como conferir o exemplo</strong><p>{lesson.expected}</p></div><details className="curriculum-unblock"><summary>Travou? Veja por onde começar.</summary><p>{lesson.unblock}</p></details></section>
      <section className="curriculum-block curriculum-challenge"><span className="journey-label">04 / AGORA TENTE SOZINHO</span><h4>{activeStage === 4 ? 'Seu projeto para revisão.' : 'Mude o exemplo e teste seu entendimento.'}</h4><p>Pode consultar o material se precisar. Depois tente uma variação sem copiar e anote o que conseguiu demonstrar.</p><ol>{lesson.challenge.map(item => <li key={item}>{item}</li>)}</ol><p><strong>O que guardar:</strong> {guide.outcome}</p><aside><CircleAlert size={20}/><div><strong>Ponto de atenção</strong><p>{guide.attention}</p></div></aside><label className="curriculum-evidence" htmlFor={`evidence-${key}`}>Seu registro de prática <small>Explique o que tentou, o resultado observado, uma falha e a próxima dúvida. Salvo apenas neste navegador; este texto não tem correção automática.</small><textarea id={`evidence-${key}`} rows={4} maxLength={1200} value={progress.drafts[key] ?? ''} placeholder="Ex.: testei a entrada…, esperava…, observei…, corrigi…" onChange={event => save({ ...progress, drafts: { ...progress.drafts, [key]: event.target.value } })}/></label><details className="curriculum-unblock"><summary>Comparar com o resultado esperado</summary><p>{lesson.expected}</p><ul>{guide.checks.map(check => <li key={check}>{check}</li>)}</ul><p>Compare o sentido e a evidência, não palavras exatas. Para código e APIs, execute os testes no seu ambiente; a página não inspeciona seus arquivos.</p></details></section>
      <LabCheckpoint key={quizKey} stepId={quizKey} questions={lesson.questions} title="05. Confira seu raciocínio" passed={progress.passed} onPass={index => save({ ...progress, passed: [...new Set([...progress.passed, `${quizKey}-${index}`])] })} onReset={() => { save({ ...progress, passed: progress.passed.filter(item => !item.startsWith(`${quizKey}-`)) }); setNotice('Verificação reaberta. Sua prática e seus critérios foram preservados.'); }}/>
      <PracticeStudio key={`practice-${key}`} id={`mod-${key}`} title={`${module.title} · nível ${activeStage}`} module={module.id} stage={activeStage} exercise={{sequence:lesson.walkthrough,recall:lesson.questions[0].prompt,scenario:transfer[0],expected:transfer[1],transfer:transfer[2],rubric:['Justifiquei minha resposta com uma evidência do caso.','Comparei meu raciocínio com a análise e corrigi divergências.','Tentei a mudança proposta no teste de transferência e expliquei o resultado.']}}/>
      <section className="module-stage-checks"><span className="journey-label">06 / COMPROVE SUA ENTREGA</span><h4>Avance pela evidência.</h4><p>O teste acima confere uma decisão. Marque estes critérios somente se sua prática os demonstrou. No projeto final, peça revisão e execute uma mudança de requisito para conferir autonomia.</p>{guide.checks.map((check,index) => <label key={check}><input type="checkbox" checked={!!progress.checks[`${key}-${index}`]} onChange={() => toggleCheck(index)}/><span>{check}</span></label>)}</section>
      <div className="journey-actions"><button className={`done-button ${finished ? 'is-done' : ''}`} disabled={!ready} onClick={completeStage}><Check size={17}/>{finished ? 'Reabrir entrega' : priorEvidence ? 'Confirmar nova verificação' : 'Registrar entrega concluída'}</button>{!ready && <small>{!quizReady ? 'Complete a verificação de raciocínio. ' : ''}{!checksReady ? 'Confira os critérios na sua prática.' : ''}</small>}</div>
      {finished && <section className="module-review"><div><span className="journey-label">REVISÃO FUTURA</span><strong>{progress.reviews[key] ? 'Revisão registrada.' : `Volte em ${reviewDate?.toLocaleDateString('pt-BR')} e tente uma variação sem consultar.`}</strong><p>Explique o motivo da decisão e compare com sua evidência. Se travar, revise o ponto específico.</p></div><button className="journey-next" onClick={() => save({ ...progress, reviews: { ...progress.reviews, [key]: !progress.reviews[key] } })}>{progress.reviews[key] ? 'Reabrir revisão' : 'Registrar revisão'}</button></section>}
      <nav className="curriculum-pagination" aria-label="Continuar a trilha"><button disabled={activeStage===0} onClick={() => selectStage(activeStage-1)}><ArrowLeft size={17}/> Nível anterior</button><button disabled={activeStage===module.stages.length-1} onClick={() => selectStage(activeStage+1)}>Ver próximo nível <ArrowRight size={17}/></button></nav>
    </article>
    <footer className="journey-closing"><strong>Depois do projeto avançado</strong><p>{moduleGuidance[module.id].closing} Peça revisão, teste uma situação nova e aprofunde a lacuna encontrada. O progresso local registra sua avaliação; não é certificação.</p></footer>
    <details className="module-kit"><summary>Kit de prática e guia para consulta offline</summary><p>Arquivos iniciais e a trilha completa, com respostas explicadas e critérios. Os exemplos usam dados fictícios.</p><ul>{moduleKits[module.id].map(item => <li key={item.file}><a href={`${import.meta.env.BASE_URL}kits/${item.file}`} download><Download size={15}/><span><strong>{item.title}</strong><small>{item.description}</small></span></a></li>)}<li><a href={`${import.meta.env.BASE_URL}kits/trilha-${module.id}.md`} download><Download size={15}/><span><strong>Trilha completa: cinco níveis</strong><small>Exemplos, materiais, desafios, respostas e rubrica do projeto.</small></span></a></li></ul></details>
    <p className="curriculum-note">Percurso revisado em 30/09/2026. Exemplos e estados são convenções didáticas; documentação oficial fundamenta as tecnologias. Formações e certificados têm condições próprias.</p><p className="curriculum-notice" role="status" aria-live="polite">{notice}</p>
  </section>;
}
