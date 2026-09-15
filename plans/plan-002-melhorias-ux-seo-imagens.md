# Plano 002 — PRD de melhorias: UX, SEO, imagens e aderência ao Dossiê

> **Tipo:** PRD (Product Requirements Document) / análise de especialista em UX
> **Objeto:** Site institucional Espaço Therapy — Estética & Terapias (SPA React + Express)
> **Referências:** `agents.md`, `docs/`, `skills/`, PDF anexo (Dossiê de presença pública,
> 10/09/2026) e perfil público `@espacotherapy_` no Instagram.
> **Data:** 14/09/2026

---

## 1. Resumo executivo

O site atual é uma landing page **visualmente sofisticada e bem alinhada à identidade
"serena"** (paleta areia/dourado, Cormorant Garamond + DM Sans, elementos florais),
consistente com o que o Dossiê descreve sobre a marca. A experiência de marca e o tom de
voz ("corpo, mente e energia em equilíbrio") estão **corretamente transpostos** para o
site.

Porém, a análise identificou **duas fragilidades estruturais críticas** (servir imagens em
produção e a consistência do número de WhatsApp, que é o funil único de conversão) e um
**conjunto relevante de lacunas de SEO técnico** (ausência de robots.txt, sitemap,
canonical, Open Graph, dados estruturados e favicon), além de oportunidades de UX e de
curadoria de imagens.

**Prioridade geral:** resolver P0/P1 (infraestrutura de imagens + SEO + confirmação de
contato) antes de qualquer aprimoramento cosmético.

---

## 2. Escopo e método

- **Código analisado:** `client/src/pages/Home.tsx`, `client/src/index.css`,
  `client/index.html`, `client/src/App.tsx`, `client/src/const.ts`, `vite.config.ts`,
  `server/index.ts`, `docs/` e `skills/`.
- **Documento de referência:** PDF "Dossiê de presença pública — Espaço Therapy" (15 p.).
- **Instagram:** perfil público `@espacotherapy_` (bio, destaques, contagem de seguidores,
  link de WhatsApp) — extraído do HTML público.
- **Limitação declarada:** as imagens não estão versionadas no repositório (são servidas via
  proxy `/manus-storage/`), portanto **não foi possível inspecionar os pixels** de cada
  imagem. A avaliação de imagens baseia-se em: inventário e descrições do Dossiê, `alt`/uso
  no código e nomes de arquivo. Recomenda-se uma **validação visual final** por pessoa
  designer antes da publicação.

---

## 3. Aderência ao Dossiê (PDF) — o que está correto e o que diverge

| Dimensão              | Dossiê (referência)                                                                                                     | Site atual                                                                  | Status                |
| --------------------- | ----------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------- | --------------------- |
| Nome público          | "Espaço Therapy \| Estética & Terapias"                                                                                 | "Espaço Therapy"                                                            | ✅ adequado           |
| Posicionamento        | "refúgio de estética e bem-estar; corpo, mente e energia em equilíbrio"                                                 | hero: "Seu corpo pede pausa" + nota "Corpo, mente e energia em equilíbrio"  | ✅ adequado           |
| Endereço              | Rua Pedro Peres, 401 — Bairro Rio Branco, São Leopoldo                                                                  | Rua Pedro Peres, 401 · Rio Branco · São Leopoldo · RS                       | ✅ adequado           |
| WhatsApp              | +55 51 9198-7703                                                                                                        | `wa.me/555191987703` (= +55 51 9198-7703)                                   | ✅ coincide com o PDF |
| Três eixos de serviço | terapias/relaxamento · movimento · beleza                                                                               | 3 cards exatamente nesses eixos                                             | ✅ adequado           |
| Paleta/tipografia     | creme/areia, dourado, marrom, preto + serifa editorial                                                                  | tokens `index.css` seguem essa paleta                                       | ✅ adequado           |
| Símbolo floral        | "flor de lótus / pétalas"                                                                                               | `Flower2` (lucide) no logo e stamp                                          | ✅ adequado           |
| Preço R$ 85           | "promoção histórica", deve ser revisada                                                                                 | hardcoded "R$ 85" com nota de rodapé                                        | ⚠️ ver §6 (P2)        |
| Profissionais/equipe  | Erika, Janaína, Roberta; foto de equipe (prova social)                                                                  | **nenhuma** menção a profissionais/equipe                                   | ❌ lacuna (P2)        |
| Serviços detalhados   | mão simples, pé simples, pé+mão, cone chinês, pedras quentes, Reiki, ventosaterapia, cílios, alinhamento de fios, loiro | lista resumida (sem mãos/pés detalhado, sem ventosa/cílios/loiro explícito) | ⚠️ parcial (P2)       |
| Horários              | bio não informa horário fixo ("hora marcada")                                                                           | "Atendimentos com hora marcada"                                             | ✅ adequado           |
| Fachada "401"         | foto da fachada com nº 401 (prova do endereço)                                                                          | não há foto da fachada                                                      | ❌ lacuna (P2)        |

