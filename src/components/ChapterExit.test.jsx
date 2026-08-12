import { fireEvent, render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import ChapterExit from './ChapterExit';

const scrollMocks = vi.hoisted(() => ({ scrollToScene: vi.fn() }));

vi.mock('../lib/scrollToScene', () => scrollMocks);

describe('ChapterExit', () => {
  it('offers home and the next chapter', () => {
    render(<ChapterExit chapterId="intro" />);

    expect(screen.getByRole('button', { name: /回到首頁/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /職涯故事/i })).toBeInTheDocument();
  });

  it('scrolls home or the next configured chapter when selected', () => {
    render(<ChapterExit chapterId="intro" />);

    fireEvent.click(screen.getByRole('button', { name: /回到首頁/i }));
    fireEvent.click(screen.getByRole('button', { name: /職涯故事/i }));

    expect(scrollMocks.scrollToScene).toHaveBeenNthCalledWith(1, '#scene-1');
    expect(scrollMocks.scrollToScene).toHaveBeenNthCalledWith(2, '#scene-3');
  });
});
