import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, useReducedMotion } from 'motion/react';
import { acquireBodyScrollLock } from '../../lib/bodyScrollLock';
import LivestreamDemo from './LivestreamDemo';
import LyricsDemo from './LyricsDemo';
import { downloadHref } from './projects';
import './ProjectDemo.css';

export default function ProjectDialog({ project, lang, initialView = 'demo', origin, returnFocus, onClose }) {
  const zh = lang === 'zh';
  const copy = project[lang];
  const panelRef = useRef(null);
  const backdropRef = useRef(null);
  const closeRef = useRef(null);
  const [view, setView] = useState(initialView);
  const [reset, setReset] = useState(0);
  const reduced = useReducedMotion();
  useEffect(() => {
    const release = acquireBodyScrollLock();
    const siblings = [...document.body.children].filter(element => element !== backdropRef.current);
    const prior = siblings.map(element => [element, element.hasAttribute('inert')]);
    siblings.forEach(element => element.setAttribute('inert', ''));
    closeRef.current?.focus();
    function onKey(event) {
      if (event.key === 'Escape') { event.preventDefault(); event.stopPropagation(); onClose(); return; }
      if (event.key !== 'Tab') return;
      const controls = [...panelRef.current.querySelectorAll('button:not(:disabled), a[href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex="0"]')].filter(element => !element.closest('[hidden]'));
      const first = controls[0], last = controls.at(-1);
      if (event.shiftKey && (document.activeElement === first || !panelRef.current.contains(document.activeElement))) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && (document.activeElement === last || !panelRef.current.contains(document.activeElement))) { event.preventDefault(); first?.focus(); }
    }
    document.addEventListener('keydown', onKey, true);
    return () => {
      document.removeEventListener('keydown', onKey, true);
      prior.forEach(([element, wasInert]) => { if (!wasInert) element.removeAttribute('inert'); });
      release();
      if (returnFocus?.isConnected) returnFocus.focus({ preventScroll: true });
    };
  }, [onClose, returnFocus]);
  const small = reduced || window.innerWidth < 700;
  const collapsed = small ? { opacity: 0 } : { opacity: 0, scale: 0.35, x: origin.x - window.innerWidth / 2, y: origin.y - window.innerHeight / 2 };
  const titles = zh ? ['互動示範', '製作過程', '下載 Windows 版'] : ['Interactive demo', 'Making of', 'Download for Windows'];
  return createPortal(<motion.div ref={backdropRef} className="project-backdrop" data-lenis-prevent initial={{ backgroundColor: 'rgba(5,10,17,0)' }} animate={{ backgroundColor: 'rgba(5,10,17,.86)' }} exit={{ backgroundColor: 'rgba(5,10,17,0)' }} transition={{ duration: reduced ? 0 : 0.24 }} onMouseDown={event => { if (event.target === event.currentTarget) onClose(); }}>
    <motion.section ref={panelRef} className="project-dialog" role="dialog" aria-modal="true" aria-label={`${copy.title} · ${zh ? '互動示範' : 'Interactive demo'}`} initial={collapsed} animate={{ opacity: 1, scale: 1, x: 0, y: 0 }} exit={collapsed} transition={{ duration: reduced ? 0 : 0.26, ease: [0.22, 1, 0.36, 1] }}>
      <header className="project-toolbar"><div><h2>{copy.title}</h2><span>{zh ? '示範資料・免登入' : 'Sample data · No sign-in'}</span></div><div className="project-toolbar__actions"><button onClick={() => { setReset(value => value + 1); setView('demo'); }}>{zh ? '重設示範' : 'Reset demo'}</button><button ref={closeRef} onClick={onClose}><span aria-hidden="true">← </span>{zh ? '返回實驗室' : 'Back to lab'}</button></div></header>
      <nav className="project-tabs" aria-label={zh ? '作品內容' : 'Project content'}>{['demo', 'story', 'download'].map((item, i) => <button key={item} aria-current={view === item ? 'page' : undefined} onClick={() => setView(item)}>{titles[i]}</button>)}</nav>
      <div className="project-dialog__content">
        <div className="project-demo-stage" hidden={view !== 'demo'}>{project.id === 'workbench' ? <LivestreamDemo key={reset} lang={lang} /> : <LyricsDemo key={reset} lang={lang} active={view === 'demo'} />}</div>
        {view === 'story' && <article className="project-story"><p className="project-story__lead">{copy.summary}</p>{[[zh ? '從一個日常問題開始' : 'A daily problem', copy.problem], [zh ? '我做的決策' : 'My decisions', copy.decision], [zh ? '與 AI 一起完成' : 'Working with AI', copy.ai], [zh ? '一次具體的改進' : 'One concrete improvement', copy.iteration], [zh ? '目前做到哪裡' : 'Current scope', copy.scope]].map(([title, body]) => <section key={title}><h3>{title}</h3><p>{body}</p></section>)}</article>}
        {view === 'download' && <article className="project-story"><h3>{zh ? '把工具帶回你的桌面' : 'Bring it to your desktop'}</h3><p>Windows x64 · v{project.version} · ZIP</p><p>{copy.install}</p><p>{zh ? '這是免安裝版，請保留解壓縮後的整個資料夾。包含程式與使用說明，不包含我的個人紀錄或帳號。' : 'This is a portable build. Keep the entire extracted folder together. The package includes the app and instructions, without my personal records or accounts.'}</p><a className="project-download" href={downloadHref(project)} download>{zh ? '下載免安裝版' : 'Download portable ZIP'} ↓</a><p className="project-download-note">{zh ? '目前提供 Windows 版；手機與 Mac 可使用本站互動示範。' : 'The download is for Windows; try the web demo on Mac or mobile.'}</p></article>}
      </div>
    </motion.section>
  </motion.div>, document.body);
}
