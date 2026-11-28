import { getGuidedLesson, setupLesson } from './data/guidedCourse';
import { guidedWorkshops, sameOutput } from './data/guidedWorkshops';
import { type FormationProgress, type GuidedAttempt } from './formationProgress';

export function canRecordGuidedPractice(id: string, attempt: GuidedAttempt) {
  const lesson = getGuidedLesson(id);
  const workshop = guidedWorkshops[id];
  return Boolean(workshop && attempt.predictionChecked && sameOutput(attempt.prediction, workshop.task.output)
    && (id === setupLesson.id || (lesson && attempt.checked && attempt.answer === lesson.correct)));
}

export function recordGuidedPractice(progress: FormationProgress, id: string, now = Date.now()): FormationProgress {
  const attempt = progress.lessons[id];
  if (!attempt || attempt.completedAt || !canRecordGuidedPractice(id, attempt)) return progress;
  return {
    ...progress,
    lastLesson: id,
    lessons: { ...progress.lessons, [id]: { ...attempt, step: 'explicacao', completedAt: new Date(now).toISOString() } },
  };
}
