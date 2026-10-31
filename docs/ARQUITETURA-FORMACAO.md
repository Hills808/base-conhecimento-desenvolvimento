# Curva Aberta: arquitetura de formação e experiência de estudo

Data: 30/10/2026, São Paulo. Base inspecionada: commit `5373b05`.

Estado: análise e especificação propostas. Este documento não representa aulas implementadas, exemplos compilados ou um redesign publicado. A implementação atual continua em `site/`, com React, TypeScript e Vite.

## 1. Decisão principal

Organizar o Curva Aberta em uma formação principal de desenvolvimento backend com C#/.NET e integrações, construída sobre um projeto contínuo. O laboratório de autonomia deve evoluir para essa formação; autonomia passa a ser o método de todas as aulas. O laboratório MCP torna-se aprofundamento conectado à mesma formação. O catálogo permanece como biblioteca de consulta.

O objetivo observável é conseguir receber uma demanda limitada, esclarecer o contrato, implementar, testar, investigar falhas e explicar decisões e limitações. Finalizar o percurso não equivale a certificação ou garantia de emprego, cargo ou domínio de qualquer sistema.

### Personalização que orienta a proposta

- O usuário pede português simples, exemplos próximos do trabalho, explicações de código, prática e capacidade de explicar sem depender de uma resposta pronta.
- O foco declarado reúne C#/.NET, APIs, Bruno, contratos, testes e integração com agentes, MCP, RAG e skills. A proposta conecta essas áreas em uma sequência, sem exigir cinco stacks simultâneas.
- O pedido atual explicita insatisfação com navegação confusa e ensino genérico. Mais cards, links ou formulários não resolvem essa reclamação.
- A identidade jovem, legível e própria, com Furina e modos claro/escuro, deve continuar. A interface de estudo precisa dar prioridade ao trabalho do estudante.
- A hipótese de projeto é que uma situação concreta, explicação linha a linha, feedback específico e aplicação acumulativa serão úteis. Isso será avaliado nas primeiras aulas; não é um diagnóstico de personalidade ou de “estilo de aprendizagem”.

Não há demonstração recente suficiente para atribuir um nível técnico global. Também não há disponibilidade semanal confirmada neste estudo. Nem tempo de carreira nem projetos existentes provam domínio de cada pré-requisito. Um diagnóstico prático deve localizar lacunas sem mandar recomeçar tudo.

## 2. Auditoria do que existe

Inspeção: código, conteúdo das oito etapas de autonomia, estrutura dos módulos e do laboratório MCP, registros de continuidade e interface pública desktop. As observações de usabilidade abaixo são uma avaliação especializada, não resultados de um teste com usuários.

| Prioridade | Evidência concreta | Consequência provável | Correção proposta |
| --- | --- | --- | --- |
| Alta | `App.tsx` e `StudyResume.tsx` apresentam módulos, MCP e autonomia como entradas concorrentes. A home ainda enfatiza MCP. | O estudante precisa decidir qual percurso é o principal antes de aprender. | Uma formação principal; uma próxima ação; biblioteca em navegação secundária. |
| Alta | Na home pública, viewport 1363 × 936, o título “Continue daqui” iniciou em y=1290. | Retomar o estudo fica atrás da apresentação e de várias chamadas para começar. | Retomada na primeira tela, inclusive para quem volta após uma pausa. |
| Alta | `autonomy.json` vai de variáveis a entrega ponta a ponta em oito etapas. A etapa de funções acrescenta coleção, laço e acumulador juntos. | Títulos sugerem cobertura maior que a prática oferecida; conceitos intermediários podem ficar implícitos. | Separar habilidades e introduzir dependências por demonstração. |
| Alta | A etapa HTTP manda sair para a oficina MCP; a de testes manda seguir um guia externo de xUnit. | O percurso perde continuidade justamente em transições difíceis. | Kit e explicação necessários dentro da missão; fonte externa como apoio. |
| Alta | `AutonomyLab.tsx` exige três textos de 40 caracteres, checks e campos extras de ajuda. `evidenceReady` valida presença, não compreensão. | Produção de texto pode substituir prática; não há retorno sobre o erro conceitual. | Evidência adequada à tarefa: previsão, tabela, teste, arquivo e explicação curta, com feedback específico. |
| Alta | `canOpen` exige que todos os predecessores estejam completos e sem revisão vencida. | Uma pausa pode bloquear práticas posteriores já iniciadas. | Revisão sugerida e diagnóstico focal; atraso de calendário não revoga competência. |
| Média | A primeira tela de autonomia usa grande parte da altura com título, introdução, método e mapa; o código começa perto do fim do viewport observado. | A primeira ação demora a aparecer. | Cabeçalho curto e problema concreto no início. |
| Média | `ModuleJourney.tsx` combina aula, quiz, treino de autonomia, notas públicas, checklist e revisão; autonomia e MCP têm modelos próprios. | Repetição de rituais, estados e nomes dificulta entender o que realmente conclui a aula. | Um vocabulário e um ciclo de prática compartilhados. |
| Média | `main.tsx` importa várias folhas globais de evolução visual; novas telas continuam somando CSS. | Risco de divergências de hierarquia e sobrescritas. A quantidade de arquivos, sozinha, não prova defeito. | Consolidar tokens e componentes gradualmente, com comparação visual. |
| Média | Na autonomia, navegação entre etapas usa botões e `pushState`. | Etapas não oferecem naturalmente abrir em nova aba/copiar destino. | Links nativos para navegação; botões para ações. |
| Média | No CSS móvel da autonomia, o mapa inteiro vem antes da aula e vira uma coluna até 520px. | Oito itens podem empurrar ainda mais o conteúdo para baixo. | Mapa recolhido no celular; missão atual imediatamente visível. Esta conclusão é de código, sem homologação física. |

