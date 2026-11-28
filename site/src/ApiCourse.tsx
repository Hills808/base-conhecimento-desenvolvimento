import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import contract from '../public/lab/api/openapi.json';
import { firstProgram, oneFilter } from './data/apiExamples';
import useUrlFilter from './useUrlFilter';
import StudyCode from './StudyCode';
import './guided-course.css';
import './api-course.css';

const base = import.meta.env.BASE_URL;
const files = base + 'lab/api/';
const parts = [
  { id: 'inicio', label: 'Primeiro pedido' },
  { id: 'consultar', label: 'Combinar filtros' },
  { id: 'criar', label: 'Criar em C#' },
  { id: 'documentar', label: 'Documentar' }
] as const;
type Part = typeof parts[number]['id'];
const partHref = (part: Part) => base + '?laboratorio=apis&parte=' + part;
const tickets = contract.paths['/chamados'].get.responses['200'].content['application/json'].examples.todos.value;
const command = 'dotnet run --file Chamados.cs -- --urls http://127.0.0.1:5081';
const localUrl = 'http://127.0.0.1:5081/chamados';

const noteKey = 'curva-aberta-api-primeira-consulta';
function FirstNote() {
  const [note, setNote] = useState(() => {
    try { return localStorage.getItem(noteKey) ?? ''; } catch { return ''; }
  });
  const [canSave, setCanSave] = useState(true);
  return <div className="api-first-note">
    <label htmlFor="api-note"><b>Meu registro da primeira consulta</b></label>
    <textarea id="api-note" rows={4} maxLength={2400} value={note} placeholder={'Pedi…\nEsperava… porque…\nRecebi…'} onChange={event => {
      const value = event.target.value;
      setNote(value);
      try { localStorage.setItem(noteKey, value); setCanSave(true); } catch { setCanSave(false); }
    }} />
    <small>{canSave ? 'Seu rascunho fica neste navegador e reaparece na parte Documentar.' : 'O navegador bloqueou o salvamento. Copie o texto antes de sair.'}</small>
  </div>;
}

function FirstRequest() {
  const [fetched, setFetched] = useState(false);
  const [guess, setGuess] = useState<number | null>(null);
  const [tested, setTested] = useState(false);
  const open = tickets.filter(t => t.status === 'aberto');
  return <section className="api-experiment">
    <h2>Busque sua primeira lista de chamados</h2>
    <p>Imagine que você começou o turno no suporte. Um chamado é um pedido de ajuda. Você quer descobrir quais pedidos ainda precisam de atenção. Comece pedindo a lista completa.</p>
    <button className="api-action" onClick={() => setFetched(true)}>Buscar todos os chamados</button>
    <p><small>Simulação no navegador, com quatro chamados fictícios.</small></p>
    {fetched && <>
      <div className="api-result" role="status"><b>Seu pedido</b><p>“Mostre todos os chamados.”</p><b>Resposta recebida</b>
        <ul>{tickets.map(t => <li key={t.id}>Chamado {t.id} · {t.status}</li>)}</ul>
      </div>
      <p>Você acabou de ver os dois lados de uma consulta. O programa que pede é o <b>cliente</b>. O que recebe o pedido e responde é o <b>servidor</b>. A <b>API</b> define quais pedidos ele aceita e como responde. Os números identificam os chamados para você reconhecer o mesmo pedido em duas listas.</p>
      <details><summary>Prefiro ver alguém fazendo o pedido</summary><p>Na aula em português, procure o trecho “Acessando a API”. Pause quando o instrutor enviar o pedido. Localize o endereço que ele usou e a lista que voltou. Aqui você fez essa mesma troca na simulação.</p><a href="https://www.alura.com.br/conteudo/padroes-api-http-modelagem-apis#aula-2">Assistir à demonstração de consulta · Alura</a></details>
      <h3>Agora peça só os abertos</h3>
      <p>A mesma lista pode responder a uma pergunta mais específica. Olhe os quatro chamados acima. Se pedirmos apenas os abertos, qual número deve desaparecer?</p>
      <details><summary>Preciso de uma pista</summary><p>Leia uma linha por vez como uma frase. A primeira diz “o chamado 101 está aberto”. Ele atende ao pedido, então deve continuar. Faça o mesmo com os outros três até encontrar a linha que deixa de atender.</p></details>
      <fieldset><legend>Minha previsão</legend>{tickets.map(t => <label className="api-choice" key={t.id}><input type="radio" name="primeira-previsao" checked={guess === t.id} onChange={() => { setGuess(t.id); setTested(false); }} />{t.id}</label>)}</fieldset>
      <button className="api-action" disabled={guess === null} onClick={() => setTested(true)}>Buscar abertos e conferir</button>
      {tested && <>
        <div className="api-result" role="status"><b>Voltaram {open.map(t => t.id).join(', ')}.</b><p>{open.some(t => t.id === guess) ? 'Você previu que o ' + guess + ' sairia. Procure esse número nas duas listas. Ele continua porque está aberto.' : 'Sua previsão bateu. O 103 saiu da resposta porque está fechado.'} O chamado 103 continua na base. O filtro só mudou o que você recebeu.</p></div>
        <details><summary>Ver o pedido na linguagem da API</summary><pre><code>GET /chamados?status=aberto</code></pre><p>Leia da esquerda para a direita. <code>GET</code> pede para ler, <code>/chamados</code> escolhe a lista e <code>status=aberto</code> indica a condição. No Bruno, você poderá fazer esse mesmo pedido.</p></details>
        <h3>Conte o que aconteceu</h3><p>Como você provaria para alguém que o filtro fez diferença? Escreva o pedido, sua previsão e um número que ajude a conferir o resultado.</p>
        <FirstNote />
        <details><summary>Comparar com um registro de exemplo</summary><p>Pedi apenas os chamados abertos. Eu esperava que o 103 saísse porque estava fechado. Recebi 101, 102 e 104. Nesta base, o resultado bateu com a previsão.</p></details>
        <a className="api-next" href={partHref('consultar')}>Experimentar um segundo filtro →</a>
      </>}
    </>}
  </section>;
}

