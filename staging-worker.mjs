import worker from './backend/cloudflare/worker.mjs';

// Temporary preview-only diagnostic. The bound D1 is an isolated test database.
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    if (url.pathname !== '/_staging-check') return worker.fetch(request, env, ctx);
    if (request.method !== 'GET') return new Response('GET required', { status: 405 });
    const key = crypto.randomUUID() + crypto.randomUUID();
    const testEnv = { ...env, ATTACHMENTS_ADMIN_SECRET: key, WRITES_ENABLED: 'false' };
    const base = 'https://example.test/attachments?scope=mod-0-0';
    const api = (suffix, options = {}) => worker.fetch(new Request(base + suffix, options), testEnv, ctx);
    const headers = { authorization: 'Bearer ' + key };
    const upload = (name, body, token = key) => api('', { method: 'POST', headers: { authorization: 'Bearer ' + token, 'x-file-name': encodeURIComponent(name) }, body });
    const results = {};
    try {
      for (let i = 0; i < 5; i++) await api('&slot=' + i, { method: 'DELETE', headers });
      results.missingKey = (await upload('test.txt', 'test', '')).status;
      results.badKey = (await upload('test.txt', 'test', 'wrong')).status;
      results.invalidType = (await upload('test.exe', 'test')).status;
      results.originDenied = (await api('', { headers: { origin: 'https://example.invalid' } })).status;
      const bytes = new Uint8Array(5 * 1024 * 1024).fill(65);
      results.maxUpload = (await upload('teste-á.txt', bytes)).status;
      const downloaded = await api('&slot=0');
      results.downloadStatus = downloaded.status;
      results.downloadDisposition = downloaded.headers.get('content-disposition')?.startsWith('attachment;');
      const got = new Uint8Array(await downloaded.arrayBuffer());
      results.downloadSize = got.length;
      results.downloadMatch = got.length === bytes.length && got.every((b, i) => b === bytes[i]);
      results.oversize = (await upload('grande.txt', new Uint8Array(bytes.length + 1).fill(65))).status;
      const race = await Promise.all(Array.from({ length: 5 }, (_, i) => upload('teste' + i + '.txt', 'file ' + i)));
      results.concurrent = race.map(r => r.status).sort();
      results.unauthorizedDelete = (await api('&slot=0', { method: 'DELETE' })).status;
      results.delete = (await api('&slot=0', { method: 'DELETE', headers })).status;
      results.deletedDownload = (await api('&slot=0')).status;
      results.notesWrites = (await worker.fetch(new Request('https://example.test/health'), testEnv, ctx)).status;
    } catch (error) { results.error = String(error); }
    finally {
      results.cleanup = [];
      for (let i = 0; i < 5; i++) {
        try { results.cleanup.push((await api('&slot=' + i, { method: 'DELETE', headers })).status); }
        catch { results.cleanup.push('error'); }
      }
    }
    return Response.json(results, { headers: { 'cache-control': 'no-store' } });
  }
};
