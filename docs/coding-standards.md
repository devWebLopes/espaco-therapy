# Padrões de Código

## 1. TypeScript

- `strict: true`, `noEmit: true`, `module: ESNext`, `moduleResolution: bundler`.
- `jsx: preserve`, `allowImportingTsExtensions: true`.
- `types: ["node", "vite/client"]`.
- Use tipos explícitos em props de componentes (interfaces/types), evitando `any`.
- Exporte constantes compartilhadas por `shared/` e re-exporte em `client/src/const.ts`.

## 2. Formatação (Prettier)

Configuração em `.prettierrc`:

| Regra           | Valor                  |
| --------------- | ---------------------- |
| `semi`          | `true`                 |
| `singleQuote`   | `false` (aspas duplas) |
| `trailingComma` | `es5`                  |
| `printWidth`    | `80`                   |
| `tabWidth`      | `2`                    |
| `useTabs`       | `false`                |
| `arrowParens`   | `avoid`                |
| `endOfLine`     | `lf`                   |

> Rode `pnpm format` antes de finalizar alterações.

## 3. Nomenclatura

- **Componentes:** `PascalCase` (ex.: `ErrorBoundary`, `SectionIntro`).
- **Arquivos de componentes:** `PascalCase.tsx`.
- **Hooks:** `camelCase` com prefixo `use` (ex.: `usePersistFn`, `useMobile`).
- **Funções/utilidades:** `camelCase` (ex.: `cn`, `getLoginUrl`).
- **Constantes:** `UPPER_SNAKE_CASE` (ex.: `COOKIE_NAME`, `ONE_YEAR_MS`).
- **Identificadores de código:** inglês; **documentação/comentários:** pt-BR.

## 4. Imports e ordem

1. Imports de bibliotecas externas (`react`, `lucide-react`, etc.).
2. Imports com aliases (`@/`, `@shared/`).
3. Imports relativos (`./`, `../`).

Exemplo:

```tsx
import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { COOKIE_NAME } from "@/const";
```

## 5. Padrões de componente

- Componentes de UI pequenos e reutilizáveis em `client/src/components/ui/` (shadcn/ui).
- Componentes de domínio em `client/src/components/` (ex.: `ErrorBoundary.tsx`).
- Páginas em `client/src/pages/`.
- Conteúdo, contato e dados de SEO da home em `shared/site.ts` — nunca duplique
  número de WhatsApp, endereço, preço ou FAQ dentro dos componentes.
- Use o helper `cn()` (`@/lib/utils`) para compor classes condicionais.
- Mantenha estado local simples com `useState`; suba para contexto somente quando
  compartilhado (ex.: `ThemeContext`).

## 6. Boas práticas gerais

- Não use `any`; prefira tipos corretos.
- Trate erros com `ErrorBoundary` em níveis de rota/página.
- Use `key` estáveis em listas.
- Respeite `alt` em imagens e atributos `aria-*` para acessibilidade.
- Não duplique constantes: centralize em `shared/` ou `client/src/const.ts`.
