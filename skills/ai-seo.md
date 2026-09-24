# Skill: AI SEO (AEO / GEO / LLMO)

## Objetivo

Tornar o conteúdo **citável e extraível** por mecanismos de IA (Google AI Overviews,
ChatGPT, Perplexity, Gemini, Copilot, Claude).

## Contexto

- SEO tradicional é a **base**; AI SEO adiciona estrutura, autoridade e extraibilidade.
- **Schema markup** ajuda a IA a entender o conteúdo (ver `schema-structured-data.md`).

## Práticas recomendadas

1. **Conteúdo bem estruturado:** headings, listas e Q&A que respondam perguntas
   diretamente (o formato FAQ existente é ótimo para isso).
2. **Respostas factuais e específicas** — citações/dados aumentam a chance de ser
   citado; evite "somos os melhores".
3. **Frescor:** mostre data de atualização do conteúdo.
4. **Não bloquear crawlers de IA** (GPTBot, PerplexityBot, ClaudeBot, Google-Extended)
   em `robots.txt` se o objetivo é ser citado.
5. **Não esconder conteúdo atrás de JS que não renderiza** — o conteúdo principal
   precisa ser visível para buscadores e agentes.

## Agentes-readiness (opcional)

- `llms.txt` / `llms-full.txt` são **experimentais** e não são fator de ranking.
  Adicione apenas se houver um consumidor documentado; não duplique o sitemap nem
  reorganize o conteúdo só por isso.

## Para negócio local

- O Google prioriza **Business Profile** (e Merchant Center, se aplicável) para
  features de IA locais — mantenha o perfil completo e consistente.

## Erros comuns a evitar

- Ignorar AI search (~45% das buscas Google mostram AI Overviews).
- Escrever para o algoritmo e não para humanos.
- Keyword stuffing (reduz a visibilidade por IA em ~10%).
- Esconder preços/condições atrás de JS.
- Bloquear bots de IA quando o objetivo é ser citado.
- Conteúdo genérico sem dados/evidências.
