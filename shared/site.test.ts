import { describe, expect, it } from "vitest";

import {
  ADDRESS,
  CONTACT,
  DEFAULT_SITE_URL,
  FAQS,
  GALLERY,
  IMAGES,
  OFFER,
  SERVICES,
  STORAGE_PATH,
  applySiteTokens,
  buildRobotsTxt,
  buildSiteJsonLd,
  buildSitemapXml,
  buildWhatsAppUrl,
  resolveSiteUrl,
  type SiteImage,
} from "./site";

describe("resolveSiteUrl", () => {
  it("usa o domínio padrão quando não há valor configurado", () => {
    expect(resolveSiteUrl()).toBe(DEFAULT_SITE_URL);
    expect(resolveSiteUrl("")).toBe(DEFAULT_SITE_URL);
    expect(resolveSiteUrl("   ")).toBe(DEFAULT_SITE_URL);
  });

  it("normaliza espaços e barra final", () => {
    expect(resolveSiteUrl(" https://exemplo.com.br/ ")).toBe(
      "https://exemplo.com.br"
    );
    expect(resolveSiteUrl("https://exemplo.com.br///")).toBe(
      "https://exemplo.com.br"
    );
  });
});

describe("buildWhatsAppUrl", () => {
  it("usa o número confirmado e codifica a mensagem", () => {
    const url = buildWhatsAppUrl();

    expect(
      url.startsWith(`https://wa.me/${CONTACT.whatsappDigits}?text=`)
    ).toBe(true);
    expect(url).not.toContain(" ");
    expect(decodeURIComponent(url.split("?text=")[1])).toBe(
      CONTACT.whatsappMessage
    );
  });

  it("aceita mensagem personalizada", () => {
    const url = buildWhatsAppUrl("Quero agendar Reiki");

    expect(decodeURIComponent(url.split("?text=")[1])).toBe(
      "Quero agendar Reiki"
    );
  });
});

