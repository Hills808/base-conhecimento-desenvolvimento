# Caderno de integração e investigação de API

Use este caderno em duas situações. O guia de integração ajuda alguém a fazer a primeira chamada. A spike ajuda uma equipe a decidir se a API atende a uma necessidade. Preencha com seus próprios testes e guarde a versão de trabalho no espaço do seu projeto.

## 1. Guia de integração

- **Operação e finalidade** — Qual tarefa o consumidor consegue realizar?
- **Versão e ambiente** — Qual é a versão do contrato? Onde o exemplo pode ser reproduzido? Qual é o endereço base?
- **Acesso** — A oficina é local e dispensa credenciais. Em seu projeto, indique o mecanismo e a permissão necessária.
- **Requisição** — Método, caminho, parâmetros e, quando houver, cabeçalhos e corpo.

| Parâmetro | Onde enviar | Tipo e valores aceitos | Obrigatório? | Efeito se omitido |
| --- | --- | --- | --- | --- |
| [nome] | [caminho, consulta ou corpo] | [tipo, formato, exemplo] | [sim/não] | [comportamento] |

Explique a combinação dos filtros. Se houver datas, paginação ou ordenação, descreva a regra que afeta o seu consumidor. Se faltar uma informação, registre qual detalhe ainda precisa ser confirmado.

Inclua uma requisição que possa ser reproduzida e um exemplo pequeno da resposta. Identifique o significado e o tipo de cada campo necessário. Mostre o que acontece quando a consulta é válida e não há resultados. Inclua um erro frequente e como corrigi-lo.

**Exemplo preenchido da oficina, versão 1.0.0.** Em ambiente local, enviar `GET /chamados?status=fechado&categoria=acesso` solicita chamados que atendem aos dois critérios. Com a base fornecida, o resultado previsto é HTTP 200 e `[]`. Enviar `status=pausado` produz HTTP 400 com a mensagem `Use aberto ou fechado em status.`

## 2. Spike de viabilidade

**Decisão a tomar:** [quem precisa de qual consulta, para decidir ou fazer o quê?]

**Hipótese:** [que comportamento você espera e que observação mostraria que sua hipótese está errada?]

**Escopo:** [ambiente, versão, data, fonte do contrato, dados de teste e limites da investigação].

| Caso | Entrada | Esperado antes de executar | Observado, HTTP e IDs ou erro | Evidência reproduzível |
| --- | --- | --- | --- | --- |
| Base conhecida | Sem filtros | | | |
| Primeiro filtro isolado | | | | |
| Segundo filtro isolado | | | | |
| Combinação | | | | |
| Combinação sem resultados | | | | |
| Valor inválido | | | | |

**Exemplo de raciocínio.** Para aberto + rede, 102 testaria o filtro de categoria e 103 testaria o de status. Se 102 aparecesse, haveria um contraexemplo, embora o servidor tivesse respondido 200. Compare o resultado com a consulta usando só categoria para escolher a próxima investigação.

**Conclusão:** [atende, atende parcialmente ou permanece inconclusivo para a necessidade descrita]. Relacione a conclusão aos casos e à versão testada. Diferencie o que está documentado, o que você observou e o que ainda está em aberto. Um campo visto na resposta pode ter apenas função de saída.

**Próxima decisão:** [o que a equipe já pode fazer? Que evidência adicional mudaria sua decisão?]

## Revisão por outra pessoa

Entregue o guia a alguém que ainda não viu o código, ou refaça o teste em outro momento. É possível repetir a chamada usando apenas o documento? Descobrir por que um registro ficou de fora? Corrigir um valor inválido? Se você acrescentou prioridade como filtro, atualize a versão e inclua um caso que falharia se o servidor ignorasse o novo parâmetro.
