import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X } from '@phosphor-icons/react';
import { acquireBodyScrollLock } from '../../lib/bodyScrollLock';

export default function LabPanel({ open, title, onClose, children, returnFocusTo }) {
  const panelRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const release = acquireBodyScrollLock();
    panelRef.current?.focus();
    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
      }
      if (event.key !== 'Tab') return;
      const controls = Array.from(panelRef.current?.querySelectorAll('button:not([disabled]),a[href]') ?? []);
      if (!controls.length) return;
      const first = controls[0];
      const last = controls.at(-1);
      if (event.shiftKey && document.activeElement === first) {
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
      release();
      window.setTimeout(() => returnFocusTo?.current?.focus?.(), 0);
    };
  }, [open, onClose, returnFocusTo]);

  if (!open) return null;
  return createPortal(
    <div className="lab-panel" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section ref={panelRef} className="lab-panel__body" role="dialog" aria-modal="true" aria-label={title} tabIndex="-1">
        <header><p>LAB RECORD</p><h2>{title}</h2></header>
        <button type="button" className="lab-panel__close" aria-label={`Close ${title}`} onClick={onClose}><X size={18} aria-hidden="true" /></button>
        <div className="lab-panel__content">{children}</div>
      </section>
    </div>,
    document.body
  );
}
