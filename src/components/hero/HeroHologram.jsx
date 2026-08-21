import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X } from '@phosphor-icons/react';
import { useLanguage } from '../../i18n/LanguageContext';
import { acquireBodyScrollLock } from '../../lib/bodyScrollLock';
import './HeroControls.css';

const labels = {
  en: {
    preview: 'AI Lab preview',
    close: 'Close AI Lab preview',
    enter: 'Enter AI Lab',
    signals: ['Stapu online', 'Skills cabinet indexed', 'Incubation pod active'],
  },
  zh: {
    preview: 'AI 實驗艙預覽',
    close: '關閉 AI 實驗艙預覽',
    enter: '進入 AI 實驗艙',
    signals: ['史達普連線中', 'Skills 工具櫃已建檔', '孵化槽運作中'],
  },
};

export default function HeroHologram({ open, onClose, onEnter, openerRef }) {
  const { lang, t } = useLanguage();
  const dialogRef = useRef(null);
  const copy = labels[lang];

  useEffect(() => {
    if (!open) return undefined;
    const release = acquireBodyScrollLock();
    const previousFocus = openerRef?.current ?? document.activeElement;
    dialogRef.current?.focus();

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== 'Tab') return;
      const buttons = Array.from(dialogRef.current?.querySelectorAll('button') ?? []);
      if (!buttons.length) return;
      const first = buttons[0];
      const last = buttons.at(-1);
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
      window.setTimeout(() => previousFocus?.focus?.(), 0);
    };
  }, [open, onClose, openerRef]);

  if (!open) return null;

  return createPortal(
    <div className="hero-hologram" role="presentation">
      <section
        ref={dialogRef}
        className="hero-hologram__panel"
        role="dialog"
        aria-modal="true"
        aria-label={copy.preview}
        tabIndex="-1"
      >
        <button type="button" className="hero-hologram__close" aria-label={copy.close} onClick={onClose}>
          <X size={18} aria-hidden="true" />
        </button>
        <p className="hero-hologram__kicker">SHIP NODE · 05</p>
        <h2>{t.aiLab.title}</h2>
        <ul>{copy.signals.map((signal) => <li key={signal}>{signal}</li>)}</ul>
        <button type="button" className="hero-hologram__enter" onClick={onEnter}>{copy.enter}</button>
      </section>
    </div>,
    document.body
  );
}
