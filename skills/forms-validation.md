# Skill: Formulários & Validação

## Objetivo

Criar formulários robustos e validados com `react-hook-form` + `zod`.

## Conhecimentos necessários

- `react-hook-form` 7.64: `useForm`, `register`, `control`, `Controller`,
  `FormProvider`, `handleSubmit`.
- `@hookform/resolvers` + `zod` 4: `zodResolver`, schemas.
- Componente base: `client/src/components/ui/form.tsx` (`Form`, `FormField`,
  `FormItem`, `FormLabel`, `FormControl`, `FormMessage`).

## Padrão

```tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const schema = z.object({
  nome: z.string().min(2, "Informe seu nome"),
  email: z.string().email("E-mail inválido"),
});

const form = useForm({ resolver: zodResolver(schema) });
```

## Regras

1. Validação declarativa com zod (mensagens em pt-BR).
2. Use os componentes de `ui/form.tsx` para consistência.
3. Tipar os dados do formulário a partir do schema (`z.infer<typeof schema>`).
4. Trate estados de loading/erro/submissão.
