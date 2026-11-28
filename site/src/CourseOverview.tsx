import { useId, useState, type ReactNode } from 'react';
import { ArrowUpRight, Check, ChevronRight } from 'lucide-react';
import { getGuidedGoal, getGuidedLesson, getGuidedTitle, guidedGroups, guidedIds, setupLesson } from './data/guidedCourse';
import { missions } from './data/formation';
import { dueMissions, hasGuidedWork, recommendedLesson, type FormationProgress } from './formationProgress';
import { guidedHref, guidedStepLabels, pathHref } from './GuidedCourse';
import StudyCode from './StudyCode';

const missionHref = (id: string) => pathHref + '&missao=' + id;
const base = import.meta.env.BASE_URL;

function GroupProgress({ ids, title, progress }: { ids: string[]; title: string; progress: FormationProgress }) {
  const practiced = ids.filter(id => progress.lessons[id]?.completedAt).length;
  return (
    <span className="course-unit-progress">
      <span>{practiced} de {ids.length} praticadas</span>
      <progress aria-label={'Aulas praticadas em ' + title} value={practiced} max={ids.length} />
    </span>
  );
}

function LessonPreview({ example }: { example: { code: string; output: string; input?: string } }) {
  const [open, setOpen] = useState(false);
  const outputId = useId();

  return (
    <figure className="study-console course-preview">
      <figcaption><span className="study-file">Program.cs</span><span>Exemplo da aula</span></figcaption>
      {example.input !== undefined && <p className="study-console-input">Entrada digitada <code>{JSON.stringify(example.input)}</code></p>}
      <StudyCode code={example.code} label="Código da próxima aula" />
      <div className="study-console-output">
        <button type="button" aria-controls={outputId} aria-expanded={open} onClick={() => setOpen(value => !value)}>
          {open ? 'Ocultar saída' : 'Ver saída esperada'}
        </button>
        <div role="status" id={outputId}>
          {open && <pre aria-label="Saída esperada"><code>{example.output}</code></pre>}
        </div>
      </div>
    </figure>
  );
}

function Today({ progress }: { progress: FormationProgress }) {
  const recommended = recommendedLesson(progress);
  const group = guidedGroups.find(item => recommended && item.ids.includes(recommended));
  const reviews = dueMissions(progress);
  const lastMission = missions.find(item => item.id === progress.last);
  const hasMissionInProgress = lastMission && progress.attempts[lastMission.id] && !progress.attempts[lastMission.id].completedAt;
  const nextMission = hasMissionInProgress ? lastMission : missions.find(item => !progress.attempts[item.id]?.completedAt);
  const hasStarted = Object.values(progress.lessons).some(hasGuidedWork);
  const primary = recommended ? guidedHref(recommended) : nextMission ? missionHref(nextMission.id) : pathHref;
  const attempt = recommended ? progress.lessons[recommended] : undefined;
  const resumeStep = hasGuidedWork(attempt) && guidedStepLabels.find(item => item.id === attempt?.step);
  const example = recommended && (recommended === setupLesson.id ? setupLesson : getGuidedLesson(recommended));

  return (
    <section className="formation course-overview course-today">
      <div className={'course-next-lesson' + (example ? ' has-preview' : '')}>
        <div className="course-next-copy">
          <h1>{hasStarted ? 'Continue seu estudo' : 'Aprenda a programar em C#'}</h1>
          {!hasStarted && <p className="course-today-lead">Comece com uma mensagem e aprenda a ler, escrever e explicar um programa.</p>}
          <div className="course-next-detail">
            {recommended && group && <p className="course-meta">{group.title} · Aula {group.ids.indexOf(recommended) + 1} de {group.ids.length}</p>}
            <h2>{recommended ? getGuidedTitle(recommended) : nextMission?.title ?? 'Escolha uma aula para revisar'}</h2>
            <p>{recommended ? getGuidedGoal(recommended) : nextMission?.outcome ?? 'Tente um exercício e explique o raciocínio.'}</p>
            {resumeStep && resumeStep.id !== 'exemplo' && <p className="course-meta">Você parou em <strong>{resumeStep.title}</strong>.</p>}
          </div>
          <a className="formation-primary" href={primary}>{recommended ? hasStarted ? 'Continuar aula' : 'Começar do zero' : nextMission ? 'Abrir prática' : 'Rever trilha'}</a>
          {recommended && recommended !== guidedIds[0] && !progress.lessons[guidedIds[0]]?.completedAt && (
            <p><a className="course-text-link" href={guidedHref(guidedIds[0])}>Começar pela primeira aula</a></p>
          )}
        </div>
        {example && <LessonPreview key={recommended} example={example} />}
      </div>

      <section className="course-home-progress" aria-labelledby="course-overview-title">
        <header className="course-section-heading">
          <h2 id="course-overview-title">Seu percurso</h2>
          <a className="course-text-link" href={pathHref}>Ver a trilha <ChevronRight size={16} aria-hidden="true" /></a>
        </header>
        {guidedGroups.map(item => (
          <div key={item.title} className="course-unit-row">
            <div><strong>{item.title}</strong><p>{item.description}</p></div>
            <GroupProgress title={item.title} ids={item.ids} progress={progress} />
          </div>
        ))}
      </section>

      {(hasMissionInProgress || reviews.length > 0) && (
        <details className="course-disclosure">
          <summary>Práticas para retomar</summary>
          {hasMissionInProgress && <p><a href={missionHref(lastMission.id)}>Retomar “{lastMission.title}”</a></p>}
          {reviews.length > 0 && <p><a href={missionHref(reviews[0].id)}>Revisar “{reviews[0].title}”</a></p>}
        </details>
      )}
    </section>
  );
}

