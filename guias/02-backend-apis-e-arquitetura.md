# 02 — Backend, APIs e arquitetura

[← Voltar ao início](../README.md)

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
| [RealWorld](https://github.com/gothinkster/realworld) | A mesma aplicação implementada em diversas stacks para comparação | Intermediário | Inglês, gratuito 🧩 |

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
