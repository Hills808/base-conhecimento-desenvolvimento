import { useId, useRef, useState, type Ref } from 'react';
import {
  exampleCode, getGuidedLesson, guidedGroups, guidedIds, references, setupLesson, type GuidedLesson,
} from './data/guidedCourse';
import { canRecordGuidedPractice, type GuidedAttempt, type GuidedStep } from './formationProgress';

const base = import.meta.env.BASE_URL;
export const pathHref = base + '?visao=formacao';
export const guidedHref = (id: string) => pathHref + '&inicio=' + (guidedIds.indexOf(id) + 1);
const labels: { id: GuidedStep; title: string }[] = [
  { id: 'exemplo', title: 'Entender' },
  { id: 'pratica', title: 'Praticar' },
  { id: 'explicacao', title: 'Explicar' },
];

function Code({ code, label = 'Código C#', activeLine }: { code: string; label?: string; activeLine?: number }) {
  return (
    <pre className="course-code" tabIndex={0} aria-label={label}>
      <code>{code.split('\n').map((line, i) => (
        <span key={i} className={activeLine === i + 1 ? 'course-code-line is-active' : 'course-code-line'}>
          <span className="course-line-number" aria-hidden="true">{i + 1}</span>{line}{'\n'}
        </span>
      ))}</code>
    </pre>
  );
}

function WorkedExample({ lesson }: { lesson: GuidedLesson }) {
  const [selection, setSelection] = useState('');
  const [inspected, setInspected] = useState<string | null>(null);
  const id = useId();
  const explore = lesson.explore;
  const selected = explore?.cases.find(item => item.value === selection);
  const revealed = selected && selection === inspected ? selected : undefined;

  return (
    <>
      <figure className="course-example">
        <figcaption>Exemplo resolvido</figcaption>
        {lesson.input !== undefined && <p className="course-meta">Entrada digitada <code>{JSON.stringify(lesson.input)}</code></p>}
        <div className="course-example-pair">
          <div><span>Código</span><Code code={lesson.code} /></div>
          <div><span>Saída no console</span><pre tabIndex={0} aria-label="Saída no console"><code>{lesson.output}</code></pre></div>
        </div>
        <p>{lesson.explanation}</p>
      </figure>

      {explore && (
        <details className="course-disclosure">
          <summary>Mudar o valor e acompanhar o caminho</summary>
          <div className="course-experiment">
            <label htmlFor={id}>{explore.label}</label>
            <select id={id} value={selection} onChange={event => { setSelection(event.target.value); setInspected(null); }}>
              <option value="">Escolha um caso</option>
              {explore.cases.map(item => <option key={item.value} value={item.value}>{item.value}</option>)}
            </select>
            {selected && (
              <>
                <Code code={exampleCode(lesson.code, explore.replace, selected)} activeLine={revealed?.line} />
                <p>Que saída você espera para esse caso?</p>
                <button type="button" onClick={() => setInspected(selection)} disabled={Boolean(revealed)}>Conferir o caminho</button>
              </>
            )}
            <div role="status" aria-live="polite">
              {revealed && (
                <div className="course-feedback">
                  <p><strong>Saída ilustrada</strong></p>
                  <pre><code>{revealed.output}</code></pre>
                  <p className="course-meta">Linha {revealed.line} em destaque</p>
                  <p>{revealed.reason}</p>
                </div>
              )}
            </div>
          </div>
        </details>
      )}
    </>
  );
}

function StudyHelp({ lesson }: { lesson: GuidedLesson }) {
  const reference = references[lesson.reference ?? (lesson.id === 'I05' || lesson.id === 'I06' ? 'variables' : 'syntax')];
  return (
    <details className="course-disclosure course-help">
      <summary>Estou com dificuldade na leitura</summary>
      <p><strong>Antes desta aula</strong><br />{lesson.before}</p>
      {lesson.reviewLesson && <p><a href={guidedHref(lesson.reviewLesson)}>Voltar à aula “{getGuidedLesson(lesson.reviewLesson)?.title}”</a></p>}
      {lesson.terms && (
        <dl className="course-terms">{lesson.terms.map(term => (
          <div key={term.term}><dt>{term.term}</dt><dd>{term.meaning}</dd></div>
        ))}</dl>
      )}
      <p>{lesson.mistake}</p>
      <p>{reference.use} <a href={reference.url} target="_blank" rel="noopener noreferrer">{reference.title} (Microsoft Learn, nova aba)</a></p>
    </details>
  );
}

