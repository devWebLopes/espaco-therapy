# Diretrizes de Frontend

## 1. Composição da aplicação

`client/src/App.tsx` define a árvore raiz:

```
ErrorBoundary
└── ThemeProvider (defaultTheme="light", switchable opcional)
    └── TooltipProvider
        └── Toaster (sonner)
            └── Router (wouter Switch/Route)
```

- **Tema:** `ThemeProvider` aplica/remove a classe `dark` no `<html>` e, se
  `switchable`, persiste em `localStorage`. Use `useTheme()` para alternar.
- **Roteamento:** adicione rotas no `Switch` de `App.tsx`. Rota `*` cai em `NotFound`.

## 2. Páginas

- **Home (`pages/Home.tsx`):** landing page completa. Contém `Logo`, `SectionIntro`
  e seções (hero, serviços, oferta, galeria, visita, FAQ, footer, WhatsApp flutuante).
- **NotFound (`pages/NotFound.tsx`):** página 404.

> Ao criar novas páginas, siga o padrão visual (seções com `.container`/`.section-pad`
> e componentes `SectionIntro`, `eyebrow`, etc.) e registre a rota em `App.tsx`.

## 3. Componentes de UI (shadcn/ui)

- Localizados em `client/src/components/ui/` (ex.: `button.tsx`, `dialog.tsx`,
  `sheet.tsx`, `accordion.tsx`, `form.tsx`, `sonner.tsx`).
- Base: Radix UI + `class-variance-authority` + `cn()`.
- Para adicionar novos componentes, respeite o padrão shadcn (variantes via CVA,
  `data-slot`, `forwardRef` quando aplicável).

## 4. Hooks disponíveis

| Hook | Uso |
|---|---|
| `useComposition` | Detecção de composição de input (IME) |
| `useMobile` | Detecção de viewport mobile (breakpoint) |
| `usePersistFn` | Referência estável de função (evita re-render) |
| `useTheme` | Acesso/alternância de tema |

## 5. Formulários

- Use `react-hook-form` + `zod` (`@hookform/resolvers`).
- Componente base: `client/src/components/ui/form.tsx` (Form, FormField, etc.).
- Validação declarativa com schema zod; mensagens em pt-BR.

## 6. Estado e dados

- Estado local simples → `useState`.
- Estado compartilhado → Context (padrão do `ThemeContext`).
- Requisições HTTP → `axios`.
- Não introduza biblioteca de gerenciamento de estado global sem necessidade
  (não está no `package.json`).

## 7. Estilo

- Tailwind CSS 4 com `@layer components` para classes customizadas (`container`,
  `section-pad`, `button`, `text-link`, etc.).
- Tokens de cor/raio em `:root` (ver `docs/design-system.md`).
- Prefira reutilizar classes existentes em `index.css` antes de criar CSS novo.

## 8. Acessibilidade

- Imagens com `alt` descritivo.
- Ícones decorativos com `aria-hidden` quando necessário.
- Estados de abertura com `aria-expanded` (ex.: FAQ).
- Links externos com `target="_blank" rel="noreferrer"`.
