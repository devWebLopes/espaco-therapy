# Skill: Build & Deploy

## Objetivo
Compilar, validar e preparar o projeto para produção.

## Scripts (package.json)

| Script | Comando |
|---|---|
| `dev` | `vite --host` |
| `build` | `vite build && esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist` |
| `start` | `NODE_ENV=production node dist/index.js` |
| `preview` | `vite preview --host` |
| `check` | `tsc --noEmit` |
| `format` | `prettier --write .` |

## Fluxo

1. `pnpm install` (pnpm@10, usa `pnpm-lock.yaml`, patches e overrides).
2. `pnpm check` → garante tipos.
3. `pnpm build` → gera `dist/public` (frontend) e `dist/index.js` (servidor).
4. `pnpm start` → sobe em produção na porta `PORT || 3000`.

## Regras

1. Não alterar `pnpm.overrides` (nanoid) nem patches sem justificativa.
2. Verificar se o build limpa/sai em `dist/public` (`emptyOutDir: true`).
3. Em dev, a porta é 3000 (`strictPort: false` busca porta livre).
4. Configurar env vars necessárias antes de produção.