**Conclusão de aderência:** o site está **fiel ao essencial do Dossiê** (identidade, tom,
endereço, eixos de serviço, contato). As divergências são de **profundidade de conteúdo**
(equipe, catálogo de serviços, fachada) e de **tratamento de dados dinâmicos** (preço).

---

## 4. Diagnóstico técnico (bugs e riscos)

### P0-1 — Imagens podem quebrar em produção (`/manus-storage`)

- **Evidência:** o proxy `/manus-storage` existe **somente** no plugin do Vite
  (`vitePluginStorageProxy` → `configureServer`, que é **dev-only**). O servidor de
  produção (`server/index.ts`) **não registra** rota `/manus-storage`; ele apenas serve
  `dist/public` e faz fallback SPA (`app.get("*")` → `index.html`).
- **Impacto:** em produção, uma requisição a
  `/manus-storage/feed_03_ee62de48.jpg` cai no fallback e retorna **HTML no lugar da
  imagem** → todas as imagens (hero, cards, galeria) quebram.
- **Dependência:** o proxy em dev exige `BUILT_IN_FORGE_API_URL` e
  `BUILT_IN_FORGE_API_KEY`.
- **Requisito:** garantir entrega das imagens em produção por **uma** destas vias:
  1. baixar as 7 imagens e versioná-las em `client/public/manus-storage/` (recomendado —
     torna o build autossuficiente e permite compressão WebP/AVIF); ou
  2. portar o middleware de proxy para `server/index.ts` (com as env vars em produção).

### P0-2 — Confirmar o número de WhatsApp (funil único)

- **Evidência:** o número aparece em formas sutilmente diferentes no próprio projeto:
  - `client/src/pages/Home.tsx` → `wa.me/555191987703` (= +55 51 9198-7703);
  - PDF anexo → +55 51 9198-7703 (coincide com o site);
  - `skills/schema-structured-data.md` (template do próprio projeto) → `+55 51 99198-7703`
    (um dígito "9" a mais — formato típico de celular brasileiro de 9 dígitos).
- **Impacto:** como **todo** o funil de conversão é WhatsApp, qualquer dígito errado
  inviabiliza agendamentos.
- **Requisito:** confirmar com a cliente o número exato e **padronizar em um único lugar**
  (constante única), atualizando o template de schema e qualquer link.

---

## 5. Análise de UX (heurísticas)

### Pontos fortes

- Hierarquia visual clara (eyebrow → h1/h2 serifado → cópia → CTA).
- CTA de agendamento presente em múltiplos pontos (header, hero, oferta, visita, flutuante).
- FAQ reduz fricção antes do contato; `aria-expanded` correto.
- Links externos com `target="_blank" rel="noreferrer"`.
- Boa responsividade (breakpoints 700/800/480px) e `prefers-reduced-motion`.

### Problemas de usabilidade / acessibilidade

