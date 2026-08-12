import { getNextChapter } from '../data/chapterMap';
import { useLanguage } from '../i18n/LanguageContext';
import { scrollToScene } from '../lib/scrollToScene';
import './ChapterExit.css';

export default function ChapterExit({ chapterId }) {
  const { t } = useLanguage();
  const nextChapter = getNextChapter(chapterId);
  const copy = t.ui.chapterExit;

  return (
    <aside
      className="chapter-exit container"
      aria-label={`${copy.landmark}: ${copy.chapters[chapterId]}`}
    >
      <button
        type="button"
        className="chapter-exit__button btn-glass btn-glass--ghost"
        onClick={() => scrollToScene('#scene-1')}
      >
        {copy.home}
      </button>
      <button
        type="button"
        className="chapter-exit__button btn-glass"
        onClick={() => scrollToScene(nextChapter.target)}
      >
        {copy.next}{copy.chapters[nextChapter.id]}
      </button>
    </aside>
  );
}