function TraceFilter() {
  const [index, setIndex] = useState(0);
  const steps = [
    { line: 1, text: 'O pedido termina em ?status=fechado. A palavra fechado entra na variável status. O ponto de interrogação em string? permite que o valor falte quando ninguém envia o filtro.' },
    { line: 7, text: 'Where seleciona itens da lista. Leia chamado => como “para cada chamado, use esta regra”. Vamos acompanhar o primeiro deles, o 101.' },
    { line: 9, text: 'null significa ausência de valor. Como o pedido trouxe fechado, semFiltro é falso. Uma variável bool só pode guardar verdadeiro ou falso.' },
    { line: 10, text: 'Compare os dois lados de ==. No 101, chamado.status vale aberto e status vale fechado. São diferentes, então mesmoStatus é falso.' },
    { line: 11, text: 'Leia || como “ou”. Para incluir o 101, ao menos uma das duas condições teria de ser verdadeira. Ambas são falsas. O 101 fica de fora.' },
    { line: 10, text: 'Agora vem o 103. O status pedido continua fechado. O chamado também está fechado. mesmoStatus passa a ser verdadeiro e a regra inclui o 103.' },
    { line: 13, text: 'O return entrega a seleção. Quando o servidor a envia como lista, chega apenas o 103. E se você retirar ?status=fechado? Preveja o valor de semFiltro e teste no Bruno.' }
  ];
  return <div className="api-experiment"><StudyCode code={oneFilter} activeLine={steps[index].line} label="Rota de consulta com a linha em estudo destacada" />
    <p aria-live="polite"><b>Passo {index + 1} de {steps.length}.</b> {steps[index].text}</p>
    <button className="api-action" disabled={!index} onClick={() => setIndex(index - 1)}>Voltar um passo</button>{' '}
    <button className="api-action" disabled={index === steps.length - 1} onClick={() => setIndex(index + 1)}>Seguir o valor</button>
  </div>;
}

