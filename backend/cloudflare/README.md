# Anotações compartilhadas em Workers + D1

Migração concluída em 26/10/2026 (São Paulo). O site publicado no GitHub Pages usa o backend Cloudflare. Não recriar os recursos nem repetir a transferência.

| Recurso | Produção |
| --- | --- |
| Worker | https://curva-aberta-notes.henrique-2013ale.workers.dev |
| API | https://curva-aberta-notes.henrique-2013ale.workers.dev/rest/v1/shared_study_notes |
| D1 | `curva-aberta-notes` |
| UUID | `7f022186-4c83-4512-846b-f10120047eb5` |
| Binding | `DB` |
| Saúde | `/health`: `ready: true`, `writesEnabled: true` |
| Frontend | `site/src/notes-config.json`, provider `cloudflare`, sem chave |
| GitHub conectado | `main`, raiz `backend/cloudflare`, build `npm test`, deploy `npx wrangler deploy` |

Os 59 blocos foram importados e comparados exatamente com a exportação final: conteúdo, revisão e timestamp. Conferência após os testes: 59 blocos, um preenchido, 19.085 caracteres, revisão máxima 53. O Supabase foi preservado com leitura pública e UPDATE de `content` revogado de `anon`, evitando dois bancos recebendo edições.

A homologação no D1 remoto passou para leitura/edição/exclusão sem login, dois clientes, conflito simultâneo, 50.000 emojis aceitos, 50.001 rejeitados e CORS. As fixtures foram restauradas condicionalmente, incluindo revisão e timestamp. No site publicado, duas abas confirmaram publicação, conflito com rascunho preservado e exclusão compartilhada; a fixture também foi removida e seus metadados restaurados.

Tipos, testes e build do site passaram no GitHub Actions, com deploy Pages do commit `3b2516304363cefd312fa0e9ecfb071e5a6befd5`. Scripts temporários não permanecem no comando de deploy. Exportações ficaram somente no ambiente efêmero do build e a cópia da homologação foi apagada após a conferência. Nenhum texto de nota ou credencial foi adicionado ao Git ou impresso pelos scripts.

Veja commits, builds e pendências em [CONTINUIDADE.md](../../CONTINUIDADE.md). Abas com o frontend antigo precisam ser recarregadas; o banco antigo permanece sem gravações. Não religar a origem como rollback após novas edições no D1 sem congelar o destino e sincronizar os dados de volta.

## Contrato preservado

59 blocos fixos, acesso público sem login, 50.000 pontos de código Unicode, edição e apagamento explícitos, revisão condicional e intervalo de três segundos por bloco. A API não cria escopos, não expõe SQL e não grava histórico/autoria. `PATCH content: ""` apaga o texto mantendo a revisão. O serviço pode manter backups operacionais (D1 Time Travel); ausência de histórico na aplicação não significa eliminação imediata de backups.

O Worker de produção está com escritas habilitadas. Para uma nova migração, definir explicitamente `WRITES_ENABLED: "false"` antes de publicar o destino. SQL parametrizado, limite de corpo com leitura em streaming, validação de Unicode e erro genérico sem conteúdo nos logs. CORS aceita a origem GitHub Pages existente; CORS não é autenticação nem moderação. A configuração desativa observabilidade do Worker. O cooldown continua sendo por bloco, sem identificação de visitantes.

## Validação local

Node 24. Em `backend/cloudflare/`:

```sh
npm ci
npm test
npm run db:local
npm run dev -- --local --port 8787 --var WRITES_ENABLED:true
```

Testes usam SQLite real para conferir SQL, 50.000 emojis, limite excedido, Unicode inválido, conflitos concorrentes, cooldown, exclusão, escopos e manutenção. `wrangler deploy --dry-run` valida o empacotamento; não publica nada. O teste local não equivale à homologação do D1 remoto.

## Referência para uma futura transferência

