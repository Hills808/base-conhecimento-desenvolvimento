import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Check, CircleHelp, Lightbulb, Pause, Play, ShieldAlert, Sparkles, X } from "lucide-react";
import type { Module } from "./data/modules";
import { moduleGuidance } from "./data/module-guidance";
import { blendPose, bubbleGeometry, celebrationDuration, clamp, mascotGeometry, neutral, targetPose, type MotionState } from "./furina-motion";
import "./animated-mascot.css";

type Mode = "tip" | "attention" | "review" | "curiosity" | "success";
type LabContext = { step: number; title: string; tip: string; attention: string; curiosity: string; question: string; answer: string };
type ModuleContext = { moduleId: number; stage: number };
type Saved = { dock: "left" | "right"; x: number; offsetY: number; hidden: boolean; paused: boolean };
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
    const dock = saved?.dock === "left" ? "left" : "right";
    return { dock, x: Number.isFinite(saved?.x) ? clamp(saved.x, 0, 1) : dock === "left" ? 0 : 1, offsetY: Number.isFinite(saved?.offsetY) ? Math.max(0, saved.offsetY) : 0, hidden: saved?.hidden === true, paused: saved?.paused === true };
  } catch { return { dock: "right", x: 1, offsetY: 0, hidden: false, paused: false }; }
}