function QueryPractice() {
  const [status, setStatus] = useState('');
  const [category, setCategory] = useState('');
  const [prediction, setPrediction] = useState<number[]>([]);
  const [predictNone, setPredictNone] = useState(false);
  const [sent, setSent] = useState(false);
  const params = new URLSearchParams();
  if (status) params.set('status', status);
  if (category) params.set('categoria', category);
  const path = '/chamados' + (params.size ? '?' + params : '');
  const matches = tickets.filter(t => (!status || t.status === status) && (!category || t.categoria === category));
  const extra = tickets.filter(t => prediction.includes(t.id) && !matches.includes(t));
  const missing = matches.filter(t => !prediction.includes(t.id));

  function changeQuery() {
    setPrediction([]);
    setPredictNone(false);
    setSent(false);
  }

  return <section className="api-experiment">
    <h3>Quem deveria voltar?</h3>
    <p>Esta mesa simula quatro chamados fictícios. Primeiro consulte todos. Depois aplique só <b>aberto</b>. Por último mantenha <b>aberto</b> e acrescente <b>rede</b>. A cada mudança, use a tabela para prever os IDs.</p>
    <form onSubmit={e => { e.preventDefault(); setSent(true); }}>
      <div className="api-filters">
        <label>Status<select value={status} onChange={e => { setStatus(e.target.value); changeQuery(); }}>
          <option value="">Todos</option><option>aberto</option><option>fechado</option>
        </select></label>
        <label>Categoria<select value={category} onChange={e => { setCategory(e.target.value); changeQuery(); }}>
          <option value="">Todas</option><option>rede</option><option>acesso</option>
        </select></label>
      </div>
      <pre aria-label="Requisição simulada"><code>GET {path}</code></pre>
      <fieldset><legend>Marque os chamados que você espera receber</legend>
        <table><caption>Chamados antes dos filtros</caption>
          <thead><tr><th scope="col">Previsão / ID</th><th scope="col">Status</th><th scope="col">Categoria</th><th scope="col">Prioridade</th></tr></thead>
          <tbody>{tickets.map(t => <tr key={t.id}>
            <th scope="row"><label><input type="checkbox" checked={prediction.includes(t.id)} onChange={e => {
              setPrediction(e.target.checked ? [...prediction, t.id] : prediction.filter(id => id !== t.id));
              setPredictNone(false); setSent(false);
            }} />{t.id}</label></th><td>{t.status}</td><td>{t.categoria}</td><td>{t.prioridade}</td>
          </tr>)}</tbody>
        </table>
        <label className="api-none"><input type="checkbox" checked={predictNone} onChange={e => {
          setPredictNone(e.target.checked); setPrediction([]); setSent(false);
        }} />Espero uma lista vazia</label>
      </fieldset>
      <button className="api-action" disabled={!prediction.length && !predictNone}>Executar consulta e comparar</button>
    </form>
    <div aria-live="polite">{sent && <div className="api-result">
      <h4>HTTP 200 · {matches.length} {matches.length === 1 ? 'chamado' : 'chamados'}</h4>
      <pre tabIndex={0} aria-label="Corpo da resposta JSON"><code>{matches.length ? '[\n' + matches.map(t => '  ' + JSON.stringify(t)).join(',\n') + '\n]' : '[]'}</code></pre>
      {!extra.length && !missing.length && <p>Sua previsão coincidiu com a resposta. {matches.length ? 'Troque apenas uma condição e tente explicar qual ID deve sair ou entrar.' : 'Os valores dos filtros são válidos. Nenhum chamado desta base atende à combinação.'}</p>}
      {extra.map(t => <p key={t.id}>Você incluiu <b>{t.id}</b>. Ele tem {status && status !== t.status ? <>status <b>{t.status}</b>, e a consulta pede <b>{status}</b></> : <>categoria <b>{t.categoria}</b>, e a consulta pede <b>{category}</b></>}.</p>)}
      {!!missing.length && <p>Faltou prever {missing.map(t => t.id).join(', ')}. Releia essas linhas. Elas atendem a todas as condições enviadas.</p>}
    </div>}</div>
  </section>;
}