O que merece ser preservado: rascunhos, backup, temas, foco opcional, critérios, kits, filtros editoriais, links profundos, notas compartilhadas e arte da Furina. Os módulos e kits já têm práticas úteis; a correção é reorganizar e aprofundar, não descartar tudo.

### O que o laboratório atual ensina e o que ainda não sustenta

As oito etapas são uma introdução útil à previsão de execução, limites, funções, uma consulta HTTP, uma API mínima, testes, extração de regra e pequena entrega. Não sustentam sozinhas uma formação profissional: persistência, SQL, modelagem mais completa, erros, async, testes de integração, autorização, observabilidade, operação e colaboração exigem unidades próprias. Algumas dessas áreas aparecem em outros módulos; falta conectá-las e demonstrar transferência entre elas.

## 3. Como definir progresso

Separar três dimensões: conteúdo visitado, prática demonstrada e retenção revisitada. Nunca exibir “competência verificada” quando só houve marcação pessoal.

| Dimensão | Demonstração esperada | Forma de conferir |
| --- | --- | --- |
| Compreender | Prever um comportamento e explicar a causa. | Pergunta com justificativa e feedback por erro comum. |
| Construir | Implementar uma pequena mudança a partir de um contrato. | Casos de teste e execução reproduzível. |
| Investigar | Reproduzir uma falha, localizar a camada e testar uma hipótese. | Registro curto de hipótese, evidência e correção. |
| Explicar | Relacionar problema, escolha, alternativa e custo. | Rubrica com exemplos de fala; revisão humana quando disponível. |
| Transferir | Resolver uma variação e outro domínio sem receber a receita. | Exercício novo com resultados observáveis. |
| Reter | Reconstruir a ideia após um intervalo. | Recuperação curta, sem reescrever toda a aula. |

Estados de aprendizagem por habilidade: ainda não tentei; fiz com apoio; fiz e expliquei; adaptei a outra situação. A origem da avaliação fica explícita: autoavaliação, comparação determinística no site, testes executados localmente e informados pelo estudante, ou revisão humana registrada. Importar um relatório de testes não é uma validação independente nem autenticação da autoria.

Uma boa entrega cumpre os casos de aceite, permite explicar o caminho dos dados e suporta uma mudança pequena. Segurança tem critérios obrigatórios específicos: um caminho que permite acessar dados de outro usuário não é compensado por uma nota média alta.

### Diagnóstico de entrada

Até cinco tarefas curtas, podendo pausar: prever um programa; corrigir uma fronteira; ler um JSON com ausência/null/zero; interpretar sucesso/404/sem conexão; explicar uma pequena decisão. Estimativa editorial inicial de 20–35 minutos, a calibrar.

Cada tarefa permite “não sei ainda”. Quem já demonstra a habilidade pode confirmar com uma variação e encurtar aquela unidade. A lacuna remete à aula correspondente. Não se exige escrever um texto longo para provar que não sabe. O resultado é um ponto de partida por habilidade, não um rótulo de iniciante/pleno/sênior.

## 4. Projeto contínuo

Projeto didático: **Mesa de atendimento**, um sistema fictício para registrar solicitações, consultar seu estado e produzir um resumo sustentado pelos dados disponíveis. O domínio permite praticar contratos, ausência de informação, roteamento e consulta por ferramentas sem importar sistemas, nomes internos ou dados do trabalho.

A mesma base evolui de console para API .NET, persistência, testes, controle de acesso, integração externa e ferramenta MCP de consulta. Interface gráfica complexa fica fora do núcleo. O projeto de estudo é separado da infraestrutura do próprio Curva Aberta: estudar SQL não implica migrar as notas públicas do site.

