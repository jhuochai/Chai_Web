import { useCallback, useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'motion/react';
import { useLanguage } from '../i18n/LanguageContext';
import { navigateToRoute } from '../lib/siteRoute';
import { playStationTransition } from '../lib/chapterTransition';
import cockpitScene from '../assets/scenes/hero-cockpit-space.webp';
import characterBack from '../assets/scenes/hero-character-back.webp';
import handleImage from '../assets/props/hero-handle.webp';
import joystickImage from '../assets/props/hero-joystick.webp';
import knobImage from '../assets/props/hero-knob.webp';
import coreImage from '../assets/props/hero-ai-core.webp';
import trashImage from '../assets/props/hero-trash.webp';
import HeroDestinationControl from './hero/HeroDestinationControl';
import HeroHologram from './hero/HeroHologram';
import { getDestinationAction, getInitialHeroApproach, rememberHeroApproach } from './hero/heroState';
import './Hero.css';

const interfaceCopy = {
  en: {
    title: 'Chai Yi Chen captain cockpit',
    binLabel: 'Discarded drafts archive',
    binHint: 'Making-of archive',
  },
  zh: {
    title: '柴怡辰艦長駕駛艙',
    binLabel: '廢棄草稿檔案桶',
    binHint: '網站製作檔案',
  },
};

const controlImages = {
  intro: handleImage,
  career: joystickImage,
  portfolio: knobImage,
  'ai-lab': coreImage,
};

const clampApproach = (value) => Math.max(0, Math.min(1, value));
const POINTER_GESTURE_THRESHOLD = 36;

export default function Hero({ onTravel = playStationTransition }) {
  const reduce = useReducedMotion();
  const { lang, t } = useLanguage();
  const copy = interfaceCopy[lang];
  const [approach, setApproach] = useState(() => getInitialHeroApproach({ reduce, storage: window.sessionStorage }));
  const [hologramOpen, setHologramOpen] = useState(false);
  const cockpitRef = useRef(null);
  const approachRef = useRef(approach);
  const pointerGestureRef = useRef(null);

  const updateApproach = useCallback((next) => {
    const clamped = clampApproach(next);
    if (clamped === approachRef.current) return false;
    approachRef.current = clamped;
    setApproach(clamped);
    if (clamped === 1) rememberHeroApproach(window.sessionStorage);
    return true;
  }, []);

  useEffect(() => {
    if (reduce) updateApproach(1);
  }, [reduce, updateApproach]);

  useEffect(() => {
    if (reduce) return undefined;
    const cockpit = cockpitRef.current;
    if (!cockpit) return undefined;

    const onWheel = (event) => {
      if (!event.deltaY) return;
      const changed = updateApproach(approachRef.current + (event.deltaY < 0 ? 1 : -1));
      if (changed) event.preventDefault();
    };
    const clearPointerGesture = () => { pointerGestureRef.current = null; };
    const onPointerDown = (event) => {
      if (event.isPrimary === false && event.pointerType) return;
      pointerGestureRef.current = { pointerId: event.pointerId, startY: event.clientY, consumed: false };
      cockpit.setPointerCapture?.(event.pointerId);
    };
    const onPointerMove = (event) => {
      const gesture = pointerGestureRef.current;
      if (!gesture || gesture.pointerId !== event.pointerId) return;
      if (gesture.consumed) {
        event.preventDefault();
        return;
      }
      const distance = event.clientY - gesture.startY;
      if (Math.abs(distance) < POINTER_GESTURE_THRESHOLD) return;
      const changed = updateApproach(approachRef.current + (distance < 0 ? 1 : -1));
      if (!changed) return;
      gesture.consumed = true;
      event.preventDefault();
    };
    const onPointerUp = (event) => {
      if (pointerGestureRef.current?.pointerId === event.pointerId) clearPointerGesture();
      if (cockpit.hasPointerCapture?.(event.pointerId)) cockpit.releasePointerCapture?.(event.pointerId);
    };
    const onLostPointerCapture = (event) => {
      if (pointerGestureRef.current?.pointerId === event.pointerId) clearPointerGesture();
    };

    cockpit.addEventListener('wheel', onWheel, { passive: false });
    cockpit.addEventListener('pointerdown', onPointerDown);
    cockpit.addEventListener('pointermove', onPointerMove, { passive: false });
    cockpit.addEventListener('pointerup', onPointerUp);
    cockpit.addEventListener('pointercancel', clearPointerGesture);
    cockpit.addEventListener('lostpointercapture', onLostPointerCapture);
    window.addEventListener('blur', clearPointerGesture);
    return () => {
      cockpit.removeEventListener('wheel', onWheel);
      cockpit.removeEventListener('pointerdown', onPointerDown);
      cockpit.removeEventListener('pointermove', onPointerMove);
      cockpit.removeEventListener('pointerup', onPointerUp);
      cockpit.removeEventListener('pointercancel', clearPointerGesture);
      cockpit.removeEventListener('lostpointercapture', onLostPointerCapture);
      window.removeEventListener('blur', clearPointerGesture);
    };
  }, [reduce, updateApproach]);

  const activateEntry = (entry) => {
    const action = getDestinationAction(entry.id);
    if (action.kind === 'preview') setHologramOpen(true);
    else onTravel(action.target);
  };

  return (
    <section id="scene-1" className="hero" aria-labelledby="hero-title">
      <h1 id="hero-title" className="visually-hidden">{copy.title}</h1>
      <div ref={cockpitRef} className="hero__cockpit" data-approach={approach} style={{ '--approach': approach }}>
        <div className="hero__window" aria-hidden="true">
          <img className="hero__scene" src={cockpitScene} alt="" draggable="false" />
          <span className="hero__planet" />
          <span className="hero__glass-reflection" />
          <span className="hero__window-rivets" />
        </div>
        <div className="hero__window-frame" aria-hidden="true" />
        <span className="hero__approach-light" aria-hidden="true" />

        <img
          className={`hero__captain hero__captain--${approach ? 'near' : 'initial'}`}
          src={characterBack}
          alt=""
          aria-hidden="true"
          draggable="false"
        />
        <div className="hero__contact-shadow" aria-hidden="true" />

        <nav className="hero__control-desk" aria-label={t.hero.switcherLabel}>
          <div className="hero__desk-bezel" aria-hidden="true"><i /><i /><i /></div>
          <div className="hero__control-rail">
            {t.hero.entries.map((entry) => {
              const action = getDestinationAction(entry.id);
              return (
                <HeroDestinationControl
                  key={entry.id}
                  entry={entry}
                  image={approach ? controlImages[entry.id] : undefined}
                  motion={action.motion}
                  enabled={approach === 1}
                  onActivate={activateEntry}
                />
              );
            })}
          </div>
        </nav>

        <button
          type="button"
          className="hero__trash-bin"
          aria-label={copy.binLabel}
          disabled={approach === 0}
          onClick={() => navigateToRoute('/making-of')}
        >
          <img src={trashImage} alt="" draggable="false" aria-hidden="true" />
          <span className="hero__trash-hint">{copy.binHint}</span>
        </button>
      </div>
      <HeroHologram
        open={hologramOpen}
        onClose={() => setHologramOpen(false)}
        onEnter={() => onTravel('/ai-lab')}
      />
    </section>
  );
}
