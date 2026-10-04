import { moduleProgressKey, parseModuleProgress, readModuleProgress } from './moduleProgress';
import { labKey, parseLabProgress, readLabProgress } from './labProgress';
import { practiceKey, parsePractice, readPractice } from './learningPractice';
import { draftKey, parseDrafts, readDrafts } from './practiceDrafts';
import { focusKey, parseFocus, readFocus } from './focusSession';
import { isRecord, validDate, writeStored } from './studyStorage';

export type Backup = { format: 'curva-aberta'; version: 1; exportedAt: string; data: Record<string, unknown> };
const parsers: Record<string, (value: unknown) => unknown> = {
  [moduleProgressKey]: parseModuleProgress, [labKey]: parseLabProgress,
  [practiceKey]: parsePractice, [draftKey]: parseDrafts, [focusKey]: parseFocus
};
export function makeBackup(): Backup {
  return { format: 'curva-aberta', version: 1, exportedAt: new Date().toISOString(), data: {
    [moduleProgressKey]: readModuleProgress(), [labKey]: readLabProgress(),
    [practiceKey]: readPractice(), [draftKey]: readDrafts(), [focusKey]: readFocus()
  } };
}
export function parseBackup(text: string): Backup {
  if (text.length > 2_000_000) throw new Error('O arquivo supera o limite de 2 MB.');
  const value: unknown = JSON.parse(text);
  if (!isRecord(value) || value.format !== 'curva-aberta' || value.version !== 1 || !validDate(value.exportedAt) || !isRecord(value.data)) throw new Error('Este arquivo não é um backup compatível da Curva Aberta.');
  const entries = Object.entries(value.data);
  if (!entries.length || entries.some(([key, item]) => !parsers[key] || (key === focusKey ? item !== null && !parseFocus(item) : !isRecord(item)))) throw new Error('O backup contém uma seção desconhecida ou inválida.');
  const data = Object.fromEntries(entries.map(([key, item]) => [key, parsers[key](item)]));
  // Reject malformed values instead of silently discarding evidence from an import.
  for (const [key, raw] of entries) {
    if (raw === null) continue;
    const cleaned = data[key] as Record<string, unknown>;
    if (key === practiceKey || key === draftKey) {
      if (Object.keys(raw as object).length !== Object.keys(cleaned).length) throw new Error('Há registros inválidos no backup. Nenhum dado foi alterado.');
    } else if (key !== focusKey) {
      for (const [field, values] of Object.entries(raw as object)) {
        if (Array.isArray(values) && values.length !== (cleaned[field] as unknown[] | undefined)?.length) throw new Error('Há IDs inválidos ou repetidos no backup.');
        if (isRecord(values) && Object.keys(values).some(id => !Object.hasOwn(cleaned[field] as object || {}, id))) throw new Error('Há valores inválidos no backup.');
      }
    }
  }
  return { format: 'curva-aberta', version: 1, exportedAt: value.exportedAt, data };
}
export function mergeSection(key: string, current: unknown, incoming: unknown, preferIncoming: boolean): unknown {
  if (key === focusKey) {
    const value = parseFocus(preferIncoming ? incoming ?? current : current ?? incoming);
    return value ? { ...value, remaining: value.endsAt === null ? value.remaining : Math.max(0, Math.ceil((value.endsAt - Date.now()) / 1000)), endsAt: null } : null;
  }
  const firstValue = preferIncoming ? current : incoming; const secondValue = preferIncoming ? incoming : current;
  const first = isRecord(firstValue) ? firstValue : {}; const second = isRecord(secondValue) ? secondValue : {};
  const merged: Record<string, unknown> = { ...first, ...second };
  if (key === moduleProgressKey || key === labKey) {
    for (const field of ['done', 'passed']) merged[field] = [...new Set([...(first[field] || []), ...(second[field] || [])])];
    for (const field of ['checks', 'completedAt', 'reviews', 'drafts', 'lastByModule']) {
      if (field === 'lastByModule' && key === labKey) continue;
      merged[field] = { ...first[field], ...second[field] };
    }
    // Reopening a criterion wins over stale completed markers.
    merged.done = (merged.done as string[]).filter(id => !Object.entries(merged.checks as object).some(([check, value]) => check.startsWith(`${id}-`) && value === false));
  }
  return parsers[key](merged);
}
export function backupSummary(backup: Backup) {
  const module = parseModuleProgress(backup.data[moduleProgressKey]); const lab = parseLabProgress(backup.data[labKey]);
  return { deliveries: module.done.length + lab.done.length, evidence: Object.keys(module.drafts).length + Object.keys(lab.drafts).length, attempts: Object.keys(parsePractice(backup.data[practiceKey])).length, drafts: Object.keys(parseDrafts(backup.data[draftKey])).length };
}
export function restoreBackup(backup: Backup, preferIncoming: boolean) {
  const before = makeBackup();
  // Keep a recovery point. If durable storage is blocked, do not claim an import was saved.
  if (!writeStored('curva-aberta-backup-recovery-v1', before, 'curva-aberta-backup-recovery')) throw new Error('Não foi possível guardar uma cópia de segurança. Exporte seu progresso e libere o armazenamento antes de importar.');
  const values = Object.entries(backup.data).map(([key, incoming]) => [key, mergeSection(key, before.data[key], incoming, preferIncoming)] as const);
  const saved = values.map(([key, value]) => writeStored(key, value));
  window.dispatchEvent(new Event('curva-aberta-practice-change'));
  window.dispatchEvent(new Event('curva-aberta-backup-restored'));
  return saved.every(Boolean);
}
