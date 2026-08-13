import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'motion/react';
import walkFrame0 from '../assets/scenes/character-walk-aligned-0.webp';
import walkFrame1 from '../assets/scenes/character-walk-aligned-1.webp';
import walkFrame2 from '../assets/scenes/character-walk-aligned-2.webp';
import walkFrame3 from '../assets/scenes/character-walk-aligned-3.webp';
import { getStationByRoute } from '../data/stations';
import { useLanguage } from '../i18n/LanguageContext';
import { STATION_TRANSITION_EVENT, isSafeStationPathname } from '../lib/chapterTransition';
import ShuffleText from './ShuffleText';
import './ChapterTransition.css';

const TRANSITION_DURATION = 900;
const TRAVEL_DELAY = Math.round(TRANSITION_DURATION * 0.62);
const REDUCED_DURATION = 180;
const WALK_FRAMES = [walkFrame0, walkFrame1, walkFrame2, walkFrame3];

export default function ChapterTransition({ onTravel }) {
  const { lang } = useLanguage();
  const reduce = useReducedMotion();
  const [active, setActive] = useState(null);
  const activeRef = useRef(false);
  const travelledRef = useRef(false);
  const timersRef = useRef(new Set());
  const onTravelRef = useRef(onTravel);
  const reduceRef = useRef(Boolean(reduce));

  onTravelRef.current = onTravel;
  reduceRef.current = Boolean(reduce);

  useEffect(() => {
    const clearTimers = () => {
      for (const timer of timersRef.current) window.clearTimeout(timer);
      timersRef.current.clear();
    };
    const schedule = (callback, delay) => {
      const timer = window.setTimeout(() => {
        timersRef.current.delete(timer);
        callback();
      }, delay);
      timersRef.current.add(timer);
    };
    const onStart = (event) => {
      const pathname = event.detail;
      if (!isSafeStationPathname(pathname) || activeRef.current) return;
      const reduced = reduceRef.current;
      activeRef.current = true;
      travelledRef.current = false;
      setActive({ pathname, reduced });
      const travel = () => {
        if (!activeRef.current || travelledRef.current) return;
        travelledRef.current = true;
        onTravelRef.current?.(pathname, { immediate: reduced });
      };
      const finish = () => {
        activeRef.current = false;
        setActive(null);
      };
      if (reduced) {
        travel();
        schedule(finish, REDUCED_DURATION);
        return;
      }
      schedule(travel, TRAVEL_DELAY);
      schedule(finish, TRANSITION_DURATION);
    };
    window.addEventListener(STATION_TRANSITION_EVENT, onStart);
    return () => {
      window.removeEventListener(STATION_TRANSITION_EVENT, onStart);
      clearTimers();
      activeRef.current = false;
      travelledRef.current = false;
    };
  }, []);

  if (!active) return null;
  const station = getStationByRoute(active.pathname);
  const destinationName = station?.[lang] ?? station?.en;

  return (
    <div className={`chapter-transition${active.reduced ? ' chapter-transition--reduced' : ''}`} aria-hidden="true" data-target={active.pathname}>
      <div className="chapter-transition__backdrop" />
      <div className="chapter-transition__frame" />
      {!active.reduced && (
        <div className="chapter-transition__walker">
          <div className="chapter-transition__walker-shadow" />
          {WALK_FRAMES.map((source, index) => (
            <img key={source} src={source} alt="" className="chapter-transition__walker-frame" draggable="false" style={{ animationDelay: `${index * 80}ms` }} />
          ))}
        </div>
      )}
      <p className="chapter-transition__arrival"><ShuffleText text={destinationName} active={!active.reduced} /></p>
    </div>
  );
}