| #   | Problema                                                                                      | Impacto           | Prioridade |
| --- | --------------------------------------------------------------------------------------------- | ----------------- | ---------- |
| U1  | `viewport` com `maximum-scale=1` bloqueia zoom (falha WCAG 1.4.4)                             | Médio (a11y)      | P1         |
| U2  | Sem **skip link** ("pular para o conteúdo") para teclado                                      | Médio (a11y)      | P2         |
| U3  | Imagem hero e card "Beleza" usam **a mesma imagem** (`feed_03`) — repetição perceptível       | Baixo-médio       | P2         |
| U4  | Sem **prova social humana** (equipe/rosto) — o Instagram tem foto de equipe; o site, não      | Médio (confiança) | P2         |
| U5  | Imagens sem `width`/`height` e sem `loading="lazy"`/`fetchpriority` — risco de CLS e LCP alto | Alto (perf)       | P1         |
| U6  | Preço "R$ 85" fixo no código (sem fonte de dados) — risco de informação desatualizada         | Médio             | P2         |
| U7  | Componente `Map.tsx` não utilizado (código morto) — o site usa link externo do Google Maps    | Baixo             | P3         |
| U8  | Sem favicon                                                                                   | Baixo             | P3         |

---

## 6. Análise de imagens — "são as melhores?"

### Inventário atual (7 referências)

| Uso                    | Arquivo                 | Descrição (Dossiê)           | Observação                     |
| ---------------------- | ----------------------- | ---------------------------- | ------------------------------ |
| Hero                   | `feed_03_ee62de48.jpg`  | mechas/transformação capilar | ❌ duplicado com card "Beleza" |
| Serviço 01 — Terapias  | `feed_06_ff6a12d1.jpg`  | (feed)                       | a validar visualmente          |
| Serviço 02 — Movimento | `feed_07_56672306.jpg`  | (feed)                       | a validar visualmente          |
| Serviço 03 — Beleza    | `feed_03_ee62de48.jpg`  | mechas                       | ❌ duplicado com hero          |
| Galeria — O espaço     | `espaco_9d0dabd5.jpg`   | interior do espaço           | ✅ bom candidato a hero        |
| Galeria — Mechas       | `mechas_fa72dfb6.jpg`   | resultado capilar            | ✅                             |
| Galeria — Terapias     | `massagem_1086f446.jpg` | detalhe floral/parceria      | a validar                      |
| Galeria — Serviços     | `servicos_a483c6a1.jpg` | card de serviços             | ✅                             |

### Recomendações de curadoria

1. **Hero — trocar** de `feed_03` (close de cabelo) para `espaco_9d0dabd5.jpg` (interior) ou
   uma imagem de atmosfera/massagem. Justificativa: o posicionamento do Dossiê é "refúgio
   de bem-estar" (holístico), e a foto de ambiente comunica melhor "espaço/refúgio" do que
   um resultado capilar. Manter mechas para o card de "Beleza".
2. **Eliminar a duplicação** hero × card "Beleza": usar imagens distintas.
3. **Adicionar a foto de equipe** (`feed_01` do Dossiê — "Reunião de equipe") na seção
   "manifesto/ritual" ou "visite", para humanizar e gerar prova social (ponto forte do
   Instagram hoje ausente no site).
4. **Adicionar a fachada (nº 401)** à seção "Visite" para reforçar endereço e SEO local
   (o Dossiê destaca a foto da fachada como evidência do endereço).
5. **Enriquecer a galeria** com transformações (before/after de mechas/cílios) e o card
   "Nossos Serviços" (`feed_02`) — hoje o Instagram alterna serviço/resultado/educativo/
   equipe, e o site só mostra 4 recortes.
6. **Otimizar arquivos:** converter para WebP/AVIF, servir nas dimensões corretas,
   `loading="lazy"` na galeria e `fetchpriority="high"` no hero (impacto direto em LCP).

> ⚠️ Não foi possível inspecionar os pixels (imagens fora do repo). Antes de publicar,
> validar visualmente: nitidez, enquadramento, iluminação quente e consistência
> creme/dourado, conforme §6.4 do Dossiê.

---

## 7. SEO técnico & on-page (lacunas)

