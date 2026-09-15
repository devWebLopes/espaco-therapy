# Plano 003 — Publicação na Vercel (SPA estático) e correção do erro de deploy

> **Tipo:** correção de bug P0 de publicação (deploy) + documentação
> **Objeto:** site institucional Espaço Therapy — Estética & Terapias (SPA React + Express)
> **Referências:** `agents.md`, `docs/architecture.md`, `docs/seo-and-assets.md`,
> `skills/build-deploy.md`, documentação oficial da Vercel (Express, Vite, `vercel.json`, Routing)
> **Data:** 14/09/2026

---

## 1. Relato e evidência

Ao importar o repositório na Vercel, o deploy apresentou erro exibindo o **código do
servidor Express** (`server/index.ts` com `shared/site.ts` embutido). Esse conteúdo é
idêntico ao `dist/index.js` gerado por `pnpm build` (bundle esbuild, `--packages=external`),
ou seja: a Vercel **compilou e publicou o servidor Express como aplicação**, e não o
build do frontend (`dist/public`).

## 2. Causa raiz

Segundo a documentação da Vercel:

- _Express on Vercel_ — "To run an Express application on Vercel, create a file that
  imports the express package at any one of the following locations: `app.*`, `index.*`,
  `server.*`, `src/app.*`, `src/index.*`, `src/server.*`" e "The file must also export the
  application as a default export of the module **or use a port listener**".
- O projeto tem exatamente um arquivo desses: **`server/index.ts`** (importa `express` e
  chama `server.listen()`), com `express` declarado em `dependencies`.

Resultado: em vez do preset **Vite** (build do SPA em `dist/public`), a Vercel usou o
caminho de **Node/Express**, transformou `server/index.ts` numa Vercel Function e o
deploy não serve o site:

| O que a Vercel fez                          | Por que não funciona                                                                                                                                          |
| ------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Empacotou `server/index.ts` como função     | O preset Express espera servir a aplicação inteira; o SPA publicado em `dist/public` não é usado                                                              |
| `express.static(staticPath)`                | Em produção o servidor usa `path.resolve(__dirname, "public")`; dentro da função esse diretório não existe (o build do Vite fica em `dist/public`, fora dela) |
| `app.get("*")` → `sendFile(.../index.html)` | `ENOENT` → erro na execução da função (`FUNCTION_INVOCATION_FAILED`)                                                                                          |
| `--packages=external` no bundle             | `express` não vai embutido; a resolução em `node_modules` (pnpm) fica a cargo do runtime                                                                      |

## 3. Decisão

**Publicar na Vercel como site estático (preset Vite), com `outputDirectory: dist/public`.**

Justificativa:

1. O `template.json` declara o projeto como `web-static` — "A pure frontend static
   website with React and Vite, **no backend server**".
2. O site é uma SPA: todo o conteúdo é renderizado no cliente a partir de `shared/site.ts`;
   o Express só entrega arquivos estáticos, `robots.txt`, `sitemap.xml` e o proxy de
   `/manus-storage/*`.
3. `robots.txt` e `sitemap.xml` já têm **fallback versionado** em `client/public/`
   (posicionados por `shared/site.ts`), e o proxy de imagens ganhou equivalente em
   Vercel Function — não há perda de funcionalidade.
4. Menor custo e melhor performance: zero função no caminho crítico do HTML, cache da
   CDN da Vercel, sem cold start.

**Alternativa descartada:** adaptar o código ao preset Express (`export default app` +
caminhos de estático do runtime). Não resolveria as imagens, adicionaria cold start a
todo acesso e acoplaria o repositório ao preset — mantendo o projeto preso a um único host.

## 4. Mudanças realizadas

| Arquivo                                                                                    | Ação      | Papel                                                                                                                                                                     |
| ------------------------------------------------------------------------------------------ | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `vercel.json`                                                                              | **novo**  | Fixa `framework: vite`, `buildCommand: pnpm build`, `outputDirectory: dist/public`, fallback SPA (`rewrites`), proxy de imagens e as mesmas políticas de cache do Express |
| `api/manus-storage/[...key].ts`                                                            | **novo**  | Vercel Function que responde `/manus-storage/<arquivo>` no host estático                                                                                                  |
| `shared/storage.ts`                                                                        | **novo**  | Política de entrega das imagens (arquivo local → proxy assinado `307` → 404 `text/plain`), compartilhada entre Express e Vercel                                           |
| `shared/storage.test.ts`                                                                   | **novo**  | 13 testes da política de storage (400/404/307/502)                                                                                                                        |
| `server/index.ts`                                                                          | alterado  | Passa a usar `shared/storage.ts` (comportamento idêntico, menos duplicação)                                                                                               |
| `tsconfig.json`                                                                            | alterado  | Inclui `api/**/*` na checagem de tipos (`pnpm check`)                                                                                                                     |
| `docs/architecture.md`, `docs/seo-and-assets.md`, `skills/build-deploy.md`, `.env.example` | alterados | Operação da publicação na Vercel                                                                                                                                          |

