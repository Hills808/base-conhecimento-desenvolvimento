# Cloud, DevOps e segurança — trilha por competências

Revisada em 30/09/2026. Cinco níveis de prática; use dados fictícios. Horas são estimativas de estudo/prática, não duração dos materiais.

Fluxo: entenda → material principal → exemplo resolvido → desafio → verificação → evidência → revisão.

O nível avançado demonstra autonomia nesta tarefa e exige revisão, prática e novas variações. A conclusão local não certifica experiência profissional nem domínio de toda a área.

## Nível 0 — Começo do zero

**Pré-requisito:** Um arquivo de texto ou projeto pequeno; nenhum serviço de cloud é necessário.
**Tempo estimado:** 3–5 h

### Entenda

Git guarda versões; branch isola uma mudança; PR explica o motivo e a verificação para quem revisa. Uma mudança pequena é mais fácil de entender e desfazer.

### Materiais de apoio

- [Pro Git — edição em português](https://git-scm.com/book/pt-br/v2) — Português · Livro · 25–40 min no trecho indicado. Leia snapshots, branches e desfazer alterações; pratique num repositório de estudo. Certificado não informado; não é requisito da etapa.
- [Learn Git Branching](https://learngitbranching.js.org/?locale=pt_BR) — Português · Prática · 25–40 min no trecho indicado. Faça os exercícios de commits e branches; desenhe o histórico antes do comando. Certificado não informado; não é requisito da etapa.

### Exemplo resolvido

1. Em repositório de estudo, crie uma branch para corrigir uma frase do README.
2. Use git diff para conferir o que mudou; crie um commit com mensagem que descreve a correção.
3. Abra um PR usando modelo-pull-request.md e registre como verificar a frase.

```text
Branch: docs/clarear-execucao
Commit: Explicar comando de execução no README
PR: motivo + mudança + como conferir
```

**Confira:** A pessoa revisora sabe o que mudou, por que e como conferir sem adivinhar.

**Se travar:** Comece por documentação de um repositório de estudo antes de configurar deploy.

### Faça sozinho

1. Prepare branch, commit e PR de uma mudança pequena.
2. Explique o diff e como reverter a mudança com segurança.

### Verificação com explicação

**Situação 1:** Qual PR é mais revisável?

- A: Uma mudança coerente com motivo e validação.
- B: Dez mudanças sem relação juntas.
- C: Um título “ajustes” sem descrição.

**Resposta:** A. Correto. A pessoa revisora sabe o que mudou, por que e como conferir sem adivinhar.

- B: Misturar assuntos dificulta revisão e diagnóstico.
- C: O título vago não comunica intenção nem validação.

**Aplique:** Prepare branch, commit e PR de uma mudança pequena.

### Evidência e revisão

Guarde o que tentou, o resultado observado, uma falha e a próxima dúvida. Compare com o resultado esperado. A página não inspeciona arquivos nem corrige texto livre automaticamente. Volte em sete dias e tente uma variação sem consultar.

## Nível 1 — Fundamentos aplicados

**Pré-requisito:** Git, uma aplicação e um teste simples.
**Tempo estimado:** 8–12 h

### Entenda

Pipeline executa comandos de qualidade num ambiente limpo. Container organiza execução, mas depende de configuração explícita e não conserta testes inúteis.

### Materiais de apoio

- [Início rápido do GitHub Actions](https://docs.github.com/pt/actions/get-started/quickstart) — Português · Tutorial · 25–40 min no trecho indicado. Adapte o build e teste ao seu projeto; comprove que a regra quebrada deixa o workflow vermelho. Certificado não informado; não é requisito da etapa.
- [Introdução ao Docker](https://docs.docker.com/get-started/) — Inglês · Tutorial · 25–40 min no trecho indicado. Rode um exemplo pequeno e confira configuração; não copie segredos para a imagem. Certificado não informado; não é requisito da etapa.

### Exemplo resolvido

1. Escreva o comando de build e teste do projeto no README e execute localmente.
2. Crie workflow que roda esses comandos em cada PR.
3. Quebre uma assertiva de propósito e confira pipeline vermelho; restaure a regra e veja verde.

```text
Gate: build → testes → artefato
Defeito controlado: saída 2 quando esperado 1 → teste deve falhar.
```

**Confira:** O pipeline é útil quando detecta o comportamento quebrado; só compilar não cobre regras.

**Se travar:** Repita o comando do pipeline localmente e compare versão do SDK e configuração.

### Faça sozinho

1. Automatize build/teste e guarde evidência de falha controlada.
2. Execute a aplicação em container sem senha gravada na imagem.

### Verificação com explicação

**Situação 1:** O pipeline compila, mas não executa testes. O que está comprovado?

- A: Toda regra de negócio.
- B: Somente que o build configurado passou.
- C: Que está seguro publicar qualquer mudança.

**Resposta:** B. Correto. O pipeline é útil quando detecta o comportamento quebrado; só compilar não cobre regras.

- A: Compilar não executa os cenários de negócio.
- C: Publicação precisa dos gates relevantes, além de build.

**Aplique:** Automatize build/teste e guarde evidência de falha controlada.

### Evidência e revisão

Guarde o que tentou, o resultado observado, uma falha e a próxima dúvida. Compare com o resultado esperado. A página não inspeciona arquivos nem corrige texto livre automaticamente. Volte em sete dias e tente uma variação sem consultar.

## Nível 2 — Construção

**Pré-requisito:** Pipeline, testes e configuração por ambiente.
**Tempo estimado:** 8–14 h

### Entenda

Observabilidade conecta operações e falhas usando metadados seguros. Token, documento e dados pessoais não precisam aparecer para diagnosticar uma dependência indisponível.

### Materiais de apoio

- [OpenTelemetry — introdução](https://opentelemetry.io/docs/getting-started/) — Inglês · Leitura · 25–40 min no trecho indicado. Entenda traces, métricas e logs; implemente só a correlação necessária ao cenário de estudo. Certificado não informado; não é requisito da etapa.
- [Segurança do GitHub Actions](https://docs.github.com/pt/actions/how-tos/secure-your-work) — Português · Leitura · 25–40 min no trecho indicado. Revise permissões mínimas, dependências e dados não confiáveis no workflow. Certificado não informado; não é requisito da etapa.

### Exemplo resolvido

1. Simule uma falha na consulta e gere log com operação, estado, duração e correlationId fictício.
2. Traceie o mesmo identificador em duas camadas sem registrar corpo ou token.
3. Revise permissões do serviço e onde segredos seriam fornecidos fora do repositório.

```text
operation=consultar_item status=timeout durationMs=2000 traceId=demo-01
Sem Authorization, nome de cliente ou payload.
```

**Confira:** Você acompanha a falha sem coletar dados desnecessários.

**Se travar:** Escolha uma pergunta operacional que o log deve responder e registre só os metadados necessários.

### Faça sozinho

1. Crie logs estruturados e um diagnóstico de incidente fictício.
2. Revise acesso mínimo e confirme que artefatos e logs não contêm segredos.

### Verificação com explicação

**Situação 1:** Qual log ajuda a investigar com minimização?

- A: Token completo e corpo inteiro.
- B: Somente “deu erro”, sem contexto.
- C: Operação, estado, duração e identificador seguro.

**Resposta:** C. Correto. Você acompanha a falha sem coletar dados desnecessários.

- A: Credenciais e payload sensível ampliam risco sem necessidade.
- B: A mensagem sem operação ou correlação dificulta diagnóstico.

**Aplique:** Crie logs estruturados e um diagnóstico de incidente fictício.

### Evidência e revisão

Guarde o que tentou, o resultado observado, uma falha e a próxima dúvida. Compare com o resultado esperado. A página não inspeciona arquivos nem corrige texto livre automaticamente. Volte em sete dias e tente uma variação sem consultar.

## Nível 3 — Confiabilidade

**Pré-requisito:** Testes, pipeline e diagnóstico por logs.
**Tempo estimado:** 12–18 h

### Entenda

Operar com confiabilidade exige limite de falha, estratégia de deploy e recuperação testada. Rollback precisa considerar dados e compatibilidade, não só código.

### Materiais de apoio

- [Ambientes de implantação — GitHub](https://docs.github.com/pt/actions/how-tos/deploy/configure-and-manage-deployments/manage-environments) — Português · Leitura · 25–40 min no trecho indicado. Confira revisões e regras disponíveis no plano do repositório; simule o processo se o recurso exigir outro plano. Certificado não informado; não é requisito da etapa.
- [Segurança do GitHub Actions](https://docs.github.com/pt/actions/how-tos/secure-your-work) — Português · Leitura · 25–40 min no trecho indicado. Revise permissões mínimas, dependências e dados não confiáveis no workflow. Certificado não informado; não é requisito da etapa.

### Exemplo resolvido

1. Defina indicador para uma API fictícia: proporção de chamadas válidas atendidas dentro de um limite de tempo.
2. Simule deploy com erro e descreva sinal de alerta, decisão de interromper e versão de retorno.
3. Use ambiente de estudo com aprovação de deploy; registre a diferença entre rollback de código e migração de dados.
4. Escreva um runbook com reprodução, ação e verificação de recuperação.

```text
Sinal: aumento de erro após versão v2
Ação: suspender rollout e restaurar v1
Conferir: contrato de dados continua compatível.
```

**Confira:** A recuperação tem um teste e uma condição de sucesso, não apenas um comando hipotético.

**Se travar:** Use uma migração fictícia em arquivo e simule compatibilidade antes de tocar num banco.

### Faça sozinho

1. Faça um exercício de incidente com linha do tempo e rollback de estudo.
2. Documente um controle de deploy e uma ameaça de supply chain.

### Verificação com explicação

**Situação 1:** Voltar o código garante desfazer qualquer migração de dados?

- A: Não; a compatibilidade e os dados precisam de plano próprio.
- B: Sim, git revert recupera automaticamente o banco.
- C: Sim, apagar os logs desfaz a falha.

**Resposta:** A. Correto. A recuperação tem um teste e uma condição de sucesso, não apenas um comando hipotético.

- B: Git versiona código, não restaura automaticamente estado externo.
- C: Apagar evidências não recupera serviço nem dados.

**Aplique:** Faça um exercício de incidente com linha do tempo e rollback de estudo.

**Situação 2:** O serviço voltou a responder após rollback. O que falta conferir?

- A: Só se o deploy aparece verde.
- B: Contrato, dados e indicadores de recuperação definidos no runbook.
- C: Nada: uma única resposta prova recuperação completa.

**Resposta:** B. Correto. Recuperação deve seguir critérios mensuráveis, incluindo compatibilidade.

- A: O estado do deploy não comprova o comportamento do serviço.
- C: Uma resposta não valida todos os consumidores e dados.

**Aplique:** Documente um controle de deploy e uma ameaça de supply chain.

### Evidência e revisão

Guarde o que tentou, o resultado observado, uma falha e a próxima dúvida. Compare com o resultado esperado. A página não inspeciona arquivos nem corrige texto livre automaticamente. Volte em sete dias e tente uma variação sem consultar.

## Nível 4 — Projeto avançado

**Pré-requisito:** Pipeline e runbook de incidente testados.
**Tempo estimado:** 16–24 h

### Entenda

Projeto: serviço de catálogo operável. A entrega combina PR, qualidade automatizada, configuração, deploy de estudo e diagnóstico de um incidente.

### Materiais de apoio

- [Início rápido do GitHub Actions](https://docs.github.com/pt/actions/get-started/quickstart) — Português · Tutorial · 25–40 min no trecho indicado. Adapte o build e teste ao seu projeto; comprove que a regra quebrada deixa o workflow vermelho. Certificado não informado; não é requisito da etapa.
- [Ambientes de implantação — GitHub](https://docs.github.com/pt/actions/how-tos/deploy/configure-and-manage-deployments/manage-environments) — Português · Leitura · 25–40 min no trecho indicado. Confira revisões e regras disponíveis no plano do repositório; simule o processo se o recurso exigir outro plano. Certificado não informado; não é requisito da etapa.

### Exemplo resolvido

1. Defina requisito e critérios de aceite do serviço; conecte commits a um item de trabalho fictício.
2. Automatize build, testes e empacotamento com versões explícitas.
3. Configure ambiente de estudo sem segredos no código e com revisão antes da publicação.
4. Simule falha de dependência e execute o runbook; registre quando o serviço foi considerado recuperado.
5. Prepare PR com evidências, risco restante e passos de reversão.

```text
Entrega: workflow + configuração de exemplo + runbook + evidência
Falha controlada: dependência retorna 503.
```

**Confira:** Outra pessoa consegue reproduzir qualidade e recuperação em ambiente de estudo.

**Se travar:** Pode simular publicação local; documente diferenças antes de configurar cloud com custos.

### Faça sozinho

1. Entregue serviço com pipeline, metadados seguros e exercício de incidente.
2. Justifique dois gates e teste que uma mudança ruim é bloqueada.

### Verificação com explicação

**Situação 1:** O que demonstra que um gate funciona?

- A: Ver o pipeline verde sem mudar nada.
- B: Introduzir defeito relevante e observar o bloqueio.
- C: Ter muitos passos com nomes sofisticados.

**Resposta:** B. Correto. Outra pessoa consegue reproduzir qualidade e recuperação em ambiente de estudo.

- A: Um verde isolado não demonstra detecção de erro.
- C: Quantidade de passos não substitui comportamento validado.

**Aplique:** Entregue serviço com pipeline, metadados seguros e exercício de incidente.

**Situação 2:** O serviço voltou a responder após rollback. O que falta conferir?

- A: Nada: uma única resposta prova recuperação completa.
- B: Só se o deploy aparece verde.
- C: Contrato, dados e indicadores de recuperação definidos no runbook.

**Resposta:** C. Correto. Recuperação deve seguir critérios mensuráveis, incluindo compatibilidade.

- A: Uma resposta não valida todos os consumidores e dados.
- B: O estado do deploy não comprova o comportamento do serviço.

**Aplique:** Justifique dois gates e teste que uma mudança ruim é bloqueada.

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
