# Skill: Estado & Dados

## Objetivo

Gerenciar estado local/compartilhado e consumir dados HTTP.

## Conhecimentos necessários

- Estado local: `useState`, `useEffect`, `useCallback`, `useMemo`, `useRef`.
- Estado compartilhado: Context API (padrão em `client/src/contexts/ThemeContext.tsx`).
- Requisições HTTP: `axios`.

## Padrões

- Dados estáticos da landing page ficam em `shared/site.ts` (`SERVICES`,
  `GALLERY`, `FAQS`, `TEAM`, `OFFER`, `IMAGES`, `CONTACT`) e são importados via
  `@shared/site` — os mesmos dados alimentam o JSON-LD do `index.html`.
- Imagens: `IMAGES`/`GALLERY` guardam `src`, `alt`, `width` e `height`; o
  caminho é `/manus-storage/<arquivo>` (arquivo versionado ou proxy — ver
  `docs/seo-and-assets.md`).

## Exemplo de contexto

```tsx
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);
export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
```

## Regras

1. Prefira estado local; use Context apenas quando compartilhado entre árvores.
2. Use `usePersistFn` (já existente) para referências estáveis de callbacks.
3. Centralize constantes em `shared/` ou `client/src/const.ts`.
4. Trate loading/erro nas requisições (axios).
