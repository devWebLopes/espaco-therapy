# Skill: UI shadcn/ui + Tailwind CSS

## Objetivo
Construir interfaces com os componentes shadcn/ui (Radix UI) e Tailwind CSS 4,
respeitando o design system.

## Conhecimentos necessários

- Tailwind CSS 4 (`@import "tailwindcss"`, `@theme`, `@layer`, `@custom-variant`).
- shadcn/ui estilo `new-york`, base `neutral`, `cssVariables: true`.
- Radix UI primitives, `class-variance-authority` (CVA), `cn()` (`@/lib/utils`).

## Componentes disponíveis (`client/src/components/ui/`)

`button`, `dialog`, `sheet`, `dropdown-menu`, `accordion`, `tabs`, `form`, `input`,
`textarea`, `select`, `checkbox`, `radio-group`, `switch`, `slider`, `tooltip`,
`popover`, `avatar`, `badge`, `card`, `table`, `carousel`, `chart`, `sonner`, etc.

## Regras

1. Use o helper `cn()` para classes condicionais.
2. Não quebre variantes existentes; siga o padrão CVA.
3. Prefira tokens CSS (`--primary`, `--background`, etc.) a cores hardcoded.
4. Classes utilitárias customizadas ficam em `@layer components` do `index.css`.
5. Não adicione novas libs de UI; use o que já existe.

## Exemplo (variante de botão)

```tsx
<Button variant="default">Exemplo</Button>
```

> Consulte `docs/design-system.md` para a paleta, tipografia e classes utilitárias.
