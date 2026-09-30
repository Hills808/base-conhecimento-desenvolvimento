# Backend, APIs e .NET — trilha por competências

Revisada em 30/09/2026. Cinco níveis de prática; use dados fictícios. Horas são estimativas de estudo/prática, não duração dos materiais.

Fluxo: entenda → material principal → exemplo resolvido → desafio → verificação → evidência → revisão.

O nível avançado demonstra autonomia nesta tarefa e exige revisão, prática e novas variações. A conclusão local não certifica experiência profissional nem domínio de toda a área.

## Nível 0 — Começo do zero

**Pré-requisito:** Nenhum para observar a primeira resposta; lógica entra na implementação.
**Tempo estimado:** 3–5 h

### Entenda

HTTP descreve o pedido e seu resultado de transporte. JSON é o formato do corpo: campos presentes, null e ausentes não significam a mesma coisa.

### Materiais de apoio

- [HTTP — MDN](https://developer.mozilla.org/pt-BR/docs/Web/HTTP) — Português · Leitura · 25–40 min no trecho indicado. Leia visão geral e mensagens HTTP; localize método, status, headers e corpo na sua requisição. Certificado não informado; não é requisito da etapa.
- [APIs .NET para iniciantes — Microsoft](https://learn.microsoft.com/pt-br/shows/back-end-web-development-with-dotnet-for-beginners/) — Inglês · página traduzida · Vídeo · Um episódio por sessão. Veja introdução a APIs e implementação. Narração em inglês; a página traduzida ajuda a localizar cada episódio. Certificado não informado; não é requisito da etapa.

### Exemplo resolvido

1. Abra https://jsonplaceholder.typicode.com/posts/1 no navegador e encontre id e title.
2. No Bruno, crie uma coleção e uma GET para a mesma URL; envie e encontre status e Body.
3. Compare o JSON didático abaixo: marque as chaves antes de interpretar valores.

```text
{"id":1,"notes":null,"views":0}
```

**Confira:** notes existe sem valor; views vale zero; author não está presente. Um 200 não garante campos que não vieram.

**Se travar:** No navegador você vê o corpo; use o Bruno para localizar também o status e os headers.

### Faça sozinho

1. Registre método, URL, status e dois campos da GET.
2. Escreva o que você pode e não pode afirmar sobre o JSON didático.

### Verificação com explicação

**Situação 1:** author não aparece. Qual valor você pode informar?

- A: Zero.
- B: O valor da requisição anterior.
- C: Nenhum; declare que o campo não foi fornecido.

**Resposta:** C. Correto. notes existe sem valor; views vale zero; author não está presente. Um 200 não garante campos que não vieram.

- A: Zero é um valor e não representa um campo ausente.
- B: Uma chamada anterior não comprova o dado da resposta atual.

**Aplique:** Registre método, URL, status e dois campos da GET.

### Evidência e revisão

Guarde o que tentou, o resultado observado, uma falha e a próxima dúvida. Compare com o resultado esperado. A página não inspeciona arquivos nem corrige texto livre automaticamente. Volte em sete dias e tente uma variação sem consultar.

## Nível 1 — Fundamentos aplicados

**Pré-requisito:** Ler método, status, corpo e campos JSON.
**Tempo estimado:** 5–8 h

### Entenda

OpenAPI descreve parâmetros e schemas. Bruno executa chamadas e confere resultados reais; manter os dois coerentes exige testar valores e campos, não apenas status.

### Materiais de apoio

- [Testes no Bruno — documentação oficial](https://docs.usebruno.com/testing/tests/introduction) — Inglês · Tutorial · 25–40 min no trecho indicado. Leia como validar status e campos; introduza uma expectativa errada para conferir que falha. Certificado não informado; não é requisito da etapa.
- [HTTP — MDN](https://developer.mozilla.org/pt-BR/docs/Web/HTTP) — Português · Leitura · 25–40 min no trecho indicado. Leia visão geral e mensagens HTTP; localize método, status, headers e corpo na sua requisição. Certificado não informado; não é requisito da etapa.

### Exemplo resolvido

1. Abra contrato-api-ficticia.yaml no kit e localize /itens/{id}, GET e os campos required.
2. No Bruno use a API de demonstração para criar assertivas res.status equals 200 e res.body.id equals 1.
3. Troque a expectativa do id para 2 e confirme a falha; restaure 1. Para o contrato fictício, documente os casos antes de implementar a API.

```text
GET /posts/1
Assert: res.status equals 200
Assert: res.body.id equals 1
```

**Confira:** A assertiva de campo falha quando o valor muda, mesmo que HTTP continue 200.

**Se travar:** Não existe API rodando para o YAML do kit: primeiro desenhe os casos; execute-os na sua implementação local depois.

### Faça sozinho

1. Descreva um endpoint com entrada, saída e erros em OpenAPI.
2. Guarde coleção Bruno com testes de status, valor e campo obrigatório.

### Verificação com explicação

**Situação 1:** O status passa, mas id deveria ser 1 e voltou 2. O contrato foi validado?

- A: Não; a divergência do campo deve falhar.
- B: Sim, pois 200 basta.
- C: Sim, pois o corpo é JSON.

**Resposta:** A. Correto. A assertiva de campo falha quando o valor muda, mesmo que HTTP continue 200.

- B: O status não confere os valores do contrato.
- C: JSON válido pode carregar conteúdo incorreto.

**Aplique:** Descreva um endpoint com entrada, saída e erros em OpenAPI.

### Evidência e revisão

Guarde o que tentou, o resultado observado, uma falha e a próxima dúvida. Compare com o resultado esperado. A página não inspeciona arquivos nem corrige texto livre automaticamente. Volte em sete dias e tente uma variação sem consultar.

## Nível 2 — Construção

**Pré-requisito:** Contrato, testes Bruno e C# básico; use o módulo 1 se necessário.
**Tempo estimado:** 10–16 h

### Entenda

DTO representa o formato transportado; serviço aplica a regra. Quando um campo some, acompanhe JSON → DTO → serviço → resposta para achar onde a informação foi perdida.

### Materiais de apoio

- [Primeira Web API — ASP.NET Core](https://learn.microsoft.com/pt-br/aspnet/core/tutorials/first-web-api?view=aspnetcore-10.0) — Português · Tutorial · 25–40 min no trecho indicado. Implemente uma GET, teste a porta local no Bruno e só depois extraia DTO e serviço. Certificado não informado; não é requisito da etapa.
- [Nomes de propriedades JSON — System.Text.Json](https://learn.microsoft.com/pt-br/dotnet/standard/serialization/system-text-json/customize-properties) — Português · Leitura · 25–40 min no trecho indicado. Leia JsonPropertyName e política de nomes; compare className com NomeClasse. Certificado não informado; não é requisito da etapa.
- [APIs .NET para iniciantes — Microsoft](https://learn.microsoft.com/pt-br/shows/back-end-web-development-with-dotnet-for-beginners/) — Inglês · página traduzida · Vídeo · Um episódio por sessão. Veja introdução a APIs e implementação. Narração em inglês; a página traduzida ajuda a localizar cada episódio. Certificado não informado; não é requisito da etapa.

### Exemplo resolvido

1. Siga o tutorial Microsoft de primeira Web API até conseguir uma GET local; copie a porta mostrada no terminal.
2. Crie um DTO para um item e separe a consulta em serviço; teste a GET no Bruno.
3. Simule JSON com className e DTO com nome diferente; registre o valor em cada fronteira e corrija o mapeamento explicitamente.

```text
JSON: {"className":"Essencial"}
DTO: [JsonPropertyName("className")] public string? NomeClasse { get; set; }
```

**Confira:** O atributo descreve a origem do nome; um teste de desserialização confirma o valor sem pedir ao prompt para corrigir o dado.

**Se travar:** Se a raiz / retorna 404, teste a rota criada pelo tutorial; isso não prova que o servidor parou.

### Faça sozinho

1. Crie API de catálogo com DTO, GET e teste de mapeamento.
2. Demonstre sucesso, ausência e entrada inválida com coleção Bruno.

### Verificação com explicação

**Situação 1:** className veio no JSON mas NomeClasse ficou null. Por onde começar?

- A: Mandar o modelo inventar o campo.
- B: Conferir desserialização e mapeamento antes do prompt.
- C: Trocar null por um nome padrão sem investigar.

**Resposta:** B. Correto. O atributo descreve a origem do nome; um teste de desserialização confirma o valor sem pedir ao prompt para corrigir o dado.

- A: O modelo não corrige um contrato de transporte quebrado.
- C: Um padrão silencioso esconde o defeito e muda a informação.

**Aplique:** Crie API de catálogo com DTO, GET e teste de mapeamento.

### Evidência e revisão

Guarde o que tentou, o resultado observado, uma falha e a próxima dúvida. Compare com o resultado esperado. A página não inspeciona arquivos nem corrige texto livre automaticamente. Volte em sete dias e tente uma variação sem consultar.

## Nível 3 — Confiabilidade

**Pré-requisito:** API local, DTOs, testes de contrato e contexto autenticado.
**Tempo estimado:** 10–18 h

### Entenda

Identidade vem da autenticação; permissão de consultar um recurso precisa ser verificada no servidor. Timeout e retry exigem limites e semântica da operação.

### Materiais de apoio

- [Autorização por recurso — ASP.NET Core](https://learn.microsoft.com/pt-br/aspnet/core/security/authorization/resource-based?view=aspnetcore-10.0) — Português · Leitura · 25–40 min no trecho indicado. Leia IAuthorizationService e a verificação após carregar o recurso; aplique a identidades fictícias. Certificado não informado; não é requisito da etapa.
- [HTTP resiliente — .NET](https://learn.microsoft.com/pt-br/dotnet/core/resilience/http-resilience) — Português · Leitura · 25–40 min no trecho indicado. Leia timeout e repetição de métodos não seguros; explique como evitar duplicar uma escrita. Certificado não informado; não é requisito da etapa.

### Exemplo resolvido

1. Em ambiente de teste, use identidades fictícias A e B com recursos diferentes; não crie bypass na API real.
2. A tente ler recurso de B: teste que a política nega sem corpo sensível. Teste contexto ausente separadamente.
3. Simule dependência lenta; defina timeout/cancelamento e registre uma falha estruturada sem token.
4. Compare GET e POST: documente por que repetir uma escrita pode duplicar dados.

```text
A autenticado → recurso B → acesso negado
Sem identidade → nenhuma consulta
POST com timeout → não repetir sem garantia de idempotência
```

**Confira:** Autorização e limites são aplicados pelo servidor, e uma falha de rede não autoriza repetir qualquer operação.

**Se travar:** Comece simulando uma dependência; teste a política antes de usar qualquer credencial real.

### Faça sozinho

1. Adicione testes de acesso negado, timeout e schema inválido.
2. Documente política de retries, cancelamento e logs sem payload sensível.

### Verificação com explicação

**Situação 1:** Um POST teve timeout. É seguro repetir sempre?

- A: Sim, timeout prova que nada aconteceu.
- B: Sim, basta repetir até retornar 200.
- C: Não; a escrita pode ter acontecido e ser duplicada.

**Resposta:** C. Correto. Autorização e limites são aplicados pelo servidor, e uma falha de rede não autoriza repetir qualquer operação.

- A: O cliente pode perder a resposta depois de a operação acontecer.
- B: Repetição ilimitada pode duplicar operações e sobrecarregar o serviço.

**Aplique:** Adicione testes de acesso negado, timeout e schema inválido.

**Situação 2:** A API devolve className, mas o serviço usa outra chave. Como comprovar a correção?

- A: Teste de desserialização/mapeamento com JSON e saída esperados.
- B: Uma frase no prompt pedindo o nome certo.
- C: Aceitar string vazia sempre.

**Resposta:** A. Correto. O teste verifica a fronteira em que o campo se perdia.

- B: O prompt não corrige o transporte nem o DTO.
- C: Aceitar vazio esconde a divergência e deixa o consumidor sem dado.

**Aplique:** Documente política de retries, cancelamento e logs sem payload sensível.

### Evidência e revisão

Guarde o que tentou, o resultado observado, uma falha e a próxima dúvida. Compare com o resultado esperado. A página não inspeciona arquivos nem corrige texto livre automaticamente. Volte em sete dias e tente uma variação sem consultar.

## Nível 4 — Projeto avançado

**Pré-requisito:** API protegida e cenários de erro demonstrados.
**Tempo estimado:** 16–24 h

### Entenda

Projeto: catálogo de procedimentos fictícios. Um consumidor só pode usar os campos autorizados que o contrato fornece; alterações devem preservar compatibilidade ou explicitar a migração.

### Materiais de apoio

- [Testes de integração — ASP.NET Core](https://learn.microsoft.com/pt-br/aspnet/core/test/integration-tests?view=aspnetcore-10.0) — Português · Leitura · 25–40 min no trecho indicado. Use WebApplicationFactory no projeto de estudo; identidades simuladas pertencem só ao teste. Certificado não informado; não é requisito da etapa.
- [Primeira Web API — ASP.NET Core](https://learn.microsoft.com/pt-br/aspnet/core/tutorials/first-web-api?view=aspnetcore-10.0) — Português · Tutorial · 25–40 min no trecho indicado. Implemente uma GET, teste a porta local no Bruno e só depois extraia DTO e serviço. Certificado não informado; não é requisito da etapa.

### Exemplo resolvido

1. Descubra três casos de uso e dois fora de escopo; escreva contrato de consulta, paginação e ausência.
2. Implemente serviço/DTOs e autorização por recurso com dados locais fictícios.
3. Crie coleção Bruno e testes de integração para sucesso, inexistente, proibido, validação, timeout e mapeamento divergente.
4. Simule uma mudança de nome de campo; documente a compatibilidade e a decisão de versão.
5. Prepare PR com README, contrato, resultados e como desfazer a mudança.

```text
Entrega: openapi.yaml + coleção Bruno + API + testes
Mudança: className → nomeClasse; consumidor antigo não pode quebrar sem plano.
```

**Confira:** A demonstração inclui contrato, diagnóstico de falha e compatibilidade; o PR é reproduzível por outra pessoa.

**Se travar:** Comece com uma rota GET e uma tabela local; acrescente os casos até cobrir o contrato.

### Faça sozinho

1. Entregue o catálogo com pelo menos oito casos e uma falha intencional detectada.
2. Justifique uma alternativa de contrato e os limites do serviço.

### Verificação com explicação

**Situação 1:** Qual mudança precisa de análise de compatibilidade?

- A: Remover ou renomear um campo usado pelo consumidor.
- B: Corrigir apenas uma frase no README.
- C: Adicionar um comentário interno sem mudar comportamento.

**Resposta:** A. Correto. A demonstração inclui contrato, diagnóstico de falha e compatibilidade; o PR é reproduzível por outra pessoa.

- B: Uma frase não altera o contrato transportado.
- C: Um comentário sem efeito não altera o schema.

**Aplique:** Entregue o catálogo com pelo menos oito casos e uma falha intencional detectada.

**Situação 2:** A API devolve className, mas o serviço usa outra chave. Como comprovar a correção?

- A: Aceitar string vazia sempre.
- B: Teste de desserialização/mapeamento com JSON e saída esperados.
- C: Uma frase no prompt pedindo o nome certo.

**Resposta:** B. Correto. O teste verifica a fronteira em que o campo se perdia.

- A: Aceitar vazio esconde a divergência e deixa o consumidor sem dado.
- C: O prompt não corrige o transporte nem o DTO.

**Aplique:** Justifique uma alternativa de contrato e os limites do serviço.

### Evidência e revisão

Guarde o que tentou, o resultado observado, uma falha e a próxima dúvida. Compare com o resultado esperado. A página não inspeciona arquivos nem corrige texto livre automaticamente. Volte em sete dias e tente uma variação sem consultar.

## Rubrica do projeto final

| Critério | Evidência suficiente |
| --- | --- |
| Requisito | Objetivo, limites e critérios definidos antes da solução. |
| Execução | Entrega reproduzível e resultado esperado demonstrado. |
| Falhas | Caso negativo investigado e verificado, sem esconder o erro. |
| Decisões | Alternativa comparada e escolha justificada com limites. |
| Transferência | Mudança de requisito ou exemplo novo executado sem copiar solução. |
| Revisão | Outra pessoa consegue conferir; pendências ficam explícitas. |

Não conclua enquanto houver um bloqueador de segurança, integridade dos dados ou execução. Um quiz certo verifica raciocínio pontual; a entrega precisa de evidência prática.
