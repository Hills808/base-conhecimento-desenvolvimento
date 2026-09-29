export type Guidance = {
  focusGoal: string;
  tip: string;
  attention: string;
  curiosity: string;
  question: string;
  answer: string;
};

export const guidance: Record<string, Guidance> = {
  http: {
    focusGoal: "Ler uma resposta HTTP e apontar quatro campos.",
    tip: "Leia a resposta de cima para baixo: status, headers e corpo. Isso evita concluir algo apenas porque apareceu um 200.",
    attention: "Campo ausente, null e zero não são a mesma coisa. Nunca complete uma ausência por suposição.",
    curiosity: "HTTP descreve a conversa entre sistemas; JSON descreve os dados transportados nela.",
    question: "Se a API retorna 200, mas não traz um campo obrigatório, a resposta está completa?",
    answer: "Não necessariamente. O status técnico foi bem-sucedido, mas a regra de negócio pode exigir um estado partial."
  },
  bruno: {
    focusGoal: "Criar e testar uma requisição GET no Bruno.",
    tip: "Comece testando só duas coisas: o status e um campo importante do corpo.",
    attention: "Uma requisição que não conecta não recebeu status HTTP. Primeiro investigue URL, rede ou processo local.",
    curiosity: "Coleções do Bruno podem ficar no Git, o que torna chamadas e testes revisáveis em Pull Requests.",
    question: "Por que usar uma variável baseUrl em vez de escrever a URL em todas as requisições?",
    answer: "Porque o mesmo teste pode mudar de ambiente sem editar cada requisição."
  },
  contratos: {
    focusGoal: "Separar resposta completa, parcial e acesso negado.",
    tip: "Desenhe a cadeia pedido → contrato → JSON real → transformação → resposta antes de alterar qualquer prompt.",
    attention: "Um schema valida forma; ele não cria um campo que a API não devolve.",
    curiosity: "Swagger UI é uma interface; OpenAPI é o documento que descreve as operações e os dados.",
    question: "Se existe apenas percentual por fator, o agente pode calcular o valor financeiro final?",
    answer: "Não. A resposta deve declarar a ausência da fonte ou do valor necessário; o modelo não deve inferir dados financeiros."
  },
  prompts: {
    focusGoal: "Mapear uma tool no prompt e no runtime.",
    tip: "Mantenha uma tabela simples com nome da tool, entrada, saída, autorização e onde ela aparece no runtime.",
    attention: "Citar uma tool no Markdown não a habilita nem concede permissão para usá-la.",
    curiosity: "Separar router, agent e tool torna uma falha investigável: você sabe em qual camada procurar.",
    question: "Qual é a diferença entre o prompt e a configuração runtime?",
    answer: "O prompt orienta o comportamento; o runtime define o que realmente está disponível e pode ser executado."
  },
  rotas: {
    focusGoal: "Registrar um caso de colisão de roteamento.",
    tip: "Coloque comandos explícitos e regras de segurança antes de rotas semânticas ou por palavra-chave.",
    attention: "Uma keyword isolada pode causar colisões. Registre o caso de regressão antes de corrigir a precedência.",
    curiosity: "Uma matriz de roteamento serve como especificação e também como teste de regressão.",
    question: "Por que /duda deve ser testado mesmo após uma mudança aparentemente pequena?",
    answer: "Porque modelos, keywords ou precedência podem redirecionar o comando para outra rota sem um erro visível."
  },
  csharp: {
    focusGoal: "Entender um DTO e seu mapeamento básico.",
    tip: "Não tente aprender toda a linguagem antes de integrar. Domine tipos, métodos, classes, async e leitura de erros.",
    attention: "Não bloqueie chamadas assíncronas com .Result ou .Wait(); siga async/await de ponta a ponta.",
    curiosity: "DTOs existem para transportar dados de forma explícita; eles não precisam ser iguais às entidades internas.",
    question: "Por que uma classe de resposta não deve expor automaticamente tudo que o backend conhece?",
    answer: "Porque o contrato deve devolver apenas o que é necessário e autorizado para aquele consumidor."
  },
  dotnet: {
    focusGoal: "Comparar o JSON retornado com o DTO esperado.",
    tip: "Quando um campo some, compare nome JSON, atributo de serialização, DTO e mapeamento do serviço — nessa ordem.",
    attention: "Um 200 com DTO incompleto ainda pode ser defeito de contrato ou de mapeamento.",
    curiosity: "O System.Text.Json diferencia opções de nomenclatura e atributos usados no DTO.",
    question: "Se a API retorna profile_360 e o serviço espera Profile360, onde pode estar a falha?",
    answer: "No contrato ou na configuração/atributo de serialização. Não é uma falha que o prompt consiga resolver."
  },
  mcp: {
    focusGoal: "Inspecionar uma tool read-only no MCP Inspector.",
    tip: "Comece com uma tool pequena e read-only, com entrada e saída testáveis no Inspector.",
    attention: "Tool descoberta não significa tool autorizada. Use allowlist e valide identidade no servidor.",
    curiosity: "MCP é o protocolo de integração; a política de autorização continua sendo responsabilidade do servidor.",
    question: "Por que uma tool MCP deve retornar estados claros em vez de texto vago?",
    answer: "Porque o agente precisa distinguir sucesso, ausência, ambiguidade e falha sem inventar uma conclusão."
  },
  integracao: {
    focusGoal: "Definir como a tool trata uma falha da API.",
    tip: "Faça a tool traduzir a resposta da API para um contrato estável; não entregue o JSON bruto ao agente.",
    attention: "Timeout, 401, 403, 404 e 500 exigem tratamentos diferentes e não devem virar uma única mensagem genérica.",
    curiosity: "IHttpClientFactory ajuda a centralizar configuração e o uso correto de HttpClient em aplicações .NET.",
    question: "Qual camada decide se uma resposta da API vira partial?",
    answer: "A camada que conhece o contrato da tool e as regras de negócio, não o modelo por conta própria."
  },
  seguranca: {
    focusGoal: "Identificar a autorização server-side da operação.",
    tip: "Pergunte sempre: qual dado mínimo esta operação precisa e onde o servidor confirma a permissão?",
    attention: "Nunca aceite identidade, perfil ou autorização informados pelo prompt ou pelo texto do usuário.",
    curiosity: "Fail closed significa negar ou interromper quando a autorização não pode ser comprovada.",
    question: "Por que responder “não encontrado” pode ser perigoso em alguns casos?",
    answer: "Porque a resposta pode permitir enumeração: ela revela indiretamente que outro recurso ou cliente existe."
  },
  rag: {
    focusGoal: "Conferir se uma fonte sustenta uma resposta.",
    tip: "Antes de gerar, confira se a fonte responde à pergunta e se a citação realmente sustenta a frase.",
    attention: "RAG não dá permissão para acessar dados nem transforma fonte conflitante em verdade.",
    curiosity: "A qualidade de RAG envolve recuperação, contexto, resposta e avaliação — não só o modelo.",
    question: "O que fazer quando duas fontes autorizadas trazem informações conflitantes?",
    answer: "Declarar o conflito, indicar as fontes e evitar escolher ou inventar uma conclusão sem regra definida."
  },
  skills: {
    focusGoal: "Definir a allowlist de uma Skill de debrief.",
    tip: "Escreva a Skill como procedimento verificável: objetivo, entradas, tools permitidas, passos, limites e saída.",
    attention: "Uma Skill de debrief pode sugerir um follow-up, mas não deve enviá-lo sem aprovação explícita.",
    curiosity: "Skills organizam instruções e recursos reutilizáveis; governança define quando e como podem ser publicadas.",
    question: "Qual o risco de permitir qualquer tool a uma Skill aparentemente simples?",
    answer: "Ela pode acessar ou executar ações além do objetivo. Allowlist reduz a superfície de risco."
  },
  qualidade: {
    focusGoal: "Transformar um defeito em caso de regressão.",
    tip: "Cada defeito encontrado vira um caso de regressão pequeno e reproduzível.",
    attention: "Não use somente exemplos felizes: ausência, conflito, ambiguidade e acesso negado precisam de cobertura.",
    curiosity: "Uma boa evidência de qualidade explica o comportamento esperado, não apenas mostra uma tela verde.",
    question: "Por que guardar uma resposta de falha esperada no teste?",
    answer: "Para evitar que uma mudança futura transforme um comportamento seguro em uma resposta incorreta sem ser percebida."
  },
  projeto: {
    focusGoal: "Revisar uma evidência antes da Pull Request.",
    tip: "Antes da PR, revise o caminho inteiro: requisito, fluxo, contrato, testes, segurança e evidências.",
    attention: "Não inclua tokens, dados reais, logs sensíveis ou respostas de clientes na entrega.",
    curiosity: "Uma Pull Request boa permite que outra pessoa entenda a decisão e reproduza a validação sem depender de você.",
    question: "Qual evidência torna uma PR de integração mais confiável?",
    answer: "Contrato versionado, testes reproduzíveis, casos de erro e uma explicação breve das decisões de segurança."
  }
};
