# Plano 003 — Implementação Multi-Agente: Melhorar Visualização do Logo e Harmonia Visual

> **Nome curto:** `implementacao-melhorar-logo`
> **PRD de referência:** [`plan-002-melhorar-visualizacao-do-logo.md`](./plan-002-melhorar-visualizacao-do-logo.md)
> **Orquestrador:** Architect → Designer → Frontend → QA
> **Tipo:** WEB (SPA) · **Stack:** React 19 + TS 5.6 + Tailwind 4

---

## 1. Visão geral

Este plano operacionaliza o PRD `plan-002`, distribuindo os requisitos (R1–R9,
NFRs) entre os agentes especializados, com ordem de execução, dependências e
paralelização. **Ordem geral:** Architect (setup/orquestração) → Designer (assets +
tokens) → Frontend (integração) → QA (validação final).

O **Backend não participa** desta tarefa (não há mudança em `server/`). O único
reflexo em `shared/site.ts` (JSON-LD) será tratado pelo Frontend, conforme NFR4.

---

## 2. Mapeamento requisito → agente

| Req  | Descrição                                | Agente principal | Apoio     |
| ---- | ---------------------------------------- | ---------------- | --------- |
| R1   | Logo transparente (sem caixa branca)     | **Designer**     | Frontend  |
| R2   | Tipografia do nome em serif elegante     | **Designer**     | —         |
| R3   | Refinar o lótus (simétrico/proporcional) | **Designer**     | —         |
| R4   | Subsótítulo centralizado sob a marca     | **Frontend**     | Designer  |
| R5   | Padronizar fonte dos botões (sans-serif) | **Frontend**     | Designer  |
| R6   | Ampliar legibilidade do rodapé           | **Frontend**     | Designer  |
| R7   | Textura sutil no fundo escuro            | **Designer**     | Frontend  |
| R8   | WhatsApp estilizado (dourado/integrado)  | **Designer**     | Frontend  |
| R9   | Integrar selo "feito para você"          | **Designer**     | Frontend  |
| NFR1 | Acessibilidade/contraste AA              | QA (auditoria)   | Designer  |
| NFR2 | Desempenho (sem deps novas)              | QA               | Architect |
| NFR4 | JSON-LD do logo (se nome mudar)          | **Frontend**     | —         |

---

## 3. Fases e tarefas

### Fase 0 — Architect (orquestração)

| ID  | Tarefa                            | Detalhe                                                                                        |
| --- | --------------------------------- | ---------------------------------------------------------------------------------------------- |
| A0  | Confirmar escopo e dependências   | Ler `plan-002`, `docs/design-system.md`, `design-accessibility`, `web-performance`             |
| A1  | Mapear pontos de toque do logo    | `Home.tsx:62` (Logo), `index.css:137/292` (`.logo-img`), `shared/site.ts:442` (JSON-LD `logo`) |
| A2  | Definir contrato do asset de logo | Formato (SVG/PNG transparente), variante clara vs. escura, dimensões (width/height)            |
| A3  | Garantir "sem dependências novas" | Revisar `package.json` — nenhuma lib adicional será necessária                                 |

**Saída:** checklist de decisões de design para o Designer (valores de gradiente,
cor final do WhatsApp, formato do asset).

---

### Fase 1 — Designer (assets + tokens de design) — _pode iniciar em paralelo ao A2_

| ID  | Tarefa                                | Req    | Detalhe                                                                                                                                                                         |
| --- | ------------------------------------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| D1  | Produzir/substituir logo transparente | R1–R3  | Gerar `client/public/logo.svg` (ou PNG transparente), remover caixa branca, simetrizar lótus, reescrever "ESPAÇO THERAPY" em Cormorant Garamond; definir variantes clara/escura |
| D2  | Definir tokens/valores de superfície  | R7, R8 | Escolher gradiente/textura das superfícies escuras (`.hero`, `.offer`) e novo valor do WhatsApp (dourado `#b58a48` vs. monocromático) — registrar no plano antes de aplicar     |
| D3  | Refinar componentes visuais           | R8, R9 | Propor acabamento "metal escovado" para `.button-dark` e "medalha gravada" para `.hero-stamp`; documentar cores/bordas                                                          |
| D4  | Documentar decisões                   | —      | Atualizar `docs/design-system.md` com novos tokens/valores, se necessário                                                                                                       |

**Saída:** asset de logo pronto + especificações de estilo aplicáveis pelo Frontend.

---

### Fase 2 — Frontend (integração) — _depende de D1/D2_

