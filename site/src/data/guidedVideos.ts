type Source = { channel: string; id: string; duration: number };
type Video = Source & {
  title: string;
  observe: string;
  practice: string;
  start?: number;
  end?: number;
  note?: string;
};

const fredi: Source = { channel: 'Fredi', id: 'oTivhgjbhIg', duration: 14228 };
const victor: Source = { channel: 'Victor Lima', id: 'PKMm-cHe56g', duration: 18001 };
const decisoes: Source = { channel: 'Código com o Lopes', id: 'oGdRW18rr8w', duration: 746 };
const lacos: Source = { channel: 'Código com o Lopes', id: 'l1yo7MDcOYs', duration: 742 };
const oliver: Source = { channel: 'Oliver Tech', id: 'pyeejgU7kTc', duration: 602 };

export const guidedVideos: Record<string, Video | undefined> = {
  I01: {
    channel: 'Curso em Vídeo · Gustavo Guanabara', id: '8mei6uVttho', duration: 848, title: 'O que é um algoritmo?',
    observe: 'Imagine que outra pessoa precisa cumprir uma tarefa seguindo apenas as suas palavras. Qual detalhe você teria de dizer em voz alta?',
    practice: 'Escolha uma mensagem que gostaria de ver em um painel. Diga que instrução daria para ela aparecer.',
    note: 'Esta aula apresenta a lógica de uma sequência de instruções. Logo abaixo você vai ler sua primeira linha em C#.',
  },
  I02: { ...victor, start: 2893, end: 3600, title: 'A primeira mensagem no console',
    observe: 'Localize no editor o texto entre aspas. Acompanhe onde esse mesmo texto aparece quando o professor executa o programa.',
    practice: 'Escreva a mensagem para Bia. Circule os símbolos que precisaram continuar no código.' },
  I03: { ...fredi, start: 1127, end: 1295, title: 'Como ler uma instrução',
    observe: 'Acompanhe onde termina uma instrução. Faça uma pausa e procure a próxima ação do programa.',
    practice: 'Inverta duas mensagens do exemplo da aula. Leia a tela que apareceria depois da troca.' },
  I04: { ...fredi, start: 2116, end: 2194, title: 'Como o C# junta textos',
    observe: 'No trecho sobre concatenação, observe o que acontece quando o sinal de + recebe texto. Concatenação é juntar textos em sequência.',
    practice: 'Compare "3" + "2" com 3 + 2. Diga qual serviria para fazer uma etiqueta e qual serviria para contar itens.' },
  I05: { ...victor, start: 3600, end: 4020, title: 'Por que dar um nome a um valor?',
    observe: 'Identifique o nome escolhido pelo professor e qual valor ele representa naquele instante.',
    practice: 'Desenhe uma ficha com o nome vagas e o número 8. Use a ficha para explicar o que WriteLine(vagas) consulta.' },
  I06: { ...fredi, start: 4634, end: 4856, title: 'Operações com números',
    observe: 'Escolha uma conta no exemplo e preveja o resultado. Ao voltar à aula, procure onde o programa guarda ou mostra um cálculo.',
    practice: 'Comece com 9 peças, mostre o resultado de tirar 2 e depois consulte a quantidade guardada.' },
  I07: { ...fredi, start: 1914, end: 2116, title: 'Do arquivo ao primeiro programa',
    observe: 'Alterne o olhar entre o arquivo editado e o terminal. Onde fica a instrução salva e onde aparece a resposta?',
    practice: 'Salve uma mudança em Program.cs, execute de novo e procure a nova mensagem.',
    note: 'A gravação usa .NET 6. Siga a preparação desta aula para trabalhar com o SDK .NET 10.' },
  U06: { ...fredi, start: 2461, end: 2555, title: 'Quando uma comparação dá verdadeiro?',
    observe: 'Traduza uma comparação para uma pergunta que possa receber sim ou não.',
    practice: 'Use o próprio limite nos dois lados. Compare o resultado de > com o de >=.' },
  U07: { channel: 'CFBCursos', id: 'Ojm98Gg1rVw', duration: 681, title: 'Os dois caminhos de um if e else',
    observe: 'Aponte o bloco escolhido quando a condição é verdadeira. Depois localize o trecho que seria pulado.',
    practice: 'No exemplo da aula, teste zero vagas e depois uma vaga. O que os dois caminhos fazem ao terminar?' },
  U08A: { ...fredi, start: 2222, end: 2266, title: 'Receber uma linha do teclado',
    observe: 'Veja quando o programa espera por quem está digitando e qual nome recebe o texto.',
    practice: 'Compare digitar 0 com apenas apertar Enter. Explique o que o programa recebeu em cada caso.' },
  U08: { channel: 'balta · André Baltieri', id: 'q5TJF2djT58', duration: 542, start: 320, end: 492, title: 'O que TryParse devolve',
    observe: 'Procure as duas informações da tentativa de conversão. Uma diz se deu certo, a outra contém o número obtido.',
    practice: 'Tente converter 30 e abc. Anote qual resultado decide se o cálculo pode continuar.' },
  U09: { ...decisoes, start: 158, end: 242, title: 'Combinar regras e interromper um teste',
    observe: 'Quando a primeira condição já decide a resposta, acompanhe o que acontece com a segunda.',
    practice: 'Use zero como número de pessoas e localize a comparação que protege a divisão na aula.' },
  U10: { ...decisoes, start: 276, end: 369, title: 'Testar os dois lados de um limite',
    observe: 'Pause quando aparecer a faixa errada. Escolha um valor que cairia em duas regras se os testes fossem feitos em outra ordem.',
    practice: 'Escreva o resultado para 29, 30 e 31 minutos antes de executar o classificador.' },
  U10P: { ...decisoes, start: 593, end: 707, title: 'Da regra aos casos de teste',
    observe: 'No exemplo dos ingressos, procure uma entrada que consegue demonstrar uma decisão errada mesmo quando o programa compila.',
    practice: 'Faça essa investigação no classificador de espera. Qual entrada distingue > de >= se o limite é 30?' },
  U11: { ...fredi, start: 2824, end: 3066, title: 'A posição e o valor em um array',
    observe: 'Escolha o primeiro valor e pergunte qual número identifica a posição dele. Depois conte quantos valores existem.',
    practice: 'Desenhe três posições no papel. Escreva o índice acima e o valor dentro de cada uma.' },
  U12: { ...oliver, start: 186, end: 323, title: 'Somar item por item com foreach',
    observe: 'No carrinho, acompanhe o preço do item atual e o subtotal. Faça uma pausa antes de cada nova soma.',
    practice: 'Para as esperas de 4, 1 e 7 minutos, anote o subtotal após cada volta.' },
  U13: { ...lacos, start: 53, end: 117, title: 'Quantas vezes o for vai executar?',
    observe: 'Localize o valor inicial, a pergunta para continuar e a atualização do contador. Pause antes de ouvir a contagem.',
    practice: 'Com três itens, escreva os índices que o seu laço visitaria. Confira onde o teste de limite deve pará-lo.' },
  U14: { ...lacos, start: 228, end: 279, title: 'Por que um while termina?',
    observe: 'Na correção do laço, descubra qual valor precisa mudar para a condição deixar de ser verdadeira.',
    practice: 'Comece com três páginas na oficina de impressão. Acompanhe a primeira volta e diga como saber que chegou ao fim.' },
  U15: { ...oliver, start: 121, end: 186, title: 'Adicionar a uma lista e consultar a quantidade',
    observe: 'Acompanhe o tamanho da lista depois de cada Add. Encontre a posição do primeiro produto mesmo depois de outro produto chegar.',
    practice: 'Faça uma fila de três itens, retire a posição zero e explique o novo valor de Count e quem passou a ser o primeiro.' },
};
