# Anotações compartilhadas

Supabase: projeto Curva Aberta, ref `mfpfqzduzywmfmekbiho`, região São Paulo.
Um bloco público por etapa: 45 níveis de módulos e 14 oficinas. Sem cadastro, autoria ou histórico de conteúdo na aplicação. Apagar substitui o conteúdo por texto vazio; o contador de revisão continua para evitar conflitos. O provedor pode manter backups/logs operacionais conforme sua política: não é promessa de apagamento físico imediato.

`shared-notes.sql` registra a migration aplicada via conector. RLS habilitada. `anon` pode ler e alterar somente `content`; não pode inserir, excluir linhas ou mudar escopos/revisões. Trigger exige a revisão esperada e limita cada bloco a uma gravação a cada três segundos. Constraint limita texto a 50.000 pontos de código Unicode. Não há chave secreta no frontend: somente chave publicável.

O usuário autorizou edição e apagamento públicos. Qualquer pessoa pode vandalizar o texto. Cooldown por bloco limita frequência, não identifica pessoas e não substitui moderação/CAPTCHA. Nenhum dado da XP deve ser publicado.

Não há autosave público: publicar é explícito. Leitura atualiza a cada 20s com bloco aberto, aba visível e fora da edição. Falha/conflito preserva o editor; compare a versão atual antes de publicar. Ao sair da etapa, copie um rascunho não publicado. Notas públicas não são cacheadas pelo service worker nem exportadas no backup pessoal.

Testes locais: `cd site && npm test`. Teste remoto opt-in: `CURVA_TEST_SHARED_NOTES=1 node scripts/test-shared-notes.mjs` exige o bloco inicial vazio; cria somente fixture de 50.000 caracteres e limpa com revisão condicional, sem sobrescrever alterações de terceiros.
