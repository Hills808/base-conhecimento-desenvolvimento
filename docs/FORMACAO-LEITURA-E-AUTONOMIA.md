# Curva Aberta — formação para ler, construir e explicar código

Data: 06/11/2026. Estado: projeto pedagógico e especificação de produto; as unidades propostas abaixo ainda não são aulas implementadas. Base auditada: `eaee44485f67dff2c03f274d92aa178965ba39ad`.

Este documento revisa a direção de [ARQUITETURA-FORMACAO.md](ARQUITETURA-FORMACAO.md). Mantém a formação única em C#/.NET, o projeto Mesa de atendimento e a infraestrutura existente. A mudança central é aprofundar os fundamentos, praticar leitura de código desconhecido em toda a sequência e distinguir desempenho com ajuda de autonomia demonstrada. O mapa anterior de 45 missões passa a ser referência histórica; este inventário editorial propõe 60 unidades no núcleo, com unidades divisíveis em várias sessões.

## 1. Resultado que a plataforma deve produzir

Ao receber um trecho ou uma demanda delimitada, o estudante deve conseguir:

1. Localizar o ponto de entrada e descrever a finalidade do código.
2. Acompanhar os valores e o caminho de execução, inclusive em falhas.
3. Distinguir o que sabe do que ainda precisa investigar.
4. Implementar uma alteração pequena e escolher testes que revelem um erro.
5. Explicar responsabilidades, dependências e consequências da mudança.
6. Reconstruir o raciocínio em outro programa e depois de um intervalo.

O foco do núcleo é desenvolvimento backend em C#/.NET, da execução básica à manutenção de uma aplicação. “Formação completa” significa um percurso coerente para esse escopo; não domínio de toda a computação, de qualquer arquitetura ou de qualquer código de produção.

A confiança desejada precisa ter uma base observável: “Já consegui interpretar, modificar, testar e explicar esse tipo de problema em situações diferentes”. A interface também deve ajudar a dizer “Ainda não domino isto; sei por onde investigar”, sem transformar dúvida em fracasso.

## 2. Auditoria atual e diferença em relação ao plano anterior

A auditoria desta rodada foi de código e documentos, não uma nova homologação visual do site.

| Evidência atual | Implicação para a necessidade | Mudança especificada |
| --- | --- | --- |
| `data/formation.ts` contém C01, C02, C03 e H01: quatro práticas completas. As demais fases são nomes no mapa. | Há um início útil, mas não existe uma sequência implementada até arquitetura. | Completar uma cadeia de pré-requisitos, com estado editorial explícito. |
| `Formation.tsx` apresenta todas as explicações em “Entender” antes da previsão. Em C01, a resposta já foi explicada. | Acertar depois pode medir reconhecimento da explicação. | Exemplo resolvido A para aprender; programa B ainda não explicado para prever. |
| C02 combina texto anulável, leitura, bool, TryParse, out e if/else. | Uma dificuldade pode vir de vários conceitos ainda novos. | Ensinar comparação, decisão e blocos antes de integrar entrada e conversão. |
| `canComplete` exige duas respostas corretas e dois checks; a nota é opcional. | A rotina registra corretamente uma declaração, mas não verifica código executado nem transferência. | Evidências diferentes para leitura, construção, depuração e explicação. |
| `dueMissions` usa uma semana; a retomada reaproveita perguntas conhecidas. | Repetir o gabarito pode parecer retenção. | Recuperações com variantes e retorno focal ao conceito errado. |
| O laboratório antigo de autonomia pode bloquear sucessores por revisão vencida. | Uma pausa gera barreira de calendário. | A formação nova recomenda recuperação sem bloquear consulta ou apagar progresso. |
| A navegação Hoje/Formação/Meu projeto/Biblioteca já existe. | Não é necessário inventar outro menu ou outra plataforma. | Aprofundar o trabalho dentro dessas quatro áreas. |
| Há kits e material avançado de APIs/MCP. | São úteis depois dos pré-requisitos, mas não substituem a base. | Preservar como aprofundamento e ligar às competências necessárias. |

A falha central não será resolvida apenas acrescentando mais títulos ou trocando o desenho dos cards. O produto precisa mostrar uma tentativa, encontrar uma dificuldade concreta e oferecer uma próxima ação que a trabalhe.

## 3. Referências e escolhas pedagógicas

As fontes abaixo foram abertas em 06/11/2026. Elas sustentam princípios; não validam automaticamente este currículo.

