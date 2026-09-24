# Plano 001 — Inicializar Estrutura Base do Projeto

> **Tarefa Atual:** Inicializar a estrutura base do projeto com documentação,
> skills, agentes, planejamento e o arquivo mestre `agents.md`.
>
> **Nome curto:** `inicializar-estrutura-ia`
> **Tipo:** WEB (SPA) · **Stack:** React 19 + TS 5.6 + Vite 7 + Tailwind 4 + shadcn/ui + Express 4 + pnpm 10

---

## 1. Contexto e objetivo

O repositório `espaco-therapy` é um site institucional (React SPA + servidor
Express). Esta tarefa prepara o terreno para o fluxo de trabalho com IA: cria a
documentação, as skills, os agentes e o arquivo mestre que governam como a IA deve
operar no projeto.

**Objetivo final:** qualquer agente de IA, ao iniciar uma nova tarefa, encontra em
`agents.md` (raiz) e nas pastas `docs/`, `skills/`, `agents/` e `plans/` todo o
contexto e as regras necessárias para trabalhar com consistência e qualidade.

## 2. Agente responsável e skills

- **Agente principal:** `Architect` (`agents/architect-agent.md`) — orquestra a
  inicialização e define as diretrizes.
- **Skills usadas:** `react-typescript`, `backend-express`, `routing-navigation`,
  `quality-testing`, `build-deploy`, `ui-shadcn-tailwind`, `design-accessibility`.

## 3. Passo a passo

1. **Coleta de contexto** — Inspecionar o repositório real (`package.json`,
   `vite.config.ts`, `tsconfig.json`, `components.json`, `client/`, `server/`,
   `shared/`, `.prettierrc`) para documentar a stack, aliases, scripts e design system.

2. **Criar documentação (`docs/`)** — `README.md` (índice + arquitetura + padrões)
   e arquivos complementares: `architecture.md`, `coding-standards.md`,
   `frontend-guidelines.md`, `design-system.md`, `backend-guidelines.md`,
   `quality-and-testing.md`, `common-pitfalls.md`.

3. **Criar skills (`skills/`)** — `README.md` (índice) e 8 skills mapeando as
   habilidades técnicas necessárias (React/TS, UI/Tailwind, formulários, rotas,
   estado, backend, QA, design/a11y, build/deploy).

4. **Criar agentes (`agents/`)** — `README.md` (índice + quando acionar) e agentes
   especializados: Architect, Frontend, Backend, Designer, QA — cada um com suas
   skills atribuídas.

5. **Criar planejamento (`plans/`)** — Este arquivo (`plan-001-inicializar-estrutura-ia.md`).

6. **Criar arquivo mestre (`agents.md`)** — Na raiz: contexto, mapa da estrutura e
   regras rígidas de funcionamento (a IA sempre consulta este arquivo primeiro).

## 4. Validação

- [ ] Estrutura de pastas `docs/`, `skills/`, `agents/`, `plans/` criada com `README.md` em cada.
- [ ] `agents.md` presente na raiz com contexto, mapa e regras rígidas.
- [ ] Documentação fiel à stack real (sem tecnologias inexistentes no `package.json`).
- [ ] Cada agente referencia as skills corretas (consistência com `skills/README.md`).
- [ ] Conteúdo em pt-BR; convenções (aliases, scripts, design system) corretas.
- [ ] Nenhum arquivo de código-fonte alterado indevidamente (somente Markdown criado).

## 5. Critérios de entrega

- [ ] `docs/README.md`, `skills/README.md`, `agents/README.md` e `agents.md` (raiz) coerentes entre si.
- [ ] `plans/plan-001-inicializar-estrutura-ia.md` completo (este documento).
- [ ] Resumo final listando todos os arquivos criados e o que cada um contém.

## 6. Observações

- Esta tarefa **não altera código de aplicação**; apenas cria a estrutura de
  governança em Markdown.
- Próximas tarefas devem seguir o workflow: `agents.md` → `docs/` → `skills/` →
  escolher agente → criar `plans/plan-00N-*.md` → executar → validar (QA).
