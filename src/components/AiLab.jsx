import { useRef, useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import StapuPet from './ai-lab/StapuPet';
import IncubationPod from './ai-lab/IncubationPod';
import SkillsCabinet from './ai-lab/SkillsCabinet';
import LabPanel from './ai-lab/LabPanel';
import './AiLab.css';

const skills = {
  zh: [
    { id: 'impeccable', use: '統一介面、動態與可讀性' },
    { id: 'grill-me', use: '在動工前釐清每個視覺與互動決策' },
    { id: 'brainstorming', use: '把想法整理成可驗收的設計規格' },
    { id: 'hatch-pet', use: '製作並驗證史達普的完整動畫表' },
  ],
  en: [
    { id: 'impeccable', use: 'Unified interface, motion, and readability' },
    { id: 'grill-me', use: 'Stress-tested visual and interaction decisions before building' },
    { id: 'brainstorming', use: 'Turned ideas into an acceptance-ready design spec' },
    { id: 'hatch-pet', use: 'Created and validated Stapu’s complete animation atlas' },
  ],
};

export default function AiLab({ controls }) {
  const { lang, t } = useLanguage();
  const copy = t.aiLab;
  const [panel, setPanel] = useState(null);
  const petRef = useRef(null);
  const skillsRef = useRef(null);

  return (
    <section id="scene-ai-lab" className="ai-lab" aria-labelledby="ai-lab-title">
      <h1 id="ai-lab-title" className="visually-hidden">{copy.title}</h1>
      <div className="ai-lab__room">
        <div className="ai-lab__bulkhead" aria-hidden="true"><i /><i /><i /><i /></div>
        <div className="ai-lab__window" aria-hidden="true"><span /><span /></div>
        <div className="ai-lab__title-plate" aria-hidden="true"><span>{copy.title}</span><i /></div>

        <div className="ai-lab__incubator-zone">
          <IncubationPod title={copy.incubationTitle} status={copy.incubationStatus} />
        </div>

        <div className="ai-lab__pet-zone">
          <div className="ai-lab__pet-platform" aria-hidden="true" />
          <StapuPet ref={petRef} label={copy.openPet} onInspect={() => setPanel('pet')} />
          <span className="ai-lab__zone-label">STAPU / 01</span>
        </div>

        <div className="ai-lab__skills-zone">
          <SkillsCabinet ref={skillsRef} label={copy.openSkills} onOpen={() => setPanel('skills')} />
        </div>

        <div className="ai-lab__controls">{controls}</div>
      </div>

      <LabPanel open={panel === 'pet'} title={copy.petTitle} onClose={() => setPanel(null)} returnFocusTo={petRef}>
        <p className="lab-panel__lead">{copy.petBody}</p>
        <dl className="stapu-record">
          <div><dt>{lang === 'zh' ? '身份' : 'Role'}</dt><dd>{lang === 'zh' ? 'Codex 寵物／實驗艙小助手' : 'Codex pet / lab assistant'}</dd></div>
          <div><dt>{lang === 'zh' ? '狀態' : 'Status'}</dt><dd>{lang === 'zh' ? '巡艙中' : 'Patrolling'}</dd></div>
        </dl>
      </LabPanel>

      <LabPanel open={panel === 'skills'} title={copy.skillsTitle} onClose={() => setPanel(null)} returnFocusTo={skillsRef}>
        <ul className="skills-record">
          {skills[lang].map((skill) => <li key={skill.id}><strong>{skill.id}</strong><span>{skill.use}</span></li>)}
        </ul>
      </LabPanel>
    </section>
  );
}
