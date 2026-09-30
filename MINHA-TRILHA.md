# Minha trilha

## Como começou

Meu primeiro computador foi o notebook Dell do meu pai, um Pentium Dual Core
com placa de vídeo integrada, que travava até com joguinho do Friv. Era nele que eu jogava Dragon City no
Facebook e passava tarde no Click Jogos. Ter um computador meu sempre foi um
sonho, e desde pequeno eu era ligado em tudo que era tecnologia.

Em 2013 eu baixei o Minecraft pirata e joguei assim até 2015. Foi em 2015 que
a coisa mudou: eu queria mudar o jogo, não só jogar. Comecei a fazer mods de
Minecraft em Java, no Eclipse, sem saber direito o que era uma classe. Foi ali
que eu descobri que gostava de programar.

Mesmo assim, o plano era fazer Direito. No fim, escolhi Engenharia de Software,
e hoje estou no 7º semestre, no Centro Universitário UDF, em Brasília.

## O caminho até aqui

| Quando | O que eu estudei ou construí |
|---|---|
| 2013 a 2015 | Minecraft, e depois mods em Java com o Eclipse |
| set/2024 | PHP básico ([Curso em Vídeo](https://github.com/SungJiinwoo/certificates)) |
| nov/2024 | SQL com MySQL (Udemy) e HTML, CSS e JavaScript (Fundação Bradesco) |
| 2025 | Orientação a objetos, estruturas de dados em Python, uma aplicação em Django, um sistema de hospital em Java e um app em React Native com a API do Spotify |
| 2026 | Complexidade de algoritmos, IA e linguagens formais na faculdade; o HERMES, sistema de gestão de um frigorífico que ajudei a desenvolver; e o TiraMil, uma plataforma de estudos para o ENEM, onde aprendi de verdade banco de dados, segurança e colocar sistema no ar |

Os projetos de 2025 estão na minha conta antiga,
[joaogbpereira](https://github.com/joaogbpereira).

## HERMES: o primeiro sistema de empresa

Em 2026 eu ajudei a desenvolver o HERMES, um sistema de gestão e controle de
relatórios para um frigorífico. É um sistema interno, então o código é
privado, mas dá para contar o que ele faz e o que eu aprendi com ele.

**O que o sistema faz**

- Relatórios a partir de modelos de formulário: o gestor monta o modelo, a
  equipe preenche, e o relatório pode ser exportado em PDF.
- Rastreabilidade e controle de GTA (Guia de Trânsito Animal), o documento que
  acompanha o transporte de animais.
- Acervo de documentos com download registrado, agenda, logística, financeiro e
  um painel de indicadores.
- Usuários com papéis diferentes, cada um vendo só o que pode, com auditoria de
  acesso e verificação em duas etapas para gestores.

**Stack:** C# com ASP.NET Core 8 (Razor Pages), Dapper, SQL Server, testes com
xUnit, publicação no IIS e CI com GitHub Actions.

**O que eu aprendi**

- **SQL sem rede de proteção.** Com o Dapper as consultas são escritas à mão,
  sem um ORM escondendo o que acontece. Tive que entender o SQL Server de
  verdade: schemas, índices e migrações em script.
- **Arquivo enviado não pode ficar na pasta pública.** Anexos e documentos
  servidos direto da `wwwroot` ficam acessíveis sem login. Todo download
  precisa passar por uma rota que confere quem está pedindo, e o caminho do
  arquivo tem que ser validado para ninguém escapar da pasta com `../`.
- **XSS aparece onde você desliga a proteção.** O Razor escapa tudo por
  padrão; o problema estava nos lugares com `Html.Raw`.
- **Publicar também é engenharia.** No IIS, sem guardar as chaves do Data
  Protection em disco, todo mundo era deslogado a cada reciclagem do servidor.
  Atrás de um proxy, sem repassar o IP real, o limite de tentativas de login
  tratava todos os usuários como se fossem uma pessoa só.
- **Não engolir exceção.** Um upload parou de funcionar por causa de um erro
  de formatação numa string, e o `catch` escondia o erro atrás de "falha ao
  salvar o arquivo". Desde então, todo `catch` registra o que aconteceu.

Foi o projeto que me mostrou a diferença entre um sistema que funciona na
minha máquina e um sistema que uma empresa usa todo dia.

## Onde eu mais aprendi

Quem mais me ensinou sobre programação e sobre a área como um todo foi o
Fabio Akita, no canal [Akitando](https://www.youtube.com/@Akitando). Ele
explica o porquê das coisas, de como o computador funciona por baixo até como
é o mercado de verdade.

Para quem está no zero, o [Curso em Vídeo](https://www.youtube.com/@CursoemVideo)
é o lugar. Foi lá que eu fiz o curso de PHP, e é um canal que ajuda muito
iniciante a dar o primeiro passo.

## O que eu aprendi no caminho

**Começar por algo que você gosta.** Eu não aprendi Java porque alguém mandou.
Aprendi porque queria mudar o Minecraft. Projeto pessoal ensina mais que
exercício solto, porque você tem motivo para insistir quando trava.

**Base primeiro, framework depois.** Eu já usei framework sem entender o que
ele fazia por baixo, e na hora do erro eu não sabia nem por onde começar.
Lógica, estruturas de dados e SQL continuam valendo em qualquer linguagem. É
por isso que existe o [fundamentos-programacao](https://github.com/SungJiinwoo/fundamentos-programacao).

**Segurança não é etapa final.** Foi colocando um sistema no ar que eu
entendi que RLS, `.env` e validação no servidor não são detalhe. É isso que o
[módulo de segurança](2-seguranca/) deste repositório tenta passar adiante.

**Escrever o que aprendeu.** Anotação com as próprias palavras mostra na hora
o que você ainda não entendeu.

## Ordem que eu recomendaria para quem está começando

1. Lógica e uma linguagem só (Python ou JavaScript), até resolver problemas
   pequenos sem consultar.
2. Git e GitHub, desde o primeiro projeto.
3. Estruturas de dados e algoritmos básicos.
4. SQL e modelagem de banco.
5. HTTP e APIs: como o navegador conversa com o servidor.
6. Um framework web e um projeto completo, do banco ao deploy.
7. Segurança, testes e CI, aplicados nesse projeto.
8. Orientação a objetos, arquitetura e métodos ágeis, que fazem mais sentido
   depois que você já sofreu com código bagunçado.
