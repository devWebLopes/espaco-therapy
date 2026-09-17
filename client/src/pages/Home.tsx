import { useState } from "react";
import {
  ArrowDown,
  ArrowUpRight,
  ChevronRight,
  Flower2,
  Instagram,
  MapPin,
  Menu,
  Sparkles,
  X,
} from "lucide-react";
import {
  ADDRESS,
  ADDRESS_LABEL,
  CITY_LABEL,
  CONTACT,
  FAQS,
  GALLERY,
  IMAGES,
  OFFER,
  SERVICES,
  TEAM,
  TEAM_DESCRIPTION,
  buildWhatsAppUrl,
} from "@shared/site";

/**
 * Ícone oficial do WhatsApp em formato SVG com proporções e curvas precisas.
 */
function WhatsAppIcon({
  size = 20,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
      style={{ flexShrink: 0 }}
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

/**
 * Links de contato — valores centralizados em `shared/site.ts` (fonte única
 * do número de WhatsApp, Instagram e endereço/mapa).
 */
const whatsapp = buildWhatsAppUrl();
const instagram = CONTACT.instagramUrl;
const mapsUrl = CONTACT.mapsUrl;

function Logo({
  onClick,
}: {
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}) {
  return (
    <a
      className="logo"
      href="#inicio"
      onClick={onClick}
      aria-label="Espaço Therapy — início"
    >
      <span className="logo-mark" aria-hidden="true">
        <Flower2 size={18} strokeWidth={1.5} />
      </span>
      <span className="logo-type">
        Espaço <em>Therapy</em>
      </span>
    </a>
  );
}

function SectionIntro({
  eyebrow,
  title,
  text,
  light = false,
}: {
  eyebrow: string;
  title: string;
  text?: string;
  light?: boolean;
}) {
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

function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const closeMenu = () => setMenuOpen(false);

  const handleScrollTo = (
    e: React.MouseEvent<HTMLAnchorElement>,
    targetId: string,
    closeMobileMenu = false
  ) => {
    e.preventDefault();
    if (closeMobileMenu) {
      setMenuOpen(false);
    }

    const id = targetId.replace(/^#/, "");
    if (id === "inicio") {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
      if (window.history.pushState) {
        window.history.pushState(null, "", "#inicio");
      }
      return;
    }

    const element = document.getElementById(id);
    if (!element) return;

    const header = document.querySelector<HTMLElement>(".site-header");
    const headerHeight = header ? header.offsetHeight : 72;
    const elementPosition = element.getBoundingClientRect().top + window.scrollY;
    const offsetPosition = Math.max(0, elementPosition - headerHeight);

    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth",
    });

    if (window.history.pushState) {
      window.history.pushState(null, "", `#${id}`);
    }

    element.setAttribute("tabindex", "-1");
    element.focus({ preventScroll: true });
  };

  return (
    <main id="conteudo" tabIndex={-1}>
      <header className="site-header">
        <div className="header-inner">
          <Logo onClick={e => handleScrollTo(e, "#inicio", true)} />
          <nav
            className={`main-nav ${menuOpen ? "is-open" : ""}`}
            aria-label="Navegação principal"
          >
            <a
              href="#servicos"
              onClick={e => handleScrollTo(e, "#servicos", true)}
            >
              Serviços
            </a>
            <a
              href="#ritual"
              onClick={e => handleScrollTo(e, "#ritual", true)}
            >
              O espaço
            </a>
            <a
              href="#equipe"
              onClick={e => handleScrollTo(e, "#equipe", true)}
            >
              Equipe
            </a>
            <a
              href="#contato"
              onClick={e => handleScrollTo(e, "#contato", true)}
            >
              Visite
            </a>
            <a
              className="nav-cta"
              href={whatsapp}
              target="_blank"
              rel="noreferrer"
              onClick={closeMenu}
            >
              Agendar <ArrowUpRight size={15} aria-hidden="true" />
            </a>
          </nav>
          <button
            className="menu-toggle"
            type="button"
            aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(open => !open)}
          >
            {menuOpen ? (
              <X size={22} aria-hidden="true" />
            ) : (
              <Menu size={22} aria-hidden="true" />
            )}
          </button>
        </div>
      </header>

      <section className="hero" id="inicio">
        <div className="hero-glow" />
        <div className="hero-inner container">
          <div className="hero-copy">
            <p className="eyebrow hero-eyebrow">
              <span />
              Estética & terapias · São Leopoldo
            </p>
            <h1>
              Seu corpo
              <br />
              <i>pede</i> pausa.
            </h1>
            <p className="hero-lead">
              Um espaço para cuidar da sua energia, da sua beleza e do tempo que
              é só seu.
            </p>
            <div className="hero-actions">
              <a
                className="button button-dark"
                href="#servicos"
                onClick={e => handleScrollTo(e, "#servicos")}
              >
                Descobrir o espaço <ArrowDown size={16} aria-hidden="true" />
              </a>
              <a
                className="text-link"
                href={whatsapp}
                target="_blank"
                rel="noreferrer"
              >
                Falar com a gente <ArrowUpRight size={15} aria-hidden="true" />
              </a>
            </div>
            <div className="hero-note">
              <Sparkles size={14} aria-hidden="true" /> Corpo, mente e energia
              em equilíbrio.
            </div>
          </div>
          <div className="hero-art">
            <div className="hero-frame">
              <img
                src={IMAGES.interior.src}
                alt={IMAGES.interior.alt}
                width={IMAGES.interior.width}
                height={IMAGES.interior.height}
                fetchPriority="high"
                decoding="async"
              />
            </div>
            <div className="hero-stamp" aria-hidden="true">
              <span>feito para</span>
              <strong>você</strong>
              <Flower2 size={22} />
            </div>
            <div className="hero-vertical" aria-hidden="true">
              ESPAÇO THERAPY · ESTÉTICA & TERAPIAS
            </div>
          </div>
        </div>
        <div className="hero-bottom container">
          <span>{ADDRESS_LABEL}</span>
          <a
            href="#servicos"
            onClick={e => handleScrollTo(e, "#servicos")}
            aria-label="Rolar para serviços"
          >
            <ChevronRight size={17} aria-hidden="true" />
          </a>
        </div>
      </section>

      <section className="manifesto section-pad" id="ritual">
        <div className="container manifesto-grid">
          <div className="manifesto-aside">
            <span>01</span>
            <span className="vertical-label">O seu ritual começa aqui</span>
          </div>
          <div>
            <p className="eyebrow">
              <span />
              Mais que estética
            </p>
            <h2>
              Um refúgio para
              <br />
              <i>voltar a si.</i>
            </h2>
          </div>
          <div className="manifesto-copy">
            <p>
              Entre tratamentos, conversas e pequenos rituais, criamos um lugar
              onde você desacelera sem precisar se explicar.
            </p>
            <a
              className="text-link"
              href="#contato"
              onClick={e => handleScrollTo(e, "#contato")}
            >
              Conheça nosso jeito <ArrowUpRight size={15} aria-hidden="true" />
            </a>
          </div>
          <div className="manifesto-portrait" aria-hidden="true">
            <div className="manifesto-portrait-frame">
              <img
                src={IMAGES.manifesto.src}
                alt={IMAGES.manifesto.alt}
                width={IMAGES.manifesto.width}
                height={IMAGES.manifesto.height}
                loading="lazy"
                decoding="async"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="services section-pad" id="servicos">
        <div className="container">
          <div className="services-heading">
            <SectionIntro
              eyebrow="Para o seu momento"
              title="Cuidado que encontra você."
              text="Escolha o que o seu corpo, a sua energia ou a sua expressão estão pedindo hoje."
            />
            <span className="section-index">02 / 04</span>
          </div>
          <div className="service-list">
            {SERVICES.map(service => (
              <article
                className={`service-card service-card-${service.tone}`}
                key={service.number}
              >
                <div className="service-card-content">
                  <span className="card-number">{service.number}</span>
                  <h3>{service.title}</h3>
                  <p>{service.text}</p>
                  <ul>
                    {service.items.map(item => (
                      <li key={item}>
                        {item}
                        <ChevronRight size={14} aria-hidden="true" />
                      </li>
                    ))}
                  </ul>
                  <a
                    href={whatsapp}
                    target="_blank"
                    rel="noreferrer"
                    className="card-link"
                    aria-label={`Agendar ${service.title}`}
                  >
                    Agendar <ArrowUpRight size={16} aria-hidden="true" />
                  </a>
                </div>
                <div className="service-card-image">
                  <img
                    src={service.image.src}
                    alt={service.image.alt}
                    width={service.image.width}
                    height={service.image.height}
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="offer section-pad">
        <div className="container offer-inner">
          <div className="offer-image">
            <img
              src={IMAGES.offer.src}
              alt={IMAGES.offer.alt}
              width={IMAGES.offer.width}
              height={IMAGES.offer.height}
              loading="lazy"
              decoding="async"
            />
            <span className="offer-image-label">
              pausa que
              <br />
              transforma
            </span>
          </div>
          <div className="offer-copy">
            <p className="eyebrow eyebrow-light">
              <span />
              Um convite ao descanso
            </p>
            <h2>
              Deixe o mundo
              <br />
              <i>esperar um pouco.</i>
            </h2>
            <p>{OFFER.text}</p>
            {OFFER.showPrice && (
              <div className="offer-price">
                <small>{OFFER.priceLabel}</small>
                <strong>{OFFER.price}</strong>
              </div>
            )}
            <a
              className="button button-cream"
              href={whatsapp}
              target="_blank"
              rel="noreferrer"
            >
              Quero essa pausa <ArrowUpRight size={16} aria-hidden="true" />
            </a>
            <span className="offer-footnote">{OFFER.validityNote}</span>
          </div>
        </div>
      </section>

      <section
        className="team section-pad"
        id="equipe"
        aria-labelledby="team-title"
      >
        <div className="container team-inner">
          <div className="team-copy">
            <p className="eyebrow">
              <span />
              Quem cuida de você
            </p>
            <h2 id="team-title">
              Uma equipe,
              <br />
              <i>um mesmo cuidado.</i>
            </h2>
            <p className="team-lead">{TEAM_DESCRIPTION}</p>
            <a
              className="text-link"
              href={whatsapp}
              target="_blank"
              rel="noreferrer"
            >
              Falar com a equipe <ArrowUpRight size={15} aria-hidden="true" />
            </a>
          </div>
          <ul className="team-list">
            {TEAM.map(member => (
              <li key={member}>
                <span className="team-mark" aria-hidden="true">
                  <Flower2 size={20} strokeWidth={1.5} />
                </span>
                <span className="team-name">{member}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="gallery section-pad">
        <div className="container">
          <div className="gallery-heading">
            <SectionIntro
              eyebrow="Imagens do nosso perfil"
              title="Detalhes que ficam."
            />
            <a
              className="text-link"
              href={instagram}
              target="_blank"
              rel="noreferrer"
            >
              <Instagram size={16} aria-hidden="true" /> @espacotherapy_
            </a>
          </div>
          <div className="gallery-grid">
            {GALLERY.map((item, index) => (
              <a
                className={`gallery-item gallery-item-${index + 1}`}
                href={item.href}
                target="_blank"
                rel="noreferrer"
                key={item.label}
              >
                <img
                  src={item.image.src}
                  alt={item.image.alt}
                  width={item.image.width}
                  height={item.image.height}
                  loading="lazy"
                  decoding="async"
                />
                <span>
                  {item.label} <ArrowUpRight size={15} aria-hidden="true" />
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="visit section-pad" id="contato">
        <div className="container visit-grid">
          <div className="visit-copy">
            <p className="eyebrow">
              <span />
              Quando quiser, estamos aqui
            </p>
            <h2>
              Venha viver
              <br />
              <i>o seu momento.</i>
            </h2>
            <p>
              O próximo cuidado começa com uma conversa. Escreva para a gente e
              encontre o ritual certo para você.
            </p>
            <a
              className="button button-dark"
              href={whatsapp}
              target="_blank"
              rel="noreferrer"
            >
              <WhatsAppIcon size={18} aria-hidden="true" /> Agendar pelo
              WhatsApp
            </a>
          </div>
          <div className="visit-card">
            <div className="visit-card-top">
              <MapPin size={20} aria-hidden="true" />
              <span>Nos encontre</span>
            </div>
            <h3>{ADDRESS.street}</h3>
            <p>
              {ADDRESS.district}
              <br />
              {CITY_LABEL}
            </p>
            <a
              className="text-link"
              href={mapsUrl}
              target="_blank"
              rel="noreferrer"
            >
              Abrir no mapa <ArrowUpRight size={15} aria-hidden="true" />
            </a>
            <div className="visit-card-line" />
            <p className="visit-small">
              Atendimentos com hora marcada.
              <br />
              Horários e profissionais sob consulta.
            </p>
          </div>
        </div>
      </section>

      <section className="faq section-pad" aria-labelledby="faq-title">
        <div className="container faq-grid">
          <div>
            <p className="eyebrow">
              <span />
              Antes de chegar
            </p>
            <h2 id="faq-title">
              Tudo mais
              <br />
              <i>leve.</i>
            </h2>
            <p className="faq-lead">
              Se a sua dúvida não estiver aqui, nossa equipe responde pelo
              WhatsApp.
            </p>
            <a
              className="text-link"
              href={whatsapp}
              target="_blank"
              rel="noreferrer"
            >
              Falar com a equipe <ArrowUpRight size={15} aria-hidden="true" />
            </a>
          </div>
          <div className="faq-list">
            {FAQS.map((faq, index) => (
              <div
                className={`faq-item ${openFaq === index ? "is-open" : ""}`}
                key={faq.question}
              >
                <button
                  type="button"
                  aria-expanded={openFaq === index}
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                >
                  <span>{faq.question}</span>
                  <ChevronRight size={17} aria-hidden="true" />
                </button>
                {openFaq === index && <p>{faq.answer}</p>}
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="site-footer">
        <div className="container footer-inner">
          <Logo onClick={e => handleScrollTo(e, "#inicio")} />
          <p>
            Corpo, mente e energia
            <br />
            em equilíbrio.
          </p>
          <div className="footer-links">
            <a href={instagram} target="_blank" rel="noreferrer">
              <Instagram size={16} aria-hidden="true" /> Instagram
            </a>
            <a href={whatsapp} target="_blank" rel="noreferrer">
              <WhatsAppIcon size={16} aria-hidden="true" /> WhatsApp
            </a>
          </div>
          <span className="footer-copy">
            © {new Date().getFullYear()} Espaço Therapy
          </span>
        </div>
      </footer>
      <a
        className="floating-whatsapp"
        href={whatsapp}
        target="_blank"
        rel="noreferrer"
        aria-label="Falar pelo WhatsApp"
      >
        <WhatsAppIcon size={26} aria-hidden="true" />
      </a>
    </main>
  );
}

export default Home;
