export type GuidanceStage = {
  situation: string;
  outcome: string;
  attention: string;
  checks: string[];
};

export type ModuleGuidance = {
  orientation: string;
  firstMove: string;
  closing: string;
  stages: [GuidanceStage, GuidanceStage, GuidanceStage];
};

// These are learning prompts, not company procedures. Exercises use only public or fictitious data.
export const moduleGuidance: Record<number, ModuleGuidance> = {
  0: {
    orientation: "Este módulo organiza o estudo antes de você acumular abas, cursos e culpa. Saia dele com uma rotina pequena que produz evidências.",
    firstMove: "Escolha uma habilidade observável para as próximas duas semanas — por exemplo, ‘ler uma resposta de API e explicar os campos’.",
    closing: "Ao final, você terá um plano que se adapta ao que faltou na prática, em vez de uma lista infinita para cumprir.",
    stages: [
      { situation: "Você encontra dez cursos interessantes e não sabe qual abrir primeiro.", outcome: "Um cartão de estudo com objetivo, material principal, tempo disponível e uma primeira entrega.", attention: "‘Aprender C#’ é amplo demais. Use um verbo e uma evidência: ‘criar e testar um endpoint simples’.", checks: ["Consigo dizer o que vou produzir.", "Tenho só um recurso principal para começar.", "Minha próxima sessão cabe no meu tempo real."] },
      { situation: "Você estudou, mas depois não sabe o que realmente reteve nem como continuar.", outcome: "Um registro curto de evidência: o que foi feito, a dúvida que restou e o próximo experimento.", attention: "Não reinicie a trilha porque esqueceu uma parte. Volte somente ao ponto que bloqueia a entrega.", checks: ["Fiz algo que posso mostrar ou explicar.", "Registrei uma dúvida específica.", "Defini uma revisão curta, não uma repetição inteira."] },
      { situation: "A primeira escolha de trilha deixa de servir quando o projeto fica mais concreto.", outcome: "Uma revisão honesta do plano com um módulo seguinte justificado pela lacuna encontrada.", attention: "Não use certificados ou horas assistidas como sinal único de evolução; a prática precisa contrariar ou confirmar sua percepção.", checks: ["Sei qual lacuna apareceu na entrega.", "Escolhi o próximo módulo por uma necessidade real.", "Mantive o que ainda funciona no meu plano."] }
    ]
  },
  1: {
    orientation: "Fundamentos não significam memorizar sintaxe. O objetivo é quebrar um problema, executar um programa e investigar quando ele falha.",
    firstMove: "Comece pelos conceitos e pelo terminal; escolha uma linguagem para praticar apenas depois de entender o que um programa precisa decidir e repetir.",
    closing: "Ao final, você terá um pequeno programa explicado por você — uma base melhor do que avançar por tutoriais sem testar.",
    stages: [
      { situation: "Você sabe o que quer que o programa faça, mas trava ao transformar a ideia em passos.", outcome: "Três soluções curtas descritas em português e depois implementadas com variável, condição, repetição e função.", attention: "Copiar um algoritmo que funciona não mostra entendimento. Mude uma regra e veja se consegue ajustar a solução.", checks: ["Divido o problema em passos menores.", "Explico por que existe cada condição ou loop.", "Executo o programa pelo terminal."] },
      { situation: "Uma entrada inesperada quebra sua calculadora ou conversor.", outcome: "Um programa pequeno com validação de entrada e mensagens compreensíveis para sucesso e erro.", attention: "Não troque de linguagem a cada dificuldade. Use uma linguagem até conseguir depurar um problema simples nela.", checks: ["Trato ao menos uma entrada inválida.", "Uso o depurador ou logs para localizar uma falha.", "Consigo executar o projeto sem seguir um vídeo passo a passo."] },
      { situation: "O projeto funciona, mas cresceu de forma confusa e difícil de mudar.", outcome: "Uma versão reorganizada, com README curto e uma decisão técnica explicada.", attention: "Complexidade não é enfeite. Primeiro deixe claro e correto; só depois compare alternativas.", checks: ["Separei responsabilidades em funções claras.", "Expliquei uma escolha no README.", "Consigo alterar uma regra sem quebrar o resto."] }
    ]
  },
  2: {
    orientation: "APIs são conversas com contrato. Você vai aprender a enxergar método, URL, campos, estados e erros antes de escrever muita implementação.",
    firstMove: "Abra uma resposta pública no navegador ou no Bruno e descreva o que foi pedido, o que voltou e o que ficou ausente.",
    closing: "Ao final, você terá uma API fictícia, documentação, coleção de testes e evidência para separar defeito de contrato, serviço ou cliente.",
    stages: [
      { situation: "Uma API devolve 200, mas a interface ainda não tem a informação de que precisa.", outcome: "Uma anotação de requisição e resposta distinguindo método, URL, headers, status, corpo, null e campo inexistente.", attention: "Status 200 indica que a chamada foi aceita com sucesso; não prova que cada campo esperado foi retornado ou autorizado.", checks: ["Identifico o endpoint e o método.", "Leio o JSON sem confundir objeto, array, null e ausência.", "Repito a chamada no Bruno."] },
      { situation: "Time de backend e consumidor discordam sobre campos, estados e mensagens de erro.", outcome: "Um contrato de endpoint com entrada, schema de saída e exemplos de sucesso, ausência, validação e erro inesperado.", attention: "Swagger ajuda a documentar; ele não substitui decidir quais estados o produto reconhece nem testar a resposta real.", checks: ["O schema deixa campos obrigatórios claros.", "Tenho cenários feliz, ausência e erro no Bruno.", "Os testes conferem valores, tipo e status."] },
      { situation: "Um campo não aparece e ninguém sabe se a causa está no DTO, serviço, autorização ou cliente.", outcome: "Uma API .NET fictícia com DTO, validação, logs seguros e investigação documentada de um mapeamento quebrado.", attention: "Não exponha dados por conveniência para ‘fazer aparecer’. Autorização é decidida no servidor e a falha deve fechar o acesso.", checks: ["Separo contrato, serviço e transporte.", "Investigo um campo da origem até a resposta.", "Tenho teste de integração ou contrato para o cenário crítico."] }
    ]
  },
  3: {
    orientation: "Frontend é comportamento, não só aparência. O caminho vai de estrutura semântica a uma interface que explica carregamento, vazio e erro para pessoas reais.",
    firstMove: "Faça uma tela pequena primeiro: uma informação, uma ação e uma leitura confortável no celular.",
    closing: "Ao final, você terá uma interface responsiva conectada a dados fictícios e auditada com teclado, contraste e estados claros.",
    stages: [
      { situation: "A página parece boa no computador, mas fica difícil de usar no celular ou só com teclado.", outcome: "Uma página semântica com foco visível, texto legível e layout sem rolagem horizontal em telas pequenas.", attention: "Não use div para tudo. Elementos semânticos oferecem estrutura, comportamento e acessibilidade antes de qualquer ARIA extra.", checks: ["Navego pela página com Tab e Shift+Tab.", "O conteúdo funciona em tela estreita.", "A hierarquia de títulos faz sentido sem olhar o estilo."] },
      { situation: "A tela depende de uma API e precisa continuar compreensível enquanto os dados chegam ou falham.", outcome: "Uma lista de dados fictícios com estados de carregamento, vazio, sucesso e erro testados separadamente.", attention: "Não esconda erro em um console. A pessoa precisa saber o que ocorreu e o que pode fazer agora.", checks: ["Cada estado tem mensagem e ação coerentes.", "Não assumo que todos os campos existem.", "O componente não faz mais de uma responsabilidade principal."] },
      { situation: "O fluxo funciona, mas uma pessoa que não usa mouse encontra barreiras ou feedback insuficiente.", outcome: "Uma pequena auditoria com correções de teclado, contraste, rótulos e desempenho básico.", attention: "Acessibilidade não é uma etapa final. Testar cedo evita remendos e revela problemas de interação.", checks: ["Completo o fluxo apenas pelo teclado.", "Controles têm nome compreensível.", "Registrei ao menos três melhorias e o motivo de cada uma."] }
    ]
  },
  4: {
    orientation: "Dados começam com perguntas confiáveis. Antes de um modelo, você precisa saber de onde os dados vieram, o que significam e quais limites carregam.",
    firstMove: "Use uma base pública ou fictícia e escreva três perguntas que podem ser respondidas sem inventar colunas ou causalidade.",
    closing: "Ao final, você terá uma análise reproduzível e uma comparação de modelos que comunica resultado, limite e risco de interpretação.",
    stages: [
      { situation: "Uma planilha tem números, mas ninguém consegue provar como chegou a uma conclusão.", outcome: "Consultas SQL que respondem perguntas específicas e deixam explícitos filtro, relação e origem da informação.", attention: "JOIN errado pode multiplicar linhas sem parecer erro. Compare contagens antes e depois de combinar tabelas.", checks: ["Sei qual tabela responde cada parte da pergunta.", "Consigo explicar um JOIN usado.", "Valido contagem e exemplos da consulta."] },
      { situation: "Uma análise parece convincente, mas mistura ausência de dados, valores extremos e conclusões fortes demais.", outcome: "Um notebook ou relatório curto com hipótese, limpeza registrada, visualização e limitações.", attention: "Correlação não demonstra causa. Diga o que os dados mostram e também o que eles não permitem concluir.", checks: ["Registro como tratei dados ausentes.", "Uso uma métrica coerente com a pergunta.", "Indico pelo menos uma limitação da análise."] },
      { situation: "Um modelo mostra uma métrica boa, mas pode não generalizar para dados novos.", outcome: "Baseline e modelo comparados com conjunto de teste separado, métrica explicada e decisão documentada.", attention: "Nunca avalie usando os mesmos dados que ensinaram o modelo; isso mede memória, não capacidade de generalizar.", checks: ["Tenho baseline antes do modelo complexo.", "Separo treino e teste.", "Explico por que escolhi a métrica."] }
    ]
  },
  5: {
    orientation: "Um agente confiável sabe seus limites. Aqui, prompts, rotas, fontes e tools viram contratos testáveis — não uma conversa que ‘parece funcionar’.",
    firstMove: "Desenhe uma pergunta fictícia que o sistema pode responder, quais dados precisa e quando deve parar sem responder.",
    closing: "Ao final, você terá um fluxo de agente com fontes e tools controladas, testes de colisão e evidência de falhas seguras.",
    stages: [
      { situation: "O modelo responde com segurança algo que não está na fonte ou que deveria consultar uma ferramenta.", outcome: "Um fluxo de resposta que distingue contexto fornecido, recuperação de fonte, tool e resposta fora de escopo.", attention: "RAG não torna a resposta automaticamente correta. Fonte, recorte, ausência e conflito precisam aparecer no comportamento.", checks: ["Digo quando usar RAG e quando usar tool.", "Tenho um caso de ‘não sei’ aceitável.", "A fonte pode ser mostrada ou rastreada."] },
      { situation: "Duas intenções parecidas caem no agente errado por keyword ou por semântica ambígua.", outcome: "Contrato APP → ROUTER → AGENT → TOOL, com entradas, handoffs, estados e casos de regressão.", attention: "Não corrija uma colisão só adicionando palavras-chave. Defina precedência, intenção e exemplos negativos.", checks: ["Cada rota tem responsabilidade clara.", "Tenho casos parecidos que não podem colidir.", "O handoff preserva só o contexto necessário."] },
      { situation: "Uma tool ou Skill recebe uma instrução maliciosa dentro de um documento e tenta ampliar seu próprio acesso.", outcome: "Uma Skill ou servidor MCP fictício, read-only, com allowlist, entradas limitadas e logs sem conteúdo sensível.", attention: "Instruções vindas de dados são dados, não autoridade. Permissões e identidade não podem ser decididas pelo modelo.", checks: ["Tools permitidas estão em allowlist.", "A operação falha fechada se faltar autorização.", "Testei prompt injection e tentativa de ampliar escopo."] }
    ]
  },
  6: {
    orientation: "Qualidade de engenharia aparece no caminho até a produção: mudança pequena, revisão, validação automática e diagnóstico sem expor o que não deveria.",
    firstMove: "Escolha um projeto pequeno e trate a próxima mudança como se outra pessoa precisasse revisar e operar depois.",
    closing: "Ao final, você terá um serviço fictício versionado, testado, automatizado e observável com controles básicos de segurança.",
    stages: [
      { situation: "Uma alteração simples chega sem contexto e ninguém sabe como validá-la ou desfazê-la.", outcome: "Uma branch curta, commits compreensíveis e Pull Request com motivo, impacto e passos de verificação.", attention: "PR não é apenas aprovação. É o registro de como a mudança foi pensada, validada e acompanhada.", checks: ["Meu commit descreve a mudança.", "O PR explica como testar.", "Evito misturar correções sem relação."] },
      { situation: "O código funciona na máquina local e quebra no pipeline ou em outro ambiente.", outcome: "Uma execução automatizada com teste e container, configurada por ambiente sem segredos no repositório.", attention: "Containerizar não corrige dependências ocultas sozinho. Execute o mesmo comando do pipeline localmente quando possível.", checks: ["O teste falha quando quebro um comportamento esperado.", "O build é reproduzível.", "Configuração não contém chave ou senha real."] },
      { situation: "O serviço falha e o log é insuficiente — ou pior, contém dados que não deveriam ter sido registrados.", outcome: "Logs estruturados de um erro fictício, correlação de requisição e uma revisão de permissões e segredos.", attention: "Telemetria útil identifica a operação e o erro; ela não precisa guardar conteúdo sensível para isso.", checks: ["Consigo acompanhar uma falha por um identificador seguro.", "Logs não exibem tokens nem dados pessoais.", "Acesso mínimo foi aplicado a uma operação crítica."] }
    ]
  },
  7: {
    orientation: "A internet tem muitos links. Este módulo ensina a escolher fontes que merecem tempo, aprender com comunidades e mostrar trabalho com contexto.",
    firstMove: "Escolha um repositório que você usaria de verdade e avalie sua manutenção antes de seguir um tutorial ou instalar algo.",
    closing: "Ao final, você terá um repositório próprio legível, uma contribuição pequena ou melhoria documentada e critérios para escolher recursos futuros.",
    stages: [
      { situation: "Um repositório promete ensinar muito, mas está abandonado, sem licença ou não explica como começar.", outcome: "Uma ficha de avaliação de repositório: propósito, manutenção, licença, exemplo executável e limites.", attention: "Estrelas não são garantia de qualidade ou segurança. Leia README, releases, issues e licença.", checks: ["Encontro a licença e a última atividade.", "Sei executar ou reproduzir o exemplo mínimo.", "Consigo explicar por que a fonte serve ao meu objetivo."] },
      { situation: "Você quer contribuir, mas não sabe por onde entrar em um projeto aberto.", outcome: "Uma contribuição pequena: reprodução de bug, melhoria de documentação ou ajuste de exemplo, com contexto suficiente para revisão.", attention: "Não comece por refatoração ampla. Uma mudança pequena e bem explicada é mais útil e revisável.", checks: ["Li as regras de contribuição.", "Consigo reproduzir o problema antes de mudar.", "Minha mudança tem uma verificação objetiva."] },
      { situation: "Você concluiu cursos, mas seu perfil não mostra o que sabe fazer.", outcome: "Um projeto ou repositório com README que apresenta objetivo, como executar, decisões, testes e próximos passos.", attention: "Certificado complementa evidência; ele não substitui uma entrega que alguém consegue inspecionar.", checks: ["README permite começar sem conversar comigo.", "Incluí imagens ou exemplos somente quando ajudam.", "A entrega mostra problema, solução e limite."] }
    ]
  },
  8: {
    orientation: "Inglês técnico evolui quando entra no trabalho: ler uma documentação, confirmar entendimento, escrever uma atualização e explicar uma decisão.",
    firstMove: "Escolha uma página curta de documentação em inglês e leia pela pergunta que quer responder, não palavra por palavra.",
    closing: "Ao final, você terá uma rotina que transforma tarefas reais em leitura, escrita, escuta e fala — com progresso observável.",
    stages: [
      { situation: "Você entende palavras isoladas, mas trava ao abrir uma documentação completa.", outcome: "Um resumo em português de uma página curta, com termos técnicos que você verificou pelo contexto.", attention: "Não traduza tudo. Primeiro encontre objetivo, pré-requisito, exemplo e resultado esperado.", checks: ["Identifico a ideia central do texto.", "Marco termos que são essenciais, não todos os desconhecidos.", "Consigo explicar o exemplo com minhas palavras."] },
      { situation: "Você assistiu a uma explicação e não consegue formular uma dúvida ou atualização por escrito.", outcome: "Um resumo técnico curto e uma pergunta objetiva sobre uma aula, issue ou documentação.", attention: "Escrita clara vale mais que frase sofisticada. Diga contexto, o que tentou e o que espera entender.", checks: ["Escrevo uma frase curta de contexto.", "Faço uma pergunta verificável.", "Reviso verbo, termo técnico e clareza antes de enviar."] },
      { situation: "Você precisa explicar uma decisão técnica em reunião, demonstração ou handoff.", outcome: "Um áudio de dois minutos sobre um projeto fictício com contexto, decisão, evidência e próximo passo.", attention: "Não espere ‘falar perfeito’ para começar. Grave, escute um ponto a melhorar e grave de novo.", checks: ["Explico o problema antes da solução.", "Uso vocabulário técnico que entendo.", "Termino com uma decisão ou próxima ação clara."] }
    ]
  }
};
