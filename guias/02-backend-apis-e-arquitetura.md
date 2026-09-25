# 02 — Backend, APIs e arquitetura

[← Voltar ao início](../README.md)

Se o objetivo é construir um servidor MCP em C# ligado a uma API, siga a [trilha prática MCP](09-trilha-pratica-mcp-csharp-agentes.md). Este guia dá a base de HTTP, Swagger/OpenAPI, Bruno e ASP.NET Core necessária para a etapa de integração.

## Trilha de API para o trabalho

**Atualização: 24/09/2026.** Prioridade: conseguir entender, consumir, testar e diagnosticar APIs existentes; depois construir e automatizar. As etapas e os laboratórios abaixo são sugestões de estudo, não implementações já executadas.

| Peça | O que representa | O que aprender a fazer |
|---|---|---|
| HTTP/API | Comunicação entre sistemas | Montar uma requisição e interpretar a resposta |
| OpenAPI | Contrato legível por ferramentas | Encontrar rotas, parâmetros, schemas, autenticação e respostas |
| Swagger UI | Interface interativa para um contrato OpenAPI | Explorar endpoints e testar chamadas autorizadas |
| Bruno | Cliente de APIs e testes | Organizar coleções, ambientes e verificações reproduzíveis |
| .NET / ASP.NET Core | Plataforma e framework do servidor | Localizar e implementar endpoints, regras, validação e testes |

**Ordem recomendada:** HTTP → leitura do Swagger/OpenAPI → Bruno → leitura de código C# → implementação ASP.NET Core → testes e automação.

1. **Entender uma chamada:** método, URL, path/query parameters, headers, body JSON, `Content-Type`, autenticação e códigos de resposta. Entrega: explicar uma chamada real usando dados fictícios.
2. **Ler o contrato:** localizar campos obrigatórios, formatos, exemplos, paginação, respostas de erro e esquema de autenticação. Entrega: anotar entrada, saída e restrições de três endpoints.
3. **Reproduzir no Bruno:** criar coleção, variável `baseUrl`, ambientes local/homologação e chamadas encadeadas. Entrega: outra pessoa executar a coleção sem editar cada URL.
4. **Investigar no .NET:** seguir rota → controller ou handler → serviço → persistência; entender DTOs, injeção de dependência, `async/await`, configuração e logs. Entrega: localizar onde uma resposta de erro é produzida.
5. **Construir e validar:** implementar uma API pequena, documentar o contrato e testar sucesso e falhas. Entrega: projeto + coleção + instruções reproduzíveis.
6. **Automatizar:** testes de integração e execução da coleção em CI contra ambiente descartável. Entrega: falha de teste interromper a pipeline sem expor segredos.

## Fontes oficiais para APIs, Swagger, Bruno e .NET

Conteúdo de leitura gratuito; não há promessa de certificado nestes links. Alguns produtos têm recursos pagos: confirme a edição antes de depender deles.

