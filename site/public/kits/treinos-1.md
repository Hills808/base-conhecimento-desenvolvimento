# Treinos de autonomia — módulo 1

Responda antes de ler a análise. Após a comparação, faça a variação e registre o resultado.

## Nível 0
### Caso novo
Um programa deve mostrar 'adulto' a partir de 18 anos. Preveja as saídas para 17, 18 e 19 antes de executar.

### Análise esperada
17 segue o ramo menor de idade; 18 e 19 satisfazem >=18. O teste de fronteira distingue >= de >.

### Transferência
Acrescente idade negativa e defina a validação antes da classificação.

### Evidências
- [ ] Justifiquei a decisão com uma evidência.
- [ ] Corrigi as divergências após comparar.
- [ ] Fiz a mudança proposta e expliquei o resultado.

## Nível 1
### Caso novo
Um conversor recebe '12', '0', '-3' e 'abc'. Defina o resultado e como evitar que uma entrada inválida pare o programa.

### Análise esperada
Separe leitura, conversão e regra do domínio. Texto inválido deve gerar mensagem controlada; zero e negativo dependem da regra explicitamente definida.

### Transferência
Teste espaços e campo vazio sem transformar falhas em zero.

### Evidências
- [ ] Justifiquei a decisão com uma evidência.
- [ ] Corrigi as divergências após comparar.
- [ ] Fiz a mudança proposta e expliquei o resultado.

## Nível 2
### Caso novo
Você percorre uma lista de nomes e precisa encontrar todos os que começam com A. Explique a solução para lista vazia e nomes repetidos.

### Análise esperada
Itere, aplique um critério de comparação explícito e preserve ou remova duplicatas conforme requisito. Lista vazia produz resultado vazio sem acesso inválido ao primeiro elemento.

### Transferência
O requisito passa a ignorar diferença entre maiúsculas e minúsculas.

### Evidências
- [ ] Justifiquei a decisão com uma evidência.
- [ ] Corrigi as divergências após comparar.
- [ ] Fiz a mudança proposta e expliquei o resultado.

## Nível 3
### Caso novo
Uma busca funciona com dez itens e fica lenta com um milhão. Proponha como medir e comparar duas soluções.

### Análise esperada
Use o mesmo conjunto, entradas representativas e medições repetidas. Discuta custo de tempo e memória e confirme equivalência das respostas antes de escolher.

### Transferência
O conjunto muda frequentemente: inclua custo de atualização na comparação.

### Evidências
- [ ] Justifiquei a decisão com uma evidência.
- [ ] Corrigi as divergências após comparar.
- [ ] Fiz a mudança proposta e expliquei o resultado.

## Nível 4
### Caso novo
Seu projeto de catálogo passa a precisar rejeitar identificadores duplicados sem perder registros existentes. Planeje a mudança e os testes.

### Análise esperada
Defina unicidade, resposta ao conflito, responsabilidade da validação e casos de sucesso, duplicidade e entrada inválida. Demonstre que a mudança preserva registros e comportamento anterior.

### Transferência
Uma importação contém duplicatas no próprio arquivo; defina atomicidade ou processamento parcial.

### Evidências
- [ ] Justifiquei a decisão com uma evidência.
- [ ] Corrigi as divergências após comparar.
- [ ] Fiz a mudança proposta e expliquei o resultado.
