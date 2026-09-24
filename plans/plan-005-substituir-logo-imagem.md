# Plan 005 — Substituir logo por imagem `logo.jpg`

> **Status:** 📝 PRD — Aguardando aprovação
> **Data:** 2026-09-23

---

## 1. Objetivo

Substituir o logo atual (composto por ícone SVG `Flower2` + texto "Espaço _Therapy_")
por uma **imagem real** (`logo.jpg`) em **todos os locais do projeto** onde o logo
aparece, garantindo harmonia visual, tamanhos proporcionais e abordagem **mobile-first**.

---

## 2. Diagnóstico — Onde o logo aparece hoje

### 2.1 Componente `Logo` (React)

| Local           | Arquivo                     | Linha               |
| --------------- | --------------------------- | ------------------- |
| Header (navbar) | `client/src/pages/Home.tsx` | L62–82, uso em L131 |
| Footer          | `client/src/pages/Home.tsx` | L585                |

**Implementação atual:** `<a>` com dois `<span>`:

- `.logo-mark` → ícone `Flower2` (Lucide) dentro de círculo com borda
- `.logo-type` → texto "Espaço _Therapy_" em `Cormorant Garamond`

### 2.2 Estilos CSS do logo

| Classe                       | Arquivo                | Linha(s) |
| ---------------------------- | ---------------------- | -------- |
| `.logo`                      | `client/src/index.css` | L136     |
| `.logo-mark`                 | `client/src/index.css` | L137     |
| `.logo:hover .logo-mark`     | `client/src/index.css` | L138     |
| `.logo-type`                 | `client/src/index.css` | L139–140 |
| `.footer-inner .logo`        | `client/src/index.css` | L293     |
| `.logo-type` (mobile ≤480px) | `client/src/index.css` | L411     |

### 2.3 Favicon

| Local               | Arquivo                     | Linha       |
| ------------------- | --------------------------- | ----------- |
| `<link rel="icon">` | `client/index.html`         | L39         |
| Arquivo SVG         | `client/public/favicon.svg` | (27 linhas) |

### 2.4 Schema.org (JSON-LD)

| Local                               | Arquivo          | Linha |
| ----------------------------------- | ---------------- | ----- |
| `logo` do `HealthAndBeautyBusiness` | `shared/site.ts` | L442  |

> Atualmente aponta para `${url}/favicon.svg`.

### 2.5 Componente `ManusDialog`

| Local                  | Arquivo                                 | Linha            |
| ---------------------- | --------------------------------------- | ---------------- |
| Prop `logo` (opcional) | `client/src/components/ManusDialog.tsx` | L14, L23, L56–59 |

> Este componente aceita uma prop `logo` mas **não é usado** na Home atual.
> Baixa prioridade; mantê-lo como está (prop genérica).

---

## 3. Requisitos

### 3.1 Requisitos funcionais

| #     | Requisito                                                                                      |
| ----- | ---------------------------------------------------------------------------------------------- |
| RF-01 | O arquivo `logo.jpg` deve ser colocado em `client/public/` (raiz pública)                      |
| RF-02 | O componente `Logo` deve renderizar uma `<img>` com `src="/logo.jpg"` em vez dos spans atuais  |
| RF-03 | O logo deve ser exibido no **header** e no **footer** com tamanhos diferentes e proporcionais  |
| RF-04 | Gerar um `favicon.ico` ou `favicon.png` derivado do `logo.jpg` para substituir o `favicon.svg` |
| RF-05 | Atualizar o `logo` no JSON-LD (`shared/site.ts`) para apontar para `/logo.jpg`                 |
| RF-06 | Manter o `alt` descritivo: `"Espaço Therapy — Estética & Terapias"`                            |
| RF-07 | O logo deve ser link para `#inicio` (comportamento atual preservado)                           |

### 3.2 Requisitos de design (mobile-first)

| #     | Requisito                                                                                        |
| ----- | ------------------------------------------------------------------------------------------------ |
| RD-01 | **Mobile (≤ 480px):** altura do logo **~32px**, largura automática (`height: 32px; width: auto`) |
| RD-02 | **Tablet (481–800px):** altura do logo **~38px**                                                 |
| RD-03 | **Desktop (> 800px):** altura do logo **~44px**                                                  |
| RD-04 | **Footer:** logo ligeiramente menor que o header (~85% do tamanho do header)                     |
| RD-05 | A imagem deve ter `object-fit: contain` para nunca distorcer                                     |
| RD-06 | Transição suave no hover: `opacity 0.85 → 1.0` ou sutil `scale(1.03)`                            |
| RD-07 | O logo no header deve respeitar a altura do header (`--header-height`) sem ultrapassar o padding |
| RD-08 | Garantir que o fundo transparente/branco do JPG funcione sobre o fundo escuro do header (hero)   |

### 3.3 Requisitos de performance

| #     | Requisito                                                                |
| ----- | ------------------------------------------------------------------------ |
| RP-01 | O `logo.jpg` no header deve ter `fetchPriority="high"` (é LCP candidato) |
| RP-02 | Declarar `width` e `height` explícitos no `<img>` para evitar CLS        |
| RP-03 | Usar `decoding="async"` no footer                                        |

---

## 4. Arquivos a modificar

### 4.1 Novo arquivo

| Ação      | Arquivo                  | Descrição                             |
| --------- | ------------------------ | ------------------------------------- |
| **[ADD]** | `client/public/logo.jpg` | Imagem do logo fornecida pelo usuário |

### 4.2 Arquivos modificados

