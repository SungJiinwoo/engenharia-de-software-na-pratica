# Cliente que fala HTTP "na mão": abre a conexão e manda o texto do pedido.
import socket
import sys

caminho = sys.argv[1] if len(sys.argv) > 1 else "/ola"

pedido = (
    f"GET {caminho} HTTP/1.1\r\n"
    "Host: localhost:8000\r\n"
    "Connection: close\r\n"
    "\r\n"
)

with socket.create_connection(("localhost", 8000)) as conexao:
    conexao.sendall(pedido.encode("ascii"))
    resposta = b""
    while True:
        pedaco = conexao.recv(4096)
        if not pedaco:
            break
        resposta += pedaco

print(resposta.decode("utf-8"))
