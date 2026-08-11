import { useRef } from 'react';
import { useReducedMotion } from 'motion/react';
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLanguage } from '../i18n/LanguageContext';
import characterHanging from '../assets/scenes/character-hanging.webp';
import './Intro.css';

gsap.registerPlugin(useGSAP, ScrollTrigger);

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
  const characterRef = useRef(null);
  const copyRef = useRef(null);

  useGSAP(
    () => {
      if (reduce) return;

      gsap.fromTo(
        characterRef.current,
        { yPercent: -8, rotate: -2.5 },
        {
          yPercent: 12,
          rotate: 2.5,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1,
          },
        }
      );

      gsap.from(
        copyRef.current.children,
        {
          y: 28,
          opacity: 0,
          duration: 0.8,
          stagger: 0.07,
          ease: 'power3.out',
          immediateRender: false,
          scrollTrigger: {
            trigger: copyRef.current,
            start: 'top 78%',
            once: true,
          },
        }
      );
    },
    { scope: sectionRef, dependencies: [reduce], revertOnUpdate: true }
  );

  return (
    <section id="scene-2" className="intro" ref={sectionRef}>
      <div className="intro__inner container">
        <div
          ref={characterRef}
          className="intro__character-bridge"
          aria-hidden="true"
        >
          <img
            src={characterHanging}
            alt=""
            className="intro__character-image"
            loading="lazy"
            draggable="false"
          />
        </div>

        <div ref={copyRef} className="intro__copy">
          <div className="intro__heading">
            <p className="eyebrow">{t.intro.eyebrow}</p>
            <h2 className="intro__name">
              {t.name.display}
              <span className="intro__name-sub">{t.name.sub}</span>
            </h2>
            <p className="intro__title">{t.title}</p>
          </div>

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
        </div>
      </div>
    </section>
  );
}
