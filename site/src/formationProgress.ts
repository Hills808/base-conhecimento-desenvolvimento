import { getGuidedLesson, guidedIds } from './data/guidedCourse';
import { missions, diagnostic } from './data/formation';
import { isRecord, mapValues, readStored, validDate, writeStored } from './studyStorage';
export const formationKey = 'curva-aberta-formation-v1';
export const formationEvent = 'curva-aberta-formation-change';
export type Attempt = { step: number; reviewing: boolean; answers: Record<string, number>; checked: boolean; note: string; checks: boolean[]; completedAt?: string; reviewedAt?: string };
export type GuidedStep = 'exemplo' | 'pratica' | 'explicacao';
export type GuidedAttempt = {
  step: GuidedStep;
  answer: number | null;
  checked: boolean;
  note: string;
  prediction: string;
  predictionChecked: boolean;
  repairCode?: string;
  completedAt?: string;
};
export type FormationProgress = {
  last: string;
  diagnostic: Record<string, number>;
  attempts: Record<string, Attempt>;
  lastLesson?: string;
  lessons: Record<string, GuidedAttempt>;
};

export const emptyGuidedAttempt: GuidedAttempt = { step: 'exemplo', answer: null, checked: false, note: '', prediction: '', predictionChecked: false };

function parseGuidedAttempt(id: string, value: unknown): GuidedAttempt | undefined {
  if (!isRecord(value)) return undefined;
  const lesson = getGuidedLesson(id);
  const validAnswer = lesson && typeof value.answer === 'number' && Number.isInteger(value.answer)
    && value.answer >= 0 && value.answer < lesson.options.length;
  const result: GuidedAttempt = {
    step: value.step === 'pratica' || value.step === 'explicacao' ? value.step : 'exemplo',
    answer: validAnswer ? value.answer : null,
    checked: Boolean(validAnswer && value.checked === true),
    note: typeof value.note === 'string' ? value.note.slice(0, 2000) : '',
    prediction: typeof value.prediction === 'string' ? value.prediction.slice(0, 2000) : '',
    predictionChecked: typeof value.prediction === 'string' && Boolean(value.prediction.trim()) && value.predictionChecked === true,
  };
  if (typeof value.repairCode === 'string') result.repairCode = value.repairCode.slice(0, 8000);
  if (validDate(value.completedAt)) result.completedAt = value.completedAt;
  return result;
}

export function hasGuidedWork(attempt?: GuidedAttempt): boolean {
  return Boolean(attempt && (attempt.answer !== null || attempt.note.trim() || attempt.prediction.trim()
    || attempt.repairCode !== undefined || attempt.completedAt));
}

export function recommendedLesson({ lastLesson, lessons }: FormationProgress) {
  if (lastLesson && hasGuidedWork(lessons[lastLesson]) && !lessons[lastLesson].completedAt) return lastLesson;
  return guidedIds.find(id => hasGuidedWork(lessons[id]) && !lessons[id].completedAt)
    ?? guidedIds.find(id => !lessons[id]?.completedAt);
}

export const freshAttempt = (): Attempt => ({step:0,reviewing:false,answers:{},checked:false,note:'',checks:[false,false]});
function answers(value: unknown, lengths: number[]) { return mapValues(value, k => /^\d+$/.test(k) && +k < lengths.length, (v) => typeof v === 'number' && Number.isInteger(v) && v >= -1 && v < Math.max(...lengths) ? v as number : undefined); }
export function parseFormation(value: unknown): FormationProgress {
  const raw = isRecord(value) ? value : {};
  const lastLesson = typeof raw.lastLesson === 'string' && guidedIds.includes(raw.lastLesson) ? { lastLesson: raw.lastLesson } : {};
  const lessons = Object.fromEntries(guidedIds.flatMap(id => {
    const attempt = isRecord(raw.lessons) ? parseGuidedAttempt(id, raw.lessons[id]) : undefined;
    return attempt ? [[id, attempt]] : [];
  }));
  return {...lastLesson, lessons, last:missions.some(m=>m.id===raw.last) ? raw.last : 'C01', diagnostic:answers(raw.diagnostic,diagnostic.map(q=>q.options.length)),attempts:mapValues(raw.attempts,k=>missions.some(m=>m.id===k),v=>{
    if(!isRecord(v)) return undefined;
    const a=freshAttempt(); a.step=Number.isInteger(v.step)&&v.step>=0&&v.step<4?v.step:0;
    a.reviewing=v.reviewing===true; a.answers=answers(v.answers,[3,3]); a.checked=v.checked===true; a.note=typeof v.note==='string'?v.note.slice(0,8000):'';
    a.checks=[0,1].map(i=>Array.isArray(v.checks)&&v.checks[i]===true);
    if(validDate(v.completedAt)) a.completedAt=v.completedAt;
    if(validDate(v.reviewedAt)) a.reviewedAt=v.reviewedAt;
    return a;
  })};
}
export const readFormation = () => parseFormation(readStored(formationKey));
export const saveFormation = (v:FormationProgress) => writeStored(formationKey,parseFormation(v),formationEvent);
export function suggestedMission(p:FormationProgress) { const gap=diagnostic.findIndex((q,i)=>p.diagnostic[i]!==q.correct);return missions[gap<0?0:gap]; }
export function canComplete(id:string,a:Attempt) {const m=missions.find(m=>m.id===id);return !!m&&a.checked&&m.questions.every((q,i)=>a.answers[i]===q.correct)&&a.checks.every(Boolean)&&a.checks.length===2;}
export function completeMission(p:FormationProgress,id:string,now=Date.now()) {const a=p.attempts[id];if(!a||!canComplete(id,a)||a.completedAt)return p;return {...p,attempts:{...p.attempts,[id]:{...a,completedAt:new Date(now).toISOString()}}};}
export function dueMissions(p:FormationProgress,now=Date.now()) { return missions.filter(m=>{const a=p.attempts[m.id];return a?.completedAt&&now-Date.parse(a.reviewedAt||a.completedAt)>=7*86400000;}); }
