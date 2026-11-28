"use client";

import { lazy, Suspense, useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight, BookOpen, ChevronDown, CircleHelp, Command, ExternalLink, Filter, Play, Search, X } from "lucide-react";
import { modules, guideUrl } from "./data/modules";
const AutonomyLab = lazy(() => import("./AutonomyLab"));
import "./autonomy.css";
import "./formation.css";
const Laboratory = lazy(() => import("./Laboratory"));
const ModuleJourney = lazy(() => import("./ModuleJourney"));
import { getResourceMeta, matchesMaterial } from "./resourceMeta";
import MaterialFilters from "./MaterialFilters";
import useUrlFilter from "./useUrlFilter";
import RouteBoundary from "./RouteBoundary";
import StudyBackup from "./StudyBackup.tsx";
const Formation = lazy(() => import("./Formation"));
import AnimatedMascot from "./AnimatedMascot";
import ThemePicker from "./ThemePicker";
import rawResources from "./data/resources.json";
import curriculum from "./data/laboratory.json";

const brandMark = import.meta.env.BASE_URL + 'marca-96.png';

type Resource = { module: number; title: string; url: string; section: string; type: string; host: string; access?: string; note?: string };
const resources = rawResources as Resource[];
const normalize = (value: string) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("pt-BR");
const types = ["Todos", "Curso", "Vídeo", "Leitura", "Prática", "Ferramenta"];
const areas = ["Todos", "Desenvolvimento", "Dados & IA", "Engenharia", "Além do código", "Laboratório"];

function ResourceCard({ item, compact = false }: { item: Resource; compact?: boolean }) {
  const meta = getResourceMeta(item);
  const icon = item.type === "Vídeo" ? <Play size={15} fill="currentColor" /> : item.type === "Prática" ? <span className="type-glyph">✳</span> : <BookOpen size={15} />;
  return <a className={`resource-card ${compact ? "compact" : ""}`} href={item.url} target="_blank" rel="noopener noreferrer" aria-label={`${item.title} (abre em outra aba)`}>
    <span className="resource-type">{icon} {item.type}</span>
    <strong>{item.title}</strong>
    <p className="resource-context">{meta.use}</p><div className="resource-meta"><span>{meta.language}</span><span>{meta.time}</span><span>{meta.certificate}</span></div>
    {item.access && <span className={`access-note ${item.access.startsWith("Pago") ? "paid" : ""}`}>{item.access}</span>}
    <span className="resource-bottom"><span>{item.host}</span><ArrowUpRight size={17} /></span>
  </a>;
}

