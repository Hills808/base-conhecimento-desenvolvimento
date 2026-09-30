import { useState } from 'react';
import './learning-method.css';
type Gate = { prompt: string; proof: string };
export default function LearningPath({ id, gates, onSelect }: { id: number; gates: Gate[]; onSelect: (level: number) => void }) {
  const [answers, setAnswers] = useState<Record<number,string>>({});
  const [hours, setHours] = useState('3');
  const [minutes, setMinutes] = useState('25');
  const complete = gates.every((_,i) => answers[i]);
  const gap = gates.findIndex((_,i) => answers[i] !== 'independent');
  const suggested = gap < 0 ? 4 : gap;
  const sessions = Math.floor(Number(hours)*60/Number(minutes));
  return <details className="learning-path"><summary>Monte seu ponto de partida e seu ritmo</summary>
    <p>Faça o pequeno teste de cada faixa antes de se avaliar. O resultado sugere onde começar; não conclui níveis por você. Se um termo for novo, escolha “Ainda não sei”.</p>
    <div className="learning-levels"><span><b>Básico · 0–1</b>Reconhecer e executar com apoio.</span><span><b>Intermediário · 2</b>Combinar as peças e investigar.</span><span><b>Avançado · 3–4</b>Testar limites, justificar e transferir.</span></div>
    <ol className="learning-diagnostic">{gates.map((gate,index)=><li key={index}><strong>Teste {index+1}: {gate.prompt}</strong><details><summary>O que uma boa demonstração contém</summary><p>{gate.proof}</p></details><label htmlFor={`diagnostic-${id}-${index}`}>Como você se saiu?<select id={`diagnostic-${id}-${index}`} value={answers[index]||''} onChange={e=>setAnswers({...answers,[index]:e.target.value})}><option value="">Escolha após tentar</option><option value="new">Ainda não sei</option><option value="support">Fiz consultando o exemplo</option><option value="independent">Fiz e expliquei sem copiar</option></select></label></li>)}</ol>
    {complete && <div className="learning-recommendation" role="status"><strong>Ponto sugerido: nível {suggested}.</strong><p>{gap < 0 ? 'Você relatou autonomia nos pré-requisitos. Tente o projeto e use os níveis anteriores para investigar lacunas.' : 'Este foi o primeiro ponto em que você precisou de apoio. Comece por ele e confirme com o exercício e os testes.'}</p><button onClick={()=>onSelect(suggested)}>Estudar a partir do nível {suggested}</button></div>}
    <div className="learning-rhythm"><label htmlFor={`weekly-${id}`}>Horas disponíveis por semana<select id={`weekly-${id}`} value={hours} onChange={e=>setHours(e.target.value)}>{[1,2,3,4,6,8].map(n=><option key={n} value={n}>{n} h</option>)}</select></label><label htmlFor={`session-${id}`}>Bloco que cabe no seu dia<select id={`session-${id}`} value={minutes} onChange={e=>setMinutes(e.target.value)}>{[15,25,45].map(n=><option key={n} value={n}>{n} min</option>)}</select></label></div>
    <p><strong>Plano ajustável:</strong> até {sessions} blocos de {minutes} minutos por semana. Reserve um para revisar. Nos outros, alterne exemplo guiado e tentativa própria. Pausas cabem no seu ritmo; não precisa terminar uma etapa em um dia.</p>
    <p className="learning-small">Estas escolhas são uma simulação de agenda. Avance pela demonstração do que aprendeu, não pelo número de blocos.</p>
    <details><summary>Por que usamos este método?</summary><p>O percurso alterna exemplo resolvido, tentativa própria, explicação e aplicação nova. A revisão espaçada ajuda a retomar o conteúdo e identificar lacunas. Os intervalos e a organização dos níveis são escolhas didáticas desta base.</p><ul><li><a href="https://ies.ed.gov/ncee/wwc/PracticeGuide/1" target="_blank" rel="noopener noreferrer">IES: prática, exemplos resolvidos e revisão ao longo do tempo (inglês)</a></li><li><a href="https://developer.mozilla.org/en-US/docs/Learn_web_development/About" target="_blank" rel="noopener noreferrer">MDN: fundamentos, testes de habilidades e desafios (inglês)</a></li><li><a href="https://learn.microsoft.com/pt-br/training/paths/get-started-c-sharp-part-1/" target="_blank" rel="noopener noreferrer">Microsoft Learn: módulos progressivos com exercícios (português)</a></li></ul></details>
  </details>;
}
