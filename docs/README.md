# Documentação do Projeto — Espaço Therapy

Índice principal da documentação técnica. Este documento orienta qualquer pessoa
(ou agente de IA) a entender a arquitetura e os padrões do projeto antes de tocar
no código.

---

## 1. Visão geral

- **Projeto:** Espaço Therapy — Estética & Terapias
- **Tipo:** WEB (SPA) com servidor Node/Express
- **Objetivo:** Site institucional responsivo com identidade visual sofisticada,
  apresentando serviços, galeria, FAQ e canais de contato (WhatsApp/Instagram/mapa).

## 2. Stack

| Camada      | Tecnologia                      | Versão       |
| ----------- | ------------------------------- | ------------ |
| UI          | React                           | 19.2         |
| Linguagem   | TypeScript                      | 5.6 (strict) |
| Build       | Vite                            | 7            |
| Estilo      | Tailwind CSS                    | 4.1          |
| Componentes | shadcn/ui (new-york) + Radix UI | —            |
| Roteamento  | wouter                          | 3.3 (patch)  |
| Servidor    | Express                         | 4.21         |
| Formulários | react-hook-form + zod           | 7.64 / 4.1   |
| Testes      | vitest                          | 2.1          |
| Gerenciador | pnpm                            | 10           |

## 3. Índice de documentos

| Documento                                            | Conteúdo                                                                      |
| ---------------------------------------------------- | ----------------------------------------------------------------------------- |
| [`architecture.md`](./architecture.md)               | Estrutura de pastas, camadas, fluxo de dados, build/deploy                    |
| [`coding-standards.md`](./coding-standards.md)       | Convenções de código, formatação, aliases, nomenclatura                       |
| [`frontend-guidelines.md`](./frontend-guidelines.md) | Boas práticas de UI, componentes, hooks, estado                               |
| [`design-system.md`](./design-system.md)             | Tokens de design, paleta, tipografia, classes utilitárias                     |
| [`backend-guidelines.md`](./backend-guidelines.md)   | Diretrizes do servidor Express e APIs                                         |
| [`quality-and-testing.md`](./quality-and-testing.md) | QA, testes automatizados, critérios de aceite                                 |
| [`seo-and-assets.md`](./seo-and-assets.md)           | SEO técnico, imagens (`/manus-storage`), `SITE_URL` e checklist de publicação |
| [`common-pitfalls.md`](./common-pitfalls.md)         | Armadilhas comuns e como evitá-las                                            |

## 4. Comandos principais

```bash
pnpm install        # instala dependências (usa pnpm@10)
pnpm dev            # servidor de desenvolvimento (Vite, porta 3000)
pnpm build          # build do frontend + bundle do servidor (esbuild)
pnpm start          # roda o servidor de produção (node dist/index.js)
pnpm preview        # preview do build (Vite)
pnpm check          # checagem de tipos (tsc --noEmit)
pnpm format         # formatação (prettier --write .)
```

## 5. Regras de ouro

1. Leia `../agents.md` (raiz) antes de qualquer tarefa.
2. Use somente dependências já presentes no `package.json`.
3. Respeite os aliases `@/` (client/src), `@shared/` (shared), `@assets/` (attached_assets).
4. Siga as convenções do Prettier configurado (semicolons, aspas duplas, largura 80).
5. Valide sempre com `pnpm check` e, quando possível, `pnpm build`.

## 6. SEO & UX

As diretrizes de SEO (técnico/on-page/local), dados estruturados, AI SEO,
performance (Core Web Vitals) e UX/acessibilidade estão definidas como **skills** em
[`../skills/`](../skills/) — ver `skills/README.md`. Elas são atribuídas aos agentes
(ver `agents/README.md`); aplicá-las ao site é tarefa dos agentes especializados.

A **operação** já implementada (imagens, metadados gerados no build, JSON-LD,
`robots.txt`/`sitemap.xml` e env `SITE_URL`) está em
[`seo-and-assets.md`](./seo-and-assets.md).
