import { useEffect, useState } from 'react';
import { failedStorageKeys } from './studyStorage';
export default function OfflineStudy() {
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);
  const [notice, setNotice] = useState(''); const [busy, setBusy] = useState(false); const [waiting, setWaiting] = useState(false);
  useEffect(() => {
    if (!('serviceWorker' in navigator)) return;
    let active = true;
    navigator.serviceWorker.getRegistration(import.meta.env.BASE_URL).then(value => { if (active && value) setRegistration(value); }).catch(() => {});
    return () => { active = false; };
  }, []);
  useEffect(() => {
    if (!registration) return;
    let installing: ServiceWorker | null = null;
    const changed = () => { setWaiting(Boolean(registration.waiting)); if (registration.active) setNotice('Trilhas e exemplos disponíveis offline neste navegador.'); };
    const found = () => { installing?.removeEventListener('statechange', changed); installing = registration.installing; installing?.addEventListener('statechange', changed); };
    registration.addEventListener('updatefound', found); found(); changed();
    return () => { registration.removeEventListener('updatefound', found); installing?.removeEventListener('statechange', changed); };
  }, [registration]);
  return <details className="offline-study"><summary>Estudar sem internet</summary><p>Guarde as trilhas, exemplos, kits e Furina neste dispositivo. Materiais de outros sites continuam precisando de internet. O progresso permanece local; exporte uma cópia para levar a outro navegador.</p>
    {!registration && <button disabled={busy} onClick={async () => {
      if (!('serviceWorker' in navigator)) { setNotice('Este navegador não oferece modo offline. Você pode baixar os kits das trilhas.'); return; }
      setBusy(true); setNotice('Preparando os arquivos do estudo…');
      try { const value = await navigator.serviceWorker.register(`${import.meta.env.BASE_URL}sw.js`, { scope: import.meta.env.BASE_URL }); await navigator.serviceWorker.ready; setRegistration(value); setNotice('Trilhas e exemplos disponíveis offline neste navegador.'); }
      catch { setNotice('Não foi possível preparar o modo offline. Confira a conexão e tente novamente.'); } finally { setBusy(false); }
    }}>{busy ? 'Preparando…' : 'Disponibilizar este estudo offline'}</button>}
    {registration && <button disabled={busy} onClick={async () => { setBusy(true); try { await registration.update(); setWaiting(Boolean(registration.waiting)); setNotice(registration.waiting ? 'Há uma versão nova. Exporte seu estudo antes de aplicar.' : 'Verificação solicitada. Uma versão nova será mostrada quando terminar de baixar.'); } catch { setNotice('Sem conexão para buscar uma versão nova. A cópia atual continua disponível.'); } finally { setBusy(false); } }}>Procurar atualização</button>}
    {waiting && <button onClick={() => { if (failedStorageKeys().length) { setNotice('O salvamento está bloqueado. Exporte seu estudo antes de recarregar.'); return; } navigator.serviceWorker.addEventListener('controllerchange', () => location.reload(), { once: true }); registration?.waiting?.postMessage('APPLY_STUDY_UPDATE'); }}>Aplicar atualização e recarregar</button>}
    <p role="status">{notice}</p>
  </details>;
}
