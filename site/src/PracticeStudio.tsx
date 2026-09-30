import { useEffect, useRef, useState } from 'react';
import { nextPractice, readPractice, savePractice, type PracticeRecord } from './learningPractice';
import './learning-method.css';
export type PracticeCase = { sequence: string[]; recall: string; scenario: string; expected: string; transfer: string; rubric: string[] };
type Props = { id:string; title:string; module:number; stage:number; lab?:boolean; exercise:PracticeCase };
export default function PracticeStudio({ id,title,module,stage,lab=false,exercise }:Props) {
  const [record,setRecord]=useState(()=>readPractice()[id]);
  const [answer,setAnswer]=useState('');
  const [obstacle,setObstacle]=useState('concept');
  const [show,setShow]=useState(false);
  const [checks,setChecks]=useState<Record<number,boolean>>({});
  const [notice,setNotice]=useState('');
  const target=useRef<HTMLDetailsElement>(null);
  const [opened,setOpened]=useState(()=>location.hash===`#practice-${id}`);
  useEffect(()=>{if(location.hash===`#practice-${id}`) target.current?.scrollIntoView({block:'start'});},[id]);
  const ready=answer.trim().length>=20;
  const verified=exercise.rubric.every((_,i)=>checks[i]);
  const helps:Record<string,string>={concept:'Volte à explicação e defina o termo com um exemplo seu.',execution:'Refaça apenas o passo que falhou. Anote entrada, resultado esperado e observado.',contract:'Compare os campos e pré-requisitos com a fonte. Localize onde a expectativa deixou de valer.',explanation:'Explique a decisão em voz alta, usando uma evidência e uma limitação.'};
  function register(rating:PracticeRecord['rating']) {
    if(!ready || !show || (rating==='independent'&&!verified))return;
    const now=new Date(); const schedule=nextPractice(record,now,rating==='independent');
    const next:PracticeRecord={id,title,module,stage,lab,answer,obstacle,rating,attempts:(record?.attempts||0)+1,last:now.toISOString(),...schedule};
    const saved=savePractice(next); setRecord(next);
    setNotice(saved?'Tentativa registrada. A revisão aparecerá no painel Continue daqui.':'Tentativa disponível nesta sessão. O navegador não permitiu salvar o registro.');
  }
  return <details ref={target} id={`practice-${id}`} className="practice-studio" open={opened} onToggle={e=>setOpened(e.currentTarget.open)}><summary>Treino de autonomia: uma situação nova e revisão espaçada</summary>
    <p>Faça este treino depois do exemplo e da entrega principal. As respostas são comparadas por você com os critérios; o site não corrige texto ou executa seus arquivos.</p>
    <div className="practice-sequence"><strong>Divida o estudo nestes passos</strong><ol>{exercise.sequence.map(s=><li key={s}>{s}</li>)}</ol></div>
    <p><strong>Antes de consultar:</strong> {exercise.recall}</p>
    <h4>Resolva esta variação</h4><p className="practice-case">{exercise.scenario}</p>
    <label htmlFor={`practice-${id}`}>Sua tentativa e as evidências<textarea id={`practice-${id}`} value={answer} maxLength={2400} rows={5} onChange={e=>setAnswer(e.target.value)} placeholder="Explique sua decisão, o que testou e o resultado. Use apenas exemplos fictícios."/></label>
    <button type="button" aria-expanded={show} onClick={()=>setShow(!show)}>{show?'Ocultar critérios':'Comparar com a análise e os critérios'}</button>
    {show&&<div className="practice-feedback"><h4>Análise esperada</h4><p>{exercise.expected}</p>{exercise.rubric.map((c,i)=><label className="practice-check" key={c}><input type="checkbox" checked={!!checks[i]} onChange={e=>setChecks({...checks,[i]:e.target.checked})}/><span>{c}</span></label>)}<p><strong>Teste de transferência:</strong> {exercise.transfer}</p></div>}
    <label htmlFor={`obstacle-${id}`}>Se travou, onde estava a dificuldade?<select id={`obstacle-${id}`} value={obstacle} onChange={e=>setObstacle(e.target.value)}><option value="concept">Entender o conceito</option><option value="execution">Executar ou reproduzir</option><option value="contract">Ler requisitos, dados ou contrato</option><option value="explanation">Explicar e justificar</option></select></label><p className="practice-help">{helps[obstacle]}</p>
    <div className="practice-actions"><button disabled={!ready||!show} onClick={()=>register('again')}>Preciso retomar</button><button disabled={!ready||!show} onClick={()=>register('support')}>Resolvi com apoio</button><button disabled={!ready||!show||!verified} onClick={()=>register('independent')}>Demonstrei sem copiar</button></div>
    {(!ready||!show)&&<p className="learning-small">Escreva uma tentativa de pelo menos 20 caracteres e abra os critérios para registrar. Para declarar autonomia, confira todos os critérios na sua prática.</p>}
    {record&&<aside className="practice-schedule"><strong>Próxima revisão: {new Date(record.due).toLocaleDateString('pt-BR')}</strong><p>{record.attempts} tentativa(s). Na revisão, comece com uma resposta nova e faça o teste de transferência antes de comparar.</p><details><summary>Consultar minha última tentativa</summary><p className="practice-old">{record.answer}</p></details></aside>}
    <p className="learning-small">Usamos intervalos de 1, 7 e 30 dias como ponto de partida, não como fórmula universal. Precisou de apoio? Retome no dia seguinte. Antecipar uma revisão não aumenta o intervalo.</p><p role="status" aria-live="polite">{notice}</p>
    <a href={`${import.meta.env.BASE_URL}${lab?'lab/treinos-autonomia.md':`kits/treinos-${module}.md`}`} download>Baixar os treinos desta trilha com análises e critérios</a>
  </details>;
}
