# Agents — Índice

Agentes de IA especializados no ciclo de desenvolvimento do projeto. Cada agente
possui um arquivo próprio com suas responsabilidades e as skills atribuídas.

## Tabela de agentes

| Agente | Arquivo | Papel | Quando acionar |
|---|---|---|---|
| Architect | [`architect-agent.md`](./architect-agent.md) | Orquestração, arquitetura e decisões técnicas | No início de qualquer tarefa; define plano e agentes |
| Frontend | [`frontend-agent.md`](./frontend-agent.md) | UI, páginas, componentes, estado | Alterações em `client/src` (React/Tailwind) |
| Backend | [`backend-agent.md`](./backend-agent.md) | Servidor Express, APIs, integrações | Alterações em `server/` ou novas rotas/APIs |
| Designer | [`designer-agent.md`](./designer-agent.md) | Design system, identidade visual, acessibilidade | Ajustes visuais, tokens, responsividade, a11y |
| QA | [`qa-agent.md`](./qa-agent.md) | Testes, revisão e validação | Antes de entrega; validação de qualidade |

## Mapa de skills por agente

| Agente | Skills atribuídas |
|---|---|
| Architect | react-typescript, backend-express, quality-testing, build-deploy, routing-navigation, seo-technical-onpage, web-performance |
| Frontend | react-typescript, ui-shadcn-tailwind, forms-validation, routing-navigation, state-data-fetching, seo-technical-onpage, schema-structured-data, web-performance, ux-accessibility, ai-seo |
| Backend | backend-express, state-data-fetching, quality-testing, build-deploy, seo-technical-onpage |
| Designer | ui-shadcn-tailwind, design-accessibility, react-typescript, ux-accessibility, web-performance |
| QA | quality-testing, build-deploy, forms-validation, design-accessibility, web-performance, seo-technical-onpage, schema-structured-data |

## Fluxo de acionamento

1. **Architect** analisa a tarefa, consulta `docs/` e `skills/`, define o plano
   (`plans/plan-00N-*.md`) e delega aos agentes.
2. **Frontend / Backend / Designer** executam a implementação usando suas skills.
3. **QA** valida (tipos, build, testes, checklist) e aprova a entrega.