Vocabulário inicial: solicitação, categoria, prioridade, estado e resumo. Começar com duas ou três propriedades; acrescentar dados somente quando a missão precisar. Não entregar um modelo empresarial completo na primeira aula.

Marcos demonstráveis:

1. Um programa pequeno aplica uma regra e explica os valores.
2. Uma API tem contrato e casos reproduzíveis no Bruno.
3. Uma entrega mantém dados após reiniciar e trata inconsistências.
4. Um serviço consegue ser testado, observado e investigado.
5. Uma ferramenta de consulta responde com limites e evidências explícitos.
6. Uma demanda nova é implementada, revisada e defendida sem tutorial.

Para evitar decorar um único domínio, avaliações de transferência usam reservas de sala ou catálogo fictício. Mais tarde, uma fatia delimitada de outro projeto pessoal pode servir como transferência. Isso não exige reconstruir o Visiora nem presume que seu repositório foi auditado.

## 5. Arquitetura do currículo

As 45 missões abaixo são um inventário editorial proposto, não 45 aulas já escritas. O número não é meta de produtividade; unidades podem ser divididas após o piloto. A sequência completa fica disponível como mapa, enquanto a tela diária mostra uma missão.

HTTP básico aparece cedo para dar utilidade imediata ao contexto de integrações. Antes de construir servidores ou tools, entram os fundamentos C# necessários. Depuração, comunicação e verificação acompanham todas as fases; não ficam reservadas ao final.

| Fase | Missões propostas | Pré-requisito | Entrega de passagem |
| --- | --- | --- | --- |
| 0. Localizar o começo | D01 diagnóstico por tarefa; D02 editor, terminal, SDK e leitura de erro; D03 Git, diff e primeiro commit explicável. | Nenhum; diagnóstico pode indicar partes já conhecidas. | Executar, alterar e explicar um programa; localizar arquivo e mudança no diff. |
| 1. Entender os dados e a conversa | H01 pedido e resposta HTTP; H02 objetos, listas, tipos, null/ausência/zero; H03 chamada Bruno e comparação esperado/obtido; H04 contrato, 200/400/404 e falta de conexão. | Leitura básica; kit local guiado para execução. | Reproduzir consulta, identificar uma divergência e mostrar a evidência. |
| 2. Raciocinar em C# | C01 entrada/processamento/saída e atribuição; C02 tipos, conversão e TryParse; C03 condições e fronteiras; C04 funções, parâmetros e retorno; C05 coleções, laços e acumulador; C06 strings, valores opcionais e depuração. | Ambiente executável; cada missão exige a anterior quando usa seu conceito. | Regra de prioridade/estado em console, com tabela de casos e explicação linha a linha. |
| 3. Modelar e verificar regras | M01 classe/record e instâncias; M02 enum e transições válidas; M03 exceções versus resultado esperado; M04 xUnit e testes parametrizados; M05 refatorar mantendo comportamento. | C04–C06; usar objetos antes de falar de camadas. | Regra de transição com testes que detectam uma regressão introduzida de propósito. |
| 4. Construir uma API | A01 rota, parâmetro e resposta; A02 POST, DTO e validação; A03 dependências e tempo de vida em exemplos concretos; A04 OpenAPI/Swagger comparado ao comportamento; A05 teste de integração e contrato de erro. | H01–H04 e regras modeladas/testadas. | GET e POST com sucesso, entrada inválida e ausência; documentação e chamadas coerentes. |
| 5. Persistir com entendimento | P01 tabela, chave e restrição; P02 SELECT, filtros, JOIN e consulta parametrizada; P03 EF Core e mapeamento; P04 migration e persistência após reinício; P05 transação e conflito de atualização. | API funcional; SQL antes de abstração pelo ORM. | Duas tabelas relacionadas, consulta reproduzível e atualização que não perde dados silenciosamente. |
| 6. Operar e integrar | O01 Task, async/await, HttpClient e cancelamento; O02 timeout, falha externa e retry com critério; O03 identidade, autorização por recurso e segredos; O04 logs, correlação e diagnóstico; O05 CI, configuração, execução empacotada e rollback. | API, testes e persistência. | Demonstrar falha externa, negar acesso indevido, rastrear uma requisição e reproduzir uma versão. |
| 7. Entregar como equipe | E01 demanda, dúvidas e critérios de aceite; E02 separar responsabilidade por necessidade; E03 PR pequeno, revisão e conflito Git; E04 incidente, correção e explicação de decisão. | Mudança ponta a ponta executável. | Uma mudança de requisito com diff compreensível, testes, instruções e análise de impacto. |
| 8. IA aplicada e ferramentas | I01 regra determinística versus decisão do modelo; I02 contrato de tool e MCP C# somente leitura; I03 roteamento, agente e handoff; I04 recuperação de documentos e avaliação RAG; I05 skill, permissões, conteúdo não confiável e regressões. | Contratos, async, falhas, autorização, testes e logs. | Fluxo APP → ROUTER → AGENT → TOOL com estados resolved/partial/ambiguous/out_of_scope e ausência tratada explicitamente. |
| 9. Consolidar autonomia | F01 demanda sem receita; F02 manutenção em código que não escreveu; F03 defesa e transferência para outro domínio. | Competências necessárias à demanda demonstradas. | Entrega reproduzível, diagnóstico de uma falha e adaptação após uma pergunta ou requisito novo. |

