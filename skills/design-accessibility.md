# Skill: Design & Acessibilidade

## Objetivo
Aplicar o design system e garantir acessibilidade e responsividade.

## Design system (resumo)

- Paleta: areia/dourado (`--primary #b58a48`, `--background #f5f1ea`).
- Tipografia: Cormorant Garamond (títulos) + DM Sans (corpo).
- Classes utilitárias: `.container`, `.section-pad`, `.button*`, `.text-link`, `.eyebrow`.
- Ver `docs/design-system.md`.

## Acessibilidade

- Imagens com `alt` descritivo.
- Botões/links com rótulos acessíveis (`aria-label` quando só ícone).
- Estados de interação com `aria-expanded`/`aria-controls` (ex.: FAQ).
- Contraste adequado entre texto e fundo.
- Foco visível (`outline-ring/50` já configurado no base).

## Responsividade

- Use breakpoints do Tailwind e a classe `.container` (max-width 1240px).
- Teste mobile/desktop; preserve o layout da landing page.

## Regras

1. Reutilize tokens e classes existentes antes de criar novos estilos.
2. Não quebre a identidade visual (serifado, paleta, espaçamento).
3. Ícones com `lucide-react`; respeite tamanho/stroke consistentes.
