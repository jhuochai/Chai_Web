import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import LiquidEther from './LiquidEther';
import { useLanguage } from '../i18n/LanguageContext';
import { scrollToScene } from '../lib/scrollToScene';
import starryScene from '../assets/scenes/hero-work-tree-shadow.webp';
import daylightScene from '../assets/scenes/career-tree-day-factory-v2.webp';
import nightScene from '../assets/scenes/career-tree-night-factory.webp';
import './Hero.css';

// Order matches content.hero.scenes (starry / day / night).
const SCENE_SOURCES = [starryScene, daylightScene, nightScene];
const CROSSFADE_MS = 1000;

// The fluid takes its palette from the artwork it floats over: warm
// moon-gold over the starry city, mossy daylight golds over the day
// tree, violet-and-bloom golds over the night tree.
const FLUID_PALETTES = [
  ['#e0bc6a', '#f4e3b2', '#3fc1d6'],
  ['#6e8b3d', '#c9a24b', '#ede3d0'],
  ['#e0bc6a', '#8b7bd8', '#3fc1d6'],
];

/**
 * Cinematic glass-window hero: the key visuals sit behind a huge
 * liquid-glass pane, a WebGL fluid layer (LiquidEther) swirls
 * gold/cyan wisps after the cursor, and the scene switches when the
 * pointer rests on one of the two-character labels below the tagline.
 * One brush-script line of text, nothing else.
 */
export default function Hero() {
  const reduce = useReducedMotion();
  const { lang, t } = useLanguage();
  const [active, setActive] = useState(0);
  const coolingRef = useRef(false);
  const scenesRef = useRef(null);
  const sectionRef = useRef(null);
  const rafRef = useRef(0);

  const switchScene = (index) => {
    if (index === active || coolingRef.current) return;
    coolingRef.current = true;
    setActive(index);
    window.setTimeout(() => {
      coolingRef.current = false;
    }, CROSSFADE_MS);
  };

  // Hover previews the scene; click travels to the matching chapter.
  const goToScene = (scene) => {
    if (scene.mode) {
      window.dispatchEvent(new CustomEvent('career-tree:mode', { detail: scene.mode }));
    }
    scrollToScene(scene.target, { immediate: reduce });
  };

  // Soft parallax: the scene leans a few pixels toward the pointer.
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
        scenes.style.setProperty('--parallax-x', `${(-nx * 16).toFixed(1)}px`);
        scenes.style.setProperty('--parallax-y', `${(-ny * 10).toFixed(1)}px`);
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
      <div className="hero__window">
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
        </div>

        {!reduce && (
          <LiquidEther
            key={active}
            className="hero__fluid"
            colors={FLUID_PALETTES[active]}
            mouseForce={18}
            cursorSize={90}
            resolution={0.5}
            autoDemo
            autoSpeed={0.35}
            autoIntensity={1.8}
            takeoverDuration={0.25}
            autoResumeDelay={3000}
            autoRampDuration={0.6}
          />
        )}

        <div className="hero__grade" aria-hidden="true" />
        <div className="hero__shine" aria-hidden="true" />

        <motion.div
          className="hero__foot"
          initial={reduce ? false : { opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
        >
          <h1 className={`hero__tagline ${lang === 'en' ? 'hero__tagline--latin' : ''}`}>
            {t.hero.tagline}
          </h1>

          <div className="hero__menu" role="group" aria-label={t.hero.switcherLabel}>
            {t.hero.scenes.map((scene, index) => (
              <button
                key={scene.id}
                type="button"
                className={`hero__menu-item ${index === active ? 'hero__menu-item--active' : ''}`}
                onMouseEnter={() => switchScene(index)}
                onFocus={() => switchScene(index)}
                onClick={() => goToScene(scene)}
                aria-pressed={index === active}
              >
                <span className="hero__menu-label">{scene.label}</span>
                <span className="hero__menu-marquee" aria-hidden="true">
                  <span className="hero__menu-track">
                    {Array.from({ length: 12 }, () => scene.label).join(' · ')}
                  </span>
                </span>
              </button>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
