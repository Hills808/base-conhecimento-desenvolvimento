# Curva Aberta — estudo de implementação

Estudo realizado em 03/10/2026 sobre a base `b6747ff60e3918c0b26259a601a6a848d40b38a8`, na branch `main`. Continuidade: [CONTINUIDADE.md](CONTINUIDADE.md).

## Direção recomendada

A plataforma já tem uma estrutura de aprendizagem ampla e modo escuro funcional. A próxima evolução deve proteger o trabalho do estudante, simplificar o uso das trilhas e melhorar a reprodução das práticas. A animação da Furina depende primeiro de preparar melhor a arte existente.

Este documento é um estudo, com especificações para implementação. As propostas abaixo ainda não foram incorporadas ao código. Nenhuma mudança de interface, dependência ou animação foi feita nesta auditoria.

Manter React/Vite, publicação no GitHub Pages, identidade Curva Aberta e arquivos em `site/`. Preservar progresso e suas migrações, Continue daqui, checklists, foco, revisões, critérios, kits e níveis. Preservar explicações simples, português e curadoria gratuita com condições explícitas. O laboratório mantém HTTP/Bruno antes da construção completa em C#, e exemplos fictícios relacionados ao contexto de integração estudado para o trabalho na XP. Vídeos curtos próprios continuam pausados.

## O que está implementado

| Área | Estado confirmado | Base para evoluir |
| --- | --- | --- |
| Estrutura | React 19.2.6, Vite 8.0.13 e TypeScript 5.9.3 em `site/` | Evolução incremental no projeto atual |
| Conteúdo | Dez áreas; nove módulos gerais com cinco níveis; laboratório com 14 etapas | Preservar IDs usados em progresso e links |
| Aprendizagem | Exemplos guiados, desafios, explicações, verificação, critérios e treino de autonomia | Melhorar confiança e clareza do registro |
| Continuidade | Continue daqui e revisões; intervalos didáticos de 1, 7 e 30 dias | Proteger dados e atualizar estados vencidos |
| Curadoria | 342 referências exibidas na página inicial; idioma, tempo, certificado e uso apresentados | Diferenciar metadados verificados de estimativas |
| Temas | Claro, Escuro e Sistema; aplicação antes da primeira pintura; sincronização entre abas | Ampliar cobertura dos estados e consolidar tokens |
| Navegação | Links diretos de módulo/nível/etapa, atalhos, foco no conteúdo e tabs com teclado | Melhorar links nativos e filtros compartilháveis |
| Desempenho | ModuleJourney e Laboratory carregados sob demanda | Medir antes de ampliar otimizações |
| Furina | Dicas sem IA, arraste, setas, botões de lado, pausa, ocultação, comemoração e movimento reduzido | Completar arte e validar fluidez visual |
| Laboratório | Guias e arquivos C# didáticos, contratos, oito cenários determinísticos de agentes | Kits executáveis e avaliação de integrações reais |

Os testes de raciocínio e as rubricas registram a avaliação do estudante. O site explica que não corrige texto nem executa os arquivos produzidos. Essa transparência deve permanecer.

## Skills lidas e aplicadas ao estudo

Foram lidos os SKILL.md das 15 skills pertinentes instaladas. A aplicação foi feita à análise e ao plano; não significa que todos os runtimes ou serviços estejam instalados.

| Skill | Aplicação concreta |
| --- | --- |
| frontend-design | Preservar identidade; hierarquia de leitura e prioridade da prática |
| web-design-guidelines | Semântica, foco, navegação, formulários e estados da interface |
| accessibility-compliance | Plano de auditoria WCAG 2.2 AA e testes assistivos |
| design-system-patterns | Tokens semânticos, componentes e consolidação gradual do CSS |
| interaction-design | Feedback de salvamento, transições, foco e redução de movimento |
| ui-ux-pro-max | Consultas locais sobre arraste, foco não encoberto e efeitos React |
| vercel-react-best-practices | Estado local, armazenamento versionado, carregamento e custo de renderização |
| systematic-debugging | Rastrear causa, reproduzir comportamento e definir teste de regressão |
| webapp-testing | Separar validadores de dados, testes de lógica e testes de interface |
| agent-browser | Reconhecer a tela e conferir ações com estado atualizado; driver disponível usado |
| rive | Máquina de estados, integração React e prova de animação interativa |
| spine-animation | Recortes, hierarquia de ossos, pivôs, atlas e continuidade das articulações |
| mcp-builder | Tools com contratos claros, erros, avaliação e adaptação ao SDK C# real |
| rag-implementation | Recuperação com fontes, dados fictícios e avaliação separada da geração |
| curva-aberta-curadoria | Gratuidade, idioma real, duração, certificado e indicação de uso verificáveis |