describe("applySiteTokens", () => {
  const html = [
    '<link rel="canonical" href="%SITE_URL%/" />',
    '<meta property="og:url" content="%SITE_URL%/" />',
    '<meta property="og:image" content="%SITE_OG_IMAGE%" />',
    '<meta name="description" content="%SITE_DESCRIPTION%" />',
    '<a href="%SITE_INSTAGRAM%">Instagram</a>',
    "<span>%SITE_PHONE_DISPLAY%</span>",
  ].join("\n");

  it("substitui todas as ocorrências de cada token", () => {
    const result = applySiteTokens(html, "https://exemplo.com.br/");

    expect(result).not.toContain("%SITE_");
    expect(result.match(/https:\/\/exemplo\.com\.br\//g)?.length).toBe(3);
    expect(result).toContain(`<span>${CONTACT.phoneDisplay}</span>`);
    expect(result).toContain(CONTACT.instagramUrl);
  });

  it("preserva sequências percentuais que não são tokens do site", () => {
    const result = applySiteTokens(
      '<img src="/foto.jpg?a=%20b" alt="teste" />',
      DEFAULT_SITE_URL
    );

    expect(result).toBe('<img src="/foto.jpg?a=%20b" alt="teste" />');
  });
});

describe("buildRobotsTxt", () => {
  it("libera o crawl e aponta o sitemap canônico", () => {
    const robots = buildRobotsTxt("https://exemplo.com.br/");

    expect(robots).toContain("User-agent: *");
    expect(robots).toContain("Allow: /");
    expect(robots).not.toContain("Disallow");
    expect(robots).toContain("Sitemap: https://exemplo.com.br/sitemap.xml");
  });
});

describe("buildSitemapXml", () => {
  it("lista a única URL canônica com lastmod", () => {
    const sitemap = buildSitemapXml("https://exemplo.com.br");

    expect(sitemap.startsWith('<?xml version="1.0" encoding="UTF-8"?>')).toBe(
      true
    );
    expect(sitemap).toContain("<loc>https://exemplo.com.br/</loc>");
    expect(sitemap).toMatch(/<lastmod>\d{4}-\d{2}-\d{2}<\/lastmod>/);
    expect(sitemap.trim().endsWith("</urlset>")).toBe(true);
    expect(sitemap.match(/<loc>/g)?.length).toBe(1);
  });
});

describe("buildSiteJsonLd", () => {
  const jsonLd = buildSiteJsonLd("https://exemplo.com.br");
  const parsed = JSON.parse(jsonLd) as {
    "@context": string;
    "@graph": Record<string, unknown>[];
  };
  const types = parsed["@graph"].map(node => node["@type"]);

  it("é um JSON válido e não pode encerrar a tag <script>", () => {
    expect(parsed["@context"]).toBe("https://schema.org");
    expect(jsonLd).not.toContain("</script>");
    expect(jsonLd).not.toContain("<");
    // "%" escapado impede que o Vite tente substituir tokens dentro do JSON-LD.
    expect(jsonLd).not.toContain("%");
  });

  it("declara negócio local, website e FAQ", () => {
    expect(types).toEqual(["HealthAndBeautyBusiness", "WebSite", "FAQPage"]);
  });

  it("usa o NAP e o contato oficiais", () => {
    const business = parsed["@graph"][0] as Record<string, unknown>;
    const address = business.address as Record<string, string>;
    const contactPoint = business.contactPoint as Record<string, string>;

    expect(business.telephone).toBe(CONTACT.telephone);
    expect(address.streetAddress).toBe(ADDRESS.street);
    expect(address.addressLocality).toBe(ADDRESS.city);
    expect(address.addressRegion).toBe(ADDRESS.region);
    expect(contactPoint.url).toBe(buildWhatsAppUrl());
    expect(business.sameAs).toEqual([CONTACT.instagramUrl]);
  });

  it("não declara horários nem avaliações sem dados confirmados", () => {
    const business = parsed["@graph"][0] as Record<string, unknown>;

    expect(business.openingHours).toBeUndefined();
    expect(business.aggregateRating).toBeUndefined();
    expect(business.priceRange).toBeUndefined();
  });

  it("espelha a seção de FAQ e o catálogo de serviços visíveis", () => {
    const faqPage = parsed["@graph"][2] as { mainEntity: unknown[] };
    const business = parsed["@graph"][0] as {
      hasOfferCatalog: { itemListElement: unknown[] };
      employee: unknown[];
    };

    expect(faqPage.mainEntity).toHaveLength(FAQS.length);
    expect(business.hasOfferCatalog.itemListElement).toHaveLength(
      SERVICES.length
    );
    expect(business.employee).toHaveLength(3);
  });
});

describe("imagens (performance e acessibilidade)", () => {
  const images: [string, SiteImage][] = [
    ["hero", IMAGES.interior],
    ["oferta", IMAGES.offer],
    ...SERVICES.map(
      (service, index) =>
        [`serviço ${index + 1}`, service.image] as [string, SiteImage]
    ),
    ...GALLERY.map(
      (item, index) =>
        [`galeria ${index + 1}`, item.image] as [string, SiteImage]
    ),
  ];

  it.each(images)("%s tem src local, alt e dimensões", (_name, image) => {
    expect(image.src.startsWith(STORAGE_PATH)).toBe(true);
    expect(image.alt.trim().length).toBeGreaterThan(10);
    expect(image.width).toBeGreaterThan(0);
    expect(image.height).toBeGreaterThan(0);
  });

  it("não repete a imagem do hero no card de beleza", () => {
    expect(IMAGES.interior.src).not.toBe(IMAGES.beauty.src);
  });
});

describe("oferta", () => {
  it("expõe um interruptor para o preço e a nota de validade", () => {
    expect(typeof OFFER.showPrice).toBe("boolean");
    expect(OFFER.price).toMatch(/R\$/);
    expect(OFFER.validityNote.length).toBeGreaterThan(20);
  });
});
