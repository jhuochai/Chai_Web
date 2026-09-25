import { useState } from 'react';

const sessions = [
  { id: 1, date: '09 / 25', time: '20:00 — 22:00', game: '第五人格', enGame: 'Identity V', zh: '週五同樂夜', en: 'Friday community night', status: 'ready' },
  { id: 2, date: '09 / 27', time: '19:30 — 21:00', game: 'Minecraft', enGame: 'Minecraft', zh: '一起蓋一座小屋', en: 'Build a little home', status: 'draft' },
  { id: 3, date: '09 / 29', time: '20:00 — 22:00', game: 'LOL', enGame: 'League of Legends', zh: '練習與聊天', en: 'Practice and conversation', status: 'draft' },
];
const labels = {
  zh: { title: '直播工作台', tagline: '每一場，都留下些什麼。', tabs: ['總覽', '直播班表', '待辦事項', '外觀設定'], greeting: '把今天記下來，讓下一場更有方向。', next: '接下來的直播', tasks: '下一步，做一件事', week: '本週的練習', chart: '一場一場看變化', chartNote: '示範直播時長（小時）', ready: '準備就緒', draft: '草稿', add: '新增待辦', submit: '加入待辦', empty: '清單已清空，為下一場留個想法。', delete: '刪除', titleLabel: '直播內容', outline: '內容大綱', outlineText: '開場聊天 → 遊戲挑戰 → 觀眾回饋', goal: '本次觀察', goalText: '試試在開場提問，觀察觀眾參與的節奏。', back: '返回班表', themes: ['奶油米白', '深夜可可', '日系手帳'], themeHint: '選一種今天想用的顏色，立即看看變化。', sample: '示範資料 · 修改只保留到關閉示範', initial: ['準備開場話題', '整理上次直播的精華片段'], unit: '場直播', hours: '小時', pending: '項待辦' },
  en: { title: 'Livestream Workbench', tagline: 'Leave a little something after every stream.', tabs: ['Overview', 'Schedule', 'Tasks', 'Appearance'], greeting: 'Capture today. Give the next stream a direction.', next: 'Coming up', tasks: 'One next step', week: 'This week', chart: 'One stream at a time', chartNote: 'Sample streaming hours', ready: 'Ready', draft: 'Draft', add: 'New task', submit: 'Add task', empty: 'A clear list. Leave an idea for your next stream.', delete: 'Delete', titleLabel: 'Stream plan', outline: 'Run of show', outlineText: 'Opening chat → Game challenge → Audience feedback', goal: 'What to observe', goalText: 'Try an opening question and notice how the audience joins in.', back: 'Back to schedule', themes: ['Cream', 'Midnight cocoa', 'Journal'], themeHint: 'Choose a palette and see it change immediately.', sample: 'Sample data · Changes last until you close the demo', initial: ['Prepare an opening topic', 'Review highlights from the last stream'], unit: 'streams', hours: 'hours', pending: 'tasks' },
};

