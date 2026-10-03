# Auditoria de interface — 3 de outubro de 2026

Público: estudantes e pessoas iniciando em tecnologia. Finalidade: aprender com apoio, praticar e demonstrar entendimento; o Laboratório conecta APIs, agentes, MCP e .NET em um projeto fictício. Mantidas identidade aprovada, conteúdo, publicação pública, funcionalidades e chaves de armazenamento.

## Skills instaladas e aplicação

As cinco versões instaladas foram lidas integralmente, sem reinstalação ou substituição. Os SKILL.md foram acessados em `/root/.codex/skills/remote-skills` pelo provedor de skills do ambiente.

| Skill | Aplicação | Evidência |
| --- | --- | --- |
| frontend-design | Plano de cores, tipografia, hierarquia e leitura; crítica de capturas antes e depois | `src/student-ui.css`: tema de estudo preservado, índice de aula, largura de leitura e código legível |
| web-design-guidelines | Critérios locais de acessibilidade, foco, movimento, toque, overflow e navegação | `src/App.tsx`: foco contido e fundo inert; `src/Laboratory.tsx`: destino recebe foco; CSS: alvos de 44px e scroll-margin |
| vercel-react-best-practices | Regras bundle-conditional e rerender-lazy-state-init | Laboratório e trilhas continuam lazy; eliminadas leituras repetidas do mesmo progresso na inicialização de Laboratory |
| agent-browser | Observação → ação → nova observação → confirmação, com seletores do DOM renderizado | Testes na versão pública, capturas e conferência de URL, aula e nível após navegação |
| webapp-testing | Reconhecimento antes da interação, fluxos funcionais, persistência e inspeção de logs | Build, TypeScript, validadores e testes de navegador descritos abaixo |

O navegador foi operado pela API CUA permitida pelo ambiente, conforme a adaptação de agent-browser. A abordagem de webapp-testing foi aplicada por essa API, em vez de iniciar outra sessão com Python Playwright. O helper `with_server.py --help` foi consultado; ele não foi necessário para testar a versão publicada.

## Problemas e correções

| Gravidade | Problema | Correção e localização |
| --- | --- | --- |
| Média | CSS antigo carregado tardiamente altera o tema do laboratório | `src/main.tsx`: laboratory.css entra antes do tema final; removida importação tardia de Laboratory |
| Média | Vários blocos introdutórios antes da aula dificultam retomar o estudo | `src/Laboratory.tsx`: faixa com etapa atual e acesso direto, sem remover a introdução |
| Média | Aula longa sem acesso rápido a prática, teste e entrega | `src/Laboratory.tsx` e CSS: índice persistente, mapa lateral com limite de altura e foco no destino |
| Alta | Painel marcado como modal permite escapar pelo teclado | `src/App.tsx`: ciclo Tab/Shift+Tab, conteúdo de fundo inert e restauração do foco |
| Média | Selecionar módulo pelo atalho mantém painel aberto | `src/App.tsx`: encerramento e limpeza da busca ao navegar |
| Alta | Atalho de outra etapa muda URL sem atualizar laboratório já aberto | `src/App.tsx` e Laboratory: sincronização de navegação, aula e nível |
| Baixa | Código com fonte pequena e filtros com tema antigo | `src/student-ui.css`: código 15px, filtros coerentes e áreas de toque de 44px |

## Validação executada

- Build Vite e TypeScript sem erros.
- Validadores: 45 níveis, 63 situações explicadas, 59 casos de prática, 14 oficinas/42 exemplos e 8 cenários didáticos. São verificações do conteúdo e das simulações, não de modelos reais.
- GitHub Actions: publicação e validação de conteúdo aprovadas no commit de implementação.
- Navegador desktop: entrada direta na aula; índice com foco no destino e título abaixo da barra; mapa disponível durante a leitura; ausência de overflow horizontal nas páginas observadas.
- Atalho: abertura, foco inicial, Tab/Shift+Tab, Escape e restauração de foco; busca sem resultados com orientação; mudança da etapa 1 para a etapa 3 com URL, título e nível coerentes; passagem para módulo de APIs com modal fechado.
- Biblioteca do módulo APIs: filtro de vídeos aplicado e retorno ao laboratório.
- Quiz: resposta incorreta exibe motivo e onde revisar; nova tentativa correta; conclusão permanece bloqueada quando faltam evidências.
- Persistência: resposta escrita e acerto continuam após recarga. Dados fictícios inseridos no teste foram removidos pela própria interface.
- Tema confirmado por estilos computados: fundo do laboratório rgb(24,36,61), código 15px.

## Limitações e continuidade

- Responsividade verificada por leitura do CSS: uma coluna em até 700px, mapa sem sticky no celular, atalhos que quebram linha e alvos de toque. Não foi executado teste em viewport móvel: o driver disponível não expõe redimensionamento/emulação. Não equivale a homologação em aparelho físico.
- Redução de movimento revisada no código; preferência do sistema não foi emulada.
- Não foi feita auditoria integral com leitor de tela nem benchmark Lighthouse. Tamanho do JavaScript principal observado no build: aproximadamente 390kB, 116kB gzip; carregamento separado das trilhas foi preservado. Não há alegação de ganho medido de velocidade.
- Logs inspecionados incluíram falhas da extensão do navegador (`chrome-extension://`); elas não demonstram um defeito da aplicação.
- Curadoria e validação de URLs no workflow passaram; esta auditoria não revisou pedagogicamente todos os recursos externos nem executou o backend .NET.
- Próxima verificação recomendada: aparelho móvel real, leitor de tela e navegação completa em todas as disciplinas.