Este procedimento já foi concluído nesta conta. Não executá-lo novamente na produção ativa. Para uma transferência futura, primeiro preparar um destino sem gravações e revisar os identificadores.

1. Autenticar a conta permanente com `npx wrangler login`. Não usar conta temporária para armazenar anotações. Não enviar tokens pelo chat nem adicioná-los ao repositório.
2. Reutilizar o D1 e o Worker identificados acima. Não executar `d1 create` nesta instalação. O `database_id` correto já consta em `wrangler.jsonc`. Manter `WRITES_ENABLED: "false"`.
3. A estrutura inicial já foi aplicada neste D1; não repetir a criação da tabela. Publicar o backend pelo build GitHub conectado ou `npm run deploy`. Guardar a URL efetivamente retornada pelo deploy. `/health` deve responder `ready: true`, `writesEnabled: false`.
4. Somente quando o destino estiver validado, congelar as gravações do Supabase pelo administrador: `revoke update(content) on public.shared_study_notes from anon;`. O site antigo ainda lê; edições não publicadas devem ser copiadas pelo visitante. Não congelar antes de obter acesso ao destino.
5. `node transfer.mjs export`. Exporta todas as notas para `migration-data/notes.json`, diretório ignorado pelo Git. Conferir 59 blocos. Isso deve acontecer novamente após congelar a origem, mesmo que exista uma cópia anterior de preparação.
6. Definir no ambiente `CLOUDFLARE_ACCOUNT_ID`, `CLOUDFLARE_DATABASE_ID` e um `CLOUDFLARE_API_TOKEN` autorizado para D1. Usar o mecanismo seguro do ambiente, sem gravar o token em arquivo versionado. Executar `node transfer.mjs import <URL_WORKER>/rest/v1/shared_study_notes --source-frozen`. Transfere com parâmetros pela API D1, sem embutir textos longos no SQL. Só altera linhas ainda vazias na base nova; uma transferência interrompida pode ser retomada se as linhas já importadas coincidirem integralmente.
7. `node transfer.mjs verify <URL_WORKER>/rest/v1/shared_study_notes`. Compara conteúdo, revisão e timestamp de cada um dos 59 blocos. Não imprime notas.
8. Habilitar `WRITES_ENABLED: "true"` no Worker e publicar novamente. `node transfer.mjs activate <URL_WORKER>/rest/v1/shared_study_notes` verifica conteúdo e `/health` antes de trocar a configuração local do frontend.
9. Executar tipos/testes/build do site; publicar a configuração no GitHub Pages. Homologar no navegador dois visitantes lendo o mesmo bloco, publicação, conflito e apagamento de uma fixture descartável sem tocar notas reais. Confirmar o limite e CORS no D1 remoto. Atualizar `CONTINUIDADE.md` com a URL, commits e resultados. Apagar a cópia temporária de migração após a conferência.

Manter a origem sem gravações durante a troca e enquanto houver clientes antigos. Se for preciso abortar antes de liberar escritas no destino, restaurar a origem com `grant update(content) on public.shared_study_notes to anon;` e manter o frontend Supabase. Depois de aceitar novas notas no D1, reverter exige congelar o destino e copiar essas alterações de volta; simplesmente religar o banco antigo perderia conteúdo.

## Limites operacionais

Workers Free: 100.000 requisições/dia. D1 Free: 5 milhões de linhas lidas/dia, 100.000 escritas/dia e 500 MB por banco. Leituras periódicas e preflights também consomem recursos; não é promessa de serviço ilimitado. A API não exige domínio próprio, e o site permanece no GitHub Pages.

Referências oficiais consultadas: [D1 preparado](https://developers.cloudflare.com/d1/worker-api/prepared-statements/), [D1 limites](https://developers.cloudflare.com/d1/platform/limits/), [D1 preço](https://developers.cloudflare.com/d1/platform/pricing/), [Workers limites](https://developers.cloudflare.com/workers/platform/limits/).
