# GitHub, ferramentas e certificados — trilha por competências

Revisada em 30/09/2026. Cinco níveis de prática; use dados fictícios. Horas são estimativas de estudo/prática, não duração dos materiais.

Fluxo: entenda → material principal → exemplo resolvido → desafio → verificação → evidência → revisão.

O nível avançado demonstra autonomia nesta tarefa e exige revisão, prática e novas variações. A conclusão local não certifica experiência profissional nem domínio de toda a área.

## Nível 0 — Começo do zero

**Pré-requisito:** Nenhum; comece pela leitura de um README.
**Tempo estimado:** 2–4 h

### Entenda

Um repositório é uma fonte que precisa de contexto: propósito, licença, manutenção e instrução de execução. Estrelas não comprovam adequação nem segurança.

### Materiais de apoio

- [Sobre READMEs — GitHub](https://docs.github.com/pt/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-readmes) — Português · Leitura · 25–40 min no trecho indicado. Use objetivo, execução e exemplos; confira os comandos com uma pessoa nova. Certificado não informado; não é requisito da etapa.
- [Licenciar um repositório — GitHub](https://docs.github.com/pt/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/licensing-a-repository) — Português · Leitura · 25–40 min no trecho indicado. Leia por que a licença importa; registre direitos e limites para o uso pretendido. Certificado não informado; não é requisito da etapa.

### Exemplo resolvido

1. Abra um repositório listado na biblioteca; leia propósito e licença antes de instalar.
2. Preencha avaliacao-de-repositorio.md com última atividade e se há instruções reproduzíveis.
3. Confira uma issue e uma release; registre uma limitação e se vale usar para seu objetivo.

```text
Fonte: projeto X
Objetivo: exemplo de API
Licença: localizada
Limite: exemplo antigo; conferir versão do SDK.
```

**Confira:** A decisão de uso é justificada por evidência verificável.

**Se travar:** Se não há licença ou manutenção clara, registre a dúvida antes de usar; escolha outra fonte para começar.

### Faça sozinho

1. Avalie duas fontes para a mesma habilidade e escolha uma.
2. Explique a limitação e uma alternativa.

### Verificação com explicação

**Situação 1:** Qual sinal é insuficiente sozinho para escolher um repositório?

- A: Licença e instrução verificadas junto com o objetivo.
- B: Número de estrelas.
- C: Exemplo executável conferido para sua tarefa.

**Resposta:** B. Correto. A decisão de uso é justificada por evidência verificável.

- A: Esses critérios combinados informam direitos e adequação.
- C: Verificar a execução ajuda a conferir o uso específico.

**Aplique:** Avalie duas fontes para a mesma habilidade e escolha uma.

### Evidência e revisão

Guarde o que tentou, o resultado observado, uma falha e a próxima dúvida. Compare com o resultado esperado. A página não inspeciona arquivos nem corrige texto livre automaticamente. Volte em sete dias e tente uma variação sem consultar.

## Nível 1 — Fundamentos aplicados

**Pré-requisito:** Git básico e leitura das regras do projeto.
**Tempo estimado:** 4–8 h

### Entenda

Uma contribuição começa pela reprodução e pelas regras do mantenedor. Descrever o problema e a expectativa permite revisão mesmo quando a mudança é pequena.

### Materiais de apoio

- [Contribuir com projetos — GitHub](https://docs.github.com/pt/get-started/exploring-projects-on-github/contributing-to-a-project) — Português · Leitura · 25–40 min no trecho indicado. Leia contribuição, fork e revisão. Pratique no seu fork antes de enviar a mantenedores. Certificado não informado; não é requisito da etapa.
- [Pro Git — edição em português](https://git-scm.com/book/pt-br/v2) — Português · Livro · 25–40 min no trecho indicado. Leia snapshots, branches e desfazer alterações; pratique num repositório de estudo. Certificado não informado; não é requisito da etapa.

### Exemplo resolvido

1. Leia CONTRIBUTING e procure uma tarefa de documentação ou reprodução de bug.
2. No fork de estudo, execute o exemplo e anote ambiente, passos e resultado.
3. Faça uma correção mínima e prepare o texto de PR; envio a terceiros fica a seu critério.

```text
Relato: comando do README falha na versão X
Passos: executar A → observar B
Esperado: C
Mudança: corrigir um comando.
```

**Confira:** A contribuição pode ser reproduzida e não exige que o mantenedor descubra o contexto.

**Se travar:** Use um fork de estudo para praticar sem criar notificações desnecessárias para mantenedores.

### Faça sozinho

1. Reproduza um bug ou melhore uma instrução no seu fork.
2. Prepare PR com antes/depois e validação local.

### Verificação com explicação

**Situação 1:** Antes de uma refatoração ampla em projeto externo, o que fazer?

- A: Alterar todos os arquivos de uma vez.
- B: Ignorar testes porque é open source.
- C: Ler regras e alinhar escopo com o problema.

**Resposta:** C. Correto. A contribuição pode ser reproduzida e não exige que o mantenedor descubra o contexto.

- A: Escopo amplo sem contexto aumenta custo de revisão.
- B: Projetos abertos também dependem de qualidade e contratos.

**Aplique:** Reproduza um bug ou melhore uma instrução no seu fork.

### Evidência e revisão

Guarde o que tentou, o resultado observado, uma falha e a próxima dúvida. Compare com o resultado esperado. A página não inspeciona arquivos nem corrige texto livre automaticamente. Volte em sete dias e tente uma variação sem consultar.

## Nível 2 — Construção

**Pré-requisito:** Uma entrega de projeto e uma contribuição de estudo.
**Tempo estimado:** 4–6 h

### Entenda

Portfólio deve mostrar problema, execução e decisões. Certificado complementa a evidência, mas não substitui projeto reproduzível.

### Materiais de apoio

- [Sobre READMEs — GitHub](https://docs.github.com/pt/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-readmes) — Português · Leitura · 25–40 min no trecho indicado. Use objetivo, execução e exemplos; confira os comandos com uma pessoa nova. Certificado não informado; não é requisito da etapa.
- [Sobre releases — GitHub](https://docs.github.com/pt/repositories/releasing-projects-on-github/about-releases) — Português · Leitura · 25–40 min no trecho indicado. Planeje versão, changelog e o que cada release inclui; confira compatibilidade. Certificado não informado; não é requisito da etapa.

### Exemplo resolvido

1. Escreva README com objetivo, dados fictícios, pré-requisitos e comando de execução.
2. Adicione um exemplo de entrada/saída e o comando de testes.
3. Peça para alguém executar sem ajuda; corrija o ponto em que travou e registre limites.

```text
README: propósito → pré-requisitos → executar → testar → decisões → limites
```

**Confira:** A pessoa entende o que foi feito e como verificar o comportamento.

**Se travar:** Teste as instruções em uma pasta nova ou peça revisão de leitura antes de publicar.

### Faça sozinho

1. Publique uma entrega de estudo com instruções e evidências úteis.
2. Associe um recurso ou certificado à competência demonstrada.

### Verificação com explicação

**Situação 1:** Qual README demonstra melhor uma habilidade?

- A: O que permite executar e verificar a entrega.
- B: Uma lista grande de certificados sem projeto.
- C: Uma captura sem instruções.

**Resposta:** A. Correto. A pessoa entende o que foi feito e como verificar o comportamento.

- B: Credenciais sem contexto não mostram a execução.
- C: Imagem sozinha não permite reproduzir o comportamento.

**Aplique:** Publique uma entrega de estudo com instruções e evidências úteis.

### Evidência e revisão

Guarde o que tentou, o resultado observado, uma falha e a próxima dúvida. Compare com o resultado esperado. A página não inspeciona arquivos nem corrige texto livre automaticamente. Volte em sete dias e tente uma variação sem consultar.

## Nível 3 — Confiabilidade

**Pré-requisito:** Projeto legível, Git e testes básicos.
**Tempo estimado:** 8–12 h

### Entenda

Manter um repositório exige acompanhar dependências, licença, mudanças e processo de revisão. Uma atualização pode mudar comportamento mesmo se o build continuar verde.

### Materiais de apoio

- [Sobre releases — GitHub](https://docs.github.com/pt/repositories/releasing-projects-on-github/about-releases) — Português · Leitura · 25–40 min no trecho indicado. Planeje versão, changelog e o que cada release inclui; confira compatibilidade. Certificado não informado; não é requisito da etapa.
- [Segurança do GitHub Actions](https://docs.github.com/pt/actions/how-tos/secure-your-work) — Português · Leitura · 25–40 min no trecho indicado. Revise permissões mínimas, dependências e dados não confiáveis no workflow. Certificado não informado; não é requisito da etapa.

### Exemplo resolvido

1. Faça inventário de dependências diretas e suas versões/licenças.
2. Escolha uma atualização pequena, leia release notes e execute testes de contrato.
3. Registre compatibilidade, revisão e política de release; não adicione proteção que impede qualquer contribuição de estudo.

```text
Release: v0.2
Mudança: dependência X atualizada
Evidência: testes de contrato e exemplo executável
Limite: migração necessária em Y.
```

**Confira:** A manutenção tem decisão e validação documentadas, não uma atualização cega.

**Se travar:** Comece com uma dependência e um cenário de consumo; evite atualizar tudo de uma vez.

### Faça sozinho

1. Prepare uma atualização com impacto, testes e changelog.
2. Defina um fluxo de issue → branch → PR → release no seu repositório.

### Verificação com explicação

**Situação 1:** Atualizar dependência sem ler mudanças e só compilar comprova compatibilidade?

- A: Sim, versão nova nunca muda contratos.
- B: Não; confira release notes e comportamento usado.
- C: Sim, estrelas do projeto garantem isso.

**Resposta:** B. Correto. A manutenção tem decisão e validação documentadas, não uma atualização cega.

- A: Versões podem alterar APIs e comportamento.
- C: Popularidade não comprova compatibilidade com seu uso.

**Aplique:** Prepare uma atualização com impacto, testes e changelog.

**Situação 2:** O exemplo só funciona com uma configuração que você não documentou. O kit está reproduzível?

- A: Sim, porque funciona na máquina do autor.
- B: Sim, se houver uma captura.
- C: Ainda não; registre pré-requisito e valide em ambiente novo.

**Resposta:** C. Correto. Dependências ocultas impedem onboarding e revisão.

- A: A máquina do autor pode conter dependências ausentes no README.
- B: Imagem não fornece a configuração necessária para executar.

**Aplique:** Defina um fluxo de issue → branch → PR → release no seu repositório.

### Evidência e revisão

Guarde o que tentou, o resultado observado, uma falha e a próxima dúvida. Compare com o resultado esperado. A página não inspeciona arquivos nem corrige texto livre automaticamente. Volte em sete dias e tente uma variação sem consultar.

## Nível 4 — Projeto avançado

**Pré-requisito:** Documentação, contribuição e manutenção praticadas.
**Tempo estimado:** 10–16 h

### Entenda

Projeto: kit público de aprendizado reproduzível. Uma pessoa nova deve encontrar objetivo, executar o exemplo e validar uma tarefa sem conversar com o autor.

### Materiais de apoio

- [Contribuir com projetos — GitHub](https://docs.github.com/pt/get-started/exploring-projects-on-github/contributing-to-a-project) — Português · Leitura · 25–40 min no trecho indicado. Leia contribuição, fork e revisão. Pratique no seu fork antes de enviar a mantenedores. Certificado não informado; não é requisito da etapa.
- [Sobre READMEs — GitHub](https://docs.github.com/pt/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-readmes) — Português · Leitura · 25–40 min no trecho indicado. Use objetivo, execução e exemplos; confira os comandos com uma pessoa nova. Certificado não informado; não é requisito da etapa.
- [Licenciar um repositório — GitHub](https://docs.github.com/pt/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/licensing-a-repository) — Português · Leitura · 25–40 min no trecho indicado. Leia por que a licença importa; registre direitos e limites para o uso pretendido. Certificado não informado; não é requisito da etapa.

### Exemplo resolvido

1. Escolha um problema pequeno de outro módulo e publique código/arquivos com licença apropriada.
2. Inclua README, kit inicial, exercício e resposta comentada em seção separada.
3. Defina regras de contribuição e prepare release com changelog.
4. Peça teste de onboarding a uma pessoa e registre onde precisou de ajuda.
5. Prepare PR para corrigir a maior dificuldade observada.

```text
Onboarding: clonar → instalar → executar → tarefa → conferir
Evidência: tempo e bloqueio observados, sem dados pessoais.
```

**Confira:** O kit é útil porque outra pessoa consegue usá-lo e validar o resultado.

**Se travar:** Um exemplo pequeno bem explicado vale mais que publicar vários projetos incompletos.

### Faça sozinho

1. Entregue repositório, release de estudo e relatório do onboarding.
2. Explique uma decisão de licença, escopo e manutenção futura.

### Verificação com explicação

**Situação 1:** Como saber se o kit é fácil de começar?

- A: Presumir porque você já sabe executar.
- B: Adicionar mais badges ao topo.
- C: Observar alguém seguindo o README e corrigir os bloqueios.

**Resposta:** C. Correto. O kit é útil porque outra pessoa consegue usá-lo e validar o resultado.

- A: O autor conhece passos que podem estar faltando no texto.
- B: Badges não substituem instruções compreensíveis.

**Aplique:** Entregue repositório, release de estudo e relatório do onboarding.

**Situação 2:** O exemplo só funciona com uma configuração que você não documentou. O kit está reproduzível?

- A: Ainda não; registre pré-requisito e valide em ambiente novo.
- B: Sim, porque funciona na máquina do autor.
- C: Sim, se houver uma captura.

**Resposta:** A. Correto. Dependências ocultas impedem onboarding e revisão.

- B: A máquina do autor pode conter dependências ausentes no README.
- C: Imagem não fornece a configuração necessária para executar.

**Aplique:** Explique uma decisão de licença, escopo e manutenção futura.

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
