import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Broadcast, X } from '@phosphor-icons/react';
import { STATIONS, getStationByRoute } from '../data/stations';
import { useLanguage } from '../i18n/LanguageContext';
import './RouteMap.css';

const comingSoonStations = [
  { id: 'ai-lab', zh: 'AI 實驗艙', en: 'AI Lab' },
  { id: 'private-archive', zh: '私人典藏艙', en: 'Private Archive' },
];

const copy = {
  en: {
    title: 'Ship route map',
    close: 'Close route map',
    comingSoon: 'Coming soon',
    comms: 'Comms',
  },
  zh: {
    title: '飛船航線圖',
    close: '關閉航線圖',
    comingSoon: '建置中',
    comms: '通訊台',
  },
};

function getCurrentStation(currentRoute) {
  return getStationByRoute(currentRoute) ?? STATIONS.find((station) => station.id === currentRoute);
}

export default function RouteMap({ open, currentRoute, onClose, onTravel, onOpenContact }) {
  const { lang } = useLanguage();
  const dialogRef = useRef(null);
  const closeRef = useRef(null);
  const openerRef = useRef(null);
  const returnFocusRef = useRef(true);
  const labels = copy[lang];
  const currentStation = getCurrentStation(currentRoute);

  useEffect(() => {
    if (!open) return undefined;

    openerRef.current = document.activeElement;
    returnFocusRef.current = true;
    const previousOverflow = document.body.style.overflow;
    const backgroundNodes = Array.from(document.body.children).filter(
      (node) => !node.classList.contains('route-map')
    );
    const previousBackgroundState = backgroundNodes.map((node) => ({
      node,
      inert: node.hasAttribute('inert'),
      ariaHidden: node.getAttribute('aria-hidden'),
    }));

    document.body.style.overflow = 'hidden';
    backgroundNodes.forEach((node) => {
      node.setAttribute('inert', '');
      node.setAttribute('aria-hidden', 'true');
    });
    dialogRef.current?.focus();

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== 'Tab') return;
      const focusable = Array.from(
        dialogRef.current?.querySelectorAll('button:not([disabled])') ?? []
      );
      if (!focusable.length) {
        event.preventDefault();
        dialogRef.current?.focus();
        return;
      }

      const first = focusable[0];
      const last = focusable.at(-1);
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
      document.body.style.overflow = previousOverflow;
      previousBackgroundState.forEach(({ node, inert, ariaHidden }) => {
        if (!inert) node.removeAttribute('inert');
        if (ariaHidden === null) node.removeAttribute('aria-hidden');
        else node.setAttribute('aria-hidden', ariaHidden);
      });
      if (returnFocusRef.current) window.setTimeout(() => openerRef.current?.focus?.(), 0);
    };
  }, [open, onClose]);

  if (!open) return null;

  const travelTo = (station) => {
    if (station.id === currentStation?.id) return;
    onTravel(station.route);
    onClose();
  };

  const openComms = () => {
    returnFocusRef.current = false;
    onOpenContact();
    onClose();
  };

  return createPortal(
    <div
      className="route-map"
      data-testid="route-map-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        id="ship-route-map"
        ref={dialogRef}
        className="route-map__panel"
        role="dialog"
        aria-modal="true"
        aria-label={labels.title}
        tabIndex="-1"
      >
        <header className="route-map__head">
          <p>{labels.title}</p>
          <button ref={closeRef} type="button" className="route-map__close" aria-label={labels.close} onClick={onClose}>
            <X aria-hidden="true" size={18} />
          </button>
        </header>

        <ol className="route-map__stations">
          {STATIONS.filter((station) => station.next).map((station, index) => {
            const isCurrent = station.id === currentStation?.id;
            return (
              <li key={station.id}>
                <button
                  type="button"
                  className={`route-map__station${isCurrent ? ' route-map__station--current' : ''}`}
                  aria-current={isCurrent ? 'page' : undefined}
                  onClick={() => travelTo(station)}
                >
                  <span className="route-map__index" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
                  <span>{station[lang]}</span>
                </button>
              </li>
            );
          })}
          {comingSoonStations.map((station) => (
            <li key={station.id}>
              <button type="button" className="route-map__station route-map__station--pending" disabled>
                <span className="route-map__index" aria-hidden="true">--</span>
                <span>{station[lang]}</span>
                <span className="route-map__status">{labels.comingSoon}</span>
              </button>
            </li>
          ))}
        </ol>

        <button type="button" className="route-map__comms" onClick={openComms}>
          <Broadcast aria-hidden="true" size={19} weight="light" />
          {labels.comms}
        </button>
      </section>
    </div>,
    document.body
  );
}
