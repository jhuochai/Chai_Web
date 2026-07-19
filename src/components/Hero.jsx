import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import VariableProximity from './VariableProximity';
import { useLanguage } from '../i18n/LanguageContext';
import starryScene from '../assets/scenes/hero-background.webp';
import daylightScene from '../assets/scenes/tree-day.webp';
import nightScene from '../assets/scenes/tree-night.webp';
import './Hero.css';

// Order matches content.hero.scenes (starry / day / night).
const SCENE_SOURCES = [starryScene, daylightScene, nightScene];
const CROSSFADE_MS = 1000;

/**
 * Cinematic scene-switcher hero: the artwork IS the design. Full-bleed
 * key visuals crossfade under a single tagline and a liquid-glass
 * switcher row — no frames, no stats, no paragraph. The art stays
 * bright (no dimming filter); only a bottom grade protects legibility.
 * The background answers the cursor with a soft parallax drift.
 */
export default function Hero() {
  const reduce = useReducedMotion();
  const { t } = useLanguage();
  const [active, setActive] = useState(0);
  const coolingRef = useRef(false);
  const scenesRef = useRef(null);
  const sectionRef = useRef(null);
  const taglineRef = useRef(null);
  const rafRef = useRef(0);

  const switchScene = (index) => {
    if (index === active || coolingRef.current) return;
    coolingRef.current = true;
    setActive(index);
    window.setTimeout(() => {
      coolingRef.current = false;
    }, CROSSFADE_MS);
  };

  // Cursor parallax: the whole scene leans a few pixels toward the
  // pointer, so the backdrop feels alive instead of painted on.
  useEffect(() => {
    if (reduce) return undefined;
    const section = sectionRef.current;
    const scenes = scenesRef.current;
    if (!section || !scenes) return undefined;

    const onMove = (event) => {
      window.cancelAnimationFrame(rafRef.current);
      rafRef.current = window.requestAnimationFrame(() => {
        const rect = section.getBoundingClientRect();
        const nx = (event.clientX - rect.left) / rect.width - 0.5;
        const ny = (event.clientY - rect.top) / rect.height - 0.5;
        scenes.style.setProperty('--parallax-x', `${(-nx * 18).toFixed(1)}px`);
        scenes.style.setProperty('--parallax-y', `${(-ny * 12).toFixed(1)}px`);
      });
    };

    section.addEventListener('pointermove', onMove);
    return () => {
      section.removeEventListener('pointermove', onMove);
      window.cancelAnimationFrame(rafRef.current);
    };
  }, [reduce]);

  return (
    <section id="scene-1" className="hero" ref={sectionRef}>
      <div className="hero__scenes" ref={scenesRef} aria-hidden="true">
        {SCENE_SOURCES.map((src, index) => (
          <img
            key={src}
            src={src}
            alt=""
            className={`hero__scene ${index === active ? 'hero__scene--active' : ''}`}
            draggable="false"
          />
        ))}
        <div className="hero__grade" />
      </div>

      <motion.div
        className="hero__foot"
        initial={reduce ? false : { opacity: 0, y: 26 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
      >
        <h1 className="hero__tagline">
          <span ref={taglineRef} className="hero__tagline-proximity">
            <VariableProximity
              label={t.hero.tagline}
              containerRef={taglineRef}
              fromFontVariationSettings="'wght' 480, 'opsz' 40"
              toFontVariationSettings="'wght' 780, 'opsz' 144"
              radius={130}
              falloff="exponential"
            />
          </span>
        </h1>

        <div className="hero__switcher btn-glass" role="group" aria-label={t.hero.switcherLabel}>
          {t.hero.scenes.map((scene, index) => (
            <button
              key={scene.id}
              type="button"
              className={`hero__switch ${index === active ? 'hero__switch--active' : ''}`}
              onClick={() => switchScene(index)}
              aria-pressed={index === active}
            >
              {scene.label}
            </button>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