export default function Home() {
  const [laboratoryView] = useUrlFilter("laboratorio", "", ["", "autonomia"]);
  const isAutonomy = laboratoryView === "autonomia";
  const [rawView] = useUrlFilter("visao", "hoje", ["hoje", "formacao", "projeto", "biblioteca", "diagnostico"]);
  const legacyFilter = ['busca','area','formato','idioma','tempo','certificado','faixa'].some(key=>new URLSearchParams(location.search).has(key));
  const view = rawView === 'hoje' && !new URLSearchParams(location.search).has('visao') && legacyFilter ? 'biblioteca' : rawView;
  const [selected, setSelected] = useState<number | null>(null);
  const [area, setArea] = useUrlFilter("area", "Todos", areas);
  const [type, setType] = useUrlFilter("formato", "Todos", types);
  const [query, setQuery] = useUrlFilter("busca", "");
  const [language, setLanguage] = useUrlFilter("idioma", "all", ["all", "pt", "en", "unknown"]);
  const [time, setTime] = useUrlFilter("tempo", "all", ["all", "30", "60", "unknown"]);
  const [certificate, setCertificate] = useUrlFilter("certificado", "all", ["all", "indicated", "unknown"]);
  const [level, setLevel] = useUrlFilter("faixa", "all", ["all", "0", "1", "2", "3", "4"]);
  const materialFilters = { language, time, certificate, level };
  function filterChange(field: keyof typeof materialFilters, value: string) { ({ language: setLanguage, time: setTime, certificate: setCertificate, level: setLevel })[field](value); setExpanded(false); }
  const [expanded, setExpanded] = useState(false);
  const [done, setDone] = useState<string[]>([]);
  const [notice, setNotice] = useState("");
  const [commandOpen, setCommandOpen] = useState(false);
  const [showStudyGuide, setShowStudyGuide] = useState(false);
  const [commandQuery, setCommandQuery] = useState("");
  const commandPanel = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!commandOpen || !commandPanel.current) return;
    const previous = document.activeElement as HTMLElement | null;
    const overlay = commandPanel.current.parentElement;
    const siblings = Array.from(overlay?.parentElement?.children ?? []).filter((node): node is HTMLElement => node instanceof HTMLElement && node !== overlay);
    const previousInert = siblings.map(node => node.inert);
    siblings.forEach(node => { node.inert = true; });
    commandPanel.current.querySelector<HTMLInputElement>("input")?.focus();
    return () => {
      siblings.forEach((node, index) => { node.inert = previousInert[index]; });
      if (previous?.isConnected) previous.focus({ preventScroll: true });
    };
  }, [commandOpen]);

  function containCommandFocus(event: React.KeyboardEvent<HTMLElement>) {
    if (event.key !== "Tab") return;
    const elements = Array.from(event.currentTarget.querySelectorAll<HTMLElement>('input, button, a[href]')).filter(element => !element.hasAttribute("disabled"));
    const first = elements[0], last = elements[elements.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
  }

  useEffect(() => {
    const sync = () => {
      const p = new URLSearchParams(window.location.search).get("modulo");
      const n = p === null ? null : Number(p);
      setSelected(n !== null && Number.isInteger(n) && n >= 0 && n < modules.length ? n : null);
    };
    sync(); window.addEventListener("popstate", sync);
    try {
      const previous = localStorage.getItem("atlas-study-progress");
      const saved = localStorage.getItem("curva-aberta-progress") || previous || "[]";
      const parsed: unknown = JSON.parse(saved);
      setDone(Array.isArray(parsed) ? [...new Set(parsed.filter((v): v is string => typeof v === "string" && /^[0-9]-[0-2]$/.test(v)))] : []);
      if (previous && !localStorage.getItem("curva-aberta-progress")) {
        localStorage.setItem("curva-aberta-progress", previous);
        localStorage.removeItem("atlas-study-progress");
      }
    } catch { /* local preference only */ }
    return () => window.removeEventListener("popstate", sync);
  }, []);

  useEffect(() => { document.getElementById("conteudo")?.focus({ preventScroll: true }); }, [selected, isAutonomy]);
  useEffect(() => { if (!notice) return; const timer = window.setTimeout(() => setNotice(""), 5000); return () => window.clearTimeout(timer); }, [notice]);
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") { event.preventDefault(); setCommandOpen(v => !v); }
      if (event.key === "Escape") setCommandOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  function openModule(id: number | null) {
    setCommandOpen(false); setCommandQuery("");
    setSelected(id); setExpanded(false);
    const base = import.meta.env.BASE_URL;
    const url = id === null ? base : `${base}?modulo=${String(id).padStart(2, "0")}`;
    window.history.pushState({}, "", url); window.dispatchEvent(new Event("curva-aberta-location-change"));
    window.scrollTo({ top: 0, behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  }
  function openAutonomy() {
    setSelected(null); setCommandOpen(false); setCommandQuery("");
    window.history.pushState({}, "", `${import.meta.env.BASE_URL}?laboratorio=autonomia`);
    window.dispatchEvent(new PopStateEvent("popstate"));
    window.scrollTo({ top: 0, behavior: "auto" });
  }
  function openLabStep(index: number) {
    setSelected(9); setExpanded(false); setCommandOpen(false); setCommandQuery("");
    const url = `${import.meta.env.BASE_URL}?modulo=09&etapa=${index + 1}`;
    window.history.pushState({}, "", url); window.dispatchEvent(new PopStateEvent("popstate"));
    window.scrollTo({ top: 0, behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  }

  function navigate(event: React.MouseEvent<HTMLAnchorElement>, id: number | null) {
    if (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    event.preventDefault(); openModule(id);
  }
  const moduleHref = (id: number | null) => id === null ? import.meta.env.BASE_URL : `${import.meta.env.BASE_URL}?modulo=${String(id).padStart(2, '0')}`;
  const active = selected === null ? null : modules[selected];
  const filteredModules = modules.filter(m => area === "Todos" || m.area === area);
  const searchResults = useMemo(() => {
    const q = normalize(query.trim());
    if (q.length < 2) return [];
    const terms = q.split(/\s+/);
    return resources.filter(r => (area === "Todos" || modules[r.module].area === area) && (type === "Todos" || r.type === type) && matchesMaterial(r, materialFilters) && terms.every(term => normalize(`${r.title} ${r.section} ${modules[r.module].title} ${r.type}`).includes(term)));
  }, [query, area, type, language, time, certificate, level]);
  const moduleResources = active ? resources.filter(r => r.module === active.id) : [];
  const available = moduleResources;
  const filtered = available.filter(r => (type === "Todos" || r.type === type) && matchesMaterial(r, materialFilters));
  const shown = expanded ? filtered : filtered.slice(0, 6);

  const quickItems = useMemo(() => [
    { id:"home", title:"Hoje: minha próxima prática", detail:"Página inicial", action: () => openModule(null) },
    { id:"autonomy", title:"Laboratório de autonomia", detail:"Construir, explicar e refazer sem pular etapas", action: openAutonomy },
    { id:"lab", title:"Abrir Laboratório MCP com C#", detail:"14 etapas guiadas", action: () => openModule(9) },
    ...modules.map(module => ({ id:`module-${module.id}`, title:`Módulo ${String(module.id).padStart(2,"0")} · ${module.title}`, detail:module.outcome, action: () => openModule(module.id) })),
    ...curriculum.steps.map((step, index) => ({ id:`lab-${step.id}`, title:`Etapa ${String(index + 1).padStart(2,"0")} · ${step.title}`, detail:`Laboratório · ${step.hours}`, action: () => openLabStep(index) }))
  ], [done]);
  const quickResults = useMemo(() => {
    const q = normalize(commandQuery.trim());
    return (q.length < 2 ? quickItems.slice(0, 8) : quickItems.filter(item => normalize(`${item.title} ${item.detail}`).includes(q))).slice(0, 8);
  }, [commandQuery, quickItems]);

  const isLearningPage = selected === null && !isAutonomy;
  const currentDestination = isLearningPage ? view === 'diagnostico' ? 'formacao' : view : 'biblioteca';
  return <div className="site-shell academy-shell">
    <a className="skip-link" href="#conteudo">Pular para o conteúdo</a>
    <header className="academy-topbar">
      <div className="academy-topbar-inner">
        <a href={moduleHref(null)} className="academy-brand" onClick={event => navigate(event, null)} aria-label="Curva Aberta, voltar ao início">
          <img className="academy-mark" src={brandMark} width={38} height={38} alt="" />
          <span>Curva Aberta</span>
        </a>
        <nav className="academy-nav" aria-label="Navegação principal">
          {[["hoje", "Hoje"], ["formacao", "Formação"], ["projeto", "Meu projeto"], ["biblioteca", "Biblioteca"]].map(([key, label]) => (
            <a key={key} href={import.meta.env.BASE_URL + '?visao=' + key} aria-current={currentDestination === key ? 'page' : undefined}>{label}</a>
          ))}
        </nav>
        <div className="academy-tools">
          <button className="academy-shortcuts" type="button" onClick={() => setCommandOpen(true)} aria-label="Abrir atalhos do site" title="Atalhos do site (Ctrl+K)">
            <Search size={17} aria-hidden="true" /><span>Atalhos</span>
          </button>
          <ThemePicker />
        </div>
      </div>
    </header>

    <main id="conteudo" tabIndex={-1}><RouteBoundary key={isAutonomy ? "autonomy" : selected ?? view}>
      {isAutonomy ? <div className="home-wrap"><Suspense fallback={<p role="status">Preparando seu laboratório de autonomia…</p>}><AutonomyLab /></Suspense></div> : active ? <div className="detail-wrap">
        <div className="breadcrumbs"><a href={`${import.meta.env.BASE_URL}?visao=biblioteca`}><ArrowLeft size={16}/> Biblioteca</a><span>/</span><span>Módulo {String(active.id).padStart(2,"0")}</span></div>
        <div className="detail-heading" style={{ "--module-accent": active.color } as React.CSSProperties}>
          <div className="detail-lead">
            <span className="eyebrow">MÓDULO {String(active.id).padStart(2,"0")} <span className="eyebrow-line"/> {active.area.toUpperCase()}</span>
            <h1>{active.title}<span className="heading-period">.</span></h1>
            <p>{active.short}</p>
            <div className="detail-facts"><span><strong>Antes de começar</strong>{active.prerequisite}</span><span><strong>Ao terminar</strong>{active.outcome}</span></div>
          </div>
          <div className="detail-stamp" aria-hidden="true"><small>CADERNO / {String(active.id).padStart(2,"0")}</small><span>{String(active.id).padStart(2,"0")}</span><small>APRENDA · PRATIQUE · REVISE</small></div>
        </div>

        {active.id === 9 ? <Suspense fallback={<div className="curriculum-loading" role="status">Preparando as oficinas do laboratório…</div>}><Laboratory /></Suspense> : <div className="detail-layout">
          <div className="detail-primary">
            <Suspense fallback={<div className="curriculum-loading" role="status">Preparando sua trilha: níveis, exemplos e práticas…</div>}><ModuleJourney key={active.id} module={active}/></Suspense>
            <section className="material-section" aria-labelledby="materials-heading">
              <div className="section-intro materials-intro"><div><span className="eyebrow ink">02 / BIBLIOTECA DO MÓDULO</span><h2 id="materials-heading">Explore além da trilha.</h2><p>Todos os níveis reunidos para consulta. A seleção acima indica por onde começar; este catálogo amplia suas opções.</p></div><span className="material-count">{filtered.length} opções</span></div>
              <MaterialFilters value={materialFilters} onChange={filterChange}/>
              <p className="catalog-note">Estimativas são para estudar um trecho, não a duração do curso. Metadados editoriais ainda exigem confirmação na fonte.</p>
              <div className="type-filters" aria-label="Filtrar materiais por formato"><Filter size={16}/>{types.map(t => <button key={t} className={type===t?"active":""} onClick={() => {setType(t);setExpanded(false)}} aria-pressed={type===t}>{t}</button>)}</div>
              {filtered.length ? <><div className="resources-grid">{shown.map(r=><ResourceCard key={r.url} item={r}/>)}</div>{filtered.length>6 && <button className="show-more" onClick={() => setExpanded(v=>!v)}>{expanded ? "Mostrar menos" : `Ver mais ${filtered.length-6} materiais`} <ChevronDown className={expanded?"up":""} size={17}/></button>}</> : <div className="empty-state">Não há materiais deste formato neste módulo. Escolha outro formato ou <button onClick={()=>setType("Todos")}>mostre todos</button>.</div>}
              <p className="catalog-note">Cursos, ferramentas e exames têm condições diferentes. Os itens pagos estão sinalizados quando identificados; consulte a fonte antes de se inscrever. Acesso à documentação não inclui créditos de API ou cloud.</p>
              <a className="all-guide" href={guideUrl(active.guide)} target="_blank" rel="noopener noreferrer">Ler guia completo deste módulo <ArrowUpRight size={18}/></a>
            </section>
          </div>
          <aside className="detail-aside">
            <div className="aside-note"><span className="note-symbol">✳</span><span className="eyebrow">DICA DE ESTUDO</span><h3>Menos abas.<br/>Mais entregas.</h3><p>Escolha um recurso principal por etapa. Use os outros quando uma dúvida aparecer. Termine com algo que você consiga mostrar ou explicar.</p><div className="aside-rule"/><strong>Um bom ciclo</strong><span className="method-flow">Estude <ArrowRight size={14}/> pratique <ArrowRight size={14}/> explique</span></div>
            <div className="source-note"><CircleHelp size={19}/><p>O progresso fica apenas neste navegador. Acesso e certificados podem mudar; confira sempre a página de cada fonte.</p></div>
          </aside>
        </div>}
      </div> : view !== "biblioteca" ? <Suspense fallback={<p role="status">Preparando sua formação…</p>}><Formation view={view}/></Suspense> : <div className="academy-library">
        <header className="academy-page-heading">
          <h1>Biblioteca de estudo</h1>
          <p>Encontre cursos, guias e exercícios por assunto.</p>
        </header>
        <section id="modulos" className="academy-library-content" aria-label="Materiais de estudo">
          <div className="searchbar"><Search size={21}/><input type="search" value={query} onChange={e=>{setQuery(e.target.value);setExpanded(false)}} placeholder="Busque um tema, curso ou ferramenta..." aria-label="Buscar materiais"/>{query && <button onClick={()=>setQuery("")} aria-label="Limpar busca"><X size={17}/></button>}</div>
          {query.trim().length >= 2 && <MaterialFilters value={materialFilters} onChange={filterChange}/>}
          {query.trim().length >= 2 ? <div className="search-results"><div className="results-heading"><strong>{searchResults.length ? `Resultados para “${query}”` : "Nenhum resultado"}</strong><span>{searchResults.length} materiais encontrados</span></div>{searchResults.length ? <><div className="resources-grid">{searchResults.slice(0,expanded?undefined:24).map(r=><div key={`${r.module}-${r.url}`} className="result-item"><span className="result-module">M{String(r.module).padStart(2,"0")} · {modules[r.module].title}</span><ResourceCard item={r} compact/></div>)}</div>{searchResults.length>24 && <button className="show-more" onClick={()=>setExpanded(v=>!v)}>{expanded?"Mostrar menos":`Ver mais ${searchResults.length-24} materiais`} <ChevronDown className={expanded?"up":""} size={17}/></button>}</> : <p>Tente outro termo, como “MCP”, “SQL” ou “inglês”.</p>}</div> : <>
            <div className="area-filters" aria-label="Filtrar áreas">{areas.map(a=><button key={a} onClick={()=>setArea(a)} className={area===a?"active":""} aria-pressed={area===a}>{a}</button>)}</div>
            <ul className="library-topics" role="list">
              {filteredModules.map(module => (
                <li key={module.id}>
                  <a className="library-topic" href={moduleHref(module.id)} onClick={event => navigate(event, module.id)}>
                    <span className="library-topic-area">{module.area}</span>
                    <span className="library-topic-main"><strong>{module.title}</strong><span>{module.outcome}</span></span>
                    <span className="library-topic-count">{module.id === 9 ? '14 etapas guiadas' : resources.filter(item => item.module === module.id).length + ' materiais'}</span>
                    <ArrowUpRight size={18} aria-hidden="true" />
                  </a>
                </li>
              ))}
            </ul>
          </>}
        </section>
        <details className="library-additional">
          <summary>Outras práticas guiadas</summary>
          <p><a href={import.meta.env.BASE_URL + '?laboratorio=autonomia'}>Laboratório de autonomia</a></p>
          <p><a href={moduleHref(9)} onClick={event => navigate(event, 9)}>Laboratório de APIs, MCP e agentes</a></p>
        </details>
      </div>}
    </RouteBoundary></main>
    <StudyBackup />
    {(!isLearningPage || showStudyGuide) && <AnimatedMascot module={active}/> }
    <div className="status-message" role="status" aria-live="polite">{notice}</div>
    {commandOpen && <div className="command-overlay" role="presentation" onMouseDown={() => setCommandOpen(false)}>
      <section ref={commandPanel} className="command-palette" role="dialog" aria-modal="true" aria-label="Ir para uma parte do site" onKeyDown={containCommandFocus} onMouseDown={event => event.stopPropagation()}>
        <div className="command-search"><Command size={19}/><input value={commandQuery} onChange={event => setCommandQuery(event.target.value)} placeholder="Busque um módulo ou etapa…" autoComplete="off" name="atalho" aria-label="Buscar módulo ou etapa"/><button onClick={() => setCommandOpen(false)} aria-label="Fechar atalho"><X size={17}/><kbd>Esc</kbd></button></div>
        <p>{commandQuery.trim().length < 2 ? "ATALHOS PRINCIPAIS" : "RESULTADOS"}</p>
        <div className="command-results">{quickResults.length ? quickResults.map((item, index) => <button key={item.id} onClick={item.action}><span>{String(index + 1).padStart(2,"0")}</span><div><strong>{item.title}</strong><small>{item.detail}</small></div><ArrowUpRight size={16}/></button>) : <div className="command-empty">Nenhum atalho encontrado. Tente “API”, “MCP” ou “C#”.</div>}</div>
        <footer><span>Digite para filtrar</span><span><kbd>Esc</kbd> fechar</span></footer>
      </section>
    </div>}
    <footer className="academy-footer">
      <div className="academy-footer-inner">
        <div>
          <div className="academy-footer-brand"><img className="academy-mark" src={brandMark} width={28} height={28} alt="" /><strong>Curva Aberta</strong></div>
          <p>Base de Henrique Alexandre. <a href="https://github.com/Hills808/base-conhecimento-desenvolvimento/blob/main/LICENSE" target="_blank" rel="noopener noreferrer">CC BY 4.0</a></p></div>
        <div className="academy-footer-links">
          <a href="#guardar-estudo">Guardar meu estudo</a>
          {isLearningPage && <button type="button" aria-pressed={showStudyGuide} onClick={() => setShowStudyGuide(value => !value)}>{showStudyGuide ? 'Ocultar a Furina' : 'Mostrar a Furina'}</button>}
          <a href="https://github.com/Hills808/base-conhecimento-desenvolvimento" target="_blank" rel="noopener noreferrer">Curadoria no GitHub <ExternalLink size={14} aria-hidden="true" /></a>
        </div>
      </div>
    </footer>
  </div>;
}
