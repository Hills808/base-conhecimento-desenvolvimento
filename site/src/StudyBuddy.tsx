import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, ChevronDown, CircleHelp, Grip, Lightbulb, Minimize2, MoveHorizontal, ShieldAlert, Sparkles, X } from "lucide-react";
import type { Module } from "./data/modules";
import { moduleGuidance } from "./data/module-guidance";
import "./study-buddy.css";

type Mode = "tip" | "attention" | "review" | "curiosity";
type Dock = "left" | "right";
type LabContext = { step: number; title: string; tip: string; attention: string; curiosity: string; question: string; answer: string };
type Saved = { dock: Dock; offsetY: number; hidden: boolean };
const storageKey = "curva-aberta-study-buddy-v1";
const curiosity: Record<number, string> = {
  0: "Explicar algo com suas palavras ajuda a perceber lacunas que passam despercebidas enquanto você só lê.",
  1: "Um programa pequeno que você consegue explicar vale mais como prática do que código longo copiado sem entender.",
  2: "OpenAPI descreve o contrato; Swagger UI é uma das interfaces que pode exibir e testar essa descrição.",
  3: "Navegar só com teclado costuma revelar problemas de foco que passam despercebidos usando mouse.",
  4: "Uma contagem simples antes e depois de um JOIN pode revelar linhas duplicadas difíceis de notar no resultado.",
  5: "Uma rota previsível e testável geralmente facilita mais a manutenção que uma regra de roteamento muito esperta.",
  6: "Um teste que falha quando o comportamento muda é uma evidência concreta; cobertura alta sozinha não garante isso.",
  7: "A licença informa como o projeto pode ser usado; muitas estrelas não substituem essa verificação.",
  8: "Ler documentação procurando uma resposta específica reduz a tentação de traduzir cada palavra desconhecida.",
  9: "No MCP, a descoberta de uma tool não concede autorização para executá-la: o host e o servidor ainda precisam aplicar seus controles."
};

function readSaved(): Saved {
  try {
    const value = JSON.parse(localStorage.getItem(storageKey) || "null");
    return { dock: value?.dock === "left" ? "left" : "right", offsetY: Number.isFinite(value?.offsetY) ? Math.max(0, value.offsetY) : 0, hidden: value?.hidden === true };
  } catch { return { dock: "right", offsetY: 0, hidden: false }; }
}

function BuddyArt({ pose, small = false }: { pose: string; small?: boolean }) {
  return <span className={`buddy-art ${small ? "small" : ""} pose-${pose}`} aria-hidden="true"><img src={`${import.meta.env.BASE_URL}furina-buddy.png`} alt="" draggable={false}/></span>;
}

