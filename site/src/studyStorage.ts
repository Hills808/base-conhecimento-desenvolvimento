// A failed write remains available across routes during this visit.
const transient = new Map<string, unknown>();
const failedKeys = new Set<string>();
export const failedStorageKeys = () => [...failedKeys];
export const storageEvent = 'curva-aberta-storage-change';
export const isRecord = (value: unknown): value is Record<string, any> => value !== null && typeof value === 'object' && !Array.isArray(value);
export const validDate = (value: unknown): value is string => typeof value === 'string' && value.length <= 40 && Number.isFinite(Date.parse(value));
export function readStored(key: string): unknown {
  if (transient.has(key)) return transient.get(key);
  try { return JSON.parse(localStorage.getItem(key) || 'null'); } catch { return null; }
}
export function writeStored(key: string, value: unknown, event = 'curva-aberta-progress-change'): boolean {
  let persisted = false;
  try { localStorage.setItem(key, JSON.stringify(value)); transient.delete(key); persisted = true; }
  catch { transient.set(key, value); }
  if (persisted) failedKeys.delete(key); else failedKeys.add(key);
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(storageEvent, { detail: { key, persisted } }));
    window.dispatchEvent(new Event(event));
  }
  return persisted;
}
export function mapValues<T>(value: unknown, validKey: (key: string) => boolean, parse: (value: unknown) => T | undefined): Record<string, T> {
  if (!isRecord(value)) return {};
  return Object.fromEntries(Object.entries(value).flatMap(([key, item]) => {
    if (!validKey(key) || key === '__proto__' || key === 'constructor' || key === 'prototype') return [];
    const parsed = parse(item); return parsed === undefined ? [] : [[key, parsed]];
  }));
}
export function clearTransient(key: string) { transient.delete(key); }
if (typeof window !== 'undefined') window.addEventListener('storage', event => {
  if (event.key) transient.delete(event.key);
  else transient.clear();
});