| #   | Lacuna                                                                      | Ação                                                                             | Prioridade |
| --- | --------------------------------------------------------------------------- | -------------------------------------------------------------------------------- | ---------- |
| S1  | Sem `robots.txt`                                                            | criar permitindo crawl + apontar sitemap                                         | P1         |
| S2  | Sem `sitemap.xml`                                                           | gerar/enviar ao Search Console                                                   | P1         |
| S3  | Sem `<link rel="canonical">`                                                | adicionar no `index.html`                                                        | P1         |
| S4  | Sem Open Graph / Twitter Card                                               | adicionar `og:title/description/url/image` + `twitter:card`                      | P1         |
| S5  | Sem JSON-LD (`BeautySalon`/`HealthAndBeautyBusiness`, `FAQPage`, `WebSite`) | injetar estático em `index.html`                                                 | P1         |
| S6  | Sem favicon                                                                 | adicionar                                                                        | P3         |
| S7  | Meta description curta, sem CTA                                             | ampliar para 150–160 chars com CTA                                               | P2         |
| S8  | Conteúdo 100% CSR (SPA)                                                     | meta tags já são estáticas (ok); considerar pré-render/SSG para o conteúdo-chave | P2         |
| S9  | `%VITE_ANALYTICS_ENDPOINT%`/`%VITE_ANALYTICS_WEBSITE_ID%` sem valor         | definir env ou remover o script (senão o `<script>` fica com URL inválida)       | P2         |

---

## 8. Requisitos priorizados (backlog do PRD)

> Critérios de aceitação gerais: `pnpm check` sem erros; `pnpm build` ok; imagens visíveis
> em produção; validação no Google Rich Results Test / PageSpeed Insights; contraste e zoom
> acessíveis.

### P0 — Corrigir antes de publicar

- **[R1] Entregar imagens em produção.** AC: as imagens renderizam em
  `https://SEU-DOMINIO.com.br/` (não retornar HTML). Preferência: versionar em
  `client/public/` + compressão WebP.
- **[R2] Confirmar e padronizar o número de WhatsApp.** AC: um único valor de número,
  idêntico em `Home.tsx`, schema JSON-LD e bio do Instagram; link `wa.me` abre o WhatsApp
  com o número correto.

### P1 — SEO técnico (alto impacto)

- **[R3] Metadados completos no `index.html`:** canonical, OG, Twitter Card, title/description
  revisados, favicon.
- **[R4] Dados estruturados JSON-LD:** `HealthAndBeautyBusiness`/`BeautySalon` + `FAQPage`
  (espelhando a seção de FAQ) + `WebSite`; validar no Rich Results Test.
- **[R5] `robots.txt` + `sitemap.xml`.**
- **[R6] Performance de imagens:** `width`/`height` em todas, `loading="lazy"` na galeria,
  `fetchpriority="high"` no hero; prevenir CLS.
- **[R7] Acessibilidade:** remover `maximum-scale=1` do viewport; garantir contraste e
  alvos de toque.

### P2 — UX e conteúdo

- **[R8] Eliminar duplicação hero × card "Beleza"** e aplicar curadoria de imagens do §6.
- **[R9] Adicionar seção/presença de equipe** (foto + nomes Erika/Janaína/Roberta) para
  prova social.
- **[R10] Enriquecer catálogo de serviços** com os itens do Dossiê (mãos & pés simples,
  ventosaterapia, cílios, alinhamento de fios, loiro) e profissional responsável.
- **[R11] Fachada (nº 401) na seção "Visite"** (reforço de endereço/SEO local).
- **[R12] Tratar o preço como dado dinâmico** (ex.: bloco editável/flag) com validade
  explícita, evitando "R$ 85" desatualizado.
- **[R13] Skip link** e microacessibilidade.

### P3 — Polimento

- **[R14] Remover código morto** (`Map.tsx` se não for usado).
- **[R15] Favicon + revisão de meta description com CTA.**
- **[R16] Depoimentos/avaliações** (médio prazo).

---

## 9. Roadmap sugerido

1. **Sprint 1 (bloqueios):** R1, R2.
2. **Sprint 2 (SEO + acessibilidade):** R3, R4, R5, R6, R7.
3. **Sprint 3 (conteúdo/UX):** R8–R13.
4. **Backlog contínuo:** R14–R16.

---

## 10. Riscos e dependências

- **Confirmação da cliente:** número de WhatsApp, preço vigente, profissionais ativos e
  fotos autorizadas (LGPD/uso de imagem).
- **Domínio de produção** ainda não identificado no repositório — necessário para
  canonical/OG/sitemap absolutos.
- **Validação visual das imagens** (pixels) depende de acessar o storage ou obter os
  arquivos da cliente.

---

## 11. Execução (multiagentes) — 14/09/2026

> Registro do que foi implementado e validado, seguindo o fluxo
> Architect → Frontend / Backend / Designer → QA. Nenhuma dependência nova foi
> adicionada.

