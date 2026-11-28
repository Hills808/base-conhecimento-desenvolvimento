import { useId, useState } from 'react';
import { predictionFeedback, sameOutput, type Workshop } from './data/guidedWorkshops';
import type { GuidedAttempt } from './formationProgress';
import StudyCode from './StudyCode';

export function FirstMessageExperiment() {
  const [message, setMessage] = useState('Biblioteca aberta');
  const [display, setDisplay] = useState<string | null>(null);
  const inputId = useId();
  const literal = JSON.stringify(message).replace(/\u0085/g, '\\u0085').replace(/\u2028/g, '\\u2028').replace(/\u2029/g, '\\u2029');
  return (
    <details className="course-disclosure">
      <summary>Experimente mudar a mensagem do painel</summary>
      <p>Você cuida do aviso na porta da biblioteca. Escreva uma mensagem e mande mostrá-la. Depois edite uma palavra e observe a tela antes de apertar o botão outra vez.</p>
      <label className="formation-note" htmlFor={inputId}>Mensagem da biblioteca</label>
      <input className="course-message-input" id={inputId} type="text" maxLength={80} value={message} onChange={event => setMessage(event.target.value)} />
      <StudyCode code={'Console.WriteLine(' + literal + ');'} label="Instrução com a sua mensagem" />
      <button type="button" onClick={() => setDisplay(message)}>Mostrar no painel</button>
      <div className="course-sample" role="status" aria-live="polite">
        <p><strong>Painel da biblioteca</strong></p>
        {display === null ? <p>Aguardando a primeira execução.</p> : display === '' ? <p>Apareceu uma linha vazia.</p> : <pre><code>{display}</code></pre>}
      </div>
      <p className="course-meta">Esta simulação mostra o efeito de uma instrução. Na aula 7 você vai executar o C# no seu computador.</p>
    </details>
  );
}

export function CodeWalkthrough({ code, trace }: { code: string; trace: Workshop['trace'] }) {
  const [position, setPosition] = useState(0);
  const step = trace[position];
  return (
    <details className="course-disclosure">
      <summary>Ler o exemplo linha por linha</summary>
      <StudyCode code={code} activeLine={step.line} label="Código do exemplo com a linha comentada em destaque" />
      <div className="course-trace-comment" aria-live="polite" aria-atomic="true">
        <strong>Passo {position + 1} de {trace.length} · Linha {step.line}</strong>
        <p>{step.observation}</p>
      </div>
      <div className="course-workshop-actions">
        <button type="button" disabled={position === 0} onClick={() => setPosition(position - 1)}>Passo anterior</button>
        <button type="button" disabled={position === trace.length - 1} onClick={() => setPosition(position + 1)}>Próximo passo</button>
      </div>
    </details>
  );
}

function KeyboardInput({ value }: { value: string }) {
  return value === '' ? <p className="course-meta">A pessoa apenas aperta Enter.</p> : (
    <div className="course-sample"><span>Entrada digitada</span><pre><code>{value}</code></pre></div>
  );
}

type WorkshopProps = { attempt: GuidedAttempt; change: (patch: Partial<GuidedAttempt>) => void };

export function OutputPractice({ task, attempt, change }: WorkshopProps & { task: Workshop['task'] }) {
  const id = useId();
  const correct = sameOutput(attempt.prediction, task.output);
  return (
    <section className="course-workshop" aria-labelledby={id + '-title'}>
      <h3 id={id + '-title'}>O que este programa mostra?</h3>
      <p>{task.context}</p>
      <StudyCode code={task.code} label="Novo programa para ler por conta própria" />
      {task.input !== undefined && <KeyboardInput value={task.input} />}
      <label className="formation-note" htmlFor={id}>Minha previsão da saída</label>
      <p className="course-meta" id={id + '-hint'}>Escreva como apareceria no console, uma linha por mensagem. Os números da margem servem para acompanhar o código.</p>
      <textarea className="course-code-input" id={id} rows={3} spellCheck={false} maxLength={2000} aria-describedby={id + '-hint'} value={attempt.prediction} onChange={event => change({ prediction: event.target.value, predictionChecked: false })} />
      <button type="button" disabled={!attempt.prediction.trim()} onClick={() => change({ predictionChecked: true })}>Conferir minha previsão</button>
      <div role="status" aria-live="polite">
        {attempt.predictionChecked && <p className={'course-feedback' + (correct ? ' is-correct' : '')}><strong>{correct ? 'A previsão confere. ' : 'Vamos rastrear. '}</strong>{predictionFeedback(task, attempt.prediction)}</p>}
      </div>
      <details className="course-disclosure course-help">
        <summary>Preciso de ajuda com este programa</summary>
        <p>{task.hint}</p>
        <details className="course-disclosure">
          <summary>Ver a saída comentada</summary>
          <pre><code>{task.output}</code></pre>
          <p>{task.explain}</p>
        </details>
      </details>
    </section>
  );
}

export function RepairPractice({ lessonId, repair, attempt, change }: WorkshopProps & { lessonId: string; repair: Workshop['repair'] }) {
  const id = useId();
  const code = attempt.repairCode ?? repair.code;
  const filename = 'Oficina-' + lessonId + '.cs';
  function downloadCode() {
    const url = URL.createObjectURL(new Blob([code], { type: 'text/plain;charset=utf-8' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  return (
    <details className="course-disclosure course-repair">
      <summary>Oficina de correção · Investigue uma falha</summary>
      <p>{repair.brief}</p>
      <label className="formation-note" htmlFor={id}>Código para investigar e editar</label>
      <textarea className="course-code-input" id={id} rows={Math.min(12, repair.code.split('\n').length + 1)} spellCheck={false} maxLength={8000} value={code} onChange={event => change({ repairCode: event.target.value })} />
      <p className="course-meta">Seu rascunho fica neste navegador. Você pode testar a alteração no seu computador.</p>
      <details className="course-disclosure">
        <summary>Testar a minha versão em C#</summary>
        <ol className="course-instructions">
          <li>Baixe o arquivo e guarde-o em uma pasta de estudos. O arquivo contém o código que está no campo acima. <button type="button" onClick={downloadCode}>Baixar {filename}</button></li>
          <li>Com o SDK .NET 10 instalado, abra essa pasta no VS Code. Em <strong>Terminal → Novo Terminal</strong>, execute <code>dotnet run --file {filename}</code>. <a href={import.meta.env.BASE_URL + '?visao=formacao&inicio=7'}>Ver como preparar o ambiente</a></li>
          <li>Execute novamente para cada caso abaixo. Quando houver entrada, digite uma linha de cada vez e pressione Enter.</li>
        </ol>
        <ul className="course-test-cases" aria-label="Casos para conferir a correção">
          {repair.tests.map((test, index) => <li key={index}>
            {test.input !== undefined ? <KeyboardInput value={test.input} /> : repair.code.includes('ReadLine(') && <p className="course-meta">Encerre a entrada antes de digitar texto. No Windows, pressione Ctrl + Z e Enter em uma linha vazia.</p>}
            <span>Saída esperada</span><pre><code>{test.output}</code></pre>
          </li>)}
        </ul>
      </details>
      <details className="course-disclosure course-help"><summary>Uma pista para localizar o erro</summary><p>{repair.hint}</p></details>
      <details className="course-disclosure">
        <summary>Comparar com uma correção explicada</summary>
        <StudyCode code={repair.solution} label="Uma possível correção" />
        <p>{repair.explanation}</p>
      </details>
    </details>
  );
}
