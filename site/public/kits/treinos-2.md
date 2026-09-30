# Treinos de autonomia — módulo 2

Responda antes de ler a análise. Após a comparação, faça a variação e registre o resultado.

## Nível 0
### Caso novo
Uma GET retorna 200 com {"items":[],"total":0}, sem nextPage. O que pode ser concluído sobre os três campos?

### Análise esperada
items está presente e vazio; total é zero; nextPage está ausente. O status não fornece o campo nem prova regras de paginação não documentadas.

### Transferência
Troque items por null e explique se o contrato ainda é atendido.

### Evidências
- [ ] Justifiquei a decisão com uma evidência.
- [ ] Corrigi as divergências após comparar.
- [ ] Fiz a mudança proposta e expliquei o resultado.

## Nível 1
### Caso novo
O schema exige code:string, mas a resposta traz code:12. Escreva um caso de teste que passe no 200 e falhe no contrato.

### Análise esperada
Verifique transporte e tipo separadamente. A resposta não satisfaz string; coerção automática no teste esconderia a incompatibilidade.

### Transferência
Faça code ausente e decida se é erro de obrigatoriedade ou valor.

### Evidências
- [ ] Justifiquei a decisão com uma evidência.
- [ ] Corrigi as divergências após comparar.
- [ ] Fiz a mudança proposta e expliquei o resultado.

## Nível 2
### Caso novo
Um endpoint permite consultar registro pelo ID. O usuário autenticado A pede um registro de B. Onde testar a proteção?

### Análise esperada
A autorização por recurso ocorre no servidor usando identidade autenticada. Teste chamada direta à API, sucesso permitido e negação; o frontend não basta.

### Transferência
O serviço de autorização fica indisponível. Comprove negação segura.

### Evidências
- [ ] Justifiquei a decisão com uma evidência.
- [ ] Corrigi as divergências após comparar.
- [ ] Fiz a mudança proposta e expliquei o resultado.

## Nível 3
### Caso novo
Uma integração recebe timeout e repete uma operação de criação. Como evitar duplicidade?

### Análise esperada
Defina idempotência ou política que não repita indiscriminadamente a escrita. Teste falha após processamento, cancelamento e resposta repetida com o mecanismo adotado.

### Transferência
Duas chamadas iguais chegam ao mesmo tempo; valide concorrência.

### Evidências
- [ ] Justifiquei a decisão com uma evidência.
- [ ] Corrigi as divergências após comparar.
- [ ] Fiz a mudança proposta e expliquei o resultado.

## Nível 4
### Caso novo
Seu contrato público troca um campo obrigatório. Planeje compatibilidade, migração e recuperação.

### Análise esperada
Liste consumidores, estabeleça estratégia de versão, mantenha testes contratuais e documente janela de migração. Demonstre falha controlada de um cliente antigo e como desfazer.

### Transferência
Um consumidor não pode atualizar nesta semana; justifique a alternativa.

### Evidências
- [ ] Justifiquei a decisão com uma evidência.
- [ ] Corrigi as divergências após comparar.
- [ ] Fiz a mudança proposta e expliquei o resultado.