export default function LivestreamDemo({ lang }) {
  const c = labels[lang];
  const [tab, setTab] = useState(0);
  const [theme, setTheme] = useState(0);
  const [selected, setSelected] = useState(null);
  const [draft, setDraft] = useState('');
  const [tasks, setTasks] = useState(() => c.initial.map((text, id) => ({ id, text, done: false })));
  const [nextId, setNextId] = useState(2);
  const [editing, setEditing] = useState(null);
  const [editText, setEditText] = useState('');
  const taskList = <ul className="workbench-tasks">{tasks.map(task => <li key={task.id}>
    {editing === task.id ? <form className="task-edit" onSubmit={event => { event.preventDefault(); if (!editText.trim()) return; setTasks(items => items.map(item => item.id === task.id ? { ...item, text: editText.trim() } : item)); setEditing(null); }}><input aria-label={lang === 'zh' ? '編輯待辦內容' : 'Edit task text'} value={editText} maxLength={120} onChange={event => setEditText(event.target.value)} /><button type="submit" disabled={!editText.trim()}>{lang === 'zh' ? '儲存待辦' : 'Save task'}</button><button type="button" onClick={() => setEditing(null)}>{lang === 'zh' ? '取消' : 'Cancel'}</button></form> : <><label><input type="checkbox" checked={task.done} onChange={() => setTasks(items => items.map(item => item.id === task.id ? { ...item, done: !item.done } : item))} /><span className={task.done ? 'is-done' : ''}>{task.text}</span></label>
    {tab === 2 && <><button type="button" className="task-edit-button" aria-label={`${lang === 'zh' ? '編輯' : 'Edit'} ${task.text}`} onClick={() => { setEditing(task.id); setEditText(task.text); }}>{lang === 'zh' ? '編輯' : 'Edit'}</button><button type="button" className="task-delete" aria-label={`${c.delete} ${task.text}`} onClick={() => setTasks(items => items.filter(item => item.id !== task.id))}>×</button></>}</>}
  </li>)}</ul>;
  return <div className={`workbench-demo workbench-demo--theme-${theme}`}>
    <aside className="workbench-sidebar"><strong>{c.title}</strong><p>{c.tagline}</p><nav aria-label={c.title}>{c.tabs.map((name, i) => <button type="button" key={name} aria-current={tab === i ? 'page' : undefined} onClick={() => { setTab(i); setSelected(null); }}><span aria-hidden="true">{['◷', '▦', '✓', '◐'][i]}</span>{name}</button>)}</nav><small>{c.sample}</small></aside>
    <section className="workbench-main" aria-label={c.tabs[tab]}>
      <header><p>{c.title} / {c.tabs[tab]}</p><h3>{selected ? selected[lang] : c.tabs[tab]}</h3><p>{c.greeting}</p></header>
      {tab === 0 && <><div className="workbench-stats"><span><b>3</b> {c.unit}</span><span><b>5.5</b> {c.hours}</span><span><b>{tasks.filter(task => !task.done).length}</b> {c.pending}</span></div><div className="workbench-columns"><div><h4>{c.next}</h4><button className="workbench-session" onClick={() => { setTab(1); setSelected(sessions[0]); }}><span className="session-date">25<small>SEP</small></span><span><b>{sessions[0][lang]}</b><small>{sessions[0].time} · {lang === 'zh' ? '第五人格' : 'Identity V'}</small></span><span aria-hidden="true">→</span></button><h4>{c.chart}</h4><div className="workbench-chart" role="img" aria-label={`${c.chartNote}: 09/18 1.5, 09/20 2, 09/22 2`}>
        {[1.5, 2, 2].map((value, i) => <div key={i}><span>{value}</span><i style={{ height: `${value * 48}px` }} /><small>09/{18 + i * 2}</small></div>)}</div><small>{c.chartNote}</small></div><div><h4>{c.tasks}</h4>{taskList}</div></div></>}
      {tab === 1 && (selected ? <div className="workbench-detail"><button className="demo-text-button" onClick={() => setSelected(null)}>← {c.back}</button><p>{selected.date} · {selected.time} · {lang === 'zh' ? selected.game : selected.enGame}</p><h4>{c.outline}</h4><p>{c.outlineText}</p><h4>{c.goal}</h4><p>{c.goalText}</p></div> : <div className="workbench-schedule">{sessions.map(session => <button className="workbench-session" key={session.id} onClick={() => setSelected(session)}><span className="session-date">{session.date}</span><span><b>{session[lang]}</b><small>{session.time} · {lang === 'zh' ? session.game : session.enGame}</small></span><em>{c[session.status]}</em><span aria-hidden="true">→</span></button>)}</div>)}
      {tab === 2 && <><form className="workbench-add" onSubmit={event => { event.preventDefault(); if (!draft.trim()) return; setTasks(items => [...items, { id: nextId, text: draft.trim(), done: false }]); setNextId(id => id + 1); setDraft(''); }}><label htmlFor="lab-task">{c.add}</label><div><input id="lab-task" value={draft} maxLength={120} onChange={event => setDraft(event.target.value)} placeholder={lang === 'zh' ? '例如：剪一支直播精華' : 'e.g. Edit a stream highlight'} /><button type="submit" disabled={!draft.trim()}>{c.submit}</button></div></form>{tasks.length ? taskList : <p>{c.empty}</p>}</>}
      {tab === 3 && <><p>{c.themeHint}</p><div className="workbench-themes">{c.themes.map((name, i) => <button key={name} aria-pressed={theme === i} onClick={() => setTheme(i)}><span className={`theme-swatch theme-swatch--${i}`} aria-hidden="true" />{name}{theme === i && <span aria-hidden="true"> ✓</span>}</button>)}</div></>}
    </section>
  </div>;
}
