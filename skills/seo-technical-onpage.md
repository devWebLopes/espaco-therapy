# Skill: SEO Técnico & On-page

## Objetivo
Garantir que o site seja rastreável, indexável e bem posicionado, com foco em um
**negócio local** (Espaço Therapy — São Leopoldo/RS) construído como **React SPA**
(client-side rendering).

## Contexto do projeto

- **Negócio local:** estética & terapias — Rua Pedro Peres, 401, Bairro Rio Branco,
  São Leopoldo · RS.
- **Arquitetura:** SPA React (Vite) + Express com fallback SPA (`app.get("*")`).
- ⚠️ **Risco de indexação:** conteúdo renderizado apenas por JS pode não ser
  totalmente lido pelo Google. Priorize metadata **estática** em `client/index.html`
  e, para o conteúdo-chave, considere pré-renderização (SSG/SSR).

## Técnico (crawl & index)

### robots.txt
```text
User-agent: *
Allow: /

Sitemap: https://SEU-DOMINIO.com.br/sitemap.xml
```

### Sitemap XML
- Listar apenas URLs canônicas e indexáveis.
- Atualizar `lastmod` quando o conteúdo mudar.
- Enviar no Google Search Console.

### Canonical
```html
<link rel="canonical" href="https://SEU-DOMINIO.com.br/" />
```

### Meta robots / viewport
```html
<meta name="robots" content="index, follow" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
```

## On-page

- **Title** único e descritivo por página (≤ ~60 chars).
- **Meta description** (150–160 chars) com CTA.
- **Hierarquia de headings** lógica: um único `h1`, depois `h2`/`h3`.
- **Alt text** descritivo em todas as imagens.
- **Idioma:** `<html lang="pt-BR">`.

## Open Graph / redes sociais
```html
<meta property="og:type" content="website" />
<meta property="og:title" content="Espaço Therapy — Estética & Terapias" />
<meta property="og:description" content="..." />
<meta property="og:url" content="https://SEU-DOMINIO.com.br/" />
<meta property="og:image" content="https://SEU-DOMINIO.com.br/og-image.jpg" />
<meta name="twitter:card" content="summary_large_image" />
```

## SEO Local (prioridade máxima)

1. **NAP consistente** (Nome, Endereço, Telefone) em todo o site e na web.
2. **Google Business Profile** otimizado (categoria, fotos, horários, serviços).
3. **Schema LocalBusiness** (ver `schema-structured-data.md`).
4. **Sinais locais:** endereço no rodapé, link para o Google Maps, citação da
   região (São Leopoldo · RS) no conteúdo.

## Checklist de auditoria

- **Crítico:** HTTPS · robots.txt permite crawl · sem `noindex` indevido · title
  único · heading hierárquico.
- **Alta prioridade:** meta descriptions · sitemap enviado · canonicals · mobile ·
  Core Web Vitals (ver `web-performance.md`).
- **Média:** dados estruturados · links internos · alt text · URLs descritivas.
- **Contínuo:** corrigir erros no Search Console · atualizar sitemap · monitorar
  links quebrados.

## Ferramentas
Google Search Console · PageSpeed Insights · Rich Results Test · Lighthouse.
