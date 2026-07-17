import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
import FramedPanel from './FramedPanel';
import RevealSection from './RevealSection';
import { useLanguage } from '../i18n/LanguageContext';
import characterHanging from '../assets/scenes/character-hanging.webp';
import './Intro.css';

/**
 * Scene 2: scrolling past, you catch her hanging upside down from a bar
 * on the left while the formal introduction (name, positioning, three
 * strengths) sits in the gallery frame on the right. The character
 * drifts with scroll (parallax) so she reads as part of the scenery.
 */
export default function Intro() {
  const { t } = useLanguage();
  const reduce = useReducedMotion();
  const sectionRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });
  const characterY = useTransform(scrollYProgress, [0, 1], [-70, 90]);
  const characterSway = useTransform(scrollYProgress, [0, 0.5, 1], [-2.5, 0, 2.5]);

  return (
    <section id="scene-2" className="intro" ref={sectionRef}>
      <div className="intro__inner container">
        <motion.div
          className="intro__character"
          style={reduce ? undefined : { y: characterY, rotate: characterSway }}
          aria-hidden="true"
        >
          <img
            src={characterHanging}
            alt=""
            className="intro__character-image"
            loading="lazy"
            draggable="false"
          />
        </motion.div>

        <RevealSection className="intro__panel-wrap">
          <FramedPanel variant="deco" className="intro__panel">
            <p className="eyebrow">{t.intro.eyebrow}</p>
            <h2 className="intro__name">
              {t.name.display}
              <span className="intro__name-sub">{t.name.sub}</span>
            </h2>
            <p className="intro__title">{t.title}</p>

            <p className="intro__positioning">
              {t.positioning.before}
              <em>{t.positioning.emphasis}</em>
              {t.positioning.after}
            </p>

            <div className="intro__traits">
              {t.traits.map((trait, index) => (
                <div key={trait.key} className="intro__trait">
                  <span className="intro__trait-index">{String(index + 1).padStart(2, '0')}</span>
                  <h3 className="intro__trait-label">{trait.label}</h3>
                  <p className="intro__trait-desc">{trait.desc}</p>
                </div>
              ))}
            </div>

            <p className="intro__personality">{t.personalityBlurb}</p>
          </FramedPanel>
        </RevealSection>
      </div>
    </section>
  );
}