function Understand({ lesson, heading }: { lesson: GuidedLesson; heading: Ref<HTMLHeadingElement> }) {
  return (
    <>
      <h2 ref={heading} tabIndex={-1}>Entenda com um exemplo</h2>
      {lesson.paragraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}
      <WorkedExample lesson={lesson} />
      <StudyHelp lesson={lesson} />
    </>
  );
}

function Practice({ lesson, attempt, change, heading }: {
  lesson: GuidedLesson;
  attempt: GuidedAttempt;
  change: (patch: Partial<GuidedAttempt>) => void;
  heading: Ref<HTMLHeadingElement>;
}) {
  const feedback = attempt.checked && attempt.answer !== null ? lesson.feedback[attempt.answer] : undefined;
  return (
    <>
      <h2 ref={heading} tabIndex={-1}>Tente responder</h2>
      {lesson.questionCode && <Code code={lesson.questionCode} label="Código do exercício" />}
      <fieldset className="course-options">
        <legend>{lesson.prompt}</legend>
        {lesson.options.map((option, i) => (
          <label key={option}>
            <input type="radio" name="guided-answer" checked={attempt.answer === i} onChange={() => change({ answer: i, checked: false })} />
            <span>{option}</span>
          </label>
        ))}
      </fieldset>
      <button className={feedback && attempt.answer === lesson.correct ? undefined : 'formation-primary'} disabled={attempt.answer === null} onClick={() => change({ checked: true })}>Conferir resposta</button>
      <div role="status" aria-live="polite">
        {feedback && (
          <p className={'course-feedback' + (attempt.answer === lesson.correct ? ' is-correct' : '')}>
            {feedback}
          </p>
        )}
      </div>
      <details className="course-disclosure course-help">
        <summary>Travei. Quero uma pista</summary>
        <p>{lesson.hint}</p>
        {lesson.hintDetail && <details className="course-disclosure"><summary>Ver o raciocínio passo a passo</summary><p>{lesson.hintDetail}</p></details>}
        {lesson.reviewLesson && <p><a href={guidedHref(lesson.reviewLesson)}>Rever a ideia necessária</a></p>}
      </details>
    </>
  );
}

function Explain({ lesson, heading }: { lesson: GuidedLesson; heading: Ref<HTMLHeadingElement> }) {
  return (
    <>
      <h2 ref={heading} tabIndex={-1}>{lesson.challengeSteps ? 'Construa o programa' : 'Tente em outro exemplo'}</h2>
      <p>{lesson.challenge}</p>
      {lesson.challengeCode && <Code code={lesson.challengeCode} label="Código para explicar" />}
      {lesson.challengeSteps && (
        <>
          <ol className="course-instructions">{lesson.challengeSteps.map(step => <li key={step}>{step}</li>)}</ol>
          <p><a href={guidedHref(setupLesson.id)}>Rever como criar e rodar o projeto</a></p>
        </>
      )}
    </>
  );
}