| ID  | Tarefa                          | Req    | Detalhe                                                                                                                                   |
| --- | ------------------------------- | ------ | ----------------------------------------------------------------------------------------------------------------------------------------- |
| F1  | Integrar novo logo ao `Logo`    | R1     | Substituir `src="/logo.jpg"` pelo novo asset; ajustar `alt`/`aria-label`; dimensões                                                       |
| F2  | Ajustar CSS do logo             | R1     | Remover/ajustar `mix-blend-mode` + `filter` em `.logo-img` (`.footer-inner .logo-img`), usando variantes por superfície em vez de filtros |
| F3  | Centralizar subtítulo           | R4     | Alinhar "ESTÉTICA & TERAPIAS · SÃO LEOPOLDO" sob a marca, em `--font-sans`; reconciliar com o `hero-eyebrow` (`Home.tsx:192`)             |
| F4  | Unificar fonte dos botões       | R5     | Garantir `--font-sans` em `.button`/`.button-dark`/`.button-cream`/`.nav-cta`; corrigir qualquer serif                                    |
| F5  | Ampliar rodapé                  | R6     | Elevar fonte de `.footer-copy`/endereço (~0.72–0.78rem)                                                                                   |
| F6  | Aplicar textura/gradiente       | R7     | Aplicar especificações D2 em `.hero`/`.offer` (via `::before`/`::after`)                                                                  |
| F7  | Aplicar WhatsApp + selo         | R8, R9 | Cor do `.floating-whatsapp` (e `::before`/`::after`, removendo `#25d366`); posicionar/estilizar `.hero-stamp` conforme D3                 |
| F8  | Atualizar JSON-LD (condicional) | NFR4   | Se o logo mudar de nome/formato, atualizar `logo` em `shared/site.ts:442`                                                                 |

**Saída:** código integrado e coeso, pronto para validação.

---

### Fase 3 — QA (validação)

| ID  | Tarefa                      | Detalhe                                                     |
| --- | --------------------------- | ----------------------------------------------------------- |
| Q1  | Checagem de tipos           | `pnpm check` (sem erros)                                    |
| Q2  | Build                       | `pnpm build` conclui com sucesso                            |
| Q3  | Formatação                  | `pnpm format` (Prettier)                                    |
| Q4  | Revisão visual              | `pnpm dev` — header, hero, footer em mobile e desktop       |
| Q5  | Auditoria de acessibilidade | Contraste AA, `alt`/`aria`, foco visível (NFR1)             |
| Q6  | Desempenho                  | Sem deps novas; logo leve (sem regressão de LCP/CLS) (NFR2) |
| Q7  | Links externos              | WhatsApp/Instagram/mapa funcionais                          |

**Saída:** checklist de aceite preenchido (ver `agents/qa-agent.md`).

---

## 4. Grafo de dependências

```text
Architect (A0–A3)
   │
   ├──▶ Designer (D1–D4) ──┐
   │                        │
   Backend (não participa)  ├──▶ Frontend (F1–F8) ──▶ QA (Q1–Q7) ──▶ Entrega
   │                        │
   └──▶ (D1/D2 podem iniciar em paralelo confirmado o escopo)
```

- **Paralelizáveis:** D1–D4 rodam em paralelo às definições do Architect; dentro
  do Designer, D1/D2 podem ser simultâneos.
- **Bloqueios:** F1–F7 dependem de D1/D2 (asset + especificações); QA depende do
  fechamento do Frontend.

---

## 5. Critérios de entrega

Mesmos do PRD (seção 8), consolidados:

- [ ] Logo sem caixa branca, transparente sobre fundo escuro (header e footer).
- [ ] Nome em serif elegante; lótus simétrico; subtítulo centralizado em DM Sans.
- [ ] Todos os botões com a mesma fonte sans-serif.
- [ ] Rodapé legível; fundo escuro com textura sutil; WhatsApp sem verde genérico.
- [ ] Selo "feito para você" integrado como medalha.
- [ ] `pnpm check` e `pnpm build` sem erros; sem dependências novas.
- [ ] `docs/design-system.md` e `shared/site.ts` (JSON-LD) atualizados quando aplicável.

---

## 6. Observações

- A subdivisão entre Designer (especificação/asset) e Frontend (integração em
  `Home.tsx`/`index.css`) respeita as regras de cada agente em `agents/README.md`:
  Designer não implementa JSX, Frontend não redefine tokens.
- Se o asset de logo não existir no início, Designer gera versão vetorial
  intermediária (R3) para destravar o Frontend; substituição final posterior.
