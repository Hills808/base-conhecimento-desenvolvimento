// One-time transfer only. Run from this directory; never commit migration-data/.
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
import { createHash } from 'node:crypto';
const directory = fileURLToPath(new URL('.', import.meta.url));
const schema = await readFile(new URL('./migrations/0001_shared_notes.sql', import.meta.url), 'utf8');
const scopes = [...schema.matchAll(/\('([a-z0-9-]+)'\)/g)].map(match => match[1]).sort();
const configFile = new URL('../../site/src/notes-config.json', import.meta.url);
const originalURL = 'https://mfpfqzduzywmfmekbiho.supabase.co/rest/v1/shared_study_notes';
const key = 'sb_publishable_yMmNLcmmnCo4mhhQE3E1Xw_N28OSFQY';
const snapshotFile = resolve(directory, 'migration-data/notes.json');
const same = (a, b) => ['scope', 'content', 'revision', 'updated_at'].every(key => a[key] === b[key]);
export function validate(rows) {
  if (!Array.isArray(rows) || rows.length !== 59 || JSON.stringify(rows.map(row => row.scope).sort()) !== JSON.stringify(scopes)) throw Error('Expected exactly the 59 known scopes');
  for (const row of rows) {
    if (typeof row.content !== 'string' || Array.from(row.content).length > 50000 || row.content.includes('\0') || !row.content.isWellFormed() || !Number.isSafeInteger(row.revision) || row.revision < 0 || !(row.updated_at === null || (typeof row.updated_at === 'string' && Number.isFinite(Date.parse(row.updated_at))))) throw Error('Invalid note data');
  }
  return rows.sort((a, b) => a.scope.localeCompare(b.scope));
}
async function json(url, options = {}) {
  const response = await fetch(url, { ...options, signal: AbortSignal.timeout(30000), cache: 'no-store' });
  if (!response.ok) throw Error(`Remote request failed (HTTP ${response.status}); no content was printed`);
  return response.json();
}
async function source() { return validate(await json(`${originalURL}?select=scope,content,revision,updated_at&order=scope&limit=1000`, { headers: { apikey: key } })); }
async function snapshot() { return validate(JSON.parse(await readFile(snapshotFile, 'utf8'))); }
function endpoint(value) {
  const url = new URL(value);
  if (url.protocol !== 'https:' || url.username || url.password || url.search || url.hash || url.pathname !== '/rest/v1/shared_study_notes') throw Error('Expected HTTPS Worker notes endpoint');
  return url;
}
async function verify(target, rows) {
  for (let offset = 0; offset < rows.length; offset += 6) {
    await Promise.all(rows.slice(offset, offset + 6).map(async row => {
      const data = await json(`${target}?scope=eq.${encodeURIComponent(row.scope)}`);
      if (data.length !== 1 || !same(row, data[0])) throw Error(`Content/revision/timestamp mismatch for ${row.scope}`);
    }));
  }
  console.log('Verified all 59 contents, revisions and timestamps; no text was printed.');
}
async function main() {
  const [command, target] = process.argv.slice(2);
  if (command === 'export') {
    const rows = await source();
    await mkdir(resolve(directory, 'migration-data'), { recursive: true, mode: 0o700 });
    await writeFile(snapshotFile, JSON.stringify(rows), { mode: 0o600 });
    console.log(`Exported 59 blocks. SHA-256: ${createHash('sha256').update(JSON.stringify(rows)).digest('hex')}. Freeze writes and export again immediately before import.`);
    return;
  }
  const url = endpoint(target);
  const rows = await snapshot();
  if (command === 'import') {
    if (!process.argv.includes('--source-frozen')) throw Error('Freeze source writes first; --source-frozen is required');
    const current = await source();
    if (!rows.every((row, i) => same(row, current[i]))) throw Error('Source changed after export; export again');
    const health = await json(new URL('/health', url));
    if (!health.ready || health.writesEnabled) throw Error('Target must be seeded and have public writes disabled');
    const account = process.env.CLOUDFLARE_ACCOUNT_ID;
    const database = process.env.CLOUDFLARE_DATABASE_ID;
    const token = process.env.CLOUDFLARE_API_TOKEN;
    if (!account || !database || !token || !/^[a-f0-9]{32}$/.test(account) || !/^[a-f0-9-]{36}$/.test(database)) throw Error('Set Cloudflare account/database IDs and API token in the environment, never in source');
    for (const row of rows) {
      const existing = await json(`${url}?scope=eq.${row.scope}`);
      if (same(existing[0] || {}, row)) continue; // Safe resume after an interrupted import.
      const result = await json(`https://api.cloudflare.com/client/v4/accounts/${account}/d1/database/${database}/query`, { method: 'POST', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ sql: "UPDATE shared_study_notes SET content = ?1, revision = ?2, updated_at = ?3 WHERE scope = ?4 AND content = '' AND revision = 0 AND updated_at IS NULL RETURNING scope", params: [row.content, row.revision, row.updated_at, row.scope] }) });
      if (!result.success || result.result?.[0]?.results?.length !== 1) throw Error(`Target is not empty or import failed at ${row.scope}; existing text was not overwritten`);
    }
    await verify(url, rows);
  } else if (command === 'verify' || command === 'activate') {
    await verify(url, rows);
    if (command === 'activate') {
      const health = await json(new URL('/health', url));
      if (!health.ready || !health.writesEnabled) throw Error('Enable target writes and verify health before activation');
      await writeFile(configFile, JSON.stringify({ provider: 'cloudflare', url: url.href, publishableKey: '' }, null, 2) + '\n');
      console.log('Frontend configuration updated locally. Run tests/build, commit and deploy Pages.');
    }
  } else throw Error('Use export, import <endpoint> --source-frozen, verify <endpoint>, or activate <endpoint>');
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main().catch(error => { console.error(error.message); process.exitCode = 1; });
