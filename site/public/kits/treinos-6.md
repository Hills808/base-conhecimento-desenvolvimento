# Treinos de autonomia — módulo 6

Responda antes de ler a análise. Após a comparação, faça a variação e registre o resultado.

## Nível 0
### Caso novo
Um PR altera um endpoint sem explicar como foi validado. Escreva o que falta para a revisão.

### Análise esperada
Descreva requisito, mudança, comandos ou passos de teste, resultado e possíveis impactos. Um revisor precisa conseguir reproduzir a validação.

### Transferência
Inclua como desfazer a alteração se surgir regressão.

### Evidências
- [ ] Justifiquei a decisão com uma evidência.
- [ ] Corrigi as divergências após comparar.
- [ ] Fiz a mudança proposta e expliquei o resultado.

## Nível 1
### Caso novo
Um pipeline fica verde mesmo quando um teste falha localmente. O que investigar?

### Análise esperada
Confira se o teste é descoberto e executado, versões, comandos, variáveis e código de saída. Provoque falha intencional para verificar que o gate bloqueia.

### Transferência
Remova uma variável obrigatória e observe se a falha é clara.

### Evidências
- [ ] Justifiquei a decisão com uma evidência.
- [ ] Corrigi as divergências após comparar.
- [ ] Fiz a mudança proposta e expliquei o resultado.

## Nível 2
### Caso novo
Um log facilita depuração, mas registra token e corpo com dados de cliente. Redesenhe a telemetria.

### Análise esperada
Registre correlação, categoria, duração e metadados mínimos; remova segredo e dados sensíveis. Teste falhas com dados fictícios para verificar o que de fato é emitido.

### Transferência
Revise retenção e quem tem acesso ao destino dos logs.

### Evidências
- [ ] Justifiquei a decisão com uma evidência.
- [ ] Corrigi as divergências após comparar.
- [ ] Fiz a mudança proposta e expliquei o resultado.

## Nível 3
### Caso novo
Uma release aumenta erros apenas em parte do tráfego. Como decidir recuperação?

### Análise esperada
Compare versão, segmento, janela e métricas de erro/latência. Use critérios previamente definidos para pausar ou reverter e confirme compatibilidade do rollback.

### Transferência
Uma migração impede rollback simples; documente recuperação alternativa.

### Evidências
- [ ] Justifiquei a decisão com uma evidência.
- [ ] Corrigi as divergências após comparar.
- [ ] Fiz a mudança proposta e expliquei o resultado.

## Nível 4
### Caso novo
Prepare uma simulação de incidente de indisponibilidade para seu serviço de demonstração.

### Análise esperada
Inclua detecção, responsáveis, diagnóstico, mitigação, comunicação, recuperação e revisão. Meça a execução e transforme a causa em melhoria verificável.

### Transferência
O monitoramento principal também falha; teste um sinal independente.

### Evidências
- [ ] Justifiquei a decisão com uma evidência.
- [ ] Corrigi as divergências após comparar.
- [ ] Fiz a mudança proposta e expliquei o resultado.
