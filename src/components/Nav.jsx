import { useState } from 'react';
import { useScroll, useMotionValueEvent } from 'motion/react';
import { Globe } from '@phosphor-icons/react';
import { useLanguage } from '../i18n/LanguageContext';
import './Nav.css';

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();
  const { lang, toggleLang, t } = useLanguage();

  useMotionValueEvent(scrollY, 'change', (latest) => {
    setScrolled((prev) => {
      const next = latest > 48;
      return prev === next ? prev : next;
    });
  });

  const links = [
    { href: '#hero', label: t.nav.home },
    { href: '#about', label: t.nav.about },
    { href: '#portfolio', label: t.nav.portfolio },
  ];

  return (
    <header className={`nav ${scrolled ? 'nav--solid' : ''}`}>
      <div className="nav__inner container">
        <a href="#hero" className="nav__mark">
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
          <a href="#contact" className="nav__cta btn-glass">
            {t.nav.cta}
          </a>
        </div>
      </div>
    </header>
  );
}
