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

A preferência da Furina usa a chave existente `curva-aberta-furina-v2`, com migração opcional de `paused`. As chaves de progresso, checklists e revisões não são alteradas.

Executado em 03/10/2026:

- Build Vite e TypeScript sem erros; os validadores anteriores de currículo, método e laboratório continuam aprovados.
- `scripts/validate-furina.mjs`: 2.100 amostras de continuidade e limites das articulações, retorno suave em três intervalos de atualização e 144 posições em seis tamanhos de tela, incluindo 320×568, 390×844 e paisagem. São testes matemáticos, não testes físicos de celular.
- Navegador Chrome remoto no site publicado: abrir/expandir/fechar dica, conteúdo da etapa, pausa com comparação de transforms (nenhuma alteração), retomada por Enter, deslocamento pelos botões e teclado e limites da dica à esquerda/direita.
- Conclusão pelo fluxo real do laboratório: duas questões e três critérios, registro da entrega, evento de comemoração e mensagem contextual. Teste desfeito pelos controles Reabrir etapa, Refazer estas situações e desmarcação dos critérios.
- Conclusão com Furina oculta: permanece oculta. Recarregar e mostrar novamente preserva a pausa.
- Troca entre as etapas 1 e 2: a dica muda de leitura de HTTP/JSON para testes de status/campo no Bruno. Console observado: mensagens de erro da extensão de automação do navegador; nenhum erro de aplicação identificado nesse fluxo.
- Uma correção decorrente da observação: o relógio agora avança por tempo real entre frames; limitar esse tempo prolongava a comemoração em um navegador com frames esparsos. Somente a mistura das poses limita o passo de suavização.

Limitações reais: o driver autorizado não oferece viewport móvel, toque, gesto de arraste nem alteração de `prefers-reduced-motion`. Esses caminhos foram revisados no código, com Pointer Events/captura/cancelamento, limiar de arraste de 5px, bloqueio do clique subsequente, limites de posição e listener de preferência de movimento. Não declarar esses gestos ou a preferência do sistema como testados em aparelho real. Piscadas, cabelo independente e dança com cotovelos/joelhos ainda dependem das artes listadas acima; não substituímos a identidade por um novo desenho.

## Como as skills instaladas orientaram o trabalho

Todos os SKILL.md foram lidos na versão instalada, com as adaptações de driver deste ambiente.

| Skill | Aplicação | Evidência no projeto |
| --- | --- | --- |
| rive | Estados prioritários e mistura gradual sem interromper a pose corrente; referência state-machine e manipulating-shapes. Comparação de requisitos de exportação. | `targetPose`, `blendPose` e controlador em `AnimatedMascot.tsx`; nenhum `.riv` fictício. |
| spine-animation | Análise dos cinco recortes, pais/pivôs, limites de rotação e fases antecipação/salto/aterrissagem/retorno; referência spine-json-spec. | `furina-motion.ts`, pivôs no CSS e `public/furina-rig/rig-plan.json`; sem runtime Spine. |
| frontend-design | Plano visual anterior ao código, identidade preservada, controles discretos e dica alinhada à esquerda. | Plano acima; CSS branco/azul coerente com o site e redução de 118 para 100px no desktop e de 104 para 88px no celular. |
| web-design-guidelines | Alvos de 44px, foco visível, Escape, alternativa ao arraste, preferência de movimento reduzido, dimensões de imagens e tipografia legível. | `animated-mascot.css`, atributos/handlers dos controles e listener matchMedia. |
| webapp-testing | Descoberta/observação/ação/verificação com capturas e testes de regressão; helper with_server consultado. Driver do host em vez de instalar outra sessão Playwright. | Fluxos de navegador registrados acima e validador executado no build. |
| agent-browser | Driver permitido, snapshots antes/depois de cada fluxo e seletores obtidos da interface observada. | Verificação do site publicado pelo navegador do ambiente, com capturas antes/depois. |
| vercel-react-best-practices | Valores por frame e pointer ficam em refs, sem setState por frame; uma assinatura de conclusão e um RAF com cleanup; interromper execução em aba oculta. | Referência rerender-use-ref-transient-values aplicada em `AnimatedMascot.tsx`; nenhuma dependência de animação adicionada. |
