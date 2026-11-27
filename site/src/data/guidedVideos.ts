type Video = {
  channel: string;
  id: string;
  title: string;
  practice: string;
  start?: number;
  end?: number;
  note?: string;
};

const fredi = 'oTivhgjbhIg';
const balta = 'q5TJF2djT58';

function chapter(start: number, end: number, title: string, practice: string, note?: string): Video {
  return { channel: 'Fredi', id: fredi, start, end, title, practice, note };
}

export const guidedVideos: Record<string, Video | undefined> = {
  I01: {
    channel: 'Curso em Vídeo', id: '8mei6uVttho', title: 'Introdução a algoritmos',
    practice: 'Escreva uma instrução para alguém e diga o que essa pessoa deve ver depois de segui-la.',
  },
  I02: chapter(1648, 1752, 'Como o programa usa o console', 'Troque o texto de Console.WriteLine e preveja a mensagem exibida.'),
  I03: chapter(1127, 1295, 'Instruções e expressões', 'Leia duas instruções de impressão e preveja a ordem. Depois inverta as duas.'),
  I04: chapter(1409, 1545, 'Operadores e operandos', 'Compare 3 + 2 com "3" + "2" no exemplo desta aula.'),
  I05: chapter(1008, 1127, 'Como declarar e usar uma variável', 'Crie int vagas = 8;. Depois explique o que muda entre mostrar vagas e mostrar "vagas".'),
  I06: chapter(1127, 1295, 'Calcular um valor e usá-lo em uma instrução', 'Preveja a saída e o valor da variável antes e depois de uma atribuição.'),
  I07: chapter(1914, 2116, 'Do arquivo ao primeiro programa', 'Rode dotnet run e troque uma mensagem no Program.cs.',
    'O curso gravado usa .NET 6. Use o passo a passo de instalação do Curva Aberta para configurar o .NET 10.'),
  U06: chapter(2461, 2555, 'Comparações e respostas verdadeiro ou falso', 'Explique por que > e >= dão respostas diferentes quando o valor é igual ao limite.'),
  U07: {
    channel: 'CFBCursos', id: 'Ojm98Gg1rVw', title: 'Condicional if e else',
    practice: 'Troque o número de vagas no exemplo e diga qual bloco roda com zero e com uma vaga.',
  },
  U08A: chapter(2222, 2266, 'Receber texto com Console.ReadLine', 'Compare digitar 0 com apenas apertar Enter. Veja na aula como distinguir uma linha vazia do fim da entrada.'),
  U08: {
    channel: 'balta', id: balta, start: 320, end: 492, title: 'Como usar TryParse',
    practice: 'Teste a conversão de "30" e "abc". Anote quando TryParse retorna true ou false.',
  },
  U09: chapter(2762, 2824, 'Operadores lógicos', 'Escolha dois valores para testar uma condição com &&. Depois troque por || e compare.'),
  U10: chapter(2555, 2762, 'Escolher faixas com else if', 'Use a regra da aula e preveja a saída para 29, 30 e 31 minutos.'),
  U10P: {
    channel: 'balta', id: balta, start: 320, end: 492, title: 'Revisão de TryParse antes do classificador',
    practice: 'Rode seu classificador com texto inválido, -1, 29 e 30. Indique o ponto em que cada entrada segue um caminho diferente.',
  },
};
