# Anexos D1 — homologação em andamento

Esta branch é exclusiva para testes. Não mesclar nem publicar em produção: sua configuração aponta para o banco de teste e mantém escritas de notas desativadas.

O armazenamento separa cada arquivo em partes em um banco D1 próprio, com operações em lote. O banco de notas existente não foi modificado. Limites propostos: cinco arquivos por etapa, até 5 MiB, tipos PDF, DOCX, MD e TXT, downloads públicos e gerenciamento com segredo no Worker.

O teste local usa SQLite real com adaptador D1 simulado e não comprova o comportamento em Cloudflare D1. Faltam validar uploads, downloads, concorrência, tamanho máximo, permissões e CORS em uma prévia isolada usando o banco `curva-aberta-anexos-teste`. A validação de assinatura de PDF/DOCX é superficial e não é varredura de malware.

Após a homologação, aplicar o esquema em `curva-aberta-anexos`, configurar o binding de produção e um segredo privado forte, preservar o binding `DB` atual, manter `WRITES_ENABLED=true` em produção, executar testes completos e só então integrar e publicar. O segredo nunca deve ser versionado ou enviado ao chat.
