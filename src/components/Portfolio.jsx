import { useMemo } from 'react';
import { GameController } from '@phosphor-icons/react';
import CircularGallery from './CircularGallery';
import FramedPanel from './FramedPanel';
import RevealSection from './RevealSection';
import { useLanguage } from '../i18n/LanguageContext';
import './Portfolio.css';

export default function Portfolio() {
  const { lang, t } = useLanguage();
  const { heading, intro, cases, player } = t.portfolio;
  const { ui } = t;

  const galleryItems = useMemo(
    () =>
      cases.map((c) => ({
        image: `https://picsum.photos/seed/${c.imageSeed}/900/700?grayscale`,
        text: c.title,
      })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [lang]
  );

  return (
    <section id="portfolio" className="portfolio">
      <div className="container">
        <RevealSection as="div" className="portfolio__head">
          <h2>{heading}</h2>
          <p>{intro}</p>
        </RevealSection>
      </div>

      <RevealSection as="div" delay={0.05} className="portfolio__gallery-wrap">
        <CircularGallery
          items={galleryItems}
          bend={2}
          textColor="#ede3d0"
          borderRadius={0.04}
          scrollEase={0.02}
          ariaLabel={lang === 'zh' ? '精選項目輪播，可用左右鍵瀏覽' : 'Selected work carousel, use left and right arrow keys to browse'}
        />
      </RevealSection>

      <div className="container">
        <div className="portfolio__cases">
          {cases.map((c, i) => (
            <RevealSection as="div" delay={0.08 + i * 0.04} key={c.id}>
              <FramedPanel variant="corners" className="case-panel">
                <span className="case-panel__tag">{c.tag}</span>
                <h3 className="case-panel__title">{c.title}</h3>
                <p className="case-panel__scenario">{c.scenario}</p>
                <div className="case-panel__row">
                  <span className="case-panel__row-label">{ui.workLabel}</span>
                  <p>{c.approach}</p>
                </div>
                <div className="case-panel__row">
                  <span className="case-panel__row-label">{ui.resultLabel}</span>
                  <p className="case-panel__result">{c.result}</p>
                </div>
              </FramedPanel>
            </RevealSection>
          ))}
        </div>

        <RevealSection as="div" delay={0.1} className="portfolio__player">
          <div className="portfolio__player-icon">
            <GameController size={32} weight="light" />
          </div>
          <div>
            <h3>{player.heading}</h3>
            <p>{player.desc}</p>
            <p className="portfolio__player-genres">{player.genresNote}</p>
            <ul className="portfolio__player-games">
              {player.games.map((g) => (
                <li key={g.name}>
                  <span>{g.name}</span>
                  {g.note ? <em>{g.note}</em> : null}
                </li>
              ))}
            </ul>
          </div>
        </RevealSection>
      </div>
    </section>
  );
}
