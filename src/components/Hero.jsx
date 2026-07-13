import { useRef } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import FramedPanel from './FramedPanel';
import VariableProximity from './VariableProximity';
import { useLanguage } from '../i18n/LanguageContext';
import heroBackground from '../assets/scenes/hero-background.webp';
import './Hero.css';

const nameRise = {
  hidden: { opacity: 0, y: 22 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, delay: 0.25 + i * 0.12, ease: [0.16, 1, 0.3, 1] },
  }),
};

export default function Hero() {
  const reduce = useReducedMotion();
  const { lang, t } = useLanguage();
  const nameWrapRef = useRef(null);

  return (
    <section id="scene-1" className="hero">
      <div className="hero__bg" aria-hidden="true">
        <img src={heroBackground} alt="" className="hero__bg-image" />
        <div className="hero__fog" />
        <div className="hero__scrim" />
      </div>

      <div className="hero__content container">
        <motion.span
          className="hero__badge btn-glass btn-glass--ghost"
          initial={reduce ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        >
          {t.title}
        </motion.span>

        <FramedPanel as="div" variant="deco" className="hero__nameplate">
          <motion.div
            initial={reduce ? false : 'hidden'}
            animate="show"
            variants={{ show: { transition: { staggerChildren: 0.08 } } }}
          >
            <motion.h1
              className={`hero__name ${lang === 'en' ? 'hero__name--latin' : ''}`}
              variants={nameRise}
              custom={0}
            >
              <span ref={nameWrapRef} className="hero__name-proximity">
                <VariableProximity
                  label={t.name.display}
                  containerRef={nameWrapRef}
                  fromFontVariationSettings="'wght' 560, 'opsz' 40"
                  toFontVariationSettings="'wght' 900, 'opsz' 144"
                  radius={140}
                  falloff="exponential"
                />
              </span>
            </motion.h1>
            <motion.p className="hero__name-en" variants={nameRise} custom={1}>
              {t.name.sub}
            </motion.p>
          </motion.div>
        </FramedPanel>

        <motion.p
          className="hero__positioning"
          initial={reduce ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.1, ease: [0.16, 1, 0.3, 1] }}
        >
          {t.positioning.before}
          <em>{t.positioning.emphasis}</em>
          {t.positioning.after}
        </motion.p>

        <motion.ul
          className="hero__stats"
          initial={reduce ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.3, ease: [0.16, 1, 0.3, 1] }}
        >
          {t.highlights.map((h) => (
            <li key={h.label}>
              {h.value} {h.label}
            </li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}
