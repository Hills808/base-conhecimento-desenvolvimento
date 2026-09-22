# 04 — Bancos de dados, dados e machine learning

[← Voltar ao início](../README.md)

## Bancos de dados

### SQL e modelagem

- [SQLBolt](https://sqlbolt.com/) — SQL interativo para começar. 📚 🌐
- [SQLZoo](https://sqlzoo.net/wiki/SQL_Tutorial) — exercícios de SQL. 📚 🌐
- [PGExercises](https://pgexercises.com/) — desafios com PostgreSQL. 📚 🌐
- [ThoughtSpot SQL Tutorial](https://www.thoughtspot.com/sql-tutorial) — SQL aplicado à análise de dados. 📚 🌐
- [PostgreSQL Tutorial](https://www.postgresql.org/docs/current/tutorial.html) — tutorial oficial do PostgreSQL. 📚 🌐
- [Use The Index, Luke](https://use-the-index-luke.com/) — índices e desempenho de consultas. 📚 🌐
- [Database Design Course](https://www.youtube.com/watch?v=ztHopE5Wnpc) — modelagem e normalização. 📚 🌐
- [Awesome Databases](https://github.com/numetriclabz/awesome-db) — catálogo de bancos e ferramentas. 🧩 🌐

### Ferramentas

- [DBeaver Community](https://dbeaver.io/) — cliente multiplataforma para bancos.
- [DB Fiddle](https://dbfiddle.uk/) — experimente SQL no navegador.
- [SQLite Online](https://sqliteonline.com/) — laboratório rápido para SQLite e outros mecanismos.

### O que praticar

1. modelagem conceitual e normalização;
2. chaves, constraints e integridade referencial;
3. consultas, joins, agregações e funções de janela;
4. índices e planos de execução;
5. transações, isolamento e concorrência;
6. migrações, backup e restauração;
7. escolha consciente entre relacional, documento, chave-valor e outros modelos.

## Dados e machine learning

- [Kaggle Learn](https://www.kaggle.com/learn) — microcursos de Python, dados, ML e visão computacional; confira os comprovantes disponíveis. 🎓 🌐
- [Google Machine Learning Crash Course](https://developers.google.com/machine-learning/crash-course) — fundamentos e exercícios de ML. 📚 🌐
- [Hugging Face Learn](https://huggingface.co/learn) — machine learning, NLP, áudio, visão computacional e modelos generativos. 📚 🌐
- [Microsoft AI for Beginners](https://github.com/microsoft/AI-For-Beginners) — currículo introdutório baseado em projetos. 🧩 🌐
- [Data Engineering Zoomcamp](https://github.com/DataTalksClub/data-engineering-zoomcamp) — engenharia de dados de ponta a ponta. 🧩 🌐

## Aprendizado profundo e MLOps

| Recurso | Finalidade | Nível | Idioma/acesso |
| --- | --- | --- | --- |
| [Practical Deep Learning for Coders](https://course.fast.ai/) | Construção prática de modelos de deep learning | Intermediário; requer Python | Inglês, gratuito 📚 |
| [MLOps Zoomcamp](https://github.com/DataTalksClub/mlops-zoomcamp) | Treinamento, experimentos, deploy, pipelines e monitoramento de modelos | Intermediário | Inglês, gratuito 🧩 |
| [Made With ML](https://madewithml.com/) | Desenvolvimento de produtos de ML com testes, dados e produção | Intermediário → avançado | Inglês, gratuito 📚 |
| [MLflow — Getting Started](https://mlflow.org/docs/latest/ml/getting-started/) | Rastreamento de experimentos, modelos e ciclo de vida de ML | Intermediário | Inglês, documentação gratuita 📚 |

## Uma ordem segura para estudar IA

1. Python, SQL, estatística e manipulação de dados;
2. modelos clássicos e avaliação correta;
3. projeto reproduzível com baseline;
4. deep learning quando o problema justificar;
5. deploy, monitoramento, versionamento e custo;
6. privacidade, vieses, segurança e avaliação contínua.

Não comece pelo framework mais popular. Defina o problema, a métrica, o conjunto de comparação e os riscos antes do modelo.

Para modelos de linguagem, RAG, ferramentas e agentes, continue em [IA generativa, RAG, tools e agentes](05-ia-generativa-agentes-e-mlops.md).

## Projeto sugerido

Construa um pequeno produto de dados:

- pipeline de ingestão e validação;
- análise exploratória versionada;
- baseline simples;
- treino reprodutível e registro de métricas;
- API de inferência ou processamento em lote;
- testes de dados e código;
- monitoramento de qualidade, latência e custo;
- documentação das limitações do modelo.
