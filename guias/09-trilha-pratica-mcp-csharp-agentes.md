# 09 — Trilha prática: MCP com C#, APIs, agentes e RAG

[← Voltar ao início](../README.md) · [APIs e Bruno](02-backend-apis-e-arquitetura.md) · [IA e agentes](05-ia-generativa-agentes-e-mlops.md)

**Atualizado em 25/09/2026.** Esta trilha é para quem desenvolve software em C# e precisa participar da criação de um servidor MCP que se conecta a APIs e, depois, a um assistente conversacional. Use dados fictícios em todos os exercícios. A versão do SDK e as regras do projeto real devem ser conferidas com o time.

## O resultado buscado

Construir e explicar um servidor MCP pequeno que expõe uma ferramenta de consulta, chama uma API ASP.NET Core, retorna um resultado compreensível e lida corretamente com erros. Testá-lo sem modelo de linguagem. Só depois conectar um cliente/host, acrescentar recuperação de documentos e escrever uma skill para orientar um fluxo de trabalho.

```text
Usuário → aplicação conversacional/host → cliente MCP → servidor MCP em C#
                                                     ↓
                                        serviço de negócio / API HTTP
                                                     ↓
                                         resposta tipada e limitada
```

O host gerencia a experiência e a conexão; o servidor MCP disponibiliza capacidades. Uma **tool** executa uma operação definida. Um **resource** disponibiliza conteúdo endereçável; um **prompt MCP** fornece um modelo de interação; uma **Agent Skill** guarda instruções reutilizáveis para a tarefa. **RAG** recupera trechos de documentos para fundamentar respostas. Esses conceitos se relacionam, mas cada um resolve uma necessidade diferente.

## O que estudar primeiro

