# Skill: Build & Deploy

## Objetivo

Compilar, validar e preparar o projeto para produção.

## Scripts (package.json)

| Script    | Comando                                                                                                         |
| --------- | --------------------------------------------------------------------------------------------------------------- |
| `dev`     | `vite --host`                                                                                                   |
| `build`   | `vite build && esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist` |
| `start`   | `NODE_ENV=production node dist/index.js`                                                                        |
| `preview` | `vite preview --host`                                                                                           |
| `check`   | `tsc --noEmit`                                                                                                  |
| `format`  | `prettier --write .`                                                                                            |

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

## Vercel (hospedagem estática)

| Item              | Valor                                                                                                           |
| ----------------- | --------------------------------------------------------------------------------------------------------------- |
| Configuração      | `vercel.json` — `framework: vite`, `buildCommand: pnpm build`, `outputDirectory: dist/public`                   |
| Rewrites          | `/manus-storage/:path*` → `/api/manus-storage/:path*`; `/(.*)` → `/index.html`                                  |
| Função de imagens | `api/manus-storage/[...key].ts` (usa `shared/storage.ts`)                                                       |
| Envs de build     | `SITE_URL`, `VITE_SITE_URL` (canonical/OG/JSON-LD) · opcional `BUILT_IN_FORGE_API_URL`/`BUILT_IN_FORGE_API_KEY` |

Regras:

1. A Vercel **não** roda o Express: `server/index.ts` importa `express` e é detectado como
   aplicação (preset Express), virando uma Vercel Function que não serve o SPA. Por isso o
   `vercel.json` fixa o framework em `vite` — não remover essa chave.
2. Imagens precisam estar versionadas em `client/public/manus-storage/`: os arquivos
   estáticos têm precedência sobre as reescritas. Sem arquivo local e sem as envs do
   storage, a resposta é `404 text/plain` (nunca o HTML do SPA).
3. Não criar `vercel.ts` junto do `vercel.json` (apenas um arquivo de configuração por
   projeto).
4. Validar após publicar: `/`, `/robots.txt`, `/sitemap.xml`, canonical e imagens.
   Detalhes em `../plans/plan-003-publicacao-vercel.md`.
