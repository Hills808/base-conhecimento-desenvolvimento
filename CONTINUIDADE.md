# Curva Aberta — registro de continuidade

Atualizado em 26/10/2026 (São Paulo). Este arquivo distingue decisões, código verificado e pendências; pedidos anteriores não comprovam execução.

## Fonte e estrutura

- Repositório: `Hills808/base-conhecimento-desenvolvimento`, branch `main`.
- Site: <https://hills808.github.io/base-conhecimento-desenvolvimento/>.
- Interface em `site/`: React 19 + Vite 8, entrada `site/src/main.tsx`, aplicação `site/src/App.tsx`.
- `.github/workflows/pages.yml` compila `site/` e publica `site/dist` automaticamente após alterações em `site/**` na `main`.
- Base inspecionada nesta retomada: `d1487e4c6eeca676995d2eec3da5fd230c8ae352`. Publicação e validação de conteúdo desse commit estão aprovadas no GitHub Actions.
- Contexto recuperado do chat “Curadoria de Aprendizado Grátis” e confrontado com arquivos e commits atuais. Não recriar o projeto nem substituir o site por outro serviço.

## Decisões preservadas

- Nome: Curva Aberta. Público: estudantes de tecnologia; explicações simples, do básico ao avançado, português e prática.
- Laboratório alinhado às necessidades de estudo do Henrique na XP: HTTP/Bruno, Swagger, APIs .NET, MCP com C#, tools, agentes, roteamento, contratos, RAG e skills. Exemplos públicos usam dados fictícios.
- Preservar progresso local, Continue daqui, checklists, modo foco, revisão futura, critérios de conclusão, kits e filtros de nível.
- Preservar curadoria por idioma, duração, certificado e indicação de uso.
- Visual jovem e legível; Skiper UI como inspiração. A iniciativa de vídeos curtos permanece pausada.
- Furina: nome, personalidade e aparência aprovados devem ser preservados; referência declarada pelo usuário é Yuki Suou. As artes existentes são a referência concreta para futuras modificações. Não redesenhar pela memória do nome da personagem.
- Furina funciona sem IA, com dicas contextuais e comportamentos programados.

## Estado confirmado na retomada

| Área | Evidência no código | Estado |
| --- | --- | --- |
| Hub e navegação | App, StudyResume e módulos lazy | Dez áreas, busca, atalhos e Continue daqui existentes |
| Aprendizagem | ModuleJourney, Laboratory, StudyFocus, PracticeStudio | Checklists, critérios, foco, rascunhos e revisões existentes |
| Conteúdo | Validadores e dados em `site/src/data/` | 45 níveis, 63 situações explicadas, 59 casos, 14 oficinas/42 exemplos, 8 simulações didáticas |
| Curadoria | resourceMeta, filtros de ModuleJourney e Laboratory | Metadados e filtros existentes |
| Furina | AnimatedMascot, furina-motion e FURINA.md | Rig DOM hierárquico, transições, pausa, ocultação, posição e comemoração existentes |
| Modo escuro | Nenhum seletor/controle de tema na base inspecionada | Não estava implementado; blocos escuros isolados não eram um tema global |

## Alteração desta retomada: tema de estudo

- `site/src/ThemePicker.tsx`: seletor sempre visível na barra, com Claro, Escuro e Sistema. Sistema acompanha a preferência do dispositivo; escolha manual tem prioridade e fica salva.
- `site/index.html`: inicialização antes da primeira pintura, inclusive em links diretos. `color-scheme` e `theme-color` acompanham o tema.
- `site/src/theme.css`: paleta noturna e estados de interação em início, catálogo, aulas, laboratório, exercícios, feedback, foco, atalhos, formulários e controles da Furina. Seletores incluem o tema no HTML para prevalecer sobre estilos carregados sob demanda.
- Paleta: fundo `#151c2a`, superfície `#1d2738`, texto `#e5eaf3`, apoio `#b4c0d4`, links `#abb8ff`, contorno `#41516a`; botões preenchidos usam texto escuro sobre azul claro.
- Layout e tipografia existentes preservados. Menu recolhido até 1100px para acomodar o seletor; controles de pelo menos 44px, incluindo celular.
- Chave nova isolada: `curva-aberta-theme-v1`. Sem alteração das chaves de progresso, revisão, foco, respostas ou Furina. Sincronização entre abas; armazenamento indisponível permite uso durante a visita.