### 11.1 Entregas por agente

| Agente        | Entrega                                                                                                                                                                              |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Architect** | Fonte única de verdade em `shared/site.ts`; metadados + JSON-LD gerados no build; proxy de imagens portado para o servidor; escopo de P0/P1 fechado                                  |
| **Frontend**  | `Home.tsx` migrada para `@shared/site`; nova seção de equipe (`#equipe`); `width`/`height`, `loading="lazy"`, `fetchpriority="high"` e `decoding="async"`; preço com flag; skip link |
| **Backend**   | `server/index.ts`: `/manus-storage/*` (local → proxy assinado → **404**), `robots.txt`/`sitemap.xml` dinâmicos, cache por tipo de arquivo                                            |
| **Designer**  | `index.html` (viewport sem `maximum-scale`, canonical/OG/Twitter, favicon SVG); CSS da equipe, do skip link, foco visível e degradação de imagem                                     |
| **QA**        | `shared/site.test.ts` (24 testes) + `vitest.config.ts` + script `pnpm test`; `pnpm check`, `pnpm build` e validação HTTP/HTML                                                        |

### 11.2 Requisitos do PRD — status

| Req.                        | Status      | Evidência                                                                                                                                               |
| --------------------------- | ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| R1 imagens em produção      | 🟡 parcial  | `/manus-storage/*` resolvido no servidor (local → proxy → 404, nunca HTML). **Falta versionar os 7 arquivos** (sem acesso ao storage/ativos)            |
| R2 WhatsApp padronizado     | 🟡 parcial  | Número único em `CONTACT` (`shared/site.ts`) consumido por site, JSON-LD e template da skill. **Falta confirmação da cliente**                          |
| R3 metadados completos      | ✅          | `canonical`, OG, Twitter Card, `robots`, `theme-color`, favicon e descrição com CTA em `client/index.html`                                              |
| R4 JSON-LD                  | ✅          | `HealthAndBeautyBusiness` + `WebSite` + `FAQPage` (3,5 kB) gerados no build a partir do conteúdo visível                                                |
| R5 robots + sitemap         | ✅          | Rotas Express (env-aware) + fallback estático em `client/public/`                                                                                       |
| R6 performance de imagens   | ✅          | `width`/`height` em todas as imagens, `lazy` fora da dobra, `fetchpriority="high"` no hero, cache de 30 dias para imagens                               |
| R7 acessibilidade           | ✅          | `maximum-scale=1` removido; alvo de toque do menu ampliado; foco visível reforçado                                                                      |
| R8 curadoria/duplicação     | ✅          | Hero passou a usar o **interior** (`espaco_*`) e o card “Beleza” mantém `feed_03`; galeria com recorte distinto (`object-position`)                     |
| R9 prova social (equipe)    | ✅          | Seção `#equipe` com Erika, Janaína e Roberta + link na navegação e FAQ “Quem vai me atender?”                                                           |
| R10 catálogo enriquecido    | 🟡 parcial  | Beleza agora inclui “Mechas & loiro”, “Alinhamento de fios” e “Mãos & pés (simples ou combinados)”. Atribuição por profissional pendente de confirmação |
| R11 fachada na seção Visite | ⛔ pendente | Depende de foto da fachada (nº 401) — não há ativo no repositório                                                                                       |
| R12 preço dinâmico          | ✅          | `OFFER.showPrice` (interruptor) + `validityNote` explícita; sem data inventada                                                                          |
| R13 skip link               | ✅          | `.skip-link` no `App.tsx` → `<main id="conteudo">`; ícones decorativos com `aria-hidden`                                                                |
| R14 código morto            | ✅          | `client/src/components/Map.tsx` removido (sem usos; `@types/google.maps` mantido até limpeza de dependências)                                           |
| R15 favicon + description   | ✅          | `favicon.svg` (marca floral na paleta da marca) + descrição de 155 caracteres com CTA                                                                   |
| R16 depoimentos             | ⛔ backlog  | Sem avaliações verificáveis; não inventamos `aggregateRating`                                                                                           |
| S9 analytics inválido       | ✅          | Script injetado apenas quando `VITE_ANALYTICS_ENDPOINT` existe; build sem avisos                                                                        |

