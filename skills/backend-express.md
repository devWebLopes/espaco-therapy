# Skill: Backend Express

## Objetivo
Manter e estender o servidor Node/Express que serve o SPA.

## Conhecimentos necessários

- Express 4.21, `http.createServer`, ESM (`import`).
- `fileURLToPath(import.meta.url)` para `__dirname`.
- Variáveis de ambiente (`process.env`).

## Padrão atual (`server/index.ts`)

- `express.static(staticPath)` para `dist/public`.
- Fallback SPA: `app.get("*")` → `index.html`.
- Porta `process.env.PORT || 3000`.

## Regras

1. Adicionar rotas de API **antes** do fallback `app.get("*")`.
2. Usar ESM e TypeScript.
3. Segredos/configurações via env vars, nunca hardcoded.
4. Validação de entrada com `zod` (já disponível).
5. Tratar erros e retornar status HTTP corretos.
6. Constantes compartilhadas em `shared/` (alias `@shared/`).

> Ver `docs/backend-guidelines.md`.
