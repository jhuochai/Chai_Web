import { useRef, useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import StapuPet from './ai-lab/StapuPet';
import SkillsCabinet from './ai-lab/SkillsCabinet';
import LabPanel from './ai-lab/LabPanel';
import './AiLab.css';

const skills = {
  zh: [
    { id: '社群內容企劃', use: '規劃角色、節慶、攻略與品牌資訊等內容支柱。' },
    { id: 'Meta 成效判讀', use: '依 CPI、CPM、CTR、CVR 與 IR 判讀投放訊號。' },
    { id: 'KOC／KOL 協作', use: '處理接洽、條件溝通與腳本方向。' },
    { id: '玩家回饋整理', use: '從留言、分享與收藏找出下一步內容方向。' },
    { id: '基礎視覺與短影音製作', use: '使用 Canva 與 AI 工具完成可上線的素材與腳本。' },
  ],
  en: [
    { id: 'Social content planning', use: 'Plan repeatable pillars for characters, seasonal moments, guides, and brand information.' },
    { id: 'Meta performance review', use: 'Read CPI, CPM, CTR, CVR, and IR to assess campaign signals.' },
    { id: 'KOC / KOL collaboration', use: 'Coordinate outreach, terms, and script direction.' },
    { id: 'Player feedback synthesis', use: 'Use comments, shares, and saves to shape the next content direction.' },
    { id: 'Basic visual and short-form video production', use: 'Use Canva and AI tools to prepare publishable assets and scripts.' },
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
        <p className="lab-panel__disclaimer">{copy.disclaimer}</p>
      </LabPanel>
    </section>
  );
}
