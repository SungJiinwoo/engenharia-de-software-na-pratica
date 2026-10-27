# 01. Como a web funciona: cliente, servidor e HTTP

## O que eu preciso saber daqui

A web é uma conversa entre dois programas. O **cliente** pede alguma coisa e o
**servidor** responde. O navegador é um cliente, mas um app de celular, o `curl`
no terminal ou um script Python também são. O servidor é só um programa
esperando pedidos numa porta.

A língua dessa conversa é o **HTTP**. Um pedido HTTP é um texto com regras
fixas, e a resposta também. Entender esse texto é a base de tudo que vem depois:
API, login, cookie, segurança.

## O caminho de um pedido

Quando eu digito `http://localhost:8000/ola` no navegador, acontece mais ou
menos isto:

| Passo | O que acontece |
|---|---|
| 1 | O navegador separa a URL: protocolo (`http`), endereço (`localhost`), porta (`8000`) e caminho (`/ola`) |
| 2 | Se o endereço é um nome, o computador pergunta ao **DNS** qual é o IP dele (ou usa um que já guardou em cache) |
| 3 | O navegador abre uma conexão com aquele IP, naquela porta |
| 4 | Manda o pedido HTTP, em texto |
| 5 | O servidor lê o pedido, decide o que fazer e manda a resposta |
| 6 | O navegador mostra o resultado |

O passo 2 está explicado na página da MDN sobre
[nomes de domínio](https://developer.mozilla.org/pt-BR/docs/Learn_web_development/Howto/Web_mechanics/What_is_a_domain_name).
O resto deste módulo é sobre os passos 4 e 5.

## Um servidor de verdade, em poucas linhas

Em [exemplos/servidor.py](exemplos/servidor.py) tem um servidor que só usa a
biblioteca padrão do Python. Ele responde `200` em `/ola` e `404` em qualquer
outro caminho.

```bash
python exemplos/servidor.py
```

Ele serve para estudar, não para colocar no ar: a própria
[documentação do `http.server`](https://docs.python.org/3/library/http.server.html)
avisa que ele não é recomendado para produção.

## O pedido é só texto

Para ver que não tem mágica, [exemplos/cliente_cru.py](exemplos/cliente_cru.py)
abre a conexão e escreve o pedido na mão. Com o servidor rodando, em outro
terminal:

```bash
python exemplos/cliente_cru.py /ola
```

O que ele manda é exatamente isto:

```
GET /ola HTTP/1.1
Host: localhost:8000
Connection: close

```

E o que volta (saída real, só a data muda):

```
HTTP/1.1 200 OK
Server: BaseHTTP/0.6 Python/3.14.4
Date: Tue, 27 Oct 2026 12:10:45 GMT
Content-Type: text/plain; charset=utf-8
Content-Length: 14

Olá, cliente!
```

Pedindo `/nada`, a primeira linha vira `HTTP/1.1 404 Not Found`. Mandando um
`POST`, que o servidor não trata, vem `501 Unsupported method ('POST')`.

## As partes de uma mensagem

Pedido e resposta têm o mesmo formato, definido na
[RFC 9112](https://www.rfc-editor.org/rfc/rfc9112.html), seção 2.1:

| Parte | No pedido | Na resposta |
|---|---|---|
| Linha inicial | método, caminho e versão: `GET /ola HTTP/1.1` | versão, código e frase: `HTTP/1.1 200 OK` |
| Cabeçalhos | um por linha, `Nome: valor` | um por linha, `Nome: valor` |
| Linha vazia | marca o fim dos cabeçalhos | marca o fim dos cabeçalhos |
| Corpo | opcional (um `GET` normalmente não tem) | o conteúdo em si |

Cada linha termina com `\r\n`, por isso o cliente escreve isso no fim de cada
uma. E o cabeçalho `Host` não é enfeite: a RFC 9112 (seção 3.2) diz que o
cliente tem que mandar `Host` em todo pedido HTTP/1.1, e que o servidor deve
responder `400` se ele faltar.

## Os códigos de status

O número da resposta diz como foi. A
[RFC 9110](https://www.rfc-editor.org/rfc/rfc9110.html), seção 15, divide em
cinco faixas:

| Faixa | Significa | Exemplo |
|---|---|---|
| 1xx | informativo, ainda não acabou | `100 Continue` |
| 2xx | deu certo | `200 OK` |
| 3xx | redirecionamento, procure em outro lugar | `301 Moved Permanently` |
| 4xx | erro do cliente, o pedido veio errado | `404 Not Found` |
| 5xx | erro do servidor, o pedido estava certo mas ele falhou | `501 Not Implemented` |

A regra que eu uso para lembrar: 4 é culpa de quem pediu, 5 é culpa de quem
respondeu. Métodos e status com mais detalhe ficam para o próximo módulo.

## Cada pedido é sozinho

A RFC 9110 (seção 3.3) define o HTTP como **sem estado** (*stateless*): cada
pedido pode ser entendido isolado, sem depender dos anteriores. O servidor do
exemplo não lembra de quem pediu `/ola` um segundo atrás.

Isso responde uma dúvida que aparece cedo: se o HTTP não lembra de nada, como
um site sabe que eu estou logado? A resposta é que o cliente manda alguma
prova junto em **todo** pedido, normalmente num cabeçalho (cookie ou token).
Isso é o assunto do módulo de login.

## E o HTTPS?

É o mesmo HTTP, com as mesmas linhas e cabeçalhos, só que a conexão do passo 3
é criptografada com TLS antes de qualquer texto passar. Sem isso, qualquer um
no meio do caminho (o Wi-Fi do shopping, por exemplo) consegue ler o pedido
inteiro, senha incluída. Por isso todo site com login precisa de HTTPS.

## Vendo com o `curl`

O `curl -v` mostra a conversa inteira sem precisar de script. As linhas com `>`
são o que foi mandado e as com `<` são o que voltou:

```bash
curl -v http://localhost:8000/ola
```

No navegador, a mesma coisa aparece na aba **Rede** (*Network*) das
ferramentas de desenvolvedor (F12). A
[visão geral do HTTP na MDN](https://developer.mozilla.org/pt-BR/docs/Web/HTTP/Guides/Overview)
é uma boa leitura para depois deste módulo.

## O que costuma confundir no começo

- Achar que cliente é sinônimo de navegador. Qualquer programa que manda o
  pedido é cliente, inclusive um servidor falando com outro servidor.
- Confundir `localhost` com "a internet". `localhost` é a própria máquina; o
  pedido nem sai do computador.
- Achar que `Content-Length` conta letras. Conta **bytes**: `Olá, cliente!`
  tem 13 caracteres, mas 14 bytes em UTF-8, porque o `á` ocupa dois.
- Ver um `404` e achar que o servidor caiu. Se veio `404`, o servidor está de
  pé e respondeu; quem errou foi o caminho pedido. Servidor fora do ar nem
  responde: dá erro de conexão.
- No Git Bash do Windows, passar `/ola` como argumento e o caminho virar
  `C:/Program Files/Git/ola`. É o Git Bash convertendo o que parece caminho de
  arquivo. Rodando com `MSYS_NO_PATHCONV=1` na frente, ou no PowerShell, não
  acontece.

## Próximo passo

Agora que dá para ler um pedido HTTP, o próximo módulo organiza isso em
**APIs**: o que cada método significa, como desenhar os caminhos e qual status
devolver em cada caso.
