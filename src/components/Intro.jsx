import { useRef } from 'react';
import { useReducedMotion } from 'motion/react';
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLanguage } from '../i18n/useLanguage';
import { navigateToRoute } from '../lib/siteRoute';
import captainPortrait from '../assets/scenes/captain-portrait-front.webp';
import archiveRoom from '../assets/scenes/captain-archive-room.webp';
import { capabilities } from '../data/capabilities';
import './Intro.css';

gsap.registerPlugin(useGSAP, ScrollTrigger);

const officeCopy = {
  en: { station: "Captain's Office", dossier: 'Captain dossier', portraitAlt: 'Front portrait of Chai Yi Chen as the ship captain', stamp: 'Player-led signal' },
  zh: { station: '艦長辦公室', dossier: '艦長檔案', portraitAlt: '柴怡辰的艦長角色正面肖像', stamp: '玩家視角訊號' },
};

export default function Intro() {
  const { lang, t } = useLanguage();
  const reduce = useReducedMotion();
  const sectionRef = useRef(null);
  const dossierRef = useRef(null);
  const copy = officeCopy[lang];

  useGSAP(() => {
    if (reduce || !dossierRef.current) return;
    gsap.from(dossierRef.current.children, {
      y: 18, opacity: 0, duration: 0.65, stagger: 0.07, ease: 'power3.out', immediateRender: false,
      scrollTrigger: { trigger: dossierRef.current, start: 'top 78%', once: true },
    });
  }, { scope: sectionRef, dependencies: [reduce], revertOnUpdate: true });

  return (
    <section id="scene-2" className="intro" ref={sectionRef} aria-labelledby="intro-name">
      <div className="intro__office-scene">
        <img className="intro__room" src={archiveRoom} alt="" fetchPriority="high" />
        <div className="intro__inner container">
          <article ref={dossierRef} className="intro__dossier">
            <div className="intro__metal-board" aria-hidden="true" />
            <div className="intro__identity">
              <figure className="intro__portrait">
                <img src={captainPortrait} alt={copy.portraitAlt} draggable="false" />
              </figure>
              <div className="intro__identity-copy">
                <header className="intro__dossier-head"><p>{copy.station}</p><span>{copy.dossier}</span></header>
                <h2 id="intro-name" className="intro__name">{t.name.display}</h2>
                <p className="intro__name-sub">{t.name.sub}</p>
                <p className="intro__title">{t.title}</p>
                <p className="intro__summary">{t.intro.summary}</p>
                <div className="intro__results" aria-label={lang === 'zh' ? '實務成果' : 'Verified results'}>
                  <ul>{t.intro.results.map((result) => <li key={result}>{result}</li>)}</ul>
                  <button type="button" className="intro__case-link" onClick={() => navigateToRoute('/portfolio')}>{t.intro.caseCta}</button>
                </div>
              </div>
            </div>
          </article>
          <div className="intro__stand" aria-hidden="true"><i /><i /></div>
        </div>
      </div>
      <div className="intro__details container">
        <p className="intro__positioning">{t.positioning.before}<em>{t.positioning.emphasis}</em>{t.positioning.after}</p>
        <ul className="intro__traits" aria-label={t.intro.strengthsLabel}>
          {t.traits.map((trait) => <li key={trait.key} className="intro__trait"><h3>{trait.label}</h3><p>{trait.desc}</p></li>)}
        </ul>
        <section className="intro__capabilities" aria-labelledby="intro-capabilities-title">
          <h3 id="intro-capabilities-title">{lang === 'zh' ? '專業能力' : 'Professional capabilities'}</h3>
          <dl>{capabilities[lang].map(skill => <div key={skill.id}><dt>{skill.id}</dt><dd>{skill.use}</dd></div>)}</dl>
          <p>{t.aiLab.disclaimer}</p>
        </section>
        <aside className="intro__player-view" aria-labelledby="intro-player-title">
          <span className="intro__status-stamp">{copy.stamp}</span>
          <h3 id="intro-player-title">{t.intro.playerViewTitle}</h3><p>{t.personalityBlurb}</p>
        </aside>
      </div>
    </section>
  );
}
