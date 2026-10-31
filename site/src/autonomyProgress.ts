import content from './data/autonomy.json';
import { isRecord, mapValues, readStored, validDate, writeStored } from './studyStorage';
export const autonomyKey = 'curva-aberta-autonomy-v1';
export const autonomyEvent = 'curva-aberta-autonomy-change';
export const stages = content.stages;
export type Evidence = {
  plan: string; build: string; explain: string; help: string; helpNote: string;
  checks: boolean[]; confidence: number; completedAt?: string; reviewDue?: string;
  reviewRound: number; reviewDraft: string; reviewBuild: string; reviewChecks: boolean[];
};
export type AutonomyProgress = { last: number; records: Record<string, Evidence> };
export function emptyEvidence(): Evidence { return { plan: '', build: '', explain: '', help: 'none', helpNote: '', checks: [false, false, false], confidence: 1, reviewRound: 0, reviewDraft: '', reviewBuild: '', reviewChecks: [false, false, false] }; }
function parseEvidence(value: unknown): Evidence | undefined {
  if (!isRecord(value)) return;
  const result = emptyEvidence();
  for (const key of ['plan', 'build', 'explain', 'helpNote', 'reviewDraft', 'reviewBuild'] as const) result[key] = typeof value[key] === 'string' ? value[key].slice(0, 8000) : '';
  for (const key of ['checks', 'reviewChecks'] as const) result[key] = [0, 1, 2].map(i => Array.isArray(value[key]) && value[key][i] === true);
  result.help = ['none', 'hint', 'ai', 'person'].includes(value.help) ? value.help : 'none';
  result.confidence = Number.isInteger(value.confidence) && value.confidence >= 1 && value.confidence <= 5 ? value.confidence : 1;
  result.reviewRound = Number.isInteger(value.reviewRound) && value.reviewRound >= 0 && value.reviewRound <= 4 ? value.reviewRound : 0;
  if (validDate(value.completedAt) && evidenceReady(result)) {
    result.completedAt = value.completedAt;
    result.reviewDue = validDate(value.reviewDue) ? value.reviewDue : new Date(Date.parse(value.completedAt) + 86400000).toISOString();
  }
  return result;
}
export function parseAutonomy(value: unknown): AutonomyProgress {
  const raw = isRecord(value) ? value : {};
  return { last: Number.isInteger(raw.last) && raw.last >= 0 && raw.last < stages.length ? raw.last : 0, records: mapValues(raw.records, key => stages.some(s => s.id === key), parseEvidence) };
}
export const readAutonomy = () => parseAutonomy(readStored(autonomyKey));
export const saveAutonomy = (value: AutonomyProgress) => writeStored(autonomyKey, parseAutonomy(value), autonomyEvent);
// Presence and self-assessment gates only; this never claims to grade meaning.
export function evidenceReady(record: Evidence) {
  return [record.plan, record.build, record.explain].every(text => text.trim().length >= 40) && record.checks.length === 3 && record.checks.every(Boolean) && (record.help === 'none' || record.helpNote.trim().length >= 20);
}
export const verifiedEvidence = (record?: Evidence) => Boolean(record?.completedAt && validDate(record.completedAt) && evidenceReady(record));
export function reviewDue(record: Evidence | undefined, now = Date.now()) { return verifiedEvidence(record) && Boolean(record?.reviewDue && Date.parse(record.reviewDue) <= now); }
export function canOpen(progress: AutonomyProgress, index: number, now = Date.now()) {
  return Number.isInteger(index) && index >= 0 && index < stages.length && stages.slice(0, index).every(stage => verifiedEvidence(progress.records[stage.id]) && !reviewDue(progress.records[stage.id], now));
}
export function completeStage(progress: AutonomyProgress, index: number, now = Date.now()): AutonomyProgress {
  const stage = stages[index], record = stage && progress.records[stage.id];
  if (!stage || !record || !canOpen(progress, index, now) || !evidenceReady(record) || verifiedEvidence(record)) return progress;
  return { ...progress, records: { ...progress.records, [stage.id]: { ...record, completedAt: new Date(now).toISOString(), reviewDue: new Date(now + 86400000).toISOString() } } };
}
export function completeReview(progress: AutonomyProgress, index: number, now = Date.now()): AutonomyProgress {
  const stage = stages[index], record = stage && progress.records[stage.id];
  if (!record || !reviewDue(record, now) || record.reviewDraft.trim().length < 40 || record.reviewBuild.trim().length < 40 || !record.reviewChecks.every(Boolean)) return progress;
  const round = Math.min(record.reviewRound + 1, 4), days = [1, 3, 7, 14, 30][round];
  return { ...progress, records: { ...progress.records, [stage.id]: { ...record, reviewRound: round, reviewDue: new Date(now + days * 86400000).toISOString(), reviewChecks: [false, false, false], reviewDraft: '', reviewBuild: '' } } };
}
