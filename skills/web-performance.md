# Skill: Web Performance (Core Web Vitals)

## Objetivo

Medir e otimizar o desempenho de carregamento e a estabilidade visual
(LCP, INP, CLS) — velocidade também é SEO e UX.

## Limiares (bom / precisa melhorar / ruim)

| Métrica     | Bom     | Melhorar | Ruim    |
| ----------- | ------- | -------- | ------- |
| TTFB        | < 800ms | < 1.8s   | > 1.8s  |
| FCP         | < 1.8s  | < 3s     | > 3s    |
| LCP         | < 2.5s  | < 4s     | > 4s    |
| INP         | < 200ms | < 500ms  | > 500ms |
| TBT         | < 200ms | < 600ms  | > 600ms |
| CLS         | < 0.1   | < 0.25   | > 0.25  |
| Speed Index | < 3.4s  | < 5.8s   | > 5.8s  |

## Fluxo de auditoria

1. **Carregar** a página (navigate).
2. **Trace** com reload para cold-load (performance_start_trace).
3. **Analisar insights**: `LCPBreakdown`, `CLSCulprits`, `RenderBlocking`,
   `NetworkDependencyTree`.
4. **Análise de rede** (list_network_requests): render-blocking, cadeias, cache.
5. **Snapshot de acessibilidade** (take_snapshot).

## Oportunidades específicas deste projeto

- **Fontes:** Cormorant Garamond + DM Sans carregadas via Google Fonts no `index.html` (com `preconnect`).
  Se virarem gargalo de LCP, considere `preload` da fonte crítica + `font-display: swap` e evite
  CLS declarando `size-adjust`/fallback.
- **Imagens:** hero/galeria servidas via `/manus-storage/`. Comprima (WebP/AVIF),
  sirva em dimensões corretas, use `loading="lazy"` abaixo da dobra e
  `fetchpriority="high"` na imagem hero (impacto direto no LCP). `width`/`height` vêm de `IMAGES`/`GALLERY` (`shared/site.ts`) e evitam CLS.
- **Scripts:** use `defer`/`async`; nada de render-blocking desnecessário no `<head>`. O analytics só é injetado quando `VITE_ANALYTICS_ENDPOINT` existe.
- **Cache:** `server/index.ts` define `no-cache` para HTML, `immutable` (1 ano) para `/assets/*` e 30 dias para imagens versionadas.
- **Crawlers:** `robots.txt`/`sitemap.xml` são gerados pelo servidor a partir de `shared/site.ts` e não bloqueiam bots de IA (AI SEO).
- **Bundle:** Vite já faz tree-shaking; mantenha imports nomeados de `lucide-react`
  (padrão atual) em vez de importar o pacote inteiro.

## Regras

1. Verifique antes de recomendar; não sugira remover algo sem confirmar que é usado.
2. Quantifique impacto (ex.: "comprimir hero.png (450KB) → WebP") — não seja vago.
3. Não priorize mudanças com impacto ~0ms.
4. Se LCP já é ~200ms e CLS = 0, o site já está ótimo — diga isso.
