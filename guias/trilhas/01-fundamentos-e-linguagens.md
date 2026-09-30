# Fundamentos e linguagens — trilha por competências

Revisada em 30/09/2026. Cinco níveis de prática; use dados fictícios. Horas são estimativas de estudo/prática, não duração dos materiais.

Fluxo: entenda → material principal → exemplo resolvido → desafio → verificação → evidência → revisão.

O nível avançado demonstra autonomia nesta tarefa e exige revisão, prática e novas variações. A conclusão local não certifica experiência profissional nem domínio de toda a área.

## Nível 0 — Começo do zero

**Pré-requisito:** Nenhum. Os passos começam em linguagem comum.
**Tempo estimado:** 4–8 h

### Entenda

Um programa recebe uma entrada, toma decisões e produz uma saída. Uma condição escolhe um caminho; uma repetição executa um passo várias vezes.

### Materiais de apoio

- [Algoritmos — Curso em Vídeo](https://www.cursoemvideo.com/curso/curso-de-algoritmo/) — Português · Vídeo · 25–40 min no trecho indicado. Comece pelas aulas de introdução, variáveis e condições. Volte para simular o desconto antes de avançar. Certificado não informado; não é requisito da etapa.
- [Tour de C# — Microsoft Learn](https://learn.microsoft.com/pt-br/dotnet/csharp/tour-of-csharp/) — Português · Leitura · 25–40 min no trecho indicado. Leia estrutura do programa, tipos, condições e funções; use o exemplo mínimo desta etapa. Certificado não informado; não é requisito da etapa.

### Exemplo resolvido

1. No kit problema-e-pseudocodigo.md, descreva uma calculadora de desconto com entrada preço e quantidade.
2. Simule preço 10 e quantidade 2: total = 20; se quantidade >= 3, desconto = 10%.
3. Escolha uma linguagem no material e implemente só entrada → conta → saída; adicione a condição depois.

```text
preço = 10; quantidade = 3
total = 30
se quantidade >= 3: total = total * 0.9
saída esperada = 27
```

**Confira:** Cada linha tem função clara; o desconto só acontece quando a condição é verdadeira.

**Se travar:** Faça uma tabela de entradas e saídas no papel antes de digitar código.

### Faça sozinho

1. Teste quantidades 2, 3 e 0 e escreva a saída esperada antes de executar.
2. Separe a regra de desconto em uma função.

### Verificação com explicação

**Situação 1:** Quantidade 2 deve receber desconto pela regra acima?

- A: Sim; todo pedido recebe desconto.
- B: Não; a condição exige pelo menos 3.
- C: Depende da linguagem.

**Resposta:** B. Correto. Cada linha tem função clara; o desconto só acontece quando a condição é verdadeira.

- A: A regra escrita tem uma condição específica.
- C: Linguagens diferentes devem implementar a mesma regra de negócio.

**Aplique:** Teste quantidades 2, 3 e 0 e escreva a saída esperada antes de executar.

### Evidência e revisão

Guarde o que tentou, o resultado observado, uma falha e a próxima dúvida. Compare com o resultado esperado. A página não inspeciona arquivos nem corrige texto livre automaticamente. Volte em sete dias e tente uma variação sem consultar.

## Nível 1 — Fundamentos aplicados

**Pré-requisito:** Variáveis, condição, função e execução de um programa.
**Tempo estimado:** 6–10 h

### Entenda

Depurar significa observar valores e seguir a execução até descobrir onde o resultado mudou. Uma entrada inválida deve ser tratada antes da conta.

### Materiais de apoio

- [Tour de C# — Microsoft Learn](https://learn.microsoft.com/pt-br/dotnet/csharp/tour-of-csharp/) — Português · Leitura · 25–40 min no trecho indicado. Leia estrutura do programa, tipos, condições e funções; use o exemplo mínimo desta etapa. Certificado não informado; não é requisito da etapa.
- [C# para iniciantes — Microsoft](https://learn.microsoft.com/pt-br/shows/csharp-for-beginners/) — Inglês · página traduzida · Vídeo · Um episódio por sessão. Assista ao episódio correspondente a executar, variáveis ou depuração. A página é traduzida; confira legendas no player. Certificado não informado; não é requisito da etapa.

### Exemplo resolvido

1. Em C#, crie um projeto separado: dotnet new console -n Conversor; entre na pasta e rode dotnet run.
2. Use decimal.TryParse para ler um preço. Se falhar, imprima uma mensagem e pare a operação.
3. Coloque um breakpoint ou imprima o valor antes da conta; teste texto, zero e número negativo.

```text
if (!decimal.TryParse(Console.ReadLine(), out var preco) || preco < 0)
{ Console.WriteLine("Preço inválido"); return; }
Console.WriteLine(preco * 2);
```

**Confira:** Texto inválido não derruba o programa; zero e negativo recebem o tratamento definido pela regra.

**Se travar:** Se dotnet não existir, resolva o SDK antes do código; se aparecer CS8802, mantenha um projeto por exercício.

### Faça sozinho

1. Implemente um conversor com entrada validada e três casos documentados.
2. Localize um erro de regra pelo depurador e explique o valor observado.

### Verificação com explicação

**Situação 1:** Por que usar TryParse na entrada?

- A: Para garantir que qualquer texto vira número.
- B: Para ignorar números negativos automaticamente.
- C: Para testar a conversão e tratar a falha explicitamente.

**Resposta:** C. Correto. Texto inválido não derruba o programa; zero e negativo recebem o tratamento definido pela regra.

- A: Texto arbitrário não tem conversão válida.
- B: TryParse converte; a regra de sinal precisa ser validada separadamente.

**Aplique:** Implemente um conversor com entrada validada e três casos documentados.

### Evidência e revisão

Guarde o que tentou, o resultado observado, uma falha e a próxima dúvida. Compare com o resultado esperado. A página não inspeciona arquivos nem corrige texto livre automaticamente. Volte em sete dias e tente uma variação sem consultar.

## Nível 2 — Construção

**Pré-requisito:** Um programa pequeno validado e capacidade de localizar uma falha.
**Tempo estimado:** 8–12 h

### Entenda

Separar responsabilidades permite alterar uma regra e testar seu efeito. Coleções guardam vários itens; escolher uma estrutura exige explicar como os dados serão usados.

### Materiais de apoio

- [Coleções e estruturas de dados — .NET](https://learn.microsoft.com/pt-br/dotnet/standard/collections/) — Português · Leitura · 25–40 min no trecho indicado. Compare List e Dictionary pela forma de acesso; não memorize todas as coleções. Certificado não informado; não é requisito da etapa.
- [Tour de C# — Microsoft Learn](https://learn.microsoft.com/pt-br/dotnet/csharp/tour-of-csharp/) — Português · Leitura · 25–40 min no trecho indicado. Leia estrutura do programa, tipos, condições e funções; use o exemplo mínimo desta etapa. Certificado não informado; não é requisito da etapa.

### Exemplo resolvido

1. Pegue o conversor e extraia a conta para uma função sem leitura do console.
2. Crie uma lista de entradas e confira resultados; depois use um dicionário para consultar por chave.
3. Compare o custo de procurar um item varrendo toda a lista com uma consulta por chave; não trate isso como garantia para qualquer tamanho.

```text
decimal Dobrar(decimal valor) => valor * 2;
// Esperado: Dobrar(10) = 20; Dobrar(0) = 0.
```

**Confira:** A função pode ser testada sem console; a escolha da coleção se relaciona à tarefa.

**Se travar:** Primeiro mova uma regra para uma função; reorganize o restante só após conferir a mesma saída.

### Faça sozinho

1. Crie um catálogo em memória com consulta por identificador e validação.
2. Documente uma alternativa e por que não a escolheu para esse caso.

### Verificação com explicação

**Situação 1:** Uma função só de cálculo deve ler Console.ReadLine?

- A: Não; receba os dados por parâmetro para poder testar.
- B: Sim; todas as funções precisam de console.
- C: Só quando a lista tiver mais de dez itens.

**Resposta:** A. Correto. A função pode ser testada sem console; a escolha da coleção se relaciona à tarefa.

- B: Entrada interativa não é necessária a toda função.
- C: O tamanho da lista não define a responsabilidade da função.

**Aplique:** Crie um catálogo em memória com consulta por identificador e validação.

### Evidência e revisão

Guarde o que tentou, o resultado observado, uma falha e a próxima dúvida. Compare com o resultado esperado. A página não inspeciona arquivos nem corrige texto livre automaticamente. Volte em sete dias e tente uma variação sem consultar.

## Nível 3 — Confiabilidade

**Pré-requisito:** Funções, coleções, validação e noções de complexidade.
**Tempo estimado:** 10–16 h

### Entenda

Testes protegem regras e casos de borda. Alterar uma implementação só é seguro se o comportamento esperado continuar observável.

### Materiais de apoio

- [Testes C# com xUnit — Microsoft](https://learn.microsoft.com/pt-br/dotnet/core/testing/unit-testing-csharp-with-xunit) — Português · Leitura · 25–40 min no trecho indicado. Siga criação da solução e primeiro teste que falha; depois aplique aos casos do seu catálogo. Certificado não informado; não é requisito da etapa.
- [Coleções e estruturas de dados — .NET](https://learn.microsoft.com/pt-br/dotnet/standard/collections/) — Português · Leitura · 25–40 min no trecho indicado. Compare List e Dictionary pela forma de acesso; não memorize todas as coleções. Certificado não informado; não é requisito da etapa.

### Exemplo resolvido

1. Escreva testes para catálogo vazio, identificador repetido e item inexistente antes da refatoração.
2. Quebre de propósito a comparação de identificadores e veja o teste específico falhar.
3. Refatore a consulta sem alterar o contrato e confira os testes; meça antes de otimizar.

```text
Casos: [] + buscar A → não encontrado
[A,A] → rejeitar duplicidade
[A,B] + buscar B → B
```

**Confira:** O teste detecta uma alteração indevida; a refatoração preserva os casos documentados.

**Se travar:** Use uma única entrada que deveria falhar e confira o resultado, não apenas se o programa terminou.

### Faça sozinho

1. Adicione seis testes de regra e borda ao catálogo.
2. Compare duas implementações e registre clareza, custo e limites da medição.

### Verificação com explicação

**Situação 1:** Testes sempre verdes, mesmo após remover a validação. O que investigar?

- A: Concluir que a remoção é segura.
- B: Se os testes realmente exercitam e verificam a regra.
- C: Adicionar mais testes idênticos.

**Resposta:** B. Correto. O teste detecta uma alteração indevida; a refatoração preserva os casos documentados.

- A: O verde é insuficiente quando o defeito controlado não foi detectado.
- C: Quantidade sem casos relevantes não resolve a ausência de assertivas.

**Aplique:** Adicione seis testes de regra e borda ao catálogo.

**Situação 2:** O arquivo JSON de tarefas está inválido. Qual comportamento preserva segurança dos dados?

- A: Criar uma lista vazia e sobrescrever o arquivo automaticamente.
- B: Ignorar qualquer erro de leitura sem mensagem.
- C: Avisar e interromper a leitura sem sobrescrever silenciosamente o arquivo.

**Resposta:** C. Correto. Erro de leitura e catálogo vazio são situações diferentes.

- A: A sobrescrita pode apagar evidências de dados ainda recuperáveis.
- B: Silêncio impede distinguir sucesso, ausência e corrupção.

**Aplique:** Compare duas implementações e registre clareza, custo e limites da medição.

### Evidência e revisão

Guarde o que tentou, o resultado observado, uma falha e a próxima dúvida. Compare com o resultado esperado. A página não inspeciona arquivos nem corrige texto livre automaticamente. Volte em sete dias e tente uma variação sem consultar.

## Nível 4 — Projeto avançado

**Pré-requisito:** Catálogo testado, funções e leitura de documentação.
**Tempo estimado:** 14–22 h

### Entenda

Um projeto avançado de fundamentos exige combinar regras novas sem copiar uma solução pronta. O escopo continua pequeno para que cada decisão possa ser revisada.

### Materiais de apoio

- [Nomes de propriedades JSON — System.Text.Json](https://learn.microsoft.com/pt-br/dotnet/standard/serialization/system-text-json/customize-properties) — Português · Leitura · 25–40 min no trecho indicado. Leia JsonPropertyName e política de nomes; compare className com NomeClasse. Certificado não informado; não é requisito da etapa.
- [Testes C# com xUnit — Microsoft](https://learn.microsoft.com/pt-br/dotnet/core/testing/unit-testing-csharp-with-xunit) — Português · Leitura · 25–40 min no trecho indicado. Siga criação da solução e primeiro teste que falha; depois aplique aos casos do seu catálogo. Certificado não informado; não é requisito da etapa.

### Exemplo resolvido

1. Defina um gerenciador de tarefas local: criar, listar, concluir e salvar em JSON; escreva três critérios de aceite.
2. Separe leitura/escrita, regras e interface de terminal. Defina como tratar arquivo inexistente ou inválido.
3. Implemente em pequenas mudanças; teste IDs duplicados, dados inválidos e reabertura do arquivo.
4. Prepare README e um PR de estudo com decisão sobre coleção e persistência.

```text
Aceite: tarefa concluída reaparece concluída após reiniciar.
Erro: arquivo inválido gera aviso; não é sobrescrito silenciosamente.
```

**Confira:** Uma pessoa consegue executar, reproduzir os testes e localizar a responsabilidade de cada parte.

**Se travar:** Implemente criar/listar em memória; só depois acrescente arquivo e recuperação de erros.

### Faça sozinho

1. Entregue código, oito casos de teste, README e registro de uma falha investigada.
2. Receba uma mudança de requisito e implemente-a mantendo os testes.

### Verificação com explicação

**Situação 1:** Qual evidência demonstra autonomia no projeto?

- A: Repetir o tutorial inteiro.
- B: Usar o maior número de padrões de projeto.
- C: Implementar uma mudança nova e explicar os testes que a protegem.

**Resposta:** C. Correto. Uma pessoa consegue executar, reproduzir os testes e localizar a responsabilidade de cada parte.

- A: Repetir um caminho conhecido não verifica adaptação.
- B: Padrões devem resolver problemas concretos, não aumentar a complexidade.

**Aplique:** Entregue código, oito casos de teste, README e registro de uma falha investigada.

**Situação 2:** O arquivo JSON de tarefas está inválido. Qual comportamento preserva segurança dos dados?

- A: Avisar e interromper a leitura sem sobrescrever silenciosamente o arquivo.
- B: Criar uma lista vazia e sobrescrever o arquivo automaticamente.
- C: Ignorar qualquer erro de leitura sem mensagem.

**Resposta:** A. Correto. Erro de leitura e catálogo vazio são situações diferentes.

- B: A sobrescrita pode apagar evidências de dados ainda recuperáveis.
- C: Silêncio impede distinguir sucesso, ausência e corrupção.

**Aplique:** Receba uma mudança de requisito e implemente-a mantendo os testes.

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
