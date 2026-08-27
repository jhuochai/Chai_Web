import { useCallback, useMemo, useRef, useState } from 'react';
import analysisHatchFrame from '../assets/portfolio/analysis-hatch-frame-v1.webp';
import CircularGallery from './CircularGallery';
import CaseAnalysisDesk from './CaseAnalysisDesk';
import { portfolioCases } from '../data/portfolioCases';
import { useLanguage } from '../i18n/LanguageContext';
import './Portfolio.css';

export default function Portfolio() {
  const { lang } = useLanguage();
  const work = portfolioCases[lang];
  const [selectedId, setSelectedId] = useState(work.cases[0].id);
  const [activeCase, setActiveCase] = useState(null);
  const openerRef = useRef(null);

  const galleryItems = useMemo(
    () => work.cases.map((caseData) => ({
      id: caseData.id,
      image: caseData.card,
      text: caseData.title,
    })),
    [work]
  );

  const openCase = useCallback((galleryItem) => {
    const caseData = work.cases.find((candidate) => candidate.id === galleryItem.id);
    if (!caseData) return;
    openerRef.current = document.activeElement;
    setSelectedId(caseData.id);
    setActiveCase(caseData);
  }, [work]);

  const closeCase = useCallback(() => {
    setActiveCase(null);
    queueMicrotask(() => openerRef.current?.focus());
  }, []);

  return (
    <section id="scene-5" className="portfolio analysis-bay" data-station="portfolio">
      <div className="analysis-bay__bulkhead" aria-hidden="true">
        <span />
        <span />
      </div>

      <header className="analysis-bay__heading">
        <p>{work.pageTitle}</p>
        <h1>{lang === 'zh' ? '選一份案例，送進分析桌' : 'Choose a case for the analysis desk'}</h1>
        <span>{work.pageIntro}</span>
      </header>

      <div className={`analysis-viewport${activeCase ? ' analysis-viewport--dimmed' : ''}`}>
        <img className="analysis-viewport__hatch" src={analysisHatchFrame} alt="" aria-hidden="true" />
        <div className="analysis-viewport__gasket">
          <CircularGallery
            items={galleryItems}
            activeId={selectedId}
            onSelect={openCase}
            ariaLabel={work.viewportLabel}
            selectLabel={(item) => `${work.selectPrefix}${item.text}`}
          />
        </div>
      </div>

      <aside className="analysis-bay__note">
        <span aria-hidden="true">CALIBRATION / VERIFIED DATA</span>
        <p>{work.caveat}</p>
      </aside>

      {activeCase ? (
        <CaseAnalysisDesk caseData={activeCase} copy={work.controls} onClose={closeCase} />
      ) : null}
    </section>
  );
}
