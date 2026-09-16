/**
 * Configuração central do site Espaço Therapy — Estética & Terapias.
 *
 * Este módulo é a **fonte única de verdade** para contato, endereço, conteúdo da
 * home e SEO. É consumido por:
 * - `client/src/pages/Home.tsx` (conteúdo + links de contato);
 * - `vite.config.ts` (metadados e JSON-LD injetados no `index.html`);
 * - `server/index.ts` (robots.txt, sitemap.xml e entrega das imagens).
 *
 * Operação e checklist de publicação: `docs/seo-and-assets.md`.
 */

/** Domínio canônico padrão. Sobrescrevável por `SITE_URL`/`VITE_SITE_URL`. */
export const DEFAULT_SITE_URL = "https://espacotherapy.com.br";

/**
 * Caminho base das imagens (servidas localmente ou via proxy `/manus-storage`).
 *
 * Convenção de nomenclatura dos arquivos:
 *   `[seção]--[descrição]--[hash-8].[ext]`
 *
 * Seções válidas:
 *   - `hero`     → imagem principal acima da dobra
 *   - `servicos` → cards de cada eixo de serviço
 *   - `oferta`   → bloco de promoção/campanha
 *   - `galeria`  → grade de fotos do Instagram
 *   - `og`       → banner social (Open Graph / Twitter Card)
 *
 * Arquivos arquivados (não exibidos no site) ficam em
 * `client/public/manus-storage/instagram-archive/`.
 */
export const STORAGE_PATH = "/manus-storage/";

/**
 * Imagem social (Open Graph / Twitter Card).
 *
 * Seção: `og`
 * Pendente: gerar um banner dedicado 1200×630 com identidade visual própria.
 */
export const OG_IMAGE_PATH = `${STORAGE_PATH}og--banner--9d0dabd5.jpg`;

/** Data da última revisão de conteúdo (usada no `lastmod` do sitemap). */
export const CONTENT_LAST_MODIFIED = "2026-09-14";

/** Nome curto (logo, assinaturas) e nome público completo. */
export const SITE_NAME = "Espaço Therapy";
export const SITE_LEGAL_NAME = "Espaço Therapy — Estética & Terapias";

/** Título (≤ 60 caracteres) usado em `<title>`, OG e schema. */
export const SITE_TITLE =
  "Espaço Therapy — Estética & Terapias em São Leopoldo";

/** Descrição com CTA (150–160 caracteres) para meta description/OG. */
export const SITE_DESCRIPTION =
  "Estética e terapias em São Leopoldo: massagens, pedras quentes, Reiki, Pilates, mechas, cílios e mãos & pés. Agende seu momento pelo WhatsApp.";

/** Descrição factual do negócio (usada no JSON-LD, sem CTA). */
export const BUSINESS_DESCRIPTION =
  "Espaço de estética e terapias em São Leopoldo/RS: massagens, pedras quentes, Reiki, cone chinês, ventosaterapia, Pilates, alongamento, mechas, alinhamento de fios, cílios e mãos & pés.";

/** Endereço (NAP — Name, Address, Phone). */
export interface SiteAddress {
  street: string;
  district: string;
  city: string;
  region: string;
  country: string;
}

export const ADDRESS: SiteAddress = {
  street: "Rua Pedro Peres, 401",
  district: "Rio Branco",
  city: "São Leopoldo",
  region: "RS",
  country: "BR",
};

/** Etiqueta curta do endereço para uso na interface. */
export const ADDRESS_LABEL = `${ADDRESS.street} · ${ADDRESS.district}`;
export const CITY_LABEL = `${ADDRESS.city} · ${ADDRESS.region}`;

/**
 * Contato oficial — **ponto único de atualização** do funil de conversão.
 *
 * `whatsappDigits` é o número confirmado no dossiê de presença pública
 * (10/09/2026) e no site atual (`+55 51 9198-7703`). A confirmação final com a
 * cliente está registrada em `plans/plan-002-melhorias-ux-seo-imagens.md` (R2).
 */
export const CONTACT = {
  whatsappDigits: "555191987703",
  phoneDisplay: "+55 51 9198-7703",
  /** Formato E.164 aceito pelo schema.org. */
  telephone: "+555191987703",
  whatsappMessage: "Olá, quero agendar um momento no Espaço Therapy.",
  instagramHandle: "@espacotherapy_",
  instagramUrl: "https://www.instagram.com/espacotherapy_/",
  mapsUrl:
    "https://www.google.com/maps/search/?api=1&query=Rua+Pedro+Peres+401+Rio+Branco+S%C3%A3o+Leopoldo",
  /** Idioma do atendimento (schema.org `availableLanguage`). */
  availableLanguage: "pt-BR",
} as const;

