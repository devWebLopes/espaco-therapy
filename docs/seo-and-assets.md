# SEO, Imagens e Publicação

Documento operacional das mudanças do `plans/plan-002-melhorias-ux-seo-imagens.md`:
como as imagens são entregues, como os metadados são gerados e o que revisar
antes de publicar.

---

## 1. Fonte única de verdade: `shared/site.ts`

Todo o conteúdo que alimenta contato, endereço, SEO e dados estruturados ficou
centralizado em [`../shared/site.ts`](../shared/site.ts):

| Export                                                                                                          | Papel                                                                 |
| --------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| `CONTACT`                                                                                                       | WhatsApp (número + mensagem), telefone E.164, Instagram, link do mapa |
| `ADDRESS`, `ADDRESS_LABEL`, `CITY_LABEL`                                                                        | NAP (nome, endereço, telefone)                                        |
| `SITE_TITLE`, `SITE_DESCRIPTION`, `BUSINESS_DESCRIPTION`                                                        | Título, meta description com CTA e descrição factual                  |
| `SERVICES`, `GALLERY`, `FAQS`, `TEAM`, `OFFER`                                                                  | Conteúdo renderizado na home **e** espelhado no JSON-LD               |
| `IMAGES`                                                                                                        | Imagens com `src`, `alt`, `width` e `height`                          |
| `resolveSiteUrl`, `buildWhatsAppUrl`, `applySiteTokens`, `buildRobotsTxt`, `buildSitemapXml`, `buildSiteJsonLd` | Helpers puros usados por client, Vite e servidor                      |

**Regra:** para trocar o número de WhatsApp, preço, equipe ou FAQ, edite
`shared/site.ts`. Nada disso deve ser duplicado em `Home.tsx`, `index.html`,
`robots.txt` ou no JSON-LD.

> Alterar o número em um só lugar garante consistência entre o link do site, o
> dados estruturados e o texto do FAQ (requisito R2 do plano 002).

---

## 2. Entrega das imagens (`/manus-storage/…`)

`server/index.ts` resolve `/manus-storage/<arquivo>` em três níveis:

1. **Arquivo versionado (recomendado):** `client/public/manus-storage/<arquivo>`.
   O Vite copia para `dist/public/manus-storage/` e o Express serve direto
   (`Cache-Control: public, max-age=2592000`). Build autossuficiente, sem
   dependência de serviço externo.
2. **Proxy assinado:** se o arquivo não existe localmente e as envs
   `BUILT_IN_FORGE_API_URL` + `BUILT_IN_FORGE_API_KEY` estão definidas, o servidor
   gera uma URL assinada e responde `307` (mesmo contrato do proxy de dev do Vite).
3. **Ausente:** responde **404 `text/plain`** — nunca o HTML do fallback SPA.
   Esse era o bug P0-1: em produção, toda imagem caía no `app.get("*")` e
   retornava HTML, quebrando a página inteira.

### Na hospedagem estática (Vercel)

O servidor Express **não** roda na Vercel (ver `plans/plan-003-publicacao-vercel.md`), então
o nível 2 é atendido pela Vercel Function `api/manus-storage/[...key].ts`, que usa a mesma
`resolveStorageResponse` de [`../shared/storage.ts`](../shared/storage.ts). O `vercel.json`
reescreve `/manus-storage/<arquivo>` para essa função — e, como a Vercel aplica as
reescritas **depois** dos arquivos estáticos, um arquivo versionado continua tendo
precedência.

Sem as envs `BUILT_IN_FORGE_API_URL`/`BUILT_IN_FORGE_API_KEY` no projeto da Vercel, a função
responde `404 text/plain` para imagens não versionadas. Portanto, em hospedagem estática,
**versionar as imagens é obrigatório** (não é apenas o caminho recomendado).

Arquivos esperados hoje (ver `IMAGES`/`GALLERY`):

```
espaco_9d0dabd5.jpg   feed_03_ee62de48.jpg   feed_06_ff6a12d1.jpg
feed_07_56672306.jpg  massagem_1086f446.jpg  mechas_fa72dfb6.jpg
servicos_a483c6a1.jpg
```

