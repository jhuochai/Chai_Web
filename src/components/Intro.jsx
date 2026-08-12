import { useRef } from 'react';
import { useReducedMotion } from 'motion/react';
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLanguage } from '../i18n/LanguageContext';
import './Intro.css';

gsap.registerPlugin(useGSAP, ScrollTrigger);

export default function Intro() {
  const { t } = useLanguage();
  const reduce = useReducedMotion();
  const sectionRef = useRef(null);
  const copyRef = useRef(null);

  useGSAP(
    () => {
      if (reduce || !copyRef.current) return;

      gsap.from(copyRef.current.children, {
        y: 26,
        opacity: 0,
        duration: 0.78,
        stagger: 0.08,
        ease: 'power3.out',
        immediateRender: false,
        scrollTrigger: {
          trigger: copyRef.current,
          start: 'top 78%',
          once: true,
        },
      });
    },
    { scope: sectionRef, dependencies: [reduce], revertOnUpdate: true }
  );

  return (
    <section id="scene-2" className="intro" ref={sectionRef} aria-labelledby="intro-name">
      <div className="intro__inner container">
        <div ref={copyRef} className="intro__copy">
          <p className="intro__claim">{t.hero.tagline}</p>

          <header className="intro__identity">
            <p className="intro__eyebrow">{t.intro.eyebrow}</p>
            <h2 id="intro-name" className="intro__name">
              {t.name.display}
            </h2>
            <p className="intro__name-sub">{t.name.sub}</p>
            <p className="intro__title">{t.title}</p>
          </header>

          <p className="intro__positioning">
            {t.positioning.before}
            <em>{t.positioning.emphasis}</em>
            {t.positioning.after}
          </p>

          <ul className="intro__traits" aria-label={t.intro.eyebrow}>
            {t.traits.map((trait) => (
              <li key={trait.key} className={`intro__trait intro__trait--${trait.key}`}>
                <h3 className="intro__trait-label">{trait.label}</h3>
                <p className="intro__trait-desc">{trait.desc}</p>
              </li>
            ))}
          </ul>

          <aside className="intro__player-view">
            <p>{t.personalityBlurb}</p>
          </aside>
        </div>
      </div>
    </section>
  );
}
