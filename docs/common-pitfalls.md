# Armadilhas Comuns (Common Pitfalls)

## 1. Dependências

- **Não adicionar** bibliotecas que não estão em `package.json` sem justificativa.
- `tailwindcss>nanoid` está fixado em `3.3.7` via `pnpm.overrides` — não remover.
- `wouter@3.7.1` possui patch em `patches/` — não atualizar sem revisar o patch.

## 2. Aliases e imports

- Use `@/` para `client/src`, `@shared/` para `shared`, `@assets/` para `attached_assets`.
- Import relativo só para arquivos próximos (ex.: `./components/ErrorBoundary`).
- Evite imports com caminhos absolutos do sistema de arquivos.

## 3. Estilo / Tailwind

- Classes customizadas vivem em `@layer components` do `index.css`; não as redefina
  pontualmente em componentes sem necessidade.
- Tokens de cor/raio são definidos em `:root` (e `.dark`) — prefira as variáveis.
- Cuidado ao usar classes arbitrárias: priorize o design system existente.

## 4. Roteamento (wouter)

- O `Switch` em `App.tsx` usa a rota `*` como fallback para `NotFound`. Ao adicionar
  rotas, coloque-as antes do fallback.
- O servidor Express retorna `index.html` para toda rota (SPA fallback); não crie
  rotas de API que colidam com o `app.get("*")`.

## 5. Formulários e validação

- Combine `react-hook-form` com `zod` via `@hookform/resolvers`.
- Não esqueça `register`/`control` nos campos; mensagens em pt-BR.

## 6. Tema

- `ThemeProvider` usa `defaultTheme="light"`. Para tema alternável, defina `switchable`
  e use `useTheme().toggleTheme`.
- A classe `dark` é aplicada no `<html>` — estilos dark devem usar `:is(.dark *)` ou `.dark`.

## 7. Ambiente específico (Manus)

- `vite.config.ts` contém plugins de runtime/debug/storage proxy. Não remova sem
  necessidade; o proxy `/manus-storage/` é usado pelas imagens da Home em dev.
- Em **produção**, quem serve `/manus-storage/*` é `server/index.ts`
  (arquivo local → proxy assinado → 404). Nunca deixe essa rota cair no
  `app.get("*")`, senão as imagens recebem HTML no lugar do arquivo.
- O plugin de SEO (`vitePluginSiteSeo`) gera canonical/OG/JSON-LD a partir de
  `shared/site.ts`. Se aparecer `%SITE_*%` literal no HTML final, o plugin saiu
  da lista de `plugins` em `vite.config.ts`.

## 8. Env e publicação

- `SITE_URL`/`VITE_SITE_URL` definem o domínio canônico (build + robots/sitemap).
  Sem elas, vale `DEFAULT_SITE_URL` de `shared/site.ts`.
- `VITE_ANALYTICS_ENDPOINT` é opcional: sem ela, nenhum script de analytics é
  injetado (o HTML não fica com URL inválida).
- Imagens: prefira versionar em `client/public/manus-storage/` em vez de depender
  do proxy remoto. Ver `docs/seo-and-assets.md`.

## 9. Build/entrega

- Sempre rode `pnpm check`, `pnpm test` e (idealmente) `pnpm build` antes de entregar.
- Não commitar `.manus-logs/` (logs gerados em dev) se existir — mantenha `.gitignore`.
