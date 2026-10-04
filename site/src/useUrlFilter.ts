import { useEffect, useState } from 'react';
export default function useUrlFilter(name: string, initial: string, allowed?: readonly string[]): [string, (value: string) => void] {
  const read = () => { const value = new URLSearchParams(location.search).get(name); return value !== null && (!allowed || allowed.includes(value)) ? value.slice(0, 200) : initial; };
  const [value, setValue] = useState(read);
  useEffect(() => {
    const update = () => setValue(read());
    window.addEventListener('popstate', update); window.addEventListener('curva-aberta-location-change', update);
    return () => { window.removeEventListener('popstate', update); window.removeEventListener('curva-aberta-location-change', update); };
  }, [name, initial]);
  return [value, next => { setValue(next); const url = new URL(location.href);
    if (next === initial || next === '') url.searchParams.delete(name); else url.searchParams.set(name, next);
    history.replaceState({}, '', url.pathname + url.search + url.hash);
  }];
}
