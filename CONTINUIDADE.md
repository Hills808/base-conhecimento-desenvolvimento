# Curva Aberta — registro de continuidade

Atualizado em 03/10/2026. Este arquivo distingue decisões, código verificado e pendências; pedidos anteriores não comprovam execução.

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

Ler este registro, conferir `git status`, `git log` e os arquivos atuais antes de editar. Atualizar aqui mudanças, validações e pendências. As referências atuais e o código prevalecem sobre relatos de pedidos ou implementações antigas.
