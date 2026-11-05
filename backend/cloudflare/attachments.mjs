// Independent attachment storage. The existing notes API never depends on this feature.
const PATH = '/attachments';
const MAX = 5 * 1024 * 1024;
const LIMIT = 5;
const names = { pdf: 'application/pdf', docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', md: 'text/markdown', txt: 'text/plain' };

async function authorized(request, secret) {
  if (typeof secret !== 'string' || secret.length < 32) return false;
  const supplied = request.headers.get('authorization') || '';
  const expected = `Bearer ${secret}`;
  const digest = async value => new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value)));
  const [a, b] = await Promise.all([digest(supplied), digest(expected)]);
  let difference = 0;
  for (let i = 0; i < a.length; i++) difference |= a[i] ^ b[i];
  return difference === 0;
}
async function readLimited(request) {
  const reader = request.body?.getReader();
  if (!reader) throw new Error('empty');
  const chunks = []; let total = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    total += value.byteLength;
    if (total > MAX) { await reader.cancel(); throw new Error('size'); }
    chunks.push(value);
  }
  const bytes = new Uint8Array(total); let offset = 0;
  for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.length; }
  return bytes;
}
function validFile(bytes, ext) {
  if (!bytes.length) return false;
  if (ext === 'pdf') return new TextDecoder().decode(bytes.subarray(0, 5)) === '%PDF-';
  if (ext === 'docx') return bytes[0] === 0x50 && bytes[1] === 0x4b && bytes[2] === 0x03 && bytes[3] === 0x04;
  try { return !new TextDecoder('utf-8', { fatal: true }).decode(bytes).includes('\0'); } catch { return false; }
}
export async function attachments(request, env, headers) {
  const url = new URL(request.url);
  if (url.pathname !== PATH) return null;
  const reply = (status, data) => new Response(JSON.stringify(data), { status, headers });
  if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: { ...headers, 'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS', 'Access-Control-Allow-Headers': 'authorization, content-type, x-file-name', 'Access-Control-Max-Age': '3600' } });
  if (!['GET', 'POST', 'DELETE'].includes(request.method)) return reply(405, { code: 'METHOD' });
  if (!env.ATTACHMENTS) return reply(503, { code: 'UNAVAILABLE' });
  const scope = url.searchParams.get('scope') || '';
  if (!/^[a-z0-9-]{1,77}$/.test(scope)) return reply(400, { code: 'SCOPE' });
  const slot = url.searchParams.get('slot');
  if (slot !== null && !/^[0-4]$/.test(slot)) return reply(400, { code: 'SLOT' });
  if (request.method !== 'GET' && !(await authorized(request, env.ATTACHMENTS_ADMIN_SECRET))) return reply(401, { code: 'UNAUTHORIZED' });
  try {
    const exists = await env.DB.prepare('SELECT scope FROM shared_study_notes WHERE scope = ?1').bind(scope).first();
    if (!exists) return reply(404, { code: 'SCOPE' });
    const prefix = `attachments/${scope}/`;
    if (request.method === 'GET' && slot === null) {
      const objects = await Promise.all(Array.from({ length: LIMIT }, (_, index) => env.ATTACHMENTS.head(prefix + index)));
      return reply(200, objects.flatMap((item, index) => item ? [{ slot: index, name: item.customMetadata.name, size: item.size }] : []));
    }
    if (request.method === 'GET') {
      const item = await env.ATTACHMENTS.get(prefix + slot);
      if (!item) return reply(404, { code: 'NOT_FOUND' });
      return new Response(item.body, { headers: { ...headers, 'Content-Type': 'application/octet-stream', 'Content-Disposition': `attachment; filename="download"; filename*=UTF-8''${encodeURIComponent(item.customMetadata.name).replace(/['()*]/g, c => '%' + c.charCodeAt(0).toString(16).toUpperCase())}`, 'Content-Security-Policy': "default-src 'none'; sandbox", 'X-Content-Type-Options': 'nosniff' } });
    }
    if (request.method === 'DELETE') {
      if (slot === null) return reply(400, { code: 'SLOT' });
      await env.ATTACHMENTS.delete(prefix + slot);
      return reply(200, { ok: true });
    }
    let name;
    try { name = decodeURIComponent(request.headers.get('x-file-name') || ''); } catch { return reply(400, { code: 'NAME' }); }
    if (!name || Array.from(name).length > 120 || /[\x00-\x1f\x7f/\\]/.test(name)) return reply(400, { code: 'NAME' });
    const ext = name.split('.').pop().toLowerCase();
    if (!Object.hasOwn(names, ext)) return reply(415, { code: 'TYPE' });
    if (Number(request.headers.get('content-length')) > MAX) return reply(413, { code: 'SIZE' });
    let bytes;
    try { bytes = await readLimited(request); } catch (error) { return reply(error.message === 'size' ? 413 : 400, { code: 'SIZE' }); }
    if (!validFile(bytes, ext)) return reply(415, { code: 'TYPE' });
    for (let i = 0; i < LIMIT; i++) {
      const saved = await env.ATTACHMENTS.put(prefix + i, bytes, { onlyIf: new Headers({ 'If-None-Match': '*' }), customMetadata: { name } });
      if (saved) return reply(201, { slot: i, name, size: bytes.length });
    }
    return reply(409, { code: 'FULL' });
  } catch { return reply(503, { code: 'UNAVAILABLE' }); }
}