function Setup({ step, heading }: { step: GuidedStep; heading: Ref<HTMLHeadingElement> }) {
  if (step === 'exemplo') {
    return (
      <>
        <h2 ref={heading} tabIndex={-1}>Prepare as ferramentas no Windows</h2>
        <p>O editor abre e salva arquivos de código. O terminal recebe comandos. O SDK .NET inclui as ferramentas que criam e executam o projeto C#.</p>
        <ol className="course-instructions">
          <li>No VS Code, abra uma pasta pessoal em <strong>Arquivo → Abrir Pasta</strong>. Em <strong>Terminal → Novo Terminal</strong>, abra o PowerShell.</li>
          <li>Digite <code>dotnet --list-sdks</code> e pressione Enter. Procure uma versão que comece com <code>10.0</code>.</li>
          <li>Se ela faltar, instale o <a href="https://dotnet.microsoft.com/pt-br/download/dotnet/10.0" target="_blank" rel="noopener noreferrer">SDK .NET 10 oficial (nova aba)</a>. Feche e reabra o terminal para repetir a conferência.</li>
        </ol>
        <details className="course-disclosure">
          <summary>O que é um projeto? E compilar?</summary>
          <p>Um projeto reúne arquivos de código e configurações. <code>Program.cs</code> é o texto que vamos editar. O arquivo <code>.csproj</code> guarda a configuração do projeto.</p>
          <p>Compilar transforma o código numa forma que o .NET pode executar. O compilador também aponta problemas como aspas ou parênteses faltando.</p>
        </details>
      </>
    );
  }

  if (step === 'pratica') {
    return (
      <>
        <h2 ref={heading} tabIndex={-1}>Crie e execute seu programa</h2>
        <p>No terminal da sua pasta de estudos, execute uma linha por vez. Se a subpasta já existir, escolha outro nome nos dois comandos.</p>
        <pre tabIndex={0} aria-label="Comandos no PowerShell"><code>{'dotnet new console -n MeuPrimeiroPrograma --framework net10.0\ncd MeuPrimeiroPrograma'}</code></pre>
        <p>O primeiro comando cria o projeto. O segundo entra na pasta dele. No editor, abra <code>Program.cs</code> dessa pasta, coloque o código abaixo e salve com <kbd>Ctrl</kbd> + <kbd>S</kbd>.</p>
        <Code code={setupLesson.code} />
        <p>No terminal em que você entrou na pasta do projeto, digite <code>dotnet run</code>. Você deve ver:</p>
        <pre tabIndex={0} aria-label="Saída esperada"><code>{setupLesson.output}</code></pre>
        <details className="course-disclosure course-help">
          <summary>O que eu faço se der erro?</summary>
          <dl className="course-terms">
            <div><dt>“dotnet não é reconhecido”</dt><dd>Confira a instalação do SDK e abra outro terminal. Instalar o runtime, sozinho, não fornece as ferramentas de criação.</dd></div>
            <div><dt>“Não foi possível encontrar um projeto”</dt><dd>Use <code>dir</code> para ver seus arquivos. Entre na pasta que contém <code>MeuPrimeiroPrograma.csproj</code>.</dd></div>
            <div><dt>Erro em Program.cs</dt><dd>Confira a primeira linha indicada e, se necessário, a de cima. Veja se faltou uma aspa reta, um parêntese ou um ponto e vírgula.</dd></div>
            <div><dt>A saída ainda é a antiga</dt><dd>Salve a alteração, rode o comando de novo e confira se o terminal está dentro do projeto que você editou.</dd></div>
          </dl>
        </details>
      </>
    );
  }

  return (
    <>
      <h2 ref={heading} tabIndex={-1}>Edite, execute e explique</h2>
      <p>Troque a mensagem por outra de sua escolha. Altere <code>6 + 2</code> para <code>6 + 3</code>. Antes de rodar, escreva as duas linhas que espera ver.</p>
      <p>Salve, execute <code>dotnet run</code> e compare com a previsão. Localize a linha que calcula a soma e explique onde digitou o código e onde chamou a execução.</p>
    </>
  );
}

