import { useState } from 'react';
import lessons from './data/beginner-lessons.json';

const base = import.meta.env.BASE_URL;
const lessonLink = (index: number) => `${base}?visao=formacao&inicio=${index + 1}`;

function Lesson({ index }: { index: number }) {
  const lesson = lessons[index];
  const [choice, setChoice] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);
  const [hint, setHint] = useState(false);
  return <>
    <header><p className="formation-kicker">Começar do zero · Aula {index + 1} de 7</p><h1>{lesson.title}</h1><p>{lesson.goal}</p><p className="formation-small"><strong>Antes de começar:</strong> {lesson.before}</p></header>
    <section aria-labelledby="learn-title"><h2 id="learn-title">Entenda com um exemplo</h2>{lesson.paragraphs.map(p => <p key={p}>{p}</p>)}
      <div className="beginner-example"><div><h3>Código escrito</h3><pre tabIndex={0}><code>{lesson.code}</code></pre></div><div><h3>Saída depois de executar</h3><pre tabIndex={0}><code>{lesson.output}</code></pre></div></div>
      <p className="formation-feedback">{lesson.explanation}</p><p className="formation-small">Exemplo resolvido: a saída está ilustrada acima. Esta página não executa C#; você aprenderá a executar no computador na aula 7.</p>
    </section>
    <section className="beginner-practice" aria-labelledby="try-title"><h2 id="try-title">Agora tente com ajuda</h2>
      <fieldset><legend>{lesson.prompt}</legend>{lesson.options.map((option,i)=><label key={option}><input type="radio" name="beginner-answer" checked={choice===i} onChange={()=>{setChoice(i);setChecked(false);}}/><span>{option}</span></label>)}</fieldset>
      <button className="formation-primary" disabled={choice===null} onClick={()=>setChecked(true)}>Conferir minha resposta</button>
      <button aria-expanded={hint} onClick={()=>setHint(!hint)}>Ainda não entendi: ver uma pista</button>
      {hint&&<p className="formation-feedback">{lesson.hint}</p>}
      {checked&&choice!==null&&<p role="status" className="formation-feedback"><strong>{choice===lesson.correct?'Você reconheceu a ideia. ':'Vamos rever este ponto. '}</strong>{lesson.feedback[choice]}</p>}
      <p className="formation-small">Você pode tentar novamente. Estas respostas não são guardadas ao sair da página e não dão uma nota.</p>
    </section>
    <section><h2>Reconheça um erro comum</h2><p>{lesson.mistake}</p><h2>Tente em outro exemplo</h2><p className="beginner-task">{lesson.challenge}</p><p>Responda em voz alta, no papel ou em um editor. Explique o motivo, mesmo que precise consultar a aula.</p>
      <details><summary>Terminei minha tentativa: comparar com a explicação</summary><pre className="beginner-answer"><code>{lesson.answer}</code></pre><p>Se precisou consultar, feche esta explicação e tente de novo com outros números ou outra mensagem. Acertar depois de consultar é um passo; explicar sozinho é o próximo.</p></details>
    </section>
    <nav aria-label="Próxima aula" className="beginner-next">{index>0&&<a href={lessonLink(index-1)}>Voltar à aula anterior</a>}<a className="formation-primary" href={lessonLink(index+1)}>{index===5?'Aprender a executar no computador':'Continuar: '+lessons[index+1].title}</a></nav>
  </>;
}

