# Skills — Índice

As skills descrevem habilidades técnicas, regras de negócio e ferramentas que os
agentes de IA precisam dominar para operar neste projeto. Cada skill é um arquivo
`.md` nesta pasta e pode ser atribuída a um ou mais agentes (ver `../agents/README.md`).

## Lista de skills

| Skill                   | Arquivo                                                    | O que cobre                                  |
| ----------------------- | ---------------------------------------------------------- | -------------------------------------------- |
| React + TypeScript      | [`react-typescript.md`](./react-typescript.md)             | JSX/TSX, tipos, hooks, padrões de componente |
| UI shadcn/ui + Tailwind | [`ui-shadcn-tailwind.md`](./ui-shadcn-tailwind.md)         | Componentes Radix, CVA, Tailwind 4, tokens   |
| Formulários & Validação | [`forms-validation.md`](./forms-validation.md)             | react-hook-form + zod                        |
| Roteamento & Navegação  | [`routing-navigation.md`](./routing-navigation.md)         | wouter, rotas, fallback 404                  |
| Estado & Dados          | [`state-data-fetching.md`](./state-data-fetching.md)       | useState, Context, axios                     |
| Backend Express         | [`backend-express.md`](./backend-express.md)               | Servidor, static, SPA fallback, env          |
| Qualidade & Testes      | [`quality-testing.md`](./quality-testing.md)               | tsc, prettier, vitest, checklist QA          |
| Design & Acessibilidade | [`design-accessibility.md`](./design-accessibility.md)     | Design system, a11y, responsividade          |
| Build & Deploy          | [`build-deploy.md`](./build-deploy.md)                     | Scripts pnpm, build, esbuild, deploy         |
| SEO Técnico & On-page   | [`seo-technical-onpage.md`](./seo-technical-onpage.md)     | Crawl, indexação, meta tags, OG, SEO local   |
| Dados Estruturados      | [`schema-structured-data.md`](./schema-structured-data.md) | JSON-LD, LocalBusiness, FAQPage              |
| AI SEO                  | [`ai-seo.md`](./ai-seo.md)                                 | AEO/GEO, llms.txt, prontidão para agentes    |
| Web Performance         | [`web-performance.md`](./web-performance.md)               | Core Web Vitals, LCP/INP/CLS, otimização     |
| UX & Acessibilidade     | [`ux-accessibility.md`](./ux-accessibility.md)             | Heurísticas UX, conversão, WCAG AA           |

## Como usar

1. Identifique as skills necessárias para a tarefa.
2. Leia o arquivo correspondente antes de implementar.
3. Siga as regras nelas descritas e valide conforme `quality-testing.md`.
