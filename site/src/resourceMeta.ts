import evidence from './data/resource-evidence.json';
type ResourceLike = { url: string; type: string; section: string; note?: string };
type Editorial = { language: string; certificate: string; uses: string[]; levels: { module: number; level: number }[]; timeEstimate: string; source: string; verifiedAt: string | null };
const registry = evidence as Record<string, Editorial>;
export type ResourceMeta = { language: string; time: string; certificate: string; certificateStatus: 'indicated' | 'unknown'; use: string; levels: Editorial['levels']; estimatedMinutes: number | null; verifiedAt: string | null; source: string };
export function getResourceMeta(resource: ResourceLike): ResourceMeta {
  const row = registry[resource.url];
  const certificateStatus = row && !/não informado|sem certificado|não é requisito/i.test(row.certificate) ? 'indicated' : 'unknown';
  const numbers = row?.timeEstimate.match(/\d+/g)?.map(Number);
  const estimatedMinutes = row && /min/i.test(row.timeEstimate) && numbers?.length ? Math.max(...numbers) : null;
  return {
    language: row?.language ?? 'Idioma não verificado',
    time: row ? `Estimativa para estudar: ${row.timeEstimate}` : 'Duração não verificada',
    certificate: certificateStatus === 'indicated' ? `${row!.certificate} · confirme as condições na fonte` : 'Certificado não verificado',
    certificateStatus, use: resource.note ?? row?.uses[0] ?? resource.section,
    levels: row?.levels ?? [], estimatedMinutes, verifiedAt: row?.verifiedAt ?? null,
    source: row?.source ?? 'Catálogo de consulta; metadados pendentes'
  };
}
export type MaterialFilters = { language: string; time: string; certificate: string; level: string };
export function matchesMaterial(resource: ResourceLike & { module?: number }, filters: MaterialFilters) {
  const meta = getResourceMeta(resource);
  return (filters.language === 'all' || (filters.language === 'pt' ? meta.language.startsWith('Português') : filters.language === 'unknown' ? meta.language === 'Idioma não verificado' : meta.language.startsWith('Inglês')))
    && (filters.time === 'all' || (filters.time === 'unknown' ? meta.estimatedMinutes === null : meta.estimatedMinutes !== null && meta.estimatedMinutes <= Number(filters.time)))
    && (filters.certificate === 'all' || meta.certificateStatus === filters.certificate)
    && (filters.level === 'all' || meta.levels.some(item => item.level === Number(filters.level) && (resource.module === undefined || item.module === resource.module)));
}
