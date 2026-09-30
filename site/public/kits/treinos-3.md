# Treinos de autonomia — módulo 3

Responda antes de ler a análise. Após a comparação, faça a variação e registre o resultado.

## Nível 0
### Caso novo
Uma página de formulário usa apenas placeholder e perde a orientação quando alguém digita. Corrija o HTML e explique o teste.

### Análise esperada
Associe label ao controle; mantenha instruções visíveis e ordem de leitura coerente. Verifique nome acessível e navegação por teclado.

### Transferência
Adicione um erro de validação ligado ao campo.

### Evidências
- [ ] Justifiquei a decisão com uma evidência.
- [ ] Corrigi as divergências após comparar.
- [ ] Fiz a mudança proposta e expliquei o resultado.

## Nível 1
### Caso novo
A busca da interface recebe lista vazia, erro 500 e resposta lenta. Desenhe três estados com uma ação útil.

### Análise esperada
Vazio explica ausência; erro permite tentar novamente sem fingir sucesso; carregamento informa o andamento. Cada estado deve ser distinguível por texto, não só por cor.

### Transferência
Uma busca antiga responde depois da nova; impeça que substitua o resultado atual.

### Evidências
- [ ] Justifiquei a decisão com uma evidência.
- [ ] Corrigi as divergências após comparar.
- [ ] Fiz a mudança proposta e expliquei o resultado.

## Nível 2
### Caso novo
Um modal parece correto, mas o foco fica atrás dele. Descreva como reproduzir e corrigir a navegação.

### Análise esperada
Teste abrir, navegar, fechar e devolver foco ao acionador. O conteúdo de fundo não deve capturar a navegação enquanto o diálogo modal está ativo.

### Transferência
Teste com teclado e leitor de tela, inclusive botão de fechar.

### Evidências
- [ ] Justifiquei a decisão com uma evidência.
- [ ] Corrigi as divergências após comparar.
- [ ] Fiz a mudança proposta e expliquei o resultado.

## Nível 3
### Caso novo
Uma página fica lenta com muitos itens. Compare paginação e virtualização sem sacrificar acesso por teclado.

### Análise esperada
Meça antes, registre limites de cada estratégia e teste continuidade da navegação e leitura. Menos elementos no DOM não basta se conteúdo fica inacessível.

### Transferência
A pessoa usa ampliação de texto; repita o fluxo.

### Evidências
- [ ] Justifiquei a decisão com uma evidência.
- [ ] Corrigi as divergências após comparar.
- [ ] Fiz a mudança proposta e expliquei o resultado.

## Nível 4
### Caso novo
O produto precisa funcionar com rede intermitente e texto ampliado. Proponha uma entrega com critérios de qualidade.

### Análise esperada
Defina estados offline e retomada, limite de dados armazenados, leitura responsiva e acessibilidade. Demonstre o fluxo em condições distintas e registre evidências.

### Transferência
Mude o idioma para um com textos mais longos e confira o layout.

### Evidências
- [ ] Justifiquei a decisão com uma evidência.
- [ ] Corrigi as divergências após comparar.
- [ ] Fiz a mudança proposta e expliquei o resultado.