| Recurso | Idioma | Uso prático |
|---|---|---|
| [MDN — HTTP](https://developer.mozilla.org/pt-BR/docs/Web/HTTP) | PT/EN | Fundamentos, headers, métodos, cache e status |
| [Swagger — estrutura OpenAPI](https://swagger.io/docs/specification/v3_0/basic-structure/) | EN | Ler um contrato YAML/JSON; esta referência usa OpenAPI 3.0 |
| [ASP.NET Core — visão geral de OpenAPI](https://learn.microsoft.com/pt-br/aspnet/core/fundamentals/openapi/overview?view=aspnetcore-10.0) | PT | Entender a geração de documentos no .NET |
| [ASP.NET Core — interfaces para documentos OpenAPI](https://learn.microsoft.com/pt-br/aspnet/core/fundamentals/openapi/using-openapi-documents?view=aspnetcore-10.0) | PT | Distinguir documento gerado de Swagger UI/outra interface |
| [Bruno — documentação](https://docs.usebruno.com/) | EN | Requisições, autenticação, coleções e integração com Git |
| [Bruno — variáveis](https://docs.usebruno.com/variables/overview) | EN | Separar URLs e configurações por ambiente |
| [Bruno — testes](https://docs.usebruno.com/testing/tests/introduction) | EN | Verificar status e conteúdo das respostas |
| [Bruno — automação](https://docs.usebruno.com/testing/automate-test/automate-test) | EN | Executar testes com CLI e integrar ao CI |
| [Microsoft — primeira Web API](https://learn.microsoft.com/pt-br/aspnet/core/tutorials/first-web-api?view=aspnetcore-10.0) | PT | Construir uma API com ASP.NET Core |
| [Microsoft — testes de integração](https://learn.microsoft.com/pt-br/aspnet/core/test/integration-tests?view=aspnetcore-10.0) | PT | Testar a aplicação com infraestrutura de teste ASP.NET Core |

**Atenção às versões:** consulte `TargetFramework` no `.csproj`, `global.json` quando existir e os SDKs instalados antes de seguir um tutorial. Os links Microsoft acima estão fixados em .NET 10 como referência; selecione a versão usada no trabalho. Não migre o sistema apenas para acompanhar um curso.

**Swagger não é sinônimo de OpenAPI:** o contrato pode existir sem uma interface visual. Nas versões modernas do ASP.NET Core, `AddOpenApi`/`MapOpenApi` pertencem à geração e exposição do documento; uma UI exige configuração adicional. Tutoriais com Swashbuckle e `AddSwaggerGen` usam outra configuração. Siga uma abordagem compatível com o projeto, sem misturar receitas. Evite expor documentação interativa sensível sem controle de acesso.

## Laboratório .NET + Swagger + Bruno

**Projeto sugerido:** API de tarefas com dados fictícios. Primeiro siga o tutorial oficial; depois adapte o domínio. Comece pequeno, sem microsserviços.

| Cenário | Endpoint sugerido | Evidência a produzir |
|---|---|---|
| Listar e filtrar | `GET /api/tarefas?status=aberta` | Retorno coerente, lista vazia e paginação definida |
| Consultar | `GET /api/tarefas/{id}` | Sucesso e identificador inexistente |
| Criar | `POST /api/tarefas` | Validação e resposta `201` com localização do recurso |
| Atualizar | `PUT /api/tarefas/{id}` | Contrato claro de substituição; não tratar PUT e PATCH como iguais |
| Excluir | `DELETE /api/tarefas/{id}` | Resultado documentado e comportamento de repetição |

**Incrementos de implementação:**

- Comece com DTOs, validação e armazenamento de laboratório; depois adicione EF Core e um banco local, se fizer sentido.
- Documente sucesso e erros com formato consistente, por exemplo Problem Details. Defina os códigos no contrato: entrada inválida, recurso ausente, conflito e falha interna.
- Crie uma coleção Bruno com pastas de consulta, escrita e cenários negativos. Separe `baseUrl` por ambiente e mantenha tokens fora do Git.
- Teste campos relevantes, não apenas status `200`; encadeie criação → consulta → atualização → remoção com o identificador criado no próprio teste.
- Adicione testes de integração com `WebApplicationFactory`; mantenha dados e dependências isolados. Depois execute a coleção pela CLI em CI.
- Como evolução, implemente autenticação e autorização segundo o padrão do time. Verifique diferenças entre ausência de autenticação (`401`) e falta de permissão (`403`).

**Critério de conclusão:** outra pessoa consegue iniciar a API, abrir o contrato, configurar o Bruno e executar testes de sucesso e falha com dados de laboratório. Nenhuma credencial ou dado corporativo acompanha o repositório.

## Checklist para investigar problemas no trabalho

- Confirme ambiente, URL base, rota, método e versão da API antes de alterar código.
- Compare os headers, o JSON e os parâmetros enviados com o contrato; registre uma reprodução mínima sem segredos.
- Em `401/403`, verifique validade, audiência e permissões do token sem publicá-lo em chats, logs ou issues.
- Diferencie erro de transporte/TLS/proxy, resposta HTTP e falha de regra de negócio. CORS é uma restrição de navegador, não a explicação padrão para falhas no Bruno.
- Use horário e identificador de correlação para encontrar logs; remova dados pessoais ao compartilhar evidências.
- Não repita automaticamente operações de escrita após timeout: confirme se foram processadas e se há mecanismo de idempotência.
- Testes destrutivos devem usar ambiente e registros descartáveis autorizados, nunca produção por conveniência.

## Conceitos essenciais

- [MDN HTTP](https://developer.mozilla.org/pt-BR/docs/Web/HTTP) — métodos, status, headers, CORS, cookies e cache. 📚
- [HTTP Cats](https://http.cat/) — referência visual para códigos de status HTTP. 📚 🌐
- [REST API Tutorial](https://restfulapi.net/) — princípios REST apresentados de forma objetiva. 📚 🌐
- [Microsoft Learn — ASP.NET Core](https://learn.microsoft.com/pt-br/aspnet/core/) — documentação oficial para aplicações e APIs .NET. 📚
- [Full Stack Open](https://fullstackopen.com/en/) — APIs, testes, containers e CI/CD em uma aplicação completa. 📚 🌐

Antes de escolher um framework, entenda request/response, idempotência, autenticação, paginação, cache, concorrência, contratos e tratamento de erros.

## APIs modernas

| Recurso | Finalidade | Nível | Idioma/acesso |
| --- | --- | --- | --- |
| [Learn GraphQL](https://graphql.org/learn/) | Consultas tipadas, schemas, mutations e boas práticas de APIs GraphQL | Iniciante → intermediário | Inglês, gratuito 📚 |
| [gRPC Documentation](https://grpc.io/docs/) | RPC baseado em Protocol Buffers, streaming e comunicação eficiente entre serviços | Intermediário | Inglês, gratuito 📚 |
| [AsyncAPI Docs](https://www.asyncapi.com/docs) | Documentação e design de APIs orientadas a eventos | Intermediário | Inglês, gratuito 📚 |
| [JSON Schema Learn](https://json-schema.org/learn) | Modelagem e validação de dados JSON | Iniciante → intermediário | Inglês, gratuito 📚 |
| [OpenAPI Specification](https://spec.openapis.org/oas/latest.html) | Contratos de APIs HTTP independentes de linguagem | Intermediário | Inglês, gratuito 📚 |

Não trate REST, GraphQL, gRPC e mensageria como concorrentes universais. Compare necessidades de clientes, latência, cache, evolução de contrato e comunicação síncrona ou assíncrona.

## Ferramentas para APIs

- [Bruno](https://www.usebruno.com/) — cliente local com coleções versionáveis no Git. 📚 🌐
- [Postman Academy](https://academy.postman.com/) — APIs, coleções e testes; verifique as condições atuais de badges. 🏅 🌐
- [Hoppscotch](https://hoppscotch.io/) — teste APIs no navegador. 📚 🌐
- [Hurl](https://github.com/Orange-OpenSource/hurl) — requisições e testes HTTP em arquivos de texto, útil em CI. 🧩 🌐
- [httpYac](https://httpyac.github.io/) — cliente HTTP baseado em arquivos `.http`. 📚 🌐
- [OpenAPI Generator](https://github.com/OpenAPITools/openapi-generator) — gera SDKs, stubs e documentação a partir de OpenAPI. 🧩 🌐
- [Scalar](https://github.com/scalar/scalar) — documentação e clientes para APIs OpenAPI. 🧩 🌐

## Arquitetura de software

| Recurso | Finalidade | Nível | Idioma/acesso |
| --- | --- | --- | --- |
| [Architect Modern Web Applications with ASP.NET Core and Azure](https://learn.microsoft.com/en-us/dotnet/architecture/modern-web-apps-azure/) | Decisões arquiteturais, modularidade, testes e deploy em aplicações .NET | Intermediário | Inglês, gratuito 📚 |
| [System Design Primer](https://github.com/donnemartin/system-design-primer) | Conceitos e exercícios de projeto de sistemas escaláveis | Intermediário → avançado | Inglês, gratuito 🧩 |
| [Azure Architecture Center](https://learn.microsoft.com/en-us/azure/architecture/) | Padrões, arquiteturas de referência e trade-offs para sistemas em cloud | Intermediário → avançado | Inglês, gratuito 📚 |
| [Microsoft eShop](https://github.com/dotnet/eShop) | Aplicação de referência moderna para serviços em .NET | Intermediário → avançado | Inglês, gratuito 🧩 |
| [Ardalis Clean Architecture](https://github.com/ardalis/CleanArchitecture) | Template ASP.NET Core para estudar separação de responsabilidades | Intermediário | Inglês, gratuito 🧩 |
| [RealWorld](https://github.com/realworld-apps/realworld) | A mesma aplicação implementada em diversas stacks para comparação | Intermediário | Inglês, gratuito 🧩 |

### Ordem recomendada

1. construa primeiro um monólito simples e bem testado;
2. separe responsabilidades quando o código demonstrar essa necessidade;
3. aprenda filas, cache e observabilidade;
4. estude sistemas distribuídos antes de adotar microserviços;
5. registre decisões importantes em ADRs.

Arquitetura é gestão de trade-offs. Um padrão só é útil quando resolve uma restrição concreta do sistema.

## Projeto sugerido

Crie uma API versionada com:

- autenticação e autorização;
- validação de entrada e erros padronizados;
- banco relacional e migrações;
- paginação, filtros e documentação OpenAPI;
- testes unitários, integração e contrato;
- cache para uma leitura frequente;
- logs, métricas e trace de uma operação;
- pipeline de CI e deploy reproduzível.