React Doctor continua indisponível, conforme o registro da instalação anterior. Skills de documentos, planilhas e serviços sem relação com este site não acrescentam um requisito de implementação. Não foram usadas para expandir artificialmente o escopo.

## Evidências e limites desta auditoria

- `npm run build` aprovado com os validadores existentes: 45 níveis, 63 situações, 59 casos de aprendizagem, 14 etapas/42 exemplos de laboratório, oito simulações e validação matemática da Furina.
- Validador da Furina: 2.100 amostras de movimento em três passos de tempo e 144 posições responsivas. Essas verificações não comprovam continuidade visual dos recortes.
- Build observado: JavaScript inicial 393,82 kB, 117,43 kB gzip; ModuleJourney 169,22/44,46 kB; Laboratory 118,90/40,44 kB; StudyFocus 27,93/10,17 kB; CSS inicial 122,33/24,93 kB. São tamanhos de artefatos, não métricas de experiência real.
- Navegador desktop, 1363 × 936, tema escuro: início e módulo de APIs sem overflow horizontal; cinco níveis carregados; painel de atalhos abriu com foco na busca; Escape fechou e devolveu o foco ao botão de abertura.
- A meta description ainda anuncia três níveis, enquanto a trilha renderizada e os dados têm cinco.
- Reprodução em Node das expressões do cronômetro confirmou o arredondamento de pausa e a divergência do limite da meta. Isso não foi apresentado como teste de interface completo.
- Arte `furina-buddy.png` inspecionada visualmente; controlador, CSS, cinco recortes WebP, `rig-plan.json` e `FURINA.md` examinados.
- Python Playwright, CLI agent-browser e SDK `dotnet` não disponíveis neste ambiente. Testes de navegador usaram o driver autorizado disponível. Não houve compilação dos kits C#, teste em celular físico, leitor de tela ou medição de Core Web Vitals.
- As 342 referências não foram verificadas individualmente. Consultas externas desta auditoria se limitaram a fontes oficiais sobre acessibilidade, runtimes/licenças de animação e versões do SDK MCP.

## Backlog com prioridade e critérios

P1: confiabilidade e preparação da próxima implementação. P2: experiência e aprofundamento. P3: extensões condicionais. Esforço S/M/L é relativo e provisório; não representa uma promessa de prazo.

