import { useEffect, useMemo, useState } from "react";
import { Coffee, Pause, Play, RotateCcw, Timer } from "lucide-react";

type Mode = "focus" | "break";
type Session = {
  mode: Mode;
  duration: number;
  endsAt: number | null;
  goal: string;
  stepId: string;
  stepTitle: string;
};

const key = "curva-aberta-focus-v1";
const presets = [
  { label: "Rápida", time: 15, break: 3 },
  { label: "Foco", time: 25, break: 5 },
  { label: "Profunda", time: 45, break: 10 }
];

function read(): Session | null {
  try {
    const value = JSON.parse(localStorage.getItem(key) || "null");
    return value && typeof value === "object" && typeof value.duration === "number" ? value : null;
  } catch { return null; }
}
function format(total: number) {
  const minutes = Math.floor(total / 60).toString().padStart(2, "0");
  const seconds = (total % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
}

export default function StudyFocus({ stepId, stepTitle, suggestedGoal }: { stepId: string; stepTitle: string; suggestedGoal: string }) {
  const saved = useMemo(read, []);
  const [mode, setMode] = useState<Mode>(saved?.mode || "focus");
  const [duration, setDuration] = useState(saved?.duration || 25);
  const [endsAt, setEndsAt] = useState<number | null>(saved?.endsAt || null);
  const [goal, setGoal] = useState(saved?.stepId === stepId && saved.goal.length <= 90 ? saved.goal : "");
  const [now, setNow] = useState(Date.now());
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);
  useEffect(() => {
    if (saved?.stepId !== stepId) {
      setMode("focus"); setDuration(25); setEndsAt(null); setGoal("");
    }
  }, [stepId, suggestedGoal]);
  useEffect(() => {
    try { localStorage.setItem(key, JSON.stringify({ mode, duration, endsAt, goal, stepId, stepTitle })); } catch { /* session still works */ }
  }, [mode, duration, endsAt, goal, stepId, stepTitle]);

  const remaining = endsAt ? Math.max(0, Math.ceil((endsAt - now) / 1000)) : duration * 60;
  const ended = Boolean(endsAt && remaining === 0);
  const running = Boolean(endsAt && !ended);
  function start() { const startedAt = Date.now(); setNow(startedAt); setEndsAt(startedAt + remaining * 1000); }
  function pause() { setDuration(Math.max(1, Math.ceil(remaining / 60))); setEndsAt(null); }
  function reset() { setEndsAt(null); }
  function startBreak() { setMode("break"); setDuration(duration >= 40 ? 10 : duration <= 15 ? 3 : 5); setEndsAt(null); }
  function restartFocus() { setMode("focus"); setDuration(25); setEndsAt(null); }

  return <section className="focus-card" aria-label="Modo foco">
    <div className="focus-heading"><div><span className="eyebrow">MODO FOCO</span><h3>{mode === "focus" ? "Escolha um gesto pequeno e comece." : "Pausa curta, sem perder o ritmo."}</h3><p>{mode === "focus" ? "A meta não é concluir a etapa inteira; é deixar uma evidência concreta antes do tempo acabar." : "Descanse. Quando voltar, a meta e a etapa continuam aqui."}</p></div><Timer size={23} aria-hidden="true"/></div>
    <div className="focus-body">
      <div className="focus-clock" aria-label={running ? `Faltam ${format(remaining)} nesta sessão` : `Sessão de ${duration} minutos`}>
        <strong>{format(remaining)}</strong><span>{ended ? "tempo concluído" : mode === "focus" ? "foco" : "pausa"}</span>
      </div>
      <div className="focus-controls">
        <label htmlFor="session-goal">Meta desta sessão</label>
        <span id="session-goal-help" className="focus-field-help">Uma ação curta e verificável — não precisa ser a etapa toda.</span>
        <div className="focus-suggestion"><span>Sugestão: <strong>{suggestedGoal}</strong></span>{!running && <button onClick={() => setGoal(suggestedGoal)}>Usar sugestão</button>}</div>
        <input id="session-goal" aria-describedby="session-goal-help" value={goal} onChange={e => setGoal(e.target.value)} placeholder="Ex.: identificar status e corpo da resposta" maxLength={140} disabled={running} />
        <div className="focus-actions">
          {!running && !ended && <button className="lab-action" onClick={start}><Play size={16}/>Iniciar sessão</button>}
          {running && <button className="lab-action" onClick={pause}><Pause size={16}/>Pausar</button>}
          {(running || ended) && <button className="focus-quiet" onClick={reset}><RotateCcw size={16}/>Reiniciar</button>}
          {ended && mode === "focus" && <button className="focus-quiet" onClick={startBreak}><Coffee size={16}/>Iniciar pausa</button>}
          {ended && mode === "break" && <button className="focus-quiet" onClick={restartFocus}><Play size={16}/>Voltar ao foco</button>}
        </div>
        <button className="focus-settings" onClick={() => setShowSettings(v => !v)} aria-expanded={showSettings}>Ajustar duração</button>
        {showSettings && <div className="focus-presets" aria-label="Duração da sessão">{presets.map(p => <button key={p.label} className={duration === p.time && mode === "focus" ? "active" : ""} onClick={() => { setMode("focus"); setDuration(p.time); setEndsAt(null); }}>{p.label}<small>{p.time}/{p.break} min</small></button>)}<label>Personalizado <input type="number" min="5" max="90" value={duration} onChange={e => { setDuration(Math.max(5, Math.min(90, Number(e.target.value) || 25))); setEndsAt(null); }} /> min</label></div>}
      </div>
    </div>
    {ended && <div className="focus-complete"><strong>Foco concluído.</strong> Registre sua evidência na entrega desta etapa antes de abrir a próxima.</div>}
    <p className="focus-note">O cronômetro é opcional e fica salvo apenas neste navegador. Pausar ou encerrar cedo não apaga seu progresso.</p>
  </section>;
}