export default function StudyBuddy({ module, stage }: { module: Module | null; stage: string }) {
  const [saved, setSaved] = useState<Saved>(readSaved);
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<Mode>("tip");
  const [expanded, setExpanded] = useState(false);
  const [lab, setLab] = useState<LabContext | null>(null);
  const [announcement, setAnnouncement] = useState("");
  const [dragging, setDragging] = useState(false);
  const panel = useRef<HTMLElement>(null);
  const dragStart = useRef<{ y: number; moved: boolean } | null>(null);
  const suppressClick = useRef(false);
  const stageIndex = Math.min(2, Math.max(0, Number(stage) || 0));
  const labActive = module?.id === 9;
  const guide = module ? moduleGuidance[module.id]?.stages[stageIndex] : null;
  const currentStage = module?.stages[stageIndex];
  const contextKey = labActive ? `lab-${lab?.step ?? 0}` : module ? `module-${module.id}-${stageIndex}` : "home";

  useEffect(() => {
    const receive = (event: Event) => setLab((event as CustomEvent<LabContext>).detail);
    window.addEventListener("curva-aberta-study-context", receive);
    return () => window.removeEventListener("curva-aberta-study-context", receive);
  }, []);

  useEffect(() => {
    setMode("tip"); setExpanded(false);
    if (labActive) setAnnouncement(lab?.title ? `Agora com você em: ${lab.title}` : "Furina acompanha a etapa do laboratório.");
    else setAnnouncement(module ? `Dicas para ${module.title}.` : "Escolha um módulo e Furina traz dicas para começar.");
    // Clear only transient copy when the learner changes study context.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contextKey]);

  useEffect(() => {
    try { localStorage.setItem(storageKey, JSON.stringify(saved)); } catch { /* device preference only */ }
  }, [saved]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => { if (event.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const keepVisible = () => {
      const max = Math.max(0, window.innerHeight - (panel.current?.offsetHeight || 360) - 28);
      setSaved(value => value.offsetY > max ? { ...value, offsetY: max } : value);
    };
    keepVisible();
    window.addEventListener("resize", keepVisible);
    return () => window.removeEventListener("resize", keepVisible);
  }, [open]);

  const card = useMemo(() => {
    if (labActive && lab) {
      const options = {
        tip: { title: "Dica para esta etapa", text: lab.tip, extra: `Você está estudando: ${lab.title}`, pose: "point" },
        attention: { title: "Ponto de atenção", text: lab.attention, extra: `Nesta etapa: ${lab.title}`, pose: "question" },
        review: { title: "Teste o que aprendeu", text: lab.question, extra: lab.answer, pose: "question" },
        curiosity: { title: "Curiosidade técnica", text: lab.curiosity, extra: "A curiosidade ajuda a ligar o conceito ao uso real.", pose: "celebrate" }
      };
      return options[mode];
    }
    if (!module || !currentStage || !guide) {
      const options = {
        tip: { title: "Um primeiro passo", text: "Escolha um módulo que responda a uma curiosidade sua. Comece pelo material principal e faça a prática curta.", extra: "Você pode trocar de assunto quando quiser; seu progresso continua salvo neste navegador.", pose: "point" },
        attention: { title: "Para não dispersar", text: "Não tente abrir todos os links de uma vez. Cada módulo mostra o que estudar primeiro e o que pode ficar como consulta.", extra: "Uma entrega pequena ajuda a transformar leitura em aprendizado que você consegue demonstrar.", pose: "question" },
        review: { title: "Uma pergunta para começar", text: "O que você gostaria de conseguir fazer depois de estudar?", extra: "Escolha um objetivo prático e procure o módulo mais próximo dele.", pose: "question" },
        curiosity: { title: "Como usar esta base", text: "Cada módulo reúne uma trilha, materiais e uma atividade prática para você testar o que estudou.", extra: "A página salva seu avanço apenas neste navegador.", pose: "celebrate" }
      };
      return options[mode];
    }
    const options = {
      tip: { title: "Experimente nesta etapa", text: currentStage.practice, extra: `Uma forma de começar: ${moduleGuidance[module.id]?.firstMove || currentStage.learn[0]}`, pose: "point" },
      attention: { title: "Ponto de atenção", text: guide.attention, extra: `Nesta etapa: ${currentStage.name}`, pose: "question" },
      review: { title: "Confira se fixou", text: currentStage.proof, extra: `Você vai praticar: ${currentStage.learn.join(" · ")}`, pose: "question" },
      curiosity: { title: "Curiosidade técnica", text: curiosity[module.id], extra: module.outcome, pose: "celebrate" }
    };
    return options[mode];
  }, [labActive, lab, mode, module, currentStage, guide]);

  function announce(text: string) { setAnnouncement(text); }
  function startDrag(event: React.PointerEvent<HTMLButtonElement>) {
    if (event.button !== 0) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    dragStart.current = { y: event.clientY, moved: false };
    setDragging(true);
  }
  function moveDrag(event: React.PointerEvent<HTMLButtonElement>) {
    if (!dragStart.current) return;
    if (Math.abs(event.clientY - dragStart.current.y) > 5) dragStart.current.moved = true;
    if (!dragStart.current.moved) return;
    const height = panel.current?.offsetHeight || 360;
    const max = Math.max(0, window.innerHeight - height - 28);
    const bottom = Math.min(max, Math.max(0, window.innerHeight - event.clientY - 24));
    setSaved(value => ({ ...value, dock: event.clientX < window.innerWidth / 2 ? "left" : "right", offsetY: bottom }));
  }
  function endDrag() {
    if (dragStart.current?.moved) { suppressClick.current = true; window.setTimeout(() => { suppressClick.current = false; }, 0); }
    dragStart.current = null; setDragging(false);
  }
  function toggleMode(next: Mode) { setMode(next); setExpanded(false); announce(next === "tip" ? "Dica atualizada." : next === "attention" ? "Ponto de atenção atualizado." : next === "review" ? "Pergunta de revisão atualizada." : "Curiosidade atualizada."); }

  const pose = card.pose;
  const dockStyle = { "--buddy-offset": `${saved.offsetY}px` } as React.CSSProperties;
  if (saved.hidden) return <button className={`buddy-reopen dock-${saved.dock}`} style={dockStyle} onClick={() => setSaved(value => ({ ...value, hidden: false }))} aria-label="Mostrar Furina, sua guia de estudos"><BuddyArt pose="idle" small/><span>Furina</span></button>;

  return <aside ref={panel} className={`study-buddy dock-${saved.dock} ${open ? "is-open" : "is-closed"} ${dragging ? "is-dragging" : ""}`} style={dockStyle} aria-label="Furina, guia de estudos">
    {open ? <>
      <div className="buddy-card">
        <div className="buddy-card-top">
          <button className="buddy-grip" onPointerDown={startDrag} onPointerMove={moveDrag} onPointerUp={endDrag} onPointerCancel={endDrag} aria-label="Segure e arraste para mover Furina de lado" title="Segure e arraste para mover"><Grip size={17}/><span>MOVER</span></button>
          <span className="buddy-name"><i/>Furina <small>guia de estudos</small></span>
          <button className="buddy-icon-button" onClick={() => setOpen(false)} aria-label="Recolher Furina"><Minimize2 size={17}/></button>
          <button className="buddy-icon-button" onClick={() => setSaved(value => ({ ...value, hidden: true }))} aria-label="Ocultar Furina"><X size={17}/></button>
        </div>
        <div className="buddy-dialogue">
          <button className="buddy-figure-button" onClick={() => { const order: Mode[] = ["tip", "attention", "review", "curiosity"]; toggleMode(order[(order.indexOf(mode) + 1) % order.length]); }} aria-label="Clique na Furina para ver outra dica"><BuddyArt pose={pose}/><span className="buddy-tap-hint">toque para trocar</span></button>
          <div className={`buddy-copy tone-${mode}`}>
            <span className="buddy-caption">{module ? `MÓDULO ${String(module.id).padStart(2,"0")}${module.id === 9 ? lab ? ` · ETAPA ${lab.step + 1}` : " · MCP" : ` · ETAPA ${stageIndex + 1}`}` : "DICA DE ESTUDO"}</span>
            <h3>{card.title}</h3><p>{card.text}</p>
            {expanded && <p className="buddy-extra">{card.extra}</p>}
            <button className="buddy-expand" onClick={() => setExpanded(value => !value)} aria-expanded={expanded}>{mode === "review" ? expanded ? "Esconder resposta" : "Ver uma resposta possível" : expanded ? "Mostrar menos" : "Ver mais"}<ChevronDown size={15}/></button>
          </div>
        </div>
        <div className="buddy-actions" aria-label="Escolher tipo de ajuda">
          <button className={mode === "tip" ? "selected" : ""} onClick={() => toggleMode("tip")}><Lightbulb size={15}/>Dica</button>
          <button className={mode === "attention" ? "selected attention" : ""} onClick={() => toggleMode("attention")}><ShieldAlert size={15}/>Atenção</button>
          <button className={mode === "review" ? "selected" : ""} onClick={() => toggleMode("review")}><CircleHelp size={15}/>Me testa</button>
          <button className={mode === "curiosity" ? "selected" : ""} onClick={() => toggleMode("curiosity")}><Sparkles size={15}/>Curiosidade</button>
        </div>
        <div className="buddy-footer"><span><MoveHorizontal size={14}/>Sem IA · dicas desta trilha</span><div><button onClick={() => { setSaved(value => ({ ...value, dock: "left", offsetY: 0 })); announce("Furina movida para o lado esquerdo."); }} aria-label="Mover Furina para a esquerda" title="Mover para esquerda"><ArrowLeft size={17}/></button><button onClick={() => { setSaved(value => ({ ...value, dock: "right", offsetY: 0 })); announce("Furina movida para o lado direito."); }} aria-label="Mover Furina para a direita" title="Mover para direita"><ArrowRight size={17}/></button></div></div>
        <p className="buddy-live" role="status" aria-live="polite">{announcement}</p>
      </div>
    </> : <div className="buddy-closed-row">
      <button className="buddy-drag-closed" onPointerDown={startDrag} onPointerMove={moveDrag} onPointerUp={endDrag} onPointerCancel={endDrag} aria-label="Segure e arraste Furina para o outro lado"><Grip size={15}/></button>
      <button className="buddy-open-button" onClick={() => { if (suppressClick.current) return; setOpen(true); announce("Que bom ter você por aqui. Escolha uma dica para esta etapa."); }}><BuddyArt pose="idle" small/><span>Precisa de uma dica?</span><b>Furina</b></button>
      <button className="buddy-hide-closed" onClick={() => setSaved(value => ({ ...value, hidden: true }))} aria-label="Ocultar Furina"><X size={15}/></button>
    </div>}
  </aside>;
}