### Checklist de imagens antes de publicar

- [ ] Baixar as 7 imagens e colocá-las em `client/public/manus-storage/`.
- [ ] Converter para **WebP** (ou AVIF) e servir no tamanho exibido
      (`hero` ~720×1000, cards ~600×600, galeria ~800×800/1600×800).
- [ ] Atualizar `width`/`height` reais em `IMAGES`/`GALLERY`
      (`shared/site.ts`) — hoje são proporções de layout para evitar CLS.
- [ ] Validar visualmente nitidez, enquadramento e paleta areia/dourado.
- [ ] Resolver a curadoria pendente: o hero usa o interior do espaço e a
      galeria reaproveita a mesma foto em outro recorte (`gallery-item-1`).
- [ ] Gerar um banner dedicado **1200×630** para `og:image`
      (hoje usamos `OG_IMAGE_PATH` apontando para a foto do interior).

---

## 3. Metadados e dados estruturados (gerados no build)

O plugin `vitePluginSiteSeo` (em `vite.config.ts`) usa `shared/site.ts` para:

- substituir os tokens `%SITE_*%` de `client/index.html`
  (`%SITE_URL%`, `%SITE_TITLE%`, `%SITE_DESCRIPTION%`, `%SITE_OG_IMAGE%`, …);
- injetar o **JSON-LD** estático no `<head>`:
  `HealthAndBeautyBusiness` + `WebSite` + `FAQPage` (com `telephone`, `address`,
  `sameAs`, `employee`, `hasOfferCatalog` e as perguntas do FAQ visível);
- injetar o script de analytics (Umami) **somente** quando
  `VITE_ANALYTICS_ENDPOINT` está definido (sem env, nenhum script é gerado — era
  a lacuna S9).

Por que estático: crawlers leem o HTML inicial antes de executar o bundle React,
então canonical/OG/JSON-LD ficam confiáveis sem precisar de SSR.

`robots.txt` e `sitemap.xml` são gerados pelo **servidor Express**
(`buildRobotsTxt` / `buildSitemapXml`) com a URL canônica resolvida em runtime.
Os arquivos em `client/public/` são apenas fallback para dev/preview/hospedagem
estática — em produção a rota do Express tem precedência.

---

## 4. Domínio canônico (`SITE_URL`)

Sem configuração, vale `DEFAULT_SITE_URL` (`shared/site.ts`). Para publicar em
outro domínio, defina no ambiente **antes do build**:

```bash
SITE_URL=https://SEU-DOMINIO.com.br
VITE_SITE_URL=https://SEU-DOMINIO.com.br
```

Isso atualiza canonical, OG/Twitter, JSON-LD, `robots.txt` e `sitemap.xml`.
Copie `.env.example` para `.env` e ajuste.

---

## 5. Checklist final de publicação

- [ ] `pnpm check` sem erros e `pnpm test` verde.
- [ ] `pnpm build` conclui sem avisos de env não definida.
- [ ] `SITE_URL` aponta para o domínio real (validar canonical no HTML gerado).
- [ ] (Vercel) Framework Preset **Vite**, Build `pnpm build` e Output Directory
      `dist/public` — ver `plans/plan-003-publicacao-vercel.md`.
- [ ] (Vercel) `SITE_URL` e `VITE_SITE_URL` definidos nas Environment Variables de build.
- [ ] JSON-LD validado no **Rich Results Test** e no `validator.schema.org`.
- [ ] Imagens versionadas (e não apenas via proxy) para não depender de terceiros.
- [ ] Imagens visíveis em produção — inclusive com cache frio e sem JS.
- [ ] `robots.txt` e `sitemap.xml` respondendo no domínio final; sitemap enviado
      ao Search Console.
- [ ] Google Business Profile com NAP idêntico ao de `shared/site.ts`.
- [ ] Número de WhatsApp confirmado com a cliente (pendência R2).
