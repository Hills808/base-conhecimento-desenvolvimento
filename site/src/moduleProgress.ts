export type ModuleProgress = {
  done: string[];
  checks: Record<string, boolean>;
  completedAt: Record<string, string>;
  reviews: Record<string, boolean>;
  lastByModule: Record<string, number>;
};

export const moduleProgressKey = "curva-aberta-module-progress-v1";
const empty: ModuleProgress = { done: [], checks: {}, completedAt: {}, reviews: {}, lastByModule: {} };

export function readModuleProgress(): ModuleProgress {
  try {
    const value = JSON.parse(localStorage.getItem(moduleProgressKey) || "null");
    if (value && typeof value === "object") {
      return {
        done: Array.isArray(value.done) ? value.done.filter((item: unknown): item is string => typeof item === "string" && /^[0-8]-[0-2]$/.test(item)) : [],
        checks: value.checks && typeof value.checks === "object" ? value.checks : {},
        completedAt: value.completedAt && typeof value.completedAt === "object" ? value.completedAt : {},
        reviews: value.reviews && typeof value.reviews === "object" ? value.reviews : {},
        lastByModule: value.lastByModule && typeof value.lastByModule === "object" ? value.lastByModule : {}
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
