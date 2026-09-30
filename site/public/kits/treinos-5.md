# Treinos de autonomia — módulo 5

Responda antes de ler a análise. Após a comparação, faça a variação e registre o resultado.

## Nível 0
### Caso novo
Um modelo responde um dado que não aparece no contexto. Como distinguir resposta plausível de resposta sustentada?

### Análise esperada
Localize a fonte que comprova a afirmação. Se não houver, declare a lacuna; fluência e convicção não são evidência.

### Transferência
Adicione uma fonte contraditória e observe se o conflito é preservado.

### Evidências
- [ ] Justifiquei a decisão com uma evidência.
- [ ] Corrigi as divergências após comparar.
- [ ] Fiz a mudança proposta e expliquei o resultado.

## Nível 1
### Caso novo
Duas intenções compartilham a palavra carteira, mas uma pede informação e outra uma ação. Desenhe roteamento e handoff.

### Análise esperada
Defina sinais, precedência e caminho de esclarecimento. O handoff inclui intenção e dados mínimos; não autoriza uma ação só porque há palavra em comum.

### Transferência
Inclua uma mensagem que menciona as duas intenções.

### Evidências
- [ ] Justifiquei a decisão com uma evidência.
- [ ] Corrigi as divergências após comparar.
- [ ] Fiz a mudança proposta e expliquei o resultado.

## Nível 2
### Caso novo
Uma tool tem readOnlyHint e também chama um endpoint de escrita. Ela é segura para leitura?

### Análise esperada
A anotação não impede efeitos. Revise implementação, permissões e chamadas reais; remova ou bloqueie escrita e teste o limite no servidor.

### Transferência
O documento recuperado pede uma tool fora da allowlist.

### Evidências
- [ ] Justifiquei a decisão com uma evidência.
- [ ] Corrigi as divergências após comparar.
- [ ] Fiz a mudança proposta e expliquei o resultado.

## Nível 3
### Caso novo
Uma mudança de prompt melhora respostas comuns e piora recusas de acesso. Como comparar versões?

### Análise esperada
Avalie por categoria com conjunto separado e critérios críticos. Uma média melhor não compensa exposição indevida. Reproduza, corrija e teste casos permitidos e negados.

### Transferência
Execute casos repetidos para observar variabilidade.

### Evidências
- [ ] Justifiquei a decisão com uma evidência.
- [ ] Corrigi as divergências após comparar.
- [ ] Fiz a mudança proposta e expliquei o resultado.

## Nível 4
### Caso novo
O assistente deve produzir um debrief com fontes e rascunho de follow-up, mas as fontes têm datas incompatíveis.

### Análise esperada
Propague datas e origem, explicite conflito e limite conclusões. O follow-up permanece não enviado; autorização e testes são verificados no runtime e backend.

### Transferência
Uma nova fonte não fornece data; atualize contrato, teste e comunicação da limitação.

### Evidências
- [ ] Justifiquei a decisão com uma evidência.
- [ ] Corrigi as divergências após comparar.
- [ ] Fiz a mudança proposta e expliquei o resultado.
