import workbenchPreview from '../../assets/scenes/lab-workbench-preview.webp';
import lyricsPreview from '../../assets/scenes/lab-lyrics-preview.webp';

export const projects = [
  {
    id: 'workbench', version: '0.4.1', image: workbenchPreview,
    file: 'livestream-workbench-0.4.1-win-x64.zip',
    zh: { title: '直播工作台', launch: '試用直播工作台', summary: '從開播前的想法，到下播後的下一步。', problem: '直播準備、紀錄和剪輯待辦散在不同地方，回顧時很難串起來。', decision: '我從自己的直播流程出發，決定班表、心得、成效與待辦之間的關係，再透過實際使用調整操作。', ai: 'AI 協助程式實作、測試與打包；需求選擇、介面回饋與驗收由我負責。', iteration: '把待辦拆成「標題＋說明」，加入列點與編號，並讓外觀設定能從側欄直接開啟。', scope: '目前可使用直播班表、紀錄、待辦與外觀設定。OBS 自動記錄與精彩片段標記仍在規劃。', install: '解壓縮整個資料夾後，開啟 LivestreamWorkbench.exe。可直接手動記錄；Twitch／YouTube 串接需自行完成帳號設定。' },
    en: { title: 'Livestream Workbench', launch: 'Try Livestream Workbench', summary: 'From the first idea to the next step after a stream.', problem: 'Preparation, stream notes and editing tasks lived in separate places, making reflection difficult.', decision: 'I mapped my own streaming workflow, connected planning with notes and follow-up tasks, and refined the interactions through use.', ai: 'AI helped implement, test and package the app. I owned the requirements, interface feedback and acceptance decisions.', iteration: 'Separated task titles from descriptions, added lists, and made appearance settings directly accessible from the sidebar.', scope: 'Planning, records, tasks and themes are available. OBS recording and highlight markers remain planned.', install: 'Extract the entire folder and open LivestreamWorkbench.exe. Manual recording works immediately; Twitch/YouTube connections need your own account setup.' },
  },
  {
    id: 'lyrics', version: '0.1.1', image: lyricsPreview,
    file: 'Refrain-0.1.1-win-x64.zip',
    zh: { title: '桌面歌詞 Refrain', launch: '試用桌面歌詞', summary: '音樂留在瀏覽器，歌詞陪在眼前。', problem: '聽歌時想同時看到歌詞與翻譯，又希望浮窗不擋住正在做的事。', decision: '我決定歌詞行數、翻譯顯示和浮窗操作方式，依照使用中的不便反覆調整。', ai: 'AI 協助媒體資訊串接、歌詞處理與桌面程式實作；我提出需求、檢查畫面並驗收操作。', iteration: '將背景下限從 20% 調整到全透明，加入右上角小鎖，讓文字區可穿透滑鼠、鎖頭仍能解鎖。', scope: 'Windows 桌面版支援歌詞浮窗、翻譯與鎖定。這裡用原創文字示範；桌面置頂與跨程式穿透請使用下載版。', install: '解壓縮整個資料夾後，開啟 Refrain.exe，再於 Chrome 播放 YouTube 或 YouTube Music。歌詞能否載入取決於來源；也可手動匯入 LRC。' },
    en: { title: 'Refrain · Desktop Lyrics', launch: 'Try Desktop Lyrics', summary: 'Music in your browser. Lyrics within sight.', problem: 'I wanted lyrics and translations nearby without a floating window getting in the way.', decision: 'I chose the line layout, translation display and overlay controls, refining them around real listening habits.', ai: 'AI helped with media integration, lyrics processing and implementation. I defined the needs, reviewed the interface and tested the experience.', iteration: 'Changed the minimum background from 20% to fully transparent and added an accessible lock that stays clickable while lyrics pass pointer input through.', scope: 'The Windows app supports overlays, translations and locking. This preview uses original text; desktop pinning and cross-app click-through require the download.', install: 'Extract the entire folder, open Refrain.exe, then play YouTube or YouTube Music in Chrome. Lyrics depend on source availability; manual LRC import is also supported.' },
  },
];

export const downloadHref = (project) => {
  const base = import.meta.env.VITE_LAB_DOWNLOAD_BASE || `${import.meta.env.BASE_URL}downloads`;
  return `${base.replace(/\/$/, '')}/${project.file}`;
};
