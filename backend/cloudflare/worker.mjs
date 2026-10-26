// Public study notes. No identity or content history is recorded by this app.
export const LIMIT = 50000;
const MAX_BODY = 600100; // Also admits JSON with every Unicode code point escaped.
const PATH = '/rest/v1/shared_study_notes';
const COLUMNS = 'scope, content, revision, updated_at';

async function jsonBody(request) {
  const reader = request.body?.getReader();
  if (!reader) throw new Error('body');
  const chunks = []; let length = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    length += value.byteLength;
    if (length > MAX_BODY) { await reader.cancel(); throw new Error('size'); }
    chunks.push(value);
  }
  const bytes = new Uint8Array(length); let offset = 0;
  for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.length; }
  return JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(bytes));
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin');
    const allowed = env.ALLOWED_ORIGIN || 'https://hills808.github.io';
    const headers = { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', Vary: 'Origin', 'X-Content-Type-Options': 'nosniff' };
    if (origin === allowed) headers['Access-Control-Allow-Origin'] = allowed;
    const reply = (status, value, extra = {}) => new Response(JSON.stringify(value), { status, headers: { ...headers, ...extra } });
    const error = (status, code, message) => reply(status, { code, message });
    if (origin && origin !== allowed) return error(403, 'ORIGIN', 'Origin not allowed');
    const url = new URL(request.url);
    if (url.pathname === '/health' && request.method === 'GET') {
      try {
        const row = await env.DB.prepare('SELECT count(*) AS blocks FROM shared_study_notes').bind().first();
        return reply(row.blocks === 59 ? 200 : 503, { ready: row.blocks === 59, writesEnabled: env.WRITES_ENABLED === 'true' });
      } catch { return error(503, 'UNAVAILABLE', 'Database unavailable'); }
    }
    if (url.pathname !== PATH) return error(404, 'NOT_FOUND', 'Not found');
    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: { ...headers, 'Access-Control-Allow-Methods': 'GET, PATCH, OPTIONS', 'Access-Control-Allow-Headers': 'content-type, x-curva-revision, apikey, prefer', 'Access-Control-Max-Age': '3600' } });
    if (!['GET', 'PATCH'].includes(request.method)) return reply(405, { code: 'METHOD' }, { Allow: 'GET, PATCH, OPTIONS' });
    const scopeFilter = url.searchParams.get('scope') || '';
    if (!/^eq\.[a-z0-9-]+$/.test(scopeFilter) || scopeFilter.length > 80) return error(400, 'SCOPE', 'One scope is required');
    const scope = scopeFilter.slice(3);
    try {
      if (request.method === 'GET') {
        const row = await env.DB.prepare(`SELECT ${COLUMNS} FROM shared_study_notes WHERE scope = ?1`).bind(scope).first();
        return row ? reply(200, [row]) : error(404, 'SCOPE', 'Unknown scope');
      }
      // Disabled until content migration and validation finish. Fail closed.
      if (env.WRITES_ENABLED !== 'true') return error(503, 'MAINTENANCE', 'Notes are being migrated');
      if (request.headers.get('Content-Type')?.split(';')[0].trim() !== 'application/json') return error(415, 'JSON', 'JSON required');
      const expected = request.headers.get('x-curva-revision') || '';
      if (!/^(0|[1-9]\d*)$/.test(expected) || !Number.isSafeInteger(Number(expected)) || url.searchParams.get('revision') !== `eq.${expected}`) return error(400, 'REVISION', 'Expected revision required');
      let body;
      try { body = await jsonBody(request); }
      catch (e) { return error(e.message === 'size' ? 413 : 400, 'JSON', 'Invalid request body'); }
      if (!body || Object.keys(body).length !== 1 || typeof body.content !== 'string') return error(400, 'CONTENT', 'Only content may be edited');
      const content = body.content;
      // SQLite length() stops at NUL. Reject it, and malformed surrogate sequences.
      if (content.includes('\0') || new TextDecoder().decode(new TextEncoder().encode(content)) !== content) return error(400, 'CONTENT', 'Invalid Unicode text');
      if (Array.from(content).length > LIMIT) return error(413, 'LIMIT', 'O limite é 50.000 caracteres.');
      // Revision and cooldown are checked within the same atomic UPDATE.
      const row = await env.DB.prepare(`UPDATE shared_study_notes SET content = ?1, revision = revision + 1, updated_at = strftime('%Y-%m-%dT%H:%M:%fZ','now') WHERE scope = ?2 AND revision = ?3 AND (updated_at IS NULL OR julianday(updated_at) <= julianday('now') - 3.0/86400) RETURNING ${COLUMNS}`).bind(content, scope, Number(expected)).first();
      if (row) return reply(200, [row]);
      const current = await env.DB.prepare('SELECT revision FROM shared_study_notes WHERE scope = ?1').bind(scope).first();
      if (!current) return error(404, 'SCOPE', 'Unknown scope');
      return Number(current.revision) !== Number(expected) ? error(409, 'PT409', 'Revision mismatch') : error(429, 'PT429', 'Wait three seconds');
    } catch {
      // Do not log note contents or return database internals to clients.
      return error(503, 'UNAVAILABLE', 'Shared notes temporarily unavailable');
    }
  },
};
