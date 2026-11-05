import { useCallback, useEffect, useId, useRef, useState, type FormEvent } from 'react';
import { NOTES_URL } from './sharedNotes';
import { watchAttachmentList } from './attachmentRefresh';

type Attachment = { slot: number; name: string; size: number };
const endpoint = new URL('/attachments', NOTES_URL).toString();

export default function Attachments({ scope }: { scope: string }) {
  const id = useId();
  const [files, setFiles] = useState<Attachment[]>([]);
  const [status, setStatus] = useState('');
  const [listState, setListState] = useState<'loading' | 'ready' | 'error'>('loading');
  const [admin, setAdmin] = useState(false);
  const [secret, setSecret] = useState('');
  const [selected, setSelected] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const latestRequest = useRef(0);
  const currentScope = useRef(scope);
  const mounted = useRef(false);
  currentScope.current = scope;
  const url = (slot?: number) => `${endpoint}?scope=${encodeURIComponent(scope)}${slot === undefined ? '' : `&slot=${slot}`}`;
  const load = useCallback(async () => {
    if (!mounted.current || currentScope.current !== scope) return;
    const request = ++latestRequest.current;
    try {
      const response = await fetch(`${endpoint}?scope=${encodeURIComponent(scope)}`, { cache: 'no-store', signal: AbortSignal.timeout(12000) });
      if (!response.ok) throw new Error('N�o foi poss�vel carregar os arquivos.');
      const value: Attachment[] = await response.json();
      if (mounted.current && currentScope.current === scope && request === latestRequest.current) {
        setFiles(value); setListState('ready');
      }
    } catch (error) {
      if (mounted.current && currentScope.current === scope && request === latestRequest.current) setListState('error');
      throw error;
    }
  }, [scope]);
  useEffect(() => {
    mounted.current = true;
    setFiles([]); setListState('loading');
    const stop = watchAttachmentList(() => { void load().catch(() => {}); });
    return () => { mounted.current = false; latestRequest.current++; stop(); };
  }, [load]);
  async function upload(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    if (!selected || !secret) return;
    if (selected.size > 5 * 1024 * 1024 || selected.size === 0) { setStatus('Escolha um arquivo de at� 5 MB.'); return; }
    setBusy(true); setStatus('Enviando arquivo.');
    try {
      const response = await fetch(url(), { method: 'POST', headers: { Authorization: `Bearer ${secret}`, 'Content-Type': 'application/octet-stream', 'X-File-Name': encodeURIComponent(selected.name) }, body: selected, signal: AbortSignal.timeout(60000) });
      if (!response.ok) { const data = await response.json().catch(() => ({})); throw new Error(data.code === 'UNAUTHORIZED' ? 'Chave de gerenciamento inv�lida.' : data.code === 'FULL' ? 'Esta etapa j� tem 5 arquivos.' : data.code === 'TYPE' ? 'Formato inv�lido. Use PDF, DOCX, MD ou TXT.' : 'N�o foi poss�vel enviar o arquivo.'); }
      setSelected(null); form.reset(); setStatus('Arquivo publicado para todos.'); await load().catch(() => {});
    } catch (error) { setStatus((error as Error).message || 'Erro de conex�o.'); } finally { setBusy(false); }
  }
  async function remove(file: Attachment) {
    if (!secret) { setStatus('Informe a chave de gerenciamento.'); return; }
    if (!window.confirm(`Excluir "${file.name}" para todos?`)) return;
    setBusy(true);
    try { const response = await fetch(url(file.slot), { method: 'DELETE', headers: { Authorization: `Bearer ${secret}` }, signal: AbortSignal.timeout(12000) }); if (!response.ok) throw new Error(response.status === 401 ? 'Chave de gerenciamento inv�lida.' : 'N�o foi poss�vel excluir.'); setStatus('Arquivo exclu�do.'); await load().catch(() => {}); }
    catch (error) { setStatus((error as Error).message || 'Erro de conex�o.'); } finally { setBusy(false); }
  }
  return <section className="attachments" aria-labelledby={`${id}-title`}>
    <h3 id={`${id}-title`}>Arquivos compartilhados</h3>
    <p>Qualquer pessoa pode baixar. N�o envie dados pessoais ou informa��es internas.</p>
    <p>Arquivos desta etapa s�o atualizados automaticamente a cada 20 segundos enquanto ela est� aberta.</p>
    <p role="status">{status}</p>
    {listState === 'loading' && <p>Carregando arquivos.</p>}
    {listState === 'error' && <p role="status">N�o foi poss�vel atualizar os arquivos. Verifique a conex�o e tente novamente.</p>}
    {files.length ? <ul>{files.map(file => <li key={file.slot}><a href={url(file.slot)}>{file.name}</a> <span>({(file.size / 1024 / 1024).toFixed(2)} MB)</span> {admin && <button type="button" disabled={busy} onClick={() => remove(file)}>Excluir {file.name}</button>}</li>)}</ul> : listState === 'ready' && <p>Nenhum arquivo listado nesta etapa.</p>}
    <button type="button" onClick={() => { setStatus(''); void load().then(() => setStatus('Lista de arquivos atualizada.')).catch(() => {}); }}>Atualizar arquivos</button>
    <button type="button" onClick={() => { setAdmin(!admin); setSecret(''); }}>{admin ? 'Fechar gerenciamento' : 'Gerenciar arquivos'}</button>
    {admin && <form onSubmit={upload}><label htmlFor={`${id}-secret`}>Chave de gerenciamento</label><input id={`${id}-secret`} type="password" value={secret} autoComplete="off" onChange={event => setSecret(event.target.value)} /><label htmlFor={`${id}-file`}>Selecionar arquivo</label><input id={`${id}-file`} type="file" accept=".pdf,.md,.docx,.txt" onChange={event => setSelected(event.target.files?.[0] || null)} /><p>PDF, DOCX, MD ou TXT � at� 5 MB por arquivo � m�ximo de 5 por etapa.</p><button type="submit" disabled={busy || !selected || !secret}>Enviar arquivo</button></form>}
  </section>;
}
