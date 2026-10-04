import { useId } from 'react';
import type { MaterialFilters as Filters } from './resourceMeta';
type Props = { value: Filters; onChange: (field: keyof Filters, value: string) => void };
export default function MaterialFilters({ value, onChange }: Props) {
  const id = useId();
  return <fieldset className="catalog-filters"><legend>Refinar materiais</legend>
    <label htmlFor={`${id}-language`}>Idioma informado<select id={`${id}-language`} value={value.language} onChange={e => onChange('language', e.target.value)}><option value="all">Todos</option><option value="pt">Português</option><option value="en">Inglês</option><option value="unknown">Não verificado</option></select></label>
    <label htmlFor={`${id}-time`}>Tempo estimado para o trecho<select id={`${id}-time`} value={value.time} onChange={e => onChange('time', e.target.value)}><option value="all">Qualquer tempo</option><option value="30">Até 30 minutos</option><option value="60">Até 1 hora</option><option value="unknown">Sem estimativa em minutos</option></select></label>
    <label htmlFor={`${id}-certificate`}>Certificado<select id={`${id}-certificate`} value={value.certificate} onChange={e => onChange('certificate', e.target.value)}><option value="all">Qualquer condição</option><option value="indicated">Com indicação na curadoria</option><option value="unknown">Não verificado</option></select></label>
    <label htmlFor={`${id}-level`}>Nível na trilha<select id={`${id}-level`} value={value.level} onChange={e => onChange('level', e.target.value)}><option value="all">Todos os níveis</option><option value="0">0 · Começo do zero</option><option value="1">1 · Fundamentos</option><option value="2">2 · Construção</option><option value="3">3 · Confiabilidade</option><option value="4">4 · Projeto avançado</option></select></label>
    <button type="button" onClick={() => (['language','time','certificate','level'] as const).forEach(field => onChange(field, 'all'))}>Limpar filtros</button>
  </fieldset>;
}
