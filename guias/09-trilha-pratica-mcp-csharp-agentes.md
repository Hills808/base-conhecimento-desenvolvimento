# 09 — Laboratório de MCP com C#, APIs e agentes

[← Início](../README.md) · [Ajuda com termos e erros](#glossário-de-bolso-e-ajuda-quando-travar)

Construa um servidor MCP pequeno, conecte uma API e avance para conversa, RAG e Skills. Há vídeos, leitura e exercícios ao longo das etapas.

**Primeiro acesso:** [comece pela Etapa 1, no Bruno](#etapa-1-hoje-uma-chamada-http-no-bruno). Se já começou, retome pela tabela abaixo.

**Como estudar:** faça uma etapa por vez e confira a entrega antes de avançar. Use dados fictícios. As estimativas de tempo são flexíveis; os materiais de C# ajudam quando surgir uma dificuldade.

## A ordem única desta trilha

Clique na etapa que deseja abrir. Os demais guias do repositório servem como consulta durante o exercício.

| Etapa | Faça isto | Entrega para avançar |
| --- | --- | --- |
| [1. HTTP no Bruno](#etapa-1-hoje-uma-chamada-http-no-bruno) | Execute um GET em uma API fictícia pública | Consegue explicar método, URL, status e JSON |
| [2. Primeiro MCP](#etapa-2-primeiro-servidor-mcp-em-c) | Crie servidor C# com tool simples e teste no Inspector | Inspector lista e executa a tool |
| [3. API local](#etapas-3-e-4-api-local-e-tool-que-a-consulta) | Crie GET fictício em ASP.NET Core e teste no Bruno | API devolve sucesso e ausência de registro |
| [4. Integração](#etapas-3-e-4-api-local-e-tool-que-a-consulta) | Faça a tool MCP consultar a API com `HttpClient` | Resultado e falhas batem com a API |
| [5. Conversa](#etapas-5-a-7-agente-rag-e-skill) | Conecte um host compatível e observe a chamada da tool | Sabe demonstrar a origem da resposta |
| [6. RAG](#etapas-5-a-7-agente-rag-e-skill) | Recupere trecho de três documentos fictícios com fonte | Responde com fonte ou declara ausência |
| [7. Skill](#etapas-5-a-7-agente-rag-e-skill) | Escreva e avalie um procedimento de triagem | Casos adequados, inadequados e de erro passam |

A próxima etapa usa a entrega anterior. Se já dominar uma etapa, reproduza a evidência e siga adiante. Em cada etapa, **assista → leia o mínimo → pratique → confira a entrega**. Uma página traduzida da Microsoft pode conter vídeo com áudio em inglês; confira o idioma indicado. Os materiais listados são acessíveis sem pagamento; cadastro, versões e certificados podem variar.

### Etapa 1: hoje, uma chamada HTTP no Bruno

**Antes de clicar:** API é uma forma de um programa pedir dados a outro. Uma *requisição* é o pedido; a *resposta* traz um código de status e, neste caso, um corpo JSON (texto com campos como `id`). `GET` significa pedir a leitura de um recurso.

**Assista:** [O que é API? Vídeo para iniciantes na carreira de backend](https://www.youtube.com/watch?v=mR-Dlkmeg8o) (PT). **Leia e siga as telas:** [tutorial oficial de Bruno, do download à primeira requisição](https://blog.usebruno.com/bruno-tutorial) (EN, passo a passo visual). A [documentação oficial do Bruno](https://docs.usebruno.com/) explica os botões e a coleção. Há também [vídeos publicados pelo Bruno](https://www.youtube.com/@brunoapi) (EN, escolha a introdução disponível).

**Prática guiada (20–30 minutos após a introdução):** use a [API fictícia JSONPlaceholder](https://jsonplaceholder.typicode.com/). Não é preciso conta nem autenticação nela.

1. Instale e abra o Bruno seguindo o tutorial oficial acima. Crie uma coleção chamada `Aprendizado-API` em uma pasta sua.
2. Adicione uma requisição à coleção. Selecione o método `GET` e cole `https://jsonplaceholder.typicode.com/todos/1` no campo de URL.
3. Clique em **Send/Enviar**. Encontre o status da resposta e, no corpo, o campo `id`. Anote o que recebeu. Se não funcionar, confira a URL antes de procurar erro no código.
4. Salve a requisição. Crie ou duplique outra com `/todos/2`, envie e compare os dois valores de `id`.
5. Escreva em suas palavras: “o Bruno enviou uma requisição GET; o servidor respondeu com status e dados em JSON”.

**Entrega:** duas chamadas salvas no Bruno e uma frase sua explicando “enviei um GET para uma rota; recebi status e JSON com campos”. Se a API pública estiver indisponível, use qualquer GET público autorizado que devolva JSON; o objetivo é entender a chamada, não depender desse serviço específico.

**Confira:** `GET` é o método; o endereço tem `/todos/1`; o campo `id` indica o registro pedido. Se aparecer erro de conexão, confirme que a URL abre no navegador antes de mudar código. Se tiver dúvida sobre status, consulte [MDN HTTP](https://developer.mozilla.org/pt-BR/docs/Web/HTTP). **Depois, vá direto à Etapa 2.**

### Etapa 2: primeiro servidor MCP em C\#

**Começando C# do zero:** siga [as primeiras aulas de Programação em C# do Prof. Ermogenes Palacio](https://github.com/ermogenes/aulas-programacao-csharp) (PT; cada tópico aponta para vídeo e material escrito). Faça **Hello World**, variáveis, métodos e classes conforme a necessidade do exemplo MCP; a [playlist completa](https://www.youtube.com/playlist?list=PLk6PnAig6xXKg988f8Ewq1iFm4_ZH9nA5) fica como apoio, sem obrigação de assistir tudo. Se preferir aulas curtas oficiais, [C# para iniciantes da Microsoft](https://learn.microsoft.com/pt-br/shows/csharp-for-beginners/) tem vídeos (áudio original EN, interface PT).

**MCP explicado em vídeo:** comece com [por que MCP é importante — Código Fonte TV](https://www.youtube.com/watch?v=deprLB_y6Ho) (PT, visão geral); depois assista à [Introdução ao SDK C# para MCP — Microsoft](https://learn.microsoft.com/en-us/shows/on-dotnet/introduction-to-the-csharp-sdk-for-model-context-protocol-mcp) (EN, com demonstração). Para o conceito em texto PT, leia só [conceitos principais do MCP for Beginners](https://github.com/microsoft/mcp-for-beginners/blob/main/translations/pt-BR/01-CoreConcepts/README.md), da Microsoft.

**Prática guiada (60–90 minutos depois do básico necessário):** confira o SDK instalado com `dotnet --info`; em um projeto existente, veja também `TargetFramework` e `global.json`. Siga o [Getting Started oficial do SDK C#](https://csharp.sdk.modelcontextprotocol.io/v1/concepts/getting-started.html): crie um console `dotnet new console -n ServidorMcpLab`, adicione os pacotes `ModelContextProtocol` e `Microsoft.Extensions.Hosting` e use o exemplo mínimo de servidor stdio.

Mantenha uma tool como `saudar(nome)`. No [MCP Inspector](https://modelcontextprotocol.io/docs/tools/inspector), conecte-se ao servidor, liste as tools e execute uma chamada válida e outra sem argumento. Anote no README o comando, a entrada, a saída, o SDK usado e a falha observada. Se faltar conhecimento de C#, aprenda apenas o conceito que apareceu nesse exemplo: classe, método, atributo, `async` ou DI.

**Entrega:** o Inspector descobre e executa a tool. O servidor stdio escreve mensagens do protocolo no `stdout`; direcione logs para `stderr`. Você ainda não precisa de modelo, chave, RAG ou servidor remoto.

### Etapas 3 e 4: API local e tool que a consulta

**Para aprender enquanto faz:** veja [Implementando uma API Web no .NET — vídeo 3/8](https://learn.microsoft.com/pt-br/shows/back-end-web-development-with-dotnet-for-beginners/implementing-a-web-api-in-dotnet-backend-web-development-with-dotnet-for-beginners) (áudio EN, página PT); acompanhe com [a série completa para iniciantes](https://learn.microsoft.com/pt-br/shows/back-end-web-development-with-dotnet-for-beginners/) se precisar de contexto. Na aula de teste, refaça no Bruno o que o vídeo faz com arquivos `.http`. Para entender a documentação da API, consulte [OpenAPI no ASP.NET Core](https://learn.microsoft.com/pt-br/aspnet/core/fundamentals/openapi/overview?view=aspnetcore-10.0): OpenAPI é o contrato, Swagger UI é uma forma de visualizá-lo.

**Etapa 3:** siga [a primeira Web API da Microsoft](https://learn.microsoft.com/pt-br/aspnet/core/tutorials/first-web-api?view=aspnetcore-10.0) apenas até conseguir iniciar e chamar um GET local. Adapte o exemplo para dados fictícios. Salve no Bruno uma chamada com registro existente e outra com ID inexistente; documente o JSON e os status no OpenAPI. Escolha a versão da documentação correspondente ao `TargetFramework` do projeto.

**Para a ponte HTTP:** leia [IHttpClientFactory na Microsoft](https://learn.microsoft.com/pt-br/dotnet/core/extensions/httpclient-factory) apenas até compreender `HttpClient`, URL base e DI; volte ao [exemplo oficial do SDK MCP](https://csharp.sdk.modelcontextprotocol.io/v1/concepts/getting-started.html) para registrar a tool. Se o código parecer grande, identifique primeiro “onde está a entrada `id`”, “onde ocorre o GET” e “onde o resultado é devolvido”.

**Etapa 4:** faça uma tool `consultar_solicitacao(id)` chamar esse GET com `HttpClient` configurado por DI; use [IHttpClientFactory](https://learn.microsoft.com/pt-br/dotnet/core/extensions/httpclient-factory) como referência. Teste no Inspector ID válido, ID ausente e API fora do ar. Compare o resultado com o Bruno.

**Entrega:** a tool retorna os dados da API e distingue registro ausente de falha de conexão. Termine isso antes de adicionar RAG ou skills.

### Etapas 5 a 7: agente, RAG e skill

**Etapa 5 — conversa:** uma *tool* é uma função com nome e parâmetros claros; o agente pode solicitá-la, e a aplicação executa a chamada. Assista à [lição sobre agentes com tools — Microsoft, .NET](https://github.com/microsoft/Generative-AI-for-beginners-dotnet/blob/main/04-AgentsWithMAF/02-agents-with-tools.md) (EN, inclui vídeo e texto). Conecte o servidor a um host compatível, pergunte pelo status do registro e verifique no histórico se a tool foi chamada. Usar a própria tool no Inspector já prova a integração MCP antes de ter um modelo.

**Etapa 6 — RAG:** RAG significa buscar trechos relevantes *antes* de montar a resposta. Assista/acompanhe a [lição de RAG em .NET — Microsoft](https://github.com/microsoft/Generative-AI-for-beginners-dotnet/blob/main/03-AIPatternsAndApplications/02-retrieval-augmented-generation.md) (EN, vídeo e texto) e consulte a [explicação de RAG em .NET](https://learn.microsoft.com/pt-br/dotnet/ai/conceptual/rag) (PT). Adicione três documentos fictícios e uma busca que informe trecho e fonte; confira também o caso sem resposta confiável. Comece com busca simples, sem banco vetorial.

**Etapa 7 — skill:** leia a [especificação Agent Skills](https://agentskills.io/specification) (EN) e siga a [oficina em português deste repositório](05-ia-generativa-agentes-e-mlops.md#criação-de-agent-skills). Skill é um procedimento reutilizável guardado em `SKILL.md`; não é uma função que chama API. Escreva a skill de triagem e teste quando deve ser selecionada, quando não deve e o que fazer sem dados. A [documentação da Microsoft sobre skills em agentes](https://learn.microsoft.com/pt-br/agent-framework/agents/skills) é material adicional para quem usa esse framework; confira compatibilidade com o host escolhido. Vídeos específicos de produto podem usar outro formato de skill, por isso o padrão e o exercício escrito são a referência desta etapa.

**Entrega final:** uma demonstração reproduzível em que a resposta tem origem verificável e o procedimento não inventa dados.

## Projeto de estudo: catálogo de procedimentos fictícios

Imagine um catálogo de solicitações com campos `id`, `titulo`, `status` e `atualizadoEm`. Há também três documentos inventados, por exemplo “como abrir solicitação”, “estados permitidos” e “como interpretar erros”. O servidor MCP permite a um assistente consultar dados atuais e, depois, encontrar o trecho certo de documentação.

**Primeira versão, deliberadamente pequena:**

- Uma API local `GET /api/solicitacoes/{id}` retorna um registro fictício ou `404`.
- Um servidor MCP em C# expõe `consultar_solicitacao(id)` e chama essa API.
- O retorno informa apenas `id`, `titulo`, `status` e origem; nunca devolve o JSON inteiro por conveniência.
- O Bruno testa a API HTTP. O Inspector testa descoberta e execução MCP. Cada ferramenta prova uma camada distinta.
- Um teste cobre `id` válido, outro cobre `id` inexistente, e outro simula indisponibilidade ou timeout da API.

**Contrato da tool sugerido:** `id` obrigatório e validado; resultado com estado conhecido ou erro distinguível. Um `404` não deve virar “servidor indisponível”; um timeout não deve virar “registro inexistente”. Formate mensagens curtas para a pessoa e preserve detalhes técnicos úteis no log, sem credenciais.

### Como implementar sem misturar as camadas

1. **API:** implemente o GET local e descreva os status no OpenAPI. Teste no Bruno antes de conectar MCP. Se a equipe já tiver uma API autorizada, use a documentação dela apenas no ambiente permitido; não copie seus dados para este repositório.
2. **Cliente HTTP:** encapsule a chamada em uma classe com `HttpClient` configurado por DI. Defina URL base fora do código, timeout e cancelamento. Teste a tradução de `200`, `404`, `401/403`, `5xx` e falha de transporte.
3. **Servidor MCP:** no SDK C#, registre a tool com nome, descrição e parâmetros claros. Faça a tool chamar o cliente HTTP; não implemente lógica de negócio duplicada. Exponha primeiro via stdio.
4. **Inspector:** teste descoberta, argumento ausente, ID válido, inexistente e indisponibilidade. Confira se a descrição da tool ajuda o cliente a escolher quando usá-la.
5. **Host:** conecte a um cliente compatível, conforme o suporte disponível. Pergunte “qual o status da solicitação 123?” e confira no resultado observável se a tool foi chamada e se a resposta corresponde à API.

**Escolha de pacote:** o SDK oficial indica `ModelContextProtocol` para o começo com hosting/DI e stdio; `ModelContextProtocol.AspNetCore` é destinado a servidor MCP sobre HTTP. Não confunda o endpoint da API de negócio com o endpoint de transporte MCP. A migração para HTTP remoto é uma etapa posterior, com autenticação e implantação próprias.

## Tempo e ritmo

A ordem acima é obrigatória para este laboratório; a duração é flexível. Estas sessões são uma estimativa, não uma lista de cursos adicionais.

| Etapa | Sessões sugeridas | Aprendizado e entrega | Pode avançar quando... |
| --- | --- | --- | --- |
| 1. HTTP no Bruno | 1 | GET público e leitura da resposta | Consegue explicar request/response e JSON |
| 2. MCP mínimo | 1–2 | Servidor stdio e uma tool simples | Inspector lista a tool e a chama com entrada válida/inválida |
| 3–4. API e integração | 3–4 | API GET local; tool `consultar_solicitacao`, DI, `HttpClient` e testes | Resultado MCP bate com o Bruno; erros são distintos |
| 5. Uso conversacional | 1–2 | Host compatível, teste com e sem necessidade de tool | Sabe mostrar quando houve chamada e de onde veio a resposta |
| 6. Recuperação | 2–3 | Busca em 3 documentos fictícios, fonte e abstinência | Resposta aponta trecho; ausência de fonte é informada |
| 7. Skill e operação | 2–3 | Procedimento, casos de avaliação, logs e segurança | Fluxo resiste a dados faltantes e conteúdo adversarial |

**Rotina por sessão curta:** 10 minutos para ler o trecho necessário da documentação, 30–45 minutos para alterar e rodar algo, 10 minutos para registrar evidência e o próximo impedimento. Caso haja erro, o objetivo da sessão pode ser apenas reproduzi-lo e entendê-lo.

## Depois da primeira tool: resources, RAG e skill

**Resources:** apresente um documento estático fictício como conteúdo endereçável, se o host escolhido suportar a capacidade. Compare o que o host consegue ler com o resultado de uma tool. Não trate cada documento como uma nova tool automaticamente.

**RAG:** comece com busca simples nos três documentos; pergunte por um procedimento e mostre o trecho e o arquivo de origem. Quando houver volume e necessidade comprovada, estude chunking, embeddings, índice e avaliação da recuperação. RAG entrega contexto; não é sinônimo de MCP. Um servidor MCP pode expor `buscar_procedimento(pergunta)` que usa uma busca, mas a qualidade depende dos documentos, das permissões e dos resultados retornados. Veja [conceitos de RAG em .NET](https://learn.microsoft.com/pt-br/dotnet/ai/conceptual/rag).

**Agent Skill:** crie, em um exercício separado, uma pasta `triagem-solicitacoes/` com `SKILL.md`. Na descrição, diga quando a skill deve ser usada; nas instruções, defina passos para conferir status via tool, consultar o procedimento com fonte e declarar incerteza quando não houver evidência. Teste casos em que a skill deve e não deve ser ativada. O padrão de pastas e metadados vem da [especificação Agent Skills](https://agentskills.io/specification); a instalação depende do produto que executará o agente. Consulte também a [oficina de skills do guia 05](05-ia-generativa-agentes-e-mlops.md#criação-de-agent-skills).

## Glossário de bolso e ajuda quando travar

O host gerencia a experiência e a conexão; o servidor MCP disponibiliza capacidades. Uma **tool** executa uma operação definida. Um **resource** disponibiliza conteúdo endereçável; um **prompt MCP** fornece um modelo de interação; uma **Agent Skill** guarda instruções reutilizáveis para a tarefa. **RAG** recupera trechos de documentos para fundamentar respostas. Esses conceitos se relacionam, mas cada um resolve uma necessidade diferente.

| Termo ou dúvida | Tradução prática | O que conferir primeiro |
| --- | --- | --- |
| SDK .NET | Ferramentas para criar e executar projetos C# | `dotnet --info`; [primeiro programa C# com vídeo](https://learn.microsoft.com/pt-br/shows/csharp-for-beginners/hello-world-csharp-for-beginners) (EN) |
| Projeto de console | Programa que roda no terminal | Estar dentro da pasta do `.csproj` antes de `dotnet run` |
| Classe / método | Agrupamento de código / operação que recebe dados | Identificar entrada e valor devolvido no exemplo |
| `async` / `await` | Esperar uma operação de rede sem bloquear a execução | Localizar a chamada HTTP e onde o resultado é lido |
| DI | Receber dependências configuradas pelo aplicativo | Encontrar quem cria o cliente HTTP da tool |
| `200` / `404` / `500` | Sucesso / não encontrado / falha no servidor | Ler status e corpo separadamente no Bruno |
| Inspector não lista tool | O servidor pode não iniciar ou não registrar a tool | Comando, caminho, versão do SDK e logs no `stderr` |
| `CS8802` | Duas declarações de instruções de nível superior no mesmo projeto | Deixar apenas um arquivo com esse ponto de entrada; [referência Microsoft](https://learn.microsoft.com/pt-br/dotnet/csharp/fundamentals/program-structure/top-level-statements) |

**Método de estudo quando algo falhar:** registre o comando ou URL, o resultado esperado, a mensagem completa do erro e o que já tentou. Resolva a menor parte reproduzível e retome da entrega pendente. Se a aula usar uma versão diferente do SDK, siga a documentação correspondente ao seu `.csproj`, sem copiar mudanças de versão automaticamente.

## Testes que dão confiança

| Caso | API/Bruno | MCP/Inspector | Conversa/skill |
| --- | --- | --- | --- |
| ID existente | `200` com dados corretos | Retorna os campos previstos | Responde com o status observado |
| ID inexistente | `404` | Resultado de ausência distinguível | Não inventa registro |
| ID ausente ou malformado | Rejeita entrada inválida | Argumento validado | Pede ID válido |
| API fora do ar ou lenta | Falha reproduzível | Timeout/cancelamento tratado | Informa que não conseguiu consultar |
| Documento sem resposta | Não se aplica | Busca sem trecho confiável | Declara falta de fonte |
| Texto malicioso vindo da API | Dado de teste controlado | Não ganha privilégios | Não obedece instruções embutidas no dado |

Registre a versão do SDK, evidências dos testes e limitações no README do laboratório. Teste a lógica HTTP com respostas simuladas e a integração MCP com o Inspector. Na aplicação real, inclua observabilidade e testes automatizados conforme a infraestrutura do time.

## Antes de levar a um sistema real

- Confirme quais APIs, ambientes, campos e identidades podem ser acessados pelo servidor MCP. A tool deve respeitar autorização do usuário e escopo mínimo.
- Não publique tokens, prompts internos, documentos privados ou exemplos extraídos de produção. Use configuração segura e dados sintéticos em repositórios públicos.
- Não repasse tokens recebidos para outra API sem verificar público, escopo e fluxo de autorização. Valide entradas e não exponha execução arbitrária de shell, SQL, arquivos ou URLs.
- Trate respostas de API e trechos de RAG como dados não confiáveis, inclusive quando contêm instruções escritas em linguagem natural.
- Para transporte remoto, estude Streamable HTTP, autenticação, isolamento e política de logs. Não exponha um servidor local na rede para acelerar o primeiro teste.
- Para ferramentas de escrita, discuta com o time permissões, confirmação e auditoria antes de implementar. Uma tool de leitura é suficiente para aprender o protocolo.

Consulte [práticas de segurança do MCP](https://modelcontextprotocol.io/docs/tutorials/security/security_best_practices) e a [documentação do SDK C#](https://github.com/modelcontextprotocol/csharp-sdk). Conteúdo de documentação e código aberto é acessível gratuitamente; o uso de modelos ou infraestrutura de terceiros pode ter custo. Esta trilha não promete certificado.

## Próxima ação concreta

Comece pela **Etapa 1 no Bruno**. Guarde as duas requisições GET e sua explicação de método, status e JSON. Na Etapa 2, crie o servidor MCP e guarde a evidência da tool no Inspector. Use a tabela de entregas no início como seu marcador de progresso.
