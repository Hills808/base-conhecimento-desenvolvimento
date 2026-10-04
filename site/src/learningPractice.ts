import { isRecord, mapValues, readStored, writeStored, validDate } from './studyStorage';
export type PracticeRecord = { id: string; title: string; module: number; stage: number; lab: boolean; answer: string; obstacle: string; rating: 'support' | 'independent' | 'again'; attempts: number; interval: number; due: string; last: string };
export const practiceKey = 'curva-aberta-deliberate-practice-v1';
export function parsePractice(data: unknown): Record<string, PracticeRecord> {
  const result = mapValues(data, id => /^(mod-[0-8]-[0-4]|lab-[a-z0-9-]+)$/.test(id), v => {
    if (!isRecord(v) || typeof v.title !== 'string' || v.id === undefined || typeof v.answer !== 'string' || !validDate(v.due) || !validDate(v.last) || typeof v.lab !== 'boolean' || !Number.isInteger(v.module) || v.module < 0 || v.module > 9 || !Number.isInteger(v.stage) || v.stage < 0 || v.stage >= (v.lab ? 14 : 5) || !Number.isInteger(v.interval) || v.interval < 0 || v.interval > 2 || !['support', 'independent', 'again'].includes(v.rating) || !Number.isInteger(v.attempts) || v.attempts < 1 || v.attempts > 100000) return undefined;
    return { ...v, title: v.title.slice(0, 300), answer: v.answer.slice(0, 2400), obstacle: ['concept','execution','contract','explanation'].includes(v.obstacle) ? v.obstacle : 'concept' } as PracticeRecord;
  });
  return Object.fromEntries(Object.entries(result).filter(([id, value]) => id === value.id && (value.lab ? value.module === 9 : id === `mod-${value.module}-${value.stage}` && value.module < 9)));
}
export const readPractice = () => parsePractice(readStored(practiceKey));
export function nextPractice(previous: PracticeRecord | undefined, now: Date, independent: boolean) {
  const dueNow = previous && now.getTime() >= Date.parse(previous.due);
  const interval = independent && previous && dueNow ? Math.min(previous.interval + 1, 2) : independent && previous ? previous.interval : 0;
  const days = [1, 7, 30][interval];
  const due = independent && previous && !dueNow ? previous.due : new Date(now.getTime() + days * 86400000).toISOString();
  return { interval, due };
}
export function savePractice(record: PracticeRecord) {
  return writeStored(practiceKey, parsePractice({ ...readPractice(), [record.id]: record }), 'curva-aberta-practice-change');
}
