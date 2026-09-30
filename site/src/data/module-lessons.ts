import raw from './module-lessons.json';
import type { Checkpoint } from './lab-checkpoints';

export type LessonMaterial = { title: string; url: string; focus: string; language: string; format: string; time: string; certificate: string };
export type ModuleLesson = {
  prerequisite: string; hours: string; explanation: string; walkthrough: string[];
  example: string; expected: string; challenge: string[]; unblock: string;
  questions: Checkpoint[]; materials: LessonMaterial[];
  name: string; learn: string[]; practice: string; proof: string;
  situation: string; outcome: string; attention: string; checks: string[];
};
// First three lessons extend the existing milestones; the last two supply new milestones.
export const moduleLessons = raw as unknown as Record<number, ModuleLesson[]>;
export const competencyLevels = [
  { name: 'Começo do zero', cue: 'Entenda e acompanhe um exemplo.' },
  { name: 'Fundamentos aplicados', cue: 'Faça com apoio e confira o resultado.' },
  { name: 'Construção', cue: 'Combine as peças e execute sozinho.' },
  { name: 'Confiabilidade', cue: 'Investigue falhas e proteja o comportamento.' },
  { name: 'Projeto avançado', cue: 'Desenhe, justifique, teste e entregue.' }
];
