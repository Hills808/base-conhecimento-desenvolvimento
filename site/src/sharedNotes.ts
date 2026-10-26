import config from './notes-config.json';
// One active backend only: automatic write failover would split shared content.
export const NOTES_URL = config.url;
const publicHeaders: Record<string, string> = config.provider === 'supabase' ? { apikey: config.publishableKey } : {};
export const NOTE_LIMIT = 50000;
export type SharedNote = { scope: string; content: string; revision: number; updated_at: string | null };
export const noteLength = (text: string) => Array.from(text).length;
export class NoteError extends Error { constructor(public kind: 'conflict' | 'network' | 'limit' | 'rate', message: string) { super(message); } }
export async function readNote(scope: string, signal?: AbortSignal): Promise<SharedNote> {
  let response: Response;
  try { response = await fetch(`${NOTES_URL}?scope=eq.${encodeURIComponent(scope)}&select=scope,content,revision,updated_at`, { headers: publicHeaders, signal: signal ? AbortSignal.any([signal, AbortSignal.timeout(12000)]) : AbortSignal.timeout(12000), cache: 'no-store' }); }
  catch (error) { if (signal?.aborted) throw error; throw new NoteError('network', 'O serviço de anotações está indisponível ou sem conexão. Tente novamente em alguns instantes.'); }
  if (response.status >= 500) throw new NoteError('network', 'O serviço de anotações está temporariamente indisponível. Tente novamente em alguns instantes.');
  if (!response.ok) throw new NoteError('network', 'Não foi possível carregar o bloco. Tente atualizar.');
  const rows = await response.json();
  if (!Array.isArray(rows) || rows.length !== 1 || typeof rows[0].content !== 'string' || !Number.isSafeInteger(rows[0].revision)) throw new NoteError('network', 'Bloco indisponível nesta etapa.');
  return rows[0];
}
export async function writeNote(scope: string, content: string, revision: number): Promise<SharedNote> {
  if (noteLength(content) > NOTE_LIMIT) throw new NoteError('limit', 'O limite é 50.000 caracteres.');
  let response: Response;
  try { response = await fetch(`${NOTES_URL}?scope=eq.${encodeURIComponent(scope)}&revision=eq.${revision}`, {
    method: 'PATCH', signal: AbortSignal.timeout(12000), headers: { ...publicHeaders, 'Content-Type': 'application/json', Prefer: 'return=representation', 'x-curva-revision': String(revision) }, body: JSON.stringify({ content })
  }); } catch { throw new NoteError('network', 'Sem conexão. O texto continua no editor; não foi publicado.'); }
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    if (error.code === 'PT429') throw new NoteError('rate', 'Aguarde alguns segundos antes de publicar novamente.');
    if (error.code === 'PT409') throw new NoteError('conflict', 'Outra pessoa alterou este bloco. Confira o texto atual antes de publicar.');
    if (error.code === 'LIMIT') throw new NoteError('limit', 'O limite é 50.000 caracteres.');
    if (response.status >= 500) throw new NoteError('network', 'O serviço de anotações está temporariamente indisponível. Seu texto continua no editor; confira o bloco antes de tentar novamente.');
    throw new NoteError('network', 'A publicação não foi confirmada. Atualize o bloco antes de tentar novamente.');
  }
  const rows = await response.json();
  if (!Array.isArray(rows) || rows.length !== 1) throw new NoteError('conflict', 'Outra pessoa alterou este bloco. Confira o texto atual antes de publicar.');
  return rows[0];
}