function Path({ progress }: { progress: FormationProgress }) {
  const current = recommendedLesson(progress);
  return (
    <section className="formation course-overview">
      <header className="course-intro course-path-heading">
        <div><h1>Sua trilha de C#</h1><p>Comece com uma mensagem na tela. Em cada aula, acompanhe um exemplo e descubra sozinho o que outro programa faz.</p></div>
        <GroupProgress title="toda a trilha" ids={guidedIds} progress={progress} />
      </header>
      <div className="course-path">
        {guidedGroups.map((group, index) => (
          <details className="course-unit" key={group.title} open={current ? group.ids.includes(current) : index === 0}>
            <summary>
              <span className="course-unit-title">{group.title}</span>
              <GroupProgress title={group.title} ids={group.ids} progress={progress} />
            </summary>
            <div className="course-unit-content">
              <p>{group.description}</p>
              <ol className="course-lesson-list" role="list">
                {group.ids.map((id, lessonIndex) => {
                  const practiced = Boolean(progress.lessons[id]?.completedAt);
                  return (
                    <li key={id}>
                      <a href={guidedHref(id)} aria-current={id === current ? 'step' : undefined}>
                        <span className={'course-lesson-index' + (practiced ? ' is-practiced' : '')} aria-hidden="true">
                          {practiced ? <Check size={16} strokeWidth={2.5} /> : lessonIndex + 1}
                        </span>
                        <strong>{getGuidedTitle(id)}</strong>
                        {practiced && <small>Praticada</small>}
                        {id === current && <small>Próxima aula</small>}
                      </a>
                    </li>
                  );
                })}
              </ol>
            </div>
          </details>
        ))}
      </div>
      <details className="course-disclosure">
        <summary>Práticas extras de C# e HTTP</summary>
        <ul className="course-links">{missions.map(mission => (
          <li key={mission.id}><a href={missionHref(mission.id)}>{mission.title}</a>{progress.attempts[mission.id]?.completedAt && <small> · Prática registrada</small>}</li>
        ))}</ul>
        <p><a href={base + '?visao=diagnostico'}>Fazer o diagnóstico de C# e HTTP</a></p>
      </details>
      <details className="course-disclosure">
        <summary>O que vem depois</summary>
        <p>Depois das coleções, o percurso planejado passa por métodos, objetos e depuração. Essas etapas preparam a leitura de uma requisição que atravessa uma API, aplica uma regra e chega ao banco de dados. As aulas guiadas dessas etapas ainda estão em preparação.</p>
        <p><a href={base + '?visao=biblioteca'}>Consultar a biblioteca por assunto</a></p>
      </details>
    </section>
  );
}

export function StudyProject({ progress, children }: { progress: FormationProgress; children: ReactNode }) {
  const notes = guidedIds.filter(id => progress.lessons[id]?.note.trim());
  const repairs = guidedIds.filter(id => progress.lessons[id]?.repairCode !== undefined);
  return (
    <section className="formation course-overview course-project">
      <header className="course-intro">
        <h1>Mesa de atendimento</h1>
        <p>Seu projeto de estudo reúne programas e explicações que mostram o que você aprendeu.</p>
      </header>
      <section className="course-project-practice">
        <div>
          <h2>Classificador de espera</h2>
          <p>Na prática final de Decisões e dados, você vai ler os minutos informados, validar a entrada e decidir se um atendimento está atrasado.</p>
        </div>
        <a className="formation-primary" href={guidedHref('U10P')}>Abrir prática do classificador</a>
      </section>
      <section className="course-project-practice">
        <div><h2>Relatório da fila</h2><p>Na última aula de Repetições e coleções, acompanhe as mudanças de uma lista e confira o resultado com diferentes filas.</p></div>
        <a className="course-text-link" href={guidedHref('U15')}>Abrir a prática da fila</a>
      </section>
      <section className="course-project-notes">
        <h2>Minhas explicações</h2>
        {notes.length
          ? <ul className="course-links" role="list">{notes.map(id => (
            <li key={id}>
              <a href={guidedHref(id)}>{getGuidedTitle(id)} <ArrowUpRight size={15} aria-hidden="true" /></a>
              <p className="formation-saved-note">{progress.lessons[id].note}</p>
            </li>
          ))}</ul>
          : <p>Escreva uma explicação na parte <strong>Explicar</strong> de qualquer aula. Ela vai aparecer aqui neste navegador.</p>}
      </section>
      {repairs.length > 0 && <details className="course-disclosure">
        <summary>Meus rascunhos de correções</summary>
        <ul className="course-links">{repairs.map(id => <li key={id}>
          <a href={guidedHref(id)}>{getGuidedTitle(id)}</a>
          <pre className="course-answer"><code>{progress.lessons[id].repairCode}</code></pre>
        </li>)}</ul>
      </details>}
      <details className="course-disclosure">
        <summary>Registros das práticas extras</summary>
        <ul className="course-links" role="list">{missions.map(mission => {
          const attempt = progress.attempts[mission.id];
          return (
            <li key={mission.id}>
              <a href={missionHref(mission.id)}>{mission.title}</a>
              {attempt?.completedAt && <p className="course-meta">Prática registrada por você em {new Date(attempt.completedAt).toLocaleDateString('pt-BR')}.</p>}
              {attempt?.note && <p className="formation-saved-note">{attempt.note}</p>}
            </li>
          );
        })}</ul>
      </details>
      {children}
    </section>
  );
}

export default function CourseOverview({ view, progress }: { view: string; progress: FormationProgress }) {
  return view === 'formacao' ? <Path progress={progress} /> : <Today progress={progress} />;
}
