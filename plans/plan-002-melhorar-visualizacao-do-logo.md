# PRD — Melhorar a Visualização do Logo e a Harmonia Visual do Site

> **Tipo de documento:** PRD (Product Requirements Document)
> **Nome curto:** `melhorar-visualizacao-do-logo`
> **Tipo:** WEB (SPA) · **Stack:** React 19 + TS 5.6 + Vite 7 + Tailwind 4
> **Agente responsável:** Designer (`agents/designer-agent.md`) + Frontend (`agents/frontend-agent.md`)
> **Skills:** `design-accessibility`, `ui-shadcn-tailwind`, `web-performance`

---

## 1. Contexto e objetivo

O site institucional do **Espaço Therapy** adota uma identidade "serena" (paleta
areia/dourado, tipografia Cormorant Garamond + DM Sans), mas a marca é o ponto de
entrada da experiência e hoje está desconectada dessa elegância.

O objetivo deste PRD é **unificar a identidade visual** a partir do logo e
corrigir os desequilíbrios de tipografia, contraste, textura e hierarquia que
prejudicam a percepção premium do site — sem alterar a estrutura, o conteúdo ou
os links de contato existentes.

**Princípio-guia:** toda mudança deve reforçar a harmonia e a legibilidade,
preservando a paleta e a tipografia já estabelecidas no design system
(`docs/design-system.md`), e **nunca** remover funcionalidade existente.

---

## 2. Estado atual (linha de base)

Mapeamento do código relevante para a implementação:

| Item                       | Local                                                                                 | Situação observada                                                                         |
| -------------------------- | ------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| Logo (arquivo)             | `client/public/logo.jpg`                                                              | Caixa branca embutida; lótus distorcido; tipografia datada                                 |
| Logo (componente)          | `client/src/pages/Home.tsx:62` (`Logo`)                                               | `<img src="/logo.jpg">` usado no header e no footer                                        |
| Estilo do logo (header)    | `client/src/index.css:137` (`.logo-img`)                                              | `mix-blend-mode: multiply; filter: brightness(1.35)`                                       |
| Estilo do logo (footer)    | `client/src/index.css:292` (`.footer-inner .logo-img`)                                | `mix-blend-mode: screen`                                                                   |
| Subtítulo (hero)           | `client/src/pages/Home.tsx:192`                                                       | `Estética & terapias · São Leopoldo` — hoje é o _eyebrow_ do hero, não o subtítulo do logo |
| Botão "Descobrir o espaço" | `client/src/pages/Home.tsx:206` + `.button`/`.button-dark` (`index.css:165-169`)      | Fonte/apresentação inconsistente                                                           |
| Selo "feito para você"     | `client/src/pages/Home.tsx:237` + `.hero-stamp` (`index.css:180`)                     | Flutua sem contexto, rotacionado −11°                                                      |
| WhatsApp flutuante         | `client/src/pages/Home.tsx:606` + `.floating-whatsapp` (`index.css:299`)              | Verde genérico `#25d366`, fora da paleta                                                   |
| Ícone WhatsApp             | `client/src/pages/Home.tsx:32` (`WhatsAppIcon`) + rodapé/CTA                          | SVG próprio (correto), mas aplicado em superfícies dissociadas                             |
| Rodapé                     | `client/src/pages/Home.tsx:585` + `.site-footer`/`.footer-copy` (`index.css:289-298`) | Fonte pequena (0.6rem), baixa legibilidade                                                 |
| Fundo hero                 | `client/src/index.css:145` (`.hero`)                                                  | `#302b27` plano, apenas um `::before` de pontos (radial 0.1)                               |

---

## 3. Problemas identificados

### 3.1 Identidade visual (logo)

- **P1 — Caixa branca:** o logo é um JPEG com fundo branco embutido, formando um
  bloco desconexo sobre o fundo escuro do header/hero.
- **P2 — Tipografia datada:** o nome "Espaço Therapy" no arquivo usa fonte de
  baixa legibilidade, contrastando com a serif elegante do restante.
- **P3 — Lótus distorcido:** o símbolo não é simétrico nem proporcional.

