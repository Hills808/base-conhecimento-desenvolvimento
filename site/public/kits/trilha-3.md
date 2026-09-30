# Frontend e acessibilidade — trilha por competências

Revisada em 30/09/2026. Cinco níveis de prática; use dados fictícios. Horas são estimativas de estudo/prática, não duração dos materiais.

Fluxo: entenda → material principal → exemplo resolvido → desafio → verificação → evidência → revisão.

O nível avançado demonstra autonomia nesta tarefa e exige revisão, prática e novas variações. A conclusão local não certifica experiência profissional nem domínio de toda a área.

## Nível 0 — Começo do zero

**Pré-requisito:** Nenhum. Um editor e navegador bastam.
**Tempo estimado:** 5–8 h

### Entenda

HTML dá significado ao conteúdo; CSS organiza sua aparência. Um botão deve ser um button, para que teclado e tecnologias assistivas reconheçam a ação.

### Materiais de apoio

- [Aprendendo desenvolvimento web — MDN](https://developer.mozilla.org/pt-BR/docs/Learn_web_development) — Português · Curso · 25–40 min no trecho indicado. Comece por estrutura HTML e CSS; execute uma página mínima antes de estudar frameworks. Certificado não informado; não é requisito da etapa.
- [Guia JavaScript — MDN](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Guide) — Português · Leitura · 25–40 min no trecho indicado. Leia funções, promises e tratamento de erros de acordo com o passo que bloqueia a interface. Certificado não informado; não é requisito da etapa.

### Exemplo resolvido

1. Crie index.html com main, h1, parágrafo e um button com texto “Mostrar dica”.
2. Abra no navegador e pressione Tab até o botão; mantenha um contorno de foco visível.
3. Adicione CSS max-width: 65ch ao texto e padding à página; reduza a janela e confira que não exige rolagem horizontal.

```text
<main><h1>Guia de estudo</h1><p>Uma etapa por vez.</p><button>Mostrar dica</button></main>
```

**Confira:** A estrutura tem um título principal e o botão recebe foco sem mouse.

**Se travar:** Teste a estrutura sem CSS primeiro; depois organize a aparência.

### Faça sozinho

1. Crie uma página com três seções, links claros e botão real.
2. Confira leitura e teclado em janela estreita.

### Verificação com explicação

**Situação 1:** Qual elemento usar para uma ação clicável?

- A: button com nome compreensível.
- B: div com cor de botão apenas.
- C: Uma imagem sem texto alternativo.

**Resposta:** A. Correto. A estrutura tem um título principal e o botão recebe foco sem mouse.

- B: A aparência da div não fornece comportamento nativo de teclado.
- C: A imagem sozinha não identifica a ação de forma acessível.

**Aplique:** Crie uma página com três seções, links claros e botão real.

### Evidência e revisão

Guarde o que tentou, o resultado observado, uma falha e a próxima dúvida. Compare com o resultado esperado. A página não inspeciona arquivos nem corrige texto livre automaticamente. Volte em sete dias e tente uma variação sem consultar.

## Nível 1 — Fundamentos aplicados

**Pré-requisito:** HTML, CSS e função simples em JavaScript.
**Tempo estimado:** 8–12 h

### Entenda

Consumo de API precisa explicar o que acontece antes, durante e depois da chamada. Vazio é uma resposta válida sem itens; erro é uma falha e deve permitir tentar de novo.

### Materiais de apoio

- [Guia JavaScript — MDN](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Guide) — Português · Leitura · 25–40 min no trecho indicado. Leia funções, promises e tratamento de erros de acordo com o passo que bloqueia a interface. Certificado não informado; não é requisito da etapa.
- [Aprendendo desenvolvimento web — MDN](https://developer.mozilla.org/pt-BR/docs/Learn_web_development) — Português · Curso · 25–40 min no trecho indicado. Comece por estrutura HTML e CSS; execute uma página mínima antes de estudar frameworks. Certificado não informado; não é requisito da etapa.

### Exemplo resolvido

1. Crie uma lista de posts e envie GET à JSONPlaceholder usando fetch.
2. Antes da chamada mostre “Carregando”; ao terminar renderize os itens ou “Nenhum item”.
3. Simule rede indisponível e exiba erro com botão de nova tentativa; não deixe spinner eterno.

```text
Estados: carregando → sucesso | vazio | erro
if (!response.ok) throw new Error("Falha na consulta");
```

**Confira:** Você consegue distinguir os estados e voltar do erro para uma nova tentativa.

**Se travar:** Use arrays simulados e uma promessa rejeitada para testar cada estado de forma controlada.

### Faça sozinho

1. Implemente busca com estados carregando, vazio e erro.
2. Demonstre cada estado com dados simulados, sem depender de sorte na rede.

### Verificação com explicação

**Situação 1:** Uma lista vazia e uma falha de conexão são iguais?

- A: Sim, os dois devem mostrar tela em branco.
- B: Não; vazio é ausência de itens, falha exige tratamento de erro.
- C: Sim, os dois devem repetir eternamente.

**Resposta:** B. Correto. Você consegue distinguir os estados e voltar do erro para uma nova tentativa.

- A: Tela em branco esconde a diferença e não orienta o usuário.
- C: Repetir para sempre não resolve ausência válida e pode sobrecarregar.

**Aplique:** Implemente busca com estados carregando, vazio e erro.

### Evidência e revisão

Guarde o que tentou, o resultado observado, uma falha e a próxima dúvida. Compare com o resultado esperado. A página não inspeciona arquivos nem corrige texto livre automaticamente. Volte em sete dias e tente uma variação sem consultar.

## Nível 2 — Construção

**Pré-requisito:** Interface com estados e navegação por teclado.
**Tempo estimado:** 8–14 h

### Entenda

Acessibilidade precisa ser verificada no fluxo, incluindo rótulos, ordem de foco e mensagens de erro. Uma pontuação automática não substitui testar tarefas com teclado.

### Materiais de apoio

- [Acessibilidade — MDN](https://developer.mozilla.org/pt-BR/docs/Learn_web_development/Core/Accessibility) — Português · Leitura · 25–40 min no trecho indicado. Leia HTML, controles e ferramentas. Teste uma tarefa com teclado depois de cada ajuste. Certificado não informado; não é requisito da etapa.
- [Performance — MDN](https://developer.mozilla.org/pt-BR/docs/Web/Performance) — Português · Leitura · 25–40 min no trecho indicado. Escolha uma medida ligada à tarefa; registre antes/depois no mesmo cenário. Certificado não informado; não é requisito da etapa.

### Exemplo resolvido

1. Use checklist-acessibilidade.md no kit para percorrer a interface só com Tab, Shift+Tab e Enter.
2. Associe label a cada input; apresente erro em texto e conecte a mensagem ao campo.
3. Meça carregamento no navegador, reduza imagens grandes e confirme o mesmo fluxo em tela estreita.

```text
label for="busca" + input id="busca"
Erro em texto: “Informe ao menos 2 caracteres”.
Foco visível ao usar Tab.
```

**Confira:** Você identifica o campo e corrige o erro sem depender de cor ou mouse.

**Se travar:** Escolha uma tarefa como pesquisar e abrir item; siga do início ao fim sem mouse.

### Faça sozinho

1. Audite três problemas de foco, semântica ou leitura e corrija-os.
2. Registre antes/depois de uma melhoria de carregamento.

### Verificação com explicação

**Situação 1:** Uma auditoria automática deu 100. O fluxo está garantido acessível?

- A: Sim; nunca precisa teste manual.
- B: Sim; basta aumentar o contraste.
- C: Não; teste teclado, foco, mensagens e uso real.

**Resposta:** C. Correto. Você identifica o campo e corrige o erro sem depender de cor ou mouse.

- A: Ferramentas não detectam todos os problemas de interação.
- B: Contraste é um requisito entre vários, não valida o fluxo inteiro.

**Aplique:** Audite três problemas de foco, semântica ou leitura e corrija-os.

### Evidência e revisão

Guarde o que tentou, o resultado observado, uma falha e a próxima dúvida. Compare com o resultado esperado. A página não inspeciona arquivos nem corrige texto livre automaticamente. Volte em sete dias e tente uma variação sem consultar.

## Nível 3 — Confiabilidade

**Pré-requisito:** Interface acessível e consumo de API.
**Tempo estimado:** 10–16 h

### Entenda

Interfaces têm falhas concorrentes: uma resposta antiga pode chegar depois da nova e sobrescrever a busca. Qualidade exige testar comportamento, segurança e medida de performance.

### Materiais de apoio

- [Testes de interface — Playwright](https://playwright.dev/docs/intro) — Inglês · Tutorial · 25–40 min no trecho indicado. Crie um teste do fluxo de busca e erro usando seletores por papel e nome; siga os passos da documentação. Certificado não informado; não é requisito da etapa.
- [Performance — MDN](https://developer.mozilla.org/pt-BR/docs/Web/Performance) — Português · Leitura · 25–40 min no trecho indicado. Escolha uma medida ligada à tarefa; registre antes/depois no mesmo cenário. Certificado não informado; não é requisito da etapa.

### Exemplo resolvido

1. Digite busca A e logo B; simule A demorando mais. Guarde o identificador da chamada atual ou cancele a anterior.
2. Renderize conteúdo remoto como texto; não injete HTML não confiável para “formatar” a resposta.
3. Crie testes para erro, recuperação, navegação e resposta atrasada; registre uma métrica antes/depois.

```text
Pedido A lento; pedido B rápido
Tela final deve mostrar B, mesmo que A termine depois.
```

**Confira:** A interface protege o resultado atual e não executa conteúdo externo como código.

**Se travar:** Use respostas simuladas com atrasos previsíveis antes de testar contra uma API real.

### Faça sozinho

1. Cubra cinco estados e uma corrida entre respostas com testes.
2. Documente um orçamento de desempenho e uma ameaça de conteúdo não confiável.

### Verificação com explicação

**Situação 1:** A resposta antiga chega depois da atual. O que exibir?

- A: O resultado da intenção mais recente, ignorando a antiga.
- B: A última resposta que terminou, sempre.
- C: Juntar os resultados sem informar.

**Resposta:** A. Correto. A interface protege o resultado atual e não executa conteúdo externo como código.

- B: Ordem de chegada não equivale à ordem da intenção do usuário.
- C: Misturar respostas muda a pergunta e esconde a origem.

**Aplique:** Cubra cinco estados e uma corrida entre respostas com testes.

**Situação 2:** Uma pessoa usa voltar após abrir um item da busca. Qual critério ajuda a validar o fluxo?

- A: Apagar a consulta para obrigar nova busca.
- B: Preservar busca e um ponto de foco coerente com a tarefa.
- C: Voltar sempre para uma página em branco.

**Resposta:** B. Correto. Contexto e foco coerentes facilitam retomar a tarefa.

- A: Apagar a consulta sem necessidade aumenta esforço e pode confundir.
- C: Página em branco não orienta a continuação.

**Aplique:** Documente um orçamento de desempenho e uma ameaça de conteúdo não confiável.

### Evidência e revisão

Guarde o que tentou, o resultado observado, uma falha e a próxima dúvida. Compare com o resultado esperado. A página não inspeciona arquivos nem corrige texto livre automaticamente. Volte em sete dias e tente uma variação sem consultar.

## Nível 4 — Projeto avançado

**Pré-requisito:** Estados, acessibilidade, concorrência e testes de interface.
**Tempo estimado:** 14–22 h

### Entenda

Projeto: portal de procedimentos fictícios. O desafio é conduzir a pessoa de uma busca até uma informação verificável mesmo com rede lenta, conteúdo ausente ou recurso restrito.

### Materiais de apoio

- [Acessibilidade — MDN](https://developer.mozilla.org/pt-BR/docs/Learn_web_development/Core/Accessibility) — Português · Leitura · 25–40 min no trecho indicado. Leia HTML, controles e ferramentas. Teste uma tarefa com teclado depois de cada ajuste. Certificado não informado; não é requisito da etapa.
- [Testes de interface — Playwright](https://playwright.dev/docs/intro) — Inglês · Tutorial · 25–40 min no trecho indicado. Crie um teste do fluxo de busca e erro usando seletores por papel e nome; siga os passos da documentação. Certificado não informado; não é requisito da etapa.

### Exemplo resolvido

1. Defina público, três tarefas e critérios de aceite: encontrar procedimento, ler versão e entender ausência.
2. Crie HTML semântico e interface responsiva com busca, detalhes, estados e foco ao mudar de contexto.
3. Integre API ou mocks; teste resposta tardia, erro, vazio e dado não autorizado.
4. Peça a uma pessoa para realizar as tarefas; registre dificuldade, correção e nova verificação.
5. Prepare PR com testes, capturas úteis e limites conhecidos.

```text
Aceite: busca sem resultado informa ausência; Enter abre item; voltar preserva busca.
```

**Confira:** A avaliação reúne comportamento, acessibilidade e evidência de uso, sem prometer que uma imagem bonita comprova qualidade.

**Se travar:** Faça busca e detalhe com mocks primeiro; integre rede quando os estados já estiverem claros.

### Faça sozinho

1. Entregue portal com seis cenários, teste manual e instrução de execução.
2. Justifique uma decisão de navegação com a dificuldade observada.

### Verificação com explicação

**Situação 1:** Qual evidência mais ajuda a validar a navegação?

- A: Uma captura bonita da página inicial.
- B: Uma pessoa executar a tarefa e registrar onde travou.
- C: O número de animações.

**Resposta:** B. Correto. A avaliação reúne comportamento, acessibilidade e evidência de uso, sem prometer que uma imagem bonita comprova qualidade.

- A: A captura não verifica se o fluxo pode ser concluído.
- C: Animação não demonstra que o usuário encontra a informação.

**Aplique:** Entregue portal com seis cenários, teste manual e instrução de execução.

**Situação 2:** Uma pessoa usa voltar após abrir um item da busca. Qual critério ajuda a validar o fluxo?

- A: Voltar sempre para uma página em branco.
- B: Apagar a consulta para obrigar nova busca.
- C: Preservar busca e um ponto de foco coerente com a tarefa.

**Resposta:** C. Correto. Contexto e foco coerentes facilitam retomar a tarefa.

- A: Página em branco não orienta a continuação.
- B: Apagar a consulta sem necessidade aumenta esforço e pode confundir.

**Aplique:** Justifique uma decisão de navegação com a dificuldade observada.

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
