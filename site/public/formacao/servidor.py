"""API didática local. Somente biblioteca padrão do Python 3; dados fictícios."""
import json
from http.server import BaseHTTPRequestHandler, HTTPServer
from urllib.parse import urlsplit

class Handler(BaseHTTPRequestHandler):
    def send_json(self, status, data):
        body = json.dumps(data, ensure_ascii=False).encode('utf-8')
        self.send_response(status)
        self.send_header('Content-Type', 'application/json; charset=utf-8')
        self.send_header('Content-Length', str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def do_GET(self):
        records = {
            '/solicitacoes/1': {'id': 1, 'minutos': 0, 'responsavel': None},
            '/solicitacoes/2': {'id': 2, 'minutos': 35, 'responsavel': 'Equipe Azul', 'prioridade': 'alta'},
        }
        record = records.get(urlsplit(self.path).path)
        self.send_json(200 if record else 404, record or {'erro': 'Solicitação não encontrada'})

    def do_POST(self):
        self.send_json(405, {'erro': 'Use GET para consultar'})

if __name__ == '__main__':
    print('API fictícia em http://localhost:5080. Ctrl+C para parar.', flush=True)
    HTTPServer(('127.0.0.1', 5080), Handler).serve_forever()