Total: 3 + 4 + 6 + 5 + 5 + 5 + 5 + 4 + 5 + 3 = 45 missões.

### Profundidade e escolhas técnicas

- C#: ensinar expressões, fluxo e valores antes de LINQ; percorrer explicitamente uma coleção antes de resumir com operadores. Ensinar por que uma exceção acontece antes de esconder tudo em try/catch.
- SQL: começar com SQLite local para reduzir instalação, mantendo explícitas suas particularidades. PostgreSQL pode ser uma oficina posterior de transferência. Não tratar provedores como equivalentes em concorrência ou tipos.
- Arquitetura: começar com monólito pequeno e responsabilidades claras. Interfaces aparecem quando substituição/testabilidade justificarem. Clean Architecture, CQRS, filas e microsserviços ficam como aprofundamentos motivados por problemas demonstrados, não pré-requisitos universais.
- Testes: comparar esperado/obtido desde H03 e C01; formalizar xUnit em M04 e integração em A05. Mostrar teste fraco que passa com código errado, não apenas a cor verde.
- Segurança: nunca usar tokens reais nos exercícios; ensinar no momento adequado autenticação versus autorização, entrada não confiável, exposição de logs, consultas parametrizadas e autorização dentro da tool/serviço. Prompt não substitui controle de acesso.
- RAG: distinguir recuperar, ordenar evidências e gerar; avaliar pergunta sem resposta, documento conflitante, fonte inadequada e instrução maliciosa no material recuperado. Ter conjunto de perguntas com fontes esperadas.
- IA paga: manter simulação determinística gratuita claramente identificada. Execução com modelo real é oficina opcional, com custos/requisitos explícitos e sem chave no navegador. Não chamar a simulação de avaliação de um LLM real.
- Inglês técnico: pequenas leituras orientadas de erro/documentação, depois da explicação em português; não abrir outra formação obrigatória paralela.

## 6. Padrão de uma aula

Cada missão tem um objetivo central e um resultado visível. Missão não é sinônimo de sessão: pode ocupar vários encontros. A aula oferece exemplo resolvido e exercício alternadamente, com apoio que diminui à medida que o estudante demonstra entendimento.

1. **Situação:** o que falhou ou precisa mudar, com dados pequenos e concretos.
2. **Previsão:** uma pergunta curta antes de executar; uma tabela pode substituir texto.
3. **Explicação:** uma ideia, código anotado e representação do fluxo quando ajudar.
4. **Prática guiada:** executar um passo, observar e interpretar; instruções de onde editar e qual comando usar.
5. **Erro intencional:** introduzir ou receber uma falha e descobrir qual caso a revela.
6. **Variação independente:** mudar a estrutura da situação, não apenas trocar números.
7. **Explicação:** mostrar a decisão e sua evidência; duração sugerida cresce de 30 segundos para 2 e depois 5 minutos.
8. **Próxima recuperação:** uma pergunta ou pequeno trecho, agendado conforme a dificuldade.

O exemplo resolvido continua acessível. Pedir pista não recebe penalidade. Pistas em três níveis: pergunta orientadora, indicação da região do problema, explicação resolvida. Depois da solução, oferecer outra variação para verificar reconstrução.

Cada erro relevante precisa de feedback: onde a previsão divergiu, qual conceito revisar e qual nova tentativa fazer. Mensagens como “errado, tente novamente” são insuficientes. Acerto por alternativa deve pedir uma pequena aplicação, sem burocratizar cada clique.

### Modelo de explicação profissional

Começar simples: “Entrou X, a regra fez Y, saiu Z”. Evoluir para “O problema era X; escolhi Y porque Z; considerei W; conferi com estes casos; esta limitação permanece”. Essa estrutura é apoio temporário. A avaliação aceita uma explicação natural que cumpra o objetivo.

Não exigir eloquência ou vocabulário sofisticado. “Não sei ainda; investigaria aqui por este motivo” pode ser uma boa resposta quando delimita a incerteza. Revisão humana é especialmente importante para avaliar clareza e decisões; o site não deve fingir corrigir semanticamente uma fala que não ouviu.

## 7. Aula de referência: quando uma solicitação está atrasada?

