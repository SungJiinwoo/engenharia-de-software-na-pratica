# Engenharia de software na prática

O que a faculdade ensina em teoria e o que eu fui aprendendo colocando projeto
no ar: como a web funciona, APIs, banco, login, git, segurança, métodos ágeis e
as normas ISO que aparecem nas disciplinas. Tudo explicado do jeito que eu
gostaria de ter lido quando comecei.

O [fundamentos-programacao](https://github.com/SungJiinwoo/fundamentos-programacao)
cobre a base de programação (lógica, estruturas de dados, algoritmos). Este aqui
é o passo seguinte: como construir um sistema de verdade sem abrir brecha.

Como eu cheguei até aqui, do notebook do meu pai aos mods de Minecraft, está em
[MINHA-TRILHA.md](MINHA-TRILHA.md), junto com a ordem de estudo que eu
recomendaria para quem está começando.

Regra que eu sigo em tudo aqui: nada de achismo. Quando cito uma norma, uma
categoria da OWASP ou o comportamento de uma ferramenta, é porque conferi na
fonte oficial, e o link está no texto.

## Trilha

A ordem importa. Cada parte usa o que veio antes: não dá para proteger um
segredo sem saber o que é uma variável de ambiente, nem entender IDOR sem saber
o que é um endpoint.

**Parte 1. Base: como um sistema funciona**

| # | Assunto | Estado |
|---|---|---|
| 01 | Como a web funciona: cliente, servidor e HTTP | |
| 02 | APIs e endpoints: REST, métodos e status | |
| 03 | Banco de dados no backend: conexão, SQL e migrações | |
| 04 | [Variáveis de ambiente: configuração fora do código](1-base/04-variaveis-de-ambiente/README.md) | feito |
| 05 | Git e GitHub: commit, branch, pull request e `.gitignore` | |
| 06 | Login: autenticação, autorização, senha, sessão e JWT | |

**Parte 2. Segurança: como não abrir brecha**

| # | Assunto | Estado |
|---|---|---|
| 01 | [Segredos e `.env`: o que nunca vai para o git](2-seguranca/01-segredos-e-env/README.md) | feito |
| 02 | [As cinco falhas que mais aparecem em projeto real](2-seguranca/02-as-cinco-falhas/README.md) | feito |
| 03 | Banco com tranca: RLS e isolamento por usuário | |
| 04 | Login seguro: hash de senha, 2FA e limite de tentativas | |
| 05 | Webhooks e integrações de pagamento | |
| 06 | Git seguro: histórico, branch protegida e revisão | |

**Parte 3. Processo: como trabalhar em equipe**

| # | Assunto | Estado |
|---|---|---|
| 01 | [Como usar IA para estudar (sem deixar ela estudar por você)](3-processo/01-estudar-com-ia.md) | feito |
| 02 | Métodos ágeis: Scrum e Kanban sem enrolação | |
| 03 | Normas ISO que caem na faculdade (12207, 25010, 29119, 27001) | |
| 04 | Testes: unidade, integração e testes de ataque | |
| 05 | CI/CD: o que rodar a cada push | |

Os módulos que faltam vão entrando aos poucos, na ordem.

Se algo aqui estiver errado ou confuso, abre uma issue. Corrigir um erro meu
ajuda o próximo que ler.
