import { useEffect, useMemo, useState, useId } from "react";
import { Coffee, Pause, Play, RotateCcw, Timer } from "lucide-react";

import { focusKey, goalLimit, readFocus, remainingSeconds } from "./focusSession";
import { writeStored } from "./studyStorage";
type Mode = "focus" | "break";

const presets = [
  { label: "Rápida", time: 15, break: 3 },
  { label: "Foco", time: 25, break: 5 },
  { label: "Profunda", time: 45, break: 10 }
];

function format(total: number) {
  const minutes = Math.floor(total / 60).toString().padStart(2, "0");
  const seconds = (total % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
}

export default function StudyFocus({ stepId, stepTitle, suggestedGoal }: { stepId: string; stepTitle: string; suggestedGoal: string }) {
  const saved = useMemo(() => { const value = readFocus(); return value?.stepId === stepId ? value : null; }, [stepId]);
  const [mode, setMode] = useState<Mode>(saved?.mode || "focus");
  const [duration, setDuration] = useState(saved?.duration || 25);
  const [endsAt, setEndsAt] = useState<number | null>(saved?.endsAt || null);
  const [goal, setGoal] = useState(saved?.goal ?? "");
  const goalId = useId();
  const [pausedSeconds, setPausedSeconds] = useState(saved?.remaining ?? 25 * 60);
  const [saveFailed, setSaveFailed] = useState(false);
  const [now, setNow] = useState(Date.now());
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    if (!endsAt) return;
    const tick = () => { const time = Date.now(); setNow(time); if (time >= endsAt) window.clearInterval(timer); };
    const timer = window.setInterval(tick, 1000); tick();
    document.addEventListener('visibilitychange', tick);
    return () => { window.clearInterval(timer); document.removeEventListener('visibilitychange', tick); };
  }, [endsAt]);
  useEffect(() => {
    setMode(saved?.mode ?? "focus"); setDuration(saved?.duration ?? 25);
    setEndsAt(saved?.endsAt ?? null); setPausedSeconds(saved?.remaining ?? 1500); setGoal(saved?.goal ?? "");
  }, [saved]);
  useEffect(() => {
    setSaveFailed(!writeStored(focusKey, { mode, duration, remaining: pausedSeconds, endsAt, goal, stepId, stepTitle }, 'curva-aberta-focus-change'));
  }, [mode, duration, pausedSeconds, endsAt, goal, stepId, stepTitle]);

  const remaining = remainingSeconds(endsAt, pausedSeconds, now);
  const ended = Boolean(endsAt && remaining === 0);
  const running = Boolean(endsAt && !ended);
  function start() { const startedAt = Date.now(); setNow(startedAt); setEndsAt(startedAt + remaining * 1000); }
  function pause() { setPausedSeconds(remainingSeconds(endsAt, pausedSeconds, Date.now())); setEndsAt(null); }
  function reset() { setPausedSeconds(Math.round(duration * 60)); setEndsAt(null); }
  function startBreak() { const minutes = duration >= 40 ? 10 : duration <= 15 ? 3 : 5; setMode("break"); setDuration(minutes); setPausedSeconds(minutes * 60); setEndsAt(null); }
  function restartFocus() { setMode("focus"); setDuration(25); setPausedSeconds(1500); setEndsAt(null); }

  return <section className="focus-card" aria-label="Modo foco">
    <div className="focus-heading"><div><span className="eyebrow">MODO FOCO</span><h3>{mode === "focus" ? "Escolha um gesto pequeno e comece." : "Pausa curta, sem perder o ritmo."}</h3><p>{mode === "focus" ? "A meta não é concluir a etapa inteira; é deixar uma evidência concreta antes do tempo acabar." : "Descanse. Quando voltar, a meta e a etapa continuam aqui."}</p></div><Timer size={23} aria-hidden="true"/></div>
    <div className="focus-body">
      <div className="focus-clock" aria-label={running ? `Faltam ${format(remaining)} nesta sessão` : `Tempo disponível: ${format(remaining)}`}>
        <strong>{format(remaining)}</strong><span>{ended ? "tempo concluído" : mode === "focus" ? "foco" : "pausa"}</span>
      </div>
      <div className="focus-controls">
        <label htmlFor={goalId}>Meta desta sessão</label>
        <span id={`${goalId}-help`} className="focus-field-help">Uma ação curta e verificável — não precisa ser a etapa toda.</span>
        <div className="focus-suggestion"><span>Sugestão: <strong>{suggestedGoal}</strong></span>{!running && <button onClick={() => setGoal(suggestedGoal.slice(0, goalLimit))}>Usar sugestão</button>}</div>
        <input id={goalId} aria-describedby={`${goalId}-help`} value={goal} onChange={e => setGoal(e.target.value)} placeholder="Ex.: identificar status e corpo da resposta" maxLength={goalLimit} disabled={running} />
        <div className="focus-actions">
          {!running && !ended && <button className="lab-action" onClick={start}><Play size={16}/>Iniciar sessão</button>}
          {running && <button className="lab-action" onClick={pause}><Pause size={16}/>Pausar</button>}
          {(running || ended || pausedSeconds !== duration * 60) && <button className="focus-quiet" onClick={reset}><RotateCcw size={16}/>Reiniciar</button>}
          {ended && mode === "focus" && <button className="focus-quiet" onClick={startBreak}><Coffee size={16}/>Iniciar pausa</button>}
          {ended && mode === "break" && <button className="focus-quiet" onClick={restartFocus}><Play size={16}/>Voltar ao foco</button>}
        </div>
        <button className="focus-settings" onClick={() => setShowSettings(v => !v)} aria-expanded={showSettings}>Ajustar duração</button>
        {showSettings && <div className="focus-presets" aria-label="Duração da sessão">{presets.map(p => <button key={p.label} className={duration === p.time && mode === "focus" ? "active" : ""} onClick={() => { setMode("focus"); setDuration(p.time); setPausedSeconds(p.time * 60); setEndsAt(null); }}>{p.label}<small>{p.time}/{p.break} min</small></button>)}<label>Personalizado <input type="number" min="5" max="90" value={duration} onChange={e => { const minutes = Math.max(5, Math.min(90, Number(e.target.value) || 25)); setDuration(minutes); setPausedSeconds(minutes * 60); setEndsAt(null); }} /> min</label></div>}
      </div>
    </div>
    {ended && <div className="focus-complete" role="status"><strong>Foco concluído.</strong> Registre sua evidência na entrega desta etapa antes de abrir a próxima.</div>}
    {saveFailed && <p role="status">O navegador não permitiu salvar a sessão. Ela continua disponível durante esta visita.</p>}
    <p className="focus-note">O cronômetro é opcional e fica salvo apenas neste navegador. Pausar ou encerrar cedo não apaga seu progresso.</p>
  </section>;
}