| Prioridade | Aprenda o suficiente para | Material principal | Prática de saída |
| --- | --- | --- | --- |
| 1. HTTP e API | Ler método, rota, JSON, status e autenticação | [MDN HTTP](https://developer.mozilla.org/pt-BR/docs/Web/HTTP) e [guia 02](02-backend-apis-e-arquitetura.md) | Explicar um GET e reproduzi-lo no Bruno |
| 2. C# essencial | Criar projeto, método assíncrono, tipo de retorno, DI e logging | [Microsoft Learn — primeira Web API](https://learn.microsoft.com/pt-br/aspnet/core/tutorials/first-web-api?view=aspnetcore-10.0) | Executar e alterar um endpoint local |
| 3. MCP essencial | Entender host, cliente, servidor, tool e stdio | [MCP — construir servidor](https://modelcontextprotocol.io/docs/develop/build-server) | Rodar uma tool simples no Inspector |
| 4. SDK C# | Registrar tools e selecionar transporte | [SDK oficial — Getting Started](https://csharp.sdk.modelcontextprotocol.io/v1/concepts/getting-started.html) | Server com uma tool e validação de argumentos |
| 5. Integração | Consumir API e lidar com falhas | [IHttpClientFactory](https://learn.microsoft.com/pt-br/dotnet/core/extensions/httpclient-factory) | Tool de consulta que usa uma API fictícia |
| 6. RAG e skill | Recuperar contexto e guiar um procedimento | [RAG em .NET](https://learn.microsoft.com/pt-br/dotnet/ai/conceptual/rag) e [Agent Skills](https://agentskills.io/specification) | Resposta com fonte e procedimento avaliado |

**Regra para manter o foco:** enquanto a tool de leitura não funcionar e não tiver testes de erro, deixe frameworks de agentes, banco vetorial, múltiplos agentes e deploy remoto para depois. Não é preciso dominar ciência de dados para iniciar um servidor MCP de integração.

## Primeiro encontro: 60 a 90 minutos

1. Abra [Getting Started do SDK C#](https://csharp.sdk.modelcontextprotocol.io/v1/concepts/getting-started.html). Confira a versão de .NET instalada com `dotnet --info`; se houver projeto existente, confira `TargetFramework` e `global.json`.
2. Crie um projeto separado para o laboratório com `dotnet new console -n ServidorMcpLab`. Entre na pasta e instale `ModelContextProtocol` e `Microsoft.Extensions.Hosting` usando `dotnet add package` conforme o guia oficial.
3. Use o exemplo mínimo de servidor **stdio** da documentação do SDK como ponto de partida. Mantenha a primeira tool pequena, por exemplo `saudar(nome)`, e execute o projeto.
4. Abra o [MCP Inspector](https://modelcontextprotocol.io/docs/tools/inspector), configure o comando para iniciar o projeto e confira: conexão, lista de tools, esquema dos argumentos, chamada válida e chamada inválida.
5. Anote em um README: o comando que inicia o servidor, a entrada, o resultado obtido, a versão do SDK e uma falha que você conseguiu reproduzir.

**Entrega do primeiro encontro:** o Inspector descobre e chama uma tool local. Nenhum modelo, chave de API ou servidor HTTP é necessário para essa entrega. Em stdio, logs precisam ir para `stderr`: escrever no `stdout` mistura logs com mensagens do protocolo.

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

## Sequência de estudo e entrega

As sessões podem ser distribuídas conforme a rotina. Passe para a próxima etapa quando a entrega estiver pronta, sem obrigação de cumprir uma semana fixa.

| Etapa | Sessões sugeridas | Aprendizado e entrega | Pode avançar quando... |
| --- | --- | --- | --- |
| A. Base útil | 2–3 | HTTP, Bruno, C# assíncrono; API GET local | Consegue explicar request/response e reproduzir `200`/`404` |
| B. MCP mínimo | 2 | Servidor stdio e uma tool simples | Inspector lista a tool e a chama com entrada válida/inválida |
| C. MCP + API | 3–4 | Tool `consultar_solicitacao`, DI, `HttpClient`, falhas e testes | Resultado MCP bate com o Bruno; erros são distintos |
| D. Uso conversacional | 2 | Host compatível, teste com e sem necessidade de tool | Sabe mostrar quando houve chamada e de onde veio a resposta |
| E. Recuperação | 2–3 | Busca em 3 documentos fictícios, fonte e abstinência | Resposta aponta trecho; ausência de fonte é informada |
| F. Skill e operação | 2–3 | Procedimento, casos de avaliação, logs e segurança | Fluxo resiste a dados faltantes e conteúdo adversarial |

**Rotina por sessão curta:** 10 minutos para ler o trecho necessário da documentação, 30–45 minutos para alterar e rodar algo, 10 minutos para registrar evidência e o próximo impedimento. Caso haja erro, o objetivo da sessão pode ser apenas reproduzi-lo e entendê-lo.

## Depois da primeira tool: resources, RAG e skill

**Resources:** apresente um documento estático fictício como conteúdo endereçável, se o host escolhido suportar a capacidade. Compare o que o host consegue ler com o resultado de uma tool. Não trate cada documento como uma nova tool automaticamente.

**RAG:** comece com busca simples nos três documentos; pergunte por um procedimento e mostre o trecho e o arquivo de origem. Quando houver volume e necessidade comprovada, estude chunking, embeddings, índice e avaliação da recuperação. RAG entrega contexto; não é sinônimo de MCP. Um servidor MCP pode expor `buscar_procedimento(pergunta)` que usa uma busca, mas a qualidade depende dos documentos, das permissões e dos resultados retornados. Veja [conceitos de RAG em .NET](https://learn.microsoft.com/pt-br/dotnet/ai/conceptual/rag).

**Agent Skill:** crie, em um exercício separado, uma pasta `triagem-solicitacoes/` com `SKILL.md`. Na descrição, diga quando a skill deve ser usada; nas instruções, defina passos para conferir status via tool, consultar o procedimento com fonte e declarar incerteza quando não houver evidência. Teste casos em que a skill deve e não deve ser ativada. O padrão de pastas e metadados vem da [especificação Agent Skills](https://agentskills.io/specification); a instalação depende do produto que executará o agente. Consulte também a [oficina de skills do guia 05](05-ia-generativa-agentes-e-mlops.md#criação-de-agent-skills).

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

Comece pelo **primeiro encontro** acima. Guarde três artefatos: um servidor que o Inspector consegue chamar, a captura ou registro da tool descoberta e um README com o comando de execução. O passo seguinte é fazer essa mesma tool consultar uma API fictícia testada no Bruno.
