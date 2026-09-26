"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight, BookOpen, Check, ChevronDown, CircleHelp, ExternalLink, Filter, Menu, Play, Search, X } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./Tabs";
import { modules, guideUrl } from "./data/modules";
import rawResources from "./data/resources.json";
import startingPoints from "./data/starting-points.json";

type Resource = { module: number; title: string; url: string; section: string; type: string; host: string; access?: string; note?: string };
const resources = rawResources as Resource[];
const normalize = (value: string) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("pt-BR");
const levels = ["Começar", "Construir", "Aprofundar"];
const types = ["Todos", "Curso", "Vídeo", "Leitura", "Prática", "Ferramenta"];
const areas = ["Todos", "Desenvolvimento", "Dados & IA", "Engenharia", "Além do código", "Laboratório"];

function ResourceCard({ item, compact = false }: { item: Resource; compact?: boolean }) {
  const icon = item.type === "Vídeo" ? <Play size={15} fill="currentColor" /> : item.type === "Prática" ? <span className="type-glyph">✳</span> : <BookOpen size={15} />;
  return <a className={`resource-card ${compact ? "compact" : ""}`} href={item.url} target="_blank" rel="noopener noreferrer" aria-label={`${item.title} (abre em outra aba)`}>
    <span className="resource-type">{icon} {item.type}</span>
    <strong>{item.title}</strong>
    <p className="resource-context">{item.note || item.section}</p>
    {item.access && <span className={`access-note ${item.access.startsWith("Pago") ? "paid" : ""}`}>{item.access}</span>}
    <span className="resource-bottom"><span>{item.host}</span><ArrowUpRight size={17} /></span>
  </a>;
}

