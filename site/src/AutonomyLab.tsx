import { useEffect, useRef, useState } from 'react';
import content from './data/autonomy.json';
import { canOpen, completeReview, completeStage, emptyEvidence, evidenceReady, readAutonomy, reviewDue, saveAutonomy, stages, verifiedEvidence, type Evidence } from './autonomyProgress';
import StudyFocus from './StudyFocus';
import './autonomy.css';

export default function AutonomyLab() {
  const [progress, setProgress] = useState(readAutonomy);
  const [current, setCurrent] = useState(() => { const n = Number(new URLSearchParams(location.search).get('passo')); return n >= 1 && n <= stages.length && Number.isInteger(n) ? n - 1 : readAutonomy().last; });
  const [hint, setHint] = useState(false), [solution, setSolution] = useState(false);
  const [message, setMessage] = useState(''), [clock, setClock] = useState(Date.now());
  const heading = useRef<HTMLHeadingElement>(null);
  const stage = stages[current], record = progress.records[stage.id] || emptyEvidence();
  const unlocked = canOpen(progress, current, clock), finished = verifiedEvidence(record), due = reviewDue(record, clock);
  const source = content.sources[stage.source as keyof typeof content.sources];
  const done = stages.filter(s => verifiedEvidence(progress.records[s.id])).length;
  const firstReview = stages.findIndex(s => reviewDue(progress.records[s.id], clock));
  useEffect(() => {
    const refresh = () => { setProgress(readAutonomy()); setClock(Date.now()); };
    window.addEventListener('storage', refresh); window.addEventListener('focus', refresh); window.addEventListener('curva-aberta-backup-restored', refresh);
    const timer = window.setInterval(() => setClock(Date.now()), 30000);
    const sync = () => { const n = Number(new URLSearchParams(location.search).get('passo')); setCurrent(Number.isInteger(n) && n >= 1 && n <= stages.length ? n - 1 : 0); };
    window.addEventListener('popstate', sync);
    return () => { window.removeEventListener('storage', refresh); window.removeEventListener('focus', refresh); window.removeEventListener('curva-aberta-backup-restored', refresh); window.removeEventListener('popstate', sync); clearInterval(timer); };
  }, []);
  useEffect(() => { setHint(false); setSolution(false); }, [current]);
  function persist(next: typeof progress) { setProgress(next); const saved = saveAutonomy(next); if (!saved) setMessage('Seu registro está disponível nesta visita. O navegador não permitiu salvar; exporte seu estudo antes de fechar.'); return saved; }
  function change(patch: Partial<Evidence>, review = false) {
    const next = { ...record, ...patch };
    if (!review) { delete next.completedAt; delete next.reviewDue; }
    persist({ ...progress, records: { ...progress.records, [stage.id]: next } });
  }
  function visit(index: number) {
    setCurrent(index); setMessage(''); persist({ ...progress, last: index });
    const url = new URL(location.href); url.searchParams.set('passo', String(index + 1)); history.pushState({}, '', url.pathname + url.search);
    window.setTimeout(() => heading.current?.focus({ preventScroll: true }), 0);
  }
  function field(key: 'plan' | 'build' | 'explain' | 'helpNote' | 'reviewDraft' | 'reviewBuild', label: string, review = false) {
    return <label className="autonomy-field" htmlFor={`autonomy-${stage.id}-${key}`}>{label}<textarea id={`autonomy-${stage.id}-${key}`} rows={4} maxLength={8000} value={record[key]} disabled={!review && (!unlocked || finished)} onChange={e => change({ [key]: e.target.value }, review)}/></label>;
  }
  return <section className="autonomy-lab" aria-labelledby="autonomy-title">
    <header className="autonomy-intro"><h1 id="autonomy-title">Laboratório de autonomia</h1><p className="autonomy-lead">Construir, explicar e conseguir fazer de novo.</p><p>Um percurso de C# e APIs para transformar estudo em decisões próprias. Escolha uma entrega por vez. Avance pelas evidências, sem calendário de cargo ou obrigação de estudar todos os dias.</p><p><strong>{done} de {stages.length} etapas com autoavaliação registrada.</strong> Progresso e rascunhos ficam neste navegador e entram em “Exportar meu estudo”. Nenhuma resposta deste laboratório é publicada nas anotações compartilhadas.</p></header>
    <details className="autonomy-method"><summary>Como usar IA sem terceirizar seu raciocínio</summary><ol><li>Antes de pedir código, escreva sua hipótese e tente uma solução pequena.</li><li>Se travar, mostre entrada, resultado esperado, resultado obtido e peça uma pista.</li><li>Se receber uma solução, entenda e teste cada decisão. Registre a ajuda usada.</li><li>Feche a resposta e refaça a variação. Depois explique sem ler.</li></ol><p>Se pedir ajuda hoje, você continua aprendendo. O critério é demonstrar depois o que consegue fazer e reconhecer o que ainda precisa revisar.</p></details>
    {firstReview >= 0 && <p className="autonomy-alert" role="status">Há uma revisão disponível em “{stages[firstReview].title}”. Faça a recuperação antes de avançar para uma etapa posterior. <button onClick={() => visit(firstReview)}>Abrir revisão</button></p>}
    <div className="autonomy-layout"><nav className="autonomy-map" aria-label="Etapas do laboratório de autonomia"><ol>{stages.map((s, i) => <li key={s.id}><button aria-current={i === current ? 'step' : undefined} onClick={() => visit(i)}><span>{i + 1}. {s.title}</span><small>{reviewDue(progress.records[s.id], clock) ? 'Revisão disponível' : verifiedEvidence(progress.records[s.id]) ? 'Autoavaliação registrada' : canOpen(progress, i, clock) ? 'Prática liberada' : 'Leitura disponível · prática após a anterior'}</small></button></li>)}</ol></nav>
      <article className="autonomy-session"><h2 ref={heading} tabIndex={-1}>{current + 1}. {stage.title}</h2><p><strong>{stage.level}.</strong> {stage.goal}</p><p>Planeje uma sessão de 25 minutos; a entrega pode exigir mais de uma. Sugestão: 5 min para prever, 15 para experimentar e 5 para explicar. O relógio não conclui a etapa.</p>
        {!unlocked && <p className="autonomy-alert">Você pode ler o conteúdo. Para registrar a prática, conclua as etapas anteriores e as revisões que já venceram.</p>}
        <section><h3>Entenda uma ideia</h3><p>{stage.idea}</p><pre><code>{stage.example}</code></pre><details><summary>Conferir o exemplo resolvido</summary><p>{stage.walkthrough}</p></details></section>
        <section><h3>Faça com apoio</h3><ol>{stage.steps.map(s => <li key={s}>{s}</li>)}</ol>{current === 3 && <a href={`${import.meta.env.BASE_URL}?modulo=09&etapa=1`}>Abrir a oficina de HTTP e Bruno</a>}<p>{stage.mistake}</p><button onClick={() => { setHint(true); if (!finished && unlocked && record.help === 'none') change({ help: 'hint' }); }}>Preciso de uma pista</button>{hint && <p className="autonomy-hint">{stage.hint}</p>}</section>
        <section><h3>Agora faça sem copiar</h3><p>{stage.challenge}</p><p>Feche o exemplo e a resposta da IA. Se precisar consultar de novo, retome a prática com apoio e tente outra vez.</p><button onClick={() => setSolution(v => !v)} aria-expanded={solution}>Conferir critérios da variação</button>{solution && <p>{stage.expected}</p>}</section>
        <section><h3>Explique em voz alta</h3><p>Reserve dois minutos. Explique para alguém ou grave apenas no seu dispositivo. Esta página não grava áudio.</p><ul>{stage.oral.map(q => <li key={q}>{q}</li>)}</ul><p>Compare sua fala: ficou claro o problema, a decisão e a evidência? Se ainda leu tudo ou não conseguiu responder, registre a dúvida e refaça um trecho.</p></section>
        <section><h3>Sua evidência de hoje</h3><p id="autonomy-evidence-note">Cada campo principal precisa de pelo menos 40 caracteres para registrar contexto. Isso verifica preenchimento, não a correção da resposta. Os critérios são uma autoavaliação; peça revisão humana quando possível. Não coloque dados internos do trabalho, credenciais ou dados de clientes.</p>
          {field('plan', 'Antes de executar: minha previsão, plano e hipótese')}{field('build', 'O que construí e testei: entradas, esperado, obtido e caminho do arquivo ou commit')}{field('explain', 'Minha explicação sem ler: decisões, resultado e dúvida que ainda tenho')}
          <div className="autonomy-row"><label>Ajuda que usei<select disabled={finished || !unlocked} value={record.help} onChange={e => change({ help: e.target.value })}><option value="none">Consegui sem ajuda nesta tentativa</option><option value="hint">Pista do laboratório</option><option value="ai">IA ou solução consultada</option><option value="person">Ajuda de outra pessoa</option></select></label><label>Hoje me sinto capaz de explicar<select disabled={finished || !unlocked} value={record.confidence} onChange={e => change({ confidence: Number(e.target.value) })}>{['Preciso de bastante apoio', 'Entendo partes', 'Explico com algumas dúvidas', 'Explico e demonstro', 'Explico e adapto a uma mudança'].map((t, i) => <option key={t} value={i + 1}>{i + 1} — {t}</option>)}</select></label></div>
          {record.help !== 'none' && field('helpNote', 'Qual ajuda recebi e o que refiz depois sem consultar (mínimo 20 caracteres)')}
          <fieldset disabled={finished || !unlocked}><legend>Confira mostrando seu trabalho</legend>{stage.criteria.map((criterion, i) => <label className="autonomy-check" key={criterion}><input type="checkbox" checked={record.checks[i]} onChange={e => change({ checks: record.checks.map((v, k) => k === i ? e.target.checked : v) })}/>{criterion}</label>)}</fieldset>
          {finished ? <><p className="autonomy-success">Autoavaliação registrada. Próxima revisão: {record.reviewDue && new Date(record.reviewDue).toLocaleDateString('pt-BR')}. Refazer depois é parte da entrega.</p><button onClick={() => change({ checks: [false, false, false] })}>Reabrir esta prática para ajustar a evidência</button></> : <button disabled={!unlocked || !evidenceReady(record)} onClick={() => { const next = completeStage(progress, current); if (next !== progress && persist(next)) setMessage(current < stages.length - 1 ? 'Autoavaliação salva. Revisão agendada para amanhã; a próxima prática está liberada.' : 'Percurso registrado. Continue consolidando nas revisões e em outra demanda pequena.'); }}>Registrar autoavaliação e agendar revisão</button>}
        </section>
        {finished && <section><h3>Recupere sem consultar</h3><p>Na data da revisão, feche o exemplo, refaça a variação e explique as decisões. A primeira revisão acontece após um dia; depois de revisões registradas, os intervalos são de 3, 7, 14 e 30 dias.</p>{due ? <>{field('reviewBuild', 'O que refiz e qual resultado obtive sem consultar', true)}{field('reviewDraft', 'Minha explicação de memória e o que precisei corrigir', true)}<fieldset><legend>Antes de registrar a revisão</legend>{['Refiz a variação sem copiar uma solução.', 'Comparei com os critérios e corrigi o que divergiu.', 'Expliquei minhas decisões sem ler o exemplo.'].map((q, i) => <label key={q} className="autonomy-check"><input type="checkbox" checked={record.reviewChecks[i]} onChange={e => change({ reviewChecks: record.reviewChecks.map((v, k) => k === i ? e.target.checked : v) }, true)}/>{q}</label>)}</fieldset><button disabled={record.reviewDraft.trim().length < 40 || record.reviewBuild.trim().length < 40 || !record.reviewChecks.every(Boolean)} onClick={() => { if (persist(completeReview(progress, current))) setMessage('Revisão registrada. A próxima recuperação foi agendada.'); }}>Registrar revisão feita sem consulta</button><p>Precisou de apoio? Faça o trecho guiado de novo. Deixe os critérios desmarcados até conseguir refazer; a data não avança sozinha.</p></> : <p>A revisão será liberada na data indicada. Você pode praticar antes; isso não adia a recuperação.</p>}</section>}
        <details><summary>Um material de apoio, quando precisar</summary><a href={source.url} target="_blank" rel="noopener noreferrer">{source.title} — {source.provider} (abre em outra aba)</a><p>{source.use}</p><p>{source.language}. {source.duration}. {source.certificate}. {source.access}</p><small>Consulta da fonte: {source.verified}. Prática da etapa: uma ou mais sessões de 25 min, estimativa editorial; não é a duração do material.</small></details>
        <p role="status">{message}</p><div className="autonomy-actions">{current > 0 && <button onClick={() => visit(current - 1)}>Etapa anterior</button>}{current < stages.length - 1 && <button disabled={!verifiedEvidence(record) || !canOpen(progress, current + 1, clock)} onClick={() => visit(current + 1)}>Próxima prática</button>}{done === stages.length && <a href={`${import.meta.env.BASE_URL}?modulo=09`}>Consolidado o percurso, retome MCP, tools e RAG</a>}</div>
        {unlocked && <StudyFocus stepId={`autonomia-${stage.id}`} stepTitle={stage.title} suggestedGoal={stage.goal}/>}
      </article></div>
  </section>;
}
