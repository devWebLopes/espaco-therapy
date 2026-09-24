# Qualidade e Testes (QA)

## 1. Verificações estáticas

- **TypeScript:** `pnpm check` executa `tsc --noEmit` (modo `strict`).
  - Deve passar sem erros antes de entregar qualquer alteração.
- **Formatação:** `pnpm format` aplica Prettier (`semi`, aspas duplas, largura 80).

## 2. Testes automatizados

- Runner disponível: **vitest 2.1** (`devDependencies`).
- Padrão: arquivos `*.test.ts` / `*.test.tsx` (excluídos do `tsconfig` build:
  `**/*.test.ts`).
- Sugestão de cobertura mínima para novas features:
  - Utilitários e funções puras (ex.: `cn`, helpers de `const.ts`).
  - Componentes críticos de UI com lógica de estado.
  - (Opcional) Testes de integração de endpoints, se o servidor ganhar APIs.

Exemplo de comando (script configurado no `package.json`):

```bash
pnpm test        # vitest run
pnpm vitest run  # equivalente (cobertura de shared/ e client/src/)
```

> A configuração dos testes está em `vitest.config.ts` (o `vite.config.ts` usa
> `root: client`, por isso o runner tem um arquivo dedicado).

## 3. Critérios de aceite (checklist)

- [ ] `pnpm check` sem erros de tipo.
- [ ] `pnpm build` conclui com sucesso.
- [ ] Nenhuma dependência nova sem justificativa.
- [ ] Convenções de código/estilo respeitadas.
- [ ] Acessibilidade verificada (alt, aria, foco, contraste).
- [ ] Comportamento responsivo (mobile/desktop).
- [ ] Links externos (WhatsApp/Instagram/mapa) ainda funcionam.
- [ ] Revisão visual não quebra a identidade (paleta/tipografia).

## 4. Revisão e entrega

- Revise os diffs dos arquivos alterados/criados.
- Execute o projeto (`pnpm dev`) e valide visualmente quando possível.
- Documente o que foi feito e o que foi validado no resumo final.
