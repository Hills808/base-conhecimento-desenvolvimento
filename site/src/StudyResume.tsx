import { useEffect, useState } from "react";
import { BookOpen, CalendarClock, Check, FlaskConical } from "lucide-react";
import curriculum from "./data/laboratory.json";
import { modules } from "./data/modules";
import { readModuleProgress, type ModuleProgress } from "./moduleProgress";

type LabProgress = { done: string[]; last: number; completedAt: Record<string, string>; reviews: Record<string, boolean> };
type Props = { onOpenModule: (id: number) => void; onOpenLabStep: (index: number) => void };
const labKey = "curva-aberta-laboratorio-v2";

function readLabProgress(): LabProgress {
  try {
    const value = JSON.parse(localStorage.getItem(labKey) || "null");
    const done = Array.isArray(value?.done) ? value.done.filter((id: unknown): id is string => typeof id === "string" && curriculum.steps.some(step => step.id === id)) : [];
    return { done, last: Number.isInteger(value?.last) ? Math.max(0, Math.min(curriculum.steps.length - 1, value.last)) : 0, completedAt: value?.completedAt || {}, reviews: value?.reviews || {} };
  } catch { return { done: [], last: 0, completedAt: {}, reviews: {} }; }
}
function reviewCount(moduleProgress: ModuleProgress, labProgress: LabProgress) {
  const due = (date: string | undefined, reviewed: boolean | undefined) => Boolean(date && !reviewed && Date.now() >= new Date(date).getTime() + 7 * 86400000);
  return Object.entries(moduleProgress.completedAt).filter(([key, date]) => due(date, moduleProgress.reviews[key])).length + Object.entries(labProgress.completedAt).filter(([key, date]) => due(date, labProgress.reviews[key])).length;
}

export default function StudyResume({ onOpenModule, onOpenLabStep }: Props) {
  const [moduleProgress, setModuleProgress] = useState<ModuleProgress>(readModuleProgress);
  const [labProgress, setLabProgress] = useState<LabProgress>(readLabProgress);
  useEffect(() => {
    const refresh = () => { setModuleProgress(readModuleProgress()); setLabProgress(readLabProgress()); };
    window.addEventListener("curva-aberta-progress-change", refresh);
    window.addEventListener("storage", refresh);
    return () => { window.removeEventListener("curva-aberta-progress-change", refresh); window.removeEventListener("storage", refresh); };
  }, []);

  const moduleDone = moduleProgress.done.length;
  const labDone = labProgress.done.length;
  const lastModuleId = Object.keys(moduleProgress.lastByModule).map(Number).find(id => modules[id]);
  const moduleStage = lastModuleId === undefined ? 0 : moduleProgress.lastByModule[lastModuleId] ?? 0;
  const currentModule = lastModuleId === undefined ? null : modules[lastModuleId];
  const pendingReviews = reviewCount(moduleProgress, labProgress);

  return <section className="study-resume" aria-label="Continue daqui">
    <div className="resume-heading"><div><span className="eyebrow ink">SEU ESTUDO NESTE NAVEGADOR</span><h2>Continue daqui.</h2><p>Progresso por entregas, não por tempo de tela. Nada é enviado para uma conta.</p></div>{pendingReviews > 0 && <span className="resume-review-count"><CalendarClock size={16}/>{pendingReviews} revisão{pendingReviews > 1 ? "ões" : ""} pendente{pendingReviews > 1 ? "s" : ""}</span>}</div>
    <div className="resume-grid">
      <article><FlaskConical size={21}/><span>LABORATÓRIO MCP</span><strong>{labDone}/{curriculum.steps.length} entregas</strong><p>{labDone ? `Próxima referência: ${curriculum.steps[labProgress.last].title}.` : "Comece por HTTP e JSON; depois avance para .NET, MCP e Skills."}</p><button onClick={() => onOpenLabStep(labProgress.last)}>{labDone ? "Retomar laboratório" : "Começar laboratório"}</button></article>
      <article><BookOpen size={21}/><span>MÓDULOS GERAIS</span><strong>{moduleDone}/27 entregas</strong><p>{currentModule ? `Você estava em ${currentModule.title}, etapa ${moduleStage + 1}.` : "Escolha uma área e marque apenas entregas que você realmente comprovou."}</p><button onClick={() => onOpenModule(currentModule?.id ?? 0)}>{currentModule ? "Retomar módulo" : "Explorar começo"}</button></article>
      <article className={pendingReviews ? "resume-review-card due" : "resume-review-card"}><CalendarClock size={21}/><span>REVISÃO FUTURA</span><strong>{pendingReviews ? `${pendingReviews} para revisar` : "Nada pendente"}</strong><p>{pendingReviews ? "Abra a entrega, explique sem consultar e registre uma revisão curta." : "Quando concluir uma entrega, ela volta aqui em sete dias."}</p><button onClick={() => pendingReviews ? onOpenModule(currentModule?.id ?? 0) : onOpenModule(0)}>{pendingReviews ? "Ver minha última entrega" : "Entender o método"}</button></article>
    </div>
    <p className="resume-note"><Check size={15}/> Você pode reabrir uma entrega a qualquer momento; concluir não bloqueia caminhos nem cria uma sequência obrigatória.</p>
  </section>;
}
