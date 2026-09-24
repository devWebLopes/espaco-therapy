# Skill: Roteamento & Navegação

## Objetivo

Gerenciar rotas e navegação no SPA usando `wouter`.

## Conhecimentos necessários

- `wouter` 3.3: `Route`, `Switch`, `Link`, `useLocation`, `useRoute`.
- Estrutura de rotas em `client/src/App.tsx`.

## Padrão atual

```tsx
import { Route, Switch } from "wouter";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} /> {/* fallback */}
    </Switch>
  );
}
```

## Regras

1. Rotas novas vão **antes** do fallback `NotFound`.
2. Para navegação interna use `Link`/`useLocation` do wouter; links externos use `<a>`.
3. O servidor Express faz SPA fallback (`index.html` para toda rota) — não colida
   com rotas de API.
4. Mantenha a rota `/` como a Home existente, salvo necessidade documentada.
