// Validação das variáveis de ambiente na subida do servidor (Node + Zod).
// Importe este arquivo no ponto de entrada: se algo estiver errado, o processo
// para com uma mensagem clara, antes de atender qualquer requisição.
import { z } from "zod";

const valoresDeExemplo = /^(change-?me|secret|senha|password|123456|dev-secret)$/i;

const segredo = z
  .string()
  .min(32, "precisa ter pelo menos 32 caracteres")
  .refine((v) => !valoresDeExemplo.test(v), "ainda está com o valor de exemplo");

const Env = z
  .object({
    NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
    PORT: z.coerce.number().int().default(3000),
    DATABASE_URL: z.string().url(),
    JWT_SECRET: segredo,
    WEBHOOK_SECRET: segredo.optional(),
    PUBLIC_URL: z.string().url(),
  })
  .superRefine((env, ctx) => {
    if (env.NODE_ENV !== "production") return;
    const url = new URL(env.PUBLIC_URL);
    if (url.protocol !== "https:" || url.hostname === "localhost") {
      ctx.addIssue({ code: "custom", path: ["PUBLIC_URL"], message: "em produção precisa ser https e não pode ser localhost" });
    }
  });

const resultado = Env.safeParse(process.env);
if (!resultado.success) {
  // Mostra QUAL variável está errada, nunca o valor dela.
  const erros = resultado.error.issues.map((i) => `- ${i.path.join(".")}: ${i.message}`);
  console.error(`Variáveis de ambiente inválidas:\n${erros.join("\n")}`);
  process.exit(1);
}

export const env = resultado.data;
