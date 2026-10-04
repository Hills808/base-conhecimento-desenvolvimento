import OfflineStudy from './OfflineStudy';
import { useEffect, useId, useState } from 'react';
import { backupSummary, makeBackup, parseBackup, restoreBackup, type Backup } from './studyBackup';
import { readStored, storageEvent, failedStorageKeys } from './studyStorage';
function download(value: unknown, name: string) {
  const url = URL.createObjectURL(new Blob([JSON.stringify(value, null, 2)], { type: 'application/json' }));
  const anchor = document.createElement('a'); anchor.href = url; anchor.download = name; anchor.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
export default function StudyBackup() {
  const inputId = useId(); const [incoming, setIncoming] = useState<Backup | null>(null);
  const [preferIncoming, setPreferIncoming] = useState(false); const [notice, setNotice] = useState('');
  const [failed, setFailed] = useState<string[]>(failedStorageKeys);
  useEffect(() => {
    const update = (event: Event) => { const { key, persisted } = (event as CustomEvent<{ key: string; persisted: boolean }>).detail;
      if (!key.startsWith('curva-aberta-')) return;
      setFailed(previous => persisted ? previous.filter(item => item !== key) : [...new Set([...previous, key])]);
    };
    window.addEventListener(storageEvent, update); setFailed(failedStorageKeys()); return () => window.removeEventListener(storageEvent, update);
  }, []);
  const summary = incoming ? backupSummary(incoming) : null;
  return <section id="guardar-estudo" tabIndex={-1} className="study-backup" aria-label="Guardar e recuperar meu estudo">
    {failed.length > 0 && <p className="storage-warning" role="status">O navegador não permitiu salvar parte do seu estudo. Seu trabalho continua nesta visita; exporte uma cópia antes de fechar.</p>}
    <details><summary>Guardar e recuperar meu estudo</summary>
      <p>Baixe uma cópia do progresso, evidências, tentativas, rascunhos e sessão de foco. Guarde o arquivo em um lugar seu. Ele pode conter o texto que você escreveu.</p>
      <button onClick={() => download(makeBackup(), 'curva-aberta-meu-estudo.json')}>Exportar meu estudo</button>
      <label htmlFor={inputId}>Importar uma cópia JSON</label><input id={inputId} type="file" accept=".json,application/json" onChange={async event => {
        const file = event.target.files?.[0]; setIncoming(null); setNotice(''); if (!file) return;
        try { if (file.size > 2_000_000) throw new Error('O arquivo supera o limite de 2 MB.'); setIncoming(parseBackup(await file.text())); }
        catch (error) { setNotice(error instanceof Error ? error.message : 'Não foi possível ler o arquivo.'); }
        event.target.value = '';
      }}/>
      {incoming && summary && <div className="backup-preview"><h3>Confira antes de combinar</h3><p>Cópia de {new Date(incoming.exportedAt).toLocaleDateString('pt-BR')}: {summary.deliveries} entregas, {summary.evidence} registros de prática, {summary.attempts} treinos e {summary.drafts} rascunhos.</p>
        <p>Registros novos serão acrescentados. Em conflito, os textos atuais são preservados. A sessão de foco importada fica pausada.</p>
        <label><input type="checkbox" checked={preferIncoming} onChange={event => setPreferIncoming(event.target.checked)}/>Em conflitos, usar os textos e escolhas da cópia importada</label>
        <button onClick={() => { try { const saved = restoreBackup(incoming, preferIncoming); setIncoming(null); setNotice(saved ? 'Cópia combinada. Seus registros atuais ficaram guardados em uma cópia de recuperação.' : 'Cópia disponível nesta visita. Parte dos registros não pôde ser gravada; exporte antes de sair.'); } catch (error) { setNotice(error instanceof Error ? error.message : 'Não foi possível importar.'); } }}>Combinar com meu estudo</button>
        <button onClick={() => setIncoming(null)}>Cancelar importação</button></div>}
      <button onClick={() => { const value = readStored('curva-aberta-backup-recovery-v1'); if (value) download(value, 'curva-aberta-antes-da-importacao.json'); else setNotice('Ainda não há uma importação anterior para recuperar.'); }}>Baixar cópia anterior à importação</button>
      <p role="status">{notice}</p>
    </details>
    <OfflineStudy />
  </section>;
}