| ID | Prioridade / esforço | Evidência ou necessidade | Implementação proposta | Critério de aceite |
| --- | --- | --- | --- | --- |
| A01 | P1 / M | `moduleProgress.ts` silencia falhas ao salvar; laboratório e treino já avisam | API de persistência com resultado explícito e estado em memória compartilhado | Falha de armazenamento mantém uso durante a visita e exibe aviso honesto; nunca declara salvamento confirmado |
| A02 | P1 / M | Mapas de progresso e sessão aceitam objetos sem validar todos os valores | Schemas versionados para módulos, laboratório, treino, foco e preferências | JSON inválido, arrays em mapas, datas e IDs impróprios não quebram a página; dados válidos antigos permanecem |
| A03 | P1 / S | `StudyFocus.tsx`: pausa converte segundos em minutos arredondados | Separar duração configurada, segundos restantes e instante final | Pausar com 601 segundos conserva 601, não 660; um segundo permanece um segundo; retomada e recarga preservam a sessão |
| A04 | P1 / S | Input de meta aceita 140 caracteres, mas restauração aceita apenas 90 | Um limite compartilhado e validação de string | Meta de 100 e de 140 caracteres reaparece após recarga; sessão malformada não gera exceção |
| A05 | P1 / M | `PracticeStudio.tsx` inicia resposta vazia e salva apenas ao registrar | Rascunho separado por exercício, com salvamento e recuperação | Texto não registrado reaparece ao retornar; rascunho não cria tentativa, conclusão ou revisão |
| A06 | P1 / M | Não foi encontrado exportador/importador de progresso | Backup JSON local com versão, prévia, validação e combinação previsível | Exportar e restaurar preserva evidências; arquivo inválido não sobrescreve dados; restauração tem resumo revisável |
| A07 | P1 / M | `resourceMeta.ts` infere idioma pela URL e tempo pelo formato | Metadados explícitos com proveniência e distinção entre duração e esforço estimado | Nenhum vídeo recebe duração factual de 15–45 min apenas por ser vídeo; informação desconhecida é indicada |
| A08 | P1 / M | PR verifica Markdown/links, mas não build; projeto sem tsconfig de validação | CI de build, tipos e regressões de comportamento; usar lock com `npm ci` | PR falha quando tipos, progresso, foco ou critérios quebram; manter os validadores atuais |
| A09 | P1 / M | Kits têm Program.cs e guias, mas não projetos `.csproj` ou coleções `.bru` entregues | Kit HTTP/Bruno e projetos .NET reproduzíveis com versões fixadas | Outra pessoa segue README e reproduz resposta completa/parcial/erro com dados fictícios |
| A10 | P2 / M | Catálogo geral filtra formato/área; seleções da trilha têm idioma/formato | Filtros por idioma, tempo estimado, certificado e nível com estados vazios claros | Combinações preservam a prática disponível; filtros podem ser limpos e compartilhados |
| A11 | P2 / M | Camadas `style`, `design-refresh`, `identity`, `student-ui` e `theme` | Consolidar gradualmente tokens e componentes usados de verdade | Claro/escuro mantêm aparência e contraste; reduzir sobreposições sem alteração de progresso |
| A12 | P2 / M | Auditoria atual é amostragem desktop; algumas ações Continue daqui têm 33px de altura | Revisar alvos, zoom, teclado, leitores e interação móvel | Matriz acessível executada; alvo recomendado de 44px nas ações importantes; exceções documentadas |
| A13 | P2 / M | Furina é sobreposição fixa e anima sua posição por left/bottom | Evitar colisões com foco, safe areas e teclado virtual; medir arraste | Dica e controles acessíveis em viewport estreito; nenhum controle essencial encoberto na posição inicial |
| A14 | P2 / M | Navegação interna majoritariamente usa botões; filtros não ficam na URL | Links nativos onde há destino e estado de filtros na URL | Abrir nova aba funciona; voltar/avançar restaura a seleção; foco segue previsível |
| A15 | P2 / S | Revisões usam relógio na leitura/renderização | Atualização ao voltar à aba e na mudança do dia, sem polling contínuo de toda a página | Revisão que vence com a página aberta aparece sem recarga manual |
| A16 | P2 / S | Meta description informa três níveis | Corrigir metadados e derivar contagens dos dados quando viável | Página e descrição apresentam cinco níveis, sem contagem desatualizada |
| A17 | P2 / M | Lazy loading existe; sem ErrorBoundary identificado | Recuperação de falha de carregamento e medição de bundle/rota | Erro de chunk permite tentar de novo sem perder respostas; otimizações comprovadas por medição |
| A18 | P2 / L | Sem `.riv`, skeleton/atlas ou articulações completas | Preparar arte e comparar Rive/Spine em prova isolada | Pivôs estáveis, sem separação visível, estados interrompíveis e aparência preservada |
| A19 | P2 / L | Simulações de agente são regras determinísticas, sem modelo real | Ampliar casos locais e oferecer exercício separado com integração real | Relatório diferencia regra local, tool real e comportamento de modelo; contratos e recusas testados |
| A20 | P2 / L | RAG faz parte da trilha; site publicado é estático | Kit local com corpus fictício, fontes, recuperação e avaliação | Respostas rastreáveis; ausência de fonte gera declaração de insuficiência; não inventar evidência |
| A21 | P3 / L | Guias baixáveis já existem; offline integral não foi implementado | Avaliar PWA depois de backup e estratégia de atualização | Cache não mantém aulas incompatíveis com schema novo; conteúdo offline identificado |
| A22 | P3 / L | Progresso atual é local, sem conta | Avaliar sincronização entre dispositivos apenas se necessária | Requisito de conta/infraestrutura definido antes de código; conflito não apaga evidência |

## Implementação da confiabilidade

Começar por A01–A05 e A08, usando testes pequenos que reproduzem os problemas antes da correção. O cronômetro soma até 59 segundos em uma pausa: `ceil(601/60) * 60 = 660`. Repetir pausas pode prolongar o tempo. A solução deve conservar segundos sem alterar a duração escolhida para a próxima sessão.

Criar uma camada de armazenamento compartilhada com leitura validada, resultado de gravação e notificações entre consumidores. Não unificar todos os dados em um único objeto enorme. Manter chaves e migradores explícitos por domínio; considerar assinaturas de store externas quando vários componentes precisam da mesma informação. Evitar escrever o documento inteiro a cada tecla se uma gravação agrupada e um flush ao sair resolvem o caso.

