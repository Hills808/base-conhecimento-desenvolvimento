import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Check, CircleHelp, Lightbulb, ShieldAlert, Sparkles, X } from "lucide-react";
import type { Module } from "./data/modules";
import { moduleGuidance } from "./data/module-guidance";
import "./animated-mascot.css";

type Mode = "tip" | "attention" | "review" | "curiosity" | "success";
type LabContext = { step: number; title: string; tip: string; attention: string; curiosity: string; question: string; answer: string };
type ModuleContext = { moduleId: number; stage: number };
type Saved = { dock: "left" | "right"; offsetY: number; hidden: boolean };
const storageKey = "curva-aberta-furina-v2";
const curiosities: Record<number, string> = {
  0: "Explicar com suas palavras revela dúvidas que passaram despercebidas durante a leitura.",
  1: "Depurar um programa pequeno ensina mais do que copiar um projeto longo sem conseguir explicá-lo.",
  2: "OpenAPI descreve o contrato. Swagger UI é uma interface para consultar e testar essa descrição.",
  3: "Navegar só com teclado revela problemas de foco que o mouse costuma esconder.",
  4: "Contar linhas antes e depois de um JOIN ajuda a encontrar duplicações difíceis de notar.",
  5: "Uma rota previsível costuma ser mais fácil de testar e manter do que uma regra de roteamento complexa.",
  6: "Um bom teste falha quando o comportamento esperado quebra; o número de testes sozinho não prova qualidade.",
  7: "A licença de um repositório diz como você pode usá-lo. Estrelas não substituem essa leitura.",
  8: "Ler uma documentação para responder a uma pergunta costuma funcionar melhor do que traduzir cada palavra.",
  9: "Descobrir uma tool MCP não dá ao agente permissão para executá-la; host e servidor ainda precisam aplicar os controles."
};

function readSaved(): Saved {
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey) || "null");
    return { dock: saved?.dock === "left" ? "left" : "right", offsetY: Number.isFinite(saved?.offsetY) ? Math.max(0, saved.offsetY) : 0, hidden: saved?.hidden === true };
  } catch { return { dock: "right", offsetY: 0, hidden: false }; }
}