Missão C03, depois de variáveis, tipos, comparações e execução local. Objetivo: transformar uma regra de fronteira em condição e explicar quais casos detectam uma implementação incorreta. Conteúdo autoral proposto; o trecho abaixo ainda precisa ser compilado e integrado ao kit antes de publicação como aula validada.

### Situação e contrato

Uma solicitação deve ser sinalizada quando espera **30 minutos ou mais**. Valores negativos são inválidos. Para esta primeira regra, `minutos` é inteiro e já foi lido corretamente; a conversão do texto pertence à missão anterior.

Antes de mostrar código, prever o resultado para -1, 0, 29, 30 e 31. O site aceita a seleção por linha e explica divergências, sem exigir um parágrafo.

| Entrada | Resultado esperado | Por quê |
| --- | --- | --- |
| -1 | Duração inválida | Fora do domínio aceito. |
| 0 | Dentro do prazo | Zero é uma duração válida neste contrato. |
| 29 | Dentro do prazo | Ainda abaixo de 30. |
| 30 | Atrasada | “Ou mais” inclui a fronteira. |
| 31 | Atrasada | Ultrapassou a fronteira. |

### Exemplo explicado

```csharp
int minutos = 30;

if (minutos < 0)
{
    Console.WriteLine("Duração inválida");
}
else if (minutos >= 30)
{
    Console.WriteLine("Atrasada");
}
else
{
    Console.WriteLine("Dentro do prazo");
}
```

`int minutos = 30` guarda a duração do caso que será avaliado. A primeira condição separa uma entrada inválida antes da classificação. Se ela for falsa, `>= 30` verifica se a duração alcançou o limite. O `else` final cobre os inteiros válidos que sobraram: de zero a 29. Só um dos três blocos imprime a classificação.

`>` e `>=` não são detalhes intercambiáveis: 30 é o caso que distingue os dois. Não usar analogia no lugar da regra exata. Um desenho de intervalos pode apoiar, acompanhado da tabela acessível.

### Prática com apoio

No projeto console já criado, trocar apenas o valor de `minutos`, executar `dotnet run` e comparar os cinco casos. Em seguida trocar `>=` por `>` e observar o caso que passa a divergir. Restaurar a regra e explicar por que a correção não deve mudar o caso 29.

Se `dotnet` não for reconhecido, abrir a ajuda de ambiente D02. Se não existir projeto no diretório, mostrar como localizar o `.csproj`. Erro de ambiente não deve ser tratado como erro de compreensão de condições.

### Feedback específico

| Resposta/erro observado | Feedback da aula | Próxima tentativa |
| --- | --- | --- |
| Classificar 30 como dentro do prazo | “A regra inclui 30. Compare o resultado de `30 > 30` com `30 >= 30`.” | Prever 29, 30 e 31 para os dois operadores. |
| Classificar -1 como dentro do prazo | “Ser menor que o limite não torna uma duração válida. Existe uma regra anterior sobre entradas negativas.” | Explicar por que a validação vem antes. |
| Declarar 0 inválido | “Neste contrato, a contagem pode ter acabado de começar. Inválido foi definido como negativo.” | Distinguir contrato dado de regra presumida. |
| Testar apenas 10 e 50 | “Os dois operadores dão o mesmo resultado nesses casos. Falta um teste que distinga as implementações.” | Acrescentar exatamente a fronteira. |

### Variação independente

Sem copiar o exemplo, usar o contrato: negativo é inválido; de 0 a 14 está no prazo; de 15 a 29 exige atenção; a partir de 30 está atrasada. Antes de codificar, escolher entradas que detectariam limites exclusivos por engano. Depois executar e comparar.

Gabarito acessível após a tentativa: -1 inválida; 0 e 14 no prazo; 15 e 29 atenção; 30 e 31 atrasada. O exercício acrescenta uma faixa: exige organizar decisões, não só mudar uma constante.

### Defesa e transferência

Perguntas: por que o caso 30 importa? Dois `if` independentes teriam sempre o mesmo comportamento de um `if/else if`? Se o contrato passasse a dizer “mais de 30”, o que mudaria?

Resposta de referência curta: “Usei `>=` porque 30 já precisa ser sinalizado. Testei 29, 30 e 31 para conferir a fronteira e mantive o teste de negativo separado. Se fosse mais de 30, o caso 30 mudaria e o operador seria `>`.”

Transferência posterior: classificar vagas restantes de uma sala, com zero significando lotada e negativo inválido. O estudante deve reconstruir a regra a partir do novo significado, não reutilizar mecanicamente “zero sempre válido”.

Evidência mínima: tabela comparada, programa executado e explicação da fronteira. Check pessoal registra a execução local; o site pode corrigir a previsão da tabela, mas não declarar que executou o C# do estudante. Retenção: em outra sessão, escolher o caso que distingue `>` e `>=`, com regra nova.

