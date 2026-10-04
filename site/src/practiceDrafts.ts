import { isRecord, mapValues, readStored, writeStored, validDate } from './studyStorage';
export const draftKey = 'curva-aberta-practice-drafts-v1';
export type PracticeDraft = { answer: string; obstacle: string; updatedAt: string };
export function parseDrafts(value: unknown): Record<string, PracticeDraft> {
  return mapValues(value, key => /^(mod-[0-8]-[0-4]|lab-[a-z0-9-]+)$/.test(key), item => {
    if (!isRecord(item) || typeof item.answer !== 'string' || !validDate(item.updatedAt)) return undefined;
    return { answer: item.answer.slice(0, 2400), obstacle: ['concept', 'execution', 'contract', 'explanation'].includes(item.obstacle) ? item.obstacle : 'concept', updatedAt: item.updatedAt };
  });
}
export const readDrafts = () => parseDrafts(readStored(draftKey));
export function saveDraft(id: string, answer: string, obstacle: string) {
  return writeStored(draftKey, { ...readDrafts(), [id]: { answer, obstacle, updatedAt: new Date().toISOString() } }, 'curva-aberta-draft-change');
}
