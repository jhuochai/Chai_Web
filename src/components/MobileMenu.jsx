import { useEffect, useState } from 'react';
import './MobileMenu.css';

const BASE_DELAY_MS = 100;
const STEP_DELAY_MS = 50;

export default function MobileMenu({ open, links, onClose }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!open) {
      setVisible(false);
      return;
    }
    const raf = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(raf);
  }, [open]);

  if (!open) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div className="mobile-menu" onClick={handleBackdropClick}>
      <nav className="mobile-menu__links" aria-label="Mobile">
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
    </div>
  );
}