## Validação desta retomada

- Build de produção e todos os validadores do projeto aprovados.
- TypeScript sem erros com os tipos React 19 e Vite disponíveis no ambiente de validação. Esses pacotes de tipos foram usados somente localmente; dependências do projeto não foram alteradas.
- Inicialização de tema: 20 combinações de preferência salva, tema do sistema, valor inválido e armazenamento bloqueado aprovadas em Node com ambiente simulado.
- Contraste calculado dos pares principais: texto/superfície 12,43:1; apoio/bloco 6,74:1; link/superfície 7,88:1; botão 8,49:1; apoio/aviso 6,66:1. Isso verifica a paleta, não constitui auditoria WCAG completa da página.
- Publicação inicial desta alteração: `0c25e0a6f778f067e0860438a3a43b2c52f3513b`; build, deploy Pages, Markdown e links aprovados no GitHub Actions.
- Correções de contraste: `2341a0853657aca8557dce79d39e0cba5724c642`; publicação e validação de conteúdo aprovadas. Site observado novamente após esse deploy.
- Navegador desktop: escolha Escuro aplicada, cores computadas conferidas e ausência de overflow horizontal na página inicial. Claro/Escuro na primeira oficina preservou uma resposta escrita; preferência e resposta continuaram após recarga. Texto de teste removido pela interface.
- Navegação para módulo de APIs e carregamento tardio das aulas, abertura/fechamento da dica da Furina e do painel de atalhos verificados. Contraste calculado sobre os elementos de texto renderizados identificou ajustes no logotipo, números de marco, teclas dos atalhos e apresentação da biblioteca; ajustes incorporados nesta alteração.
- Após as correções, nenhuma falha de contraste textual foi encontrada nas telas observadas do início, módulo de APIs, atalhos e modo foco expandido. O cálculo simples apontou o símbolo decorativo da marca por estar posicionado fora da caixa de fundo do pai; não se trata de conteúdo de leitura. Esta amostragem não cobre todos os estados, temas e aulas nem substitui auditoria WCAG completa.
- Preferência Escuro reaplicada ao abrir uma segunda aba; troca para Claro sincronizada com a aba original. Sistema aplicado conforme a configuração atual (clara) do navegador. Mudança real da configuração do sistema não foi emulada.
- Escape fechou os atalhos; modo foco expandido apresentou campos e ações legíveis no tema escuro. Logs examinados mostraram falhas da extensão de automação, sem erro de aplicação identificado nesses fluxos.
- Captura do início em tema escuro preservada. Testes de desktop em viewport 1363 × 936; não foi realizado teste de toque ou viewport móvel.
- O driver de navegador disponível não oferece emulação de viewport móvel nem alteração da preferência de cores do sistema. Responsividade é revisada no CSS; não declarar homologação em aparelho físico. Python Playwright e agent-browser CLI não estão disponíveis; usar o navegador CUA autorizado.

## Furina: pendências reais

- A base atual inclui cinco recortes WebP: cabeça com cabelo/olhos abertos, torso, dois braços inteiros e pernas juntas. `furina-buddy.png` e WebPs anteriores também permanecem no repositório.
- Não existe `.riv`, projeto Spine, skeleton JSON exportado ou atlas. Não apresentar o controlador atual como animação Rive/Spine final.
- Para piscar, deformar cabelo e dançar com articulações independentes, faltam pálpebras, rosto sem cabelo, mechas separadas, braços/antebraços/mãos e pernas/coxa/canela/pé com preenchimento sob articulações, no mesmo registro visual. Lista técnica em `site/public/furina-rig/rig-plan.json` e `site/FURINA.md`.
- Esta retomada altera somente as cores das dicas e controles, preservando artes, geometria, animações e comportamento.
- Pendentes: teste em celular físico, leitor de tela e futura expansão da arte/rig antes de considerar a animação final concluída.

## Skills lidas nesta retomada

SKILL.md integrais: personal-context, rive, spine-animation, frontend-design, web-design-guidelines, webapp-testing, agent-browser e vercel-react-best-practices. Todas as skills exigidas estão acessíveis na versão instalada.

