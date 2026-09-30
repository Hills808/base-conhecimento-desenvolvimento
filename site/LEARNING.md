# Método e progressão do aprendizado

Revisão: 30/09/2026.

## O que foi identificado

Os percursos já tinham níveis, exemplos e testes objetivos. Faltavam um ponto de entrada baseado em demonstração, situações diferentes do exemplo, um registro de dificuldades e uma fila que abrisse a revisão certa. A revisão anterior do painel levava ao último módulo mesmo quando a pendência estava em outra etapa.

## Estrutura implementada

- Diagnóstico opcional nas dez áreas: quatro tarefas, critérios visíveis e autoavaliação. A primeira lacuna sugere um nível; nenhum nível é aprovado por esse diagnóstico.
- Disponibilidade semanal e duração de bloco ajustáveis. O cálculo de sessões é uma referência de agenda, sem prazo prometido para domínio.
- Básico (níveis 0–1): reconhecer termos, acompanhar exemplos e executar com apoio.
- Intermediário (nível 2): combinar componentes, usar contratos e investigar divergências.
- Avançado (níveis 3–4): analisar falhas, justificar decisões, validar limites e responder a um requisito novo.
- Um treino de transferência por nível geral (45) e por etapa do laboratório (14). Cada um tem caso novo, análise esperada, variação e critérios de autoavaliação.
- Registro de dificuldade por conceito, execução, contrato ou explicação, com indicação do próximo passo.
- Revisões locais com intervalos iniciais de 1, 7 e 30 dias. Esses números são uma decisão de produto ajustável, não um intervalo universal comprovado. Uma revisão antecipada não avança o intervalo; precisar de apoio agenda retomada em um dia.
- Fila de revisões com links para a etapa e o treino correspondentes. Entregas antigas mantêm sua revisão de sete dias quando ainda não têm treino registrado.
- Dez guias novos para consulta offline, sincronizados com os 59 casos.

## Limites de validação

Questões de alternativa fornecem correção específica. Texto livre, código e artefatos externos exigem comparação pelo estudante e revisão humana quando indicada. O registro de autonomia não é correção automática nem certificação. Os testes e rubricas do projeto continuam necessários.

## Referências

- [IES/WWC — Organizing Instruction and Study to Improve Student Learning](https://ies.ed.gov/ncee/wwc/PracticeGuide/1): prática espaçada, alternância entre exemplos e problemas, perguntas explicativas e recuperação.
- [MDN — About Learn web development](https://developer.mozilla.org/en-US/docs/Learn_web_development/About): fundamentos, testes de habilidades e desafios integrados.
- [Microsoft Learn — introdução ao C#](https://learn.microsoft.com/pt-br/training/paths/get-started-c-sharp-part-1/): unidades progressivas, exercícios e verificações.
- [Arquitetura MCP](https://modelcontextprotocol.io/docs/2026-07-28/learn/architecture), [segurança MCP](https://modelcontextprotocol.io/docs/2026-07-28/tutorials/security/security_best_practices) e [SDK C# oficial](https://github.com/modelcontextprotocol/csharp-sdk): base técnica. Registre no projeto a versão efetivamente usada; um SDK pode não implementar toda extensão recente.
- [Skills no Claude Code](https://code.claude.com/docs/en/skills): formato e comportamento específicos do produto. A disponibilidade e as permissões dependem do host.

APP → ROUTER → AGENT → TOOL e os estados resolved, partial, ambiguous e out_of_scope são convenções do assistente fictício da trilha. Não são uma arquitetura ou enumeração exigida pelo MCP. Casos de perfil, atividades e valores usam somente dados de demonstração e não produzem recomendações de investimento.

## Verificação técnica

`npm run check:learning` verifica cobertura, sincronização dos guias e comportamento do agendamento. A compilação de produção executa os validadores de currículo e método antes de gerar o site.
