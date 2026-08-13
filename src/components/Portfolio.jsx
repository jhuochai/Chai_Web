import { useCallback, useMemo, useRef, useState } from 'react';
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
      image: caseData.cover,
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
        <div className="analysis-viewport__bezel" aria-hidden="true">
          {Array.from({ length: 12 }, (_, index) => <i key={index} style={{ '--bolt': index }} />)}
        </div>
        <div className="analysis-viewport__ticks" aria-hidden="true">
          {Array.from({ length: 24 }, (_, index) => <i key={index} style={{ '--tick': index }} />)}
        </div>
        <div className="analysis-viewport__gasket">
          <CircularGallery
            items={galleryItems}
            activeId={selectedId}
            onSelect={openCase}
            bend={2.2}
            borderRadius={0.035}
            scrollEase={0.045}
            ariaLabel={work.viewportLabel}
            selectLabel={(item) => `${work.selectPrefix}${item.text}`}
          />
        </div>
        <div className="analysis-viewport__glint" aria-hidden="true" />
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
