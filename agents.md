# agents.md — Cérebro e Ponto de Entrada da IA

> **LEIA-ME PRIMEIRO.** Este arquivo é o cérebro do projeto e o ponto de entrada de
> toda e qualquer tarefa executada por um agente de IA neste repositório.

---

## 1. Contexto e objetivos gerais

**Projeto:** Espaço Therapy — Estética & Terapias
**Tipo:** WEB (Single Page Application) com servidor Node/Express servindo estáticos.

O projeto é o site institucional do Espaço Therapy, um espaço de estética e terapias
localizado em São Leopoldo/RS. O objetivo é oferecer uma experiência elegante,
responsiva e acessível de apresentação dos serviços, galeria, FAQ e canais de
contato (WhatsApp, Instagram e mapa), com foco em identidade visual sofisticada
(estética "serena" com paleta areia/dourado e tipografia Cormorant Garamond + DM Sans).

**Stack consolidada (versões reais do repositório):**

| Camada      | Tecnologia                                                |
| ----------- | --------------------------------------------------------- |
| UI          | React 19.2, React DOM 19.2                                |
| Linguagem   | TypeScript 5.6 (modo `strict`)                            |
| Build       | Vite 7, esbuild (bundle do servidor)                      |
| Estilo      | Tailwind CSS 4.1, `tw-animate-css`, `tailwindcss-animate` |
| Componentes | shadcn/ui (estilo `new-york`, base `neutral`) + Radix UI  |
| Roteamento  | wouter 3.3 (com patch em `patches/`)                      |
| Servidor    | Express 4.21 (static + SPA fallback)                      |
| Formulários | react-hook-form 7.64 + @hookform/resolvers + zod 4        |
| Dados/HTTP  | axios                                                     |
| Animações   | framer-motion 12                                          |
| Gráficos    | recharts 2.15                                             |
| Ícones      | lucide-react                                              |
| Toasts      | sonner                                                    |
| Tema        | next-themes + `ThemeContext` próprio                      |
| Markdown    | streamdown                                                |
| Testes      | vitest 2.1                                                |
| Gerenciador | pnpm 10                                                   |
| Formatação  | prettier 3                                                |

---

## 2. Mapa da estrutura criada

```
espaco-therapy/
├── agents.md                 ← VOCÊ ESTÁ AQUI (cérebro / entrada)
├── docs/                     ← Diretrizes, arquitetura e padrões
│   ├── README.md             ← Índice principal da documentação
│   ├── architecture.md       ← Visão arquitetural detalhada
│   ├── coding-standards.md   ← Convenções de código e formatação
│   ├── frontend-guidelines.md← Boas práticas de frontend
│   ├── design-system.md      ← Tokens de design e componentes visuais
│   ├── backend-guidelines.md ← Diretrizes do servidor Express
│   ├── quality-and-testing.md← QA, testes e validação
│   └── common-pitfalls.md    ← Armadilhas comuns a evitar
├── skills/                   ← Habilidades técnicas/regras de negócio
│   ├── README.md             ← Índice de skills
│   ├── react-typescript.md
│   ├── ui-shadcn-tailwind.md
│   ├── forms-validation.md
│   ├── routing-navigation.md
│   ├── state-data-fetching.md
│   ├── backend-express.md
│   ├── quality-testing.md
│   ├── design-accessibility.md
│   ├── build-deploy.md
│   ├── seo-technical-onpage.md
│   ├── schema-structured-data.md
│   ├── ai-seo.md
│   ├── web-performance.md
│   └── ux-accessibility.md
├── agents/                   ← Agentes especializados do ciclo de desenvolvimento
│   ├── README.md             ← Índice de agentes (quando acioná-los)
│   ├── architect-agent.md    ← Orquestração e decisões de arquitetura
│   ├── frontend-agent.md     ← UI, páginas, componentes
│   ├── backend-agent.md      ← Servidor, APIs, integrações
│   ├── designer-agent.md     ← Identidade visual, design system, acessibilidade
│   └── qa-agent.md           ← Testes, revisão e validação
├── plans/                    ← Planejamentos das tarefas
│   └── plan-001-inicializar-estrutura-ia.md
├── client/                   ← Código do frontend (React)
├── server/                   ← Código do servidor (Express)
├── shared/                   ← Código compartilhado (constantes, tipos)
└── patches/                  ← Patches de dependências (ex.: wouter)
```

---

## 3. Regras rígidas de funcionamento

> Estas regras **não são opcionais**. Todo agente de IA deve obedecê-las antes de
> iniciar qualquer nova tarefa ou modificar qualquer arquivo de código.

1. **Sempre consultar este arquivo (`agents.md`)** antes de iniciar qualquer tarefa.
2. **Ler `docs/README.md`** e as diretrizes relevantes ao tipo de trabalho
   (arquitetura, frontend, backend, design, QA) **antes de escrever código**.
3. **Consultar `skills/README.md`** e carregar as skills aplicáveis à tarefa.
4. **Consultar `agents/README.md`** para identificar o agente correto e quando acioná-lo.
5. **Registrar um plano em `plans/`** (incrementando o número `plan-00N`) antes de
   implementar qualquer funcionalidade não-trivial.
6. **Nunca inventar dependências**: usar somente bibliotecas já presentes em
   `package.json`. Qualquer nova dependência exige justificativa explícita.
7. **Seguir as convenções existentes** (aliases `@/`, `@shared/`, `@assets/`,
   nome de arquivos, Prettier com `semi: true`, `singleQuote: false`, etc.).
8. **Validar ao final**: rodar `pnpm check` (TypeScript) e, quando possível,
   `pnpm dev` / `pnpm build`, e revisar os arquivos alterados/criados.
9. **Não remover funcionalidade existente** sem antes documentar o motivo no plano.
10. **Escrever tudo em português (pt-BR)** para documentação e comentários,
    mantendo o código-fonte com identificadores em inglês (convenção atual).

---

## 4. Fluxo de trabalho padrão (workflow)

```
1. Ler agents.md (este arquivo) ............ contexto + regras
2. Ler docs/README.md ..................... diretrizes aplicáveis
3. Ler skills/README.md ................... habilidades necessárias
4. Identificar agente (agents/README.md) .. quem executa
5. Criar plano em plans/plan-00N-*.md ..... passo a passo + validação
6. Executar seguindo o plano .............. implementação
7. Validar (pnpm check / build / review) .. garantia de qualidade
8. Atualizar/entregar ..................... resumo + arquivos alterados
```

> **Ponto de atenção:** `client/src/pages/Home.tsx` já contém uma landing page
> completa e customizada (não é mais o template de exemplo). Qualquer alteração
> deve preservar a identidade visual e os links de contato atuais.