| Ação         | Arquivo                     | O que muda                                                                    |
| ------------ | --------------------------- | ----------------------------------------------------------------------------- |
| **[MODIFY]** | `client/src/pages/Home.tsx` | Componente `Logo` → `<img>` com variantes de tamanho                          |
| **[MODIFY]** | `client/src/index.css`      | Remover `.logo-mark`, `.logo-type`; criar estilos para `.logo-img` responsivo |
| **[MODIFY]** | `client/index.html`         | Atualizar `<link rel="icon">` para `/logo.jpg` (ou favicon derivado)          |
| **[MODIFY]** | `shared/site.ts`            | Alterar `logo: \`${url}/favicon.svg\`` → `logo: \`${url}/logo.jpg\``          |

### 4.3 Arquivo possivelmente removido

| Ação              | Arquivo                     | Condição                                               |
| ----------------- | --------------------------- | ------------------------------------------------------ |
| **[KEEP/DELETE]** | `client/public/favicon.svg` | Manter como fallback ou remover após gerar favicon.ico |

---

## 5. Implementação proposta

### 5.1 Componente `Logo` (novo)

```tsx
function Logo({
  onClick,
  className = "",
}: {
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  className?: string;
}) {
  return (
    <a
      className={`logo ${className}`}
      href="#inicio"
      onClick={onClick}
      aria-label="Espaço Therapy — início"
    >
      <img
        className="logo-img"
        src="/logo.jpg"
        alt="Espaço Therapy — Estética & Terapias"
        width={180}
        height={44}
        fetchPriority="high"
        decoding="async"
      />
    </a>
  );
}
```

### 5.2 CSS responsivo (mobile-first)

```css
/* ── Logo ─────────────────────────────────────────── */
.logo {
  color: inherit;
  display: inline-flex;
  align-items: center;
  text-decoration: none;
}

.logo-img {
  height: 32px; /* mobile-first */
  width: auto;
  object-fit: contain;
  transition:
    opacity 0.25s var(--ease-out),
    transform 0.25s var(--ease-out);
}

.logo:hover .logo-img {
  opacity: 0.88;
  transform: scale(1.03);
}

/* Footer: logo ligeiramente menor */
.footer-inner .logo-img {
  height: 28px;
}

/* ── Breakpoints ──────────────────────────────────── */
@media (min-width: 481px) {
  .logo-img {
    height: 38px;
  }
  .footer-inner .logo-img {
    height: 32px;
  }
}

@media (min-width: 801px) {
  .logo-img {
    height: 44px;
  }
  .footer-inner .logo-img {
    height: 38px;
  }
}
```

### 5.3 JSON-LD

```diff
- logo: `${url}/favicon.svg`,
+ logo: `${url}/logo.jpg`,
```

### 5.4 Favicon

```diff
- <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
+ <link rel="icon" href="/logo.jpg" type="image/jpeg" />
```

> **Nota:** Idealmente converter o `logo.jpg` para um `favicon.ico` 32×32 ou
> `favicon.png` 48×48 para melhor compatibilidade. Se não houver ferramenta
> disponível, apontar direto para `/logo.jpg` funciona na maioria dos browsers.

---

## 6. Imports que podem ser removidos

Após a substituição, o import `Flower2` de `lucide-react` só é usado em:

- `Logo` (será removido com a troca)
- `hero-stamp` (L238) — **manter**
- `team-mark` (L431) — **manter**

Portanto, **NÃO remover** o import `Flower2`, pois ele ainda é utilizado em outros
pontos da Home.

---

## 7. Questão sobre a imagem

> [!IMPORTANT]
> **O arquivo `logo.jpg` precisa ser fornecido pelo usuário.**
> Após receber a imagem, verificarei suas dimensões reais para ajustar os
> valores de `width`/`height` no `<img>` e calibrar os tamanhos responsivos
> proporcionalmente.

> [!WARNING]
> **Fundo da imagem:** Se o `logo.jpg` tiver fundo branco, ele pode contrastar
> negativamente sobre o header escuro (`#302b27`) e o footer escuro (`#27231f`).
> Neste caso, as opções são:
>
> 1. Solicitar uma versão com fundo transparente (`.png`)
> 2. Aplicar `mix-blend-mode: lighten` ou `screen` no CSS
> 3. Adicionar um `border-radius` suave com um fundo semi-transparente

---

## 8. Checklist de validação

- [ ] `logo.jpg` está em `client/public/` e acessível via `/logo.jpg`
- [ ] Logo aparece corretamente no **header** (sobre fundo escuro do hero)
- [ ] Logo aparece corretamente no **footer** (sobre fundo escuro)
- [ ] Tamanhos responsivos: 32px → 38px → 44px (mobile → tablet → desktop)
- [ ] Hover com efeito suave funcionando
- [ ] Link para `#inicio` preservado em header e footer
- [ ] Favicon atualizado no browser tab
- [ ] JSON-LD aponta para `/logo.jpg`
- [ ] `pnpm check` sem erros de TypeScript
- [ ] `pnpm build` compila sem falhas
- [ ] Verificação visual em viewport 375px, 768px e 1440px

---

## 9. Dependências

Nenhuma nova dependência é necessária. Apenas assets (imagem) e modificações em
arquivos existentes.

---

## 10. Riscos

| Risco                                             | Mitigação                                         |
| ------------------------------------------------- | ------------------------------------------------- |
| Logo JPG com fundo branco em header/footer escuro | Verificar imagem antes; sugerir PNG ou blend-mode |
| CLS por dimensões erradas                         | Medir imagem real e declarar `width`/`height`     |
| Qualidade do favicon derivado de JPG              | Gerar manualmente em 32×32 se necessário          |
| Logo muito grande em mobile                       | Testar em 375px e ajustar `height` conforme       |
