import { Fragment } from 'react';

const tokens = /("(?:\\.|[^"\\])*"|\/\/.*|\b(?:int|bool|string|if|else|out)\b|\b(?:false|true|null|\d+)\b)/g;

function renderLine(line: string) {
  return line.split(tokens).map((part, index) => {
    if (index % 2 === 0) {
      return <Fragment key={index}>{part.split(/([.(])/).map((chunk, piece) =>
        piece % 2 === 0 ? chunk : <Fragment key={piece}>{chunk}<wbr /></Fragment>
      )}</Fragment>;
    }
    let kind = 'keyword';
    if (part.startsWith('"')) kind = 'string';
    else if (part.startsWith('//')) kind = 'comment';
    else if (/^(?:false|true|null|\d+)$/.test(part)) kind = 'value';
    return <span key={index} className={'study-token-' + kind}>{part}</span>;
  });
}

export default function StudyCode({ code, label = 'Código C#', activeLine, highlight = true }: {
  code: string;
  label?: string;
  activeLine?: number;
  highlight?: boolean;
}) {
  const lines = code.split('\n');
  return (
    <pre className="course-code study-code" tabIndex={0} aria-label={label}>
      <code>{lines.map((line, index) => (
        <Fragment key={index}>
          <span className={activeLine === index + 1 ? 'course-code-line is-active' : 'course-code-line'}>
            <span className="course-line-number" aria-hidden="true">{index + 1}</span>
            <span>{highlight ? renderLine(line) : line}</span>
          </span>
          {index < lines.length - 1 ? '\n' : ''}
        </Fragment>
      ))}</code>
    </pre>
  );
}
