import { mapValues, readStored, writeStored, isRecord, validDate } from './studyStorage';
import counts from './data/module-question-counts.json';
export type ModuleProgress = {
  done: string[];
  checks: Record<string, boolean>;
  completedAt: Record<string, string>;
  reviews: Record<string, boolean>;
  lastByModule: Record<string, number>;
  passed: string[];
  drafts: Record<string, string>;
  lastModule?: number;
};

export const moduleProgressKey = "curva-aberta-module-progress-v1";
const empty: ModuleProgress = { done: [], checks: {}, completedAt: {}, reviews: {}, lastByModule: {}, passed: [], drafts: {} };

const stageKey = (key: string) => /^[0-8]-[0-4]$/.test(key);
export function parseModuleProgress(value: unknown): ModuleProgress {
  if (!isRecord(value)) return { ...empty };
  const ids = (list: unknown, valid: (key: string) => boolean) => Array.isArray(list) ? [...new Set<string>(list.filter((v): v is string => typeof v === 'string' && valid(v)))] : [];
  return {
    done: ids(value.done, stageKey),
    checks: mapValues(value.checks, key => /^[0-8]-[0-4]-\d{1,2}$/.test(key), value => typeof value === 'boolean' ? value : undefined),
    completedAt: mapValues(value.completedAt, stageKey, value => validDate(value) ? value : undefined),
    reviews: mapValues(value.reviews, stageKey, value => typeof value === 'boolean' ? value : undefined),
    lastByModule: mapValues(value.lastByModule, key => /^[0-8]$/.test(key), value => Number.isInteger(value) && Number(value) >= 0 && Number(value) < 5 ? Number(value) : undefined),
    passed: ids(value.passed, key => {
      const match = /^mod-([0-8])-([0-4])-(\d+)$/.exec(key);
      return !!match && Number(match[3]) < (counts[match[1] as keyof typeof counts]?.[Number(match[2])] ?? 0);
    }),
    drafts: mapValues(value.drafts, stageKey, value => typeof value === 'string' ? value.slice(0, 1200) : undefined),
    lastModule: Number.isInteger(value.lastModule) && value.lastModule >= 0 && value.lastModule <= 8 ? value.lastModule : undefined
  };
}
export function readModuleProgress(): ModuleProgress {
  const value = readStored(moduleProgressKey);
  if (isRecord(value)) return parseModuleProgress(value);
  const older = readStored('curva-aberta-progress') ?? readStored('atlas-study-progress');
  return parseModuleProgress({ done: older });
}
export function saveModuleProgress(value: ModuleProgress) {
  return writeStored(moduleProgressKey, parseModuleProgress(value));
}

export function isStageVerified(value: ModuleProgress, moduleId: number, stage: number) {
  const count = counts[String(moduleId) as keyof typeof counts]?.[stage];
  return Boolean(count && value.done.includes(`${moduleId}-${stage}`) && Array.from({ length: count }, (_, i) => value.passed.includes(`mod-${moduleId}-${stage}-${i}`)).every(Boolean));
}