## 8. Revisão, ritmo e uso de IA

Três formatos de sessão, escolhidos pelo estudante: curta para recuperar e corrigir uma ideia; padrão para uma prática pequena; longa para integrar uma entrega. Sugestões iniciais de 15, 30 e 50 minutos são ajustáveis, sem promessa de terminar uma missão nesse tempo.

Revisões podem começar no próximo dia disponível, depois em torno de uma e três semanas, ajustadas ao resultado. Esses intervalos são heurística editorial, não fórmula universal. Agrupar habilidades relacionadas, limitar a sugestão de revisão da sessão e evitar dezenas de tarefas repetidas. Uma pausa não zera evidências.

Se uma habilidade necessária estiver frágil, a próxima missão recomenda a recuperação pontual com motivo explícito. A leitura e o rascunho continuam disponíveis. Apenas uma dependência conceitual não demonstrada condiciona o avanço recomendado; vencer uma data não bloqueia a prática inteira.

IA entra com função definida: explicar um erro, formular uma pista, revisar um teste, apresentar contraexemplo ou questionar uma decisão. Antes de pedir implementação, registrar problema, tentativa e resultado observado. Depois de receber ajuda, alterar o requisito ou reconstruir um trecho. Consultar sintaxe e documentação é normal no trabalho; o alvo é dependência de raciocínio terceirizado, não memorizar toda API.

Não é necessário adicionar um tutor de IA à plataforma para executar este método. Avaliação automática por modelo, se futuramente considerada, requer um estudo próprio de qualidade, privacidade e custos. Furina continua programada, contextual e sem IA.

## 9. Arquitetura da informação e direção visual

### Quatro destinos estáveis

| Destino | Pergunta que responde | Conteúdo principal |
| --- | --- | --- |
| Hoje | O que faço agora? | Uma retomada, resultado esperado, botão de continuar e uma revisão sugerida quando pertinente. |
| Formação | Como as peças se conectam? | Fases e dependências; diagnóstico; consulta ao percurso sem competir com a missão. |
| Meu projeto | O que já consigo demonstrar? | Marcos, evidências privadas, decisões, dúvidas e links locais informados. |
| Biblioteca | Onde aprofundo este assunto? | Materiais atuais com idioma, duração, nível, certificado e indicação de uso. |

Tema, backup, offline e preferências ficam em “Meu estudo” como utilidades. A busca continua acessível. GitHub permanece como referência secundária. As URLs antigas dos módulos e laboratórios continuam funcionando.

### Tela Hoje

Primeira visita: uma frase de objetivo e “Encontrar meu ponto de partida”. Visita seguinte: missão atual e “Continuar minha prática”. Nada de três cards equivalentes pedindo para escolher uma formação novamente.

Texto de exemplo: “Sua prática: corrigir uma regra de prioridade. Ao terminar, você consegue explicar o caso que revela o erro.” Mostrar o último passo salvo e onde executar. A revisão sugerida não compete em peso com a retomada, nem vira alerta vermelho por atraso.

### Tela de missão

Cabeçalho compacto com fase, título e objetivo. À esquerda, no desktop, navegação curta da fase atual, recolhível. No centro, uma coluna de leitura e trabalho; problema e primeira interação aparecem antes de explicações administrativas. Diagrama, código e tabela usam a largura necessária sem impor colunas minúsculas.

Apresentar passos com avanço claro e retorno livre. Manter “Ver aula inteira” para quem prefere consultar tudo. O estado da tarefa fica salvo; o botão de saída não apaga rascunho. Pistas aparecem junto do erro. Material externo fica junto do conceito que apoia.

No celular, mapa recolhido e conteúdo primeiro; nenhuma barra fixa cobre campos ou teclado. Código pode ter rolagem própria com indicação, sem provocar overflow da página. Testar zoom de 200%, teclado, foco após avançar e anúncio de feedback.

### Identidade visual proposta

Preservar a marca e o azul/índigo já reconhecível, com superfícies tranquilas e uma única cor principal de ação. Usar aparência contemporânea por tipografia, composição e resposta ao toque, sem transformar a aula em vitrine de efeitos.

Tokens candidatos, sujeitos à medição de contraste em todos os estados:

| Papel | Claro | Escuro |
| --- | --- | --- |
| Fundo de leitura | `#F5F7FB` | `#121823` |
| Superfície de trabalho | `#FFFFFF` | `#1B2432` |
| Texto principal | `#182235` | `#EAF0F8` |
| Texto de apoio | `#526078` | `#AFBED2` |
| Ação e foco | `#4149C8` | `#A6B4FF` |
| Divisor | `#D6DEEB` | `#3A485E` |