### 4.1 `vercel.json` — decisões

- **`rewrites` são avaliados depois dos arquivos estáticos** (ordem de roteamento da
  Vercel: _File System Routes_ → _Rewrites_). Logo, uma imagem versionada em
  `client/public/manus-storage/` tem precedência sobre o proxy, e `/assets/*`,
  `/robots.txt` e `/sitemap.xml` são servidos direto pela CDN.
- A regra do proxy vem **antes** do fallback SPA para que uma imagem ausente nunca
  receba o HTML do `index.html` (bug P0-1, agora impossível também na Vercel).
- `headers` espelham o `setHeaders` do Express: `/assets/*` imutável por 1 ano,
  `/manus-storage/*` 30 dias, `robots.txt`/`sitemap.xml` 1 dia. O HTML permanece com a
  política padrão da Vercel (`max-age=0, must-revalidate`), equivalente ao `no-cache`.

## 5. Passo a passo (publicar/corrigir na Vercel)

1. **Push** deste commit para `main` (a Vercel refaz o deploy com o `vercel.json`).
2. No projeto da Vercel, em **Settings → Build and Deployment**, conferir:
   - Framework Preset: **Vite**
   - Build Command: `pnpm build` · Output Directory: `dist/public` · Install: `pnpm install`

   > O `vercel.json` já força esses valores; ajustar no painel evita que uma configuração
   > antiga (preset Express) continue influenciando o build.

3. Em **Settings → Environment Variables** (Production e Preview, disponíveis no **build**):
   - `SITE_URL=https://espacotherapy.com.br`
   - `VITE_SITE_URL=https://espacotherapy.com.br`
   - (opcional) `BUILT_IN_FORGE_API_URL` e `BUILT_IN_FORGE_API_KEY` para o proxy das imagens
4. **Redeploy** (Deployments → ⋯ → Redeploy, sem cache) e validar.
5. Em **Settings → Domains**, adicionar `espacotherapy.com.br` e `www`, ajustando o DNS.
6. Conferir: `/`, `/robots.txt`, `/sitemap.xml`, canonical no HTML, JSON-LD e as imagens.

## 6. Validação executada (14/09/2026)

| Verificação                                               | Resultado                                                                                                                                                                                  |
| --------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `pnpm check` (`tsc --noEmit`, agora cobrindo `api/`)      | sem erros                                                                                                                                                                                  |
| `pnpm test` (`vitest run`)                                | 37 testes passando (13 novos em `shared/storage.test.ts`)                                                                                                                                  |
| `pnpm build`                                              | `dist/public` (index.html + assets) e `dist/index.js` gerados                                                                                                                              |
| Smoke test do servidor (`node dist/index.js`, porta 3111) | `/manus-storage/nao-existe.jpg` → **404 text/plain**; arquivo versionado → **200 image/jpeg**; `/` e `/qualquer-rota` → **200 text/html**; `/robots.txt` → conteúdo com `Sitemap:` correto |

## 7. Pendência bloqueante — imagens não versionadas

`client/public/manus-storage/` contém apenas `.gitkeep`: as 7 imagens vivem no storage
externo e eram entregues pelo proxy via `BUILT_IN_FORGE_*`. **Na Vercel o proxy do
Express não existe** e, sem as envs do storage, as imagens retornam `404` (a página abre,
mas sem hero, cards e galeria).

Saídas, em ordem de preferência:

1. **Versionar as imagens** (recomendado, sem dependência externa — checklist §2 de
   `docs/seo-and-assets.md`): colocar em `client/public/manus-storage/` com estes nomes:
   `espaco_9d0dabd5.jpg`, `feed_03_ee62de48.jpg`, `feed_06_ff6a12d1.jpg`,
   `feed_07_56672306.jpg`, `massagem_1086f446.jpg`, `mechas_fa72dfb6.jpg`,
   `servicos_a483c6a1.jpg`.
2. **Configurar `BUILT_IN_FORGE_API_URL`/`BUILT_IN_FORGE_API_KEY`** na Vercel: a função
   `api/manus-storage/[...key].ts` passa a gerar a URL assinada e redirecionar (`307`),
   exatamente como o Express faz hoje.

## 8. Riscos e observações

- Ao versionar as imagens: converter para WebP/AVIF e atualizar `width`/`height` reais em
  `shared/site.ts` (pendência já registrada no plano 002).
- `client/public/__manus__/debug-collector.js` é publicado junto ao site (o script só é
  injetado pelo Vite em desenvolvimento, portanto não roda em produção). Mantido por ser
  dependência do ambiente da plataforma Manus; pode ser excluído do `publicDir` numa
  limpeza futura.
- O servidor Express continua sendo o runtime de `pnpm start` (hospedagem Node/Manus);
  nenhuma funcionalidade foi removida — apenas passou a usar `shared/storage.ts`.
- Só existe um `vercel.json` por projeto: manter esta configuração como fonte única para
  a Vercel (não criar `vercel.ts`).
