# Skill: Qualidade & Testes

## Objetivo

Garantir qualidade via checagem de tipos, formatação, testes e checklist de aceite.

## Ferramentas e comandos

| Ferramenta | Comando           | Função                  |
| ---------- | ----------------- | ----------------------- |
| TypeScript | `pnpm check`      | `tsc --noEmit` (strict) |
| Prettier   | `pnpm format`     | formatação              |
| Vitest     | `pnpm vitest run` | testes                  |

## Regras

1. `pnpm check` deve passar sem erros antes da entrega.
2. Escreva testes para funções puras e componentes com lógica relevante.
3. Arquivos de teste seguem `*.test.ts` / `*.test.tsx` (excluídos do build).
4. Siga o checklist de aceite de `docs/quality-and-testing.md`.
5. Revise os diffs e valide visualmente (`pnpm dev`) quando possível.

## Checklist rápido

- [ ] Sem erros de tipo.
- [ ] Build OK.
- [ ] Sem dependências novas sem justificativa.
- [ ] Acessibilidade e responsividade.
- [ ] Links externos funcionais.
- [ ] Identidade visual preservada.
