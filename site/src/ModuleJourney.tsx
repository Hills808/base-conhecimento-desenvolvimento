import { useState } from "react";
import { Check, CircleAlert, Compass, ExternalLink, Lightbulb, Target } from "lucide-react";
import type { Module } from "./data/modules";
import { moduleGuidance } from "./data/module-guidance";
import startingPoints from "./data/starting-points.json";
import rawResources from "./data/resources.json";

type Resource = { title: string; url: string; type: string; host: string; note?: string };
const resources = rawResources as Resource[];

type Props = {
  module: Module;
  done: string[];
  onToggle: (key: string) => void;
};

export default function ModuleJourney({ module, done, onToggle }: Props) {
  const [activeStage, setActiveStage] = useState(0);
  const guidance = moduleGuidance[module.id];
  const complete = module.stages.filter((_, index) => done.includes(`${module.id}-${index}`)).length;
  const stage = module.stages[activeStage];
  const guide = guidance.stages[activeStage];
  const key = `${module.id}-${activeStage}`;
  const materialUrls = startingPoints[module.id]?.[activeStage] ?? [];

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
        const isDone = done.includes(`${module.id}-${index}`);
        return <button key={item.name} role="tab" aria-selected={activeStage === index} className={`journey-stage ${activeStage === index ? "active" : ""} ${isDone ? "done" : ""}`} onClick={() => setActiveStage(index)}>
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
            return <a key={url} href={url} target="_blank" rel="noopener noreferrer" className="journey-resource">
              <span>{index === 0 ? "PRINCIPAL" : "APOIO"}</span>
              <strong>{resource?.title ?? "Material recomendado"}</strong>
              <small>{resource?.type ?? "Leitura"} · {resource?.host ?? "abre em outra aba"}</small>
              <ExternalLink size={16}/>
            </a>;
          })}
        </div>
      </section>

      <div className="journey-review-grid">
        <section className="journey-attention"><CircleAlert size={19}/><div><strong>Ponto de atenção</strong><p>{guide.attention}</p></div></section>
        <section className="journey-checks"><Lightbulb size={19}/><div><strong>Antes de registrar, confirme</strong><ul>{guide.checks.map(check => <li key={check}>{check}</li>)}</ul></div></section>
      </div>

      <div className="journey-actions">
        <button className={`done-button ${done.includes(key) ? "is-done" : ""}`} onClick={() => onToggle(key)}><Check size={17}/>{done.includes(key) ? "Entrega registrada" : "Registrar entrega concluída"}</button>
        {activeStage < 2 && <button className="journey-next" onClick={() => setActiveStage(activeStage + 1)}>Ver próxima etapa</button>}
      </div>
    </article>

    <footer className="journey-closing"><strong>O que este módulo deixa pronto</strong><p>{guidance.closing}</p></footer>
  </section>;
}
