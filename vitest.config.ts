import { defineConfig } from "vitest/config";

/**
 * Configuração dedicada dos testes.
 *
 * Necessária porque o `vite.config.ts` define `root: client` (para o build do
 * frontend), o que faria o Vitest procurar testes apenas dentro de `client/`.
 * Aqui o root volta a ser a raiz do projeto, cobrindo `shared/` e `client/src/`.
 */
export default defineConfig({
  test: {
    root: import.meta.dirname,
    include: ["shared/**/*.test.ts", "client/src/**/*.test.{ts,tsx}"],
    environment: "node",
  },
});
