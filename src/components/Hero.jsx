import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'motion/react';
import { useLanguage } from '../i18n/LanguageContext';
import { navigateToRoute } from '../lib/siteRoute';
import { playStationTransition } from '../lib/chapterTransition';
import observatoryScene from '../assets/scenes/hero-observatory.webp';
import characterBack from '../assets/scenes/hero-character-back.webp';
import './Hero.css';

const interfaceCopy = {
  en: {
    title: 'Chai Yi Chen captain cockpit',
    consoleLabel: 'Flight controls · choose a station',
    approachLabel: 'Cockpit approach',
    approachNear: 'Move closer to the controls',
    approachBack: 'Step back to the captain',
    labStatus: 'The AI lab is being prepared. New experiments will appear here soon.',
    binLabel: 'Discarded drafts archive',
    binHint: 'Open the making-of archive',
  },
  zh: {
    title: '柴怡辰艦長駕駛艙',
    consoleLabel: '航行操作台 · 選擇站點',
    approachLabel: '駕駛艙距離',
    approachNear: '靠近操作台',
    approachBack: '退回艦長身後',
    labStatus: 'AI 實驗艙正在整備中；新的探索很快會在這裡出現。',
    binLabel: '廢棄草稿檔案桶',
    binHint: '開啟製作過程檔案',
  },
};

const clampApproach = (value) => Math.max(0, Math.min(1, value));
const POINTER_GESTURE_THRESHOLD = 36;

export default function Hero({ onTravel = playStationTransition }) {
  const reduce = useReducedMotion();
  const { lang, t } = useLanguage();
  const copy = interfaceCopy[lang];
  const [showLabStatus, setShowLabStatus] = useState(false);
  const [approach, setApproach] = useState(reduce ? 1 : 0);
  const cockpitRef = useRef(null);
  const approachRef = useRef(approach);
  const pointerGestureRef = useRef(null);

  useEffect(() => {
    const next = reduce ? 1 : 0;
    approachRef.current = next;
    setApproach(next);
  }, [reduce]);

  useEffect(() => {
    if (reduce) return undefined;
    const cockpit = cockpitRef.current;
    if (!cockpit) return undefined;

    const onWheel = (event) => {
      if (!event.deltaY) return;
      const direction = event.deltaY < 0 ? 1 : -1;
      const next = clampApproach(approachRef.current + direction);
      if (next === approachRef.current) return;
      event.preventDefault();
      approachRef.current = next;
      setApproach(next);
    };

    const clearPointerGesture = () => {
      pointerGestureRef.current = null;
    };

    const consumePointerGesture = (event) => {
      const gesture = pointerGestureRef.current;
      if (!gesture || gesture.pointerId !== event.pointerId) return;
      if (gesture.consumed) {
        event.preventDefault();
        return;
      }
      const distance = event.clientY - gesture.startY;
      if (Math.abs(distance) < POINTER_GESTURE_THRESHOLD) return;
      const next = clampApproach(approachRef.current + (distance < 0 ? 1 : -1));
      if (next === approachRef.current) return;
      event.preventDefault();
      gesture.consumed = true;
      approachRef.current = next;
      setApproach(next);
    };

    const onPointerDown = (event) => {
      if (event.isPrimary === false && event.pointerType) return;
      pointerGestureRef.current = { pointerId: event.pointerId, startY: event.clientY, consumed: false };
      cockpit.setPointerCapture?.(event.pointerId);
    };

    const onPointerMove = (event) => consumePointerGesture(event);

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
      clearPointerGesture();
    };
  }, [reduce]);

  const setCockpitApproach = (next) => {
    const clamped = clampApproach(next);
    approachRef.current = clamped;
    setApproach(clamped);
  };

  const activateEntry = (entry) => {
    if (entry.status === 'coming-soon') {
      setShowLabStatus(true);
      return;
    }
    onTravel(entry.target);
  };

  return (
    <section id="scene-1" className="hero" aria-labelledby="hero-title">
      <h1 id="hero-title" className="visually-hidden">{copy.title}</h1>
      <div
        ref={cockpitRef}
        className="hero__cockpit"
        data-approach={approach}
        style={{ '--approach': approach }}
      >
        <div className="hero__window" aria-hidden="true">
          <img className="hero__scene" src={observatoryScene} alt="" draggable="false" />
          <span className="hero__glass-reflection" />
          <span className="hero__window-rivets" />
        </div>
        <div className="hero__window-frame" aria-hidden="true" />

        <img
          className={`hero__captain hero__captain--${approach ? 'near' : 'initial'}`}
          src={characterBack}
          alt=""
          aria-hidden="true"
          draggable="false"
        />
        <div className="hero__contact-shadow" aria-hidden="true" />

        <nav className="hero__control-desk" aria-label={t.hero.switcherLabel}>
          <div className="hero__desk-top" aria-hidden="true">
            <span className="hero__lamp hero__lamp--cyan" />
            <span className="hero__lamp hero__lamp--violet" />
            <span className="hero__slot" />
          </div>
          <p className="hero__console-label">{copy.consoleLabel}</p>
          <div className="hero__controls">
            {t.hero.entries.map((entry) => (
              <button
                key={entry.id}
                type="button"
                className={`hero__destination hero__destination--${entry.id}`}
                onClick={() => activateEntry(entry)}
                aria-expanded={entry.status === 'coming-soon' ? showLabStatus : undefined}
                aria-controls={entry.status === 'coming-soon' ? 'hero-lab-status' : undefined}
              >
                <span className="hero__control-shape" aria-hidden="true" />
                <span>{entry.label}</span>
              </button>
            ))}
          </div>
          <div className="hero__approach-controls" role="group" aria-label={copy.approachLabel}>
            <button type="button" onClick={() => setCockpitApproach(0)} disabled={approach === 0}>
              {copy.approachBack}
            </button>
            <button type="button" onClick={() => setCockpitApproach(1)} disabled={approach === 1}>
              {copy.approachNear}
            </button>
          </div>
          {showLabStatus && <p id="hero-lab-status" className="hero__lab-status" role="status">{copy.labStatus}</p>}
        </nav>

        <button
          type="button"
          className="hero__trash-bin"
          aria-label={copy.binLabel}
          onClick={() => navigateToRoute('/making-of')}
        >
          <span className="hero__trash-lid" aria-hidden="true" />
          <svg className="hero__trash-graffiti" viewBox="0 0 50 48" aria-hidden="true">
            <path d="M11 27c0-11 8-18 15-18s14 7 14 18c0 9-6 15-14 15S11 36 11 27Z" />
            <path d="M15 21 7 15m28 6 8-6M19 28h1m12 0h1M21 35c3 2 6 2 9 0" />
            <circle cx="20" cy="28" r="2" /><circle cx="31" cy="28" r="2" />
          </svg>
          <span className="hero__trash-hint">{copy.binHint}</span>
        </button>
      </div>
    </section>
  );
}
