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

export function readModuleProgress(): ModuleProgress {
  try {
    const value = JSON.parse(localStorage.getItem(moduleProgressKey) || "null");
    if (value && typeof value === "object") {
      return {
        done: Array.isArray(value.done) ? [...new Set<string>(value.done.filter((item: unknown): item is string => typeof item === "string" && /^[0-8]-[0-4]$/.test(item)))] : [],
        checks: value.checks && typeof value.checks === "object" ? value.checks : {},
        completedAt: value.completedAt && typeof value.completedAt === "object" ? value.completedAt : {},
        reviews: value.reviews && typeof value.reviews === "object" ? value.reviews : {},
        lastByModule: value.lastByModule && typeof value.lastByModule === "object" ? value.lastByModule : {},
        passed: Array.isArray(value.passed) ? [...new Set<string>(value.passed.filter((item: unknown): item is string => typeof item === 'string' && /^mod-[0-8]-[0-4]-\d+$/.test(item)))] : [],
        drafts: value.drafts && typeof value.drafts === 'object' ? value.drafts : {},
        lastModule: Number.isInteger(value.lastModule) && value.lastModule >= 0 && value.lastModule <= 8 ? value.lastModule : undefined
      };
    }
    const older = JSON.parse(localStorage.getItem("curva-aberta-progress") || "[]");
    if (Array.isArray(older)) return { ...empty, done: older.filter((item): item is string => typeof item === "string" && /^[0-8]-[0-2]$/.test(item)) };
  } catch { /* Progress stays local and optional. */ }
  return empty;
}

export function saveModuleProgress(value: ModuleProgress) {
  try {
    localStorage.setItem(moduleProgressKey, JSON.stringify(value));
    window.dispatchEvent(new Event("curva-aberta-progress-change"));
  } catch { /* The lesson can still be used in this session. */ }
}

export function isStageVerified(value: ModuleProgress, moduleId: number, stage: number) {
  const count = counts[String(moduleId) as keyof typeof counts]?.[stage];
  return Boolean(count && value.done.includes(`${moduleId}-${stage}`) && Array.from({ length: count }, (_, i) => value.passed.includes(`mod-${moduleId}-${stage}-${i}`)).every(Boolean));
}