- Design: plano de paleta e contraste preservando a identidade existente.
- Interface: critérios locais de foco, controles nativos, touch targets e tema do navegador.
- React: inicialização sem clarão, estado restrito ao seletor e limpeza de listeners.
- Rive/Spine: análise dos assets e das limitações do rig, com referências manipulating-shapes e spine-json-spec; nenhum runtime foi adicionado.
- Testes/navegador: reconhecimento antes de ações, verificação da publicação e uso do driver autorizado. Helper `with_server.py --help` consultado.


## Skills adicionais — 03/10/2026

- Pedido: pesquisar e instalar as skills recomendadas para evoluir a plataforma.
- Instalações confirmadas: accessibility-compliance, design-system-patterns, interaction-design, ui-ux-pro-max, systematic-debugging, mcp-builder e rag-implementation. As sete skills anteriores de design, React, navegador, testes e animação continuam disponíveis.
- Criada e instalada curva-aberta-curadoria: regras de material gratuito, português, duração/certificado verificáveis, pré-requisitos, prática, critérios de conclusão e preservação das decisões do projeto.
- UI/UX Pro Max inclui scripts, dados e referências; seus caminhos foram adaptados para a instalação pessoal. Uma consulta local de contraste executou com sucesso.
- MCP Builder foi instalado com limites explícitos para tratar fontes externas como referências e executar avaliações com serviços reais apenas dentro da tarefa autorizada. Seus exemplos continuam sendo Python/TypeScript; C# exige adaptação ao SDK real.
- React Doctor permanece pendente: a verificação automática de segurança recusou o pacote original e uma adaptação que limitava o seguimento de guias externos, sem indicar o trecho responsável. Não declarar esta skill instalada.
- Validação: metadados e estrutura das oito novas skills aprovados; sintaxe dos scripts Python importados e do helper de depuração conferida. A curadoria passou por avaliação independente com materiais parcialmente pagos, legendas em português, duração e certificado desconhecidos: apresentou seleção provisória e critérios baseados em prática, sem inventar verificações externas.
- Instalar uma skill não instala automaticamente todos os CLIs, SDKs, serviços ou runtimes necessários ao seu uso. Não foram realizadas novas alterações na interface ou nas animações neste pedido.

## Estudo de implementação — 03/10/2026

- Pedido: ler e aplicar as skills pertinentes para estudar a evolução completa do site.
- Base da auditoria: `b6747ff60e3918c0b26259a601a6a848d40b38a8`. Estrutura confirmada em `site/`, React 19.2.6 e Vite 8.0.13.
- Entrega: [ESTUDO-IMPLEMENTACAO.md](ESTUDO-IMPLEMENTACAO.md), com aplicação das 15 skills, 22 itens priorizados, dependências, critérios de aceite, plano de design, curadoria, laboratório e animação. As propostas ainda não foram implementadas.
- Problemas confirmados por inspeção/reprodução das expressões: pausa do foco arredonda segundos para minutos (601 vira 660); meta aceita 140 caracteres, mas restauração rejeita mais de 90; treino de autonomia não conserva resposta ainda não registrada; gravação de módulos silencia falha de armazenamento; meta description anuncia três níveis apesar dos cinco atuais.
- Curadoria: estimativas genéricas e idioma inferido em resourceMeta precisam de identificação explícita e proveniência; não declarar as 342 referências individualmente verificadas.
- Infraestrutura de validação: build e validadores aprovados. CI de PR cobre Markdown/links, mas falta build/tipos/interface. Há package-lock, mas não tsconfig de validação no projeto. O build Vite não substitui checagem de tipos.
- Navegador desktop: início e módulo de APIs em escuro sem overflow horizontal, cinco níveis carregados; atalhos abriram com foco na busca e Escape retornou ao botão. Esta rodada não homologou celular, leitor de tela ou todos os estados dos temas.
- Correção de alcance do registro anterior: 44px foi assegurado nos controles de tema; não em todas as ações existentes. Ações do Continue daqui com 33px foram observadas no desktop. Isso é uma oportunidade de conforto, sem concluir automaticamente violação do mínimo WCAG AA de 24px.
- Furina: arte existente inspecionada visualmente; aparência preservada. Rive/Spine devem ser comparados em prova após preparar recortes, com condições de exportação/licença verificadas. Nenhum runtime adicionado.
- Python Playwright, agent-browser CLI e dotnet indisponíveis. O navegador autorizado permitiu a amostragem desktop; os exemplos C# não foram compilados neste estudo.
- Continuação recomendada: confiabilidade do armazenamento, cronômetro, rascunhos e regressões; depois backup, leitura/acessibilidade, curadoria e kits reproduzíveis. Preparação da arte pode avançar em paralelo, sem misturar migração de progresso e troca do renderer.

