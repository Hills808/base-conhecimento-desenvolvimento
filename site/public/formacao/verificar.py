"""Execute com o servidor.py ligado: py verificar.py ou python3 verificar.py."""
import json
from urllib.request import Request, urlopen
from urllib.error import HTTPError

def request(path, method='GET'):
    try:
        response = urlopen(Request('http://127.0.0.1:5080' + path, method=method), timeout=3)
    except HTTPError as error:
        response = error
    with response:
        return response.status, json.load(response)

status, body = request('/solicitacoes/1')
assert status == 200 and body == {'id': 1, 'minutos': 0, 'responsavel': None}
status, body = request('/solicitacoes/2')
assert status == 200 and body['prioridade'] == 'alta'
status, body = request('/solicitacoes/99')
assert status == 404 and body['erro'] == 'Solicitação não encontrada'
status, body = request('/solicitacoes/1', 'POST')
assert status == 405
print('4 casos aprovados: dois registros, ausência e método não permitido.')
