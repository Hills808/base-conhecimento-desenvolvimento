import curriculum from "./data/laboratory.json";
import { labCheckpoints } from "./data/lab-checkpoints";
import { isRecord, validDate, readStored, writeStored } from "./studyStorage";
const { steps } = curriculum;
export const labKey = "curva-aberta-laboratorio-v2";
export type LabProgress = { done: string[]; checks: Record<string, boolean>; passed: string[]; drafts: Record<string, string>; last: number; completedAt: Record<string, string>; reviews: Record<string, boolean> };
const empty: LabProgress = { done: [], checks: {}, passed: [], drafts: {}, last: 0, completedAt: {}, reviews: {} };
const validStep = (n: number) => Number.isInteger(n) && n >= 0 && n < steps.length;
export function parseLabProgress(raw: unknown): LabProgress {
  try {
    const value = raw;
    if (!isRecord(value)) return empty;
    const done = Array.isArray(value.done) ? [...new Set<string>(value.done.filter((id: unknown) => typeof id === "string" && steps.some(s => s.id === id)))] : [];
    const checks: Record<string, boolean> = {};
    steps.forEach(s => s.checks.forEach((_, i) => { checks[`${s.id}-${i}`] = value.checks?.[`${s.id}-${i}`] === true; }));
    const passed = Array.isArray(value.passed) ? [...new Set<string>(value.passed.filter((id: unknown) => typeof id === "string" && steps.some(s => labCheckpoints[s.id].some((_, i) => id === `${s.id}-${i}`))))] : [];
    const drafts: Record<string, string> = {};
    steps.forEach(s => { if (typeof value.drafts?.[s.id] === "string") drafts[s.id] = value.drafts[s.id].slice(0, 700); });
    const completedAt: Record<string, string> = {};
    const reviews: Record<string, boolean> = {};
    done.forEach(id => { if (validDate(value.completedAt?.[id])) completedAt[id] = value.completedAt[id]; if (value.reviews?.[id] === true) reviews[id] = true; });
    return { done, checks, passed, drafts, last: validStep(value.last) ? value.last : 0, completedAt, reviews };
  } catch { return empty; }
}

export const readLabProgress = () => parseLabProgress(readStored(labKey));
export const saveLabProgress = (next: LabProgress) => writeStored(labKey, parseLabProgress(next));
export const isLabVerified = (value: LabProgress, id: string) => value.done.includes(id) && labCheckpoints[id]?.every((_, i) => value.passed.includes(`${id}-${i}`)) && steps.find(s => s.id === id)?.checks.every((_, i) => value.checks[`${id}-${i}`]);
