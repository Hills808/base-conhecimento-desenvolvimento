import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Check, CircleHelp, Lightbulb, ShieldAlert, Sparkles, X } from "lucide-react";
import type { Module } from "./data/modules";
import { moduleGuidance } from "./data/module-guidance";
import "./animated-mascot.css";

type Mode = "tip" | "attention" | "review" | "curiosity" | "success";
type LabContext = { step: number; title: string; tip: string; attention: string; curiosity: string; question: string; answer: string };
type ModuleContext = { moduleId: number; stage: number };
type Saved = { dock: "left" | "right"; x: number; offsetY: number; hidden: boolean };
const storageKey = "curva-aberta-furina-v2";
const edge = 8;
const danceDuration = 2800;
const mascotWidth = (viewportWidth: number) => viewportWidth <= 720 ? 112 : 148;
const mascotHeight = (viewportWidth: number) => viewportWidth <= 720 ? 149 : 197;
const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
type DancePose = [x: number, y: number, stretch: number, turn: number, head: number, torso: number, leftArm: number, rightArm: number, legs: number];
const danceKeys: { at: number; pose: DancePose }[] = [
  { at: 0, pose: [0, 0, 1, 0, 0, 0, 0, 0, 0] },
  { at: 180, pose: [0, 2, .96, -2, 2, -2, -8, 6, 4] },
  { at: 360, pose: [-4, -7, 1.03, -3, -2, 2, 22, -22, 5] },
  { at: 580, pose: [-8, -16, 1.01, -5, -5, 3, 38, -35, -5] },
  { at: 780, pose: [-7, -9, 1, -3, 1, 0, 28, -28, 3] },
  { at: 970, pose: [-4, 2, .94, 2, 5, -2, 10, -9, -5] },
  { at: 1130, pose: [-2, 0, 1, 1, 2, 0, 8, -8, 0] },
  { at: 1280, pose: [-1, 2, .96, 3, -2, 1, -5, 7, 4] },
  { at: 1490, pose: [4, -7, 1.03, 4, 2, -2, 23, -23, -5] },
  { at: 1700, pose: [8, -15, 1.01, 5, 5, -3, 37, -38, 5] },
  { at: 1900, pose: [7, -8, 1, -1, 0, 1, 27, -28, -3] },
  { at: 2090, pose: [4, 2, .94, -3, -4, 2, 10, -12, 4] },
  { at: 2300, pose: [0, 0, 1, 0, 0, 0, 0, 0, 0] },
  { at: 2470, pose: [0, 0, 1, 0, -3, 0, 0, -14, 0] },
  { at: 2640, pose: [0, 0, 1, 0, 1, 0, 0, -24, 0] },
  { at: danceDuration, pose: [0, 0, 1, 0, 0, 0, 0, 0, 0] }
];

// Cubic interpolation keeps the velocity continuous through each dance pose.
function dancePose(time: number): DancePose {
  const index = danceKeys.findIndex(key => key.at >= time);
  if (index <= 0) return danceKeys[0].pose;
  const next = danceKeys[index];
  const current = danceKeys[index - 1];
  const before = danceKeys[Math.max(0, index - 2)];
  const after = danceKeys[Math.min(danceKeys.length - 1, index + 1)];
  const span = next.at - current.at;
  const u = (time - current.at) / span;
  const h00 = 2 * u ** 3 - 3 * u ** 2 + 1;
  const h10 = u ** 3 - 2 * u ** 2 + u;
  const h01 = -2 * u ** 3 + 3 * u ** 2;
  const h11 = u ** 3 - u ** 2;
  return current.pose.map((value, channel) => {
    const velocityIn = index === 1 ? 0 : (next.pose[channel] - before.pose[channel]) / (next.at - before.at);
    const velocityOut = index === danceKeys.length - 1 ? 0 : (after.pose[channel] - current.pose[channel]) / (after.at - current.at);
    return h00 * value + h10 * span * velocityIn + h01 * next.pose[channel] + h11 * span * velocityOut;
  }) as DancePose;
}
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
    const dock = saved?.dock === "left" ? "left" : "right";
    return { dock, x: Number.isFinite(saved?.x) ? clamp(saved.x, 0, 1) : dock === "left" ? 0 : 1, offsetY: Number.isFinite(saved?.offsetY) ? Math.max(0, saved.offsetY) : 0, hidden: saved?.hidden === true };
  } catch { return { dock: "right", x: 1, offsetY: 0, hidden: false }; }
}

