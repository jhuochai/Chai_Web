import { useState } from 'react';
import { useScroll, useMotionValueEvent } from 'motion/react';
import { Globe, List, X } from '@phosphor-icons/react';
import { useLanguage } from '../i18n/LanguageContext';
import MobileMenu from './MobileMenu';
import './Nav.css';

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { scrollY } = useScroll();
  const { lang, toggleLang, t } = useLanguage();

  useMotionValueEvent(scrollY, 'change', (latest) => {
    setScrolled((prev) => {
      const next = latest > 48;
      return prev === next ? prev : next;
    });
  });

  const links = [
    { href: '#scene-1', label: t.nav.home },
    { href: '#scene-3', label: t.nav.story },
    { href: '#scene-5', label: t.nav.work },
  ];

  return (
    <header className={`nav ${scrolled ? 'nav--solid' : ''}`}>
      <div className="nav__inner container">
        <a href="#scene-1" className="nav__mark">
          {t.name.display}
          <span className="nav__mark-sub">{t.name.sub}</span>
        </a>
        <nav className="nav__links" aria-label={lang === 'zh' ? '主要導覽' : 'Primary'}>
          {links.map((link) => (
            <a key={link.href} href={link.href}>
              {link.label}
            </a>
          ))}
        </nav>
        <div className="nav__actions">
          <button
            type="button"
            className="nav__lang btn-glass btn-glass--ghost"
            onClick={toggleLang}
            aria-label={t.nav.langToggleLabel}
          >
            <Globe size={15} weight="light" />
            <span>{lang === 'en' ? 'EN' : '中'}</span>
          </button>
          <a href="#scene-7" className="nav__cta btn-glass">
            {t.nav.cta}
          </a>
          <button
            type="button"
            className="nav__hamburger btn-glass btn-glass--ghost"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((prev) => !prev)}
          >
            <span className={`nav__hamburger-icon ${menuOpen ? 'nav__hamburger-icon--open' : ''}`}>
              <List size={20} weight="light" className="nav__hamburger-menu-glyph" />
              <X size={20} weight="light" className="nav__hamburger-close-glyph" />
            </span>
          </button>
        </div>
      </div>
      <MobileMenu open={menuOpen} links={links} onClose={() => setMenuOpen(false)} />
    </header>
  );
}
