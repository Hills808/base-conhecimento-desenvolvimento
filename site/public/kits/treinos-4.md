# Treinos de autonomia — módulo 4

Responda antes de ler a análise. Após a comparação, faça a variação e registre o resultado.

## Nível 0
### Caso novo
Uma tabela tem dois pedidos de A e nenhum de B. Uma consulta precisa listar ambos com a quantidade correta. Explique o JOIN.

### Análise esperada
Parta dos clientes e preserve quem não tem pedido com LEFT JOIN; conte uma chave de pedido não nula para obter zero para B. COUNT(*) pode contar a linha preservada.

### Transferência
Adicione dois itens por pedido e verifique duplicação da contagem.

### Evidências
- [ ] Justifiquei a decisão com uma evidência.
- [ ] Corrigi as divergências após comparar.
- [ ] Fiz a mudança proposta e expliquei o resultado.

## Nível 1
### Caso novo
A média de vendas aumentou depois que registros ausentes viraram zero. Você aprovaria o relatório?

### Análise esperada
Confira transformação, população e cálculo: trocar ausência por zero precisa de justificativa e pode alterar métricas. Reconstrua o resultado com uma base pequena verificável.

### Transferência
Compare média e mediana com um valor extremo.

### Evidências
- [ ] Justifiquei a decisão com uma evidência.
- [ ] Corrigi as divergências após comparar.
- [ ] Fiz a mudança proposta e expliquei o resultado.

## Nível 2
### Caso novo
Você normalizou todos os dados antes de separar treino e teste. Qual o problema e como corrigir?

### Análise esperada
O pré-processamento aprendeu informações do teste. Faça a divisão antes e ajuste transformações apenas no treino; aplique a transformação aprendida ao restante.

### Transferência
Os dados têm tempo: escolha uma divisão que respeite a previsão futura.

### Evidências
- [ ] Justifiquei a decisão com uma evidência.
- [ ] Corrigi as divergências após comparar.
- [ ] Fiz a mudança proposta e expliquei o resultado.

## Nível 3
### Caso novo
Um classificador tem alta acurácia e quase nunca detecta a classe rara. Como avaliar?

### Análise esperada
Examine distribuição, matriz de confusão, precisão, recall e custo dos erros conforme objetivo. Compare com baseline e avalie limiar sem ajustar pelo conjunto final de teste.

### Transferência
O custo de falso negativo aumenta: revise o critério de escolha.

### Evidências
- [ ] Justifiquei a decisão com uma evidência.
- [ ] Corrigi as divergências após comparar.
- [ ] Fiz a mudança proposta e expliquei o resultado.

## Nível 4
### Caso novo
Um modelo perde desempenho após mudança na origem dos dados. Prepare investigação e recuperação.

### Análise esperada
Compare schema, distribuição, rótulos e métricas segmentadas; identifique falha de pipeline ou mudança do problema. Registre versão, baseline, decisão de revalidar ou voltar e monitoramento.

### Transferência
A origem nova omite uma variável importante; demonstre falha controlada.

### Evidências
- [ ] Justifiquei a decisão com uma evidência.
- [ ] Corrigi as divergências após comparar.
- [ ] Fiz a mudança proposta e expliquei o resultado.