## Implementação autorizada — 03/10/2026

- Autorização: implementar as melhorias do estudo com as skills pertinentes. Nenhum site recriado.
- Entregas: storage validado com fallback entre rotas e avisos; foco em segundos e metas 140; rascunhos de treino; backup com prévia, escolha de conflitos e recuperação; links de módulos nativos e filtros URL; revisão atualizada; metadados honestos e tokens de novos componentes; recuperação de falhas de rota.
- Catálogo: 77 URLs têm seleção editorial explícita reaproveitada das trilhas; idioma e duração não são mais inferidos da URL/formato. Datas de verificação externa continuam desconhecidas. Catálogo completo permanece com 342 referências.
- CI: tipos React 19.3.0 fixados, tsconfig, 12 regressões, lock versionado e npm ci; build/validadores mantidos; URLs TS/JSON extraídas para a checagem de links; workflow específico .NET.
- Kits: ZIP reproduzível com API local, cinco casos Bruno, OpenAPI, servidor/cliente MCP 1.4.1 e recuperação lexical/extrativa com fonte. SDK oficial .NET 10.0.100 obtido para validar: builds sem erros, MCP real aprovado, cinco casos HTTP e cinco consultas de recuperação aprovados. Sem modelo generativo, autenticação de produção ou dados da XP.
- Offline: opt-in, cache do build completo somente deste site; atualização espera ação explícita e bloqueia recarga quando há gravação falha. Manifest incluído; instalação móvel não homologada.
- Furina: posição via translate3d, dica em portal, movimentos verticais por botão e prevenção de sobreposição com foco. Artes e articulações preservadas; rig final continua dependente dos recortes/artboard inexistentes.
- Browser local: ERR_BLOCKED_BY_CLIENT. A publicação será usada para a amostragem visual; não declarar teste móvel/assistivo completo.
- Pendências mantidas: rig profissional final da Furina, cobertura WCAG e dispositivo físico, revisão individual da curadoria e sincronização automática com backend. A22 é atendido parcialmente por transferência manual de backup, não por conta em nuvem.
- Detalhes e estado por item: seção de execução em ESTUDO-IMPLEMENTACAO.md.

## Publicação e verificação — 04/10/2026 UTC (03/10 em São Paulo)

- Implementação publicada no commit `c6c4cdd3fb34a15a1cc387653e5e76320db81600`; árvore remota idêntica à validada localmente. Deploy Pages, checagem de interface e workflow .NET aprovados.
- Checagem de conteúdo encontrou uma referência Bruno 404 no README novo. Corrigida para a introdução oficial de testes e ZIP regenerado; não foi excluído o erro da verificação.
- Navegador desktop público: tema Escuro conservado após recarga; foco pausado em 24:55 restaurado em 24:55 com a meta intacta; rascunho conservado ao avançar e voltar de etapa sem registrar tentativa; filtro HTTP/Português retornou quatro materiais e refletiu a seleção na URL; controles da dica da Furina responderam; cache offline concluiu preparação.
- Textos temporários usados nos testes foram esvaziados e foco reiniciado; nenhuma entrega ou tentativa foi registrada. Sem erros de aplicação observados; mensagens de erro pertenciam à extensão do navegador.
- Evidência visual desktop: `docs/evidencias/curva-aberta-escuro-20261004.jpg`. Offline foi preparado, mas não se simulou perda de rede; importação interativa e dispositivo físico permanecem fora desta amostragem. Importação e conflitos têm regressões automatizadas.

## Próxima troca de chat

## Blocos públicos — 07/10/2026

