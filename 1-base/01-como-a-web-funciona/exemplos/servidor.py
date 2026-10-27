# Servidor HTTP mínimo, só com a biblioteca padrão do Python.
from http.server import BaseHTTPRequestHandler, HTTPServer


class Handler(BaseHTTPRequestHandler):
    protocol_version = "HTTP/1.1"

    def do_GET(self):
        if self.path == "/ola":
            corpo = "Olá, cliente!".encode("utf-8")
            self.send_response(200)
        else:
            corpo = "Não encontrei esse caminho.".encode("utf-8")
            self.send_response(404)
        self.send_header("Content-Type", "text/plain; charset=utf-8")
        self.send_header("Content-Length", str(len(corpo)))
        self.end_headers()
        self.wfile.write(corpo)


if __name__ == "__main__":
    print("Servidor ouvindo em http://localhost:8000")
    HTTPServer(("localhost", 8000), Handler).serve_forever()
