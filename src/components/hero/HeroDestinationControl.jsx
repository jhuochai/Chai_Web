import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'motion/react';
import './HeroControls.css';

export default function HeroDestinationControl({ entry, image, motion, enabled, busy = false, onActivate }) {
  const reduce = useReducedMotion();
  const timerRef = useRef(null);
  const [activeMotion, setActiveMotion] = useState('');
  const [imageFailed, setImageFailed] = useState(false);

  useEffect(() => () => window.clearTimeout(timerRef.current), []);

  const activate = () => {
    if (!enabled || busy || activeMotion) return;
    if (reduce) {
      onActivate(entry);
      return;
    }
    setActiveMotion(motion);
    timerRef.current = window.setTimeout(() => {
      setActiveMotion('');
      onActivate(entry);
    }, 450);
  };

  return (
    <button
      type="button"
      className={`hero-control hero-control--${entry.id}`}
      aria-label={entry.label}
      disabled={!enabled || busy}
      data-motion={activeMotion || undefined}
      onClick={activate}
    >
      <span className="hero-control__well" aria-hidden="true">
        {image && !imageFailed ? (
          <img src={image} alt="" draggable="false" onError={() => setImageFailed(true)} />
        ) : (
          <span className="hero-control__fallback" />
        )}
      </span>
      <span className="hero-control__label">{entry.label}</span>
    </button>
  );
}