function Setup() {
  return <><header><p className="formation-kicker">Começar do zero · Aula 7 de 7</p><h1>Faça seu primeiro programa rodar</h1><p>Agora você vai transformar o texto que leu em um programa executado no seu computador.</p></header>
  <h2>O papel de cada ferramenta</h2><dl className="beginner-glossary">
    <dt>Editor</dt><dd>É onde você altera arquivos de texto com código. VS Code é um exemplo. Abrir o editor, sozinho, não executa C#.</dd>
    <dt>Arquivo Program.cs</dt><dd>É o arquivo onde escreveremos as instruções. A extensão .cs identifica código C#.</dd>
    <dt>Projeto</dt><dd>Reúne arquivos e configurações de um programa. O arquivo .csproj guarda configurações usadas para construir o projeto.</dd>
    <dt>SDK .NET</dt><dd>É o conjunto de ferramentas necessário aqui para criar, compilar e executar o projeto C#. Instalar apenas o editor não instala esse conjunto.</dd>
    <dt>Compilar</dt><dd>É transformar o código em uma forma que o ambiente .NET consegue executar, verificando regras da linguagem. Um erro nessa etapa pode impedir o programa de iniciar.</dd>
    <dt>Terminal</dt><dd>É uma janela em que você digita comandos e lê respostas. No VS Code, abra o menu Terminal e escolha Novo Terminal. Aqui usaremos PowerShell no Windows.</dd>
  </dl>
  <h2>1. Confira as ferramentas</h2><p>No terminal, digite o comando abaixo e pressione Enter. Ele consulta a instalação; ainda não executa seu programa.</p><pre><code>dotnet --list-sdks</code></pre><p>Procure uma linha que comece com 10.0. Se não aparecer um SDK ou o comando não for reconhecido, instale o <a href="https://dotnet.microsoft.com/pt-br/download/dotnet/10.0" target="_blank" rel="noopener noreferrer">SDK .NET 10 oficial (nova aba)</a>. Depois feche e abra o terminal novamente. Em computador com instalação restrita, continue a leitura e use um computador em que possa instalar as ferramentas.</p>
  <h2>2. Crie uma pasta para o programa</h2><p>Escolha uma pasta pessoal para seus estudos e abra essa pasta no VS Code em Arquivo → Abrir Pasta. Abra o terminal nela. Digite uma linha por vez:</p><pre><code>{'dotnet new console -n MeuPrimeiroPrograma\ncd MeuPrimeiroPrograma'}</code></pre><p>O primeiro comando cria um projeto de texto em uma subpasta chamada MeuPrimeiroPrograma. O segundo muda o terminal para essa subpasta. Se ela já existir, use outro nome nos dois comandos; não sobrescreva um projeto anterior.</p>
  <h2>3. Escreva e salve</h2><p>Na lista de arquivos do editor, abra MeuPrimeiroPrograma e depois Program.cs. Substitua o exemplo inicial por estas duas linhas. Salve com Ctrl+S.</p><pre><code>{'Console.WriteLine("Meu primeiro programa");\nConsole.WriteLine(6 + 2);'}</code></pre>
  <h2>4. Execute e compare</h2><p>No terminal que está dentro da pasta MeuPrimeiroPrograma, digite:</p><pre><code>dotnet run</code></pre><p>Esse comando constrói e executa o projeto. Ao terminar, procure estas duas linhas:</p><pre><code>{'Meu primeiro programa\n8'}</code></pre><p>Troque 6 + 2 por 6 + 3, salve e execute novamente. A segunda saída deve passar a 9. Você alterou o código, executou e observou o efeito.</p>
  <h2>Se não funcionou, comece pela mensagem</h2>
  <details><summary>“dotnet não é reconhecido” ou nenhum SDK listado</summary><p>Confira a instalação do SDK e reabra o terminal. Instalar somente o runtime, que permite executar aplicativos prontos, não fornece todas as ferramentas de criação do SDK.</p></details>
  <details><summary>“Não foi possível encontrar um projeto”</summary><p>O terminal provavelmente está na pasta errada. Digite dir para listar os arquivos. Entre na pasta MeuPrimeiroPrograma com cd MeuPrimeiroPrograma se ela estiver listada. A pasta correta contém o arquivo MeuPrimeiroPrograma.csproj.</p></details>
  <details><summary>Erro apontando Program.cs e uma linha</summary><p>Leia a primeira mensagem de erro. Confira nessa linha o nome Console.WriteLine, as duas aspas retas quando houver texto, os parênteses e o ponto e vírgula. Corrija um problema por vez, salve e rode novamente. Não troque o programa inteiro sem entender a mensagem.</p></details>
  <details><summary>O resultado antigo continua aparecendo</summary><p>Salve Program.cs, execute dotnet run novamente e confira se o terminal está no mesmo projeto que você editou. Alterar texto no editor não modifica uma execução que já terminou.</p></details>
  <h2>Uma entrega pequena, feita por você</h2><p>Sem copiar o exemplo anterior, mostre uma mensagem de sua escolha, declare uma variável inteira com 8 vagas, diminua 2 do valor guardado e mostre o restante. Antes de rodar, anote a saída esperada. Depois explique qual linha guarda, qual calcula e qual mostra.</p><p>O próximo exercício retoma essas ideias na Mesa de atendimento. Você pode voltar a qualquer aula quando precisar; esta introdução não registra automaticamente domínio ou conclusão.</p>
  <nav className="beginner-next" aria-label="Próxima prática"><a href={lessonLink(5)}>Voltar a calcular e guardar</a><a className="formation-primary" href={`${base}?visao=formacao&missao=C01`}>Aplicar na primeira prática de C#</a></nav></>;
}

export default function BeginnerCourse({ index }: { index: number }) {
  const current=Number.isInteger(index)&&index>=0&&index<=6?index:0;
  return <section className="formation formation-lesson beginner-course">
    <aside className="formation-sidebar"><a href={`${base}?visao=formacao`}>Ver toda a formação</a><details><summary>As 7 aulas do começo</summary><nav aria-label="Introdução à programação">{[...lessons.map(l=>l.title),'Executar no computador'].map((title,i)=><a key={title} href={lessonLink(i)} aria-current={i===current?'page':undefined}>{i+1}. {title}</a>)}</nav></details><p>Uma ideia por vez.<br/>Sem instalar nada até a aula 7.</p></aside>
    <article className="formation-work">{current===6?<Setup/>:<Lesson key={current} index={current}/>}
    <details className="formation-reference"><summary>Material gratuito para complementar</summary><p>As aulas acima são autorais e podem ser estudadas aqui. Para outra explicação em português, consulte os módulos de texto da Microsoft Learn:</p><ul><li><a href="https://learn.microsoft.com/pt-br/training/modules/csharp-write-first/" target="_blank" rel="noopener noreferrer">Escrever seu primeiro código C# (nova aba)</a>: use para rever saída e sintaxe.</li><li><a href="https://learn.microsoft.com/pt-br/training/modules/csharp-literals-variables/" target="_blank" rel="noopener noreferrer">Armazenar dados com variáveis em C# (nova aba)</a>: consulte após a aula 5.</li></ul><p>Texto em português, leitura gratuita sem login. Registro de resultados no perfil exige entrar. Duração e certificado não confirmados. Fontes consultadas em 06/11/2026.</p></details></article>
  </section>;
}