### 3.2 Harmonia e UX

- **P4 — Hierarquia tipográfica:** o subtítulo "ESTÉTICA & TERAPIAS · SÃO
  LEOPOLDO" está descentralizado em relação ao nome da marca.
- **P5 — Fonte dos botões:** "DESCOBRIR O ESPAÇO" foge da padronização visual dos
  demais botões (fonte serifada percebida).
- **P6 — Rodapé ilegível:** endereço/textos com fonte muito pequena (0.6rem).
- **P7 — Fundo plano:** o marrom-escuro carece de profundidade/textura.
- **P8 — WhatsApp genérico:** ícone verde padrão destoa da estética premium.
- **P9 — Selo deslocado:** o selo dourado "FEITO PARA VOCÊ" flutua sem contexto
  nem conexão com o conteúdo.

---

## 4. Requisitos

### 4.1 Requisitos do logo (prioridade alta)

**R1 — Remover a caixa branca.**

- Substituir `client/public/logo.jpg` por um ativo **transparente (PNG/SVG)** ou
  reproduzir o logo em markup vetorial (SVG inline), para integrar ao fundo
  escuro sem "bloco branco".
- Ajustar/remover os filtros de correção que hoje compensam o fundo branco
  (`mix-blend-mode` + `brightness/contrast` em `.logo-img` e
  `.footer-inner .logo-img`), substituindo por variantes claras/escuras
  **opticamente idênticas** (não por filtros frágeis). Manter o
  `mix-blend-mode` apenas se necessário para as duas superfícies.

**R2 — Tipografia do nome em serif elegante.**

- Reescrever "ESPAÇO THERAPY" com **Cormorant Garamond** (ou equivalente do
  `--font-display`), em caixa alta espaçada, legível e alinhada ao ícone.

**R3 — Refinar o lótus.**

- Simetrizar e proporcionalizar o símbolo; aceitável a reinterpretação como
  **forma geométrica abstrata em dourado metálico escovado** (`#b58a48` /
  `#cba76c`), desde que mantenha reconhecimento.

**R4 — Centralizar o subtítulo.**

- Posicionar "ESTÉTICA & TERAPIAS · SÃO LEOPOLDO" **centralizado, logo abaixo**
  do nome, em `--font-sans` (DM Sans) clean/fino, com espaçamento rastreável
  (`letter-spacing`). Substituir ou alinhar com o atual `hero-eyebrow`
  (`Home.tsx:192`), evitando duplicação de mensagem.

### 4.2 Requisitos de harmonia e UX (prioridade média/alta)

**R5 — Padronizar tipografia dos botões.**

- Garantir que **todos** os botões (`.button`, `.button-dark`, `.button-cream`,
  `.nav-cta`) usem uma única fonte sans-serif (`--font-sans`, DM Sans). Corrigir
  qualquer regra que imponha serif ao "Descobrir o espaço".
- Opcional: aplicar ao `.button-dark` primário um acabamento "metal escovado
  dourado" discreto (gradiente sutil), mantendo contraste AA.

**R6 — Aumentar legibilidade do rodapé.**

- Elevar o tamanho de fonte do endereço/textos do rodapé (mínimo sugerido
  ~0.72rem–0.78rem; atual 0.6rem em `.footer-copy`), preservando hierarquia.

**R7 — Adicionar textura sutil ao fundo escuro.**

- Adicionar gradiente leve (marrom-espresso profundo) e/ou textura de veludo ou
  pedra **discreta** (ex.: `::before`/`::after` com `background` de ruído ou
  gradiente radial) às superfícies escuras (`.hero`, `.offer`), mantendo
  desempenho (sem imagens pesadas) e legibilidade do texto.

**R8 — Estilizar o ícone do WhatsApp.**

- Substituir o verde padrão `#25d366` (`.floating-whatsapp`) por um acabamento
  que dialogue com a paleta (dourado metálico `#b58a48` ou integração monocromática
  elegante), atualizando também os estados de borda/glow (`::before`/`::after`)
  que hoje dependem de `#25d366`.
- Manter o SVG próprio `WhatsAppIcon` como fonte do símbolo (consistência), apenas
  refinando cor/superfície.

