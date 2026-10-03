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

## Próxima troca de chat

Ler este registro, conferir `git status`, `git log` e os arquivos atuais antes de editar. Atualizar aqui mudanças, validações e pendências. As referências atuais e o código prevalecem sobre relatos de pedidos ou implementações antigas.
