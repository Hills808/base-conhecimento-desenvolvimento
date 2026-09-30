# Treinos de autonomia — módulo 8

Responda antes de ler a análise. Após a comparação, faça a variação e registre o resultado.

## Nível 0
### Caso novo
Leia: 'The field is optional. If absent, do not infer a value.' Explique a instrução em português.

### Análise esperada
O campo é opcional; se estiver ausente, não se deve inferir um valor. Optional não significa que o valor é zero.

### Transferência
Escreva em inglês uma pergunta para confirmar se null também é aceito.

### Evidências
- [ ] Justifiquei a decisão com uma evidência.
- [ ] Corrigi as divergências após comparar.
- [ ] Fiz a mudança proposta e expliquei o resultado.

## Nível 1
### Caso novo
Escreva uma issue curta em inglês: esperava name, recebeu resposta sem o campo, com status 200.

### Análise esperada
Uma resposta possível: Expected: a response containing name. Actual: HTTP 200 with name missing. Inclua steps to reproduce e exemplo fictício. Avalie clareza, não tradução literal.

### Transferência
Acrescente uma pergunta educada sobre o contrato esperado.

### Evidências
- [ ] Justifiquei a decisão com uma evidência.
- [ ] Corrigi as divergências após comparar.
- [ ] Fiz a mudança proposta e expliquei o resultado.

## Nível 2
### Caso novo
Explique em inglês por que um timeout não deve exibir dados antigos como atuais.

### Análise esperada
Uma explicação precisa mencionar tempo limite, indisponibilidade do resultado atual e risco de atribuir dados incorretos. Estruture contexto, decisão e motivo com frases curtas.

### Transferência
Grave a explicação em 60 segundos e verifique se um ouvinte entende a decisão.

### Evidências
- [ ] Justifiquei a decisão com uma evidência.
- [ ] Corrigi as divergências após comparar.
- [ ] Fiz a mudança proposta e expliquei o resultado.

## Nível 3
### Caso novo
Numa reunião em inglês você não entendeu se a mudança é obrigatória. Como pedir esclarecimento e confirmar a decisão?

### Análise esperada
Pergunte de forma específica, por exemplo: Is this required for this release? Confirme com So, we will... e registre prazo/responsável sem inventar o que não ouviu.

### Transferência
Resuma a decisão em duas frases para o PR.

### Evidências
- [ ] Justifiquei a decisão com uma evidência.
- [ ] Corrigi as divergências após comparar.
- [ ] Fiz a mudança proposta e expliquei o resultado.

## Nível 4
### Caso novo
Prepare uma apresentação técnica em inglês de três minutos sobre seu projeto: problema, escolha, evidência e limite.

### Análise esperada
Inclua um exemplo demonstrável, explique uma alternativa descartada e admita uma limitação. Use perguntas de revisão para conferir se a audiência entendeu o argumento.

### Transferência
Responda uma pergunta inesperada e peça esclarecimento quando necessário.

### Evidências
- [ ] Justifiquei a decisão com uma evidência.
- [ ] Corrigi as divergências após comparar.
- [ ] Fiz a mudança proposta e expliquei o resultado.
