import { useState } from "react";
import { labCheckpoints } from "./data/lab-checkpoints";

type Props = { stepId: string; passed: string[]; onPass: (index: number) => void; onReset: () => void };

export default function LabCheckpoint({ stepId, passed, onPass, onReset }: Props) {
  const [selected, setSelected] = useState<Record<number, number>>({});
  const questions = labCheckpoints[stepId];
  const score = questions.filter((_, index) => passed.includes(`${stepId}-${index}`)).length;

  return <section className="lab-quiz" aria-label="Teste seu raciocínio">
    <div className="lab-quiz-heading"><div><span className="eyebrow">VERIFICAÇÃO COM EXPLICAÇÃO</span><h3>04. Teste seu raciocínio</h3><p>Escolha uma resposta. Se ela não encaixar, veja o motivo, volte ao exemplo e tente novamente. Este teste confere uma decisão; sua entrega prática ainda precisa ser feita.</p></div><strong>{score}/{questions.length}<small>situações compreendidas</small></strong></div>
    {questions.map((question, index) => {
      const isPassed = passed.includes(`${stepId}-${index}`);
      const answer = isPassed ? question.correct : selected[index];
      return <fieldset className="lab-quiz-question" key={`${stepId}-${index}`}>
        <legend>Situação {index + 1} de {questions.length}</legend>
        <p className="lab-quiz-prompt">{question.prompt}</p>
        <div className="lab-quiz-options">{question.options.map((option, optionIndex) => <button key={option} type="button" disabled={isPassed || answer !== undefined} aria-pressed={answer === optionIndex} className={answer === optionIndex ? (optionIndex === question.correct ? "correct" : "incorrect") : ""} onClick={() => {
          setSelected(current => ({ ...current, [index]: optionIndex }));
          if (optionIndex === question.correct) onPass(index);
        }}><span aria-hidden="true">{String.fromCharCode(65 + optionIndex)}</span>{option}</button>)}</div>
        {answer !== undefined && <div className={`lab-quiz-feedback ${answer === question.correct ? "correct" : "incorrect"}`} role="status" aria-live="polite"><strong>{answer === question.correct ? "Você identificou a decisão certa." : "Ainda não. Veja o detalhe que muda a resposta."}</strong><p>{question.feedback[answer]}</p>{answer === question.correct ? <><p><strong>Agora aplique:</strong> {question.apply}</p><details><summary>Por que as outras opções não servem?</summary><ul>{question.options.map((option, optionIndex) => optionIndex === question.correct ? null : <li key={option}><strong>{option}</strong> — {question.feedback[optionIndex]}</li>)}</ul></details></> : <><p><strong>Onde revisar:</strong> {question.review}</p><button type="button" onClick={() => setSelected(current => { const next = { ...current }; delete next[index]; return next; })}>Tentar outra opção</button></>}</div>}
      </fieldset>;
    })}
    <p className="lab-quiz-note">Acertar aqui libera apenas a verificação de entendimento. Para registrar a etapa, confira também o exercício e os critérios abaixo.</p>
    {score > 0 && <button className="lab-quiz-reset" type="button" onClick={() => { setSelected({}); onReset(); }}>Refazer estas situações</button>}
  </section>;
}
