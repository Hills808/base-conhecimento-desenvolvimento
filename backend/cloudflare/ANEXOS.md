# Anexos compartilhados — D1

Arquivos PDF, DOCX, MD e TXT de até 5 MiB; até cinco por etapa. Downloads são públicos e forçados como anexo. Gerenciamento exige `ATTACHMENTS_ADMIN_SECRET` forte no Worker. Nunca armazene chaves no Git ou no chat. A verificação de PDF/DOCX é superficial e não é varredura contra malware.

Os arquivos usam o D1 separado `curva-aberta-anexos`, dividido em partes e gravado em lote transacional. O banco `curva-aberta-notes` permanece como fonte das anotações. A prévia usa `curva-aberta-anexos-teste` e `WRITES_ENABLED=false`.

Homologação de 04/11/2026: prévia Cloudflare com D1 real confirmou upload e download de 5 MiB byte a byte, bloqueio acima do limite, cinco slots com requisições simultâneas, bloqueio de chave ausente/incorreta e exclusão sem chave, bloqueio de origem indevida e remoção dos dados de teste. Testes locais usam SQLite real. Ainda é necessária validação da interface e das permissões após a publicação; a chave de gerenciamento definitiva deve ser configurada em segredo antes de disponibilizar a função.

D1 gratuito tem limite de 500 MB por banco e limites diários compartilhados na conta; ao atingir cotas, operações podem falhar. A estrutura SQL inicial é `attachments-schema.sql` e deve ser aplicada apenas no banco de anexos.
