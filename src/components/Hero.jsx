import { useEffect, useRef } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import FramedPanel from './FramedPanel';
import VariableProximity from './VariableProximity';
import { useLanguage } from '../i18n/LanguageContext';
import './Hero.css';

const nameRise = {
  hidden: { opacity: 0, y: 22 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, delay: 0.25 + i * 0.12, ease: [0.16, 1, 0.3, 1] },
  }),
};

const FADE_MS = 500;
const FADE_OUT_THRESHOLD_S = 0.55;
const LOOP_RESTART_DELAY_MS = 100;

export default function Hero() {
  const reduce = useReducedMotion();
  const { lang, t } = useLanguage();

  const videoRef = useRef(null);
  const nameWrapRef = useRef(null);
  const rafIdRef = useRef(null);
  const opacityRef = useRef(0);
  const fadingOutRef = useRef(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return undefined;

    const animateOpacity = (to, duration) => {
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
      const from = opacityRef.current;
      const start = performance.now();
      const step = (now) => {
        const elapsed = now - start;
        const progress = duration === 0 ? 1 : Math.min(elapsed / duration, 1);
        const value = from + (to - from) * progress;
        opacityRef.current = value;
        video.style.opacity = String(value);
        rafIdRef.current = progress < 1 ? requestAnimationFrame(step) : null;
      };
      rafIdRef.current = requestAnimationFrame(step);
    };

    const handlePlaying = () => {
      fadingOutRef.current = false;
      animateOpacity(1, FADE_MS);
    };

    const handleTimeUpdate = () => {
      if (fadingOutRef.current) return;
      if (!video.duration || Number.isNaN(video.duration)) return;
      const remaining = video.duration - video.currentTime;
      if (remaining <= FADE_OUT_THRESHOLD_S) {
        fadingOutRef.current = true;
        animateOpacity(0, FADE_MS);
      }
    };

    const handleEnded = () => {
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
      opacityRef.current = 0;
      video.style.opacity = '0';
      window.setTimeout(() => {
        video.currentTime = 0;
        video.play().catch(() => {});
      }, LOOP_RESTART_DELAY_MS);
    };

    video.addEventListener('playing', handlePlaying);
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('ended', handleEnded);

    return () => {
      video.removeEventListener('playing', handlePlaying);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('ended', handleEnded);
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    };
  }, []);

  return (
    <section id="hero" className="hero">
      <div className="hero__bg" aria-hidden="true">
        {/* TODO: drop the real hero clip in as /media/hero-loop.mp4 + .webm.
            The crossfade-loop above (playing / timeupdate / ended) picks it
            up automatically once a real source loads; loop is handled in
            JS on purpose (native loop never fires 'ended'). */}
        <video ref={videoRef} className="hero__video" autoPlay muted playsInline style={{ opacity: 0 }}>
          <source src="/media/hero-loop.webm" type="video/webm" />
          <source src="/media/hero-loop.mp4" type="video/mp4" />
        </video>
        <div className="hero__fog" />
        <div className="hero__scrim" />
      </div>

      <div className="hero__content container">
        <FramedPanel as="div" variant="corners" className="hero__nameplate">
          <motion.div
            initial={reduce ? false : 'hidden'}
            animate="show"
            variants={{ show: { transition: { staggerChildren: 0.08 } } }}
          >
            <motion.p className="hero__title eyebrow" variants={nameRise} custom={0}>
              {t.title}
            </motion.p>
            <motion.h1
              className={`hero__name ${lang === 'en' ? 'hero__name--latin' : ''}`}
              variants={nameRise}
              custom={1}
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
            <motion.p className="hero__name-en" variants={nameRise} custom={2}>
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
      </div>
    </section>
  );
}
