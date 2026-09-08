import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'motion/react';
import closedDoor from '../assets/scenes/transit-door-closed.webp';
import corridor from '../assets/scenes/transit-corridor.webp';
import { getStationByRoute } from '../data/stations';
import { useLanguage } from '../i18n/LanguageContext';
import { STATION_TRANSITION_EVENT, isSafeStationPathname } from '../lib/chapterTransition';
import { preloadImages } from '../lib/sceneReady';
import { acquireBodyScrollLock } from '../lib/bodyScrollLock';
import './ChapterTransition.css';

export default function ChapterTransition({ onTravel, onComplete, onActiveChange }) {
  const { lang } = useLanguage();
  const reduce = useReducedMotion();
  const [active, setActive] = useState(null);
  const latest = useRef({ onTravel, onComplete, onActiveChange, reduce });
  latest.current = { onTravel, onComplete, onActiveChange, reduce };

  useEffect(() => {
    const lifetime = new AbortController();
    const artworkReady = preloadImages([closedDoor, corridor], { signal: lifetime.signal });
    let journey = null;
    let unlock = null;
    const timers = new Map();
    const delay = (ms) => new Promise((resolve) => {
      const timer = window.setTimeout(() => { timers.delete(timer); resolve(); }, ms);
      timers.set(timer, resolve);
    });
    const onStart = async (event) => {
      const pathname = event.detail;
      if (!isSafeStationPathname(pathname) || journey) return;
      const reduced = Boolean(latest.current.reduce);
      const controller = new AbortController();
      journey = controller;
      unlock = acquireBodyScrollLock();
      latest.current.onActiveChange?.(true);
      setActive({ pathname, reduced, phase: 'closed' });
      if (!reduced) await delay(180);
      if (controller.signal.aborted) return;
      try {
        await Promise.all([
          artworkReady,
          latest.current.onTravel?.(pathname, { immediate: reduced, signal: controller.signal }),
          delay(reduced ? 0 : 220),
        ]);
      } catch {
        // Resource failures must not leave navigation locked.
      }
      if (controller.signal.aborted) return;
      if (!reduced) {
        setActive({ pathname, reduced, phase: 'opening' });
        await delay(1000);
      }
      if (controller.signal.aborted) return;
      setActive({ pathname, reduced, phase: 'exiting' });
      await delay(reduced ? 180 : 260);
      if (controller.signal.aborted) return;
      setActive(null);
      unlock?.();
      unlock = null;
      journey = null;
      latest.current.onActiveChange?.(false);
      latest.current.onComplete?.(pathname);
    };
    window.addEventListener(STATION_TRANSITION_EVENT, onStart);
    return () => {
      lifetime.abort();
      journey?.abort();
      window.removeEventListener(STATION_TRANSITION_EVENT, onStart);
      for (const [timer, resolve] of timers) { window.clearTimeout(timer); resolve(); }
      timers.clear();
      unlock?.();
    };
  }, []);

  if (!active) return null;
  const station = getStationByRoute(active.pathname);
  const name = station?.[lang] ?? station?.en;
  const loading = lang === 'zh' ? '正在準備艙室' : 'Preparing the next station';
  const entering = lang === 'zh' ? '艙門開啟' : 'Door opening';

  return (
    <div className={`chapter-transition chapter-transition--${active.phase}${active.reduced ? ' chapter-transition--reduced' : ''}`} data-target={active.pathname} data-phase={active.phase}>
      <div className="chapter-transition__scene" aria-hidden="true">
        <img className="chapter-transition__corridor" src={corridor} alt="" draggable="false" />
        {/* Fixed frame and rotating leaf use the same approved image. */}
        <img className="chapter-transition__surround" src={closedDoor} alt="" draggable="false" />
        <div className="chapter-transition__hinge">
          <img className="chapter-transition__leaf" src={closedDoor} alt="" draggable="false" />
        </div>
      </div>
      <p className="chapter-transition__arrival" role="status" aria-live="polite">
        <span>{name}</span>
        <span>{active.phase === 'closed' ? loading : entering}</span>
      </p>
    </div>
  );
}
