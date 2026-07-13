import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { X } from '@phosphor-icons/react';
import { useLanguage } from '../i18n/LanguageContext';
import './MobileMenu.css';

const BASE_DELAY_MS = 100;
const STEP_DELAY_MS = 50;

export default function MobileMenu({ open, links, onClose }) {
  const [visible, setVisible] = useState(false);
  const closeButtonRef = useRef(null);
  const { lang } = useLanguage();

  useEffect(() => {
    if (!open) {
      setVisible(false);
      return;
    }
    const raf = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(raf);
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const focusTimer = setTimeout(() => {
      closeButtonRef.current?.focus();
    }, 0);

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      clearTimeout(focusTimer);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return createPortal(
    <div className="mobile-menu" onClick={handleBackdropClick}>
      <button
        type="button"
        ref={closeButtonRef}
        className="mobile-menu__close btn-glass btn-glass--ghost"
        aria-label={lang === 'zh' ? '關閉選單' : 'Close menu'}
        onClick={onClose}
      >
        <X size={20} weight="light" />
      </button>
      <nav className="mobile-menu__links" aria-label={lang === 'zh' ? '行動選單' : 'Mobile'}>
        {links.map((link, index) => (
          <a
            key={link.href}
            href={link.href}
            onClick={onClose}
            className={visible ? 'mobile-menu__link--visible' : undefined}
            style={{ transitionDelay: `${BASE_DELAY_MS + index * STEP_DELAY_MS}ms` }}
          >
            {link.label}
          </a>
        ))}
      </nav>
    </div>,
    document.body
  );
}