/** Imagem com metadados de layout (evitam CLS) e acessibilidade. */
export interface SiteImage {
  /** Caminho público da imagem. */
  src: string;
  /** Texto alternativo descritivo (obrigatório). */
  alt: string;
  /** Largura de layout (atualizar com a dimensão real ao versionar o arquivo). */
  width: number;
  /** Altura de layout (atualizar com a dimensão real ao versionar o arquivo). */
  height: number;
}
/**
 * Imagens usadas na home, organizadas por seção.
 *
 * Convenção de arquivo: `[seção]--[descrição]--[hash-8].[ext]`
 * Referência completa: `docs/seo-and-assets.md`
 *
 * ⚠️ As dimensões declaradas refletem a proporção de layout (não os pixels
 * originais) — atualize com as medidas reais ao versionar os arquivos em
 * `client/public/manus-storage/`.
 */
export const IMAGES = {
  /**
   * Seção: `hero`
   * Interior do espaço — foto principal acima da dobra.
   * Também reutilizada na galeria como "O espaço" (ver GALLERY abaixo).
   */
  interior: {
    src: `${STORAGE_PATH}hero--interior--9d0dabd5.jpg`,
    alt: "Interior do Espaço Therapy, em São Leopoldo",
    width: 720,
    height: 1000,
  } satisfies SiteImage,

  /**
   * Seção: `servicos`
   * Card "Terapias & relaxamento" — massagens, pedras quentes, Reiki.
   */
  therapies: {
    src: `${STORAGE_PATH}servicos--terapias--ff6a12d1.jpg`,
    alt: "Terapias e relaxamento no Espaço Therapy",
    width: 600,
    height: 600,
  } satisfies SiteImage,

  /**
   * Seção: `servicos`
   * Card "Movimento & equilíbrio" — Pilates, alongamento, ventosaterapia.
   */
  movement: {
    src: `${STORAGE_PATH}servicos--movimento--56672306.jpg`,
    alt: "Movimento e equilíbrio no Espaço Therapy",
    width: 600,
    height: 600,
  } satisfies SiteImage,

  /**
   * Seção: `servicos`
   * Card "Beleza & expressão" — mechas, cílios, mãos & pés.
   */
  beauty: {
    src: `${STORAGE_PATH}servicos--beleza--ee62de48.jpg`,
    alt: "Resultado de transformação capilar no Espaço Therapy",
    width: 600,
    height: 600,
  } satisfies SiteImage,

  /**
   * Seção: `oferta`
   * Bloco de campanha/promoção — massagem terapêutica em destaque.
   */
  offer: {
    src: `${STORAGE_PATH}oferta--massagem--1086f446.jpg`,
    alt: "Massagem terapêutica no Espaço Therapy",
    width: 920,
    height: 1000,
  } satisfies SiteImage,

  /**
   * Seção: `manifesto`
   * Retrato da profissional — foto original do Instagram com textos removidos.
   * Arquivo original arquivado em: instagram-archive/006_a04829f211.jpg
   */
  manifesto: {
    src: `${STORAGE_PATH}manifesto--erika--a04829f2.jpg`,
    alt: "Profissional do Espaço Therapy em São Leopoldo",
    width: 800,
    height: 1200,
  } satisfies SiteImage,
} as const;

/** Publicações do Instagram referenciadas na galeria. */
export const POST_LINKS = {
  espaco: "https://www.instagram.com/reel/C-DhaHEgPVV/",
  mechas: "https://www.instagram.com/reel/DccNGP0xXsJ/",
  massagem: "https://www.instagram.com/reel/DZNnDfotuwf/",
  pilates: "https://www.instagram.com/p/DaoMXMHxTlx/",
  servicos: "https://www.instagram.com/p/DcrdJ4MBHFR/",
} as const;

/** Eixos de cuidado (também alimentam o `hasOfferCatalog` do JSON-LD). */
export interface Service {
  number: string;
  title: string;
  text: string;
  items: string[];
  tone: "sand" | "moss" | "ink";
  image: SiteImage;
}

export const SERVICES: readonly Service[] = [
  {
    number: "01",
    title: "Terapias & relaxamento",
    text: "Um intervalo para desacelerar, liberar tensões e voltar para si.",
    items: ["Massagem terapêutica", "Pedras quentes", "Reiki", "Cone chinês"],
    tone: "sand",
    image: IMAGES.therapies,
  },
  {
    number: "02",
    title: "Movimento & equilíbrio",
    text: "Práticas que cuidam do corpo com presença, respiração e constância.",
    items: ["Pilates", "Alongamento", "Ventosaterapia", "Postura"],
    tone: "moss",
    image: IMAGES.movement,
  },
  {
    number: "03",
    title: "Beleza & expressão",
    text: "Detalhes que iluminam sua presença e traduzem a sua melhor versão.",
    items: [
      "Mechas & loiro",
      "Alinhamento de fios",
      "Cílios",
      "Mãos & pés (simples ou combinados)",
    ],
    tone: "ink",
    image: IMAGES.beauty,
  },
];

