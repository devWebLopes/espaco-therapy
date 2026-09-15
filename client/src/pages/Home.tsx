import { useState } from "react";
import {
  ArrowDown,
  ArrowUpRight,
  ChevronRight,
  Flower2,
  Instagram,
  MapPin,
  Menu,
  MessageCircle,
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
 * Links de contato — valores centralizados em `shared/site.ts` (fonte única
 * do número de WhatsApp, Instagram e endereço/mapa).
 */
const whatsapp = buildWhatsAppUrl();
const instagram = CONTACT.instagramUrl;
const mapsUrl = CONTACT.mapsUrl;

function Logo() {
  return (
    <a className="logo" href="#inicio" aria-label="Espaço Therapy — início">
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

  return (
    <main id="conteudo" tabIndex={-1}>
      <header className="site-header">
        <div className="header-inner">
          <Logo />
          <nav
            className={`main-nav ${menuOpen ? "is-open" : ""}`}
            aria-label="Navegação principal"
          >
            <a href="#servicos" onClick={closeMenu}>
              Serviços
            </a>
            <a href="#ritual" onClick={closeMenu}>
              O espaço
            </a>
            <a href="#equipe" onClick={closeMenu}>
              Equipe
            </a>
            <a href="#contato" onClick={closeMenu}>
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
              <a className="button button-dark" href="#servicos">
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
          <a href="#servicos" aria-label="Rolar para serviços">
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
            <a className="text-link" href="#contato">
              Conheça nosso jeito <ArrowUpRight size={15} aria-hidden="true" />
            </a>
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
              <MessageCircle size={17} aria-hidden="true" /> Agendar pelo
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
          <Logo />
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
              <MessageCircle size={16} aria-hidden="true" /> WhatsApp
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
        <MessageCircle size={20} aria-hidden="true" />
      </a>
    </main>
  );
}

export default Home;
