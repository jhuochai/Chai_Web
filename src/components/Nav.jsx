import { useState } from 'react';
import { Globe, MapTrifold } from '@phosphor-icons/react';
import { useLanguage } from '../i18n/LanguageContext';
import MusicToggle from './MusicToggle';
import RouteMap from './RouteMap';
import './Nav.css';

const labels = {
  en: { open: 'Open route map' },
  zh: { open: '開啟航線圖' },
};

export default function Nav({ currentRoute = '/', onTravel = () => {}, onOpenContact = () => {} }) {
  const [mapOpen, setMapOpen] = useState(false);
  const { lang, toggleLang, t } = useLanguage();

  return (
    <header className="nav">
      <div className="nav__inner container">
        <div className="nav__mark" aria-label={t.name.display}>
          {t.name.display}
          <span className="nav__mark-sub">{t.name.sub}</span>
        </div>
        <div className="nav__actions">
          <MusicToggle />
          <button
            type="button"
            className="nav__lang btn-glass btn-glass--ghost"
            onClick={toggleLang}
            aria-label={t.nav.langToggleLabel}
          >
            <Globe size={15} weight="light" />
            <span>{lang === 'en' ? 'EN' : '中'}</span>
          </button>
          <button
            type="button"
            className="nav__route-map"
            aria-label={labels[lang].open}
            aria-expanded={mapOpen}
            aria-controls="ship-route-map"
            onClick={() => setMapOpen(true)}
          >
            <MapTrifold aria-hidden="true" size={20} weight="light" />
          </button>
        </div>
      </div>
      <RouteMap
        open={mapOpen}
        currentRoute={currentRoute}
        onClose={() => setMapOpen(false)}
        onTravel={onTravel}
        onOpenContact={onOpenContact}
      />
    </header>
  );
}
