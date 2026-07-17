import { useEffect, useRef } from 'react';
import { useReducedMotion } from 'motion/react';
import characterLean from '../assets/scenes/character-lean.webp';
import characterRibbon from '../assets/scenes/character-ribbon.webp';
import './FloatingCompanion.css';

/**
 * The site-wide companion: the gunner leaning at the right edge of the
 * viewport, her ribbon on its own layer so it can drift on an idle sway
 * and lean toward the cursor when it comes near. Pure decoration —
 * pointer-events pass straight through.
 */
export default function FloatingCompanion() {
  const reduce = useReducedMotion();
  const rootRef = useRef(null);
  const rafRef = useRef(0);

  useEffect(() => {
    if (reduce) return undefined;
    const root = rootRef.current;
    if (!root) return undefined;

    const onMove = (event) => {
      window.cancelAnimationFrame(rafRef.current);
      rafRef.current = window.requestAnimationFrame(() => {
        const rect = root.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = event.clientX - cx;
        const dy = event.clientY - cy;
        const dist = Math.hypot(dx, dy);
        // Sway grows as the cursor comes closer (full effect inside ~150px,
        // fading out to nothing beyond ~600px).
        const proximity = Math.max(0, Math.min(1, 1 - (dist - 150) / 450));
        // Small amplitude on purpose: the body art carries a painted copy
        // of the same scarf, so a big offset would read as a double image.
        const rot = Math.max(-4, Math.min(4, dx / 70)) * proximity;
        root.style.setProperty('--ribbon-rot', `${rot}deg`);
        root.style.setProperty('--ribbon-x', `${rot * 0.6}px`);
      });
    };

    window.addEventListener('mousemove', onMove);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.cancelAnimationFrame(rafRef.current);
    };
  }, [reduce]);

  return (
    <div ref={rootRef} className="floating-companion" aria-hidden="true">
      <img src={characterLean} alt="" className="floating-companion__body" draggable="false" />
      <div className="floating-companion__ribbon-wrap">
        <img src={characterRibbon} alt="" className="floating-companion__ribbon" draggable="false" />
      </div>
    </div>
  );
}
