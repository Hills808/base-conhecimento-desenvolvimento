export type PracticeRecord = { id: string; title: string; module: number; stage: number; lab: boolean; answer: string; obstacle: string; rating: 'support' | 'independent' | 'again'; attempts: number; interval: number; due: string; last: string };
const key = 'curva-aberta-deliberate-practice-v1';
export function readPractice(): Record<string, PracticeRecord> {
  try { const data = JSON.parse(localStorage.getItem(key) || '{}');
    return Object.fromEntries(Object.entries(data).filter(([id, v]: [string, any]) => v && v.id === id && typeof v.title === 'string' && typeof v.answer === 'string' && Number.isFinite(Date.parse(v.due)) && Number.isInteger(v.module) && v.module >= 0 && v.module < 10 && Number.isInteger(v.stage) && v.stage >= 0 && v.stage < (v.lab ? 14 : 5) && Number.isInteger(v.interval) && v.interval >= 0 && v.interval <= 2)) as Record<string, PracticeRecord>;
  } catch { return {}; }
}
export function nextPractice(previous: PracticeRecord | undefined, now: Date, independent: boolean) {
  const dueNow = previous && now.getTime() >= Date.parse(previous.due);
  const interval = independent && previous && dueNow ? Math.min(previous.interval + 1, 2) : independent && previous ? previous.interval : 0;
  const days = [1, 7, 30][interval];
  const due = independent && previous && !dueNow ? previous.due : new Date(now.getTime() + days * 86400000).toISOString();
  return { interval, due };
}
export function savePractice(record: PracticeRecord) {
  try { localStorage.setItem(key, JSON.stringify({ ...readPractice(), [record.id]: record })); window.dispatchEvent(new Event('curva-aberta-practice-change')); return true; } catch { return false; }
}