- **Raspberry Pi Foundation, pedagogia e PRIMM:** leitura, rastreamento e investigação de código antes de criação independente; apoio reduzido progressivamente. A adaptação aqui é para estudo individual adulto em C#, enquanto parte da base do PRIMM vem de contextos escolares. [Fonte](https://www.raspberrypi.org/teach/pedagogy).
- **The Learning Scientists:** recuperar uma ideia sem olhar a resposta e voltar a ela em ocasiões separadas, com feedback. Os intervalos concretos desta proposta são decisões de produto ajustáveis. [Fonte](https://www.learningscientists.org/faq).
- **Anthropic, estudo de formação de habilidades, janeiro de 2026:** experimento com 52 profissionais aprendendo uma biblioteca Python encontrou pior desempenho médio com assistência de IA; formas de uso tiveram associações diferentes com o aprendizado. É evidência limitada a uma tarefa e população específicas, não prova de que toda IA prejudica todo estudante. Orienta a separação entre ajuda e verificação independente. [Fonte](https://www.anthropic.com/research/AI-assistance-coding-skills).
- **Microsoft Learn, introdução ao C#, partes 1–6:** referências técnicas em português para execução, tipos, controle, coleções, métodos e depuração. Usaremos trechos no momento certo, sem obrigar a abrir uma lista de cursos para descobrir o que fazer. [Parte 1](https://learn.microsoft.com/pt-br/training/paths/get-started-c-sharp-part-1/).
- **Microsoft, arquiteturas de aplicações web:** responsabilidades, camadas e direção das dependências. A aplicação didática começa pequena; complexidade arquitetural exige uma necessidade demonstrada. [Fonte](https://learn.microsoft.com/pt-br/dotnet/architecture/modern-web-apps-azure/common-web-application-architectures).

A sequência, os exercícios, os critérios e a experiência descritos a seguir são projeto autoral. Nenhum deles deve ser apresentado como receita científica universal.

## 4. Uma linha principal, com leitura em todos os níveis

Começar pelo nível 1, fundamentos de execução. A entrada não presume domínio por reconhecer termos avançados. Um diagnóstico curto pode encurtar o que já foi demonstrado, sem atribuir um nível global por múltipla escolha.

A preparação de editor, terminal e SDK fica disponível junto da primeira prática. Erro de instalação recebe ajuda de ambiente; não vira reprovação de raciocínio.

### Diagnóstico por comportamento

| Tarefa | O que observar | Encaminhamento |
| --- | --- | --- |
| Prever duas saídas e preencher valores intermediários | Expressão versus alteração de estado | Etapa 1 |
| Escolher o caso que diferencia duas condições | Fronteira e contrato | Etapa 2 |
| Acompanhar um laço curto | Iteração e acumulador | Etapa 3 |
| Seguir uma chamada e seu retorno | Parâmetro, retorno e escopo | Etapa 4 |
| Localizar regra e acesso externo em três arquivos | Responsabilidade e caminho da execução | Etapas 7–10 |

Não apresentar todas as tarefas como prova obrigatória de entrada. Após a primeira lacuna importante, oferecer o início correspondente; tarefas posteriores ficam opcionais. “Não sei” é uma resposta útil. Reconhecimento correto recebe uma pequena variação antes de sugerir pular conteúdo.

### Currículo do núcleo: 12 etapas e 60 unidades

Cada etapa utiliza as habilidades anteriores. Cada unidade tem um objetivo central e pode ocupar várias sessões. Git, leitura de erro, comparação esperado/obtido e explicação aparecem desde o início; suas ferramentas são aprofundadas depois.

#### Etapa 1 — Entender a execução

Pré-requisito: nenhum conhecimento de C#; preparação assistida do ambiente.

| Unidade | Conteúdo e prática central | Demonstração |
| --- | --- | --- |
| U01 | Projeto, arquivo, SDK, compilação e execução | Encontrar Program.cs, executar e diferenciar comando de código. |
| U02 | Instrução, literal, variável e tipo inteiro | Nomear o valor guardado antes e depois de uma linha. |
| U03 | Expressão, atribuição e impressão | Prever a saída sem supor que imprimir muda a variável. |
| U04 | Ordem das instruções e tabela de execução | Explicar por que mover uma linha altera o resultado. |
| U05 | Ler um programa curto que não escreveu | Rastrear, modificar uma operação e apresentar o diff. |

Entrega: contador de solicitações em console, com rastreamento dos valores. Primeiro commit guiado após entender o diff. Sem classes, input, LINQ ou padrões de arquitetura nesta etapa.

#### Etapa 2 — Decidir com dados válidos

Pré-requisito: distinguir ler, calcular e atribuir.

| Unidade | Conteúdo e prática central | Demonstração |
| --- | --- | --- |
| U06 | Comparações e valores booleanos | Avaliar expressões sem confundir = com ==. |
| U07 | if, else, blocos e caminhos exclusivos | Apontar o bloco executado e o que foi ignorado. |
| U08 | Texto, ReadLine, ausência e TryParse | Separar entrada, resultado da conversão e regra permitida. |
| U09 | Combinar condições e curto-circuito | Explicar quando a segunda verificação não é executada. |
| U10 | Fronteiras e requisitos em linguagem comum | Construir casos que detectem > usado no lugar de >=. |

Entrega: classificador de tempo de espera, incluindo conversão inválida, zero e fronteiras. Texto anulável e parâmetro out recebem explicação própria na U08; não são pré-requisitos ocultos.

#### Etapa 3 — Acompanhar repetição e coleções

Pré-requisito: decisões e alterações de estado.

| Unidade | Conteúdo e prática central | Demonstração |
| --- | --- | --- |
| U11 | Arrays, posição e tamanho | Distinguir índice, quantidade e valor. |
| U12 | foreach e acumulador | Mostrar o total após cada iteração. |
| U13 | for, contadores e limites | Corrigir acesso fora da coleção. |
| U14 | while e condição de parada | Explicar progresso e evitar repetição infinita. |
| U15 | List de valores e operações básicas | Diferenciar alterar um item de remover um item. |

Entrega: relatório de solicitações por categoria simples, com coleção vazia e um único item. Introduzir a notação List<T> pelo significado de “lista de um tipo”, sem desviar para teoria completa de generics.

#### Etapa 4 — Ler chamadas e separar tarefas

Pré-requisito: fluxo, coleções e decisões.

| Unidade | Conteúdo e prática central | Demonstração |
| --- | --- | --- |
| U16 | Método, assinatura, argumento e parâmetro | Relacionar os valores enviados com os recebidos. |
| U17 | Retorno, efeito e impressão | Mostrar por que retornar um valor não o imprime. |
| U18 | Escopo e pilha de chamadas | Descrever para onde a execução volta. |
| U19 | Decomposição e depurador | Extrair uma regra e acompanhar Step Into/Over. |
| U20 | Ler o mesmo fluxo em vários arquivos | Encontrar definição, referências e caminho até a saída. |

Entrega: relatório com cálculo separado da apresentação. Primeira leitura orientada de um projeto alheio de três arquivos. “Ir para definição” e “Encontrar referências” deixam de ser ações aleatórias.

#### Etapa 5 — Entender objetos e regras

Pré-requisito: métodos, escopo e responsabilidades locais.

| Unidade | Conteúdo e prática central | Demonstração |
| --- | --- | --- |
| U21 | Classe, objeto, construtor e propriedade | Separar a definição de dois objetos concretos. |
| U22 | Estado, enum e transições | Recusar uma mudança de estado proibida. |
| U23 | Referências, cópias e null | Explicar quando dois nomes acessam o mesmo objeto. |
| U24 | Encapsulamento e invariantes | Manter uma regra válida por todas as entradas disponíveis. |
| U25 | Coleções de objetos, busca e LINQ inicial | Comparar um filtro com o laço explícito equivalente. |

Entrega: solicitações com identidade, estado e regra de encerramento. Primeiro escrever a busca com laço; depois ler Where/Select sem tratá-los como mágica. Dictionary pode ser introduzido como alternativa de busca, com uma prática curta de chave ausente.

#### Etapa 6 — Investigar e testar

Pré-requisito: métodos e modelo de objetos.

| Unidade | Conteúdo e prática central | Demonstração |
| --- | --- | --- |
| U26 | Erro de compilação, execução e lógica | Classificar o problema e localizar a primeira evidência útil. |
| U27 | Hipótese, breakpoint, Watch e call stack | Encontrar a primeira divergência sem alterar tudo ao mesmo tempo. |
| U28 | Teste unitário e asserção | Fazer um teste falhar com uma regra defeituosa. |
| U29 | Casos de fronteira e comportamento de erro | Justificar a escolha dos casos, inclusive coleção vazia. |
| U30 | Refatoração com regressão | Melhorar a organização mantendo resultados e contratos. |

Entrega: conjunto pequeno de testes da regra, incluindo uma falha inserida de propósito. O estudante explica por que o teste poderia passar mesmo com um defeito diferente. Exceções e tratamento são ensinados a partir de um erro observável; não usar catch genérico para esconder falhas.

#### Etapa 7 — Seguir uma requisição pela API

Pré-requisito: métodos, objetos e comparação automatizada de resultados.

| Unidade | Conteúdo e prática central | Demonstração |
| --- | --- | --- |
| U31 | HTTP real com Bruno antes de criar servidor | Separar método, URL, status, cabeçalhos e corpo. |
| U32 | JSON, contrato, zero, null e ausência | Interpretar resposta sem inventar campos. |
| U33 | Primeiro endpoint ASP.NET Core | Rastrear rota, parâmetro, regra e resposta. |
| U34 | Entrada, DTO e validação | Mostrar onde dados inválidos são recusados. |
| U35 | OpenAPI e teste de integração | Comparar contrato publicado e comportamento observado. |

Entrega: criar, consultar e encerrar solicitações com casos reproduzíveis. Diferenciar resposta de erro de falha de conexão. A aula de HTTP antiga pode servir de consulta; não se torna um desvio obrigatório de linguagem.

#### Etapa 8 — Saber onde os dados vivem

Pré-requisito: modelo, API e contratos.

| Unidade | Conteúdo e prática central | Demonstração |
| --- | --- | --- |
| U36 | Tabela, linha, chave e restrição | Traduzir um pequeno modelo para dados persistentes. |
| U37 | SELECT, filtros e parâmetros | Ler a consulta e explicar por que concatenar entrada é arriscado. |
| U38 | Relações, JOIN e transação | Demonstrar uma operação que precisa ser atômica. |
| U39 | EF Core, LINQ e SQL observado | Relacionar o código à consulta realmente enviada. |
| U40 | Migration, reinício e concorrência | Manter dados após reiniciar e detectar uma atualização conflitante. |

Entrega: API com SQLite local, duas tabelas e testes de persistência. SQLite é uma escolha didática, não equivalência de comportamento com todo banco corporativo.

#### Etapa 9 — Entender arquitetura por mudanças

Pré-requisito: ter acompanhado uma requisição com persistência e testes.

| Unidade | Conteúdo e prática central | Demonstração |
| --- | --- | --- |
| U41 | Responsabilidades, coesão e acoplamento | Mostrar por que duas partes mudam por razões diferentes. |
| U42 | Interfaces e injeção de dependência | Substituir uma dependência sem reescrever a regra. |
| U43 | Fluxo de execução versus dependência de código | Desenhar e explicar as duas relações separadamente. |
| U44 | Camadas, monólito e alternativas | Comparar soluções pequenas antes de escolher um padrão. |
| U45 | Decisão arquitetural e impacto | Registrar escolha, alternativa, custo e teste da mudança. |

Entrega: adaptar uma regra e um mecanismo de armazenamento separadamente, explicando o alcance do diff. Clean Architecture entra como comparação motivada. CQRS, event sourcing e microsserviços ficam em aprofundamentos posteriores; criar muitas pastas não demonstra arquitetura.

#### Etapa 10 — Trabalhar em código que não escreveu

Pré-requisito: navegação por chamadas e compreensão de responsabilidades.

| Unidade | Conteúdo e prática central | Demonstração |
| --- | --- | --- |
| U46 | Reconhecimento de repositório desconhecido | Localizar instruções, solução, entrada, configuração e testes. |
| U47 | Traçar uma funcionalidade existente | Construir um mapa do caminho dos dados com evidências. |
| U48 | Reproduzir um defeito e reduzir o problema | Criar um caso que falha antes da correção. |
| U49 | Ler diff, revisar e resolver conflito | Explicar a mudança sem depender só da descrição do PR. |
| U50 | Entregar uma melhoria limitada | Produzir diff, testes, instruções e limites compreensíveis. |

Entrega: pequena contribuição em um segundo repositório didático, com outro domínio e convenções diferentes. Incluir uma variante com controllers e outra com endpoints mínimos, para não decorar uma única árvore de pastas.

#### Etapa 11 — Entender comportamento em execução

Pré-requisito: API, persistência, testes e dependências.

| Unidade | Conteúdo e prática central | Demonstração |
| --- | --- | --- |
| U51 | Task, async/await e cancelamento | Seguir resultado e erro de uma operação assíncrona. |
| U52 | Falha externa, timeout e repetição | Explicar quando repetir poderia duplicar uma operação. |
| U53 | Autenticação, autorização e entrada não confiável | Negar acesso a recurso de outro usuário no servidor. |
| U54 | Logs, correlação e diagnóstico | Seguir uma requisição sem registrar segredos. |
| U55 | Configuração, CI, publicação e recuperação | Reproduzir a versão e explicar uma falha de configuração. |

Entrega: integração fictícia com sucesso, indisponibilidade e acesso negado. Nenhuma etapa exige conta paga; serviços externos podem ser substituídos por servidor local explicitamente identificado como simulação.

#### Etapa 12 — Consolidar autonomia profissional

Pré-requisito: as habilidades relevantes das etapas anteriores.

| Unidade | Conteúdo e prática central | Demonstração |
| --- | --- | --- |
| U56 | Demanda incompleta e perguntas de esclarecimento | Definir contrato e critérios sem inventar requisito. |
| U57 | Implementação sem tutorial de solução | Planejar, testar e concluir uma alteração limitada. |
| U58 | Revisão de código gerado por IA | Encontrar uma falha plausível e demonstrá-la por teste. |
| U59 | Defesa e mudança de requisito | Explicar decisões e adaptar a entrega sob nova condição. |
| U60 | Retomada posterior e transferência | Resolver um caso diferente e identificar lacunas restantes. |

Entrega final: contribuição reproduzível em um projeto que o estudante não montou integralmente, acompanhada de diagnóstico, testes e defesa. Documentação pode ser consultada. Uma tentativa com solução gerada é registrada como assistida e seguida por outra oportunidade de demonstração independente.

### Aprofundamentos depois do núcleo

MCP com C#, tools, agentes, roteamento, RAG, skills, filas e arquiteturas distribuídas continuam acessíveis na biblioteca. O percurso recomendado só os coloca como próxima etapa quando contratos, fluxo, testes, falhas e permissões já estiverem demonstrados. A formação não apaga o interesse pelo avançado; dá condições de entendê-lo e revisar o que ele produz.

Esses aprofundamentos precisam de auditoria editorial própria. O inventário acima não declara que o conteúdo avançado existente já foi revalidado.

## 5. O mesmo projeto cresce; as avaliações mudam de contexto

**Mesa de atendimento** continua como projeto principal fictício:

- Etapas 1–3: contagem, classificação e relatórios em console.
- Etapas 4–6: métodos, objetos, regras e testes.
- Etapas 7–8: API e persistência.
- Etapa 9: reorganização justificada por mudanças.
- Etapas 10–12: manutenção, integração, operação e defesa.

Cada marco tem uma versão inicial, um estado esperado, um defeito deliberado e uma mudança adicional. Versões anteriores continuam executáveis. Não entregar um template de dez projetos na primeira aula.

O segundo contexto, usado nas transferências, será um sistema fictício de reservas de salas. A partir da etapa 4, variar também a forma do programa, não apenas nomes e números: ordem das chamadas, fronteiras, ausência de dados, coleções vazias ou uma responsabilidade localizada em outro arquivo.

## 6. A experiência de uma aula

O ciclo proposto combina apoio e verificação em sete momentos. Não são sete formulários obrigatórios.

1. **Entenda uma ideia:** situação curta, um conceito e exemplo A resolvido. Introduzir os símbolos necessários.
2. **Leia outro código:** exemplo B ainda não explicado; prever saída, valores ou caminho.
3. **Execute e compare:** rodar localmente e identificar a primeira divergência entre previsão e resultado.
4. **Investigue:** usar tabela, breakpoint, referências ou teste para explicar essa divergência.
5. **Modifique:** receber um requisito pequeno, fazer uma alteração e testar.
6. **Construa e explique:** resolver um problema relacionado sem o passo a passo; explicar com evidências.
7. **Retome em outra sessão:** usar programa C, com uma situação diferente e apoio conforme necessário.

A explicação completa do exemplo B fica acessível depois da tentativa ou por “Ver solução e continuar com apoio”. Isso é uma escolha de estudo, não um mecanismo antifraude. O código e os gabaritos no navegador não são segredos.

A tela deve permitir “Não sei por onde começar”. A ajuda oferece, nesta ordem: pergunta orientadora; região relevante; pista concreta; exemplo resolvido. Depois de uma solução completa, outra variante permite conferir o que foi aprendido.

### Ferramentas de aprendizagem dentro da aula

| Ferramenta | Uso | Limite explícito |
| --- | --- | --- |
| Mesa de execução | Linha, valores antes/depois, saída e chamada atual | Traços pré-calculados não são um interpretador geral de C#. |
| Lupa de código | Explicação do trecho e de símbolos já apresentados | Evitar tooltip obrigatório em cada palavra; teclado e texto equivalente. |
| Investigação de falhas | Hipótese, evidência, teste e revisão da hipótese | Não aceitar apenas trocar o código até ficar verde. |
| Leitura de repositório | Arquivos pequenos, referências e caminho da funcionalidade | Crescer de três arquivos para uma fatia delimitada de projeto. |
| Defesa da solução | Perguntas curtas sobre decisão e impacto | Autoavaliação não é avaliação semântica automática. |
| Caderno de lacunas | Dificuldade concreta ligada à competência e próxima prática | Não virar uma lista infinita de assuntos para estudar. |

No início, uma resposta pode ser preencher três valores ou apontar uma linha. Redações longas não são evidência superior. A explicação cresce de uma frase causal para uma defesa de dois ou três minutos, sem premiar jargão ou eloquência.

## 7. Quando considerar uma habilidade demonstrada

Separar cinco dimensões: **ler**, **construir**, **investigar**, **explicar** e **transferir**. Arquitetura aparece nas dimensões por meio de decisões e limites de responsabilidade.

| Situação | Estado honesto |
| --- | --- |
| Abriu a aula ou assistiu ao material | Conteúdo consultado |
| Resolveu seguindo a solução | Praticou com apoio |
| Resolveu um caso diferente sem gerador de solução | Aplicou em nova tentativa, com origem da evidência identificada |
| Refez um caso após intervalo | Retomou a habilidade |
| Outra pessoa revisou código e explicação | Recebeu revisão humana, com escopo e data |

Não somar tudo em “87% programador”. Uma pessoa pode construir uma condição com ajuda e ainda não conseguir rastrear um laço. O painel deve mostrar essa diferença.

Critério recomendado de passagem de etapa:

- Identificar corretamente os comportamentos essenciais em um programa novo.
- Produzir a mudança pedida e comparar os casos relevantes.
- Explicar a causa do resultado e uma alternativa que falharia.
- Resolver uma pequena variação sem a solução completa.
- Agendar uma recuperação posterior; a passagem inicial pode ser registrada antes dela.

O número de itens por tarefa e as dificuldades serão calibrados no uso. Não há corte de 80% cientificamente estabelecido para essa formação. Erros críticos não são compensados por média: por exemplo, não distinguir atribuição de expressão ou permitir acesso indevido exige recuperação focal.

A conclusão de uma aula não comprova retenção duradoura. Uma revisão atrasada também não comprova perda de conhecimento. A plataforma pode sugerir duas recuperações curtas por sessão e intervalos iniciais de 2, 7 e 21 dias, ajustados ao desempenho e à disponibilidade. Esses números são heurística editorial, não prescrição universal.

### Como avaliar sem prometer uma correção que não existe

- Respostas de execução e tabelas: comparação determinística com fixtures compiladas e versionadas.
- Código local: resultados reproduzíveis de testes, com indicação de que foram executados/informados no dispositivo do estudante.
- Relatório importado: útil para organização, mas não autentica autoria nem garante integridade.
- Explicação: rubrica com exemplos e autoavaliação; revisão humana quando disponível.
- Apoio de IA: registrado por declaração, sem vigilância ou tentativa de detectar automaticamente seu uso.
- Confiança: autorrelato opcional antes/depois, comparado com desempenho observado; não é nota.

A plataforma pode organizar evidências e corrigir casos objetivos. Não pode garantir que a pessoa aprendeu “tudo” nem certificar uma explicação que não examinou.

## 8. Política de IA para construir autonomia

A ajuda precisa preservar uma parte do raciocínio para o estudante.

**Durante aprendizagem:** experimentar, escrever uma previsão e, quando travar, pedir uma pista ou uma explicação localizada. Não obrigar a ficar um tempo arbitrário sofrendo antes de receber ajuda.

**Depois da ajuda:** fechar a solução, explicar o motivo da mudança e enfrentar uma variante. Ler uma explicação convincente não encerra a atividade.

**Na demonstração independente:** documentação, erro do compilador e depurador são permitidos. Gerador de solução e autocomplete generativo ficam fora da tentativa por acordo de estudo. Consultar ajuda continua possível, mudando o registro para “com apoio”, sem punição.

**No trabalho:** não impor uma proibição que atrapalhe a entrega. Antes de aceitar código gerado, identificar entradas, saídas, estado alterado, dependências e testes. O treino deliberado sem gerador acontece em tarefas delimitadas da formação.

Modelo de pedido de ajuda:

> Estou estudando este conceito. Minha previsão foi X, observei Y e suspeito de Z. Faça uma pergunta ou dê uma pista para eu investigar. Não entregue a implementação completa agora. Depois da minha tentativa, proponha uma variação.

Esse texto orienta um assistente externo; não garante comportamento de qualquer modelo. Um tutor de IA hospedado não é necessário para a primeira implementação. Furina continua com comportamentos programados, sem envio de respostas pessoais a um modelo.

## 9. Aula de referência: o valor guardado não acompanha a conta

Unidade U03. Pré-requisitos: executar o projeto, reconhecer inteiro, variável e impressão. Objetivo: distinguir o valor calculado no momento da atribuição de uma ligação permanente entre variáveis.

### Exemplo A, aprendido com apoio

```csharp
int chamadas = 2;
int total = chamadas + 3;
Console.WriteLine(total);
```

O programa guarda 2 em chamadas. Depois calcula 2 + 3 e guarda 5 em total. A impressão lê total. O símbolo = guarda o resultado do lado direito; não cria uma fórmula que será recalculada automaticamente.

### Exemplo B, mostrado sem gabarito antes da tentativa

```csharp
int abertas = 4;
int total = abertas + 2;
abertas = 1;
Console.WriteLine(total);
Console.WriteLine(abertas);
```

Perguntas: quais são as duas saídas? Qual linha alterou abertas? total mudou junto? Preencher a tabela antes de executar.

Gabarito editorial, oculto na tela inicial da tarefa:

| Após a linha | abertas | total | Nova saída |
| --- | --- | --- | --- |
| int abertas = 4; | 4 | Ainda não declarada | Nenhuma |
| int total = abertas + 2; | 4 | 6 | Nenhuma |
| abertas = 1; | 1 | 6 | Nenhuma |
| Console.WriteLine(total); | 1 | 6 | 6 |
| Console.WriteLine(abertas); | 1 | 6 | 1 |

Feedback específico:

- Se prever 3 e 1: a conta foi realizada quando abertas valia 4. Para recalcular, seria necessária outra atribuição.
- Se prever 6 e 4: a terceira linha substituiu o valor de abertas.
- Se acertar por tentativa: pedir qual linha teria de mudar para a primeira saída ser 3; não concluir a unidade apenas pela alternativa.
- Se travar em sintaxe: voltar à U02 e trabalhar uma atribuição por vez.

### Modificação guiada

Antes da primeira impressão, acrescentar uma atualização de total usando o valor atual de abertas e a mesma soma. Prever e executar. Resultado esperado: 3 e 1. Comparar o diff e explicar qual nova instrução causou a diferença.

### Construção e transferência

Situação: há 8 lugares disponíveis. O programa guarda uma fotografia dessa disponibilidade para um relatório. Depois são ocupados 3 lugares. Imprimir o valor fotografado e o atual, mantendo ambos separados.

Critério: apresentar 8 e 5; explicar por que o registro do relatório não muda automaticamente. O estudante escolhe nomes e escreve o trecho. Na retomada, fornecer código alheio com outra ordem de atribuições e pedir a primeira divergência de uma tabela errada.

### Defesa curta

“total ficou com 6 porque a expressão foi calculada antes de abertas receber 1. Alterar abertas não executa de novo a linha que atribuiu total.”

Não exigir a frase exata. Aceitar uma explicação equivalente e pedir que a pessoa aponte a instrução responsável.

Esta aula é uma especificação editorial com resultados conferidos por rastreamento. Sua publicação como prática executável ainda exige compilação do exemplo, fixtures, variante de recuperação e integração da interface.

## 10. Arquitetura aprendida desde o pequeno

A primeira ideia arquitetural é saber o que cada parte faz e por que precisa mudar. O vocabulário formal cresce junto com a experiência.

| Momento | Pergunta de arquitetura |
| --- | --- |
| Variáveis e expressões | Que dado esta parte representa? |
| Métodos | Esta função calcula uma regra ou conversa com o usuário? |
| Objetos | Onde a regra precisa ser mantida válida? |
| API | Quem interpreta a requisição e quem decide o resultado? |
| Persistência | A regra sabe como o dado é armazenado? Isso é necessário? |
| Interfaces | Qual substituição concreta esta abstração permite? |
| Aplicação completa | Que mudança atravessa quais responsabilidades e por quê? |

Exercício recorrente, depois dos pré-requisitos: seguir “encerrar uma solicitação” desde a rota até a resposta. Marcar onde a entrada é interpretada, onde a autorização ocorre, onde a regra decide e onde o estado é gravado. Depois mudar o requisito e prever quais arquivos e testes serão afetados.

Explicar separadamente a sequência de chamadas em execução e as dependências entre tipos/projetos. Uma seta em um diagrama não significa automaticamente as duas coisas.

Uma boa decisão inclui contexto, escolha, alternativa descartada, custo e evidência. Não há pontos por usar mais padrões. Antes de introduzir uma interface, mostrar a dificuldade real que a substituição resolve.

## 11. Telas e navegação

Preservar Hoje, Formação, Meu projeto e Biblioteca, sem criar uma quinta formação concorrente.

**Hoje:** uma missão atual, a habilidade que ela trabalha e uma próxima ação. Exemplo: “Você já identifica a saída; hoje vai acompanhar o valor durante a execução”. Uma recuperação curta pode aparecer como ação secundária.

**Aula:** problema e primeira interação visíveis cedo; código legível, tabela e comparação esperado/obtido. Mapa da etapa recolhido no celular. Ajuda junto da dificuldade. Retomada exata do passo e da resposta após recarga.

**Formação:** a linha inteira com pré-requisitos e estado editorial. Diferenciar “disponível”, “em preparação” e “aprofundamento”. Um título futuro nunca deve parecer uma aula pronta.

**Meu projeto:** versões do projeto, tentativas, dúvidas e decisões. Painel por habilidade informa o tipo de evidência e a data. Todos os registros pessoais ficam privados e entram no backup.

**Biblioteca:** uma referência principal e uma alternativa por conceito na aula; o acervo completo permanece pesquisável. O estudante não precisa escolher entre vinte cursos para executar a tarefa do dia.

Preservar Furina, tema claro/escuro, foco opcional e identidade visual. A mascote oferece orientação localizada por solicitação; não elogia domínio sem evidência nem interrompe a concentração.

Critérios de interface: navegação por teclado, rótulos claros, foco previsível, texto equivalente ao traço visual, zoom de 200%, rolagem apenas no bloco de código quando necessária e feedback não dependente de cor. Validar em desktop e celular antes de declarar homologação.

## 12. Modelo técnico da evolução

Manter React, TypeScript e Vite. Não usar o Worker de notas como executor de código arbitrário.

| Área | Responsabilidade |
| --- | --- |
| Catálogo de competências | IDs estáveis, dependências e comportamentos observáveis |
| Conteúdo das unidades | Conceito, exemplos A/B/C, pistas, casos, rubrica e referências |
| Avaliação objetiva | Comparar valores, caminhos e testes com fixtures versionadas |
| Registro de tentativas | Resposta, versão, ajuda declarada, origem e resultado |
| Recomendação | Escolher uma próxima tarefa a partir da lacuna e dos pré-requisitos |
| Evidências e revisão | Separar desempenho inicial, ajuda, transferência e retomada |
| Interface | Apresentar tarefa, feedback e continuidade sem duplicar regras |

Proposta de modelo:

- Competência: id, descrição observável, pré-requisitos, versões e evidências aceitáveis.
- Unidade: id, versão, fase, conceitos novos, competências praticadas, ambientes e estado editorial.
- Exercício: tipo, variante, entrada, contrato, casos, erros comuns e níveis de ajuda.
- Tentativa: unidade/variante/versão, resposta, ajuda, origem da avaliação e data.
- Evidência: habilidade, tentativa, resultado determinístico ou declaração, referência ao artefato.
- Revisão: tarefa alternativa, data sugerida e resultado; nunca apaga automaticamente evidência anterior.

Não armazenar uma competência como um único booleano chamado mastered. A decisão de próximo passo deve explicar seu motivo e oferecer acesso aos pré-requisitos.

### Compatibilidade

- Preservar C01, C02, C03, H01 e todas as chaves de progresso existentes.
- U01–U60 são identificadores editoriais novos. Não renomear os registros antigos.
- C01 fornece conteúdo para U02–U04; C02 para U08; C03 para U10; H01 para U31–U32.
- Conclusões anteriores aparecem como registros históricos, sem converter automaticamente em domínio das novas unidades.
- Evoluir o formato de backup com versão, validação, prévia e conflito explícito; testar importações antigas.
- Progresso, explicações e relatórios pessoais nunca vão automaticamente para notas ou anexos públicos.
- Anotações, anexos e D1 existentes permanecem com seus contratos atuais. O novo currículo não exige novos bancos nem reativação do Supabase.
- Não prometer sincronização de progresso entre aparelhos: atualmente existe backup manual. Uma conta privada sincronizada seria projeto separado.

### Execução real de C#

Primeira implementação: SDK local e kits reproduzíveis; comandos explícitos, versões declaradas e testes executados em CI para os exemplos de autoria da plataforma.

A mesa de execução do navegador usa apenas traços de programas específicos, conferidos contra execução real. Não simular C# usando eval de JavaScript e chamar isso de compilador. Executar qualquer programa do estudante no navegador ou num serviço isolado é uma decisão técnica posterior, com estudo de viabilidade e custos.

## 13. Entrega e critérios de aceite

O mapa completo é especificação. Uma fase só recebe estado “disponível” quando todas as suas unidades e a entrega de passagem forem utilizáveis.

| Entrega | Trabalho concreto | Critério de aceite |
| --- | --- | --- |
| A. Corrigir a unidade de aprendizagem | Separar exemplo aprendido de previsão nova; tabela de execução; pistas graduais; estados de evidência | Não revelar a resposta antes da tentativa independente; salvar e restaurar todos os campos. |
| B. Completar execução, decisões e laços | U01–U15, kits console, variantes e recuperação focal | Exemplos compilam; casos revelam falhas; fluxo de ponta a ponta não depende de um curso externo. |
| C. Completar leitura de métodos e objetos | U16–U30 e primeiro projeto alheio | Estudante consegue seguir chamadas, investigar um erro e justificar um teste. |
| D. Construir a linha até arquitetura | U31–U45 com API, dados e decisões | Requisição inteira rastreável; persistência real; mudança com impacto explicado. |
| E. Consolidar manutenção e autonomia | U46–U60, segundo repositório, defesa e retomada | Demanda nova concluída com evidências; lacunas restantes ficam identificadas. |
| F. Conectar aprofundamentos | Auditar e vincular MCP, agentes e RAG existentes | Pré-requisitos e limites claros; simulações distinguíveis de serviços reais. |

Essas entregas são uma ordem de construção, não uma promessa de calendário. Não repetir o problema anterior de publicar quatro práticas e tratar o restante do mapa como formação completa.

### Definição de pronto por unidade

- Objetivo central e pré-requisitos apresentados antes de usar conceitos novos.
- Exemplo resolvido, exercício novo, variação e recuperação posterior.
- Código e resultados conferidos com versão real de .NET.
- Pelo menos uma falha intencional detectada pelos casos de teste.
- Feedback por erro conceitual e caminho de ajuda.
- Fonte principal aberta e metadados honestos.
- Estado salvo, restauração, modo de consulta e erro de ambiente tratados.
- Evidência automática claramente distinguida de execução declarada e autoavaliação.
- Navegação, teclado, temas e tamanho de tela testados.

### Medidas para ajustar o ensino

Avaliar tarefas novas: leitura correta, localização da primeira divergência, correção com hipótese, teste que detecta o defeito, explicação causal e transferência posterior. Comparar padrões ao longo de várias tentativas, não uma única nota.

Tempo assistindo, quantidade de código, streak, número de cliques e quantidade de certificados não serão usados como prova de autonomia. Tempo de resolução pode orientar o tamanho das tarefas, sem classificação pública ou pressão por velocidade.

## 14. Referências de estudo verificadas

Consulta de páginas originais em 06/11/2026. Leitura pública e idioma do texto conferidos. Duração total, áudio, legendas e condições de certificado não foram validados nesta rodada. Login para registrar progresso ou requisitos de ferramentas podem variar; consultar a página quando usar.

| Recurso | Idioma e acesso observado | Uso na formação |
| --- | --- | --- |
| [Microsoft Learn — C# parte 1](https://learn.microsoft.com/pt-br/training/paths/get-started-c-sharp-part-1/) | Texto em português, leitura pública | Valores, variáveis, operações e decisões |
| [C# parte 2](https://learn.microsoft.com/pt-br/training/paths/get-started-c-sharp-part-2/) | Texto em português, leitura pública | Console, coleções e práticas iniciais |
| [C# parte 3](https://learn.microsoft.com/pt-br/training/paths/get-started-c-sharp-part-3/) | Texto em português, leitura pública | Blocos, lógica e iteração |
| [C# parte 4](https://learn.microsoft.com/pt-br/training/paths/get-started-c-sharp-part-4/) | Texto em português, leitura pública | Tipos, dados e manipulação |
| [C# parte 5](https://learn.microsoft.com/pt-br/training/paths/get-started-c-sharp-part-5/) | Texto em português, leitura pública | Métodos, parâmetros e retorno |
| [C# parte 6](https://learn.microsoft.com/pt-br/training/paths/get-started-c-sharp-part-6/) | Texto em português, leitura pública | Depuração e exceções |
| [Pro Git](https://git-scm.com/book/pt-br/v2) | Tradução pt-BR disponível, leitura pública | Diff, histórico, branches e colaboração |
| [MDN — Visão geral do HTTP](https://developer.mozilla.org/pt-BR/docs/Web/HTTP/Guides/Overview) | Texto em português, leitura pública | Contratos de comunicação |
| [Microsoft — Primeira aplicação EF Core](https://learn.microsoft.com/pt-br/ef/core/get-started/overview/first-app) | Texto em português acessível | Persistência depois de compreender SQL |
| [Microsoft — Arquiteturas web](https://learn.microsoft.com/pt-br/dotnet/architecture/modern-web-apps-azure/common-web-application-architectures) | Texto em português acessível | Responsabilidades e dependências |

As páginas de EF Core e arquitetura exibem um aviso genérico de autorização, mas o conteúdo textual foi retornado na consulta. Isso não comprova acesso a todos os recursos interativos. Ler os materiais não exige contratar Azure; exercícios que envolvam serviços cloud precisam de avaliação separada.

Vídeos poderão ser apoio quando idioma, trecho e acesso forem verificados. Nenhum curso de vídeo foi classificado como validado nesta rodada. A seleção acima é deliberadamente pequena para manter o foco na prática.

## 15. Estado desta entrega

Concluídos: auditoria dos arquivos centrais, leitura do plano anterior, pesquisa em fontes originais, nova sequência editorial, desenho de avaliação, aula de referência, arquitetura técnica e critérios de aceite.

Não concluídos por este documento: implementação do novo motor de aprendizagem, redação completa das 60 unidades, compilação dos exemplos novos, integração dos kits, teste com o estudante e publicação da nova formação. As quatro missões existentes continuam sendo o conjunto implementado. Este documento é a especificação concreta para transformar esse piloto em uma formação progressiva, com verificação de leitura, construção e explicação.