export default function GuidedCourse({ id, attempt, change, record }: {
  id: string;
  attempt: GuidedAttempt;
  change: (patch: Partial<GuidedAttempt>) => void;
  record: () => void;
}) {
  const lesson = getGuidedLesson(id);
  const group = guidedGroups.find(item => item.ids.includes(id)) ?? guidedGroups[0];
  const nextId = guidedIds[guidedIds.indexOf(id) + 1];
  const heading = useRef<HTMLHeadingElement>(null);
  const noteId = useId();
  const step = attempt.step;

  function moveTo(next: GuidedStep) {
    change({ step: next });
    requestAnimationFrame(() => heading.current?.focus());
  }

  const canRecord = canRecordGuidedPractice(id, attempt);
  return (
    <article className="formation guided-course">
      <div className="course-topline">
        <a href={pathHref}>Voltar à trilha</a>
        <span>{group.title} · Aula {group.ids.indexOf(id) + 1} de {group.ids.length}</span>
      </div>
      <header className="course-title">
        <h1>{lesson?.title ?? setupLesson.title}</h1>
        <p>{lesson?.goal ?? setupLesson.goal}</p>
      </header>
      <nav className="course-steps" aria-label="Partes da aula">
        {labels.map((item, index) => (
          <button key={item.id} type="button" aria-current={item.id === step ? 'step' : undefined} onClick={() => moveTo(item.id)}>
            <span aria-hidden="true">{index + 1}.</span> {item.title}
          </button>
        ))}
      </nav>

      <section className="course-lesson-content" aria-label={labels.find(item => item.id === step)?.title}>
        {!lesson && <Setup step={step} heading={heading} />}
        {lesson && step === 'exemplo' && <Understand lesson={lesson} heading={heading} />}
        {lesson && step === 'pratica' && <Practice lesson={lesson} attempt={attempt} change={change} heading={heading} />}
        {lesson && step === 'explicacao' && <Explain lesson={lesson} heading={heading} />}

        {step === 'explicacao' && (
          <>
            <label className="formation-note" htmlFor={noteId}>Minha explicação ou dúvida <span>(opcional)</span></label>
            <textarea id={noteId} rows={4} maxLength={2000} value={attempt.note} placeholder="O código recebe… Depois verifica… A saída é…" onChange={event => change({ note: event.target.value })} />
            <p className="course-meta">Sua anotação fica neste navegador e entra na sua cópia de estudo.</p>
            <details className="course-disclosure">
              <summary>Compare depois de tentar</summary>
              <p className="course-answer">{lesson?.answer ?? 'O programa passa a mostrar a sua mensagem e o número 9. Você alterou e salvou o código no editor. No terminal, dotnet run compilou e executou a versão atual do projeto.'}</p>
              {lesson?.answerCode && <Code code={lesson.answerCode} label="Uma solução possível" />}
            </details>
            {attempt.completedAt
              ? <p className="course-feedback is-correct" role="status">✓ Prática registrada.</p>
              : <p>{lesson?.checkPrompt ?? (lesson ? 'Registre a prática quando conseguir explicar a resposta com suas palavras.' : 'Registre quando tiver rodado o programa e conferido a sua alteração.')}</p>}
          </>
        )}
      </section>

      <div className="course-actions">
        {step === 'exemplo' && <button className="formation-primary" onClick={() => moveTo('pratica')}>{lesson ? 'Ir para a prática' : 'Criar meu programa'}</button>}
        {step === 'pratica' && <button className={!lesson || (attempt.checked && attempt.answer === lesson.correct) ? 'formation-primary' : undefined} onClick={() => moveTo('explicacao')}>Ir para a explicação</button>}
        {step === 'explicacao' && !attempt.completedAt && (
          canRecord
            ? <button className="formation-primary" onClick={record}>Registrar minha prática</button>
            : <button onClick={() => moveTo('pratica')}>Voltar e conferir a resposta</button>
        )}
        {step === 'explicacao' && (
          <a className={attempt.completedAt ? 'formation-primary' : 'course-text-link'} href={nextId ? guidedHref(nextId) : pathHref}>
            {nextId ? 'Próxima aula' : 'Voltar à trilha'}
          </a>
        )}
        {!lesson && step !== 'explicacao' && nextId && <a className="course-text-link" href={guidedHref(nextId)}>Continuar a leitura sem instalar agora</a>}
      </div>
    </article>
  );
}
