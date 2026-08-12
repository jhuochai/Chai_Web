import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'motion/react';
import { useLanguage } from '../i18n/LanguageContext';
import { scrollToScene } from '../lib/scrollToScene';
import { navigateToRoute } from '../lib/siteRoute';
import observatoryScene from '../assets/scenes/hero-observatory.webp';
import characterBack from '../assets/scenes/hero-character-back.webp';
import './Hero.css';

const interfaceCopy = {
  en: {
    title: 'Chai Yi Chen portfolio observatory',
    consoleLabel: 'Observatory destinations',
    labStatus: 'The AI lab is being prepared. New experiments will appear here soon.',
    binLabel: 'Discarded drafts archive',
    binHint: 'Making-of archive',
  },
  zh: {
    title: '柴怡辰的作品集觀景台',
    consoleLabel: '觀景台目的地',
    labStatus: 'AI 實驗室整備中，之後會把新完成的小程式放進來。',
    binLabel: '廢案檔案室',
    binHint: '網站製作幕後',
  },
};

export default function Hero() {
  const reduce = useReducedMotion();
  const { lang, t } = useLanguage();
  const copy = interfaceCopy[lang];
  const [showLabStatus, setShowLabStatus] = useState(false);
  const sectionRef = useRef(null);
  const sceneRef = useRef(null);
  const rafRef = useRef(0);

  useEffect(() => {
    if (reduce) return undefined;

    const section = sectionRef.current;
    const scene = sceneRef.current;
    if (!section || !scene) return undefined;

    const resetParallax = () => {
      scene.style.setProperty('--parallax-x', '0px');
      scene.style.setProperty('--parallax-y', '0px');
    };

    const onPointerMove = (event) => {
      window.cancelAnimationFrame(rafRef.current);
      rafRef.current = window.requestAnimationFrame(() => {
        const rect = section.getBoundingClientRect();
        const x = Math.max(-0.5, Math.min(0.5, (event.clientX - rect.left) / rect.width - 0.5));
        const y = Math.max(-0.5, Math.min(0.5, (event.clientY - rect.top) / rect.height - 0.5));

        scene.style.setProperty('--parallax-x', `${(x * -24).toFixed(1)}px`);
        scene.style.setProperty('--parallax-y', `${(y * -16).toFixed(1)}px`);
      });
    };

    section.addEventListener('pointermove', onPointerMove);
    section.addEventListener('pointerleave', resetParallax);

    return () => {
      section.removeEventListener('pointermove', onPointerMove);
      section.removeEventListener('pointerleave', resetParallax);
      window.cancelAnimationFrame(rafRef.current);
    };
  }, [reduce]);

  const activateEntry = (entry) => {
    if (entry.status === 'coming-soon') {
      setShowLabStatus(true);
      return;
    }

    scrollToScene(entry.target, { immediate: reduce });
  };

  return (
    <section id="scene-1" className="hero" ref={sectionRef} aria-labelledby="hero-title">
      <h1 id="hero-title" className="visually-hidden">
        {copy.title}
      </h1>

      <div className="hero__observatory">
        <div className="hero__scene-wrap" ref={sceneRef} aria-hidden="true">
          <img className="hero__scene" src={observatoryScene} alt="" draggable="false" />
        </div>

        <div className="hero__atmosphere" aria-hidden="true" />
        <div className="hero__bookshelf" aria-hidden="true" />

        <img
          className="hero__character hero__character--back"
          src={characterBack}
          alt=""
          aria-hidden="true"
          draggable="false"
        />

        <nav className="hero__console" aria-label={t.hero.switcherLabel}>
          <span className="hero__console-label" aria-hidden="true">
            {copy.consoleLabel}
          </span>
          <div className="hero__entries">
            {t.hero.entries.map((entry, index) => (
              <button
                key={entry.id}
                type="button"
                className="hero__entry"
                style={{ '--entry-index': index }}
                onClick={() => activateEntry(entry)}
                aria-expanded={entry.status === 'coming-soon' ? showLabStatus : undefined}
                aria-controls={entry.status === 'coming-soon' ? 'hero-lab-status' : undefined}
              >
                <span className="hero__entry-signal" aria-hidden="true" />
                <span>{entry.label}</span>
              </button>
            ))}
          </div>

          {showLabStatus && (
            <p id="hero-lab-status" className="hero__lab-status" role="status">
              {copy.labStatus}
            </p>
          )}
        </nav>

        <button
          type="button"
          className="hero__archive"
          aria-label={copy.binLabel}
          data-hint={copy.binHint}
          onClick={() => navigateToRoute('/making-of')}
        >
          <svg viewBox="0 0 32 38" aria-hidden="true">
            <path d="M5 10h22l-1.8 24H6.8L5 10Z" />
            <path d="M2.5 7h27M11 7V3h10v4M11.5 15v13M20.5 15v13" />
          </svg>
        </button>

        <div className="hero__frame-shine" aria-hidden="true" />
      </div>
    </section>
  );
}
