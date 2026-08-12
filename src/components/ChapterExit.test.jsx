import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, vi } from 'vitest';
import ChapterExit from './ChapterExit';
import { LanguageProvider } from '../i18n/LanguageContext';
import { content } from '../data/content';

const scrollMocks = vi.hoisted(() => ({ scrollToScene: vi.fn() }));
const transitionMocks = vi.hoisted(() => ({ playChapterTransition: vi.fn() }));

vi.mock('../lib/scrollToScene', () => scrollMocks);
vi.mock('../lib/chapterTransition', () => transitionMocks);

function renderChapterExit(chapterId = 'intro') {
  return render(
    <LanguageProvider>
      <ChapterExit chapterId={chapterId} />
    </LanguageProvider>
  );
}

afterEach(() => window.localStorage.removeItem('site-lang'));

describe('ChapterExit', () => {
  it('offers home and the next chapter', () => {
    renderChapterExit();

    expect(screen.getByRole('button', { name: content.en.ui.chapterExit.home })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Career Tree/i })).toBeInTheDocument();
  });

  it('scrolls home or the next configured chapter when selected', () => {
    renderChapterExit();

    fireEvent.click(screen.getByRole('button', { name: content.en.ui.chapterExit.home }));
    fireEvent.click(screen.getByRole('button', { name: /Career Tree/i }));

    expect(scrollMocks.scrollToScene).toHaveBeenCalledOnce();
    expect(scrollMocks.scrollToScene).toHaveBeenCalledWith('#scene-1');
    expect(transitionMocks.playChapterTransition).toHaveBeenCalledOnce();
    expect(transitionMocks.playChapterTransition).toHaveBeenCalledWith('#scene-3');
  });

  it('gives every chapter exit a distinct localized landmark name', () => {
    render(
      <LanguageProvider>
        {['intro', 'career', 'portfolio', 'contact'].map((chapterId) => (
          <ChapterExit key={chapterId} chapterId={chapterId} />
        ))}
      </LanguageProvider>
    );

    expect(screen.getAllByRole('complementary').map((landmark) => landmark.getAttribute('aria-label')))
      .toEqual([
        'Chapter exit: Introduction',
        'Chapter exit: Career Tree',
        'Chapter exit: Selected Work',
        'Chapter exit: Contact',
      ]);
  });

  it('uses Traditional Chinese labels when Chinese is selected', () => {
    window.localStorage.setItem('site-lang', 'zh');
    renderChapterExit();

    expect(screen.getByRole('complementary')).toHaveAccessibleName(
      `${content.zh.ui.chapterExit.landmark}: ${content.zh.ui.chapterExit.chapters.intro}`
    );
    expect(screen.getByRole('button', { name: content.zh.ui.chapterExit.home })).toBeInTheDocument();
  });
});
