import { useEffect, useId, useState, type FormEvent } from 'react';
import { NOTES_URL } from './sharedNotes';

type Attachment = { slot: number; name: string; size: number };
const endpoint = new URL('/attachments', NOTES_URL).toString();

export default function Attachments({ scope }: { scope: string }) {
  const id = useId();
  const [files, setFiles] = useState<Attachment[]>([]);
  const [status, setStatus] = useState('');
  const [admin, setAdmin] = useState(false);
  const [secret, setSecret] = useState('');
  const [selected, setSelected] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const url = (slot?: number) => `${endpoint}?scope=${encodeURIComponent(scope)}${slot === undefined ? '' : `&slot=${slot}`}`;
  async function load() {
    const response = await fetch(url(), { cache: 'no-store', signal: AbortSignal.timeout(12000) });
    if (!response.ok) throw new Error('Não foi possível carregar os arquivos.');
    setFiles(await response.json());
  }
  useEffect(() => { let active = true; fetch(url(), { cache: 'no-store', signal: AbortSignal.timeout(12000) }).then(r => { if (!r.ok) throw new Error(); return r.json(); }).then(v => { if (active) setFiles(v); }).catch(() => { if (active) setStatus('Arquivos temporariamente indisponíveis.'); }); return () => { active = false; }; }, [scope]);
  async function upload(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    if (!selected || !secret) return;
    if (selected.size > 5 * 1024 * 1024 || selected.size === 0) { setStatus('Escolha um arquivo de até 5 MB.'); return; }
    setBusy(true); setStatus('Enviando arquivo…');
    try {
      const response = await fetch(url(), { method: 'POST', headers: { Authorization: `Bearer ${secret}`, 'Content-Type': 'application/octet-stream', 'X-File-Name': encodeURIComponent(selected.name) }, body: selected, signal: AbortSignal.timeout(60000) });
      if (!response.ok) { const data = await response.json().catch(() => ({})); throw new Error(data.code === 'UNAUTHORIZED' ? 'Chave de gerenciamento inválida.' : data.code === 'FULL' ? 'Esta etapa já tem 5 arquivos.' : data.code === 'TYPE' ? 'Formato inválido. Use PDF, DOCX, MD ou TXT.' : 'Não foi possível enviar o arquivo.'); }
      setSelected(null); form.reset(); await load(); setStatus('Arquivo publicado para todos.');
    } catch (error) { setStatus((error as Error).message || 'Erro de conexão.'); } finally { setBusy(false); }
  }
  async function remove(file: Attachment) {
    if (!secret) { setStatus('Informe a chave de gerenciamento.'); return; }
    if (!window.confirm(`Excluir “${file.name}” para todos?`)) return;
    setBusy(true);
    try { const response = await fetch(url(file.slot), { method: 'DELETE', headers: { Authorization: `Bearer ${secret}` }, signal: AbortSignal.timeout(12000) }); if (!response.ok) throw new Error(response.status === 401 ? 'Chave de gerenciamento inválida.' : 'Não foi possível excluir.'); await load(); setStatus('Arquivo excluído.'); }
    catch (error) { setStatus((error as Error).message || 'Erro de conexão.'); } finally { setBusy(false); }
  }
  return <section className="attachments" aria-labelledby={`${id}-title`}>
    <h3 id={`${id}-title`}>Arquivos compartilhados</h3>
    <p>Qualquer pessoa pode baixar. Não envie dados pessoais ou informações internas.</p>
    <p role="status">{status}</p>
    {files.length ? <ul>{files.map(file => <li key={file.slot}><a href={url(file.slot)}>{file.name}</a> <span>({(file.size / 1024 / 1024).toFixed(2)} MB)</span> {admin && <button type="button" disabled={busy} onClick={() => remove(file)}>Excluir {file.name}</button>}</li>)}</ul> : !status && <p>Nenhum arquivo listado nesta etapa.</p>}
    <button type="button" onClick={() => { setAdmin(!admin); setSecret(''); }}>{admin ? 'Fechar gerenciamento' : 'Gerenciar arquivos'}</button>
    {admin && <form onSubmit={upload}><label htmlFor={`${id}-secret`}>Chave de gerenciamento</label><input id={`${id}-secret`} type="password" value={secret} autoComplete="off" onChange={event => setSecret(event.target.value)} /><label htmlFor={`${id}-file`}>Selecionar arquivo</label><input id={`${id}-file`} type="file" accept=".pdf,.md,.docx,.txt" onChange={event => setSelected(event.target.files?.[0] || null)} /><p>PDF, DOCX, MD ou TXT · até 5 MB por arquivo · máximo de 5 por etapa.</p><button type="submit" disabled={busy || !selected || !secret}>Enviar arquivo</button></form>}
  </section>;
}
