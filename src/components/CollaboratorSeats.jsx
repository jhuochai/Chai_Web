import { useLanguage } from '../i18n/LanguageContext';
import './CollaboratorSeats.css';

const records = {
  en: [
    { name: '阿居 / Codex', role: 'Implementation and visual systems collaborator' },
    { name: '克克 / Claude', role: 'Concept and iteration collaborator' },
  ],
  zh: [
    { name: '阿居 / Codex', role: '實作與視覺系統協作者' },
    { name: '克克 / Claude', role: '概念與迭代協作者' },
  ],
};

export default function CollaboratorSeats() {
  const { lang } = useLanguage();
  const heading = lang === 'zh' ? '協作航行紀錄' : 'Archived collaboration records';
  const note = lang === 'zh'
    ? '記下我們一起修正、試探與完成的航跡。'
    : 'A record of the collaborators and choices that shaped the work.';
  return <aside className="collaborator-seats" aria-labelledby="collaborator-seats-title">
    <header><p>ARCHIVE LID / 02</p><h2 id="collaborator-seats-title">{heading}</h2><span>{note}</span></header>
    <ul>{records[lang].map((record) => <li key={record.name}><div><h3>{record.name}</h3><p>{record.role}</p></div></li>)}</ul>
  </aside>;
}