- Pedido confirmado: todos leem, adicionam, editam e apagam; sem login nem histórico; 10.000 caracteres por bloco. Projeto Supabase dedicado Curva Aberta criado na Hills808's Org, região São Paulo, custo de criação informado US$ 0/mês.
- Backend: 59 blocos fixos, RLS, leitura anônima e UPDATE somente de content. Sem INSERT/DELETE de linhas ou edição de revision/escopo. Trigger invoker exige revisão esperada e intervalo mínimo de 3 segundos por bloco. Não há autoria ou cópia histórica de conteúdo; revision é contador técnico de concorrência. Backups operacionais do provedor não são controlados pela aplicação.
- Interface: bloco por etapa nos módulos/laboratório; publicação explícita, contador Unicode, confirmação de exclusão, comparação de conflito que preserva rascunho; atualização de leitura em 20s fora da edição. Não entra no backup pessoal nem no cache offline; precisa de internet. Rascunho ainda não publicado deve ser copiado antes de sair de etapa.
- Validações: tipos, build, 12 regressões existentes e limite Unicode local aprovados. SQL sob role anon comprovou 10.000 aceitos, 10.001 rejeitados, cooldown, conflito e proibição de novos escopos/revisão manual; testes transacionais revertidos. Advisors security sem alertas.
- Depuração: teste HTTP de cooldown não é confiável com a latência deste ambiente, pois as requisições podem superar 3s. Cooldown validado atomicamente no banco; API testa publicação/leitura/conflito separadamente. Não confundir falha de timing no teste com falha de proteção.
- Referências: backend/README.md e backend/shared-notes.sql. Chave no frontend é apenas publicável; nenhuma service_role/secret foi utilizada. Limitação deliberada: qualquer pessoa pode vandalizar; cooldown limita frequência, não é moderação nem proteção completa contra bots.
- Publicação: commit c4abdea, Pages e validação de interface aprovados. Navegador publicou uma nota sem login e outra aba leu o mesmo texto; fixture apagada condicionalmente depois. API real validou limite 10.000, leitura, conflito e limpeza; os 59 blocos foram deixados vazios. Evidência em docs/evidencias/curva-aberta-anotacoes-20261007.jpg.
- Checagem geral de links: duas ocorrências de HTTP 403 na referência antiga Khan Academy em DESIGN.md e DESIGN-STUDENT.md. Não relacionadas ao bloco; não foram ocultadas nem excluídas da checagem. Homologação mobile/assistiva e teste extenso de concorrência continuam pendentes.
- Ajuste posterior de 07/10: limite aumentado para 30.000 caracteres por bloco, na interface e constraint Postgres, sem apagar conteúdo. Script inicial mantém o limite histórico de 10.000; executar notes-limit-30000.sql após shared-notes.sql em uma instalação nova. Testes atualizados para 30.000/30.001.

Ler este registro, conferir `git status`, `git log` e os arquivos atuais antes de editar. Atualizar aqui mudanças, validações e pendências. As referências atuais e o código prevalecem sobre relatos de pedidos ou implementações antigas.

- Ajuste de 09/10/2026: limite ampliado para 50.000 caracteres por bloco na interface e no Postgres, preservando conteúdo, permissões e revisão. Em instalação nova, aplicar shared-notes.sql e depois notes-limit-50000.sql (substitui a ampliação intermediária para 30.000). Validação local e transacional das fronteiras 50.000/50.001; publicação no GitHub Pages.


## Indisponibilidade das anotações — 26/10/2026

