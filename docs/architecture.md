# Arquitetura do Projeto

## 1. Estrutura de pastas

```
espaco-therapy/
├── client/                 # Frontend (React SPA)
│   ├── index.html          # Entry HTML (título, viewport, scripts)
│   ├── public/             # Assets estáticos públicos
│   └── src/
│       ├── App.tsx         # Composição raiz (ErrorBoundary > Theme > Router)
│       ├── main.tsx        # Bootstrap do React (createRoot)
│       ├── index.css       # Tailwind + tokens + classes customizadas (@layer)
│       ├── const.ts        # Re-exporta constantes compartilhadas + getLoginUrl
│       ├── components/     # Componentes de domínio e ui/ (shadcn/ui)
│       │   ├── ErrorBoundary.tsx
│       │   ├── ManusDialog.tsx
│       │   └── ui/         # ~60 componentes shadcn/ui (Radix UI)
│       ├── contexts/       # ThemeContext.tsx (light/dark)
│       ├── hooks/          # useComposition, useMobile, usePersistFn
│       ├── lib/            # utils.ts (cn = twMerge + clsx)
│       └── pages/          # Home.tsx, NotFound.tsx
├── server/
│   └── index.ts            # Express: static + imagens + robots/sitemap + SPA fallback
├── api/
│   └── manus-storage/[...key].ts  # Vercel Function: entrega das imagens (host estático)
├── shared/
│   ├── const.ts            # Constantes compartilhadas (COOKIE_NAME, ONE_YEAR_MS)
│   ├── site.ts             # Fonte única: contato, conteúdo, imagens e SEO
│   └── storage.ts          # Política de entrega de /manus-storage (Express + Vercel)
├── patches/                # Patches pnpm (wouter@3.7.1)
├── dist/                   # Saída de build (public/ e index.js do servidor)
├── vercel.json             # Deploy estático na Vercel (preset vite, rewrites, headers)
├── vite.config.ts          # Configuração do Vite (root=client, aliases, plugins)
├── vitest.config.ts        # Configuração dos testes (root do projeto)
├── tsconfig.json           # TypeScript (strict, paths)
├── components.json         # Config do shadcn/ui
└── .env.example            # Envs esperadas (SITE_URL, PORT, storage, analytics)
```

## 2. Camadas e responsabilidades

### 2.1 Client (SPA)

- **Entry:** `client/index.html` → carrega `/src/main.tsx`.
- **Root:** `App.tsx` monta `ErrorBoundary` → `ThemeProvider` → `TooltipProvider` → `Toaster` → `Router`.
- **Roteamento:** `wouter` com `Switch`/`Route` (SPA, sem SSR).
- **Estilo:** Tailwind CSS 4 (importado via `@import "tailwindcss"`), classes
  customizadas definidas em `@layer components` no `index.css`.

### 2.2 Server (Express)

- Serve arquivos estáticos de `dist/public` com cache por tipo de arquivo
  (HTML `no-cache`; `/assets/*` imutável por 1 ano; imagens 30 dias).
- Gera `robots.txt` e `sitemap.xml` a partir de `shared/site.ts` (env `SITE_URL`).
- Resolve `/manus-storage/<arquivo>` com a política de `shared/storage.ts`: arquivo local
  → proxy assinado (envs `BUILT_IN_FORGE_*`) → **404** (nunca o HTML do fallback SPA).
  Ver `docs/seo-and-assets.md`.
- Fallback SPA: `app.get("*")` retorna `index.html` para qualquer rota.
- Porta: `process.env.PORT || 3000`.

### 2.3 Shared

- Código compartilhado entre client, servidor e build (constantes, tipos,
  conteúdo e helpers). Importado via alias `@shared/` (client) ou caminho
  relativo (servidor/esbuild).
- `shared/site.ts` é a **fonte única de verdade** de contato, conteúdo da home,
  imagens e SEO (canonical/OG/JSON-LD/robots/sitemap).
- `shared/storage.ts` é a **fonte única** da entrega das imagens de `/manus-storage/`
  (`resolveStorageResponse`), consumida pelo servidor Express e pela Vercel Function
  `api/manus-storage/[...key].ts` — cobre validação de chave, proxy assinado e 404.

## 3. Path aliases (definidos em `vite.config.ts` e `tsconfig.json`)

| Alias      | Alvo               |
| ---------- | ------------------ |
| `@/`       | `client/src/`      |
| `@shared/` | `shared/`          |
| `@assets/` | `attached_assets/` |

## 4. Fluxo de dados

- O site é uma landing page estática: o conteúdo (serviços, galeria, FAQ,
  equipe, oferta) vive em `shared/site.ts` e é renderizado por `Home.tsx`.
- Os mesmos dados alimentam o **JSON-LD** injetado no `index.html` pelo plugin
  de SEO do `vite.config.ts` — assim o schema nunca diverge do conteúdo visível.
- Imagens são entregues via `/manus-storage/` (arquivo versionado ou proxy).
- Links externos: WhatsApp (`wa.me`), Instagram, Google Maps — centralizados em
  `CONTACT` (`shared/site.ts`).
- SEO: canonical/OG/Twitter/JSON-LD estão no HTML inicial (build); `robots.txt`
  e `sitemap.xml` são servidos pelo Express. Detalhes em
  `docs/seo-and-assets.md`.

## 5. Build e deploy

1. `pnpm check` (`tsc --noEmit`) e `pnpm test` (`vitest run`).
2. `pnpm build`:
   - `vite build` → gera `dist/public/` (frontend, favicon, robots.txt,
     sitemap.xml e imagens de `client/public/`).
   - `esbuild server/index.ts` → gera `dist/index.js` (servidor, ESM, externals,
     com `shared/site.ts` embutido).
3. `pnpm start` → `NODE_ENV=production node dist/index.js`.
4. Defina `SITE_URL` (domínio canônico) antes do build em produção — ver
   `.env.example`.

> **Observação:** o `vite.config.ts` contém plugins específicos de runtime
> (manus runtime, debug collector, storage proxy) usados pelo ambiente de
> desenvolvimento da plataforma. Não remova sem necessidade.

## 6. Publicação na Vercel (hospedagem estática)

O `vercel.json` publica o **SPA** (preset `vite`, saída em `dist/public`), não o servidor
Express. Isso é necessário porque a Vercel detecta qualquer arquivo que importe `express`
(`server/index.ts` está nessa lista) e o transforma numa Vercel Function — o que fazia o
deploy falhar ao servir o site (plano 003).

| Ponto                         | Como fica na Vercel                                                                                      |
| ----------------------------- | -------------------------------------------------------------------------------------------------------- |
| Build                         | `pnpm build` (o mesmo dos demais hosts) · saída `dist/public`                                            |
| Rotas do SPA                  | `rewrites: /(.*) → /index.html` (aplicado depois dos arquivos estáticos)                                 |
| `robots.txt` / `sitemap.xml`  | Arquivos versionados de `client/public/` (o servidor Express tem precedência quando é ele quem responde) |
| Imagens de `/manus-storage/*` | Arquivos versionados (preferencial) ou `api/manus-storage/[...key].ts` com `BUILT_IN_FORGE_*` definidas  |
| Domínio canônico              | Env `SITE_URL`/`VITE_SITE_URL` no **build** (canonical, OG e JSON-LD)                                    |

Passo a passo completo, riscos e checklist: `plans/plan-003-publicacao-vercel.md`.
