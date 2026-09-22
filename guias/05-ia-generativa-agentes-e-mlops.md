# 05 — IA generativa, RAG, tools e agentes

[← Voltar ao início](../README.md)

Este guia apresenta IA como engenharia de produto, não como uma coleção de prompts. O objetivo é entender o suficiente para escolher a solução mais simples, medir qualidade e usar automação com segurança.

## O mapa da área

- **Inteligência artificial (IA):** campo amplo de sistemas que executam tarefas associadas à inteligência humana.
- **Machine learning (ML):** modelos aprendem padrões a partir de dados para prever, classificar ou decidir.
- **Deep learning:** ML baseado em redes neurais profundas; sustenta grande parte da visão computacional, áudio e modelos generativos modernos.
- **IA generativa:** produz texto, código, imagem, áudio ou vídeo a partir do contexto recebido.
- **Modelo de linguagem grande (LLM):** prevê unidades de texto, chamadas *tokens*, condicionado pelo contexto anterior.
- **Embedding:** representação vetorial usada para comparar significado, recuperar conteúdo e agrupar itens.
- **RAG:** recupera fontes externas relevantes e as entrega ao modelo antes da resposta.
- **Tool:** função ou serviço que o modelo pode solicitar para consultar dados ou executar uma ação.
- **Agente:** sistema no qual um modelo escolhe passos e ferramentas, observa os resultados e continua até concluir, parar ou pedir ajuda.

Um LLM não é um banco de dados nem uma fonte garantida de verdade. A saída é probabilística e pode parecer convincente mesmo quando está errada.

## Como uma aplicação de IA funciona

Uma aplicação moderna costuma combinar estas camadas:

1. **entrada:** texto, imagem, áudio, arquivos ou eventos;
2. **instruções e contexto:** objetivo, regras, exemplos e dados necessários;
3. **modelo:** transforma a entrada e o contexto em uma resposta ou decisão;
4. **recuperação:** pesquisa documentos, bancos ou APIs para fundamentar a resposta;
5. **ferramentas:** executam funções com parâmetros estruturados;
6. **orquestração:** controla estado, tentativas, limites e sequência de passos;
7. **guardrails:** validam entrada, saída, permissões e ações sensíveis;
8. **avaliação e observabilidade:** medem qualidade, custo, latência, segurança e falhas.

Modelos são treinados previamente em grandes conjuntos de dados. Durante a **inferência**, recebem o contexto disponível e geram uma saída. RAG acrescenta conhecimento consultável; fine-tuning altera o comportamento aprendido. Comece com instruções, exemplos e avaliações, depois use RAG. Considere fine-tuning apenas quando houver dados e uma métrica que justifiquem o investimento.

## Maneiras úteis de usar IA

| Uso | Bom ponto de partida | Verificação necessária |
| --- | --- | --- |
| Aprendizado | Explicações, perguntas, mapas mentais e exercícios personalizados | Compare com documentação e resolva sem ajuda depois |
| Programação | Explorar uma base, gerar testes, explicar erros e propor refatorações | Execute testes, revise diffs e verifique segurança |
| Pesquisa | Descobrir termos, resumir fontes e comparar alternativas | Exija fontes, abra os documentos e confira datas |
| Documentos | Classificar, extrair campos, resumir e adaptar linguagem | Valide amostras, números e informações sensíveis |
| Dados | Gerar consultas, analisar tabelas e criar hipóteses | Confira esquema, cálculos, viés e proveniência |
| Atendimento | Buscar políticas e sugerir respostas | Limite escopo e escale exceções para humanos |
| Acessibilidade | Legendas, transcrição, descrição e simplificação textual | Revise nomes, termos técnicos e contexto cultural |
| Automação | Encadear APIs e executar tarefas repetitivas | Use menor privilégio, aprovações e trilha de auditoria |
| Conteúdo multimodal | Criar rascunhos de texto, imagem, áudio ou vídeo | Confira direitos, identidade, consentimento e rotulagem |

### Benefícios reais

- interface em linguagem natural para sistemas complexos;
- redução do tempo gasto em rascunhos, busca e tarefas repetitivas;
- extração e classificação de informação não estruturada;
- personalização em escala;
- prototipagem rápida de produtos e automações;
- apoio à acessibilidade e tradução;
- disponibilidade contínua quando o risco permite automação.

O benefício deve ser medido contra um baseline. Inclua tempo humano economizado, taxa de sucesso, retrabalho, custo por tarefa, latência e impacto dos erros.

## Escada de complexidade

Suba um degrau apenas quando o anterior não resolver o problema:

1. busca tradicional, regras ou automação determinística;
2. uma chamada ao modelo com instruções claras;
3. saída estruturada validada por esquema;
4. recuperação de documentos com RAG;
5. uma ferramenta bem definida;
6. workflow com etapas fixas e checkpoints;
7. agente com autonomia limitada;
8. múltiplos agentes somente quando a especialização trouxer ganho medido.

Workflows são mais previsíveis. Agentes são úteis quando o caminho não pode ser definido antecipadamente, mas normalmente aumentam custo, latência e superfície de risco.

## Prompts que ajudam de verdade

Um bom pedido informa:

- objetivo e público;
- contexto confiável;
- restrições e critérios de sucesso;
- formato de saída;
- exemplos quando o padrão é difícil;
- o que fazer quando faltarem dados;
- quais ações exigem confirmação humana.

Evite depender de uma frase “mágica”. Versione instruções, teste casos representativos e compare alterações com avaliações repetíveis.

## RAG e busca semântica

RAG é apropriado quando a resposta depende de documentos privados, extensos ou atualizados. Um pipeline típico:

1. coleta e preserva a fonte e seus metadados;
2. limpa e divide o conteúdo em trechos coerentes;
3. cria embeddings e um índice pesquisável;
4. recupera os trechos mais relevantes para a pergunta;
5. monta o contexto com instruções contra invenções;
6. gera a resposta com citações rastreáveis;
7. mede recuperação, fundamentação e qualidade da resposta.

RAG não corrige documento ruim, permissão incorreta ou recuperação fraca. Avalie separadamente se o trecho certo foi encontrado e se o modelo usou esse trecho corretamente.

## Tools: conectando o modelo ao mundo

Uma tool deve ter nome, descrição, parâmetros tipados, validação, autorização e resultado claro. Exemplos:

- consultar clima, catálogo, estoque ou agenda;
- pesquisar arquivos e bases internas;
- executar código em ambiente isolado;
- criar ticket ou atualizar um registro;
- enviar uma mensagem, somente com confirmação adequada;
- chamar outro serviço por API.

### Function calling e MCP

- **Function calling:** o modelo produz uma solicitação estruturada; sua aplicação valida, executa a função e devolve o resultado.
- **Model Context Protocol (MCP):** padrão aberto para conectar aplicações de IA a tools, resources e prompts oferecidos por servidores.

O modelo não deve receber credenciais diretamente. A aplicação executora mantém os segredos, aplica autorização e decide se a ação é permitida.

## Criando um agente

Um agente mínimo combina:

- **modelo:** interpreta a tarefa e decide o próximo passo;
- **instruções:** objetivo, limites, política de parada e critérios de conclusão;
- **tools:** poucas funções, bem descritas e com retorno observável;
- **estado:** histórico necessário para continuar a tarefa;
- **loop:** planejar ou escolher, agir, observar e repetir;
- **guardrails:** validação, permissões, orçamento e aprovações;
- **tracing e evals:** registro de decisões e medição de resultados.

### Passo a passo recomendado

1. Escreva cinco a vinte tarefas reais e o resultado esperado.
2. Resolva primeiro com uma chamada simples ou workflow fixo.
3. Adicione uma tool de leitura e valide seus argumentos.
4. Crie limites de passos, tempo, tokens e custo.
5. Exija aprovação para escrita, compra, envio ou exclusão.
6. Registre chamadas de ferramentas sem gravar segredos.
7. Rode casos normais, ambíguos, adversariais e de falha parcial.
8. Só então permita mais autonomia ou novas ferramentas.

### Padrões comuns

| Padrão | Quando usar | Principal cuidado |
| --- | --- | --- |
| Roteamento | Escolher modelo, fluxo ou especialista conforme a entrada | Classificação incorreta e rotas sem fallback |
| Encadeamento | Tarefa previsível dividida em etapas | Erros propagados entre etapas |
| Paralelização | Subtarefas independentes ou múltiplas opiniões | Custo e reconciliação de resultados |
| Orquestrador e workers | Trabalho variável que pode ser decomposto dinamicamente | Complexidade, duplicação e limites de concorrência |
| Avaliador e otimizador | Critérios claros permitem revisar e melhorar uma saída | Loop sem fim e avaliador pouco confiável |
| Handoff | Transferir controle para especialista ou humano | Contexto perdido e responsabilidade ambígua |
| Multiagente | Especialidades realmente separadas e mensuráveis | Mais custo e falhas de coordenação sem ganho real |

## Avaliações, observabilidade e produção

Monte um conjunto versionado de casos que inclua caminhos felizes, limites, recusas, idiomas, entradas maliciosas e indisponibilidade de ferramentas. Meça:

- sucesso completo da tarefa;
- correção factual e fundamentação nas fontes;
- precisão dos argumentos e resultados de tools;
- violações de política e permissões;
- necessidade de intervenção humana;
- latência por etapa e custo por tarefa;
- estabilidade após trocar modelo, prompt ou índice.

Use tracing para localizar a etapa que falhou. Não publique uma porcentagem agregada sem guardar exemplos e explicar a rubrica usada.

## Segurança e uso responsável

- trate conteúdo externo e retorno de tools como não confiável;
- proteja contra prompt injection e exfiltração de dados;
- aplique menor privilégio, allowlists e separação entre leitura e escrita;
- use sandbox para código e arquivos desconhecidos;
- não envie dados pessoais, segredos ou material confidencial sem base legal e autorização;
- peça confirmação antes de ações financeiras, destrutivas ou que comuniquem em nome de alguém;
- implemente limites de custo, tempo, chamadas e repetição;
- ofereça saída, contestação e revisão humana em decisões relevantes;
- documente fontes, limitações, modelo, versão, dados e incidentes;
- faça threat modeling e testes adversariais antes de produção.

## Cursos e trilhas recomendadas

| Recurso | Finalidade | Nível | Idioma/acesso |
| --- | --- | --- | --- |
| [Elements of AI](https://course.elementsofai.com/pt/) | Conceitos, resolução de problemas, probabilidade, ML, redes neurais e implicações sociais | Iniciante | Português, gratuito 📚 |
| [Google Machine Learning Crash Course](https://developers.google.com/machine-learning/crash-course) | Fundamentos de ML com vídeos, visualizações e exercícios | Iniciante → intermediário | Inglês, gratuito 📚 |
| [CS50's Introduction to AI with Python](https://cs50.harvard.edu/ai/) | Busca, conhecimento, probabilidade, otimização, ML, redes neurais e linguagem | Intermediário; requer Python | Inglês, gratuito; certificado CS50 mediante requisitos 🎓 🌐 |
| [Practical Deep Learning for Coders](https://course.fast.ai/) | Construir modelos de visão, NLP e sistemas práticos de deep learning | Intermediário; requer Python | Inglês, gratuito 📚 🌐 |
| [Hugging Face LLM Course](https://huggingface.co/learn/llm-course/chapter1/1) | Transformers, tokenização, datasets, fine-tuning e publicação de modelos | Intermediário | Inglês, gratuito 📚 🌐 |
| [Generative AI for Beginners](https://github.com/microsoft/generative-ai-for-beginners) | Aplicações generativas, prompt engineering, RAG, agentes e segurança | Iniciante → intermediário | Inglês, gratuito e open source 🧩 🌐 |
| [OpenAI Developer Quickstart](https://developers.openai.com/api/docs/quickstart) | Primeiras aplicações multimodais, busca, tools e agentes via API | Intermediário | Inglês, documentação gratuita; uso da API pode ser pago 📚 🌐 |
| [DeepLearning.AI — Agentic AI](https://www.deeplearning.ai/courses/agentic-ai) | Reflexão, tools, planejamento, multiagente, evals e produção | Intermediário; requer Python | Inglês; acesso e certificado dependem do plano 🌐 |
| [Hugging Face Agents Course](https://huggingface.co/learn/agents-course/unit0/introduction) | Fundamentos, frameworks, agentic RAG, observabilidade e projeto final | Iniciante → intermediário | Inglês, gratuito com certificados por requisitos 🎓 🌐 |
| [Microsoft Learn — AI Engineer](https://learn.microsoft.com/en-us/training/career-paths/ai-engineer) | IA generativa, agentes, linguagem, visão e preparação para credenciais Azure | Iniciante → intermediário | Inglês, treinamento gratuito; provas podem ser pagas 📚 🌐 |
| [Google Cloud — Introduction to Generative AI](https://www.cloudskillsboost.google/paths/118) | LLMs, IA responsável e fundamentos de IA generativa | Iniciante | Inglês, trilha indicada como sem custo; confira badges 🏅 🌐 |
| [IBM SkillsBuild](https://skillsbuild.org/adult-learners/try-it-before-you-register) | Fundamentos de IA e IA generativa com credenciais digitais em trilhas elegíveis | Iniciante | Inclui português em parte do catálogo, gratuito 🏅 |
| [AWS Educate](https://aws.amazon.com/education/awseducate/) | Trilhas gratuitas de cloud e IA, vídeos e laboratórios sem cartão | Iniciante | Inglês, gratuito 📚 🌐 |

## Agentes, tools e frameworks

| Recurso | Finalidade | Nível | Idioma/acesso |
| --- | --- | --- | --- |
| [OpenAI — Agents](https://developers.openai.com/api/docs/guides/agents) | Arquitetura, Agents API, SDK, orquestração, guardrails, tracing e evals | Intermediário | Inglês, documentação gratuita; API pode ser paga 📚 🌐 |
| [OpenAI — Tools](https://developers.openai.com/pt-BR/api/docs/guides/tools) | Function calling, busca, execução de código, MCP e outras ferramentas | Intermediário | Português, documentação gratuita; API pode ser paga 📚 |
| [OpenAI Cookbook](https://developers.openai.com/cookbook) | Exemplos práticos de APIs, embeddings, RAG, evals e agentes | Intermediário | Inglês, gratuito 📚 🌐 |
| [Building Effective AI Agents](https://www.anthropic.com/engineering/building-effective-agents) | Diferença entre workflows e agentes e padrões de composição | Intermediário | Inglês, artigo gratuito 📚 🌐 |
| [Model Context Protocol](https://modelcontextprotocol.io/docs/getting-started/intro) | Conceitos e implementação do padrão para conectar dados e ferramentas | Intermediário | Inglês, documentação gratuita 📚 🌐 |
| [LangGraph Academy](https://academy.langchain.com/) | Agentes com estado, memória, human-in-the-loop e observabilidade | Intermediário | Inglês, cursos gratuitos mediante cadastro 📚 🌐 |
| [LlamaIndex Agents](https://docs.llamaindex.ai/en/stable/module_guides/deploying/agents/) | Agentes orientados a dados, RAG e ferramentas | Intermediário | Inglês, documentação gratuita 📚 🌐 |
| [Microsoft AutoGen](https://microsoft.github.io/autogen/stable/) | Framework e padrões para aplicações agentic e multiagente | Intermediário → avançado | Inglês, open source 🧩 🌐 |
| [Google Agent Development Kit](https://google.github.io/adk-docs/) | Construção, avaliação e implantação de agentes modulares | Intermediário | Inglês, open source 🧩 🌐 |

Frameworks aceleram protótipos, mas não substituem entendimento do loop, das tools e das avaliações. Implemente ao menos um workflow pequeno sem framework antes de comparar abstrações.

## Vídeos e aulas abertas

| Recurso | Finalidade | Nível | Idioma/acesso |
| --- | --- | --- | --- |
| [MIT 6.S191 — Introduction to Deep Learning](https://ocw.mit.edu/courses/6-s191-introduction-to-deep-learning-january-iap-2020/) | Aulas, slides e laboratórios sobre redes neurais e aplicações | Intermediário | Inglês, gratuito 📚 🌐 |
| [Neural Networks — 3Blue1Brown](https://www.3blue1brown.com/topics/neural-networks) | Intuição visual para redes, gradiente e backpropagation | Iniciante | Inglês, vídeos gratuitos 📚 🌐 |
| [Neural Networks: Zero to Hero](https://karpathy.ai/zero-to-hero.html) | Construção de redes e modelos de linguagem do zero | Intermediário; requer Python | Inglês, vídeos e notebooks gratuitos 🧩 🌐 |
| [Full Stack LLM Bootcamp](https://fullstackdeeplearning.com/llm-bootcamp/) | Prompting, augmented language models, LLMOps e produto | Intermediário | Inglês, aulas e materiais gratuitos 📚 🌐 |
| [OpenAI Academy](https://academy.openai.com/) | Conteúdo, eventos e vídeos sobre uso e desenvolvimento com IA | Todos os níveis | Inglês, acesso gratuito mediante cadastro 📚 🌐 |

## Certificados, badges e certificações

Não trate todos como equivalentes:

- **certificado de conclusão:** comprova que requisitos de um curso foram cumpridos;
- **badge:** evidencia uma habilidade ou laboratório específico;
- **certificação profissional:** normalmente exige prova supervisionada e costuma ser paga.

| Credencial | O que valida | Condição de acesso |
| --- | --- | --- |
| [Hugging Face Agents Course](https://huggingface.co/learn/agents-course/unit1/get-your-certificate) | Fundamentos ou conclusão prática de agentes | Certificados gratuitos mediante quiz, atividades e desafio aplicáveis 🎓 |
| [CS50 AI Certificate](https://cs50.harvard.edu/ai/certificate/) | Conclusão dos projetos de IA com Python | Certificado CS50 gratuito; versão verificada da edX é separada 🎓 |
| [IBM SkillsBuild](https://www.ibm.com/academic/) | Fundamentos e trilhas técnicas de IA elegíveis | Cursos gratuitos com credenciais digitais em atividades elegíveis 🏅 |
| [Google Cloud Skills Boost](https://www.cloudskillsboost.google/paths) | Trilhas e laboratórios de IA generativa e cloud | Alguns cursos e badges são sem custo; catálogo completo pode exigir créditos ou assinatura 🏅 |
| [Microsoft Credentials — IA](https://learn.microsoft.com/en-us/credentials/browse/?credential_types=certification&subjects=artificial-intelligence) | Fundamentos, desenvolvimento, agentes e funções profissionais | Preparação gratuita; exames de certificação normalmente pagos 🎓 |
| [AWS Certified AI Practitioner](https://aws.amazon.com/certification/certified-ai-practitioner/) | Conceitos e casos de uso de IA, ML e IA generativa na AWS | Conteúdo de preparação parcialmente gratuito; exame pago 🎓 |

Verifique sempre idioma, validade, preço regional, requisitos e política de renovação antes de investir.

## Benefícios e ambientes para praticar

| Benefício | Como ajuda | Condições |
| --- | --- | --- |
| [GitHub Student Developer Pack](https://education.github.com/pack) | GitHub Pro, Copilot Student e ofertas educacionais como DataCamp | Exige verificação estudantil; ofertas e duração mudam |
| [Microsoft Learn Student Hub](https://learn.microsoft.com/en-us/training/student-hub/certifications) | Trilhas, credenciais e descontos elegíveis em exames | Requer perfil e verificação acadêmica para benefícios estudantis |
| [Azure for Students](https://azure.microsoft.com/en-us/free/students/) | Créditos e serviços para experimentar cloud e IA | Elegibilidade e disponibilidade regional |
| [AWS Educate](https://aws.amazon.com/education/awseducate/) | Laboratórios gratuitos sem cartão de crédito | Limites definidos pela plataforma |
| [Google Colab](https://colab.research.google.com/) | Notebooks hospedados para Python e experimentos | Plano gratuito com recursos e disponibilidade variáveis |
| [Kaggle Notebooks](https://www.kaggle.com/code) | Notebooks, datasets e aceleradores para projetos de dados e ML | Conta gratuita; cotas variam |
| [Hugging Face Spaces](https://huggingface.co/docs/hub/spaces-overview) | Publicar demos e portfólio de IA | Opções gratuitas limitadas; compute avançado pode ser pago |
| [Ollama](https://docs.ollama.com/) | Executar modelos compatíveis localmente para estudo e protótipos | Gratuito e local; exige hardware adequado ao modelo |

Ative alertas de orçamento, nunca publique chaves e desligue recursos pagos após o laboratório.

## Projetos para portfólio

### 1. Assistente de documentos com RAG

- ingestão de documentos com metadados e permissões;
- busca híbrida ou semântica;
- resposta com citação do trecho usado;
- avaliação de recuperação e fundamentação;
- aviso quando não houver evidência suficiente.

### 2. Agente com uma tool segura

- uma tool de leitura com esquema tipado;
- validação de argumentos e tratamento de erros;
- limite de passos e custo;
- traces e conjunto de testes;
- aprovação humana antes de qualquer escrita.

### 3. Triagem com handoff

- classifique solicitações por categoria e risco;
- encaminhe casos previsíveis para workflows específicos;
- envie ambiguidades e exceções a uma pessoa;
- acompanhe precisão, retrabalho e tempo até resolução.

### Checklist de entrega

- problema, público e baseline documentados;
- conjunto de avaliação versionado;
- fontes e permissões rastreáveis;
- riscos, limitações e política de retenção descritos;
- custo e latência medidos;
- logs sem segredos ou dados pessoais indevidos;
- demonstração reproduzível e README com arquitetura;
- mecanismo claro de fallback e revisão humana.

## Ordem recomendada

1. Faça Elements of AI ou o módulo introdutório do Google.
2. Estude Python, dados e ML no [guia anterior](04-bancos-dados-e-ia.md).
3. Aprenda prompting, saída estruturada e uma API de modelo.
4. Construa um RAG pequeno com citações e avaliações.
5. Conecte uma tool de leitura.
6. Crie um workflow com estado e human-in-the-loop.
7. Transforme-o em agente somente se a autonomia trouxer ganho mensurável.
8. Estude segurança, tracing, custo e operação antes de produção.

O portfólio deve mostrar decisões e evidências: por que IA foi usada, qual alternativa simples foi comparada, como a qualidade foi medida e o que acontece quando o sistema falha.