function Consult() {
  return <>
    <h2>Leia a pergunta antes da URL</h2>
    <p>Uma equipe precisa ver os chamados de rede que ainda estão abertos. Imagine uma lista de pedidos de suporte. Cada linha tem um número próprio, chamado <b>ID</b>. Quais linhas deveriam aparecer na tela da equipe?</p>
    <p>A <b>API</b> oferece operações que outro programa pode usar. Nesta oficina, o <b>cliente</b> faz um pedido pela rede. O <b>servidor</b> recebe o pedido, escolhe os registros e devolve uma resposta. O Bruno faz o papel de cliente e deixa você enxergar os dois lados da troca.</p>
    <pre aria-label="Exemplo de consulta"><code>GET /chamados?status=aberto&amp;categoria=rede</code></pre>
    <p><code>GET</code> pede uma leitura. <code>/chamados</code> é o caminho da lista. No Swagger você encontra essa operação procurando pelo método e pelo caminho. O <code>?</code> inicia os parâmetros e o <code>&amp;</code> separa um do outro. Nesta API, a regra é que o <em>mesmo chamado</em> atenda às duas condições.</p>
    <details><summary>Ver uma consulta em vídeo</summary>
      <p>Na aula “API de exemplo”, acompanhe o trecho “Acessando a API”. Observe o endereço antes de enviar e os colchetes <code>[]</code> na resposta. Eles representam uma lista vazia. O instrutor usa Postman. Na nossa prática você pode fazer a mesma leitura no Bruno.</p>
      <a href="https://www.alura.com.br/conteudo/padroes-api-http-modelagem-apis#aula-2">Abrir a aula demonstrativa da Alura · em português</a>
      <p>A página inclui a transcrição. O curso completo é pago.</p>
    </details>
    <QueryPractice />
    <p>O <b>status HTTP</b> descreve o que aconteceu com a requisição. O campo <code>status</code> dentro do JSON descreve um chamado específico. Por isso, uma requisição bem-sucedida pode trazer um chamado fechado ou até uma lista vazia.</p>
    <details><summary>Como eu leria isso num Swagger?</summary>
      <p>Abra a operação que lista os registros. Em <b>Parameters</b>, procure o nome, os valores aceitos, se é obrigatório e onde enviar. Nesta oficina <code>status</code> e <code>categoria</code> aparecem com <code>in: query</code>, ou seja, vão na URL.</p>
      <p>Agora procure <code>prioridade</code> em <b>Responses</b>. Esse campo descreve o que você recebe. Para descobrir se ele também pode filtrar a consulta, procure a entrada correspondente. Se a documentação de outra API deixar isso em aberto, sua descoberta é precisamente essa lacuna.</p>
      <a href="https://swagger.io/docs/specification/v3_0/describing-parameters/">Parâmetros no OpenAPI · Swagger, em inglês</a>
    </details>
    <h3>Tente sem o exemplo</h3>
    <p>Troque para <b>fechado + acesso</b>. Antes de rodar, explique por que o 102 e o 103, juntos, ainda podem produzir uma lista vazia. Depois compare a sua explicação com a tabela.</p>
    <a className="api-next" href={partHref('criar')}>Continuar para a criação da API →</a>
  </>;
}