export default function AnimatedMascot({ module }: { module: Module | null }) {
  const [saved, setSaved] = useState<Saved>(readSaved);
  const [open, setOpen] = useState(false);
  const [unreadTip, setUnreadTip] = useState(true);
  const [mode, setMode] = useState<Mode>("tip");
  const [expanded, setExpanded] = useState(false);
  const [lab, setLab] = useState<LabContext | null>(null);
  const [moduleContext, setModuleContext] = useState<ModuleContext | null>(null);
  const [celebrating, setCelebrating] = useState(false);
  const [greeting, setGreeting] = useState(false);
  const [motionToken, setMotionToken] = useState(0);
  const [reduced, setReduced] = useState(() => window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  const [viewport, setViewport] = useState(() => ({ width: window.innerWidth, height: window.innerHeight }));
  const [announcement, setAnnouncement] = useState("");
  const [dragging, setDragging] = useState(false);
  const root = useRef<HTMLElement>(null);
  const puppet = useRef<HTMLSpanElement>(null);
  const drag = useRef<{ pointerId: number; x: number; y: number; grabX: number; grabY: number; width: number; height: number; moved: boolean; left: number; bottom: number } | null>(null);
  const suppressClickUntil = useRef(0);
  const look = useRef(0);
  const motionPose = useRef(neutral());
  const motion = useRef({ paused: saved.paused, reduced, dragging, open, unreadTip, greeting, celebrating, motionToken });
  const preferences = useRef(saved);
  const autoCloseTimer = useRef<number | null>(null);
  const sideTimer = useRef<number | null>(null);
  const stageIndex = module && moduleContext?.moduleId === module.id ? moduleContext.stage : 0;
  const stage = module?.stages[stageIndex];
  const guide = module ? moduleGuidance[module.id]?.stages[stageIndex] : null;
  const labActive = module?.id === 9;
  const contextKey = labActive ? `lab-${lab?.step ?? 0}` : module ? `module-${module.id}-${stageIndex}` : "home";

  function greet() {
    if (celebrating || drag.current?.moved) return;
    setGreeting(!saved.paused && !reduced);
    setMotionToken(value => value + 1);
  }

  useEffect(() => {
    motion.current = { paused: saved.paused, reduced, dragging, open, unreadTip, greeting, celebrating, motionToken };
    preferences.current = saved;
  }, [saved, reduced, dragging, open, unreadTip, greeting, celebrating, motionToken]);

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => { setReduced(preference.matches); if (preference.matches) { setCelebrating(false); setGreeting(false); } };
    preference.addEventListener("change", update);
    return () => preference.removeEventListener("change", update);
  }, []);

  // One owner for every joint. Pointer input is a target, never a competing writer.
  useEffect(() => {
    if (saved.hidden || saved.paused || reduced) return;
    const get = (name: string) => puppet.current?.querySelector<HTMLElement>(name);
    const stage = get(".furina-puppet-stage"), head = get(".furina-rig-head"), upper = get(".furina-rig-upper");
    const leftArm = get(".furina-rig-left-arm"), rightArm = get(".furina-rig-right-arm"), legs = get(".furina-rig-legs");
    if (!stage || !head || !upper || !leftArm || !rightArm || !legs) return;
    let pose = motionPose.current, frame = 0, last = 0, elapsed = 0, idleTime = 0, token = -1;
    let state: MotionState = "idle";
    let disposed = false;
    const tick = (now: number) => {
      // Timelines use elapsed wall time, not frame count. Damping clamps its own step.
      const delta = last ? Math.max(0, now - last) : 0;
      last = now;
      const input = motion.current;
      const next: MotionState = input.dragging ? "dragging" : input.celebrating ? "celebrating" : input.greeting || input.open ? "interacting" : input.unreadTip ? "tip" : "idle";
      if (next !== state || token !== input.motionToken) { state = next; token = input.motionToken; elapsed = 0; }
      elapsed += delta; idleTime += delta;
      pose = blendPose(pose, targetPose(state, elapsed, idleTime, look.current), delta);
      motionPose.current = pose;
      stage.style.transform = `translate3d(${pose.x.toFixed(2)}px,${pose.y.toFixed(2)}px,0) rotate(${pose.turn.toFixed(2)}deg) scaleY(${pose.scale.toFixed(4)})`;
      head.style.transform = `rotate(${pose.head.toFixed(2)}deg)`;
      upper.style.transform = `translateY(${(-Math.abs(pose.torso) * .7).toFixed(2)}px) rotate(${pose.torso.toFixed(2)}deg)`;
      leftArm.style.transform = `rotate(${pose.left.toFixed(2)}deg)`;
      rightArm.style.transform = `rotate(${pose.right.toFixed(2)}deg)`;
      legs.style.transform = `rotate(${pose.legs.toFixed(2)}deg)`;
      if (state === "celebrating" && elapsed > celebrationDuration + 250) setCelebrating(false);
      if (input.greeting && elapsed > 1200) setGreeting(false);
      if (!disposed && !document.hidden) frame = window.requestAnimationFrame(tick);
    };
    const visibility = () => { window.cancelAnimationFrame(frame); last = 0; if (!document.hidden) frame = window.requestAnimationFrame(tick); };
    document.addEventListener("visibilitychange", visibility);
    if (!document.hidden) frame = window.requestAnimationFrame(tick);
    return () => { disposed = true; window.cancelAnimationFrame(frame); document.removeEventListener("visibilitychange", visibility); };
  }, [saved.hidden, saved.paused, reduced]);

  useEffect(() => {
    // Motion preference changes must also remove residual transforms.
    if (reduced) { motionPose.current = neutral(); puppet.current?.querySelectorAll<HTMLElement>(".furina-puppet-stage,.furina-rig-upper,.furina-puppet img").forEach(part => { part.style.transform = ""; }); }
  }, [reduced]);

  useEffect(() => {
    const onContext = (event: Event) => {
      const detail = (event as CustomEvent<LabContext | ModuleContext>).detail;
      if (!detail || typeof detail !== "object") return;
      if ("moduleId" in detail) setModuleContext(detail);
      else setLab(detail);
    };
    window.addEventListener("curva-aberta-study-context", onContext);
    return () => window.removeEventListener("curva-aberta-study-context", onContext);
  }, []);

  useEffect(() => {
    setMode("tip"); setExpanded(false); setUnreadTip(true);
    setAnnouncement(module ? `Dicas para ${labActive && lab ? lab.title : module.title}.` : "Furina ajuda você a escolher por onde começar.");
    // Reset the note only when the study context changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contextKey]);

  useEffect(() => {
    try { localStorage.setItem(storageKey, JSON.stringify(saved)); } catch { /* preferences are optional */ }
  }, [saved]);

  useEffect(() => {
    const celebrate = () => {
      if (preferences.current.hidden) return;
      if (autoCloseTimer.current) window.clearTimeout(autoCloseTimer.current);
      setMode("success"); setExpanded(false); setOpen(true); setGreeting(false); setCelebrating(!motion.current.paused && !motion.current.reduced); setMotionToken(value => value + 1);
      setAnnouncement("Etapa concluída! Guarde sua entrega para a revisão.");
      autoCloseTimer.current = window.setTimeout(() => setOpen(false), 7000);
    };
    window.addEventListener("curva-aberta-study-complete", celebrate);
    return () => {
      window.removeEventListener("curva-aberta-study-complete", celebrate);
      if (autoCloseTimer.current) window.clearTimeout(autoCloseTimer.current);
      if (sideTimer.current) window.clearTimeout(sideTimer.current);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => { if (event.key === "Escape") { setOpen(false); root.current?.querySelector<HTMLButtonElement>(".furina-character")?.focus({ preventScroll: true }); } };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    const resize = () => {
      setViewport({ width: window.innerWidth, height: window.innerHeight });
      setSaved(value => ({ ...value, offsetY: mascotGeometry({ width: window.innerWidth, height: window.innerHeight }, value.x, value.offsetY).bottom - 12 }));
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
  function cancelSideMove() { if (sideTimer.current) window.clearTimeout(sideTimer.current); sideTimer.current = null; }
  function moveTo(nextX: number, nextDock: Saved["dock"]) {
    cancelSideMove();
    setSaved(value => ({ ...value, x: nextX, dock: nextDock }));
  }
  function changeMode(next: Mode) {
    cancelAutoClose(); setMode(next); setExpanded(false);
    if (next === "success") {
      setGreeting(false); setCelebrating(!saved.paused && !reduced); setMotionToken(value => value + 1);
    }
    setAnnouncement(next === "success" ? "Furina está comemorando com você." : `${next === "tip" ? "Dica" : next === "attention" ? "Ponto de atenção" : next === "review" ? "Pergunta" : "Curiosidade"} atualizada.`);
  }
  function startDrag(event: React.PointerEvent<HTMLButtonElement>) {
    if (event.button !== 0 || !event.isPrimary) return;
    cancelSideMove();
    const box = root.current?.getBoundingClientRect();
    if (!box) return;
    suppressClickUntil.current = 0;
    event.currentTarget.setPointerCapture(event.pointerId);
    drag.current = { pointerId: event.pointerId, x: event.clientX, y: event.clientY, grabX: event.clientX - box.left, grabY: event.clientY - box.top, width: box.width, height: box.height, moved: false, left: box.left, bottom: window.innerHeight - box.bottom };
  }
  function moveDrag(event: React.PointerEvent<HTMLButtonElement>) {
    const current = drag.current;
    if (!current) {
      const box = event.currentTarget.getBoundingClientRect();
      look.current = clamp((event.clientX - box.left) / box.width * 2 - 1, -1, 1);
      return;
    }
    if (current.pointerId !== event.pointerId || !root.current) return;
    if (!current.moved && Math.hypot(event.clientX - current.x, event.clientY - current.y) > 5) {
      current.moved = true;
      cancelAutoClose();
      look.current = 0;
      setDragging(true); setOpen(false); setGreeting(false); setCelebrating(false);
    }
    if (!current.moved) return;
    current.left = clamp(event.clientX - current.grabX, 12, window.innerWidth - current.width - 12);
    const top = clamp(event.clientY - current.grabY, 12, window.innerHeight - current.height - 12);
    current.bottom = window.innerHeight - top - current.height;
    root.current.style.left = `${current.left}px`;
    root.current.style.bottom = `${current.bottom}px`;
  }
  function endDrag(event: React.PointerEvent<HTMLButtonElement>) {
    if (drag.current?.pointerId !== event.pointerId) return;
    if (drag.current.moved) {
      suppressClickUntil.current = performance.now() + 350;
      const available = Math.max(1, window.innerWidth - drag.current.width - 24);
      const x = clamp((drag.current.left - 12) / available, 0, 1);
      const offsetY = Math.max(0, drag.current.bottom - 12);
      setSaved(value => ({ ...value, x, dock: x < .5 ? "left" : "right", offsetY }));
    }
    drag.current = null; setDragging(false);
  }
  function cancelDrag() {
    if (!drag.current) return;
    const geometry = mascotGeometry(viewport, saved.x, saved.offsetY);
    if (root.current) { root.current.style.left = `${geometry.left}px`; root.current.style.bottom = `${geometry.bottom}px`; }
    suppressClickUntil.current = performance.now() + 350;
    drag.current = null; setDragging(false);
  }
  function leaveCharacter() {
    look.current = 0;
  }
  function moveByKeyboard(event: React.KeyboardEvent<HTMLButtonElement>) {
    const horizontal = event.key === "ArrowLeft" ? -.15 : event.key === "ArrowRight" ? .15 : 0;
    const vertical = event.key === "ArrowUp" ? 24 : event.key === "ArrowDown" ? -24 : 0;
    if (!horizontal && !vertical) return;
    event.preventDefault();
    const x = clamp(saved.x + horizontal, 0, 1);
    const dock = x < .5 ? "left" : "right";
    if (horizontal && dock !== saved.dock) moveTo(x, dock);
    else setSaved(value => {
      const maxOffset = Math.max(0, mascotGeometry(viewport, value.x, 0).maxY - 12);
      return { ...value, x, dock, offsetY: clamp(value.offsetY + vertical, 0, maxOffset) };
    });
  }
  function clickCharacter() {
    if (performance.now() < suppressClickUntil.current) return;
    cancelSideMove();
    cancelAutoClose();
    greet();
    if (!open) setUnreadTip(false);
    setOpen(value => !value);
    setAnnouncement(open ? "Dica recolhida." : "Furina abriu uma dica para esta etapa.");
  }

  const geometry = mascotGeometry(viewport, saved.x, saved.offsetY);
  const bubble = bubbleGeometry(viewport, geometry.left, geometry.bottom, geometry.width);
  const style = { left: `${geometry.left}px`, bottom: `${geometry.bottom}px`, "--furina-width": `${geometry.width}px`, "--furina-height": `${geometry.characterHeight}px` } as React.CSSProperties;
  const bubbleStyle = { left: `${bubble.left}px`, bottom: `${bubble.bottom}px`, width: `${bubble.width}px`, maxHeight: `${bubble.maxHeight}px` };
  if (saved.hidden) return <button className={`furina-return dock-${saved.dock}`} onClick={() => setSaved(value => ({ ...value, hidden: false }))} aria-label="Mostrar Furina"><Lightbulb size={16}/>Furina</button>;

  return <aside ref={root} className={`furina-guide dock-${saved.dock} ${open ? "is-open" : ""} ${dragging ? "is-dragging" : ""} ${celebrating ? "is-celebrating" : ""} ${saved.paused || reduced ? "is-paused" : ""}`} style={style} aria-label="Furina, guia de estudos">
    {open && <section id="furina-tip" className="furina-speech" style={bubbleStyle} aria-label="Dica da Furina">
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
      <div className="furina-speech-foot"><span>Dicas da etapa · sem IA<br/>Arraste Furina ou use as setas.</span><div><button onClick={() => moveTo(0, "left")} aria-label="Mover Furina para a esquerda"><ArrowLeft size={16}/></button><button onClick={() => moveTo(1, "right")} aria-label="Mover Furina para a direita"><ArrowRight size={16}/></button></div></div>
    </section>}
    {celebrating && <span className="furina-confetti" aria-hidden="true"><i/><i/><i/><i/><i/><i/><i/><i/></span>}
    <button className="furina-character" onPointerDown={startDrag} onPointerMove={moveDrag} onPointerUp={endDrag} onPointerCancel={cancelDrag} onLostPointerCapture={cancelDrag} onPointerLeave={leaveCharacter} onKeyDown={moveByKeyboard} onClick={clickCharacter} aria-label={open ? "Recolher dica da Furina; arraste ou use as setas para mover" : "Abrir dica da Furina; arraste ou use as setas para mover"} aria-expanded={open} aria-controls="furina-tip">
      <span className="furina-puppet" ref={puppet} aria-hidden="true">
        <span className="furina-puppet-stage">
          <img className="furina-rig-legs" src={`${import.meta.env.BASE_URL}furina-rig/legs.webp`} width={290} height={579} alt="" draggable={false}/>
          <span className="furina-rig-upper">
            <img className="furina-rig-left-arm" src={`${import.meta.env.BASE_URL}furina-rig/arm-left.webp`} width={365} height={365} alt="" draggable={false}/>
            <img className="furina-rig-right-arm" src={`${import.meta.env.BASE_URL}furina-rig/arm-right.webp`} width={365} height={365} alt="" draggable={false}/>
            <img className="furina-rig-torso" src={`${import.meta.env.BASE_URL}furina-rig/torso.webp`} width={570} height={800} alt="" draggable={false}/>
            <img className="furina-rig-head" src={`${import.meta.env.BASE_URL}furina-rig/head.webp`} width={400} height={272} alt="" draggable={false}/>
          </span>
        </span>
      </span>
      {!open && !celebrating && unreadTip && <span className="furina-invite" aria-hidden="true">?</span>}
      {open && mode === "attention" && !celebrating && <span className="furina-alert" aria-hidden="true">!</span>}
    </button>
    <div className="furina-controls">
      <button onClick={() => { setGreeting(false); setCelebrating(false); setSaved(value => ({ ...value, paused: !value.paused })); }} aria-label={reduced ? "Animações desativadas: movimento reduzido" : saved.paused ? "Retomar animações da Furina" : "Pausar animações da Furina"} aria-pressed={saved.paused || reduced} disabled={reduced} title={reduced ? "Movimento reduzido ativo no dispositivo" : saved.paused ? "Retomar animações" : "Pausar animações"}>{saved.paused || reduced ? <Play size={15}/> : <Pause size={15}/>}</button>
      <button onClick={() => { cancelAutoClose(); cancelSideMove(); setOpen(false); setGreeting(false); setCelebrating(false); setSaved(value => ({ ...value, hidden: true })); }} aria-label="Ocultar Furina" title="Ocultar Furina"><X size={15}/></button>
    </div>
    <p className="furina-live" role="status" aria-live="polite">{announcement}</p>
  </aside>;
}