export default function Home() {
  const [selected, setSelected] = useState<number | null>(null);
  const [area, setArea] = useState("Todos");
  const [stage, setStage] = useState("0");
  const [type, setType] = useState("Todos");
  const [query, setQuery] = useState("");
  const [expanded, setExpanded] = useState(false);
  const [done, setDone] = useState<string[]>([]);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [notice, setNotice] = useState("");

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

  useEffect(() => { document.getElementById("conteudo")?.focus({ preventScroll: true }); }, [selected]);
  useEffect(() => { if (!notice) return; const timer = window.setTimeout(() => setNotice(""), 5000); return () => window.clearTimeout(timer); }, [notice]);

  function openModule(id: number | null) {
    setSelected(id); setStage(String(id === null ? 0 : Math.max(0, [0,1,2].find(i => !done.includes(`${id}-${i}`)) ?? 0))); setType("Todos"); setExpanded(false); setQuery(""); setMobileMenu(false);
    const base = import.meta.env.BASE_URL;
    const url = id === null ? base : `${base}?modulo=${String(id).padStart(2, "0")}`;
    window.history.pushState({}, "", url);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  function toggleDone(key: string) {
    const next = done.includes(key) ? done.filter(v => v !== key) : [...done, key];
    setDone(next);
    try { localStorage.setItem("curva-aberta-progress", JSON.stringify(next)); setNotice(next.includes(key) ? "Etapa registrada neste navegador." : "Etapa reaberta para revisão."); }
    catch { setNotice("Progresso atualizado nesta sessão. O navegador não permitiu salvá-lo para depois."); }
  }

  const active = selected === null ? null : modules[selected];
  const filteredModules = modules.filter(m => area === "Todos" || m.area === area);
  const searchResults = useMemo(() => {
    const q = normalize(query.trim());
    if (q.length < 2) return [];
    const terms = q.split(/\s+/);
    return resources.filter(r => terms.every(term => normalize(`${r.title} ${r.section} ${modules[r.module].title} ${r.type}`).includes(term)));
  }, [query]);
  const moduleResources = active ? resources.filter(r => r.module === active.id) : [];
  const available = moduleResources;
  const filtered = available.filter(r => type === "Todos" || r.type === type);
  const shown = expanded ? filtered : filtered.slice(0, 6);
  const complete = active ? [0,1,2].filter(i => done.includes(`${active.id}-${i}`)).length : 0;

  const resume = done.length ? modules[Number(done[done.length-1].split("-")[0])] : null;

  return <div className="site-shell">
    <a className="skip-link" href="#conteudo">Pular para o conteúdo</a>
    <header className="topbar">
      <div className="topbar-inner">
        <button className="brand" onClick={() => openModule(null)} aria-label="Curva Aberta, voltar ao início">
          <span className="brand-mark">c<span>✳</span></span>
          <span className="brand-name">curva aberta<span className="brand-dot">.</span><small>aprenda fazendo</small></span>
        </button>
        <nav id="main-nav" className={`topnav ${mobileMenu ? "open" : ""}`} aria-label="Navegação principal">
          <button onClick={() => openModule(null)}>Explorar módulos</button>
          <button onClick={() => openModule(9)}>Laboratório MCP <ArrowUpRight size={15} /></button>
          <a href="https://github.com/Hills808/base-conhecimento-desenvolvimento" target="_blank" rel="noopener noreferrer">Base no GitHub <ArrowUpRight size={15} /></a>
        </nav>
        <button className="menu-button" aria-expanded={mobileMenu} aria-controls="main-nav" onClick={() => setMobileMenu(v => !v)} aria-label={mobileMenu ? "Fechar menu" : "Abrir menu"}>{mobileMenu ? <X /> : <Menu />}</button>
      </div>
    </header>

    <main id="conteudo" tabIndex={-1}>
      {active ? <div className="detail-wrap">
        <div className="breadcrumbs"><button onClick={() => openModule(null)}><ArrowLeft size={16}/> Todos os módulos</button><span>/</span><span>Módulo {String(active.id).padStart(2,"0")}</span></div>
        <div className="detail-heading" style={{ "--module-accent": active.color } as React.CSSProperties}>
          <div className="detail-lead">
            <span className="eyebrow">MÓDULO {String(active.id).padStart(2,"0")} <span className="eyebrow-line"/> {active.area.toUpperCase()}</span>
            <h1>{active.title}<span className="heading-period">.</span></h1>
            <p>{active.short}</p>
            <div className="detail-facts"><span><strong>Antes de começar</strong>{active.prerequisite}</span><span><strong>Ao terminar</strong>{active.outcome}</span></div>
          </div>
          <div className="detail-stamp"><span>{active.symbol}</span><small>SEU PRÓXIMO<br/>CAPÍTULO</small></div>
        </div>

        <div className="detail-layout">
          <div className="detail-primary">
            <div className="section-intro">
              <div><span className="eyebrow ink">01 / SEU PERCURSO</span><h2>Um passo de cada vez.</h2><p>Escolha um nível, entenda o que vem nele e coloque a mão na massa.</p></div>
              <div className="progress-mini"><span>{complete}/3 etapas registradas</span><div><i style={{width:`${complete/3*100}%`}}/></div></div>
            </div>
            <Tabs value={stage} onValueChange={v => { setStage(v); setType("Todos"); setExpanded(false); }} className="learning-tabs">
              <TabsList className="stage-tabs" aria-label="Níveis de estudo">
                {levels.map((label,i)=><TabsTrigger className="stage-tab" value={String(i)} key={i}><span className="stage-number">0{i+1}</span><span>{label}</span>{done.includes(`${active.id}-${i}`) && <Check size={16}/>}</TabsTrigger>)}
              </TabsList>
              {levels.map((label,i) => {
                const s = active.stages[i], key = `${active.id}-${i}`;
                return <TabsContent value={String(i)} key={i} className="stage-panel">
                  <div className="stage-kicker">NÍVEL 0{i+1} <span>·</span> {label.toUpperCase()}</div>
                  <h3>{s.name}</h3>
                  <div className="stage-grid">
                    <div><h4>Você vai entender</h4><ul className="learn-list">{s.learn.map(x=><li key={x}><span className="tiny-cross">✳</span>{x}</li>)}</ul></div>
                    <div className="practice-box"><span className="practice-label">COLOQUE EM PRÁTICA ↗</span><p>{s.practice}</p><div className="proof"><strong>Como saber que aprendeu</strong>{s.proof}</div></div>
                  </div>
                  <div className="start-here"><div className="start-heading"><span>COMECE POR ESTE MATERIAL</span><small>Os demais são apoio, não uma lista obrigatória.</small></div>
                    {startingPoints[active.id][i].map((url, index) => {
                      const resource = resources.find(r => r.url === url)!;
                      return <a href={url} key={url} target="_blank" rel="noopener noreferrer" className="start-resource"><span className="start-order">{index === 0 ? "01" : "+"}</span><span><small>{index === 0 ? "PRINCIPAL" : "APOIO"} · {resource.type}</small><strong>{resource.title}</strong></span><ArrowUpRight size={19}/></a>;
                    })}
                  </div>
                  {active.id === 9 && i === 2 && <div className="project-deliverables"><h4>Entrega final: assistente de procedimentos fictícios</h4><ol>
                    <li><strong>Requisito:</strong> escreva três perguntas que o assistente responde e duas que estão fora do escopo.</li>
                    <li><strong>Contrato:</strong> defina entradas, campos disponíveis e saídas resolved, partial, ambiguous e out_of_scope. Nunca complete dados ausentes por inferência.</li>
                    <li><strong>Fluxo:</strong> documente APP → ROUTER → AGENT → TOOL. Sincronize instruções em Markdown com a configuração JSON.</li>
                    <li><strong>Segurança:</strong> identidade do contexto autenticado, autorização no servidor, falha fechada e apenas tools de leitura aprovadas.</li>
                    <li><strong>Validação:</strong> teste colisão de rotas, campo ausente, timeout, acesso negado e instrução maliciosa dentro de um documento. Use somente dados fictícios.</li>
                    <li><strong>PR:</strong> reúna contrato, Skill, coleção Bruno, resultados dos testes e evidência de que o follow-up é apenas um rascunho.</li>
                  </ol></div>}
                  <button className={`done-button ${done.includes(key) ? "is-done" : ""}`} onClick={() => toggleDone(key)}><Check size={17}/>{done.includes(key) ? "Etapa registrada" : "Registrar etapa concluída"}</button>
                  {done.includes(key) && i < 2 && <button className="next-level" onClick={() => { setStage(String(i+1)); setType("Todos"); }}>Ir para {levels[i+1].toLowerCase()} <ArrowRight size={16}/></button>}
                </TabsContent>;
              })}
            </Tabs>

            <section className="material-section" aria-labelledby="materials-heading">
              <div className="section-intro materials-intro"><div><span className="eyebrow ink">02 / BIBLIOTECA DO MÓDULO</span><h2 id="materials-heading">Explore além da trilha.</h2><p>Todos os níveis reunidos para consulta. A seleção acima indica por onde começar; este catálogo amplia suas opções.</p></div><span className="material-count">{filtered.length} opções</span></div>
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
        </div>
      </div> : <div className="home-wrap">
        <section className="study-intro">
          <div><span className="eyebrow ink">BIBLIOTECA INDEPENDENTE DE APRENDIZADO</span><h1>Seu próximo passo,<br/><em>bem aqui.</em></h1><p>Escolha um módulo, siga uma seleção de materiais e transforme o estudo em uma entrega.</p></div>
          <div className="next-session"><span className="eyebrow">{resume ? "RETOME SEU PERCURSO" : "NÃO SABE POR ONDE COMEÇAR?"}</span><h2>{resume ? resume.title : "Escolha pelo que você quer fazer."}</h2><p>{resume ? `${done.length} etapa(s) registrada(s) neste navegador. Continue na primeira etapa que falta neste módulo.` : "Fundamentos para começar. APIs para integrar. Laboratório MCP para juntar as peças."}</p><button onClick={()=>openModule(resume?.id ?? 0)}>{resume ? "Continuar estudando" : "Organizar meu primeiro passo"}<ArrowRight size={18}/></button></div>
        </section>

        <section id="modulos" className="explore-section">
          <div className="explore-heading"><div><span className="eyebrow ink">NA PRÁTICA / 10 MÓDULOS</span><h2>Encontre seu módulo.</h2></div><p>Não existe uma fila obrigatória. Escolha uma área, veja o que vai aprender e avance em três níveis.</p></div>
          <div className="searchbar"><Search size={21}/><input type="search" value={query} onChange={e=>{setQuery(e.target.value);setExpanded(false)}} placeholder="Busque um tema, curso ou ferramenta..." aria-label="Buscar materiais"/>{query && <button onClick={()=>setQuery("")} aria-label="Limpar busca"><X size={17}/></button>}<span>{resources.length} referências</span></div>
          {query.trim().length >= 2 ? <div className="search-results"><div className="results-heading"><strong>{searchResults.length ? `Resultados para “${query}”` : "Nenhum resultado"}</strong><span>{searchResults.length} materiais encontrados</span></div>{searchResults.length ? <><div className="resources-grid">{searchResults.slice(0,expanded?undefined:24).map(r=><div key={`${r.module}-${r.url}`} className="result-item"><span className="result-module">M{String(r.module).padStart(2,"0")} · {modules[r.module].title}</span><ResourceCard item={r} compact/></div>)}</div>{searchResults.length>24 && <button className="show-more" onClick={()=>setExpanded(v=>!v)}>{expanded?"Mostrar menos":`Ver mais ${searchResults.length-24} materiais`} <ChevronDown className={expanded?"up":""} size={17}/></button>}</> : <p>Tente outro termo, como “MCP”, “SQL” ou “inglês”.</p>}</div> : <>
            <div className="area-filters" aria-label="Filtrar áreas">{areas.map(a=><button key={a} onClick={()=>setArea(a)} className={area===a?"active":""} aria-pressed={area===a}>{a}</button>)}</div>
            <div className="explore-layout"><div className="module-grid">{filteredModules.map(m=><button className="module-card" key={m.id} onClick={()=>openModule(m.id)} style={{"--module-accent":m.color} as React.CSSProperties}><span className="card-top"><span className="module-id">MÓDULO {String(m.id).padStart(2,"0")}</span><span className="module-symbol">{m.symbol}</span></span><span className="card-body"><span className="module-area">{m.area}</span><strong>{m.title}</strong><span className="module-short">{m.outcome}</span></span><span className="card-bottom"><span>{resources.filter(r=>r.module===m.id).length} materiais <span className="small-dot">·</span> 3 níveis</span><span className="card-arrow"><ArrowUpRight size={19}/></span></span></button>)}</div>
              <aside className="overview-aside"><div className="aside-head"><span>✳</span><small>GUIA RÁPIDO<br/>PARA COMEÇAR</small></div><h3>Seu ritmo,<br/>seu caminho.</h3><ol><li><span>01</span> Escolha um assunto que resolva uma curiosidade ou necessidade sua.</li><li><span>02</span> Comece no nível que faz sentido. Cada um mostra o que estudar e uma prática.</li><li><span>03</span> Use um material principal e produza algo pequeno para testar o aprendizado.</li></ol><button onClick={()=>openModule(0)}>Ver o módulo de orientação <ArrowRight size={16}/></button></aside>
            </div>
          </>}
        </section>
        <section className="closing-banner"><span>UM PROJETO, VÁRIAS HABILIDADES</span><h2>Quer juntar as peças?</h2><p>O laboratório MCP com C# combina HTTP, Bruno, API .NET, agentes, RAG e Skills em uma sequência guiada.</p><button onClick={()=>openModule(9)}>Abrir laboratório <ArrowRight size={18}/></button></section>
      </div>}
    </main>
    <div className="status-message" role="status" aria-live="polite">{notice}</div>
    <footer className="footer"><span className="footer-brand">Curva Aberta<span>.</span></span><p>Base de Henrique Alexandre, adaptada para este site · <a href="https://github.com/Hills808/base-conhecimento-desenvolvimento/blob/main/LICENSE" target="_blank" rel="noopener noreferrer">CC BY 4.0</a></p><a href="https://github.com/Hills808/base-conhecimento-desenvolvimento" target="_blank" rel="noopener noreferrer">Curadoria original no GitHub <ExternalLink size={15}/></a></footer>
  </div>;
}
