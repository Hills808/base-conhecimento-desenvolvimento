# Furina: implementação e limites da arte

## Plano visual, revisado antes da implementação

Preservar a personagem e a tipografia sans-serif do site. Paleta: papel `#ffffff`, texto `#202b42`, ajuda `#4149c9`, contorno `#dce2ef`, atenção `#c34359`. A personagem é o elemento expressivo; os controles e a dica ficam discretos, com texto alinhado à esquerda. A dica é uma pequena conversa, não um segundo dashboard. Evitar decoração e movimento constante chamativo. O plano mantém a identidade aprovada e não muda o design das trilhas.

## Abordagem

O projeto tem React e cinco recortes WebP: cabeça, torso, dois braços e pernas juntas. Não tem arquivo `.riv`, atlas ou projeto Spine. A solução usa o rig hierárquico existente, com um controlador próprio de poses e um único relógio de animação. Rive orienta prioridades de estados e mistura gradual; Spine orienta pivôs, filhos da articulação, sobreposição e antecipação/ação/retorno. Não é uma exportação Rive ou Spine, nem usa seus runtimes.

Não foi instalado editor, runtime pago ou recurso externo. Os recortes existentes foram preservados. A licença do runtime Spine exige observar os termos próprios; não o redistribuímos. Não copiamos os scripts da skill Spine (PolyForm Noncommercial). Referências: [Rive: exportação](https://github.com/rive-app/help-center/blob/master/editor/exporting.md), [Spine: licença do runtime](https://esotericsoftware.com/spine-runtimes-license).

## Arte e expansão do rig

A cabeça inclui cabelo e olhos abertos. Os braços são peças inteiras, sem cotovelos separados; as pernas são uma só peça. Movimentos grandes expõem as bordas dos recortes e fazem as articulações parecerem soltas. A nova animação restringe amplitudes, mantém os pivôs e mistura as transições sem apagar transforms no meio de um movimento.

Para uma animação com cabelo realmente deformável, pernas independentes e dança mais elaborada, faltam: cabelo traseiro e mechas frontais separados com área de sobreposição; rosto sem cabelo; pálpebras fechadas desenhadas no mesmo registro; braços/antebraços/mãos separados; duas pernas com coxa/canela/pé; preenchimento sob cada articulação. Todas as peças precisam manter o mesmo canvas de referência e transparência limpa. O controlador separa canais e permite adicionar essas articulações sem modificar dicas ou progresso.

## Verificação

Resultados de testes e capturas serão registrados ao finalizar a implementação. A preferência da Furina usa a chave existente `curva-aberta-furina-v2`. As chaves de progresso, checklists e revisões não são alteradas.
