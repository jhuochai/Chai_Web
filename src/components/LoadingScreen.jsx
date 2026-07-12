import { useEffect, useState } from 'react';
import { useReducedMotion } from 'motion/react';
import { useLanguage } from '../i18n/LanguageContext';
import './LoadingScreen.css';

/**
 * Branded splash shown once on first load. Not gated on the hero video
 * (there isn't a real one yet) - just a tasteful minimum-display window
 * so the entrance doesn't flash. Once a real hero video is in place this
 * can additionally wait on its `canplay` event.
 */
export default function LoadingScreen({ onDone }) {
  const { t } = useLanguage();
  const reduce = useReducedMotion();
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const minDuration = reduce ? 250 : 1100;
    const timer = window.setTimeout(() => setHidden(true), minDuration);
    return () => window.clearTimeout(timer);
  }, [reduce]);

  useEffect(() => {
    if (!hidden) return undefined;
    const fadeDuration = reduce ? 0 : 500;
    const timer = window.setTimeout(() => onDone?.(), fadeDuration);
    return () => window.clearTimeout(timer);
  }, [hidden, reduce, onDone]);

  return (
    <div className={`loading-screen ${hidden ? 'loading-screen--hidden' : ''}`} aria-hidden={hidden}>
      <div className="loading-screen__mark">
        <span>{t.name.display}</span>
        <span className="loading-screen__sub">{t.name.sub}</span>
      </div>
      <div className="loading-screen__bar">
        <span />
      </div>
    </div>
  );
}
