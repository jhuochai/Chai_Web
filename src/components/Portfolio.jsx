import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { ArrowUpRight, X } from '@phosphor-icons/react';
import RevealSection from './RevealSection';
import { catCafeCase } from '../data/catCafeCase';
import { useLanguage } from '../i18n/LanguageContext';
import './Portfolio.css';

function EvidenceFigure({ item, copy, onOpen }) {
  return (
    <figure className="portfolio-evidence" data-evidence-id={item.id}>
      <button
        type="button"
        className="portfolio-evidence__open"
        aria-label={`${copy.openPrefix}${item.title}`}
        onClick={(event) => onOpen(item, event.currentTarget)}
      >
        <span className="portfolio-evidence__image-wrap">
          <img src={item.src} alt={item.alt} loading="lazy" decoding="async" />
          <span className="portfolio-evidence__action" aria-hidden="true">
            <ArrowUpRight size={18} />
          </span>
        </span>
      </button>
      <figcaption>
        <span className="portfolio-evidence__format">{item.formatLabel}</span>
        <h4>{item.title}</h4>
        <p>{item.proof}</p>
      </figcaption>
    </figure>
  );
}

function EvidenceLightbox({ item, copy, onClose, returnFocusTo }) {
  const closeRef = useRef(null);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    const backgroundNodes = Array.from(document.body.children).filter(
      (node) => !node.classList.contains('portfolio-lightbox')
    );
    const previousBackgroundState = backgroundNodes.map((node) => ({
      node,
      inert: node.hasAttribute('inert'),
      ariaHidden: node.getAttribute('aria-hidden'),
    }));

    document.body.style.overflow = 'hidden';
    backgroundNodes.forEach((node) => {
      node.setAttribute('inert', '');
      node.setAttribute('aria-hidden', 'true');
    });
    closeRef.current?.focus();

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
      if (event.key === 'Tab') {
        event.preventDefault();
        closeRef.current?.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
      previousBackgroundState.forEach(({ node, inert, ariaHidden }) => {
        if (!inert) node.removeAttribute('inert');
        if (ariaHidden === null) node.removeAttribute('aria-hidden');
        else node.setAttribute('aria-hidden', ariaHidden);
      });
      queueMicrotask(() => returnFocusTo?.focus());
    };
  }, [onClose, returnFocusTo]);

  return createPortal(
    <div
      className="portfolio-lightbox"
      data-testid="portfolio-lightbox-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="portfolio-lightbox__dialog" role="dialog" aria-modal="true" aria-labelledby="portfolio-lightbox-title">
        <button ref={closeRef} type="button" className="portfolio-lightbox__close" aria-label={copy.close} onClick={onClose}>
          <X size={24} />
        </button>
        <img src={item.src} alt={item.alt} />
        <div className="portfolio-lightbox__caption">
          <span>{item.formatLabel}</span>
          <h3 id="portfolio-lightbox-title">{item.title}</h3>
          <p>{item.proof}</p>
        </div>
      </div>
    </div>,
    document.body
  );
}

export default function Portfolio() {
  const { lang } = useLanguage();
  const work = catCafeCase[lang];
  const [activeItem, setActiveItem] = useState(null);
  const openerRef = useRef(null);

  const openLightbox = (item, opener) => {
    openerRef.current = opener;
    setActiveItem(item);
  };

  const closeLightbox = () => {
    setActiveItem(null);
  };

  return (
    <section id="scene-5" className="portfolio" inert={activeItem || undefined}>
      <div className="container">
        <RevealSection as="header" className="portfolio__head">
          <p className="portfolio__section-name">{work.pageTitle}</p>
          <h2>{work.title}</h2>
          <p className="portfolio__subtitle">{work.subtitle}</p>
          <p className="portfolio__intro">{work.pageIntro}</p>
        </RevealSection>

        <RevealSection as="article" delay={0.05} className="portfolio-hero">
          <div className="portfolio-hero__visual">
            <img src={work.hero.src} alt={work.hero.alt} loading="lazy" decoding="async" width="404" height="590" />
            <span className="portfolio-hero__stamp">18k → 30k</span>
          </div>
          <div className="portfolio-hero__story">
            <p className="portfolio-hero__growth">{work.growth}</p>
            <h3>{work.hero.title}</h3>
            <p>{work.summary}</p>
            <p className="portfolio-hero__note">{work.hero.note}</p>
            <dl className="portfolio-metrics">
              {work.metrics.map((metric) => (
                <div key={metric.id}>
                  <dt>{metric.label}</dt>
                  <dd>{metric.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </RevealSection>

        <RevealSection as="header" delay={0.06} className="portfolio__evidence-head">
          <h2>{work.evidenceHeading}</h2>
          <p>{work.evidenceIntro}</p>
        </RevealSection>

        <div className="portfolio-pillars">
          {work.pillars.map((pillar, pillarIndex) => (
            <RevealSection
              as="section"
              delay={0.04 + pillarIndex * 0.03}
              className={`portfolio-pillar portfolio-pillar--${pillarIndex % 2 === 0 ? 'left' : 'right'}`}
              key={pillar.id}
            >
              <header className="portfolio-pillar__head">
                <h3>{pillar.title}</h3>
                <p>{pillar.description}</p>
              </header>
              <div className="portfolio-pillar__works">
                {pillar.items.map((item) => (
                  <EvidenceFigure key={item.id} item={item} copy={work.lightbox} onOpen={openLightbox} />
                ))}
              </div>
            </RevealSection>
          ))}
        </div>

        <RevealSection as="aside" delay={0.08} className="dark-chess-note" aria-labelledby="dark-chess-title">
          <div className="dark-chess-note__intro">
            <h2 id="dark-chess-title">{work.darkChess.title}</h2>
            <p>{work.darkChess.intro}</p>
          </div>
          <dl>
            <div>
              <dt>{work.darkChess.hypothesisLabel}</dt>
              <dd>{work.darkChess.hypothesis}</dd>
            </div>
            <div>
              <dt>{work.darkChess.signalLabel}</dt>
              <dd>{work.darkChess.signal}</dd>
            </div>
            <div>
              <dt>{work.darkChess.decisionLabel}</dt>
              <dd>{work.darkChess.decision}</dd>
            </div>
          </dl>
        </RevealSection>
      </div>

      {activeItem ? (
        <EvidenceLightbox
          item={activeItem}
          copy={work.lightbox}
          onClose={closeLightbox}
          returnFocusTo={openerRef.current}
        />
      ) : null}
    </section>
  );
}
