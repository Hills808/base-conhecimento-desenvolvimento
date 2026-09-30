# Dados e machine learning — trilha por competências

Revisada em 30/09/2026. Cinco níveis de prática; use dados fictícios. Horas são estimativas de estudo/prática, não duração dos materiais.

Fluxo: entenda → material principal → exemplo resolvido → desafio → verificação → evidência → revisão.

O nível avançado demonstra autonomia nesta tarefa e exige revisão, prática e novas variações. A conclusão local não certifica experiência profissional nem domínio de toda a área.

## Nível 0 — Começo do zero

**Pré-requisito:** Nenhum de SQL; leia o significado de tabela, linha e coluna no material.
**Tempo estimado:** 5–8 h

### Entenda

Uma consulta responde uma pergunta sobre linhas. LEFT JOIN preserva itens sem categoria; INNER JOIN os remove quando não encontra relação.

### Materiais de apoio

- [Consultar dados com SQL — Microsoft](https://learn.microsoft.com/pt-br/training/paths/get-started-querying-with-transact-sql/) — Português · Curso · 25–40 min no trecho indicado. Estude SELECT, filtros e JOIN. O material usa T-SQL; o kit tem SQL simples para SQLite/PostgreSQL. Certificado não informado; não é requisito da etapa.
- [Tutorial PostgreSQL](https://www.postgresql.org/docs/current/tutorial.html) — Inglês · Tutorial · 25–40 min no trecho indicado. Use SELECT e joins; confira a contagem e o registro sem categoria. Certificado não informado; não é requisito da etapa.

### Exemplo resolvido

1. Abra consultas-sql-ficticias.sql do kit e execute em um banco de teste SQLite ou PostgreSQL local.
2. Rode SELECT * FROM itens: confirme três linhas. Execute o LEFT JOIN do arquivo e localize “Sem categoria”.
3. Troque por INNER JOIN e compare: ficam duas linhas. Explique qual pergunta cada consulta responde.

```text
LEFT JOIN: Caderno, Caneta, Sem categoria
INNER JOIN: Caderno, Caneta
```

**Confira:** A diferença vem da relação ausente, não de um erro de sintaxe.

**Se travar:** Execute CREATE e INSERT uma vez num banco vazio; se a tabela já existe, confira antes de recriar.

### Faça sozinho

1. Escreva consulta que mantém itens sem categoria e outra que encontra só esses itens.
2. Compare contagens e confira um registro manualmente.

### Verificação com explicação

**Situação 1:** Por que o item sem categoria desaparece no INNER JOIN?

- A: Porque valor 7 é muito baixo.
- B: Não existe linha correspondente na tabela de categorias.
- C: Porque JOIN sempre apaga dados do banco.

**Resposta:** B. Correto. A diferença vem da relação ausente, não de um erro de sintaxe.

- A: A coluna valor não faz parte da condição de associação.
- C: SELECT não apaga os registros; apenas retorna uma seleção.

**Aplique:** Escreva consulta que mantém itens sem categoria e outra que encontra só esses itens.

### Evidência e revisão

Guarde o que tentou, o resultado observado, uma falha e a próxima dúvida. Compare com o resultado esperado. A página não inspeciona arquivos nem corrige texto livre automaticamente. Volte em sete dias e tente uma variação sem consultar.

## Nível 1 — Fundamentos aplicados

**Pré-requisito:** SELECT, filtros, JOIN e explicação de contagem.
**Tempo estimado:** 8–12 h

### Entenda

Uma análise reproduzível guarda dados de entrada, transformações e limite da conclusão. Um campo ausente não deve virar zero sem uma regra justificada.

### Materiais de apoio

- [Machine Learning Crash Course — Google](https://developers.google.com/machine-learning/crash-course?hl=pt-br) — Português · tradução disponível · Curso · 25–40 min no trecho indicado. Estude conjuntos de dados, treino/teste e métricas antes de redes neurais. Certificado não informado; não é requisito da etapa.
- [Consultar dados com SQL — Microsoft](https://learn.microsoft.com/pt-br/training/paths/get-started-querying-with-transact-sql/) — Português · Curso · 25–40 min no trecho indicado. Estude SELECT, filtros e JOIN. O material usa T-SQL; o kit tem SQL simples para SQLite/PostgreSQL. Certificado não informado; não é requisito da etapa.

### Exemplo resolvido

1. Exporte os itens fictícios para CSV; registre versão e significado das colunas.
2. Calcule contagem e média de valor, mantendo explícitos os ausentes.
3. Escreva uma hipótese antes do gráfico e confira se os três itens bastam para sustentá-la.

```text
3 itens; média = (18.50 + 4 + 7) / 3
Limite: amostra didática pequena, não representa um mercado.
```

**Confira:** A conta é verificável, mas a conclusão não pode extrapolar a amostra sem justificativa.

**Se travar:** Comece com uma tabela pequena e confira as contas manualmente antes de usar bibliotecas.

### Faça sozinho

1. Produza relatório com pergunta, transformação, gráfico e uma limitação.
2. Demonstre o efeito de um valor ausente com e sem tratamento.

### Verificação com explicação

**Situação 1:** Um campo ausente pode virar zero em qualquer análise?

- A: Sim; ausência significa zero.
- B: Sim; melhora qualquer média.
- C: Não; a regra precisa de justificativa e deve ser registrada.

**Resposta:** C. Correto. A conta é verificável, mas a conclusão não pode extrapolar a amostra sem justificativa.

- A: Ausência e zero têm significados diferentes.
- B: Trocar ausentes por zero pode enviesar o resultado.

**Aplique:** Produza relatório com pergunta, transformação, gráfico e uma limitação.

### Evidência e revisão

Guarde o que tentou, o resultado observado, uma falha e a próxima dúvida. Compare com o resultado esperado. A página não inspeciona arquivos nem corrige texto livre automaticamente. Volte em sete dias e tente uma variação sem consultar.

## Nível 2 — Construção

**Pré-requisito:** Python básico, análise e noções de média, variabilidade e classificação.
**Tempo estimado:** 12–18 h

### Entenda

Baseline é uma solução simples para comparação. Separar treino e teste evita medir só o que o modelo viu; transformações aprendidas também precisam respeitar essa divisão.

### Materiais de apoio

- [Machine Learning Crash Course — Google](https://developers.google.com/machine-learning/crash-course?hl=pt-br) — Português · tradução disponível · Curso · 25–40 min no trecho indicado. Estude conjuntos de dados, treino/teste e métricas antes de redes neurais. Certificado não informado; não é requisito da etapa.
- [Vazamento e boas práticas — scikit-learn](https://scikit-learn.org/stable/common_pitfalls.html) — Inglês · Leitura · 25–40 min no trecho indicado. Leia inconsistent preprocessing e data leakage; compare com o exemplo em português desta etapa. Certificado não informado; não é requisito da etapa.

### Exemplo resolvido

1. Use um dataset didático do scikit-learn. Separe treino e teste antes de ajustar qualquer transformação.
2. Crie DummyClassifier como baseline e um modelo simples; aplique a mesma divisão e métrica.
3. Use Pipeline para o pré-processamento aprendido no treino; avalie o teste somente para a decisão final.

```text
Treino → ajustar transformação/modelo
Validação → escolher configuração
Teste reservado → estimar resultado final
```

**Confira:** Um modelo complexo só merece ser escolhido se a comparação adequada justificar seu custo e limitações.

**Se travar:** Se Python ainda bloqueia, volte ao módulo 1; primeiro execute o exemplo oficial sem mudar vários parâmetros.

### Faça sozinho

1. Compare baseline e modelo com split registrado e métrica explicada.
2. Guarde a configuração e evite usar o teste para escolher parâmetros.

### Verificação com explicação

**Situação 1:** Onde ajustar um normalizador que aprende média e escala?

- A: Somente nos dados de treino.
- B: Em todos os dados antes do split.
- C: Nos dados de teste para melhorar a nota.

**Resposta:** A. Correto. Um modelo complexo só merece ser escolhido se a comparação adequada justificar seu custo e limitações.

- B: Usar todos os dados deixa informação do teste influenciar o treinamento.
- C: O teste deve simular dados novos, não ensinar o pré-processamento.

**Aplique:** Compare baseline e modelo com split registrado e métrica explicada.

### Evidência e revisão

Guarde o que tentou, o resultado observado, uma falha e a próxima dúvida. Compare com o resultado esperado. A página não inspeciona arquivos nem corrige texto livre automaticamente. Volte em sete dias e tente uma variação sem consultar.

## Nível 3 — Confiabilidade

**Pré-requisito:** Baseline, Pipeline, divisão de dados e métrica.
**Tempo estimado:** 12–20 h

### Entenda

Qualidade inclui vazamento, métricas por grupo e mudanças na distribuição. Uma boa média pode esconder um grupo com desempenho ruim ou dados do futuro no treino.

### Materiais de apoio

- [Vazamento e boas práticas — scikit-learn](https://scikit-learn.org/stable/common_pitfalls.html) — Inglês · Leitura · 25–40 min no trecho indicado. Leia inconsistent preprocessing e data leakage; compare com o exemplo em português desta etapa. Certificado não informado; não é requisito da etapa.
- [Avaliação e validação — scikit-learn](https://scikit-learn.org/stable/modules/cross_validation.html) — Inglês · Leitura · 25–40 min no trecho indicado. Leia holdout e validação cruzada. Escolha divisão temporal quando a pergunta depende de tempo. Certificado não informado; não é requisito da etapa.

### Exemplo resolvido

1. Crie uma coluna derivada do resultado futuro e observe como ela torna a métrica artificialmente boa; remova-a do experimento.
2. Use divisão temporal se o problema depende do tempo; não misture futuro com passado.
3. Compare resultados por grupos didáticos e registre uma política de monitoramento, sem usar atributos reais de pessoas.

```text
Feature proibida: resultado_da_próxima_semana
Treino: semanas 1–8; validação: 9–10; teste: 11–12
```

**Confira:** A avaliação usa apenas informação disponível no momento da previsão e explicita onde o modelo falha.

**Se travar:** Escreva o instante da previsão e marque a disponibilidade de cada coluna.

### Faça sozinho

1. Audite três fontes possíveis de vazamento e compare métricas por grupo.
2. Defina um sinal de mudança de distribuição e ação de revisão.

### Verificação com explicação

**Situação 1:** Uma variável só fica disponível após o resultado. Pode entrar no modelo?

- A: Sim, pois melhora a métrica.
- B: Não, se não estará disponível quando a previsão for usada.
- C: Sim, se o nome parecer técnico.

**Resposta:** B. Correto. A avaliação usa apenas informação disponível no momento da previsão e explicita onde o modelo falha.

- A: Métrica alta com informação futura não representa o uso real.
- C: O nome não muda quando a informação estará disponível.

**Aplique:** Audite três fontes possíveis de vazamento e compare métricas por grupo.

**Situação 2:** Você mudou o modelo após olhar o teste reservado várias vezes. O que deve reconhecer?

- A: Que a nota final continua imparcial em qualquer caso.
- B: Que basta escolher só a melhor execução.
- C: O teste foi usado para seleção; é preciso nova validação independente.

**Resposta:** C. Correto. O conjunto deixou de ser independente da decisão de configuração.

- A: A decisão foi influenciada pelos resultados do teste.
- B: Selecionar o melhor resultado oculta variabilidade e pode superestimar desempenho.

**Aplique:** Defina um sinal de mudança de distribuição e ação de revisão.

### Evidência e revisão

Guarde o que tentou, o resultado observado, uma falha e a próxima dúvida. Compare com o resultado esperado. A página não inspeciona arquivos nem corrige texto livre automaticamente. Volte em sete dias e tente uma variação sem consultar.

## Nível 4 — Projeto avançado

**Pré-requisito:** Análise reproduzível e avaliação sem vazamento.
**Tempo estimado:** 18–28 h

### Entenda

Projeto: previsão de volume de tickets fictícios. O objetivo é ajudar a planejar capacidade com incerteza explícita, não tomar decisões sobre pessoas.

### Materiais de apoio

- [Avaliação e validação — scikit-learn](https://scikit-learn.org/stable/modules/cross_validation.html) — Inglês · Leitura · 25–40 min no trecho indicado. Leia holdout e validação cruzada. Escolha divisão temporal quando a pergunta depende de tempo. Certificado não informado; não é requisito da etapa.
- [Vazamento e boas práticas — scikit-learn](https://scikit-learn.org/stable/common_pitfalls.html) — Inglês · Leitura · 25–40 min no trecho indicado. Leia inconsistent preprocessing e data leakage; compare com o exemplo em português desta etapa. Certificado não informado; não é requisito da etapa.

### Exemplo resolvido

1. Crie dados sintéticos com data, volume e eventos conhecidos antes da previsão; guarde seed e gerador.
2. Defina horizonte, baseline, split temporal e métrica antes de treinar.
3. Compare baseline e modelo simples; registre erro por período e limite de uso.
4. Defina como repetir o experimento, versionar dados/configuração e detectar mudança de padrão.
5. Entregue relatório, código e PR com uma hipótese rejeitada.

```text
Horizonte: próxima semana
Baseline: média das 4 semanas anteriores
Teste: período futuro reservado
Saída: previsão e erro observado
```

**Confira:** A entrega pode favorecer o baseline se o modelo não demonstrar benefício; a decisão é sustentada por evidência.

**Se travar:** Comece com baseline e dados pequenos; só acrescente modelo após validar o protocolo.

### Faça sozinho

1. Entregue gerador, pipeline, comparação e relatório de limites.
2. Faça uma mudança de distribuição simulada e explique como reagir.

### Verificação com explicação

**Situação 1:** Se o modelo não supera o baseline, qual decisão é defensável?

- A: Ocultar o resultado do baseline.
- B: Escolher o modelo só por ser ML.
- C: Manter o baseline e registrar a comparação.

**Resposta:** C. Correto. A entrega pode favorecer o baseline se o modelo não demonstrar benefício; a decisão é sustentada por evidência.

- A: Ocultar a referência impede uma avaliação honesta.
- B: O nome da técnica não comprova benefício.

**Aplique:** Entregue gerador, pipeline, comparação e relatório de limites.

**Situação 2:** Você mudou o modelo após olhar o teste reservado várias vezes. O que deve reconhecer?

- A: O teste foi usado para seleção; é preciso nova validação independente.
- B: Que a nota final continua imparcial em qualquer caso.
- C: Que basta escolher só a melhor execução.

**Resposta:** A. Correto. O conjunto deixou de ser independente da decisão de configuração.

- B: A decisão foi influenciada pelos resultados do teste.
- C: Selecionar o melhor resultado oculta variabilidade e pode superestimar desempenho.

**Aplique:** Faça uma mudança de distribuição simulada e explique como reagir.

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
