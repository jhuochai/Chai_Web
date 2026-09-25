import { useCallback, useRef, useState } from 'react';
import { AnimatePresence } from 'motion/react';
import { useLanguage } from '../i18n/useLanguage';
import StapuPet from './ai-lab/StapuPet';
import LabPanel from './ai-lab/LabPanel';
import ProjectDialog from './ai-lab/ProjectDialog';
import { projects } from './ai-lab/projects';
import room from '../assets/scenes/ai-lab-workroom.webp';
import './AiLab.css';

export default function AiLab({ controls }) {
  const { lang, t } = useLanguage();
  const copy = t.aiLab;
  const [panel, setPanel] = useState(null);
  const petRef = useRef(null);
  const [projectView, setProjectView] = useState(null);
  const closeProject = useCallback(() => setProjectView(null), []);
  const closeRecord = useCallback(() => setPanel(null), []);
  const zh = lang === 'zh';
  function openProject(event, project, view = 'demo') {
    const trigger = event.currentTarget;
    const rect = trigger.closest('.lab-workstation')?.querySelector('.lab-monitor')?.getBoundingClientRect() ?? trigger.getBoundingClientRect();
    setProjectView({ project, initialView: view, returnFocus: trigger, origin: { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 } });
  }

  return (
    <section id="scene-ai-lab" className="ai-lab" aria-labelledby="ai-lab-title">
      <div className="ai-lab__room">
        <img className="ai-lab__backdrop" src={room} alt="" fetchPriority="high" />
        <header className="ai-lab__intro"><h1 id="ai-lab-title">{zh ? 'AI 實驗室' : 'AI Lab'}</h1><p>{zh ? '把日常需求，做成可以使用的工具。' : 'Everyday needs. Tools brought to life.'}</p><span>{zh ? '選一台設備，試試它的功能。' : 'Choose a device. Make yourself at home.'}</span></header>
        <div className="lab-workstations">{projects.map(project => <article className={`lab-workstation lab-workstation--${project.id}`} key={project.id}>
          <h2>{project[lang].title}</h2>
          <button type="button" className="lab-monitor" aria-label={project[lang].launch} onClick={event => openProject(event, project)}><img src={project.image} alt={zh ? `${project[lang].title}操作畫面` : `${project[lang].title} interface`} /><span className="lab-monitor__hint">{zh ? '點擊放大體驗' : 'Click to explore'} ↗</span></button>
          <div className="lab-monitor-stand" aria-hidden="true" />
          <div className="lab-workstation__actions"><button className="lab-launch" onClick={event => openProject(event, project)}>{zh ? '開始互動示範' : 'Explore the demo'} <span aria-hidden="true">→</span></button><div><button onClick={event => openProject(event, project, 'story')}>{zh ? '製作過程' : 'Making of'}</button><button onClick={event => openProject(event, project, 'download')}>{zh ? '下載 Windows 版' : 'Windows download'}</button></div></div>
        </article>)}</div>
        <footer className="ai-lab__footer"><div className="ai-lab__companion"><StapuPet ref={petRef} label={copy.openPet} onInspect={() => setPanel('pet')} /><div><span>{zh ? '史達普・實驗室小助手' : 'Stapu · Lab companion'}</span></div></div><div className="ai-lab__controls">{controls}</div></footer>
      </div>

      <AnimatePresence>{projectView && <ProjectDialog key={projectView.project.id} {...projectView} lang={lang} onClose={closeProject} />}</AnimatePresence>

      <LabPanel open={panel === 'pet'} title={copy.petTitle} onClose={closeRecord} returnFocusTo={petRef}>
        <p className="lab-panel__lead">{copy.petBody}</p>
        <dl className="stapu-record">
          <div><dt>{lang === 'zh' ? '身份' : 'Role'}</dt><dd>{lang === 'zh' ? 'Codex 寵物／實驗艙小助手' : 'Codex pet / lab assistant'}</dd></div>
          <div><dt>{lang === 'zh' ? '狀態' : 'Status'}</dt><dd>{lang === 'zh' ? '巡艙中' : 'Patrolling'}</dd></div>
        </dl>
      </LabPanel>


    </section>
  );
}