### 11.3 Evidências de validação (QA)

| Verificação                             | Resultado                                                                                                                                                                       |
| --------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `pnpm check` (`tsc --noEmit`, strict)   | ✅ sem erros                                                                                                                                                                    |
| `pnpm test` (`vitest run`)              | ✅ 24 testes em `shared/site.test.ts`                                                                                                                                           |
| `pnpm build` (`vite build` + `esbuild`) | ✅ conclui **sem avisos** de env                                                                                                                                                |
| HTML gerado (`dist/public/index.html`)  | ✅ 0 tokens `%SITE_*%` pendentes; `<title>`, `description`, `robots`, `canonical`, OG/Twitter e JSON-LD presentes                                                               |
| JSON-LD                                 | ✅ válido (`JSON.parse`), 3,5 kB, tipos `HealthAndBeautyBusiness`/`WebSite`/`FAQPage`; sem `openingHours`, `priceRange` ou `aggregateRating`                                    |
| HTTP em produção (`node dist/index.js`) | ✅ `/` 200 + `Cache-Control: no-cache`; `/robots.txt` 200; `/sitemap.xml` 200; `/assets/*` 200 `immutable, max-age=31536000`; **`/manus-storage/ausente.jpg` → 404 (não HTML)** |
| `client/public/` → `dist/public/`       | ✅ `favicon.svg`, `robots.txt`, `sitemap.xml` e `manus-storage/.gitkeep` copiados                                                                                               |

### 11.4 Pendências (dependem da cliente / de ativos)

1. **Imagens (R1):** baixar os 7 arquivos para `client/public/manus-storage/`
   (idealmente em WebP) e atualizar `width`/`height` reais em `IMAGES`/`GALLERY`.
   Enquanto isso, a produção depende do proxy (`BUILT_IN_FORGE_API_*`).
2. **Confirmação do número de WhatsApp (R2):** o valor canônico assumido é
   `+55 51 9198-7703` (dossiê + site atual). Basta ajustar `CONTACT` se divergir.
3. **Domínio canônico:** definir `SITE_URL` no build (padrão atual:
   `https://espacotherapy.com.br`).
4. **Fotos de equipe e da fachada (R9/R11)** e **validação visual** das imagens
   (nitidez, enquadramento, paleta) — não observáveis sem os arquivos.
5. **Atribuição de especialidades por profissional (R10)** e **depoimentos (R16)**.
6. **Banner OG 1200×630** dedicado (hoje `og:image` aponta para a foto do interior).

### 11.5 Arquivos criados/alterados

**Criados:** `shared/site.ts`, `shared/site.test.ts`, `vitest.config.ts`,
`docs/seo-and-assets.md`, `.env.example`, `client/public/favicon.svg`,
`client/public/robots.txt`, `client/public/sitemap.xml`,
`client/public/manus-storage/.gitkeep`.

**Alterados:** `client/src/pages/Home.tsx`, `client/src/App.tsx`,
`client/src/index.css`, `client/index.html`, `vite.config.ts`, `server/index.ts`,
`package.json` (script `test`), `docs/README.md`, `docs/architecture.md`,
`docs/coding-standards.md`, `docs/common-pitfalls.md`, `docs/design-system.md`,
`skills/schema-structured-data.md`, `skills/state-data-fetching.md`,
`skills/web-performance.md` e este plano.

**Removido:** `client/src/components/Map.tsx` (código morto — R14).

### 11.6 Nota de formatação (Prettier)

Os arquivos tocados passaram por `prettier --write` (padrão de
`docs/coding-standards.md`). Em `client/src/index.css`, o Prettier expande cada
regra em várias linhas e normaliza valores (`.8fr` → `0.8fr`,
`rgba(20,16,13,.62)` → `rgba(20, 16, 13, 0.62)`); o estilo compacto
(uma regra por linha) foi restaurado para manter a convenção do arquivo.
**Verificação de equivalência:** o CSS compilado permaneceu byte a byte o mesmo
(`dist/public/assets/index-CpvFZzN8.css`) antes e depois da formatação —
ou seja, nenhuma regra ou valor foi alterado.

> Comandos de verificação: `pnpm check && pnpm test && pnpm build`.
