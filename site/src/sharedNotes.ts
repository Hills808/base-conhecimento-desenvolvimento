// Publishable key only; permissions and validation are enforced in Postgres.
export const NOTES_URL = 'https://mfpfqzduzywmfmekbiho.supabase.co/rest/v1/shared_study_notes';
const KEY = 'sb_publishable_yMmNLcmmnCo4mhhQE3E1Xw_N28OSFQY';
export const NOTE_LIMIT = 10000;
export type SharedNote = { scope: string; content: string; revision: number; updated_at: string | null };
export const noteLength = (text: string) => Array.from(text).length;
export class NoteError extends Error { constructor(public kind: 'conflict' | 'network' | 'limit' | 'rate', message: string) { super(message); } }
export async function readNote(scope: string, signal?: AbortSignal): Promise<SharedNote> {
  const response = await fetch(`${NOTES_URL}?scope=eq.${encodeURIComponent(scope)}&select=scope,content,revision,updated_at`, { headers: { apikey: KEY }, signal: signal ? AbortSignal.any([signal, AbortSignal.timeout(12000)]) : AbortSignal.timeout(12000), cache: 'no-store' });
  if (!response.ok) throw new NoteError('network', 'Não foi possível carregar o bloco. Tente atualizar.');
  const rows = await response.json();
  if (!Array.isArray(rows) || rows.length !== 1 || typeof rows[0].content !== 'string' || !Number.isSafeInteger(rows[0].revision)) throw new NoteError('network', 'Bloco indisponível nesta etapa.');
  return rows[0];
}
export async function writeNote(scope: string, content: string, revision: number): Promise<SharedNote> {
  if (noteLength(content) > NOTE_LIMIT) throw new NoteError('limit', 'O limite é 10.000 caracteres.');
  let response: Response;
  try { response = await fetch(`${NOTES_URL}?scope=eq.${encodeURIComponent(scope)}&revision=eq.${revision}`, {
    method: 'PATCH', signal: AbortSignal.timeout(12000), headers: { apikey: KEY, 'Content-Type': 'application/json', Prefer: 'return=representation', 'x-curva-revision': String(revision) }, body: JSON.stringify({ content })
  }); } catch { throw new NoteError('network', 'Sem conexão. O texto continua no editor; não foi publicado.'); }
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    if (error.code === 'PT429') throw new NoteError('rate', 'Aguarde alguns segundos antes de publicar novamente.');
    if (error.code === 'PT409') throw new NoteError('conflict', 'Outra pessoa alterou este bloco. Confira o texto atual antes de publicar.');
    throw new NoteError('network', 'A publicação não foi confirmada. Atualize o bloco antes de tentar novamente.');
  }
  const rows = await response.json();
  if (!Array.isArray(rows) || rows.length !== 1) throw new NoteError('conflict', 'Outra pessoa alterou este bloco. Confira o texto atual antes de publicar.');
  return rows[0];
}