Backup deve exportar apenas os dados necessários ao estudante e aceitar importação com prévia das alterações. Importação não é uma chamada direta de `localStorage.setItem` sobre arquivo arbitrário. Rejeitar estruturas incompatíveis, limitar tamanho e preservar uma cópia recuperável antes de substituir registros. O comportamento de combinação precisa ser definido para respostas diferentes e datas conflitantes.

Rascunhos de treino são distintos de tentativas registradas. Registrar um treino atualiza o histórico e a revisão; digitar uma resposta não deve fazer isso. O aviso de falha deve aparecer perto do registro e poder ser percebido por tecnologia assistiva.

## Design, leitura e navegação

Preservar a identidade visual atual. A referência Skiper orienta acabamento de componentes e interação, sem copiar uma página promocional que dificulte estudar.

1. Consolidar tokens semânticos: fundo, superfície, texto principal/apoio, borda, link, foco, ação, aviso, erro, sucesso e código. Cada tema define esses papéis; componentes deixam de repetir cores brutas.
2. Em aulas, priorizar objetivo, exemplo, próxima prática e resultado esperado. A estrutura numerada já existe; aperfeiçoar sua visibilidade e recolher consultas secundárias. Não criar um segundo fluxo concorrente de estudo.
3. Usar largura de leitura confortável, espaçamento consistente e texto principal legível. Código deve permitir rolagem própria sem fazer a página inteira transbordar. Avaliar números finais em telas reais antes de redefinir toda a tipografia.
4. Padronizar estados de botão, campo, checklist, tab, aviso e card nos dois temas. Sucesso e erro precisam de texto/ícone além da cor. Foco visível permanece em todos os controles.
5. Tornar a retomada mais específica: módulo, nível/etapa e próxima ação já identificada pelo progresso. Links de retomada devem usar destinos verificáveis e manter revisão como fluxo distinto de conclusão.
6. Melhorar a busca com termos normalizados, contexto de módulo e motivo do resultado; medir a filtragem das 342 referências antes de instalar uma biblioteca de busca ou virtualização.

Ações importantes devem buscar 44 × 44 CSS px por conforto. Isso não significa que os botões desktop de 33px automaticamente violem WCAG: o mínimo AA de 2.5.8 é 24 × 24, com exceções de espaçamento e contexto. Medir a área realmente interativa, e não apenas a caixa do input dentro de um campo maior.

A Furina já tem alternativas ao arraste: setas do teclado e botões para os lados. A revisão deve conferir se todos os movimentos necessários têm alternativa simples por ponteiro, especialmente reposicionamento vertical. Foco não encoberto no nível AA significa não ficar totalmente oculto; manter o controle inteiro visível é a meta de usabilidade mais forte.

## Curadoria com confiança

Estabelecer um registro por material com ID estável, URL, módulo/nível, pré-requisito, idioma da narração/texto, legendas/tradução, formato, acesso gratuito/parcial/pago, certificado e condições, indicação de uso e data/fonte da verificação.

Separar `duração declarada pela fonte` de `estimativa para o trecho/prática`. As estimativas didáticas existentes podem continuar úteis quando rotuladas. URL em português não comprova áudio em português; o módulo já distingue um vídeo em inglês com página traduzida, e esse cuidado deve ser generalizado.

Priorizar os materiais principais das etapas antes de revisar todas as referências de consulta. Sem acesso à fonte, registrar desconhecido ou pendente. Não usar a data da revisão do percurso como se todos os certificados externos tivessem sido conferidos naquele dia.

Ampliar a verificação de links para URLs dos dados TS/JSON. Um link que responde não comprova curso gratuito, idioma correto ou certificado; essas condições precisam de revisão editorial. Remoções de materiais não podem alterar IDs de progresso das etapas.

## Laboratório .NET, MCP, agentes e RAG

### Kits reproduzíveis

Entregar coleção Bruno com ambiente local, OpenAPI e fixtures: resposta completa, campo ausente, null, erro de contrato e acesso recusado. Sem tokens reais ou dados da empresa. Manter primeiro o exercício de leitura de HTTP/JSON e depois o código da API.

Empacotar os exemplos C# em projetos com `.csproj`, SDK documentado e dependências fixadas. Separar API local, servidor MCP e cliente/teste. Preservar os Program.cs existentes como referência até os projetos passarem por compilação e testes em ambiente com `dotnet`.