DM Sans para interface e leitura; mono apenas para código e valores que exigem alinhamento. Cabeçalhos da aula sem escala publicitária. Texto principal em 17–18px e entrelinha de aproximadamente 1,6, largura de 60–72 caracteres. Conteúdo alinhado à esquerda. Cards reservados a unidades que realmente agrupam informação; explicação contínua não precisa de uma caixa por parágrafo.

Inspiração Skiper UI aplicada a resposta de controles e transições discretas. Movimento acompanha ação e respeita redução de movimento. Furina preserva arte e personalidade, fica fora da área de resposta, pode ser pausada/ocultada e oferece dica contextual por solicitação. Comemoração breve celebra uma entrega; não interrompe leitura ou digitação.

Critério visual: em uma visita de retorno, conseguir identificar missão, resultado e ação principal sem procurar abaixo de vários painéis. Isso deve ser observado em teste com o usuário, não presumido pelo designer.

## 10. Arquitetura editorial e técnica

Manter React/Vite e o site existente. Separar dados de conteúdo, avaliação determinística, persistência e apresentação. Uma nova folha global de CSS e outro sistema isolado de progresso ampliariam o problema.

### Modelo de conteúdo proposto

- `Track`: ID, objetivo profissional delimitado, fases e marcos.
- `Competency`: ID, comportamento observável, dependências e evidências aceitáveis.
- `Mission`: ID estável, versão, competências, pré-requisitos, contexto, conceitos, passos, exercício guiado, variação, feedback por erro, rubrica, ajuda e materiais.
- `Exercise`: tipo (previsão, ordenar fluxo, tabela, execução local, diagnóstico, defesa), entradas, resultados, explicação e casos de transferência.
- `Attempt`: missão/versão, respostas, evidências, ajuda usada, feedback e origem da avaliação.
- `Review`: competências associadas, exercício de recuperação, data sugerida e resultado; sem invalidar a conclusão anterior só por prazo.
- `ProjectMilestone`: artefatos esperados, comandos, critérios de aceite, limites e demonstração.
- `Resource`: título, URL, provedor, idioma de texto/áudio/legenda, duração declarada, estimativa de trecho separada, acesso, certificado, uso e data de verificação.

Uma competência pode aparecer em várias missões sem copiar a aula inteira. Exemplo: H04 ensina 404; A01 implementa; A05 automatiza o contrato; I02 traduz ausência para uma tool. Cada retorno acrescenta uma responsabilidade.

### Fronteira de execução e privacidade

O navegador pode conferir respostas com gabaritos explícitos e simular contratos. Não executar C# arbitrário no Worker das notas. Código real roda no ambiente local do estudante ou, futuramente, num serviço isolado que exigiria projeto próprio. Explicações de arquitetura continuam dependentes de rubrica/revisão, sem selo automático de domínio.

Evidências, dúvidas, progresso e decisões permanecem privados no navegador e entram no backup. Notas compartilhadas continuam explicitamente públicas, sem login, sem histórico na aplicação e com limite de 50.000 pontos de código por bloco. Publicar uma nota exige ação consciente; nunca copiar uma resposta pessoal automaticamente para esse bloco.

O backend Cloudflare Workers + D1 atual é preservado, inclusive escopos e controle de concorrência. Não habilitar a origem Supabase antiga nem reimportar snapshot. Novos escopos públicos, se necessários, seriam uma alteração separada; o redesign não depende disso.

### Compatibilidade de progresso

Manter chaves e IDs atuais durante a transição. Criar adaptadores de leitura para módulo, laboratório e autonomia; oferecer um resumo unificado sem fabricar equivalência de domínio. Conclusão antiga vira “registro anterior” associado ao conteúdo correspondente, preservando texto, data e origem. Não marcar automaticamente várias missões novas como dominadas a partir de uma etapa antiga.

Backup novo com versão, validação, prévia e conflitos explícitos. Importações antigas continuam aceitas. Migração deve ser idempotente e reversível: nenhuma remoção das chaves antigas na primeira versão. Não publicar alteração que descarte rascunhos ou referências de notas.

### Aproveitamento do conteúdo atual

| Origem | Tratamento proposto |
| --- | --- |
| Oito etapas de autonomia | Base para C01/C03/C04–C05, H01, A01, M04 e E01–E02; aprofundar e dividir. Preservar registros antigos. |
| Oficinas HTTP/Bruno do laboratório MCP | Incorporar como fonte canônica para H01–H04, evitando obrigar o estudante a abandonar a missão. |
| Kits .NET/MCP e casos sintéticos | Reaproveitar depois de verificar SDK, execução limpa e correspondência com a missão. |
| Módulos gerais e 342 referências exibidas | Biblioteca e aprofundamentos; revisão editorial por prioridade, sem apagar acervo. |
| Treinos e checkpoints existentes | Mapear por competência, eliminar duplicidade visual e acrescentar feedback específico. |
| Resume, foco, backup e temas | Reutilizar infraestrutura, redesenhar hierarquia e nomes. |

