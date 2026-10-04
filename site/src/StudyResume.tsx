import { useEffect, useState } from "react";
import { BookOpen, CalendarClock, Check, FlaskConical } from "lucide-react";
import curriculum from "./data/laboratory.json";
import { modules } from "./data/modules";
import { readModuleProgress, isStageVerified, type ModuleProgress } from "./moduleProgress";
import { readPractice } from './learningPractice';
import './learning-method.css';

import { readLabProgress, isLabVerified, type LabProgress } from './labProgress';
type Props = { onOpenModule: (id: number) => void; onOpenLabStep: (index: number) => void };

export default function StudyResume({ onOpenModule, onOpenLabStep }: Props) {
  const [moduleProgress, setModuleProgress] = useState<ModuleProgress>(readModuleProgress);
  const [labProgress, setLabProgress] = useState<LabProgress>(readLabProgress);
  const [practice, setPractice] = useState(readPractice);
  const [clock, setClock] = useState(Date.now());
  useEffect(() => {
    const refresh = () => { setModuleProgress(readModuleProgress()); setLabProgress(readLabProgress()); setPractice(readPractice()); setClock(Date.now()); };
    window.addEventListener("curva-aberta-progress-change", refresh);
    window.addEventListener("curva-aberta-practice-change", refresh);
    window.addEventListener("storage", refresh);
    window.addEventListener("focus", refresh);
    document.addEventListener("visibilitychange", refresh);
    const timer = window.setInterval(() => { if (!document.hidden) setClock(Date.now()); }, 60000);
    return () => { window.removeEventListener("curva-aberta-progress-change", refresh); window.removeEventListener("curva-aberta-practice-change", refresh); window.removeEventListener("storage", refresh); window.removeEventListener("focus", refresh); document.removeEventListener("visibilitychange", refresh); window.clearInterval(timer); };
  }, []);

  const moduleDone = modules.filter(module => module.id !== 9).reduce((sum,module) => sum + module.stages.filter((_,i) => isStageVerified(moduleProgress,module.id,i)).length,0);
  const labDone = labProgress.done.filter(id => isLabVerified(labProgress, id)).length;
  const lastModuleId = moduleProgress.lastModule ?? Object.keys(moduleProgress.lastByModule).map(Number).find(id => modules[id]);
  const moduleStage = lastModuleId === undefined ? 0 : moduleProgress.lastByModule[lastModuleId] ?? 0;
  const currentModule = lastModuleId === undefined ? null : modules[lastModuleId];
  const base=import.meta.env.BASE_URL;
  const reviewItems = [
    ...Object.values(practice).map(p=>({key:p.id,title:p.title,due:Date.parse(p.due),href:`${base}?modulo=${p.module}${p.lab?`&etapa=${p.stage+1}`:`&nivel=${p.stage}`}#practice-${p.id}`,kind:'Treino de autonomia'})),
    ...Object.entries(moduleProgress.completedAt).filter(([key])=>!moduleProgress.reviews[key]&&!practice[`mod-${key}`]).map(([key,date])=>{const [id,level]=key.split('-').map(Number);return {key,title:`${modules[id]?.title??'Módulo'} · nível ${level}`,due:Date.parse(date)+7*86400000,href:`${base}?modulo=${id}&nivel=${level}`,kind:'Entrega do módulo'};}),
    ...Object.entries(labProgress.completedAt).filter(([key])=>!labProgress.reviews[key]&&!practice[`lab-${key}`]).map(([key,date])=>{const index=curriculum.steps.findIndex(s=>s.id===key);return {key,title:curriculum.steps[index]?.title??'Laboratório',due:Date.parse(date)+7*86400000,href:`${base}?modulo=09&etapa=${index+1}`,kind:'Entrega do laboratório'};})
  ].filter(item=>Number.isFinite(item.due)).sort((a,b)=>a.due-b.due);
  const pendingReviews = reviewItems.filter(item=>item.due<=clock).length;

  return <section className="study-resume" aria-label="Continue daqui">
    <div className="resume-heading"><div><span className="eyebrow ink">SEU ESTUDO NESTE NAVEGADOR</span><h2>Continue daqui.</h2><p>Progresso por entregas, não por tempo de tela. Nada é enviado para uma conta.</p></div>{pendingReviews > 0 && <span className="resume-review-count"><CalendarClock size={16}/>{pendingReviews} {pendingReviews === 1 ? 'revisão pendente' : 'revisões pendentes'}</span>}</div>
    <div className="resume-grid">
      <article><FlaskConical size={21}/><span>LABORATÓRIO MCP</span><strong>{labDone}/{curriculum.steps.length} entregas</strong><p>{labDone ? `Próxima referência: ${curriculum.steps[labProgress.last].title}.` : "Comece por HTTP e JSON; depois avance para .NET, MCP e Skills."}</p><button onClick={() => onOpenLabStep(labProgress.last)}>{labDone ? "Retomar laboratório" : "Começar laboratório"}</button></article>
      <article><BookOpen size={21}/><span>MÓDULOS GERAIS</span><strong>{moduleDone}/{modules.filter(m => m.id !== 9).reduce((sum, m) => sum + m.stages.length, 0)} entregas verificadas</strong><p>{currentModule ? `Você estava em ${currentModule.title}, nível ${moduleStage}.` : "Cinco níveis por área: do primeiro exemplo ao projeto avançado com critérios e revisão."}</p><button onClick={() => onOpenModule(currentModule?.id ?? 0)}>{currentModule ? "Retomar módulo" : "Explorar começo"}</button></article>
      <article className={pendingReviews ? "resume-review-card due" : "resume-review-card"}><CalendarClock size={21}/><span>REVISÃO FUTURA</span><strong>{pendingReviews ? `${pendingReviews} para revisar` : "Nada pendente"}</strong><p>{pendingReviews ? "Retome a situação indicada, tente responder sem consultar e compare com os critérios." : "Registre um treino de autonomia para agendar revisões. Entregas sem treino voltam em sete dias."}</p>{reviewItems.length?<a className="resume-review-link" href={reviewItems[0].href}>{pendingReviews?'Abrir revisão pendente':'Ver próxima revisão'}</a>:<button onClick={()=>onOpenModule(0)}>Entender o método</button>}</article>
    </div>
    {reviewItems.length>0&&<section className="practice-queue" aria-label="Fila de revisões"><h3>Suas próximas revisões</h3><p className="learning-small">Abra a etapa exata. Os registros ficam somente neste navegador.</p><ul>{reviewItems.slice(0,5).map(item=><li key={item.key}><a href={item.href}><strong>{item.title}</strong><small>{item.kind} · {item.due<=clock?'Disponível para revisar':`Em ${new Date(item.due).toLocaleDateString('pt-BR')}`}</small></a></li>)}</ul>{reviewItems.length>5&&<details><summary>Ver outras {reviewItems.length-5} revisões</summary><ul>{reviewItems.slice(5).map(item=><li key={item.key}><a href={item.href}>{item.title}<small>{new Date(item.due).toLocaleDateString('pt-BR')}</small></a></li>)}</ul></details>}</section>}
    <p className="resume-note"><Check size={15}/> Você pode reabrir uma entrega a qualquer momento; concluir não bloqueia caminhos nem cria uma sequência obrigatória.</p>
  </section>;
}
