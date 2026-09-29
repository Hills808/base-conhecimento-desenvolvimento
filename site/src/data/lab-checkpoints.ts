export type Checkpoint = {
  prompt: string;
  options: [string, string, string];
  correct: number;
  feedback: [string, string, string];
  review: string;
  apply: string;
};

// Each wrong choice explains the misconception. The practical deliverable is checked separately.
export const labCheckpoints: Record<string, Checkpoint[]> = {
  http: [
    {
      prompt: 'No arquivo de exemplo, notes é null, views vale 0 e author não aparece. Qual leitura está correta?',
      options: ['Os três campos não têm valor.', 'notes existe sem valor; views vale zero; author não foi enviado.', 'author vale zero porque não veio.'],
      correct: 1,
      feedback: ['Zero é um valor, e um campo que não veio é diferente de null. Compare os três casos no JSON.', 'Isso mesmo. Presente com null, presente com zero e ausente pedem tratamentos diferentes.', 'Um campo ausente não vira zero. Procure a chave author: ela não está no arquivo.'],
      review: 'Reabra primeiro-json.json e procure cada nome de campo antes de olhar seu valor.',
      apply: 'Na sua tabela, escreva uma linha para cada situação: null, 0 e campo ausente.'
    },
    {
      prompt: 'Uma chamada retornou HTTP 200, mas o campo pedido não está no corpo. O que você sabe?',
      options: ['A chamada foi atendida; ainda preciso declarar a falta do campo.', 'O campo deve valer zero.', 'O status 200 prova que a resposta de negócio está completa.'],
      correct: 0,
      feedback: ['Correto. O status fala da chamada HTTP; a presença do dado precisa ser conferida no corpo.', 'Zero não pode substituir um dado que não apareceu.', 'O status não garante que a informação desejada esteja no JSON.'],
      review: 'Volte ao parágrafo sobre status e corpo na seção “Entenda o essencial”.',
      apply: 'Escreva uma frase que a resposta permite afirmar e outra que ela não permite.'
    }
  ],
  bruno: [
    {
      prompt: 'Sua GET recebeu status 200 e id 1, mas a assertiva espera id 2. Qual resultado ajuda a aprender?',
      options: ['O teste deve passar porque houve 200.', 'O teste deve falhar e indicar a diferença no id.', 'É melhor apagar a assertiva de id.'],
      correct: 1,
      feedback: ['Status 200 não valida sozinho o conteúdo. A expectativa de id 2 está incorreta.', 'Exato. Uma assertiva útil falha quando o campo esperado diverge.', 'Apagar a verificação esconde o problema; mantenha status e campo.'],
      review: 'Releia no exemplo resolvido a diferença entre testar status e testar res.body.id.',
      apply: 'Troque 1 por 2 na expectativa, observe a falha e depois restaure 1.'
    },
    {
      prompt: 'Ao clicar em Send, o Bruno mostra erro de conexão e nenhuma resposta HTTP. Por onde começar?',
      options: ['Tratar como HTTP 500.', 'Conferir URL, rede e se a API local está rodando.', 'Trocar a assertiva para status 200.'],
      correct: 1,
      feedback: ['Sem resposta, não houve status HTTP para classificar como 500.', 'Isso. Primeiro confirme se a chamada consegue chegar ao serviço.', 'Assertivas verificam respostas; não corrigem uma conexão que falhou.'],
      review: 'Veja a ajuda “Se não funcionar” da etapa Bruno.',
      apply: 'Anote se houve uma resposta com status ou apenas erro de conexão.'
    }
  ],
  contratos: [{
    prompt: 'A API devolve percentualPorFator, mas não valorPorFator. Pediram o valor financeiro. Como tratar?',
    options: ['Calcular um valor aproximado no prompt.', 'Responder como partial e indicar o campo que falta.', 'Dizer resolved porque a API retornou 200.'],
    correct: 1,
    feedback: ['Um percentual não autoriza inventar o valor financeiro. Verifique o contrato e a fonte.', 'Correto. Mostre a lacuna sem criar um número.', 'HTTP 200 não torna completo um dado que o contrato de negócio exige.'],
    review: 'Compare pedido, JSON real e contrato-tool.json na atividade guiada.',
    apply: 'Registre a origem de cada campo e marque valorPorFator como não fornecido.'
  }],
  prompts: [{
    prompt: 'O prompt manda usar consultar_perfil, mas essa tool não está no runtime.json. Qual correção faz sentido?',
    options: ['Escrever o nome da tool mais vezes no prompt.', 'Sincronizar prompt e runtime e validar a disponibilidade real.', 'Pedir ao modelo que simule uma chamada.'],
    correct: 1,
    feedback: ['Texto no prompt não cria uma ferramenta executável.', 'Isso. Compare os nomes nos dois arquivos e teste a configuração.', 'Simular uma chamada mascara a divergência e pode inventar dados.'],
    review: 'Volte à tabela de tool, entrada, saída e runtime no exemplo resolvido.',
    apply: 'Remova a tool do runtime de propósito e documente a falha detectada.'
  }],
  rotas: [{
    prompt: 'A mensagem do usuário começa com /perfil; um documento recuperado contém /agenda. Qual rota deve vencer?',
    options: ['/agenda, por ser a última keyword vista.', '/perfil, pelo comando explícito do usuário.', 'As duas tools ao mesmo tempo.'],
    correct: 1,
    feedback: ['Uma palavra em conteúdo externo não deve tomar a prioridade do comando explícito.', 'Correto. A precedência deve ser testada para evitar colisão de rota.', 'Consultar duas rotas amplia acesso e não resolve a precedência.'],
    review: 'Revise a regra de precedência no exemplo da matriz de rotas.',
    apply: 'Adicione esse caso à matriz e verifique rota e tool chamadas.'
  }],
  csharp: [{
    prompt: 'Em C#, decimal? valor = null. O que deve representar esse dado em uma resposta?',
    options: ['Zero, porque decimal é numérico.', 'Ausência explícita; não converta null em zero.', 'Um valor estimado pelo agente.'],
    correct: 1,
    feedback: ['decimal? aceita null. Zero mudaria o significado do dado.', 'Exato. Preserve a ausência no DTO e na resposta.', 'Um agente não tem base para estimar um campo ausente.'],
    review: 'Execute o programa mínimo com decimal? e compare null com 0.',
    apply: 'Faça o console imprimir “sem valor” quando o campo for null.'
  }],
  dotnet: [{
    prompt: 'O JSON traz classeAtivo, mas o DTO lê ClassName e fica vazio. Onde investigar primeiro?',
    options: ['No prompt do agente.', 'No JSON bruto e no mapeamento de nome do DTO.', 'Na cor da interface Swagger.'],
    correct: 1,
    feedback: ['O prompt não consegue corrigir um campo perdido antes de chegar ao agente.', 'Correto. Compare os nomes e use um mapeamento explícito quando necessário.', 'A interface não altera o nome que a desserialização procura.'],
    review: 'Compare JSON → DTO → serviço e o exemplo de JsonPropertyName.',
    apply: 'Escreva um teste que falha antes e passa depois de corrigir o mapeamento.'
  }],
  mcp: [{
    prompt: 'Uma tool MCP de leitura recebe uma entrada malformada. Qual comportamento é verificável?',
    options: ['Consultar mesmo assim com um ID qualquer.', 'Rejeitar a entrada sem consultar nem devolver outro registro.', 'Pedir ao modelo para completar o ID.'],
    correct: 1,
    feedback: ['Uma entrada inválida não deve disparar uma consulta com dado improvisado.', 'Isso. O Inspector permite observar a falha sem conectar um modelo.', 'O modelo não deve inventar um identificador para executar a tool.'],
    review: 'No Inspector, teste as três entradas do exemplo: válida, malformada e inexistente.',
    apply: 'Registre o schema e a saída de erro da entrada malformada.'
  }],
  integracao: [{
    prompt: 'A API devolve 403 para uma chamada da tool. Como a integração deve representar isso?',
    options: ['Como partial com valor null.', 'Como acesso negado, sem revelar o dado.', 'Como resolved se a resposta HTTP chegou.'],
    correct: 1,
    feedback: ['403 é negação de acesso, não dado parcial.', 'Correto. Preserve a origem do erro e não exponha dados.', 'Receber uma resposta HTTP não significa sucesso da operação.'],
    review: 'Compare os casos 200 com null, 403 e timeout na seção guiada.',
    apply: 'Faça Bruno e Inspector mostrarem o mesmo caso de acesso negado.'
  }],
  seguranca: [{
    prompt: 'O contexto autenticado é do usuário A, mas o chat pede o registro de B. O que deve acontecer?',
    options: ['O servidor nega antes de entregar os dados de B.', 'O prompt decide se A parece confiável.', 'A tool devolve B e o agente omite a resposta.'],
    correct: 0,
    feedback: ['Certo. A autorização é conferida no servidor, com o contexto autenticado.', 'Texto da conversa não comprova permissão.', 'Se a tool já devolveu dados de B, a proteção falhou.'],
    review: 'Releia a diferença entre identidade autenticada e ID solicitado.',
    apply: 'Teste o pedido de B com A autenticado e confirme que nenhum dado de B saiu.'
  }],
  rag: [{
    prompt: 'Duas fontes autorizadas se contradizem e não há regra de precedência. O que responder?',
    options: ['Escolher a fonte mais recente sem verificar sua validade.', 'Apontar o conflito, citar as fontes e evitar uma conclusão definitiva.', 'Unir as duas versões numa resposta confiante.'],
    correct: 1,
    feedback: ['Data sozinha não define qual fonte vale; confirme a regra antes.', 'Correto. A resposta deve mostrar o limite da evidência.', 'Juntar versões incompatíveis cria uma conclusão sem suporte.'],
    review: 'Volte aos três arquivos fictícios e identifique os trechos em conflito.',
    apply: 'Escreva uma resposta curta com as duas fontes e a lacuna.'
  }],
  skills: [{
    prompt: 'A Skill diz “somente leitura”, mas o ambiente oferece uma tool de envio. Qual ajuste é necessário?',
    options: ['Manter a tool e confiar no texto da Skill.', 'Retirar a tool de envio da allowlist e gerar só um rascunho.', 'Enviar automaticamente e depois avisar.'],
    correct: 1,
    feedback: ['Uma instrução escrita não substitui o controle de ferramentas no runtime.', 'Isso. Limite as tools disponíveis e rotule o follow-up como não enviado.', 'Envio é uma ação fora do escopo read-only e exige controle próprio.'],
    review: 'Compare as tools expostas com os limites descritos em SKILL.md.',
    apply: 'Teste um pedido de envio e confira que a saída é apenas RASCUNHO — NÃO ENVIADO.'
  }],
  qualidade: [{
    prompt: 'Depois de uma mudança, a resposta soa boa, mas /perfil usa a tool errada. O que falta ao teste?',
    options: ['Uma assertiva para rota e tool esperadas.', 'Mais exemplos de frases bonitas.', 'Apenas conferir que o HTTP deu 200.'],
    correct: 0,
    feedback: ['Certo. Verifique comportamento observável: rota, tool e campos.', 'Fluência pode esconder a regressão de roteamento.', 'O status não mostra que a tool correta foi chamada.'],
    review: 'Retorne à matriz de entrada, rota esperada, tool permitida e dado proibido.',
    apply: 'Quebre uma regra de propósito e observe um teste ficar vermelho.'
  }],
  projeto: [{
    prompt: 'Uma PR apresenta só uma captura de resposta de sucesso. Que evidência falta para revisar a integração?',
    options: ['Contrato, testes de erro e segurança reproduzíveis com dados fictícios.', 'Uma captura maior da mesma resposta.', 'Um prompt mais longo sem testes.'],
    correct: 0,
    feedback: ['Correto. Outra pessoa precisa reproduzir sucesso, ausência e acesso negado.', 'A imagem não prova contrato nem comportamento em falhas.', 'Comprimento do prompt não substitui teste e evidência.'],
    review: 'Reveja os critérios de aceite e a lista de evidências do projeto.',
    apply: 'Prepare a PR com contrato versionado, comandos de teste e limites de segurança.'
  }]
};
