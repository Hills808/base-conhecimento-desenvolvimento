# 06 — Cloud, DevOps, qualidade e segurança

[← Voltar ao início](../README.md)

## Git e colaboração

- [Learn Git Branching](https://learngitbranching.js.org/?locale=pt_BR) — Git interativo. 📚
- [GitHub Skills](https://github.com/skills) — exercícios práticos executados em repositórios. 🏅 🌐
- [Oh My Git!](https://ohmygit.org/) — Git em formato de jogo. 📚 🌐
- [Pro Git](https://git-scm.com/book/pt-br/v2) — livro oficial e gratuito. 📚
- [Conventional Commits](https://www.conventionalcommits.org/pt-br/v1.0.0/) — convenção de mensagens de commit. 📚

## Containers, CI/CD e cloud

- [Docker — Get Started](https://docs.docker.com/get-started/) — fundamentos oficiais de containers. 📚 🌐
- [Play with Docker](https://labs.play-with-docker.com/) — laboratório temporário no navegador. 📚 🌐
- [GitHub Actions Skills](https://github.com/skills/hello-github-actions) — introdução prática a CI/CD. 🏅 🌐
- [GitHub Actions Quickstart](https://docs.github.com/en/actions/get-started/quickstart) — fluxo mínimo oficial. 📚 🌐
- [Microsoft Learn Azure](https://learn.microsoft.com/pt-br/training/azure/) — trilhas oficiais de Azure. 📚
- [Free for Dev](https://github.com/ripienaar/free-for-dev) — catálogo comunitário de serviços com planos gratuitos; confirme as condições. 🧩 🌐

### Infraestrutura e orquestração

| Recurso | Finalidade | Nível | Idioma/acesso |
| --- | --- | --- | --- |
| [Kubernetes Basics](https://kubernetes.io/docs/tutorials/kubernetes-basics/) | Deploy, exposição, escala, atualização e depuração de aplicações em cluster | Intermediário | Inglês, gratuito 📚 |
| [Terraform Tutorials](https://developer.hashicorp.com/terraform/tutorials) | Infraestrutura como código em cloud, Docker e outros provedores | Iniciante → avançado | Inglês, tutoriais gratuitos 📚 |
| [CNCF Landscape](https://landscape.cncf.io/) | Mapa do ecossistema cloud native; use para referência, não como checklist de estudo | Intermediário | Inglês, gratuito 📚 |

Aprenda Docker, redes, DNS, TLS, processos e CI antes de Kubernetes. Use infraestrutura como código quando houver infraestrutura real para reproduzir.

## Testes e qualidade

- [Testing in .NET](https://learn.microsoft.com/en-us/dotnet/core/testing/) — testes unitários, integração, carga e plataformas de teste .NET. 📚 🌐
- [Testcontainers for .NET](https://github.com/testcontainers/testcontainers-dotnet) — dependências reais e descartáveis em testes de integração. 🧩 🌐
- [Testing JavaScript](https://www.testingjavascript.com/) — conteúdo introdutório gratuito e material complementar pago. 📚 🌐
- [Grafana k6](https://grafana.com/docs/k6/latest/) — testes de carga, stress, spike e desempenho automatizado. 📚 🌐

Uma suíte saudável combina testes rápidos de unidade, integração nos limites importantes, poucos testes ponta a ponta e testes de desempenho baseados em metas.

## Observabilidade

| Recurso | Finalidade | Nível | Idioma/acesso |
| --- | --- | --- | --- |
| [OpenTelemetry — Getting Started](https://opentelemetry.io/docs/getting-started/) | Instrumentação padronizada de logs, métricas e traces | Intermediário | Inglês, gratuito 📚 |
| [Prometheus — Getting Started](https://prometheus.io/docs/tutorials/getting_started/) | Coleta de métricas e consultas com PromQL | Intermediário | Inglês, gratuito 📚 |
| [Grafana Tutorials](https://grafana.com/tutorials/) | Dashboards, alertas e investigação de telemetria | Iniciante → intermediário | Inglês, parte dos tutoriais usa Grafana Cloud 📚 |
| [Sentry](https://sentry.io/welcome/) | Rastreamento de erros e desempenho; verifique os limites do plano gratuito | Iniciante | Inglês, freemium 📚 |

Instrumente primeiro um fluxo crítico. Use correlação de logs, métricas com significado de negócio e traces apenas onde ajudam a responder perguntas reais.

## Segurança de aplicações

- [OWASP Top 10](https://owasp.org/projects/top-ten) — conscientização sobre riscos frequentes em aplicações web. 📚 🌐
- [OWASP Cheat Sheet Series](https://cheatsheetseries.owasp.org/) — orientação prática de implementação. 📚 🌐
- [OWASP ASVS](https://owasp.org/projects/asvs) — requisitos verificáveis para controles técnicos de segurança. 📚 🌐
- [OWASP Juice Shop](https://owasp.org/projects/juice-shop) — aplicação intencionalmente vulnerável para treinamento legal e controlado. 🧩 🌐
- [PortSwigger Web Security Academy](https://portswigger.net/web-security) — laboratórios gratuitos de segurança web. 📚 🌐
- [OverTheWire](https://overthewire.org/wargames/) — desafios de Linux e segurança. 📚 🌐
- [TryHackMe](https://tryhackme.com/) — possui salas gratuitas e planos pagos; pratique apenas em ambientes autorizados. 📚 🌐
- [Cisco Networking Academy](https://www.netacad.com/) — redes e cibersegurança; badges dependem da trilha. 🏅 🌐
- [Awesome Hacking](https://github.com/Hack-with-Github/Awesome-Hacking) — coleção extensa; avalie cada recurso antes de usar. 🧩 🌐

### Regras éticas

- pratique somente em sistemas próprios, laboratórios ou alvos com autorização explícita;
- nunca use credenciais ou dados reais em ambientes de estudo;
- trate segurança como parte do desenvolvimento, não como etapa final;
- registre dependências, ameaças, controles, testes e processo de atualização.

## Projeto sugerido

Evolua um serviço containerizado com:

- pipeline de build, testes e análise de Markdown/código;
- ambiente reproduzível;
- deploy automatizado com rollback documentado;
- logs estruturados, métricas, trace e alertas;
- teste de carga com critérios de aprovação;
- threat model curto e checklist ASVS proporcional ao risco;
- varredura de dependências e proteção contra segredos no repositório.