**R9 — Integrar o selo "feito para você".**

- Refinar `.hero-stamp` como "medalha gravada" (borda interna em relevo, tipografia
  centrada) e reposicionar/conectar à composição (ex.: ancorar ao frame do hero ou
  aproximar do `.hero-vertical`), adicionando contexto se necessário.

---

## 5. Requisitos não funcionais

- **NFR1 — Acessibilidade:** manter contraste mínimo WCAG AA em todo texto
  alterado; manter `alt`/`aria-label` do logo (`aria-label="Espaço Therapy —
início"`). O logo vetorial deve manter foco e legenda equivalentes.
- **NFR2 — Desempenho:** nenhuma nova dependência; preferir SVG inline ou PNG/WebP
  leve. Não introduzir fontes externas além das já carregadas.
- **NFR3 — Consistência:** não romper tokens do `design-system.md`; novas classes
  em `@layer components` no `index.css`.
- **NFR4 — SEO:** atualizar a referência `logo: ${url}/logo.jpg` no JSON-LD
  (`shared/site.ts:442`) **somente se** o arquivo de logo mudar de nome/formatovec.
- **NFR5 — Multiplataforma:** validar logo claro/escuro em header (fundo escuro) e
  footer (fundo escuro) e, se houver superfícies claras, oferecer variante escura.

---

## 6. Priorização (sugerida para execução)

| Ordem | Item                                   | Requisitos | Esforço                |
| ----- | -------------------------------------- | ---------- | ---------------------- |
| 1     | Logo transparente + tipografia + lótus | R1–R4      | Alto (design de asset) |
| 2     | Subtítulo centralizado                 | R4         | Baixo                  |
| 3     | Padronizar fonte dos botões            | R5         | Baixo                  |
| 4     | WhatsApp dourado/integrado             | R8         | Baixo                  |
| 5     | Textura do fundo escuro                | R7         | Médio                  |
| 6     | Selo integrado                         | R9         | Médio                  |
| 7     | Rodapé legível                         | R6         | Baixo                  |

---

## 7. Fora de escopo

- Alterações de conteúdo, serviços, preços, FAQ ou links de contato.
- Mudanças na arquitetura, no stack ou inclusão de novas dependências.
- Reconstrução do design system (apenas refinamentos que respeitem os tokens).
- Qualquer mudança que reduza a legibilidade, a acessibilidade ou o desempenho.

---

## 8. Critérios de aceite (Definition of Done)

- [ ] Logo exibido **sem caixa branca**, transparente sobre o fundo escuro do
      header e do footer.
- [ ] Nome "ESPAÇO THERAPY" em serif elegante e legível; lótus simétrico/proporcional.
- [ ] Subtítulo "ESTÉTICA & TERAPIAS · SÃO LEOPOLDO" centralizado sob o nome, em DM Sans.
- [ ] Todos os botões usam a mesma fonte sans-serif; sem serif em CTAs.
- [ ] Rodapé com endereço legível (fonte ampliada).
- [ ] Fundo escuro com textura/gradiente sutil e profundo.
- [ ] Ícone flutuante de WhatsApp estilizado conforme a paleta (sem verde genérico).
- [ ] Selo "feito para você" integrado à composição, com aparência de medalha.
- [ ] `pnpm check` sem erros; `pnpm build`/`pnpm dev` validados; nenhuma
      dependência nova.
- [ ] Revisão visual em viewports mobile e desktop (loveco mobile testado).

---

## 9. Observações

- **Dependência de asset:** R1–R3 dependem da entrega/substituição de
  `client/public/logo.jpg`. Caso o cliente ainda não disponha do logo transparente,
  o Designer pode gerar uma versão vetorial intermediária mantendo o símbolo atual
  apenas reformulado (R3).
- **Fonte única de verdade:** os links de contato, endereço e textos seguem em
  `shared/site.ts` — este PRD não altera esses valores.
- Registrar, ao implementar, qualquer decisão de design (ex.: valores de gradiente,
  cor final do WhatsApp) para atualizar `docs/design-system.md` se necessário.