export default function AnimatedMascot({ module }: { module: Module | null }) {
  const [saved, setSaved] = useState<Saved>(readSaved);
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<Mode>("tip");
  const [expanded, setExpanded] = useState(false);
  const [lab, setLab] = useState<LabContext | null>(null);
  const [moduleContext, setModuleContext] = useState<ModuleContext | null>(null);
  const [celebrating, setCelebrating] = useState(false);
  const [greeting, setGreeting] = useState(true);
  const [motionToken, setMotionToken] = useState(0);
  const [viewport, setViewport] = useState(() => ({ width: window.innerWidth, height: window.innerHeight }));
  const [announcement, setAnnouncement] = useState("");
  const [dragging, setDragging] = useState(false);
  const root = useRef<HTMLElement>(null);
  const puppet = useRef<HTMLSpanElement>(null);
  const drag = useRef<{ pointerId: number; x: number; y: number; grabX: number; grabY: number; moved: boolean; left: number; bottom: number } | null>(null);
  const suppressClick = useRef(false);
  const greetTimer = useRef<number | null>(null);
  const danceTimer = useRef<number | null>(null);
  const autoCloseTimer = useRef<number | null>(null);
  const stageIndex = module && moduleContext?.moduleId === module.id ? moduleContext.stage : 0;
  const stage = module?.stages[stageIndex];
  const guide = module ? moduleGuidance[module.id]?.stages[stageIndex] : null;
  const labActive = module?.id === 9;
  const contextKey = labActive ? `lab-${lab?.step ?? 0}` : module ? `module-${module.id}-${stageIndex}` : "home";

  function greet() {
    if (celebrating || drag.current?.moved) return;
    if (greetTimer.current) window.clearTimeout(greetTimer.current);
    setGreeting(false);
    window.requestAnimationFrame(() => {
      setGreeting(true);
      greetTimer.current = window.setTimeout(() => setGreeting(false), 1900);
    });
  }

  useEffect(() => {
    greetTimer.current = window.setTimeout(() => setGreeting(false), 1900);
    return () => { if (greetTimer.current) window.clearTimeout(greetTimer.current); };
  }, []);

  useEffect(() => {
    const stage = puppet.current?.querySelector<HTMLElement>(".furina-puppet-stage");
    const head = puppet.current?.querySelector<HTMLElement>(".furina-rig-head");
    const leftArm = puppet.current?.querySelector<HTMLElement>(".furina-rig-left-arm");
    const rightArm = puppet.current?.querySelector<HTMLElement>(".furina-rig-right-arm");
    const torso = puppet.current?.querySelector<HTMLElement>(".furina-rig-torso");
    const legs = puppet.current?.querySelector<HTMLElement>(".furina-rig-legs");
    const parts = [stage, head, leftArm, rightArm, torso, legs];
    if (!stage || !head || !leftArm || !rightArm || !torso || !legs || window.matchMedia("(prefers-reduced-motion: reduce)").matches || (!celebrating && !greeting)) return;
    const duration = celebrating ? danceDuration : 1900;
    let start = 0;
    let frame = 0;
    const tick = (now: number) => {
      if (!start) start = now;
      const t = Math.min(duration, now - start);
      const fraction = t / duration;
      if (celebrating) {
        const [x, y, stretch, turn, face, chest, left, right, feet] = dancePose(t);
        stage.style.transform = `translate3d(${x.toFixed(2)}px,${y.toFixed(2)}px,0) rotate(${turn.toFixed(2)}deg) scaleY(${stretch.toFixed(3)})`;
        head.style.transform = `rotate(${face.toFixed(2)}deg)`;
        torso.style.transform = `rotate(${chest.toFixed(2)}deg)`;
        leftArm.style.transform = `rotate(${left.toFixed(2)}deg)`;
        rightArm.style.transform = `rotate(${right.toFixed(2)}deg)`;
        legs.style.transform = `rotate(${feet.toFixed(2)}deg)`;
      } else {
        const ease = Math.sin(Math.PI * fraction);
        stage.style.transform = `translate3d(0,${(-2 * ease).toFixed(2)}px,0) rotate(${(-2 * ease).toFixed(2)}deg)`;
        head.style.transform = `rotate(${(5 * ease).toFixed(2)}deg)`;
        rightArm.style.transform = `rotate(${(-18 * Math.sin(2 * Math.PI * fraction) ** 2).toFixed(2)}deg)`;
      }
      if (t < duration) frame = window.requestAnimationFrame(tick);
      else parts.forEach(part => { if (part) part.style.transform = ""; });
    };
    frame = window.requestAnimationFrame(tick);
    return () => { window.cancelAnimationFrame(frame); parts.forEach(part => { if (part) part.style.transform = ""; }); };
  }, [greeting, celebrating, motionToken]);

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
    for (const part of ["head", "torso", "arm-left", "arm-right", "legs"]) {
      const image = new Image(); image.src = `${import.meta.env.BASE_URL}furina-rig/${part}.webp`;
    }
    const celebrate = () => {
      if (danceTimer.current) window.clearTimeout(danceTimer.current);
      if (autoCloseTimer.current) window.clearTimeout(autoCloseTimer.current);
      setSaved(value => ({ ...value, hidden: false }));
      setMode("success"); setExpanded(false); setOpen(true); setGreeting(false); setCelebrating(true); setMotionToken(value => value + 1);
      setAnnouncement("Etapa concluída! Furina está comemorando com você.");
      danceTimer.current = window.setTimeout(() => setCelebrating(false), danceDuration);
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
    const resize = () => {
      setViewport({ width: window.innerWidth, height: window.innerHeight });
      setSaved(value => ({ ...value, offsetY: Math.min(value.offsetY, Math.max(0, window.innerHeight - mascotHeight(window.innerWidth) - edge)) }));
    };
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

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
      setGreeting(false); setCelebrating(true); setMotionToken(value => value + 1); danceTimer.current = window.setTimeout(() => setCelebrating(false), danceDuration);
    }
    setAnnouncement(next === "success" ? "Furina está comemorando com você." : `${next === "tip" ? "Dica" : next === "attention" ? "Ponto de atenção" : next === "review" ? "Pergunta" : "Curiosidade"} atualizada.`);
  }
  function startDrag(event: React.PointerEvent<HTMLButtonElement>) {
    if (event.button !== 0) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    const box = root.current?.getBoundingClientRect();
    if (!box) return;
    drag.current = { pointerId: event.pointerId, x: event.clientX, y: event.clientY, grabX: event.clientX - box.left, grabY: event.clientY - box.top, moved: false, left: box.left, bottom: window.innerHeight - box.bottom };
  }
  function moveDrag(event: React.PointerEvent<HTMLButtonElement>) {
    const current = drag.current;
    if (!current) {
      if (celebrating || greeting || !puppet.current) return;
      const head = puppet.current.querySelector<HTMLElement>(".furina-rig-head");
      const box = event.currentTarget.getBoundingClientRect();
      const angle = clamp((event.clientX - box.left) / box.width * 8 - 4, -4, 4);
      if (head) head.style.transform = `rotate(${angle.toFixed(1)}deg)`;
      return;
    }
    if (current.pointerId !== event.pointerId || !root.current) return;
    if (!current.moved && Math.hypot(event.clientX - current.x, event.clientY - current.y) > 5) {
      current.moved = true;
      setDragging(true); setOpen(false); setGreeting(false);
    }
    if (!current.moved) return;
    const box = root.current.getBoundingClientRect();
    current.left = clamp(event.clientX - current.grabX, edge, window.innerWidth - box.width - edge);
    const top = clamp(event.clientY - current.grabY, edge, window.innerHeight - box.height - edge);
    current.bottom = window.innerHeight - top - box.height;
    root.current.style.left = `${current.left}px`;
    root.current.style.bottom = `${current.bottom}px`;
  }
  function endDrag(event: React.PointerEvent<HTMLButtonElement>) {
    if (drag.current?.pointerId !== event.pointerId) return;
    if (drag.current.moved) {
      suppressClick.current = true;
      window.setTimeout(() => { suppressClick.current = false; }, 0);
      const available = Math.max(1, window.innerWidth - mascotWidth(window.innerWidth) - 2 * edge);
      const x = clamp((drag.current.left - edge) / available, 0, 1);
      const offsetY = Math.max(0, drag.current.bottom - edge);
      setSaved(value => ({ ...value, x, dock: x < .5 ? "left" : "right", offsetY }));
    }
    drag.current = null; setDragging(false);
  }
  function leaveCharacter() {
    if (!drag.current && !celebrating && !greeting) {
      const head = puppet.current?.querySelector<HTMLElement>(".furina-rig-head");
      if (head) head.style.transform = "";
    }
  }
  function moveByKeyboard(event: React.KeyboardEvent<HTMLButtonElement>) {
    const horizontal = event.key === "ArrowLeft" ? -.15 : event.key === "ArrowRight" ? .15 : 0;
    const vertical = event.key === "ArrowUp" ? 24 : event.key === "ArrowDown" ? -24 : 0;
    if (!horizontal && !vertical) return;
    event.preventDefault();
    setSaved(value => {
      const x = clamp(value.x + horizontal, 0, 1);
      const maxOffset = Math.max(0, viewport.height - mascotHeight(viewport.width) - 2 * edge);
      return { ...value, x, dock: x < .5 ? "left" : "right", offsetY: clamp(value.offsetY + vertical, 0, maxOffset) };
    });
  }
  function clickCharacter() {
    if (suppressClick.current) return;
    cancelAutoClose();
    greet();
    setOpen(value => !value);
    setAnnouncement(open ? "Dica recolhida." : "Furina abriu uma dica para esta etapa.");
  }

  const width = mascotWidth(viewport.width);
  const left = edge + saved.x * Math.max(0, viewport.width - width - 2 * edge);
  const bottom = edge + Math.min(saved.offsetY, Math.max(0, viewport.height - mascotHeight(viewport.width) - 2 * edge));
  const style = { left: `${left}px`, bottom: `${bottom}px`, "--furina-bottom": `${bottom}px` } as React.CSSProperties;
  if (saved.hidden) return <button className={`furina-return dock-${saved.dock}`} onClick={() => setSaved(value => ({ ...value, hidden: false }))} aria-label="Mostrar Furina"><Lightbulb size={16}/>Furina</button>;

  return <aside ref={root} className={`furina-guide dock-${saved.dock} ${open ? "is-open" : ""} ${dragging ? "is-dragging" : ""} ${celebrating ? "is-celebrating" : ""} ${greeting ? "is-greeting" : ""}`} style={style} aria-label="Furina, guia de estudos">
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
      <div className="furina-speech-foot"><span>Dicas escritas para esta trilha</span><div><button onClick={() => setSaved(value => ({ ...value, dock: "left", x: 0 }))} aria-label="Mover Furina para a esquerda"><ArrowLeft size={16}/></button><button onClick={() => setSaved(value => ({ ...value, dock: "right", x: 1 }))} aria-label="Mover Furina para a direita"><ArrowRight size={16}/></button></div></div>
    </section>}
    {celebrating && <span className="furina-confetti" aria-hidden="true"><i/><i/><i/><i/><i/><i/><i/><i/></span>}
    <button className="furina-character" onPointerDown={startDrag} onPointerMove={moveDrag} onPointerUp={endDrag} onPointerCancel={endDrag} onPointerLeave={leaveCharacter} onKeyDown={moveByKeyboard} onClick={clickCharacter} aria-label={open ? "Recolher dica da Furina; arraste ou use as setas para mover" : "Abrir dica da Furina; arraste ou use as setas para mover"} aria-expanded={open}>
      <span className="furina-puppet" ref={puppet} aria-hidden="true">
        <span className="furina-puppet-stage">
          <img className="furina-rig-legs" src={`${import.meta.env.BASE_URL}furina-rig/legs.webp`} alt="" draggable={false}/>
          <img className="furina-rig-left-arm" src={`${import.meta.env.BASE_URL}furina-rig/arm-left.webp`} alt="" draggable={false}/>
          <img className="furina-rig-right-arm" src={`${import.meta.env.BASE_URL}furina-rig/arm-right.webp`} alt="" draggable={false}/>
          <img className="furina-rig-torso" src={`${import.meta.env.BASE_URL}furina-rig/torso.webp`} alt="" draggable={false}/>
          <img className="furina-rig-head" src={`${import.meta.env.BASE_URL}furina-rig/head.webp`} alt="" draggable={false}/>
        </span>
      </span>
      {!open && !celebrating && <span className="furina-invite"><Lightbulb size={14}/> Dica</span>}
      {open && mode === "attention" && !celebrating && <span className="furina-alert" aria-hidden="true">!</span>}
    </button>
    <button className="furina-hide" onClick={() => { cancelAutoClose(); setOpen(false); setSaved(value => ({ ...value, hidden: true })); }} aria-label="Ocultar Furina" title="Ocultar Furina"><X size={16}/></button>
    <p className="furina-live" role="status" aria-live="polite">{announcement}</p>
  </aside>;
}
