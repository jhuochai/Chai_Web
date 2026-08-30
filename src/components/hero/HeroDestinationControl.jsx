import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'motion/react';
import './HeroControls.css';

export default function HeroDestinationControl({ className = '', entry, image, motion, enabled, busy = false, onActivate }) {
  const reduce = useReducedMotion();
  const timerRef = useRef(null);
  const [activeMotion, setActiveMotion] = useState('');
  const [imageFailed, setImageFailed] = useState(false);
  const baseImage = typeof image === 'string' ? image : image?.base;
  const movingImage = typeof image === 'string' ? image : image?.moving;
  const isArticulated = (motion === 'pull' || motion === 'push') && movingImage;

  useEffect(() => () => window.clearTimeout(timerRef.current), []);

  const activate = () => {
    if (!enabled || busy || activeMotion) return;
    if (reduce) {
      onActivate(entry);
      return;
    }
    setActiveMotion(motion);
    onActivate(entry);
    timerRef.current = window.setTimeout(() => {
      setActiveMotion('');
    }, 450);
  };

  return (
    <button
      type="button"
      className={`hero-control hero-control--${entry.id} ${className}`.trim()}
      aria-label={entry.label}
      disabled={!enabled || busy}
      data-motion={activeMotion || undefined}
      onClick={activate}
    >
      <span className="hero-control__well" aria-hidden="true">
        {baseImage && !imageFailed ? (
          <>
            <img className="hero-control__image hero-control__image--base" src={baseImage} alt="" draggable="false" onError={() => setImageFailed(true)} />
            {isArticulated && (
              <img className="hero-control__image hero-control__image--moving" src={movingImage} alt="" draggable="false" onError={() => setImageFailed(true)} />
            )}
          </>
        ) : (
          <span className="hero-control__fallback" />
        )}
      </span>
      <span className="hero-control__label">{entry.label}</span>
    </button>
  );
}