/** Galeria (recortes do perfil @espacotherapy_). */
export interface GalleryItem {
  label: string;
  href: string;
  image: SiteImage;
}

export const GALLERY: readonly GalleryItem[] = [
  {
    // Seção: galeria — reutiliza a foto do hero enquanto não há imagem exclusiva
    // (curadoria pendente, ver plano 002 §6).
    label: "O espaço",
    href: POST_LINKS.espaco,
    image: IMAGES.interior,
  },
  {
    // Seção: galeria — mechas e serviços capilares
    label: "Mechas",
    href: POST_LINKS.mechas,
    image: {
      src: `${STORAGE_PATH}galeria--mechas--fa72dfb6.jpg`,
      alt: "Mechas iluminadas no Espaço Therapy",
      width: 800,
      height: 1200,
    } satisfies SiteImage,
  },
  {
    // Seção: galeria — terapias e relaxamento (reutiliza arquivo da oferta)
    label: "Terapias",
    href: POST_LINKS.massagem,
    image: {
      src: `${STORAGE_PATH}oferta--massagem--1086f446.jpg`,
      alt: "Detalhe floral de uma parceria de terapias",
      width: 800,
      height: 800,
    } satisfies SiteImage,
  },
  {
    // Seção: galeria — visão geral dos serviços do espaço
    label: "Serviços",
    href: POST_LINKS.servicos,
    image: {
      src: `${STORAGE_PATH}galeria--servicos--a483c6a1.jpg`,
      alt: "Cuidados e serviços do Espaço Therapy",
      width: 1600,
      height: 800,
    } satisfies SiteImage,
  },
];

/** Perguntas frequentes (também publicadas como `FAQPage` no JSON-LD). */
export interface Faq {
  question: string;
  answer: string;
}

export const FAQS: readonly Faq[] = [
  {
    question: "Como faço para agendar?",
    answer:
      "Escreva pelo WhatsApp. A equipe confirma a disponibilidade, o serviço ideal e os detalhes do atendimento.",
  },
  {
    question: "Quais serviços estão disponíveis?",
    answer:
      "O espaço reúne terapias e relaxamento, Pilates e cuidado corporal, além de beleza capilar, cílios e mãos & pés.",
  },
  {
    question: "Quem vai me atender?",
    answer:
      "Nosso atendimento é feito pela equipe Erika, Janaína e Roberta. Pelo WhatsApp confirmamos qual profissional está disponível no horário que você procura.",
  },
  {
    question: "Vocês têm horários fixos?",
    answer:
      "A agenda funciona com hora marcada. Consulte os horários e profissionais disponíveis diretamente pelo WhatsApp, pois podem mudar.",
  },
  {
    question: "O valor de R$ 85 ainda está vigente?",
    answer:
      "Esse valor foi identificado em uma campanha pública anterior. Confirme a promoção e as condições atuais antes de agendar.",
  },
];
/**
 * Equipe (prova social) — nomes citados no dossiê de presença pública
 * (10/09/2026). A atribuição de especialidades por profissional depende de
 * confirmação da cliente (ver plano 002, R9/R10).
 */
export const TEAM: readonly string[] = ["Erika", "Janaína", "Roberta"];

export const TEAM_DESCRIPTION =
  "Quem recebe você no Espaço Therapy é uma equipe que acompanha cada etapa do atendimento — da chegada ao ritual escolhido.";

/**
 * Oferta/campanha exibida na home.
 *
 * `showPrice` funciona como interruptor: ao finalizar a promoção, basta mudar
 * para `false` que o bloco de preço desaparece sem remover a seção.
 */
export const OFFER = {
  showPrice: true,
  priceLabel: "experiência especial",
  price: "R$ 85",
  text: "Massagem terapêutica para aliviar o peso do dia e abrir espaço para uma sensação mais leve.",
  validityNote:
    "Valor de campanha divulgada anteriormente. Confirme a validade e as condições atuais antes de agendar.",
} as const;

/** Normaliza a URL canônica (sem barra final) a partir de uma env opcional. */
export function resolveSiteUrl(value?: string | null): string {
  const base = (value ?? "").trim();
  if (!base) {
    return DEFAULT_SITE_URL;
  }
  return base.replace(/\/+$/, "");
}

