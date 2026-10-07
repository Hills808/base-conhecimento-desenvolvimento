import { useEffect, useId, useRef, useState } from 'react';
import { NOTE_LIMIT, noteLength, NoteError, readNote, writeNote, type SharedNote } from './sharedNotes';
import './shared-notes.css';

export default function SharedNotes({ scope }: { scope: string }) {
  const label = useId();
  const [open, setOpen] = useState(false);
  const [note, setNote] = useState<SharedNote | null>(null);
  const [draft, setDraft] = useState('');
  const [editing, setEditing] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [conflict, setConflict] = useState<SharedNote | null>(null);
  const [deleting, setDeleting] = useState(false);
  const generation = useRef(0);
  const dirty = editing && draft !== note?.content;
  useEffect(() => {
    if (!open) return;
    const controller = new AbortController();
    const current = ++generation.current;
    setMessage('Carregando bloco compartilhado…');
    readNote(scope, controller.signal).then(value => { if (current === generation.current) { setNote(value); setMessage(''); } }).catch(error => { if (!controller.signal.aborted) setMessage(error.message); });
    return () => { controller.abort(); generation.current++; };
  }, [open, scope]);
  useEffect(() => {
    if (!dirty) return;
    const warn = (event: BeforeUnloadEvent) => { event.preventDefault(); event.returnValue = ''; };
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [dirty]);
  useEffect(() => {
    if (!open || editing || !note) return;
    const refresh = () => { if (document.visibilityState === 'visible') readNote(scope).then(setNote).catch(() => {}); };
    const timer = window.setInterval(refresh, 20000);
    window.addEventListener('focus', refresh);
    return () => { clearInterval(timer); window.removeEventListener('focus', refresh); };
  }, [open, editing, scope, !!note]);
  async function refresh() {
    setBusy(true);
    try { const value = await readNote(scope); if (editing) setConflict(value); else setNote(value); setMessage(editing ? 'Seu texto foi preservado. Confira a versão publicada abaixo.' : 'Bloco atualizado.'); }
    catch (error) { setMessage((error as Error).message); }
    finally { setBusy(false); }
  }
  async function publish(content: string) {
    if (!note) return;
    setBusy(true); setDeleting(false);
    try { const value = await writeNote(scope, content, note.revision); setNote(value); setDraft(value.content); setEditing(false); setConflict(null); setMessage(content ? 'Publicado para todos.' : 'Conteúdo apagado para todos.'); }
    catch (error) { setMessage((error as Error).message); if (error instanceof NoteError && error.kind === 'conflict') { try { setConflict(await readNote(scope)); } catch { /* Preserve the unsaved editor. */ } } }
    finally { setBusy(false); }
  }
  return <details className="shared-notes" open={open} onToggle={event => setOpen(event.currentTarget.open)}>
    <summary>Anotações compartilhadas</summary>
    {open ? <div className="shared-notes-body">
      <p>Um bloco desta etapa para todos. Qualquer visitante pode adicionar, editar ou apagar. Sem login e sem histórico. Não publique dados pessoais, segredos ou informações internas.</p>
      <p className="shared-notes-status" role="status">{message}</p>
      {note ? <>
        {!editing ? <><div className="shared-notes-text">{note.content || 'Ainda não há anotações. Compartilhe um conceito, uma dúvida ou o resultado de um teste.'}</div>
          <div className="shared-notes-actions"><button type="button" onClick={() => { setDraft(note.content); setEditing(true); setConflict(null); setMessage('Alterações só ficam públicas quando você publica. Copie seu texto antes de sair da etapa.'); }}>{note.content ? 'Editar bloco' : 'Adicionar anotação'}</button><button type="button" disabled={busy} onClick={refresh}>Atualizar bloco</button></div>
        </> : <>
          <label htmlFor={label}>Texto compartilhado desta etapa</label>
          <textarea id={label} value={draft} disabled={busy} onChange={event => setDraft(event.target.value)} aria-describedby={`${label}-count`} rows={10}/>
          <p id={`${label}-count`}>{noteLength(draft).toLocaleString('pt-BR')} / 30.000 caracteres. Texto simples; código e quebras de linha são preservados.</p>
          {conflict ? <div className="shared-notes-conflict"><p>O bloco mudou. Seu rascunho não foi apagado. Compare e ajuste seu texto antes de usar a versão atual como base.</p><pre>{conflict.content || '(Bloco vazio)'}</pre><button type="button" disabled={busy} onClick={() => { setNote(conflict); setConflict(null); setMessage('Base atualizada. Seu rascunho foi mantido; confira antes de publicar.'); }}>Usar versão atual como base</button></div> : null}
          <div className="shared-notes-actions"><button type="button" disabled={busy || !!conflict || noteLength(draft) > NOTE_LIMIT || !draft.trim() || !dirty} onClick={() => publish(draft)}>{busy ? 'Publicando…' : 'Publicar para todos'}</button><button type="button" disabled={busy} onClick={refresh}>Conferir texto atual</button><button type="button" disabled={busy} onClick={() => { setEditing(false); setConflict(null); setDraft(note.content); setMessage('Edição cancelada. Nada foi publicado.'); }}>Cancelar edição</button></div>
        </>}
        {note.content ? <div className="shared-notes-delete">{deleting ? <><p>Apagar todo o conteúdo deste bloco para todos? Não há recuperação.</p><button type="button" disabled={busy || !!conflict} onClick={() => publish('')}>Confirmar: apagar para todos</button><button type="button" onClick={() => setDeleting(false)}>Não apagar</button></> : <button type="button" disabled={busy || dirty} onClick={() => setDeleting(true)}>Apagar para todos</button>}</div> : null}
      </> : <button type="button" disabled={busy} onClick={refresh}>Tentar carregar novamente</button>}
      <small>Precisa de internet. A leitura é atualizada a cada 20 segundos enquanto o bloco está aberto e você não está editando. Estas notas públicas não fazem parte do backup pessoal.</small>
    </div> : null}
  </details>;
}