### Qualidade para publicar uma missão

Objetivo demonstrável; pré-requisitos realmente ensinados; exemplo executável na versão declarada; resultado reproduzido; erro comum e caminho de ajuda; exercício guiado; variação independente; rubrica específica; fonte verificada quando houver recomendação externa; estimativa de leitura separada da prática; estados vazio/erro/salvo/revisão claros. Para código: testar casos que detectem um erro real, não um teste que apenas espelha a implementação.

Validador de schema confirma presença e integridade de IDs, mas não substitui revisão pedagógica. Execução limpa dos kits confirma viabilidade técnica, mas não prova que o texto ensina bem. O piloto com o estudante precisa observar os dois.

## 11. Ordem de implementação

| Entrega | Escopo concreto | Critério para avançar |
| --- | --- | --- |
| 1. Piloto completo | Hoje simplificado, um modelo de missão, diagnóstico curto, C01–C03 e uma missão HTTP com kit/feedback. | O usuário encontra a ação, tenta, entende o feedback e explica uma variação; corrigir o piloto antes de multiplicar aulas. |
| 2. Fundamentos conectados | Completar fases 0–3, projeto console e testes; adaptar progresso/backup. | Reprodução limpa e competência de regra demonstrável sem formulário excessivo. |
| 3. Backend consistente | Fases 4–7, persistência, integração, segurança, operação e colaboração. | Uma demanda atravessa contrato, implementação, teste e revisão. |
| 4. IA aplicada | Integrar fase 8 ao MCP existente e finalizar avaliações de transferência. | Ferramenta e fluxo tratam ausência, erro, acesso e fonte; sem confundir simulação com execução real. |
| 5. Consolidação editorial | Revisar biblioteca, remover duplicidades de navegação, testar acessibilidade e ajustar ritmo por evidências do piloto. | Usuário retoma após pausa e identifica o que consegue fazer e o que precisa revisar. |

Não transformar o número de missões em promessa de prazo. Estimar o restante depois do piloto e da confirmação de disponibilidade. O roteiro de implementação começa pela unidade de ensino, não por um redesenho integral seguido de conteúdo ainda superficial.

### Validação planejada

Regressões: progresso legado, importação antiga, conflitos, storage bloqueado, links profundos, retomada do passo e revisão sem bloqueio por atraso. Funcionais: salvar resposta, voltar, recarregar, pedir pista e repetir variação. Conteúdo: versões dos kits, comandos, respostas e testes. UI: claro/escuro, desktop/celular, 200% zoom, teclado, foco e leitura assistiva. Notas públicas: seguir funcionando sem mudança de contrato.

Medidas do piloto, com observação e registro privado: localizou a próxima ação; iniciou sem instrução externa sobre a interface; distinguiu erro de ambiente de erro de código; corrigiu uma fronteira; explicou uma decisão; resolveu uma variação; retomou após pausa. Não usar número de cliques, certificados, horas ou sequência diária como substitutos de autonomia. Não adicionar rastreamento público para medir isso.

## 12. Referências e limites desta análise

Fontes internas: `App.tsx`, `StudyResume.tsx`, `AutonomyLab.tsx`, `autonomyProgress.ts`, `autonomy.css`, `ModuleJourney.tsx`, `LearningPath.tsx`, `PracticeStudio.tsx`, `data/autonomy.json`, estrutura de `data/laboratory.json`, amostra de `data/module-lessons.json`, `main.tsx` e `CONTINUIDADE.md`. Não foi feita auditoria semântica de cada uma das 342 referências.

Fontes externas abertas em 30/10/2026:

- [IES/WWC — Organizing Instruction and Study to Improve Student Learning](https://ies.ed.gov/ncee/wwc/PracticeGuide/1): base para alternar exemplo e problema, espaçar estudo, recuperar conteúdo e pedir explicações. O guia não valida automaticamente esta sequência de C# nem um intervalo fixo para cada pessoa.
- [Microsoft Learn — Escreva seu primeiro código usando C#](https://learn.microsoft.com/pt-br/training/paths/get-started-c-sharp-part-1/): referência em português para sintaxe, variáveis, operações e decisões; corrobora a necessidade de separar esses conceitos. Duração total e condições de certificado não foram confirmadas nesta análise; não recomendar como certificado verificado. Leitura pública acessível; os ambientes de exercício precisam ser conferidos na curadoria de cada missão.

Essas fontes fundamentam princípios e cobertura introdutória. A escolha do projeto, divisão em 45 missões, desenho das telas, rubricas e ordem de implementação são propostas autorais para este contexto. Não houve compilação dos novos exemplos, teste do novo design ou alteração no site publicado nesta rodada.
