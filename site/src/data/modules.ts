export type Stage = { name: string; learn: string[]; practice: string; proof: string };
export type Module = {
  id: number; title: string; short: string; area: string; symbol: string;
  color: string; prerequisite: string; outcome: string; stages: [Stage, Stage, Stage]; guide: string;
};

export const modules: Module[] = [
  {
    id: 0, title: "Aprender a aprender", short: "Monte uma rotina que cabe na vida real.", area: "Comece aqui", symbol: "↗", color: "#f1c661",
    prerequisite: "Nenhum.", outcome: "Um plano de estudo e um projeto para acompanhar a evolução.", guide: "00-comecando",
    stages: [
      { name: "Encontre seu ponto de partida", learn: ["Definir uma habilidade concreta", "Escolher um material principal", "Organizar blocos curtos de estudo"], practice: "Escreva uma meta de duas semanas e escolha um primeiro recurso.", proof: "Você sabe o que estudar na próxima sessão e por quê." },
      { name: "Crie um ciclo", learn: ["Estudar, praticar e explicar", "Registrar dúvidas e evidências", "Revisar sem recomeçar sempre"], practice: "Faça uma pequena entrega por semana e registre o que aprendeu.", proof: "Existe uma entrega demonstrável, não só uma lista de links vistos." },
      { name: "Desenhe seu próximo passo", learn: ["Localizar lacunas reais", "Combinar módulos sem repetir", "Escolher um projeto progressivo"], practice: "Reorganize seu plano após uma revisão honesta do projeto.", proof: "Você consegue justificar o próximo módulo com base no que faltou." }
    ]
  },
  {
    id: 1, title: "Fundamentos & linguagens", short: "Da lógica ao primeiro programa que funciona.", area: "Desenvolvimento", symbol: "{ }", color: "#b9d9fc",
    prerequisite: "Curiosidade; não precisa programar antes.", outcome: "Resolver problemas pequenos e escolher uma linguagem para continuar.", guide: "01-fundamentos-e-linguagens",
    stages: [
      { name: "Pense como programador", learn: ["Variáveis, condições e loops", "Funções e decomposição", "Terminal e execução de programas"], practice: "Resolva três problemas de lógica, explicando sua solução.", proof: "Você consegue escrever e explicar um programa simples." },
      { name: "Escolha uma linguagem", learn: ["Sintaxe e estruturas de dados", "Depuração básica", "C#, Python, Java ou JavaScript como alternativas"], practice: "Crie uma calculadora ou conversor com entradas inválidas tratadas.", proof: "Você executa, testa e corrige o projeto sem copiar cada passo." },
      { name: "Construa com autonomia", learn: ["Algoritmos e complexidade", "Leitura de documentação", "Projetos orientados a problema"], practice: "Refatore o projeto e documente as decisões.", proof: "Você explica escolhas e troca uma implementação com segurança." }
    ]
  },
  {
    id: 2, title: "Backend, APIs & .NET", short: "Entenda contratos antes de conectar sistemas.", area: "Desenvolvimento", symbol: "</>", color: "#ffd0bb",
    prerequisite: "Lógica básica; C# ajuda na parte de construção.", outcome: "Investigar, testar e implementar uma API com contrato claro.", guide: "02-backend-apis-e-arquitetura",
    stages: [
      { name: "Leia a conversa HTTP", learn: ["Requisições, respostas e status", "JSON e erros", "Uma chamada no Bruno"], practice: "Consulte uma API fictícia e compare resposta esperada e recebida.", proof: "Você identifica método, URL, status e corpo sem confundi-los." },
      { name: "Especifique e teste", learn: ["OpenAPI/Swagger", "Schemas e DTOs", "Variáveis, coleções e testes no Bruno"], practice: "Descreva um endpoint e cubra sucesso, ausência e erro.", proof: "O contrato e os testes concordam sobre campos e estados." },
      { name: "Implemente com confiança", learn: ["ASP.NET Core e serviços", "Autorização e validação", "Testes de integração e arquitetura"], practice: "Crie uma API de catálogo fictício e diagnostique um campo ausente.", proof: "Você distingue falha no serviço, contrato e cliente." }
    ]
  },
  {
    id: 3, title: "Frontend & acessibilidade", short: "Interfaces que respondem bem em qualquer tela.", area: "Desenvolvimento", symbol: "◫", color: "#cfddab",
    prerequisite: "Lógica ajuda; HTML é o ponto de entrada.", outcome: "Uma interface responsiva com estados claros e navegação acessível.", guide: "03-frontend-mobile-e-acessibilidade",
    stages: [
      { name: "Construa a página", learn: ["HTML semântico", "CSS responsivo", "JavaScript no navegador"], practice: "Monte uma página de leitura que funcione no celular.", proof: "Texto, foco e layout funcionam sem zoom horizontal." },
      { name: "Conecte a interface", learn: ["Componentes", "Consumo de API", "Carregamento, vazio e erro"], practice: "Exiba uma lista vinda de uma API fictícia.", proof: "Você consegue testar os três estados da interface." },
      { name: "Cuide da experiência", learn: ["Acessibilidade", "Performance e PWA", "Escolhas de framework e mobile"], practice: "Audite e melhore teclado, contraste e tempo de carregamento.", proof: "Outra pessoa usa o fluxo sem mouse e entende o feedback." }
    ]
  },
  {
    id: 4, title: "Dados & machine learning", short: "Pergunte melhor aos dados antes de modelar.", area: "Dados & IA", symbol: "▥", color: "#d5c9fb",
    prerequisite: "SQL é a porta de entrada; ML pede Python e estatística.", outcome: "Consultar, analisar e avaliar um conjunto de dados fictício.", guide: "04-bancos-dados-e-ia",
    stages: [
      { name: "Pergunte aos dados", learn: ["Tabelas e relações", "SELECT, filtros e JOINs", "Modelagem básica"], practice: "Consulte uma base pequena e responda a três perguntas verificáveis.", proof: "Você explica o resultado e a origem dos dados." },
      { name: "Analise e compare", learn: ["Limpeza e exploração", "Métricas", "Viés e validação"], practice: "Faça uma análise reproduzível com hipótese e resultado.", proof: "Você aponta limitações em vez de afirmar certeza indevida." },
      { name: "Modele com critério", learn: ["Machine learning", "Deep learning", "MLOps e monitoramento"], practice: "Compare baseline e modelo, documentando o conjunto de teste.", proof: "Você consegue defender a escolha com métricas apropriadas." }
    ]
  },
  {
    id: 5, title: "IA, agentes & RAG", short: "Faça sistemas úteis, testáveis e com limites.", area: "Dados & IA", symbol: "✳", color: "#b7e5e1",
    prerequisite: "Noções de API ajudam; o mapa começa pelos conceitos.", outcome: "Um agente com fontes, ferramentas e avaliação de respostas.", guide: "05-ia-generativa-agentes-e-mlops",
    stages: [
      { name: "Entenda as peças", learn: ["Modelo, prompt e contexto", "Limites e alucinação", "Quando usar RAG ou tool"], practice: "Desenhe um fluxo para responder perguntas sobre documentos fictícios.", proof: "Você indica a fonte e sabe quando a resposta deve ser 'não sei'." },
      { name: "Orquestre e teste", learn: ["Roteamento e handoff", "Contratos de tool", "Casos de regressão"], practice: "Faça um roteador separar duas intenções parecidas e teste a colisão.", proof: "Cada caminho tem entrada, saída e falha definidos." },
      { name: "MCP, Skills e segurança", learn: ["Servidor MCP e allowlist", "Skill com instruções e recursos", "Avaliações e prompt injection"], practice: "Crie uma Skill read-only de debrief com dados fictícios.", proof: "A saída mostra origem dos dados e um follow-up não enviado." }
    ]
  },
  {
    id: 6, title: "Cloud, DevOps & segurança", short: "Do commit à operação sem perder qualidade.", area: "Engenharia", symbol: "⌁", color: "#f7d4dc",
    prerequisite: "Um projeto pequeno deixa tudo mais concreto.", outcome: "Um serviço com testes, pipeline, logs e controles básicos.", guide: "06-cloud-devops-qualidade-e-seguranca",
    stages: [
      { name: "Versione e colabore", learn: ["Git e branches", "Pull Requests", "Testes básicos"], practice: "Abra um PR pequeno com descrição e validação.", proof: "Outra pessoa entende a mudança e como verificá-la." },
      { name: "Automatize", learn: ["Containers", "CI/CD", "Configuração e ambientes"], practice: "Adicione teste automatizado e execução em container.", proof: "O pipeline falha quando um comportamento esperado quebra." },
      { name: "Opere com cuidado", learn: ["Observabilidade", "Autorização e segredos", "Ameaças comuns e resposta"], practice: "Registre erros sem expor dados sensíveis e revise permissões.", proof: "Você consegue diagnosticar falha preservando o mínimo de dados." }
    ]
  },
  {
    id: 7, title: "GitHub, ferramentas & certificados", short: "Descubra bons recursos e prove o que aprendeu.", area: "Engenharia", symbol: "↖", color: "#eadac2",
    prerequisite: "Nenhum para explorar; Git básico para contribuir.", outcome: "Uma seleção pessoal de ferramentas, projetos e formações.", guide: "07-github-ferramentas-e-certificados",
    stages: [
      { name: "Encontre fontes", learn: ["Repositórios e awesome lists", "Documentação oficial", "Critérios para avaliar links"], practice: "Escolha um repositório e avalie manutenção, licença e clareza.", proof: "Você sabe explicar por que vale seu tempo." },
      { name: "Aprenda em público", learn: ["Exercícios e projetos", "Issues iniciais", "Contribuições pequenas"], practice: "Reproduza um bug ou melhore documentação em projeto aberto.", proof: "Você consegue explicar a mudança e receber revisão." },
      { name: "Demonstre habilidade", learn: ["Portfólio", "Credenciais e badges", "Benefícios estudantis"], practice: "Publique uma entrega com README e evidências.", proof: "O projeto mostra o que você fez, mais que apenas um certificado." }
    ]
  },
  {
    id: 8, title: "Idiomas para tecnologia", short: "Leia docs, converse e escreva com mais segurança.", area: "Além do código", symbol: "Aa", color: "#c9dfef",
    prerequisite: "Faça o diagnóstico do guia; há caminhos para vários níveis.", outcome: "Uma rotina de inglês técnico aplicada a tarefas reais.", guide: "08-idiomas-para-tecnologia",
    stages: [
      { name: "Ganhe repertório", learn: ["Diagnóstico de nível", "Vocabulário de documentação", "Leitura com contexto"], practice: "Leia uma página curta de documentação e resuma em português.", proof: "Você identifica ideia central e termos que precisa revisar." },
      { name: "Ouça e escreva", learn: ["Escuta em camadas", "Escrita de issues e PRs", "Explicar decisões técnicas"], practice: "Assista a uma aula e escreva um resumo técnico curto.", proof: "Você relata o que entendeu e faz uma pergunta precisa." },
      { name: "Comunique no trabalho", learn: ["Reuniões e apresentações", "Pronúncia e prática oral", "Outros idiomas e exames"], practice: "Grave uma explicação de dois minutos sobre um projeto fictício.", proof: "Sua fala comunica contexto, decisão e próximo passo." }
    ]
  },
  {
    id: 9, title: "Laboratório MCP com C#", short: "Um projeto guiado que une API, agente e Skill.", area: "Laboratório", symbol: "✺", color: "#f8c98c",
    prerequisite: "A primeira etapa ensina HTTP; apoio de C# antes do servidor.", outcome: "Um servidor MCP de consulta testado com dados fictícios.", guide: "09-trilha-pratica-mcp-csharp-agentes",
    stages: [
      { name: "Primeiro contato", learn: ["HTTP e JSON no Bruno", "Conceitos de C#", "O que muda com MCP"], practice: "Faça uma requisição à JSONPlaceholder e documente seu resultado.", proof: "Você aponta onde estão status, campos e erros." },
      { name: "Construa a ponte", learn: ["API local em .NET", "Servidor MCP e tool", "Inspector e contrato de saída"], practice: "Exponha uma tool read-only para consultar catálogo fictício.", proof: "A tool retorna dados explícitos e trata ausência sem inventar." },
      { name: "Integre e proteja", learn: ["Agente e RAG", "Skill governada", "Testes, autorização e observabilidade"], practice: "Avalie o fluxo ponta a ponta com falhas e campos ausentes.", proof: "Você demonstra sucesso e falha segura com testes reproduzíveis." }
    ]
  }
];

export const guideUrl = (guide: string) => `https://github.com/Hills808/base-conhecimento-desenvolvimento/blob/main/guias/${guide}.md`;
