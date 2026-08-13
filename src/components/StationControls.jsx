import { getRecommendedNext, getStationByRoute, STATIONS } from '../data/stations';
import { useLanguage } from '../i18n/LanguageContext';
import './StationControls.css';

const copy = {
  en: { landmark: 'Station controls', home: 'Return to Cockpit', next: 'Next: ' },
  zh: { landmark: '站內航行控制', home: '返回駕駛艙', next: '下一站：' },
};

function getCurrentStation(currentRoute) {
  return getStationByRoute(currentRoute) ?? STATIONS.find((station) => station.id === currentRoute);
}

export default function StationControls({ currentRoute, onTravel }) {
  const { lang } = useLanguage();
  const labels = copy[lang];
  const currentStation = getCurrentStation(currentRoute);
  const nextStation = getRecommendedNext(currentRoute);
  const isCockpit = currentStation?.id === 'cockpit';

  return (
    <aside className="station-controls container" aria-label={labels.landmark}>
      <div className="station-controls__console">
        <button
          type="button"
          className="station-controls__button station-controls__button--return"
          disabled={isCockpit}
          aria-current={isCockpit ? 'page' : undefined}
          onClick={() => onTravel('/')}
        >
          {labels.home}
        </button>
        <button
          type="button"
          className="station-controls__button station-controls__button--next"
          onClick={() => onTravel(nextStation.route)}
        >
          {labels.next}{nextStation[lang]}
        </button>
      </div>
    </aside>
  );
}
