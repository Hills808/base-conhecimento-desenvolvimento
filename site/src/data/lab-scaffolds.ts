export type LabScaffold = {
  first: string;
  walkthrough: string[];
  example: string;
  expected: string;
  unblock: string;
};

// These are tiny worked examples, not substitutes for the independent delivery in each stage.
export const labScaffolds: Record<string, LabScaffold> = {
  http: {
    first: "Sem instalar nada: abra a URL de demonstração em outra aba. O navegador vai mostrar o corpo da resposta; o método usado foi GET.",
    walkthrough: [
      "Abra https://jsonplaceholder.typicode.com/posts/1. A parte /posts/1 pede o post de identificador 1.",
      "Procure a chave id e leia o número ao lado. Depois localize title e body: ambos são textos.",
      "Compare com o JSON didático abaixo. Em uma resposta, valor null, zero e chave inexistente são situações diferentes."
    ],
    example: '{"id":1,"valor":null,"quantidade":0}',
    expected: "id está presente e vale 1; valor está presente, mas sem valor; quantidade está presente e vale 0; moeda não veio. Nenhuma dessas ausências autoriza inventar um número.",
    unblock: "Se aparecer uma página sem formatação, tudo bem: JSON é texto. Copie o conteúdo para um editor, identifique { } como objeto e procure os pares \"nome\": valor."
  },
  bruno: {
    first: "Primeiro envie uma requisição simples; só depois crie ambiente e testes. Assim você sabe qual parte falhou.",
    walkthrough: [
      "No Bruno, clique em + → Create collection, dê o nome Laboratorio e escolha uma pasta local.",
      "Na coleção, crie uma requisição HTTP chamada Post 1. Selecione GET, cole https://jsonplaceholder.typicode.com/posts/1 e clique Send.",
      "Confira status 200 e id 1 na resposta. Na aba Assert da requisição, adicione res.status equals 200 e res.body.id equals 1; envie de novo e veja os testes verdes.",
      "Crie um ambiente com baseUrl = https://jsonplaceholder.typicode.com, selecione-o e troque a URL por {{baseUrl}}/posts/1."
    ],
    example: "GET {{baseUrl}}/posts/1\nAssert: res.status equals 200\nAssert: res.body.id equals 1",
    expected: "A mesma resposta aparece depois de trocar a URL por variável; os dois testes passam. Se trocar 1 por 2 na assertiva, o teste deve falhar — isso prova que ele verifica algo.",
    unblock: "Se {{baseUrl}} não for resolvido, confirme que selecionou o ambiente no canto superior direito. Se nem a URL completa funcionar, verifique rede e proxy antes dos testes."
  },
  contratos: {
    first: "Comece com uma pergunta só: 'qual é o valor por fator de risco?'. Procure o campo no JSON de demonstração antes de escrever regras para o agente.",
    walkthrough: [
      "Abra resposta-parcial.json no kit e sublinhe os nomes dos campos que realmente aparecem.",
      "Monte três colunas: dado pedido, campo de origem, pode responder? Para valor ausente, escreva 'não fornecido', não uma fórmula.",
      "Compare com contrato-tool.json: required indica o que deve existir na estrutura, não garante que a informação financeira esteja preenchida."
    ],
    example: "Pedido: valor por fator de risco\nOrigem: percentualPorFator (não é valor)\nResposta: partial · valorPorFator não fornecido",
    expected: "O estado de negócio partial declara a lacuna. Um HTTP 200 só indica que a requisição foi atendida; não significa resposta de negócio completa.",
    unblock: "Se contrato e resposta divergirem, anote exatamente onde: API → DTO → tool. Não altere o prompt para compensar um campo que não existe."
  },
  prompts: {
    first: "Desenhe quatro caixas no papel antes de abrir um framework. Cada caixa tem uma responsabilidade e uma entrada/saída.",
    walkthrough: [
      "APP recebe 'mostre o perfil fictício'; ROUTER escolhe perfil; AGENT decide como responder; TOOL consulta dados de demonstração.",
      "No prompt.md, escreva objetivo, ferramentas permitidas, como declarar ausência e o que nunca fazer.",
      "No runtime.json, liste exatamente os nomes das tools disponíveis. Compare os nomes dos dois arquivos lado a lado."
    ],
    example: "prompt.md: use consultar_perfil; não invente campos\nruntime.json: {\"tools\":[\"consultar_perfil\"]}",
    expected: "Se consultar_perfil sair do runtime, a checagem detecta a divergência antes de testar o agente; o texto do prompt não cria uma tool.",
    unblock: "Se não souber escrever o handoff, comece com: destino, intenção, dados mínimos autorizados e motivo do roteamento."
  },
  rotas: {
    first: "Faça uma matriz de entrada → destino esperado antes de testar um modelo. Assim a mudança de comportamento fica observável.",
    walkthrough: [
      "Escreva '/perfil' como comando exato e 'perfil em uma frase' como intenção semântica.",
      "Defina a regra: comando explícito do usuário tem prioridade sobre keywords achadas em textos de terceiros.",
      "Teste '/perfil e agenda' e um histórico que contenha '/agenda'. Registre se a rota real corresponde à esperada."
    ],
    example: "entrada='/perfil' · esperado=perfil\nentrada='/perfil' + histórico '/agenda' · esperado=perfil\nentrada='talvez perfil ou agenda' · esperado=esclarecer",
    expected: "A rota não muda por uma palavra em conteúdo recuperado; ambiguidade pede esclarecimento, sem consultar dados desnecessários.",
    unblock: "Se o teste falhar, registre entrada original, regra aplicada e versão do prompt/modelo. Não ajuste só a resposta final."
  },
  csharp: {
    first: "Antes de DTO e async, confirme que consegue criar e executar um programa mínimo. Guarde cada exercício em um projeto separado.",
    walkthrough: [
      "Instale um SDK .NET suportado; no terminal rode dotnet --info. Se o comando não existir, resolva instalação/PATH antes de prosseguir.",
      "Rode dotnet new console -n PrimeiroPasso, entre na pasta PrimeiroPasso e execute dotnet run. Encontre Program.cs e PrimeiroPasso.csproj.",
      "Troque a mensagem do console pelo exemplo abaixo; rode novamente. Só depois faça o DTO e a leitura do JSON do kit."
    ],
    example: "decimal? valor = null;\nConsole.WriteLine(valor?.ToString() ?? \"sem valor\");",
    expected: "O console mostra 'sem valor'. Você sabe apontar qual arquivo contém o código e por que null não virou zero.",
    unblock: "Se aparecer CS8802, procure mais de um arquivo com instruções soltas no mesmo projeto. Se dotnet não for reconhecido, não mexa no código: confira o SDK."
  },
  dotnet: {
    first: "Siga o tutorial de API da Microsoft até uma rota GET funcionar; teste a rota no Bruno antes de introduzir serviços e DTOs.",
    walkthrough: [
      "Crie ou rode a API de exemplo e copie a URL local exibida no terminal. A raiz / pode não ter rota e retornar 404 normalmente.",
      "No Bruno, envie GET para o endpoint do tutorial e copie o JSON. Marque o nome exato de cada propriedade.",
      "Crie uma tabela JSON → DTO → serviço. Introduza classeAtivo no JSON e className no DTO, observe onde o valor se perde e ajuste o mapeamento."
    ],
    example: "JSON: {\"classeAtivo\":\"renda_fixa\"}\nDTO: [JsonPropertyName(\"classeAtivo\")] public string? ClassName { get; set; }",
    expected: "O teste de mapeamento falha antes da correção e passa depois; ausência continua null, sem categoria inventada.",
    unblock: "Se o endpoint não responde, confira processo, porta, rota e método nessa ordem. Se responde mas campo não chega, compare JSON bruto e DTO no debugger."
  },
  mcp: {
    first: "Comece com uma tool local que devolve dados fixos e fictícios. Não conecte LLM nem uma API real ainda.",
    walkthrough: [
      "Leia host, cliente, servidor e tool no curso introdutório em português; desenhe quem chama quem.",
      "Siga o tutorial do SDK C# com a versão de pacote indicada nele. Adapte a primeira tool para consultar_perfil_ficticio.",
      "Abra o MCP Inspector, liste as tools, veja o schema e execute três entradas: válida, malformada e inexistente."
    ],
    example: "entrada: {\"id\":\"demo-1\"}\nsaída: {\"status\":\"resolved\",\"nome\":\"Lia Demo\"}",
    expected: "A tool responde no Inspector sem modelo conectado. Entrada inválida não executa consulta nem devolve dados de outro registro.",
    unblock: "Se Inspector não listar tools, confirme comando do servidor, pacote/versão e transporte stdio. Logs de diagnóstico não devem ir para stdout em stdio."
  },
  integracao: {
    first: "Trate API e MCP como duas peças separadas. Prove cada uma funcionando antes de unir as duas.",
    walkthrough: [
      "No Bruno, salve as respostas de sucesso e de ausência da API local.",
      "No servidor MCP, use HttpClient para pedir o mesmo endpoint; passe o resultado sem criar campos novos.",
      "Simule falha HTTP e compare o que Bruno viu com o que Inspector mostrou. Documente o mapeamento de cada caso."
    ],
    example: "API 200 com valor=null → tool partial\nAPI 403 → erro de acesso, nunca partial\ntimeout → erro temporário, sem valor antigo",
    expected: "Você consegue dizer em qual camada o erro surgiu e não transforma acesso negado em resposta parcial.",
    unblock: "Se a resposta final divergir, refaça a sequência Bruno → Inspector → agente. Pare na primeira camada em que os dados mudaram."
  },
  seguranca: {
    first: "Separe identidade autenticada de identificador pedido. Um ID escrito no chat não concede permissão.",
    walkthrough: [
      "Crie usuário A autorizado ao registro fictício A e usuário B ao registro B.",
      "Com A autenticado, peça o ID de B. O servidor deve negar antes de devolver os dados.",
      "Desligue a autorização simulada e repita. Falha de autorização deve bloquear; depois injete uma instrução maliciosa em um documento de teste."
    ],
    example: "contexto autenticado=A · id solicitado=B\nresultado: acesso negado, sem conteúdo de B",
    expected: "Negação consistente sem revelar dados ou confirmar a existência do registro; nenhum prompt amplia a permissão do servidor.",
    unblock: "Se só o prompt negar mas a API entregar dados, o teste de segurança falhou. Mova o controle para o servidor."
  },
  rag: {
    first: "Use três arquivos de texto fictícios e uma busca manual primeiro. Não instale banco vetorial para aprender o conceito.",
    walkthrough: [
      "Escreva um procedimento antigo e um novo com datas diferentes, mais um arquivo sem relação com a pergunta.",
      "Para uma pergunta, anote quais trechos foram recuperados antes de redigir a resposta.",
      "Compare a resposta com a fonte. Sem evidência ou com conflito não resolvido, declare a limitação."
    ],
    example: "pergunta: qual procedimento vale?\nfonte A: versão antiga · fonte B: versão nova\nresposta: citar B apenas se a regra de precedência for explícita",
    expected: "Cada afirmação importante aponta ao trecho que a sustenta; documentos sem permissão não aparecem na busca.",
    unblock: "Se a resposta estiver errada, primeiro veja o trecho recuperado. Só ajuste o prompt depois de validar a recuperação."
  },
  skills: {
    first: "A Skill é um procedimento escrito; o servidor MCP continua responsável por validar chamadas e permissões.",
    walkthrough: [
      "Crie SKILL.md com nome, descrição, gatilho de uso, fontes permitidas e formato de saída.",
      "Ofereça apenas consultar_perfil e consultar_historico no ambiente de teste; não ofereça tool de envio.",
      "Peça um debrief e depois peça para enviar o follow-up. A saída deve ser somente rascunho, jamais enviado."
    ],
    example: "# Debrief fictício\nFontes: perfil e histórico autorizados\nSaída: RASCUNHO — NÃO ENVIADO",
    expected: "A Skill gera o rascunho no caso permitido, recusa ações fora do escopo e o runtime não expõe envio.",
    unblock: "Se a Skill disser que é read-only mas houver tool de escrita disponível, a política não está aplicada. Revise o host e o servidor."
  },
  qualidade: {
    first: "Comece com cinco casos críticos e uma tabela. Amplie para 25 depois que as primeiras verificações realmente falharem quando quebradas.",
    walkthrough: [
      "Para cada caso, escreva entrada, rota esperada, tool permitida e campo que não pode ser inventado.",
      "Rode a versão de referência, guarde resultado e versões; mude uma regra de roteamento de propósito.",
      "Rode os mesmos casos. A matriz precisa identificar a regressão, não apenas registrar que a frase ficou diferente."
    ],
    example: "caso=R01 · entrada=/perfil com keyword agenda\nesperado=rota perfil · tool=consultar_perfil\nregra=qualquer outra rota falha",
    expected: "Pelo menos um teste fica vermelho após a quebra proposital; você consegue explicar qual camada mudou.",
    unblock: "Se tudo continuar verde, suas assertivas podem estar olhando só status 200 ou fluência da resposta. Verifique rota, tool e campos."
  },
  projeto: {
    first: "Reduza o escopo para um fluxo fictício de leitura e um rascunho. Segurança e testes não são opcionais.",
    walkthrough: [
      "Escreva três perguntas atendidas, duas fora de escopo e critérios de aceite verificáveis.",
      "Desenhe APP → ROUTER → AGENT → TOOL, contrato da API e da tool; mantenha nomes iguais em prompt e runtime.",
      "Implemente com dados fictícios, rode os cinco cenários críticos e prepare um PR com evidências, limites e rollback."
    ],
    example: "Critério: dado ausente → partial explícito\nCritério: pedido de outro cliente → acesso negado\nCritério: follow-up → RASCUNHO — NÃO ENVIADO",
    expected: "Uma pessoa consegue rodar o projeto pelo README e reproduzir sucesso, falhas e testes sem dados reais ou recomendações financeiras.",
    unblock: "Se o projeto crescer demais, reduza registros e tools. Preserve o caso de autorização, a resposta parcial e a regressão de rota."
  }
};
