# Skill: Dados Estruturados (Schema.org / JSON-LD)

## Objetivo

Implementar e validar markup **JSON-LD** para habilitar rich results e ajudar
buscadores e agentes de IA a entender o conteúdo.

## Princípios

1. Use **JSON-LD** (formato recomendado pelo Google).
2. **Precisão:** marque apenas o que existe de fato no conteúdo visível.
3. **Valide sempre** antes de publicar.

## Tipos recomendados para o Espaço Therapy

| Tipo                                      | Página                          | Rich result potencial   |
| ----------------------------------------- | ------------------------------- | ----------------------- |
| `HealthAndBeautyBusiness` / `BeautySalon` | Home                            | Painel de negócio local |
| `Organization`                            | Home                            | Identidade da marca     |
| `WebSite`                                 | Home                            | Search box              |
| `FAQPage`                                 | Home (a seção de FAQ já existe) | FAQ em rich results     |

## Exemplo adaptado ao projeto (substitua o domínio real)

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "HealthAndBeautyBusiness",
      "@id": "https://SEU-DOMINIO.com.br/#business",
      "name": "Espaço Therapy — Estética & Terapias",
      "description": "Espaço de estética e terapias em São Leopoldo/RS: massagens, pedras quentes, Reiki, Pilates, alongamento, mechas, cílios e mãos & pés.",
      "url": "https://SEU-DOMINIO.com.br/",
      "telephone": "+55 51 9198-7703",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Rua Pedro Peres, 401",
        "addressLocality": "São Leopoldo",
        "addressRegion": "RS",
        "addressCountry": "BR"
      },
      "sameAs": ["https://www.instagram.com/espacotherapy_/"],
      "contactPoint": {
        "@type": "ContactPoint",
        "contactType": "reservations",
        "telephone": "+55 51 9198-7703",
        "availableLanguage": "pt-BR"
      }
    },
    {
      "@type": "WebSite",
      "@id": "https://SEU-DOMINIO.com.br/#website",
      "name": "Espaço Therapy",
      "url": "https://SEU-DOMINIO.com.br/"
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "Como faço para agendar?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Escreva pelo WhatsApp. A equipe confirma a disponibilidade, o serviço ideal e os detalhes do atendimento."
          }
        },
        {
          "@type": "Question",
          "name": "Quais serviços estão disponíveis?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Terapias e relaxamento, Pilates e cuidado corporal, além de beleza capilar, cílios e mãos & pés."
          }
        }
      ]
    }
  ]
}
```

> ⚠️ Confirme telefone/horários com o cliente. "Atendimentos com hora marcada" →
> se não há horário fixo, **não** preencha `openingHours`.

## Onde colocar no projeto

- **Implementado:** o JSON-LD é gerado por `buildSiteJsonLd()` (`shared/site.ts`)
  e injetado estaticamente no `<head>` pelo plugin `vitePluginSiteSeo`
  (`vite.config.ts`) — logo, é idêntico ao conteúdo visível (FAQ, serviços,
  equipe, NAP) e não precisa ser mantido à mão.
- O telefone canônico é `CONTACT.telephone` (`shared/site.ts`); não replique o
  número em outros arquivos.

## Validação

- [ ] Google **Rich Results Test** (renderiza JS).
- [ ] **validator.schema.org**.
- [ ] Search Console → relatórios de "Aprimoramentos".
- [ ] Sem erros/avisos; conteúdo bate com a página.

> **Nota:** `web_fetch`/`curl` não detectam JSON-LD injetado por JS de forma
> confiável — use o Rich Results Test ou o navegador para validar.
