# 01. Segredos e `.env`

## O que eu preciso saber daqui

Segredo é tudo que dá acesso a alguma coisa: senha de banco, chave de API,
token, chave de assinatura de JWT, segredo de webhook, chave privada. Segredo
não vai para o código, não vai para o git e não vai para o navegador. Ele vive
em variável de ambiente, e o projeto se recusa a subir se ela estiver faltando
ou fraca.

## Os três arquivos

| Arquivo | Vai para o git? | Para quê |
|---|---|---|
| `.env` / `.env.local` | **Nunca** | Os valores reais, só na sua máquina |
| `.env.example` | Sim | A lista de variáveis, **sem valores secretos**, para quem clonar saber o que preencher |
| `.gitignore` | Sim | Garante que o `.env` nunca seja adicionado por engano |

Veja os modelos em [`exemplos/`](exemplos/).

O `.env.example` pode ter valor quando o valor não é segredo (porta, modelo,
limites). Segredo fica vazio:

```bash
PORT=3000
DATABASE_URL=
JWT_SECRET=
```

## Variável pública x privada

Em frameworks de frontend, variáveis com certo prefixo são **copiadas para o
JavaScript que vai para o navegador**. Qualquer pessoa lê abrindo o DevTools.

| Framework | Prefixo que vai para o navegador |
|---|---|
| Next.js | `NEXT_PUBLIC_` |
| Vite | `VITE_` |
| Create React App | `REACT_APP_` |

Então `NEXT_PUBLIC_STRIPE_SECRET_KEY` é um vazamento com nome bonito. No
Supabase, por exemplo, a chave *publishable* pode ir para o navegador (ela
depende do RLS para proteger os dados), mas a *secret* nunca.

## Validar na subida (fail fast)

Se falta uma variável, o erro tem que aparecer quando o servidor sobe, não na
primeira compra de um cliente. E tem que recusar valor de exemplo que alguém
esqueceu de trocar. Modelo em [`exemplos/env.ts`](exemplos/env.ts), com Zod.

O que eu confiro na subida:

- variável obrigatória presente;
- segredo com tamanho mínimo (32 caracteres para chave de assinatura);
- nenhum valor de exemplo (`change-me`, `secret`, `123456`);
- em produção, URL pública com `https` e sem `localhost`;
- nenhuma variável pública com cara de segredo.

## O default perigoso

Isso aparece muito em `docker-compose.yml`:

```yaml
environment:
  JWT_SECRET: ${JWT_SECRET:-dev-secret}
```

Se ninguém definir `JWT_SECRET`, o sistema sobe assinando tokens com
`dev-secret`, que está publicado no próprio repositório. Qualquer um forja um
token de admin. Default para segredo não existe: sem valor, não sobe.

## Vazou. E agora?

A ordem importa:

1. **Troque a chave primeiro** (revogue e gere outra no painel do serviço).
   Robôs varrem o GitHub atrás de chaves em segundos; apagar o commit depois
   não desfaz o vazamento.
2. Só então limpe o histórico, se quiser (`git filter-repo`). Forks e clones
   que já existem continuam com a chave, por isso o passo 1 é o que resolve.
3. Veja nos logs do serviço se a chave foi usada enquanto esteve exposta.

## Ferramentas que eu uso

- **gitleaks** no CI, varrendo o histórico inteiro a cada push.
- **Push protection** do GitHub, que bloqueia o push quando detecta uma chave.
  Em repositório público vem ligado por padrão para usuários
  ([documentação](https://docs.github.com/en/code-security/secret-scanning/introduction/about-push-protection)).
- Log sem segredo: nunca registrar corpo de requisição, header `Authorization`
  ou URL com token.

## O que costuma confundir no começo

- Achar que repositório privado é lugar seguro para chave. Não é: ele vira
  público um dia, ou alguém com acesso sai da equipe.
- Colocar a chave no frontend "só para testar".
- Apagar o `.env` do git com um commit novo e achar que resolveu. O valor
  continua no histórico.