- Diagnóstico confirmado: projeto Supabase mfpfqzduzywmfmekbiho em INACTIVE; endpoint público das notas retornou HTTP 503. Código atual ainda usa o endpoint correto e limite de 50.000.
- Pausa automática por baixa atividade é hipótese compatível com o plano gratuito (documentação: https://supabase.com/docs/guides/platform/free-project-pausing); motivo individual da pausa não confirmado pelos logs disponíveis.
- Reativação solicitada pelo conector restore_project, aceita com sucesso. Estado posterior COMING_UP; chamadas durante a inicialização retornaram HTTP 521 e SQL temporariamente indisponível. Advisors de segurança sem alertas.
- Nenhuma nota, chave, permissão ou schema foi alterado. Sem upgrade pago e sem tarefas periódicas criadas. Pendente confirmar ACTIVE_HEALTHY, leitura anônima e limite do banco após terminar a inicialização. A interface informa erro genérico de carregamento quando o serviço está indisponível.


## Migração Cloudflare autorizada — 26/10/2026

- Usuário autorizou aplicar Workers + D1 para as anotações. Backend preparado em backend/cloudflare, com Wrangler 4.153.0 fixado e lockfile; 59 blocos, 50.000 caracteres Unicode, revisão e cooldown atômicos, texto simples, exclusão por conteúdo vazio, CORS e limite de corpo. Sem contas temporárias e sem recursos pagos criados.
- Frontend preparado para uma configuração única em site/src/notes-config.json. Continua apontando para Supabase até homologar e transferir os dados. Mensagens de indisponibilidade agora são legíveis e preservam o editor. Nenhum failover automático entre bancos.
- Supabase recuperado: ACTIVE_HEALTHY. Leitura pública dos 59 blocos e constraint de 50.000 confirmadas. Exportação de preparação obtida; arquivo temporário em backend/cloudflare/migration-data/notes.json, ignorado pelo Git, não é histórico do produto. Reexportar após congelar a origem na troca final. Não houve bloqueio de gravação na origem nesta etapa.
- Transferência implementada com validação exata dos escopos, conteúdo, revisões e timestamps; importação parametrizada no D1 apenas sobre linhas ainda vazias e retomada segura; verificação antes de ativar o frontend. Procedimento completo em backend/cloudflare/README.md.
- Validações: cinco testes backend com SQLite real (Unicode, corpos grandes, conflito simultâneo, cooldown, exclusão, manutenção, integridade da transferência); tipos, 12 regressões do site, testes de indisponibilidade e build aprovados. Migração no D1 local e empacotamento Wrangler dry-run aprovados. Servidor Wrangler dev falhou neste ambiente com uv_interface_addresses; não declarar teste HTTP local ou homologação D1 remoto concluídos.
- Bloqueio concreto: nenhuma credencial Cloudflare disponível no CLI; dashboard aberto exibiu login e busca de plugins não encontrou conector Cloudflare. Faltam autenticar conta permanente, criar D1, publicar Worker, congelar origem apenas durante a transferência, importar/verificar, habilitar destino e publicar a configuração final. Banco antigo não foi apagado e configuração final não foi antecipada.


### Continuação da autorização Cloudflare

- Usuário confirmou login no navegador próprio. O navegador remoto não compartilha essa sessão. Tentativas anteriores de login Google chegaram à confirmação em duas etapas, mas o retorno Cloudflare falhou; login por senha no painel retornou 403. Não atribuir esses erros a senha incorreta sem evidência.
- Tentado fluxo oficial Wrangler login --device com escopos account:read, user:read, workers_scripts:write e d1:write. Usuário informou que aprovou. Ao recuperar o processo de autorização, ferramenta retornou bloqueio de política de rede para https://dash.cloudflare.com:443. Verificação posterior whoami confirmou ausência de autenticação. Não contornar esse bloqueio por rotas, proxies ou outros ambientes.
- Nenhum recurso Cloudflare criado e nenhuma mudança na fonte ativa das notas. Migração continua preparada no commit 164550f; publicação e CI de interface desse commit aprovadas. Checagem geral de conteúdo continua falhando; causa desta última execução não reanalisada (há registro anterior de links Khan 403). Conclusão depende de um meio de publicação autorizado com acesso Cloudflare disponível.

## Recursos Cloudflare criados — 26/10/2026 (São Paulo)

- Sessão Chrome local acessível e conta permanente confirmada. Account ID: `612a33520282207ecfa09c67e97953df`.
- D1 `curva-aberta-notes` criado no plano Free. UUID: `7f022186-4c83-4512-846b-f10120047eb5`. Estrutura de `0001_shared_notes.sql` aplicada pelo console D1; consulta remota confirmou 59 blocos, conteúdo total 0 e soma de revisões 0. A transferência ainda não ocorreu.
- UUID configurado no Wrangler no commit `7db3c2610b26f977e7380852a98cd1fa19112947`. `WRITES_ENABLED` permanece `false` no arquivo.
- Worker `curva-aberta-notes` criado pelo dashboard em `https://curva-aberta-notes.henrique-2013ale.workers.dev`. Atenção: o código publicado ainda é o template Hello World (versão inicial 9b9107b8), sem binding D1 e sem homologação da API. Não usar esse endpoint no frontend ainda.
- Editor de código do dashboard permaneceu em carregamento, inclusive após uma recarga. Quadro do editor em quick-edit-workers.devprod.cloudflare.dev também permaneceu vazio. Não houve edição/publicação do backend pronto.
- Alternativa preparada: integração oficial Cloudflare Workers and Pages com GitHub. Página Install & Authorize aberta no Chrome, opção Only select repositories com SOMENTE `Hills808/base-conhecimento-desenvolvimento` selecionado. Aplicativo ainda NÃO instalado/autorizado. A página solicita leitura de metadados e leitura/escrita de administration, checks, code, deployments e pull requests; requer confirmação explícita para esse novo acesso persistente.
- Próximo passo após autorização: concluir integração e configurar branch main, diretório raiz `backend/cloudflare`, instalação `npm ci`, build/teste `npm test`, deploy `npx wrangler deploy`. Verificar bindings/variáveis efetivamente publicados e `/health` pronto com escritas desativadas antes de congelar a origem.
- Consulta somente leitura no Supabase confirmou 59 blocos, um preenchido, 19.085 caracteres e revisão máxima 53. Não é snapshot final: reexportar depois do congelamento. Nenhum conteúdo foi exibido nessa consulta.
- Origem NÃO congelada, frontend continua Supabase, nenhuma nota transferida/apagada. Não criar outro banco ou Worker ao retomar. Nenhuma chave Cloudflare criada e nenhuma configuração de segurança do navegador alterada.
- CLI local: clone GitHub falhou com `getaddrinfo() thread failed to start`; não foi usado para contornar o bloqueio de rede registrado anteriormente. Recursos foram criados pela sessão Chrome explicitamente autorizada.

## Backend Cloudflare publicado — 26/10/2026 (São Paulo)

- Integração Cloudflare–GitHub encontrada já conectada ao repositório correto, branch main. Nenhuma nova permissão foi concedida nesta retomada.
- Configurado diretório raiz `backend/cloudflare`, build `npm test`, instalação automática `npm clean-install` pelo lockfile e deploy `npx wrangler deploy`.
- Publicação do commit `6151eee0e3cf65100b7b51bf1a3098357467cf31` concluída no build Cloudflare `b8cdb418-ba19-4fa9-b3cc-4b89e6c5f6c8`. Cinco testes backend aprovados. Worker deixou o template Hello World.
- `https://curva-aberta-notes.henrique-2013ale.workers.dev/health` observado no Chrome: `{"ready":true,"writesEnabled":false}`. Dashboard confirmou binding DB ao D1 UUID `7f022186-4c83-4512-846b-f10120047eb5`, ALLOWED_ORIGIN correto e logs desativados.
- Origem ainda sem congelamento e frontend ainda Supabase. Transferência e homologação de escrita remota pendentes.
- Verificação seguinte: comando de deploy temporariamente acrescenta `wrangler d1 execute` com SELECT count(*) para confirmar acesso administrativo do token de build ao D1 antes da transferência. Nenhum conteúdo de nota é impresso. Restaurar o comando de deploy padrão após essa verificação/migração.

## Migração concluída — 26/10/2026 (São Paulo)

Estado atual: Anotações compartilhadas publicadas no Cloudflare Workers + D1 e frontend GitHub Pages atualizado. Recursos existentes reutilizados; nenhum banco/Worker duplicado. Acesso público sem login, 59 blocos fixos, 50.000 pontos de código Unicode e sem histórico/autoria na aplicação preservados.

### Transferência e ativação

- Origem congelada por `revoke update(content) on public.shared_study_notes from anon` somente depois de confirmar saúde do destino e acesso administrativo D1. Consulta posterior confirmou `anon_can_update: false`. Leitura pública e notas originais preservadas.
- Exportação final executada após o congelamento. SHA-256 da exportação: `b92f5ee625aa4ae78aa97f980612c69b6dc8b87ed3b48986c6ab1721b0077da7`.
- Build de transferência `577cf47f-2f66-406a-bae9-c1db41ce4ce7`: script existente `transfer.mjs` exportou os 59 blocos, importou via API D1 com parâmetros e validou integralmente conteúdo, revisão e timestamp. Escritas do Worker continuaram desativadas durante essa etapa.
- `WRITES_ENABLED: "true"` publicado no commit `7a981a33aa64a12222b30ca738ea64c56f8298ce`. `/health` observado com `ready: true` e `writesEnabled: true`.
- Configuração do frontend trocada no commit `3b2516304363cefd312fa0e9ecfb071e5a6befd5`: provider cloudflare, endpoint Workers e chave vazia.
- Endpoint ativo: `https://curva-aberta-notes.henrique-2013ale.workers.dev/rest/v1/shared_study_notes`. Binding DB e UUID `7f022186-4c83-4512-846b-f10120047eb5` confirmados no deploy.
- Fonte Supabase permanece sem UPDATE público, com os 59 blocos e 19.085 caracteres preservados. Não reabilitar a origem como rollback simples: novas edições no D1 exigem sincronização de volta antes de qualquer reversão.

### Validação concluída

- Cinco testes backend com SQLite real aprovados nos builds Cloudflare.
- Homologação remota no build `924d0fd0-cfae-4725-a80b-869e56b33cb9`: leitura/edição/exclusão anônimas; dois clientes; duas escritas simultâneas com um sucesso e um HTTP 409; revisão antiga rejeitada; 50.000 emojis aceitos e lidos integralmente; 50.001 rejeitados; preflight e origem indevida conferidos.
- Script explícito `backend/cloudflare/remote-smoke.mjs` adicionado no commit `7346fc20905cad2315c578c9e36323bb3f72c226`. Exige opt-in, endpoint exato, snapshot de 59 blocos e uma fixture originalmente vazia. Restauração parametrizada exige coincidência de conteúdo, revisão e timestamp da última escrita de teste, evitando sobrescrever edição de visitante.
- Após o teste remoto, fixture restaurada incluindo revisão/data e nova comparação exata dos 59 blocos aprovada. `transfer.mjs activate` validou saúde e configuração. Snapshot da homologação apagado no ambiente efêmero do build; nenhum snapshot foi versionado.
- GitHub Actions: `Publicar Curva Aberta #82`, execução `40440145691`, concluída com sucesso; tipos, testes e build incluídos no workflow Pages. `Validar estudo e interface #13`, execução `40440145757`, concluída com sucesso no mesmo commit do frontend.
- Navegador no site publicado: bloco mod-0-0 inicialmente vazio recebeu uma anotação descartável; segunda aba com edição antiga recebeu conflito e manteve integralmente seu rascunho; exclusão da fixture foi vista pela segunda aba. Nenhuma anotação real foi editada.
- Após o teste de interface, mod-0-0 voltou a conteúdo vazio, revisão original 5 e timestamp original `2026-10-07T18:37:06.749653+00:00` por UPDATE condicional sobre revisão 7 e timestamp exato da exclusão de teste. Consulta D1 retornou a linha restaurada. Conferência final D1: 59 blocos, um preenchido, 19.085 caracteres, revisão máxima 53.
- Advisors de segurança Supabase sem alertas após o congelamento.
- Comando de deploy Cloudflare restaurado e salvamento confirmado: somente `npx wrangler deploy`; build continua `npm test`. Não há transferência, limpeza ou teste remoto automático em pushes futuros. O primeiro comando longo de homologação não foi salvo pelo painel; comando compacto foi salvo e executado com sucesso. Nenhuma política de segurança foi contornada.

### Pendências e limites

- Migração sem bloqueio pendente. Abas antigas devem recarregar o frontend; não reabrir escritas no Supabase.
- `Validar conteúdo #145`, execução `40440145629`, falhou na checagem de links, separada da publicação: Cervantes `https://cvc.cervantes.es/ensenanza/actividades_ave/` retornou 404; ETS `https://www.ets.org/toefl/test-takers/ibt/about.html` retornou erro de protocolo HTTP/2. Há duas ocorrências de cada referência, em guia de idiomas e catálogo. Não foram ocultadas nem alteradas nesta migração; Markdown passou.
- Não foi realizada homologação em celular físico ou leitor de tela. Permanecem os limites do plano Free e a possibilidade deliberada de qualquer visitante editar/apagar texto público. A aplicação não tem histórico; backups operacionais D1 Time Travel são do provedor.