/** Monta o link de agendamento no WhatsApp com mensagem pré-preenchida. */
export function buildWhatsAppUrl(
  message: string = CONTACT.whatsappMessage
): string {
  return `https://wa.me/${CONTACT.whatsappDigits}?text=${encodeURIComponent(message)}`;
}

/** Substitui os tokens `%SITE_*%` do `index.html` por valores resolvidos. */
export function applySiteTokens(html: string, siteUrl: string): string {
  const url = resolveSiteUrl(siteUrl);
  const tokens: Record<string, string> = {
    "%SITE_URL%": url,
    "%SITE_NAME%": SITE_NAME,
    "%SITE_LEGAL_NAME%": SITE_LEGAL_NAME,
    "%SITE_TITLE%": SITE_TITLE,
    "%SITE_DESCRIPTION%": SITE_DESCRIPTION,
    "%SITE_PHONE_DISPLAY%": CONTACT.phoneDisplay,
    "%SITE_INSTAGRAM%": CONTACT.instagramUrl,
    "%SITE_OG_IMAGE%": `${url}${OG_IMAGE_PATH}`,
  };

  return Object.entries(tokens).reduce(
    (acc, [token, value]) => acc.split(token).join(value),
    html
  );
}

/** Conteúdo do `robots.txt` (crawl liberado, inclusive para crawlers de IA). */
export function buildRobotsTxt(siteUrl: string): string {
  const url = resolveSiteUrl(siteUrl);
  return [
    "# robots.txt — Espaço Therapy | Estética & Terapias",
    "# Crawl liberado para todos os robôs, inclusive crawlers de IA",
    "# (GPTBot, ClaudeBot, PerplexityBot, Google-Extended): o objetivo é ser",
    "# encontrado e citado por buscadores e assistentes.",
    "User-agent: *",
    "Allow: /",
    "",
    `Sitemap: ${url}/sitemap.xml`,
    "",
  ].join("\n");
}

/** Conteúdo do `sitemap.xml` (site de página única: apenas a raiz). */
export function buildSitemapXml(siteUrl: string): string {
  const url = resolveSiteUrl(siteUrl);
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    "  <url>",
    `    <loc>${url}/</loc>`,
    `    <lastmod>${CONTENT_LAST_MODIFIED}</lastmod>`,
    "  </url>",
    "</urlset>",
    "",
  ].join("\n");
}

/**
 * JSON-LD (schema.org) da home: negócio local + site + FAQ.
 *
 * Marcamos apenas o que existe no conteúdo visível e confirmado: sem
 * `openingHours` (atendimento com hora marcada), sem `priceRange` e sem
 * `aggregateRating` (não há dados de avaliação).
 */
export function buildSiteJsonLd(siteUrl: string): string {
  const url = resolveSiteUrl(siteUrl);
  const businessId = `${url}/#business`;

  const graph: Record<string, unknown>[] = [
    {
      "@type": "HealthAndBeautyBusiness",
      "@id": businessId,
      name: SITE_LEGAL_NAME,
      description: BUSINESS_DESCRIPTION,
      url: `${url}/`,
      image: `${url}${OG_IMAGE_PATH}`,
      telephone: CONTACT.telephone,
      address: {
        "@type": "PostalAddress",
        streetAddress: ADDRESS.street,
        addressLocality: ADDRESS.city,
        addressRegion: ADDRESS.region,
        addressCountry: ADDRESS.country,
      },
      areaServed: [
        { "@type": "City", name: ADDRESS.city },
        { "@type": "AdministrativeArea", name: "Vale do Sinos" },
      ],
      sameAs: [CONTACT.instagramUrl],
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "reservations",
        telephone: CONTACT.telephone,
        url: buildWhatsAppUrl(),
        availableLanguage: [CONTACT.availableLanguage],
      },
      employee: TEAM.map(name => ({ "@type": "Person", name })),
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Cuidados do Espaço Therapy",
        itemListElement: SERVICES.map(service => ({
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: service.title,
            description: service.text,
            provider: { "@id": businessId },
          },
        })),
      },
    },
    {
      "@type": "WebSite",
      "@id": `${url}/#website`,
      url: `${url}/`,
      name: SITE_NAME,
      inLanguage: "pt-BR",
      publisher: { "@id": businessId },
    },
    {
      "@type": "FAQPage",
      "@id": `${url}/#faq`,
      mainEntity: FAQS.map(faq => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: { "@type": "Answer", text: faq.answer },
      })),
    },
  ];

  // `\u003c` evita que um "<" no conteúdo encerre o <script> prematuramente.
  return JSON.stringify({ "@context": "https://schema.org", "@graph": graph })
    .replace(/</g, "\\u003c")
    .replace(/%/g, "\\u0025");
}
