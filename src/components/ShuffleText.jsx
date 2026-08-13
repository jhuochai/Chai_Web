import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'motion/react';
import './ShuffleText.css';

const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789<>/\\|*+-=';
const STEP_MS = 70;
const RUN_MS = 490;

function shuffledText(text, step) {
  return Array.from(text, (character, index) => {
    if (/\s/u.test(character)) return character;
    return GLYPHS[(index + step * 7) % GLYPHS.length];
  }).join('');
}

export default function ShuffleText({ text, active, onComplete, className = '' }) {
  const reduce = useReducedMotion();
  const [display, setDisplay] = useState('');
  const timerRef = useRef(null);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    window.clearTimeout(timerRef.current);
    if (!active || reduce) {
      setDisplay(text);
      if (active) onCompleteRef.current?.();
      return undefined;
    }

    let step = 0;
    const tick = () => {
      step += 1;
      if (step * STEP_MS >= RUN_MS) {
        setDisplay(text);
        onCompleteRef.current?.();
        return;
      }
      setDisplay(shuffledText(text, step));
      timerRef.current = window.setTimeout(tick, STEP_MS);
    };

    tick();
    return () => window.clearTimeout(timerRef.current);
  }, [active, reduce, text]);

  return (
    <span className={`shuffle-text ${className}`.trim()}>
      <span className="shuffle-text__accessible">{text}</span>
      <span className="shuffle-text__visual" aria-hidden="true">{display}</span>
    </span>
  );
}
