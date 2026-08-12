import { useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { X } from '@phosphor-icons/react';
import './CareerRibbonSheet.css';

const FOCUSABLE = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

function pullThreshold() {
  return Math.min(120, window.innerHeight * 0.16);
}

export default function CareerRibbonSheet({ item, open, onOpen, onClose, triggerRef }) {
  const reduce = useReducedMotion();
  const panelRef = useRef(null);
  const dragRef = useRef(null);
  const onOpenRef = useRef(onOpen);
  const onCloseRef = useRef(onClose);
  const [hintVisible, setHintVisible] = useState(false);
  const [ready, setReady] = useState(false);
  const hintId = useId();

  onOpenRef.current = onOpen;
  onCloseRef.current = onClose;

  useEffect(() => {
    const trigger = triggerRef?.current;
    if (!trigger) return undefined;

    trigger.setAttribute('aria-describedby', hintId);

    const resetPull = () => {
      dragRef.current = null;
      setReady(false);
      trigger.classList.remove('is-pulling');
      trigger.style.setProperty('--ribbon-pull', '0px');
    };

    const onPointerDown = (event) => {
      if (event.button != null && event.button !== 0) return;
      dragRef.current = {
        pointerId: event.pointerId,
        startY: event.clientY,
        distance: 0,
      };
      setHintVisible(true);
      trigger.classList.add('is-pulling');
    };

    const onPointerMove = (event) => {
      const drag = dragRef.current;
      if (!drag || (drag.pointerId != null && event.pointerId !== drag.pointerId)) return;
      event.preventDefault();
      drag.distance = Math.max(0, event.clientY - drag.startY);
      trigger.style.setProperty('--ribbon-pull', `${Math.min(drag.distance, 144)}px`);
      setReady(drag.distance >= pullThreshold());
    };

    const onPointerUp = (event) => {
      const drag = dragRef.current;
      if (!drag || (drag.pointerId != null && event.pointerId !== drag.pointerId)) return;
      const shouldOpen = drag.distance >= pullThreshold();
      resetPull();
      if (shouldOpen) onOpenRef.current();
    };

    const onPointerCancel = (event) => {
      const drag = dragRef.current;
      if (!drag || (drag.pointerId != null && event.pointerId !== drag.pointerId)) return;
      resetPull();
    };

    const onKeyDown = (event) => {
      if (event.key !== 'Enter' && event.key !== ' ') return;
      event.preventDefault();
      onOpenRef.current();
    };

    const onFocus = () => setHintVisible(true);
    const onBlur = () => setHintVisible(false);
    const onClick = (event) => {
      if (event.detail > 0) setHintVisible(true);
    };

    trigger.addEventListener('pointerdown', onPointerDown);
    trigger.addEventListener('keydown', onKeyDown);
    trigger.addEventListener('focus', onFocus);
    trigger.addEventListener('blur', onBlur);
    trigger.addEventListener('click', onClick);
    window.addEventListener('pointermove', onPointerMove, { passive: false });
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('pointercancel', onPointerCancel);

    return () => {
      resetPull();
      trigger.removeAttribute('aria-describedby');
      trigger.removeEventListener('pointerdown', onPointerDown);
      trigger.removeEventListener('keydown', onKeyDown);
      trigger.removeEventListener('focus', onFocus);
      trigger.removeEventListener('blur', onBlur);
      trigger.removeEventListener('click', onClick);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointercancel', onPointerCancel);
    };
  }, [hintId, triggerRef]);

  useEffect(() => {
    if (!open) return undefined;

    const trigger = triggerRef?.current;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    panelRef.current?.querySelector(FOCUSABLE)?.focus();

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onCloseRef.current();
        return;
      }
      if (event.key !== 'Tab') return;

      const focusable = Array.from(panelRef.current?.querySelectorAll(FOCUSABLE) ?? []);
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable.at(-1);

      if (focusable.length === 1) {
        event.preventDefault();
        first.focus();
      } else if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
      trigger?.focus();
    };
  }, [open, triggerRef]);

  if (typeof document === 'undefined') return null;

  return createPortal(
    <>
      {hintVisible && !open && (
        <p id={hintId} className={`career-ribbon-sheet__gesture-hint ${ready ? 'is-ready' : ''}`} role="status">
          {ready ? item.pullReady : item.dragHint}
        </p>
      )}

      <AnimatePresence>
        {open && (
          <motion.div
            className="career-ribbon-sheet"
            data-testid="career-ribbon-backdrop"
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduce ? undefined : { opacity: 0 }}
            transition={{ duration: reduce ? 0 : 0.24 }}
            onClick={(event) => {
              if (event.target === event.currentTarget) onCloseRef.current();
            }}
          >
            <motion.article
              ref={panelRef}
              className="career-ribbon-sheet__panel"
              role="dialog"
              aria-modal="true"
              aria-label={item.org}
              initial={reduce ? false : { y: '100%' }}
              animate={{ y: 0 }}
              exit={reduce ? undefined : { y: '100%' }}
              transition={{ duration: reduce ? 0 : 0.58, ease: [0.16, 1, 0.3, 1] }}
              onClick={(event) => event.stopPropagation()}
            >
              <button
                type="button"
                className="career-ribbon-sheet__close"
                onClick={() => onCloseRef.current()}
                aria-label={item.closeLabel}
              >
                <X size={22} weight="light" aria-hidden="true" />
              </button>

              <div className="career-ribbon-sheet__content">
                <p className="career-ribbon-sheet__period">{item.period}</p>
                <h3>{item.org}</h3>
                <p className="career-ribbon-sheet__role">{item.role}</p>
                <p className="career-ribbon-sheet__summary">{item.summary}</p>
                <ul className="career-ribbon-sheet__points">
                  {item.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </div>
            </motion.article>
          </motion.div>
        )}
      </AnimatePresence>
    </>,
    document.body
  );
}
