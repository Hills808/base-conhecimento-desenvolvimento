# Mesa de atendimento — primeira conversa HTTP

Kit fictício local, sem conta, chave, pacotes externos ou dados de clientes.
Requisito: Python 3 instalado. Verifique com `py --version` no Windows ou `python3 --version` em Linux/macOS.

1. Descompacte o ZIP. Abra um terminal nessa pasta.
2. Execute `py servidor.py` (Windows) ou `python3 servidor.py` (Linux/macOS).
3. No navegador ou Bruno: GET http://localhost:5080/solicitacoes/1
4. Troque para /solicitacoes/2 e /solicitacoes/99. Compare status e JSON.
5. Em outro terminal na mesma pasta: `py verificar.py` ou `python3 verificar.py`.
6. Pare o servidor com Ctrl+C. Repita a consulta no Bruno: falha de conexão não é HTTP 404.

Se o comando Python não existir, instale Python 3 pelo site oficial https://www.python.org/downloads/ em seu computador pessoal.
Se a porta 5080 estiver ocupada, encerre somente o servidor de teste que você iniciou nessa porta; não finalize processos desconhecidos.
Se receber 404 na raiz /, use o caminho completo /solicitacoes/1.
O verificador deve falhar se um status ou dado esperado mudar. Não é um serviço de produção.
