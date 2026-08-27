import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { X } from '@phosphor-icons/react';
import InspectionDock from './InspectionDock';
import './CareerRibbonSheet.css';

const FOCUSABLE = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

export default function CareerRibbonSheet({ item, open, onClose, triggerRef, visual }) {
  const reduce = useReducedMotion();
  const panelRef = useRef(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

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

            <InspectionDock
              variant="ribbon"
              accent={visual?.accent}
              glow={visual?.glow}
              specimen={visual?.asset ? <img src={visual.asset} alt="" draggable="false" /> : null}
            >
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
            </InspectionDock>
          </motion.article>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
