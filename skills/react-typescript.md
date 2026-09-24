# Skill: React + TypeScript

## Objetivo

Dominar o desenvolvimento de componentes React com TypeScript no padrão do projeto.

## Conhecimentos necessários

- React 19: componentes funcionais, `useState`, `useEffect`, Context API.
- TypeScript `strict`: tipagem de props, `interface`/`type`, evitar `any`.
- JSX com `jsx: preserve` e `moduleResolution: bundler`.

## Padrões do projeto

- Componentes de domínio em `client/src/components/`, UI em `client/src/components/ui/`.
- Páginas em `client/src/pages/`, hooks em `client/src/hooks/`, contextos em `client/src/contexts/`.
- Composição raiz em `App.tsx` (`ErrorBoundary` → `ThemeProvider` → `TooltipProvider` → `Toaster` → `Router`).

## Exemplo

```tsx
interface SectionIntroProps {
  eyebrow: string;
  title: string;
  text?: string;
  light?: boolean;
}

function SectionIntro({
  eyebrow,
  title,
  text,
  light = false,
}: SectionIntroProps) {
  return (
    <div className={`section-intro ${light ? "section-intro-light" : ""}`}>
      <p className="eyebrow">
        <span />
        {eyebrow}
      </p>
      <h2>{title}</h2>
      {text && <p className="intro-copy">{text}</p>}
    </div>
  );
}
```

## Regras

1. Tipar todas as props e retornos.
2. Não usar `any`; use tipos corretos ou genéricos.
3. Seguir convenções de nomenclatura (`PascalCase` componentes, `use` prefixo hooks).
4. Usar `key` estáveis em listas renderizadas com `.map`.
