# 04. Variáveis de ambiente

## O que eu preciso saber daqui

Variável de ambiente é um valor que o sistema operacional entrega para o
programa quando ele começa a rodar. O programa lê esse valor por nome. Serve
para a **configuração** do sistema: tudo que muda de um lugar para outro sem o
código mudar.

O mesmo código roda no meu notebook, no servidor de testes e em produção. O que
muda entre eles é a configuração: qual banco usar, em qual porta subir, qual
chave de API usar. Se isso estivesse escrito no código, eu teria que mudar o
código para cada lugar. Com variável de ambiente, o código fica igual e cada
ambiente entrega os seus valores.

Essa ideia de separar configuração do código é um dos princípios do
[The Twelve-Factor App](https://12factor.net/pt_br/config), um guia bem
conhecido de como construir aplicação web.

## Vendo uma na prática

Todo sistema já tem várias. Por exemplo, o `PATH`, que diz onde procurar os
programas:

```bash
# Linux, macOS ou Git Bash
echo $PATH

# PowerShell (Windows)
$env:PATH
```

Criando uma e rodando um programa com ela:

```bash
# Linux, macOS ou Git Bash
PORTA=8080 python servidor.py

# PowerShell
$env:PORTA = "8080"; python servidor.py
```

## Lendo no código

| Linguagem | Como ler |
|---|---|
| Python | `os.environ.get("PORTA", "3000")` |
| JavaScript (Node) | `process.env.PORTA ?? "3000"` |
| Java | `System.getenv("PORTA")` |
| C# | `Environment.GetEnvironmentVariable("PORTA")` |

Repare que o valor chega sempre como **texto**. `"8080"` precisa virar número
antes de ser usado como número.

```python
import os

porta = int(os.environ.get("PORTA", "3000"))
print(f"Subindo na porta {porta}")
```

## E o arquivo `.env`?

Digitar dez variáveis toda vez que roda o projeto não dá. Por isso existe o
arquivo `.env`: uma lista de `NOME=valor` que uma biblioteca lê e coloca nas
variáveis de ambiente quando o programa começa.

```bash
PORTA=3000
DATABASE_URL=postgres://usuario:senha@localhost:5432/meubanco
```

| Stack | Quem lê o `.env` |
|---|---|
| Python | a biblioteca `python-dotenv` |
| Node | a biblioteca `dotenv`, ou o próprio Node a partir da versão 20.6 com `node --env-file=.env` |
| Next.js e Vite | o próprio framework, automaticamente |

Importante: o `.env` é só um jeito cômodo de preencher as variáveis na **sua
máquina**. Em produção quase nunca existe arquivo `.env`: a hospedagem (Vercel,
Render, Railway, um servidor com Docker) tem uma tela ou um arquivo de
configuração onde você cadastra as variáveis.

## Onde cada coisa fica

| Ambiente | Onde ficam as variáveis |
|---|---|
| Minha máquina | arquivo `.env` (fora do git) |
| CI (GitHub Actions) | *Secrets* do repositório |
| Produção | painel da hospedagem |

## O que costuma confundir no começo

- Mudar o `.env` com o servidor rodando e nada acontecer. O valor é lido
  quando o programa começa: tem que reiniciar.
- Esquecer que o valor é texto. `"false"` é um texto não vazio, e em
  JavaScript `if ("false")` é verdadeiro.
- Achar que o `.env` vai junto no deploy. Não vai, e nem deve: as variáveis
  são cadastradas na hospedagem.

## Próximo passo

Algumas dessas variáveis são **segredos**, como a senha do banco no
`DATABASE_URL`. Como proteger isso está em
[Segredos e `.env`](../../2-seguranca/01-segredos-e-env/README.md), na parte de
segurança.
