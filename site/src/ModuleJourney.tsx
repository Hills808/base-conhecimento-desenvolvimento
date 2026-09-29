import { useState } from "react";
import { Check, CircleAlert, Compass, Download, ExternalLink, Lightbulb, Target } from "lucide-react";
import type { Module } from "./data/modules";
import { moduleGuidance } from "./data/module-guidance";
import { moduleKits } from "./data/module-kits";
import { readModuleProgress, saveModuleProgress, type ModuleProgress } from "./moduleProgress";
import startingPoints from "./data/starting-points.json";
import rawResources from "./data/resources.json";
import StudyFocus from "./StudyFocus";
import { getResourceMeta } from "./resourceMeta";

type Resource = { title: string; url: string; type: string; host: string; note?: string };
const resources = rawResources as Resource[];

export default function ModuleJourney({ module }: { module: Module }) {
  const [activeStage, setActiveStage] = useState(0);
  const [progress, setProgress] = useState<ModuleProgress>(readModuleProgress);
  const guidance = moduleGuidance[module.id];
  const complete = module.stages.filter((_, index) => progress.done.includes(`${module.id}-${index}`)).length;
  const stage = module.stages[activeStage];
  const guide = guidance.stages[activeStage];
  const key = `${module.id}-${activeStage}`;
  const materialUrls = startingPoints[module.id]?.[activeStage] ?? [];
  const ready = guide.checks.every((_, index) => progress.checks[`${key}-${index}`]);
  const finished = progress.done.includes(key);
  const completedDate = progress.completedAt[key];
  const reviewDate = completedDate ? new Date(new Date(completedDate).getTime() + 7 * 86400000) : null;
  const kitBase = `${import.meta.env.BASE_URL}kits/`;
  function save(next: ModuleProgress) { setProgress(next); saveModuleProgress(next); }
  function selectStage(index: number) { setActiveStage(index); save({ ...progress, lastByModule: { ...progress.lastByModule, [module.id]: index } }); }
  function toggleCheck(index: number) {
    const checkKey = `${key}-${index}`;
    const checked = !progress.checks[checkKey];
    const next = { ...progress, checks: { ...progress.checks, [checkKey]: checked } };
    if (!checked && next.done.includes(key)) {
      next.done = next.done.filter(item => item !== key);
      delete next.completedAt[key]; delete next.reviews[key];
    }
    save(next);
  }
  function completeStage() {
    if (!ready) return;
    if (finished) {
      const next = { ...progress, done: progress.done.filter(item => item !== key), completedAt: { ...progress.completedAt }, reviews: { ...progress.reviews } };
      delete next.completedAt[key]; delete next.reviews[key]; save(next); return;
    }
    save({ ...progress, done: [...progress.done, key], completedAt: { ...progress.completedAt, [key]: new Date().toISOString() } });
  }
  function toggleReview() { save({ ...progress, reviews: { ...progress.reviews, [key]: !progress.reviews[key] } }); }

  return <section className="module-journey" aria-labelledby="journey-heading">
    <header className="journey-intro">
      <div>
        <span className="eyebrow ink">PERCURSO GUIADO</span>
        <h2 id="journey-heading">Aprenda para fazer algo concreto.</h2>
        <p>{guidance.orientation}</p>
      </div>
      <div className="journey-progress" aria-label={`${complete} de 3 entregas registradas`}>
        <strong>{complete}<span>/3</span></strong>
        <small>entregas registradas</small>
        <div aria-hidden="true"><i style={{ width: `${complete / 3 * 100}%` }} /></div>
      </div>
    </header>

    <div className="journey-start"><Compass size={20}/><div><strong>Como seguir este módulo</strong><p>{guidance.firstMove} Faça as etapas na sequência; se já conhecer um assunto, comece pelo exercício e use os critérios para confirmar.</p></div></div>

    <div className="journey-stages" role="tablist" aria-label={`Etapas de ${module.title}`}>
      {module.stages.map((item, index) => {
        const isDone = progress.done.includes(`${module.id}-${index}`);
        return <button key={item.name} role="tab" aria-selected={activeStage === index} className={`journey-stage ${activeStage === index ? "active" : ""} ${isDone ? "done" : ""}`} onClick={() => selectStage(index)}>
          <span>{isDone ? <Check size={16}/> : `0${index + 1}`}</span>
          <strong>{item.name}</strong>
          <small>{index === 0 ? "Comece aqui" : index === 1 ? "Pratique e confira" : "Consolide"}</small>
        </button>;
      })}
    </div>

    <article className="journey-card" role="tabpanel">
      <div className="journey-card-head">
        <span>ETAPA 0{activeStage + 1} · {activeStage === 0 ? "BASE" : activeStage === 1 ? "PRÁTICA" : "CONSOLIDAÇÃO"}</span>
        <h3>{stage.name}</h3>
        <p>{stage.practice}</p>
      </div>
      <StudyFocus stepId={`modulo-${module.id}-${activeStage}`} stepTitle={stage.name} suggestedGoal={stage.practice.length <= 90 ? stage.practice : stage.learn[0]} />

      <div className="journey-card-grid">
        <section className="journey-understand">
          <h4>Você vai entender</h4>
          <ul>{stage.learn.map(item => <li key={item}><span>✳</span>{item}</li>)}</ul>
          <div className="journey-proof"><Target size={18}/><div><strong>Ao terminar</strong><p>{stage.proof}</p></div></div>
        </section>
        <section className="journey-application">
          <span className="journey-label">SITUAÇÃO APLICADA</span>
          <p>{guide.situation}</p>
          <span className="journey-label">ENTREGA DESTA ETAPA</span>
          <p>{guide.outcome}</p>
        </section>
      </div>

      <section className="journey-materials" aria-labelledby="journey-materials-title">
        <div><span className="journey-label">ESTUDE COM APOIO</span><h4 id="journey-materials-title">Comece por um material. O outro é apoio.</h4></div>
        <div className="journey-resource-list">
          {materialUrls.map((url, index) => {
            const resource = resources.find(item => item.url === url);
            const meta = getResourceMeta(resource ?? { url, type: "Leitura", section: "Material de apoio" });
            return <a key={url} href={url} target="_blank" rel="noopener noreferrer" className="journey-resource">
              <span>{index === 0 ? "PRINCIPAL" : "APOIO"}</span>
              <strong>{resource?.title ?? "Material recomendado"}</strong>
              <small>{meta.language} · {meta.time}</small>
              <em>{meta.certificate}</em>
              <b>Use para: {meta.use}</b>
              <ExternalLink size={16}/>
            </a>;
          })}
        </div>
      </section>

      <div className="journey-review-grid">
        <section className="journey-attention"><CircleAlert size={19}/><div><strong>Ponto de atenção</strong><p>{guide.attention}</p></div></section>
        <section className="journey-checks"><Lightbulb size={19}/><div><strong>Antes de registrar, confirme</strong><ul>{guide.checks.map(check => <li key={check}>{check}</li>)}</ul></div></section>
      </div>

      <section className="module-stage-checks"><span className="journey-label">CRITÉRIOS DE CONCLUSÃO</span><h4>Não avance só porque assistiu ou leu.</h4><p>Marque o que você realmente demonstrou na entrega. Se um critério ainda não estiver claro, volte ao exercício ou ao material principal.</p>{guide.checks.map((check, index) => <label key={check}><input type="checkbox" checked={!!progress.checks[`${key}-${index}`]} onChange={() => toggleCheck(index)}/><span>{check}</span></label>)}</section>

      <div className="journey-actions">
        <button className={`done-button ${finished ? "is-done" : ""}`} disabled={!ready} onClick={completeStage}><Check size={17}/>{finished ? "Reabrir entrega" : "Registrar entrega concluída"}</button>
        {!ready && <small>Marque os três critérios para registrar a entrega.</small>}
        {activeStage < 2 && <button className="journey-next" onClick={() => selectStage(activeStage + 1)}>Ver próxima etapa</button>}
      </div>
    </article>

    <footer className="journey-closing"><strong>O que este módulo deixa pronto</strong><p>{guidance.closing}</p></footer>
    {finished && <section className="module-review"><div><span className="journey-label">REVISÃO FUTURA</span><strong>{progress.reviews[key] ? "Revisão curta registrada." : `Volte em ${reviewDate?.toLocaleDateString("pt-BR")} e explique a entrega sem abrir o material.`}</strong><p>Revisar é retomar a evidência e responder com suas palavras — não reassistir tudo.</p></div><button className="journey-next" onClick={toggleReview}>{progress.reviews[key] ? "Reabrir revisão" : "Registrar revisão de 2 min"}</button></section>}
    <details className="module-kit"><summary>Kit de prática deste módulo</summary><p>Arquivos de partida para adaptar com dados públicos ou fictícios. Eles não substituem a entrega; ajudam a começar sem uma página em branco.</p><ul>{moduleKits[module.id].map(item => <li key={item.file}><a href={kitBase + item.file} download><Download size={15}/><span><strong>{item.title}</strong><small>{item.description}</small></span></a></li>)}</ul></details>
  </section>;
}
