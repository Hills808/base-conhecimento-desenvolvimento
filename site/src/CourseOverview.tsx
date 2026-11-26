import { getGuidedGoal, getGuidedTitle, guidedGroups } from './data/guidedCourse';
import { missions } from './data/formation';
import { dueMissions, recommendedLesson, type FormationProgress } from './formationProgress';
import { guidedHref, pathHref } from './GuidedCourse';

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

function Today({ progress }: { progress: FormationProgress }) {
  const recommended = recommendedLesson(progress);
  const group = guidedGroups.find(item => recommended && item.ids.includes(recommended));
  const reviews = dueMissions(progress);
  const lastMission = missions.find(item => item.id === progress.last);
  const hasMissionInProgress = lastMission && progress.attempts[lastMission.id] && !progress.attempts[lastMission.id].completedAt;
  const nextMission = hasMissionInProgress ? lastMission : missions.find(item => !progress.attempts[item.id]?.completedAt);
  const hasStarted = Boolean(progress.lastLesson);
  const primary = recommended ? guidedHref(recommended) : nextMission ? missionHref(nextMission.id) : pathHref;

  return (
    <section className="formation course-overview course-today">
      <header className="course-intro">
        <h1>{hasStarted ? 'Continue seu estudo' : 'Aprenda a programar em C#'}</h1>
        <p>{hasStarted ? 'Retome a aula no ponto em que parou.' : 'Comece com uma mensagem. Aos poucos, aprenda a ler, escrever e explicar um programa.'}</p>
      </header>
      <div className="course-next-lesson">
        <div>
          {recommended && group && <p className="course-meta">{group.title} · Aula {group.ids.indexOf(recommended) + 1} de {group.ids.length}</p>}
          <h2>{recommended ? getGuidedTitle(recommended) : nextMission?.title ?? 'Escolha uma aula para revisar'}</h2>
          <p>{recommended ? getGuidedGoal(recommended) : nextMission?.outcome ?? 'Tente resolver um exercício sem olhar a resposta e explique o raciocínio.'}</p>
        </div>
        <div className="course-next-actions">
          <a className="formation-primary" href={primary}>{recommended ? hasStarted ? 'Continuar aula' : 'Começar do zero' : nextMission ? 'Abrir prática' : 'Rever trilha'}</a>
          {primary !== pathHref && <a className="course-text-link" href={pathHref}>Ver a trilha</a>}
        </div>
      </div>

      <div className="course-home-progress">
        <h2>Seu percurso</h2>
        {guidedGroups.map(item => (
          <div key={item.title} className="course-unit-row">
            <span>{item.title}</span><GroupProgress title={item.title} ids={item.ids} progress={progress} />
          </div>
        ))}
      </div>

      {(hasMissionInProgress || reviews.length > 0) && (
        <details className="course-disclosure">
          <summary>Práticas para retomar</summary>
          {hasMissionInProgress && <p><a href={missionHref(lastMission.id)}>Continuar {lastMission.title.toLocaleLowerCase('pt-BR')}</a></p>}
          {reviews.length > 0 && <p><a href={missionHref(reviews[0].id)}>Revisar {reviews[0].title.toLocaleLowerCase('pt-BR')}</a></p>}
        </details>
      )}
    </section>
  );
}

function Path({ progress }: { progress: FormationProgress }) {
  const current = recommendedLesson(progress);
  return (
    <section className="formation course-overview">
      <header className="course-intro">
        <h1>Sua trilha de C#</h1>
        <p>Em cada aula, leia um exemplo, pratique e explique com suas palavras.</p>
      </header>
      {guidedGroups.map((group, index) => (
        <details className="course-unit" key={group.title} open={current ? group.ids.includes(current) : index === 0}>
          <summary>
            <span className="course-unit-title">{group.title}</span>
            <GroupProgress title={group.title} ids={group.ids} progress={progress} />
          </summary>
          <div className="course-unit-content">
            <p>{group.description}</p>
            <ol className="course-lesson-list">
              {group.ids.map((id, lessonIndex) => {
                const practiced = Boolean(progress.lessons[id]?.completedAt);
                return (
                  <li key={id}>
                    <a href={guidedHref(id)} aria-current={id === current ? 'step' : undefined}>
                      <span className={'course-lesson-index' + (practiced ? ' is-practiced' : '')} aria-hidden="true">
                        {practiced ? '✓' : lessonIndex + 1}
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
      <details className="course-disclosure">
        <summary>Práticas extras de C# e HTTP</summary>
        <ul className="course-links">{missions.map(mission => (
          <li key={mission.id}><a href={missionHref(mission.id)}>{mission.title}</a>{progress.attempts[mission.id]?.completedAt && <small> · Prática registrada</small>}</li>
        ))}</ul>
        <p><a href={base + '?visao=diagnostico'}>Fazer o diagnóstico de C# e HTTP</a></p>
      </details>
      <details className="course-disclosure">
        <summary>O que vem depois</summary>
        <p>As próximas aulas planejadas partem de repetições e coleções. Depois entram métodos, objetos e depuração, preparando o caminho para APIs, banco de dados e leitura de arquitetura.</p>
        <p><a href={base + '?visao=biblioteca'}>Consultar a biblioteca por assunto</a></p>
      </details>
    </section>
  );
}

export default function CourseOverview({ view, progress }: { view: string; progress: FormationProgress }) {
  return view === 'formacao' ? <Path progress={progress} /> : <Today progress={progress} />;
}