export default function AnimatedMascot({ module }: { module: Module | null }) {
  const [saved, setSaved] = useState<Saved>(readSaved);
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<Mode>("tip");
  const [expanded, setExpanded] = useState(false);
  const [lab, setLab] = useState<LabContext | null>(null);
  const [moduleContext, setModuleContext] = useState<ModuleContext | null>(null);
  const [celebrating, setCelebrating] = useState(false);
  const [announcement, setAnnouncement] = useState("");
  const [dragging, setDragging] = useState(false);
  const root = useRef<HTMLElement>(null);
  const drag = useRef<{ x: number; y: number; moved: boolean } | null>(null);
  const suppressClick = useRef(false);
  const danceTimer = useRef<number | null>(null);
  const autoCloseTimer = useRef<number | null>(null);
  const stageIndex = moduleContext?.moduleId === module?.id ? moduleContext.stage : 0;
  const stage = module?.stages[stageIndex];
  const guide = module ? moduleGuidance[module.id]?.stages[stageIndex] : null;
  const labActive = module?.id === 9;
  const contextKey = labActive ? `lab-${lab?.step ?? 0}` : module ? `module-${module.id}-${stageIndex}` : "home";

  useEffect(() => {
    const onContext = (event: Event) => {
      const detail = (event as CustomEvent<LabContext | ModuleContext>).detail;
      if ("moduleId" in detail) setModuleContext(detail);
      else setLab(detail);
    };
    window.addEventListener("curva-aberta-study-context", onContext);
    return () => window.removeEventListener("curva-aberta-study-context", onContext);
  }, []);

  useEffect(() => {
    setMode("tip"); setExpanded(false);
    setAnnouncement(module ? `Dicas para ${labActive && lab ? lab.title : module.title}.` : "Furina ajuda você a escolher por onde começar.");
    // Reset the note only when the study context changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contextKey]);

  useEffect(() => {
    try { localStorage.setItem(storageKey, JSON.stringify(saved)); } catch { /* preferences are optional */ }
  }, [saved]);

  useEffect(() => {
    const image = new Image(); image.src = `${import.meta.env.BASE_URL}furina-dance.webp`;
    const celebrate = () => {
      if (danceTimer.current) window.clearTimeout(danceTimer.current);
      if (autoCloseTimer.current) window.clearTimeout(autoCloseTimer.current);
      setSaved(value => ({ ...value, hidden: false, offsetY: 0 }));
      setMode("success"); setExpanded(false); setOpen(true); setCelebrating(true);
      setAnnouncement("Etapa concluída! Furina está comemorando com você.");
      danceTimer.current = window.setTimeout(() => setCelebrating(false), 3000);
      autoCloseTimer.current = window.setTimeout(() => setOpen(false), 7000);
    };
    window.addEventListener("curva-aberta-study-complete", celebrate);
    return () => {
      window.removeEventListener("curva-aberta-study-complete", celebrate);
      if (danceTimer.current) window.clearTimeout(danceTimer.current);
      if (autoCloseTimer.current) window.clearTimeout(autoCloseTimer.current);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => { if (event.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    const keepVisible = () => {
      const extra = open && window.innerWidth <= 620 ? 245 : 0;
      const max = Math.max(0, window.innerHeight - (root.current?.offsetHeight || 270) - extra - 24);
      setSaved(value => value.offsetY > max ? { ...value, offsetY: max } : value);
    };
    keepVisible(); window.addEventListener("resize", keepVisible);
    return () => window.removeEventListener("resize", keepVisible);
  }, [open]);

  const card = useMemo(() => {
    if (labActive && lab) return {
      tip: { title: "Dica desta etapa", text: lab.tip, extra: `Etapa ${lab.step + 1}: ${lab.title}` },
      attention: { title: "Fique de olho", text: lab.attention, extra: `Releia a entrega de ${lab.title} antes de avançar.` },
      review: { title: "Consegue explicar?", text: lab.question, extra: lab.answer },
      curiosity: { title: "Você sabia?", text: lab.curiosity, extra: "Relacione essa ideia com o exercício da etapa." },
      success: { title: "Boa! Mais uma etapa.", text: "Você concluiu uma entrega de verdade. Guarde o que produziu para revisar depois.", extra: "Avance quando estiver pronto, no seu ritmo." }
    }[mode];
    if (module && stage && guide) return {
      tip: { title: "Experimente agora", text: stage.practice, extra: `Para começar: ${moduleGuidance[module.id].firstMove}` },
      attention: { title: "Fique de olho", text: guide.attention, extra: `Etapa atual: ${stage.name}` },
      review: { title: "Consegue explicar?", text: stage.proof, extra: `Conceitos: ${stage.learn.join(" · ")}` },
      curiosity: { title: "Você sabia?", text: curiosities[module.id], extra: module.outcome },
      success: { title: "Boa! Mais uma etapa.", text: "Você transformou o estudo em algo que consegue mostrar ou explicar.", extra: `Sua evidência nesta etapa: ${stage.proof}` }
    }[mode];
    return {
      tip: { title: "Por onde começar?", text: "Escolha um módulo e faça primeiro a prática curta. Os outros materiais ficam para consulta.", extra: "Uma entrega pequena por vez é suficiente para começar." },
      attention: { title: "Sem dispersar", text: "Não precisa abrir todos os links. Cada trilha indica um primeiro material e uma atividade.", extra: "Você pode voltar aos demais recursos quando surgir uma dúvida." },
      review: { title: "Uma pergunta", text: "O que você gostaria de conseguir fazer depois de estudar?", extra: "Escolha uma habilidade concreta e encontre o módulo mais próximo." },
      curiosity: { title: "Como funciona", text: "Cada módulo reúne uma trilha, materiais e uma pequena entrega para testar o aprendizado.", extra: "Seu progresso fica salvo neste navegador." },
      success: { title: "Boa!", text: "Um passo entendido já conta.", extra: "Anote o que conseguiu fazer e o que quer tentar em seguida." }
    }[mode];
  }, [labActive, lab, mode, module, stage, guide]);

  function cancelAutoClose() { if (autoCloseTimer.current) window.clearTimeout(autoCloseTimer.current); autoCloseTimer.current = null; }
  function changeMode(next: Mode) {
    cancelAutoClose(); setMode(next); setExpanded(false);
    if (next === "success") {
      if (danceTimer.current) window.clearTimeout(danceTimer.current);
      setCelebrating(true); danceTimer.current = window.setTimeout(() => setCelebrating(false), 3000);
    }
    setAnnouncement(next === "success" ? "Furina está comemorando com você." : `${next === "tip" ? "Dica" : next === "attention" ? "Ponto de atenção" : next === "review" ? "Pergunta" : "Curiosidade"} atualizada.`);
  }
  function startDrag(event: React.PointerEvent<HTMLButtonElement>) {
    if (event.button !== 0) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    drag.current = { x: event.clientX, y: event.clientY, moved: false };
    setDragging(true);
  }
  function moveDrag(event: React.PointerEvent<HTMLButtonElement>) {
    if (!drag.current) return;
    if (Math.hypot(event.clientX - drag.current.x, event.clientY - drag.current.y) > 7) drag.current.moved = true;
    if (!drag.current.moved) return;
    const extra = open && window.innerWidth <= 620 ? 245 : 0;
    const max = Math.max(0, window.innerHeight - (root.current?.offsetHeight || 270) - extra - 24);
    setSaved(value => ({ ...value, dock: event.clientX < window.innerWidth / 2 ? "left" : "right", offsetY: Math.min(max, Math.max(0, window.innerHeight - event.clientY - 135)) }));
  }
  function endDrag() {
    if (drag.current?.moved) { suppressClick.current = true; window.setTimeout(() => { suppressClick.current = false; }, 0); }
    drag.current = null; setDragging(false);
  }
  function clickCharacter() {
    if (suppressClick.current) return;
    cancelAutoClose();
    setOpen(value => !value);
    setAnnouncement(open ? "Dica recolhida." : "Furina abriu uma dica para esta etapa.");
  }

  const style = { "--furina-offset": `${saved.offsetY}px` } as React.CSSProperties;
  if (saved.hidden) return <button className={`furina-return dock-${saved.dock}`} style={style} onClick={() => setSaved(value => ({ ...value, hidden: false, offsetY: 0 }))} aria-label="Mostrar Furina"><Lightbulb size={16}/>Furina</button>;

  return <aside ref={root} className={`furina-guide dock-${saved.dock} ${open ? "is-open" : ""} ${dragging ? "is-dragging" : ""} ${celebrating ? "is-celebrating" : ""}`} style={style} aria-label="Furina, guia de estudos">
    {open && <section className="furina-speech" aria-label="Dica da Furina">
      <div className="furina-speech-head"><span className="furina-speech-name">Furina <small>· {labActive && lab ? `etapa ${lab.step + 1}` : module ? module.title : "guia de estudos"}</small></span><button onClick={() => setOpen(false)} aria-label="Fechar dica"><X size={17}/></button></div>
      <h3>{card.title}</h3><p>{card.text}</p>
      {expanded && <p className="furina-extra">{card.extra}</p>}
      <button className="furina-more" onClick={() => { cancelAutoClose(); setExpanded(value => !value); }} aria-expanded={expanded}>{expanded ? "Mostrar menos" : mode === "review" ? "Ver uma resposta possível" : "Ver mais"}</button>
      <div className="furina-options" aria-label="Escolher ajuda">
        <button className={mode === "tip" ? "active" : ""} onClick={() => changeMode("tip")}><Lightbulb size={15}/>Dica</button>
        <button className={mode === "attention" ? "active attention" : ""} onClick={() => changeMode("attention")}><ShieldAlert size={15}/>Atenção</button>
        <button className={mode === "review" ? "active" : ""} onClick={() => changeMode("review")}><CircleHelp size={15}/>Me testa</button>
        <button className={mode === "curiosity" ? "active" : ""} onClick={() => changeMode("curiosity")}><Sparkles size={15}/>Curiosidade</button>
        <button className={mode === "success" ? "active" : ""} onClick={() => changeMode("success")}><Check size={15}/>Consegui!</button>
      </div>
      <div className="furina-speech-foot"><span>Dicas escritas para esta trilha</span><div><button onClick={() => setSaved(value => ({ ...value, dock: "left", offsetY: 0 }))} aria-label="Mover Furina para a esquerda"><ArrowLeft size={16}/></button><button onClick={() => setSaved(value => ({ ...value, dock: "right", offsetY: 0 }))} aria-label="Mover Furina para a direita"><ArrowRight size={16}/></button></div></div>
    </section>}
    {celebrating && <span className="furina-confetti" aria-hidden="true"><i/><i/><i/><i/><i/><i/><i/><i/></span>}
    <button className="furina-character" onPointerDown={startDrag} onPointerMove={moveDrag} onPointerUp={endDrag} onPointerCancel={endDrag} onClick={clickCharacter} aria-label={open ? "Recolher dica da Furina; arraste para mudar de lado" : "Abrir dica da Furina; arraste para mudar de lado"} aria-expanded={open}>
      <span className={`furina-sprite ${celebrating ? "dance" : "idle"}`} style={{ backgroundImage: `url(${import.meta.env.BASE_URL}${celebrating ? "furina-dance.webp" : "furina-idle.webp"})` }} aria-hidden="true"/>
      {!open && !celebrating && <span className="furina-invite"><Lightbulb size={14}/> Dica</span>}
      {open && mode === "attention" && !celebrating && <span className="furina-alert" aria-hidden="true">!</span>}
    </button>
    <button className="furina-hide" onClick={() => { cancelAutoClose(); setOpen(false); setSaved(value => ({ ...value, hidden: true })); }} aria-label="Ocultar Furina" title="Ocultar Furina"><X size={16}/></button>
    <p className="furina-live" role="status" aria-live="polite">{announcement}</p>
  </aside>;
}
