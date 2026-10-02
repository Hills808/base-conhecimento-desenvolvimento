# Primeiro servidor MCP local, sem modelo

Pré-requisitos: completar a etapa de console C#, ter SDK .NET suportado, Node/npm para o Inspector e acesso à instalação de pacotes. Não precisa de conta de modelo. Este kit é referência de ensino baseada no SDK oficial v1; a linha v2 já existe. Não misture exemplos. Código C# revisado contra documentação, mas não executado no ambiente de publicação deste site. Execute build e os casos abaixo na sua máquina e guarde evidências.

## 1. Projeto separado
No terminal:
```sh
dotnet new console -n PerfilMcp
cd PerfilMcp
dotnet add package ModelContextProtocol --version 1.4.1
dotnet add package Microsoft.Extensions.Hosting --version 10.0.0
```
Abra o arquivo baixado PerfilMcp.Program.cs. Copie TODO o conteúdo para o Program.cs criado. Não mantenha dois arquivos com código de nível superior no mesmo projeto.

```sh
dotnet build
dotnet list package
```
Confirme zero erros e anote versões. Se houver erro, compare a linha e a versão com a documentação oficial v1; não resolva instalando aleatoriamente outro SDK. Nenhum dado real ou token pertence ao exercício.

## 2. Inicie pelo Inspector
Na pasta do projeto, execute:
```sh
npx @modelcontextprotocol/inspector dotnet run --no-build --project PerfilMcp.csproj
```
O npm pode pedir instalação do pacote: confira que é o Inspector oficial. A versão resolvida pode mudar; registre-a para reproduzir. Abra a URL local mostrada pelo Inspector e use sua sessão local. Não compartilhe tokens/URLs de sessão. A interface pode variar por versão. O Inspector inicia o servidor filho e conecta usando stdio.

Se iniciar dotnet run sozinho, o programa pode ficar aguardando mensagens: não é um chat. Não escreva logs com Console.WriteLine no servidor stdio.

## 3. Descubra, depois chame
Na área Tools, liste as tools. Procure consultar_perfil, leia descrição e inputSchema; a entrada é clienteId, texto. Depois chame com:
```json
{"clienteId":"demo-1"}
```
O resultado contém um bloco textual com JSON de negócio: status partial, nome Lia Demo, biografia null, missingFields e source. Isso não equivale a structuredContent. Confira Content e IsError no resultado; os nomes visuais variam por versão do Inspector.

Tente demo-2 e texto vazio: a função valida e falha sem ler outro registro. O SDK retorna erro da tool, normalmente com mensagem genérica para ArgumentException. Experimente também um tipo numérico em clienteId e observe a validação/erro do SDK. Não confunda nenhum deles com nosso estado de negócio partial.

## 4. O que demonstrou e o que ainda falta
Demonstrou descoberta, chamada e resultado de uma tool fixa sem LLM. Ainda não há integração HTTP, login/autorização real, prompt, RAG ou teste probabilístico. ReadOnly descreve a capacidade; não implementa bloqueio de escrita. demo-2 inválido é restrição do catálogo de ensino, não um teste de autorização real.

## 5. Próxima entrega
Na etapa Integração, preserve o contrato e troque o resultado fixo por uma GET da API local. Teste as camadas isoladas. Para adotar v2, crie um branch, leia documentação/migração correspondente e repita listagem, schema, erro e regressão antes de mudar os exemplos.

Referências oficiais:
- https://csharp.sdk.modelcontextprotocol.io/v1/concepts/getting-started.html
- https://csharp.sdk.modelcontextprotocol.io/v1/api/ModelContextProtocol.Server.McpServerToolAttribute.html
- https://github.com/modelcontextprotocol/inspector
- https://www.nuget.org/packages/ModelContextProtocol/1.4.1
