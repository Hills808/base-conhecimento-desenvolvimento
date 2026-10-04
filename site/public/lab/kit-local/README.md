# Curva Aberta — kit local de API, Bruno, MCP e recuperação

Use dados fictícios em uma pasta de estudo. Não é um serviço autenticado de produção. A API escuta somente em `127.0.0.1`; não exponha esta demonstração na rede.

## Antes de executar

- .NET SDK 10.0, compatível com o `global.json` incluído.
- Bruno para abrir a coleção; não é necessário para os testes de API em C#.
- O MCP usa `ModelContextProtocol` **1.4.1**, com documentação e API dessa família. Não misture exemplos v2 ao editar esse projeto. A família mais recente deve ser estudada como migração separada.
- Comandos abaixo partem desta pasta, que contém `global.json`.

## Primeiro: leia a API

```bash
dotnet run --project ApiPerfil --urls http://127.0.0.1:5080
```

Em outro terminal, abra `Bruno/` como coleção e selecione o ambiente **Local**. Execute as cinco requisições e leia a aba de testes.

| Caso | O que conferir |
| --- | --- |
| Completo | `resolved`, nome e biografia em texto |
| Null | `partial`, biografia presente com `null` |
| Ausente | biografia sem chave no objeto `data` |
| Negado | HTTP 403, nenhum `data` exposto |
| Regressão | HTTP 200 com tipo incorreto; o teste comprova que detectou a fixture inválida |

A requisição Regressão passa ao confirmar a presença do defeito intencional. Em um teste de contrato normal, exigir `nome` como texto faria essa resposta falhar. Diferencie “detectar uma fixture ruim” de “aprovar o contrato”.

Para conferir os mesmos cenários em C#:

```bash
dotnet run --project VerificarApi
```

Importe `openapi.json` no Swagger Editor ou no Bruno para observar o contrato. O documento descreve os cenários; não disponibiliza uma interface Swagger dentro da API.

## Depois: tool MCP real em stdio

```bash
dotnet build PerfilMcp
dotnet run --project VerificarMcp
```

O cliente inicia o servidor, descobre `consultar_perfil`, chama a tool e confere que a biografia permanece ausente. Não há modelo de IA neste teste. Logs do servidor usam stderr; stdout fica reservado ao protocolo.

O servidor retorna texto JSON, seguindo o exemplo v1 existente. Não o apresente como `structuredContent` ou output schema nativo. `ReadOnly` descreve a tool; não implementa autorização. O catálogo `demo-1` é uma fixture local, sem identidade real.

## Recuperação com fonte, sem geração

```bash
dotnet run --project RagLocal
dotnet run --project RagLocal -- "HTTP 200 biografia"
```

O programa testa cinco consultas e recupera trechos com uma identificação de fonte. Usa busca lexical e resposta extrativa, sem embeddings ou LLM. Perguntas sem suporte declaram insuficiência. A fixture hostil é excluída por regra explícita; isso não demonstra resistência de um modelo real a prompt injection.

Variação: acrescente uma fonte conflitante, crie uma pergunta de avaliação antes de mudar o ranking e explique por que o primeiro resultado mudou. Não transforme instruções recuperadas em permissões para tools.

## Evidência para concluir

- Registre método, URL, status, chaves, null e ausência de cada cenário.
- Mostre os cinco resultados da API e a chamada real de tool, com versão do SDK.
- Troque um tipo de propósito, observe a falha e reverta a alteração.
- Guarde uma pergunta sem resposta no corpus e explique a recusa.
- Declare os limites: fixtures, sem autorização de produção, sem avaliação de LLM, sem envio de mensagens.

Referência do formato de testes: [documentação oficial Bruno](https://docs.usebruno.com/testing/tests/introduction). Referência de versões: [releases oficiais do SDK C# MCP](https://github.com/modelcontextprotocol/csharp-sdk/releases).