function Create() {
  return <>
    <h2>Faça uma rota responder no seu computador</h2>
    <p>Agora você controla o servidor. A meta é acompanhar um valor que saiu da URL, entrou no C# e decidiu se um chamado seria devolvido.</p>
    <h3>Comece com uma resposta de uma linha</h3>
    <p>Crie uma pasta de estudo vazia no VS Code. Dentro dela, crie <code>Chamados.cs</code> e digite as cinco linhas abaixo. No menu Terminal, abra um novo terminal nessa pasta. Execute <code>dotnet --version</code> para conferir se tem o SDK .NET 10 ou posterior. <a href="https://dotnet.microsoft.com/pt-br/download/dotnet/10.0">Obter o SDK .NET 10</a>.</p>
    <StudyCode code={firstProgram} label="Primeira API em cinco linhas" />
    <p>As duas linhas com <code>#:</code> configuram o arquivo para usar as ferramentas de web e a compilação comum do .NET. A terceira cria a aplicação. <code>MapGet</code> liga o caminho ao código que responde. <code>Run</code> deixa o programa ouvindo os pedidos que chegam.</p>
    <pre tabIndex={0} aria-label="Comando para iniciar o servidor"><code>{command}</code></pre>
    <p>Deixe o terminal aberto. No Bruno, crie uma requisição HTTP, escolha <b>GET</b>, cole <code>{localUrl}</code> e envie. Esse endereço aponta para seu próprio computador. A primeira resposta deve ser <code>["primeiro chamado"]</code>. Também dá para abrir essa URL no navegador.</p>
    <details><summary>Ver onde a API entra numa aplicação em C#</summary>
      <p>No vídeo “Centralizando as informações através de uma API”, André Bessa mostra o que acontece quando diferentes pessoas precisam consultar os mesmos dados. O exemplo usa um projeto .NET 8. Volte à sua rota e identifique qual programa mantém os chamados e qual envia o pedido.</p>
      <a href="https://www.alura.com.br/conteudo/dotnet-criando-api-web-asp-net-core#aula-1">Aula demonstrativa de ASP.NET Core · Alura, em português</a>
    </details>
    <h3>Faça um valor da URL mudar a resposta</h3>
    <p>Pare o servidor com <kbd>Ctrl</kbd> + <kbd>C</kbd>. Substitua só a linha que começa com <code>app.MapGet</code> por este bloco, salve e execute o mesmo comando.</p>
    <TraceFilter />
    <p>Envie primeiro <code>/chamados</code> e depois <code>/chamados?status=fechado</code>. Preveja qual ID vai sumir. A mudança observada mostra onde a sua linha de C# fez diferença.</p>
    <details><summary>Meu teste deu outro resultado</summary>
      <p><b>Conexão recusada</b> indica que o cliente não conseguiu se conectar. Confira se o terminal continua aberto e se o endereço e a porta coincidem. <b>404</b> indica que houve resposta HTTP. Confira o caminho registrado em <code>MapGet</code>. Se ainda receber a mensagem da primeira versão, salve o arquivo e reinicie o servidor.</p>
    </details>
    <h3>Leia e modifique uma implementação completa</h3>
    <p>Baixe a versão com quatro registros em outra pasta, abra o código e rode o mesmo comando após parar a versão anterior. Localize <code>atendeStatus</code> e <code>atendeCategoria</code>. O laço <code>foreach</code> visita um chamado por vez. O operador <code>&amp;&amp;</code> exige que as duas condições sejam verdadeiras antes de adicionar esse chamado à resposta.</p>
    <a href={files + 'Chamados.cs'} download="Chamados.cs">Baixar a API de chamados em C#</a>
    <p>Repita a consulta de rede em aberto no Bruno e compare os IDs com a mesa. Na versão que você baixou, envie também <code>/chamados?prioridade=alta</code>. Por que o 101, de prioridade normal, continua vindo? Procure onde essa rota lê os parâmetros.</p>
    <p>Agora implemente um filtro opcional por <code>prioridade</code>. Pense em duas entradas que mostrem que ele funciona e numa consulta antiga que precise continuar funcionando.</p>
    <details><summary>Uma pista e três testes para conferir minha mudança</summary>
      <p>Adicione <code>string? prioridade</code> aos parâmetros da rota. Confira os valores aceitos, compare o valor recebido com <code>chamado.Prioridade</code> e inclua essa comparação no <code>if</code> que seleciona os registros.</p>
      <ul><li>Aberto + rede deve continuar trazendo 101 e 104.</li><li>Aberto + rede + alta deve trazer apenas 104. O 101 diferencia as duas consultas.</li><li>Um valor como <code>prioridade=urgente</code> deve devolver 400 e explicar quais valores são aceitos.</li></ul>
    </details>
    <p><a href="https://docs.usebruno.com/get-started/bruno-basics/create-a-request">Criar uma requisição no Bruno · em inglês</a> · <a href="https://learn.microsoft.com/pt-br/dotnet/core/sdk/file-based-apps">Executar um arquivo C# · Microsoft Learn</a></p>
    <a className="api-next" href={partHref('documentar')}>Continuar para a documentação →</a>
  </>;
}

