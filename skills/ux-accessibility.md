# Skill: UX & Acessibilidade

## Objetivo

Garantir usabilidade, conversão e acessibilidade (WCAG AA) na experiência do site.

## Heurísticas de UX

- **Clareza e consistência:** navegação, tipografia e CTAs padronizados.
- **Feedback imediato:** estados de hover/focus/active nas interações.
- **Eficiência:** menos cliques para a ação principal.
- **Hierarquia visual:** títulos serifados, eyebrow, espaçamento `.section-pad`.

## Conversão (foco do negócio)

- CTA de agendamento (**WhatsApp**) claro e presente: botão flutuante + seções.
- FAQ reduz fricção antes do primeiro contato.
- Sinais de confiança: endereço físico, Instagram real, link para o mapa.

## Acessibilidade (WCAG AA)

- **Contraste:** ≥ 4.5:1 (texto) / 3:1 (texto grande).
- **Alt text** descritivo em todas as imagens.
- **Foco visível** (já há `outline-ring/50` no base).
- **`aria-expanded`** em elementos expansíveis (o FAQ já usa).
- **Targets de toque** ≥ 48px; **font-size** ≥ 16px no mobile.
- **Navegação por teclado** e ordem de foco lógica.
- Links externos com `rel="noreferrer"` (padrão atual).

## Mobile-first

- `viewport` correto (já presente).
- Responsividade com breakpoints do Tailwind + `.container` (max-width 1240px).
- Sem scroll horizontal; leitura sem zoom.

## Complementar

- Ver `design-accessibility.md` (design system visual) e `web-performance.md`
  (velocidade também é UX).
