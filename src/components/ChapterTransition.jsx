import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'motion/react';
import walkFrame0 from '../assets/scenes/character-walk-aligned-0.webp';
import walkFrame1 from '../assets/scenes/character-walk-aligned-1.webp';
import walkFrame2 from '../assets/scenes/character-walk-aligned-2.webp';
import walkFrame3 from '../assets/scenes/character-walk-aligned-3.webp';
import { CHAPTER_TRANSITION_EVENT, isSafeChapterSelector } from '../lib/chapterTransition';
import './ChapterTransition.css';

const TRANSITION_DURATION = 900;
const TRAVEL_DELAY = Math.round(TRANSITION_DURATION * 0.62);
const REDUCED_DURATION = 180;
const WALK_FRAMES = [walkFrame0, walkFrame1, walkFrame2, walkFrame3];
function focusChapterDestination(targetSelector) {
  const destination = document.querySelector(targetSelector);
  const focusTarget = destination?.querySelector('h1, h2, h3') ?? destination;
  if (!focusTarget) return;
  if (!focusTarget.hasAttribute('tabindex')) focusTarget.setAttribute('tabindex', '-1');
  focusTarget.focus({ preventScroll: true });
}

export default function ChapterTransition({ onTravel }) {
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
      const targetSelector = event.detail;
      if (!isSafeChapterSelector(targetSelector) || activeRef.current) return;

      const reduced = reduceRef.current;
      activeRef.current = true;
      travelledRef.current = false;
      setActive({ targetSelector, reduced });

      const travel = () => {
        if (!activeRef.current || travelledRef.current) return;
        travelledRef.current = true;
        onTravelRef.current?.(targetSelector, { immediate: reduced });
        focusChapterDestination(targetSelector);
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

    window.addEventListener(CHAPTER_TRANSITION_EVENT, onStart);
    return () => {
      window.removeEventListener(CHAPTER_TRANSITION_EVENT, onStart);
      clearTimers();
      activeRef.current = false;
      travelledRef.current = false;
    };
  }, []);

  if (!active) return null;

  return (
    <div
      className={`chapter-transition${active.reduced ? ' chapter-transition--reduced' : ''}`}
      aria-hidden="true"
      data-target={active.targetSelector}
    >
      <div className="chapter-transition__backdrop" />
      {!active.reduced && (
        <div className="chapter-transition__walker">
          {WALK_FRAMES.map((source, index) => (
            <img
              key={source}
              src={source}
              alt=""
              className="chapter-transition__walker-frame"
              draggable="false"
              style={{ animationDelay: `${index * 80}ms` }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
