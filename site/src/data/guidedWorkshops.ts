import introduction from './beginner-workshops.json';
import decisions from './decision-workshops.json';
import collections from './collection-workshops.json';

export type Workshop = {
  trace: { line: number; observation: string }[];
  task: {
    context: string;
    code: string;
    input?: string;
    output: string;
    hint: string;
    explain: string;
    errors: { guess: string; feedback: string }[];
  };
  repair: {
    brief: string;
    code: string;
    hint: string;
    solution: string;
    tests: { input?: string; output: string }[];
    explanation: string;
  };
};

export const guidedWorkshops: Record<string, Workshop> = { ...introduction, ...decisions, ...collections };

export function outputLines(value: string): string[] {
  return value.trim().replace(/\r\n?/g, '\n').split('\n').map(line => line.trimEnd());
}

export function sameOutput(actual: string, expected: string): boolean {
  return outputLines(actual).join('\n') === outputLines(expected).join('\n');
}

export function predictionFeedback(task: Workshop['task'], prediction: string): string {
  if (sameOutput(prediction, task.output)) return task.explain;
  const diagnosis = task.errors.find(error => sameOutput(prediction, error.guess));
  if (diagnosis) return diagnosis.feedback;
  const expected = outputLines(task.output);
  const actual = outputLines(prediction);
  const difference = expected.findIndex((line, index) => actual[index] !== line);
  if (difference < 0) return 'Até aqui, as linhas esperadas coincidem. Sobrou texto na sua previsão. Confira onde o programa termina.';
  if (difference >= actual.length) return 'O começo confere. Ainda há saída depois da última linha que você escreveu. Acompanhe o restante do programa.';
  if (actual[difference].toLocaleLowerCase('pt-BR') === expected[difference].toLocaleLowerCase('pt-BR')) {
    return 'O conteúdo da linha ' + (difference + 1) + ' confere. Observe as letras maiúsculas e minúsculas que aparecem no console.';
  }
  return 'A primeira diferença aparece na linha ' + (difference + 1) + ' da saída. ' + task.hint;
}