O guia atual fixa `ModelContextProtocol` 1.4.1 e explica que não deve misturar documentação v1/v2. A fonte oficial já apresenta a família 2.x: isso exige uma decisão de compatibilidade documentada, não atualizar pacote automaticamente. Fixar também o Inspector usado na reprodução. Para cada versão escolhida, registrar SDK, comandos e resultado de compilação real.

### Contratos e tools

Definir nome, finalidade, schema de entrada, saída, erro, ausência de campo e autorização. A anotação de leitura não substitui autorização. Log de stdio deve continuar fora de stdout do protocolo. Testar descoberta e chamada da tool, IDs inválidos, cancelamento e falha do serviço de origem.

Evoluir o exemplo fixo para integração com a API somente depois de seu contrato estar testado. Retornos estruturados devem usar a API suportada pela versão real do SDK, sem traduzir cegamente exemplos Python/TypeScript da skill MCP Builder.

### Agentes e roteamento

Os oito casos atuais são didáticos e determinísticos. Acrescentar cenários de colisão, rota agenda, pedido ambíguo, dado parcial, acesso negado e conteúdo externo malicioso. Medir resultado esperado, tool escolhida, argumentos e chamadas executadas.

Uma avaliação com LLM, quando adicionada como exercício separado, precisa registrar modelo/versão, repetições, custo e variação. Uma resposta predeterminada no playground não demonstra resistência de um modelo real a prompt injection.

### RAG com evidências

Usar pequeno corpus fictício versionado. Primeiro explicar busca lexical e avaliação da recuperação; depois embeddings e geração, se houver motivo didático. Guardar identificação da fonte, trecho e versão; separar avaliação de recuperação da avaliação da resposta.

Critérios: pergunta respondível, sem fonte, fontes conflitantes, documento desatualizado e instrução maliciosa dentro de material recuperado. A resposta deve citar evidência ou declarar insuficiência. Conteúdo recuperado é dado, não autorização para tools.

O GitHub Pages continua estático. RAG com serviço/modelo real será kit executado localmente ou infraestrutura futura definida à parte. Nunca colocar chave de API em JavaScript público. A Furina permanece programada e não depende desses serviços.

## Furina: plano de animação

### Dependência artística

A referência concreta é a arte existente, incluindo cabelo, roupa, cores e expressões aprovadas. O asset de quatro poses foi examinado; a descrição de inspiração não justifica redesenhar a personagem.

O rig atual usa cabeça com cabelo/olhos, torso, dois braços inteiros e pernas juntas. Falta separar pálpebras, rosto e mechas; braços/antebraços/mãos; coxas/canelas/pés. Articulações precisam de preenchimento oculto, sobreposição e pivôs no mesmo registro. Sem isso, ampliar a rotação pode expor cortes. Um runtime diferente sozinho não corrige o recorte.

### Escolha técnica

| Opção | Adequação | Dependência e limite | Encaminhamento |
| --- | --- | --- | --- |
| DOM atual | Mantém integração, controles e fallback já prontos | Cinco recortes limitam articulação; qualidade visual ainda precisa de teste | Preservar enquanto a prova é preparada |
| Rive | Estados interativos e integração React; candidato para movimentos discretos e expressivos | Precisa de asset `.riv` real e editor; runtime MIT não equivale a exportação sem condições | Prova com arte fiel, medir tamanho e transições |
| Spine | Candidato forte para rig de personagem raster, ossos e deformação | Projeto, atlas/export compatível e licenciamento próprio do editor/runtime | Prova apenas com caminho de licença definido |

Consulta oficial em 03/10/2026: Rive oferece exportação gratuita com splash screen; exportação sem splash está nos planos pagos. Spine possui termos próprios para integração e distribuição. O estudo não assume licença adquirida nem instala dois runtimes em produção. A decisão depende da fidelidade do protótipo, condições de exportação e custo de execução.

### Prova antes da integração

Produzir idle com respiração/piscar, olhar/interação, arraste e uma comemoração curta. Congelar aparência e testar passagens entre estados, não apenas loops isolados. Um único controlador deve possuir cada articulação; evitar escritores de transform concorrentes.

Preservar estados e prioridades existentes: ocultação, pausa/movimento reduzido, arraste, comemoração, interação, dica e idle. Eventos de conclusão já existem e devem alimentar a animação. Não redesenhar a lógica de aprendizagem para servir ao runtime.

Interface proposta do adaptador: estado atual, direção do olhar, preferência de movimento, comando de comemoração e confirmação de fim. Controles e texto acessível continuam no DOM. Runtime carrega sob demanda, tem cleanup, para com aba oculta e retorna à imagem estática em falha.