function Document() {
  return <>
    <h2>Documente para quem vai usar sua API</h2>
    <p>Imagine que amanhã outra pessoa vai integrar a consulta sem abrir o seu C#. Ela precisa conseguir montar a primeira chamada, reconhecer o resultado esperado e entender um erro. Quem lê sua spike tem outra decisão a tomar: o que já foi comprovado e o que ainda precisa de investigação?</p>
    <h3>Escreva o contrato de uso</h3>
    <details><summary>Transformar meu primeiro registro em documentação</summary><FirstNote /><p>Releia a frase “Pedi…”. Acrescente o método e o caminho para outra pessoa repetir a consulta. Em “Recebi…”, indique o que os números identificam. Guarde a previsão e a comparação para a spike.</p></details>
    <p><b>Exemplo da versão 1.0.0.</b> Para listar os chamados, envie <code>GET /chamados</code>. Os parâmetros opcionais <code>status</code> (aberto ou fechado) e <code>categoria</code> (rede ou acesso) vão na URL. Juntos, restringem a lista aos chamados que atendem a ambos. Cada item devolve ID, status, categoria e prioridade.</p>
    <div className="api-document-example"><code>GET /chamados?status=fechado&amp;categoria=acesso</code><p><b>HTTP 200</b> com <code>[]</code>. As entradas são válidas e nenhum dos quatro registros atende às duas.</p>
      <code>GET /chamados?status=pausado</code><p><b>HTTP 400</b> com <code>{'{"erro":"Use aberto ou fechado em status."}'}</code>. Corrija o valor e repita a consulta.</p></div>
    <p>Abra o contrato em um editor ou importe o arquivo OpenAPI no Bruno. Localize <code>parameters</code>, depois <code>responses</code>. Se você implementou o filtro por prioridade, documente onde ele entra, os valores aceitos, o comportamento quando omitido e exemplos de sucesso e erro. Identifique a nova versão.</p>
    <a href={files + 'openapi.json'} download="openapi.json">Baixar o contrato OpenAPI da versão 1.0.0</a>
    <details><summary>Ver como outra pessoa escreve uma documentação</summary>
      <p>Na aula “Escrevendo documentação com Swagger”, observe como uma rota aparece na interface de quem vai consumi-la. Volte ao nosso contrato e localize onde outra pessoa descobriria o formato da lista e um valor válido para o filtro.</p>
      <a href="https://www.alura.com.br/conteudo/swagger-documentando-apis-rest-openapi#aula-0">Aula demonstrativa de Swagger e OpenAPI · Alura, em português</a>
      <p>A página traz o vídeo e a transcrição. O curso completo é pago.</p>
    </details>
    <h3>Sustente a conclusão da spike com um teste</h3>
    <p>Uma <b>spike</b> é uma investigação para reduzir uma incerteza antes de tomar uma decisão. Neste caso, a pergunta é se os dois filtros funcionam juntos. Antes de enviar a consulta, escreva quais IDs deveriam aparecer e qual ID revelaria um problema.</p>
    <p><b>Desafio.</b> Uma segunda implementação fictícia recebe <code>status=aberto&amp;categoria=rede</code> e devolve HTTP 200 com os IDs <b>101, 102 e 104</b>. Use a tabela da primeira parte. Qual registro contradiz o contrato? O que você pode concluir desse teste? Que outra consulta ajudaria a localizar a diferença?</p>
    <details><summary>Comparar meu raciocínio com uma análise</summary>
      <p>O 102 está aberto, mas é da categoria acesso. Ele deveria ficar de fora. O resultado observado contradiz a regra dos dois filtros para esse caso. Ainda há mais de uma explicação possível.</p>
      <p>Uma investigação seria repetir apenas <code>categoria=rede</code>, mantendo a mesma base e versão. Se o 102 sair nessa consulta e reaparecer ao acrescentar <code>status=aberto</code>, a diferença aponta para a combinação. Guarde também o caso que esperava vazio.</p>
    </details>
    <p><b>Entrega.</b> Preencha o caderno com a sua execução local. Registre versão, ambiente, entrada, esperado, observado, interpretação e lacuna. Depois tente reproduzir a consulta usando só o que você escreveu. Se precisar adivinhar um valor ou um endereço, esse detalhe ainda precisa entrar no documento.</p>
    <a className="api-next" href={files + 'caderno-api.md'} download="caderno-api.md">Baixar caderno de documentação e spike (.md)</a>
    <p><a href="https://swagger.io/docs/specification/v3_0/describing-responses/">Como descrever respostas no OpenAPI · Swagger, em inglês</a></p>
    <details><summary>Como continuar no laboratório de APIs e MCP?</summary>
      <p>Ao conseguir explicar a consulta, a próxima prática é transformar essa evidência em um teste que você pode repetir. Depois, use o contrato para reconhecer dados ausentes e falhas numa integração.</p>
      <ul><li><a href={base + '?modulo=09&etapa=2'}>Guardar e repetir testes no Bruno</a></li><li><a href={base + '?modulo=09&etapa=3'}>Ler contratos e estados de resposta</a></li><li><a href={base + '?modulo=09&etapa=7'}>Investigar como uma API .NET monta a resposta</a></li></ul>
    </details>
  </>;
}

export default function ApiCourse() {
  const [part] = useUrlFilter('parte', 'inicio', parts.map(p => p.id));
  return <article className="api-course">
    <a className="api-back" href={base + '?modulo=09'}><ArrowLeft size={16} aria-hidden="true" /> Laboratório de APIs e MCP</a>
    <header><h1>APIs na prática</h1><p>Do primeiro pedido no navegador a uma rota em C# que outra pessoa consegue usar pela sua documentação.</p></header>
    <nav aria-label="Partes da oficina">{parts.map((p, i) => <a key={p.id} href={partHref(p.id)} aria-current={part === p.id ? 'step' : undefined}>{i + 1}. {p.label}</a>)}</nav>
    <div className="api-lesson">{part === 'criar' ? <Create /> : part === 'documentar' ? <Document /> : part === 'consultar' ? <Consult /> : <FirstRequest />}</div>
  </article>;
}
