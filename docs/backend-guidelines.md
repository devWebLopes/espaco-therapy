# Diretrizes de Backend (Express)

## 1. Visão geral

O servidor (`server/index.ts`) é mínimo e serve o SPA em produção:

- Serve arquivos estáticos de `dist/public`.
- Fallback SPA: toda rota não-estática retorna `index.html`.
- Porta configurável via `process.env.PORT` (padrão `3000`).

## 2. Estrutura atual

```ts
import express from "express";
import { createServer } from "http";
// ...
async function startServer() {
  const app = express();
  const server = createServer(app);
  // static path: dist/public (prod) ou dist/public (dev)
  app.use(express.static(staticPath));
  app.get("*", (_req, res) => res.sendFile(path.join(staticPath, "index.html")));
  server.listen(process.env.PORT || 3000, ...);
}
startServer().catch(console.error);
```

## 3. Convenções

- Use ESM (`import`) e TypeScript.
- `__dirname` via `fileURLToPath(import.meta.url)`.
- Mantenha o servidor enxuto; APIs novas devem ser adicionadas **antes** do
  fallback `app.get("*")`.
- Configurações sensíveis via variáveis de ambiente (`process.env.*`).
- Constantes compartilhadas em `shared/` (importadas via `@shared/`).

## 4. Boas práticas

1. Separe rotas/controllers em módulos conforme o servidor crescer.
2. Valide entrada (pode usar `zod`, já disponível).
3. Trate erros e retorne status HTTP corretos.
4. Evite segredos no código; use env vars.
5. Documente endpoints (método, path, body/query, resposta).

## 5. Build/run

- Dev: `pnpm dev` (Vite sobe o frontend; o servidor Express não é obrigatório em dev).
- Prod: `pnpm build` (bundle do servidor via esbuild) e `pnpm start`.
