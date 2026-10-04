import { isRecord, readStored } from './studyStorage';
export const focusKey = 'curva-aberta-focus-v1';
export const goalLimit = 140;
export type FocusSession = { mode: 'focus' | 'break'; duration: number; remaining: number; endsAt: number | null; goal: string; stepId: string; stepTitle: string };
export function parseFocus(value: unknown): FocusSession | null {
  if (!isRecord(value) || !Number.isFinite(value.duration) || value.duration < 1 || value.duration > 90 || typeof value.stepId !== 'string' || value.stepId.length > 100) return null;
  const duration = value.duration;
  return { mode: value.mode === 'break' ? 'break' : 'focus', duration,
    remaining: Number.isFinite(value.remaining) && value.remaining >= 0 && value.remaining <= 5400 ? Math.floor(value.remaining) : Math.round(duration * 60),
    endsAt: Number.isFinite(value.endsAt) && value.endsAt > 0 && value.endsAt <= Date.now() + 5_400_000 ? value.endsAt : null,
    goal: typeof value.goal === 'string' ? value.goal.slice(0, goalLimit) : '',
    stepId: value.stepId, stepTitle: typeof value.stepTitle === 'string' ? value.stepTitle.slice(0, 300) : '' };
}
export const readFocus = () => parseFocus(readStored(focusKey));
export const remainingSeconds = (endsAt: number | null, pausedSeconds: number, now: number) => endsAt === null ? pausedSeconds : Math.max(0, Math.ceil((endsAt - now) / 1000));