Critérios: corpo unido em todo o ciclo; nenhum salto na mudança de estado; pausa imediata; retomada suave; movimento reduzido estático; posição persistida e acessível; ausência de bloqueio de formulário; funcionamento sem rede após carregar os assets locais. Medir custo de frames, memória e carregamento no dispositivo usado para estudar. Não prometer 60fps em todo aparelho sem medição.

## Ordem de execução

| Etapa | Entrega | Dependências | Condição de saída |
| --- | --- | --- | --- |
| 1 — confiança | Persistência, schema, cronômetro e rascunhos; CI de regressão | Base atual e fixtures de dados antigos | A01–A05 e A08 aprovados |
| 2 — continuidade e leitura | Backup, tokens, alvos, navegação e filtros | Schemas da etapa 1; metadados revisados dos materiais principais | Fluxos reais aprovados nos dois temas e sem perda de registro |
| 3 — laboratório reproduzível | Bruno, API e MCP com projetos fixados | Ambiente .NET e contratos de fixtures | Build/testes reais e reprodução independente do README |
| 4 — Furina | Recortes completos, prova comparativa e um renderer escolhido | Arte pronta; condições de exportação/licença verificadas | Checklist visual e de interação aprovado |
| 5 — aprofundamento | Avaliação de agentes e RAG; eventual offline integral | Kits da etapa 3 e necessidade de uso definida | Evidências mensuráveis e limites didáticos explícitos |

A preparação da arte pode avançar enquanto a etapa 1 acontece. Cada entrega deve ter escopo revisável; refatoração visual ampla não deve ser misturada com migração de progresso.

## Matriz de validação para as implementações

| Dimensão | Casos necessários | Evidência esperada |
| --- | --- | --- |
| Dados | Progresso antigo, inválido, parcial, bloqueio de storage, duas abas, importação conflitante | Fixtures e regressões de leitura/gravação; resumo de restauração |
| Foco | Pausar/retomar, recarregar, trocar etapa, completar sessão, meta 140 caracteres | Segundos exatos; aviso final acessível sem anúncio a cada segundo |
| Estudo | Rascunho sem tentativa, conclusão/reabertura, revisão e retomada | Sem perda de texto; critérios e datas preservados |
| Interface | Início, módulo, laboratório, atalhos, vazios, erros, sucesso, loading | Testes de fluxos e capturas dos estados pertinentes |
| Tema | Claro, Escuro, Sistema, links diretos e abas | Contraste de texto, controle e foco; sem clarão inicial |
| Acessibilidade | Teclado, zoom/reflow, movimento reduzido, leitor de tela e toque | Matriz WCAG 2.2 AA; achados reais com reprodução |
| Responsividade | Tela estreita, tablet, desktop, paisagem, teclado virtual e safe areas | Nenhum controle perdido; rolagem de código isolada |
| Animação | Estados interrompidos, queda de frames, aba oculta, pausa e resize | Vídeo/captura de ciclos; inspeção de articulações e medições |
| Laboratório | Build .NET, Bruno, OpenAPI, descoberta/chamada MCP, erros e contratos | Logs e testes reproduzíveis com versões registradas |
| Desempenho | Bundle, entrada e navegação de rota, interações e layout | Medição comparável antes/depois; limites acordados sobre a base |

Essa matriz é o trabalho a executar, não uma certificação da versão atual.

## Referências oficiais consultadas

- [W3C — tamanho mínimo de alvo, WCAG 2.2 AA](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum).
- [W3C — foco não encoberto, mínimo](https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum.html).
- [W3C — alternativas a movimentos de arraste](https://www.w3.org/WAI/WCAG22/Understanding/dragging-movements.html).
- [Rive — runtimes e licença MIT](https://github.com/rive-app/help-center/blob/master/runtimes/overview.md).
- [Rive — planos e condições de exportação](https://rive.app/pricing).
- [Spine — licença dos runtimes](https://en.esotericsoftware.com/spine-runtimes-license) e [licença do editor](https://en.esotericsoftware.com/spine-editor-license).
- [MCP C# SDK — releases e versões](https://github.com/modelcontextprotocol/csharp-sdk/releases).

As condições de serviços e versões devem ser verificadas novamente ao implementar. Duas páginas específicas de documentação Rive sobre meshes/weights não ficaram acessíveis na consulta; nenhuma decisão deste estudo dependeu de supor seu conteúdo.
