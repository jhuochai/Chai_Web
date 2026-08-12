import { getNextChapter } from '../data/chapterMap';
import { scrollToScene } from '../lib/scrollToScene';
import './ChapterExit.css';

const chapterLabels = {
  intro: '自我介紹',
  career: '職涯故事',
  portfolio: '作品選集',
  contact: '聯絡方式',
};

export default function ChapterExit({ chapterId }) {
  const nextChapter = getNextChapter(chapterId);

  return (
    <aside className="chapter-exit container" aria-label="章節導覽">
      <button
        type="button"
        className="chapter-exit__button btn-glass btn-glass--ghost"
        onClick={() => scrollToScene('#scene-1')}
      >
        回到首頁
      </button>
      <button
        type="button"
        className="chapter-exit__button btn-glass"
        onClick={() => scrollToScene(nextChapter.target)}
      >
        前往下一章：{chapterLabels[nextChapter.id]}
      </button>
    </aside>
  );
}
