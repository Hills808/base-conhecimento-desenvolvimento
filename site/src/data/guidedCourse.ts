import introduction from './beginner-lessons.json';
import decisions from './decision-lessons.json';
import collections from './collection-lessons.json';

export const references = {
  syntax: { title: 'Escrever seu primeiro código C#', url: 'https://learn.microsoft.com/pt-br/training/modules/csharp-write-first/', use: 'Revise console, mensagens e a sintaxe da primeira instrução.' },
  variables: { title: 'Armazenar dados com variáveis em C#', url: 'https://learn.microsoft.com/pt-br/training/modules/csharp-literals-variables/', use: 'Reveja a diferença entre o nome de uma variável e seu valor.' },
  boolean: { title: 'Avaliar expressões boolianas em C#', url: 'https://learn.microsoft.com/pt-br/training/modules/csharp-evaluate-boolean-expressions/', use: 'Consulte mais exemplos de comparações, “e” e “ou”.' },
  branch: { title: 'Adicionar lógica de decisão em C#', url: 'https://learn.microsoft.com/pt-br/training/modules/csharp-if-elseif-else/', use: 'Leia depois de acompanhar os blocos do primeiro if.' },
  input: { title: 'Console.ReadLine no .NET 10', url: 'https://learn.microsoft.com/pt-br/dotnet/api/system.console.readline?view=net-10.0', use: 'Use para confirmar o que o método retorna com uma linha vazia ou quando a entrada termina.' },
  parse: { title: 'Int32.TryParse no .NET 10', url: 'https://learn.microsoft.com/pt-br/dotnet/api/system.int32.tryparse?view=net-10.0', use: 'Use para confirmar o que true, false e o valor de saída significam.' },
  array: { title: 'Matrizes em C#', url: 'https://learn.microsoft.com/pt-br/dotnet/csharp/language-reference/builtin-types/arrays', use: 'Localize o primeiro índice e compare-o com o tamanho da coleção.' },
  foreach: { title: 'Percorrer uma matriz com foreach', url: 'https://learn.microsoft.com/pt-br/training/modules/csharp-arrays/', use: 'Veja como um nome recebe um elemento diferente a cada volta.' },
  for: { title: 'Iterar com a instrução for', url: 'https://learn.microsoft.com/pt-br/training/modules/csharp-for/', use: 'Acompanhe o valor inicial, o teste e a mudança feitos pelo contador.' },
  while: { title: 'Instruções de iteração', url: 'https://learn.microsoft.com/pt-br/dotnet/csharp/language-reference/statements/iteration-statements#the-while-statement', use: 'Reveja quando a condição é testada e por que o corpo pode executar zero vezes.' },
  list: { title: 'List<T> e suas operações', url: 'https://learn.microsoft.com/pt-br/dotnet/api/system.collections.generic.list-1?view=net-10.0', use: 'Consulte Count, Add e RemoveAt ao conferir a transformação da sua lista.' },
};

export type ExampleCase = {
  value: string;
  input?: string | null;
  replacement?: string;
  line: number;
  output: string;
  reason: string;
};

export type GuidedLesson = {
  id: string;
  title: string;
  goal: string;
  before: string;
  reviewLesson?: string;
  paragraphs: string[];
  terms?: { term: string; meaning: string }[];
  code: string;
  questionCode?: string;
  challengeCode?: string;
  input?: string;
  output: string;
  explanation: string;
  explore?: { label: string; replace?: string; cases: ExampleCase[] };
  prompt: string;
  options: string[];
  correct: number;
  feedback: string[];
  hint: string;
  hintDetail?: string;
  challenge: string;
  challengeSteps?: string[];
  checkPrompt?: string;
  answer: string;
  answerCode?: string;
  mistake: string;
  reference?: keyof typeof references;
};

export const setupLesson = {
  id: 'I07',
  title: 'Faça seu primeiro programa rodar',
  goal: 'Rode uma instrução no seu computador e explique o que mudou depois de editá-la.',
  code: 'Console.WriteLine("Meu primeiro programa");\nConsole.WriteLine(6 + 2);',
  output: 'Meu primeiro programa\n8',
};

const conceptLessons = [...introduction, ...decisions, ...collections] as GuidedLesson[];
export const guidedGroups = [
  { title: 'Começar do zero', description: 'Leia suas primeiras instruções e aprenda a executar um programa.', ids: [...introduction.map(lesson => lesson.id), setupLesson.id] },
  { title: 'Decisões e dados', description: 'Leia condições e monte um classificador de tempo de espera.', ids: decisions.map(lesson => lesson.id) },
  { title: 'Repetições e coleções', description: 'Acompanhe uma fila item por item e construa um relatório que continue correto quando a fila mudar.', ids: collections.map(lesson => lesson.id) },
];

export const guidedIds = guidedGroups.flatMap(group => group.ids);
export function getGuidedLesson(id: string) {
  return conceptLessons.find(lesson => lesson.id === id);
}

export function getGuidedTitle(id: string) {
  return getGuidedLesson(id)?.title ?? setupLesson.title;
}

export function getGuidedGoal(id: string) {
  return getGuidedLesson(id)?.goal ?? setupLesson.goal;
}

export function exampleCode(code: string, replace: string | undefined, item: ExampleCase) {
  return replace && item.replacement ? code.replace(replace, item.replacement) : code;
}
