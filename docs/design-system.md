# Design System

## 1. Paleta de cores (tokens em `client/src/index.css`)

| Token                            | Valor                   | Uso                     |
| -------------------------------- | ----------------------- | ----------------------- |
| `--primary`                      | `#b58a48` (dourado)     | Ações, destaques, hover |
| `--primary-foreground`           | `#fffaf2`               | Texto sobre primário    |
| `--background`                   | `#f5f1ea` (areia claro) | Fundo principal         |
| `--foreground`                   | `#27231f`               | Texto principal         |
| `--card`                         | `#eee8de`               | Superfícies de card     |
| `--popover`                      | `#fffaf2`               | Popovers                |
| `--secondary`                    | `#e4dacb`               | Superfícies secundárias |
| `--muted` / `--muted-foreground` | `#e8e0d5` / `#73685d`   | Texto atenuado          |
| `--accent`                       | `#c7a56d`               | Acentos                 |
| `--destructive`                  | `#9b382e`               | Erros/destrutivo        |
| `--border` / `--input`           | `#d9cec0`               | Bordas e inputs         |
| `--ring`                         | `#b58a48`               | Foco                    |

- Tema escuro: `.dark { --background: #27231f; --foreground: #f5f1ea; }`.

## 2. Tipografia

| Token            | Valor                                                  |
| ---------------- | ------------------------------------------------------ |
| `--font-display` | `"Cormorant Garamond", Georgia, serif` (títulos/h1-h3) |
| `--font-sans`    | `"DM Sans", Arial, sans-serif` (corpo)                 |

- Títulos usam `font-family: var(--font-display)`, `font-weight: 400`,
  `letter-spacing: -0.045em`.
- Destaques em itálico (`<i>`/`<em>`) usam `color: #cba76c`.

## 3. Raio e movimento

- `--radius: 0.25rem`; raios derivados `--radius-sm/md/lg/xl`.
- Easings: `--ease-out: cubic-bezier(0.23, 1, 0.32, 1)`,
  `--ease-in-out: cubic-bezier(0.77, 0, 0.175, 1)`.

## 4. Classes utilitárias customizadas (`@layer components`)

| Classe                                                               | Uso                                                               |
| -------------------------------------------------------------------- | ----------------------------------------------------------------- |
| `.container`                                                         | `max-width: 1240px; margin-inline: auto; padding-inline: 1.25rem` |
| `.section-pad`                                                       | `padding-block: 5.75rem`                                          |
| `.site-header` / `.header-inner`                                     | Header absoluto com navegação                                     |
| `.logo` / `.logo-mark` / `.logo-type`                                | Identidade/marca                                                  |
| `.main-nav`                                                          | Navegação principal (uppercase, espaçada)                         |
| `.button` / `.button-dark` / `.button-cream`                         | Botões (uppercase, espaçados)                                     |
| `.text-link`                                                         | Link com sublinhado e hover                                       |
| `.eyebrow`                                                           | Rótulo pequeno antes de títulos                                   |
| `.section-intro` / `.intro-copy`                                     | Introdução de seção                                               |
| `.floating-whatsapp`                                                 | Botão flutuante de WhatsApp                                       |
| `.team` / `.team-inner` / `.team-list` / `.team-name` / `.team-mark` | Seção de equipe (prova social)                                    |
| `.skip-link`                                                         | Link "pular para o conteúdo" (visível no foco por teclado)        |

## 5. Regras de design

1. Preserve a paleta areia/dourado e a tipografia serifada (Cormorant Garamond).
2. Mantenha consistência de espaçamento (`.section-pad`, `.container`).
3. Use `lucide-react` para ícones (ex.: `Flower2`, `Instagram`, `MessageCircle`).
4. Novas classes utilitárias devem ser adicionadas em `@layer components` no `index.css`.
5. Respeite contraste e acessibilidade (ver `docs/frontend-guidelines.md`).
