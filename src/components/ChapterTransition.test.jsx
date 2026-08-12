import { act, fireEvent, render } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import ChapterTransition from './ChapterTransition';
import { playChapterTransition } from '../lib/chapterTransition';

const motionState = vi.hoisted(() => ({ reduced: false }));

vi.mock('motion/react', async (importOriginal) => ({
  ...(await importOriginal()),
  useReducedMotion: () => motionState.reduced,
}));

describe('ChapterTransition', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    motionState.reduced = false;
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  it('renders no overlay or walker until a valid navigation request starts', () => {
    const { container } = render(<ChapterTransition onTravel={() => {}} />);

    expect(container.querySelector('.chapter-transition')).toBeNull();
    expect(container.querySelector('.chapter-transition__walker')).toBeNull();

    act(() => playChapterTransition('not a selector'));
    expect(container.querySelector('.chapter-transition')).toBeNull();

    act(() => playChapterTransition('#scene-3'));
    expect(container.querySelector('.chapter-transition')).not.toBeNull();
    expect(container.querySelector('.chapter-transition__walker')).not.toBeNull();
    expect(container.querySelectorAll('.chapter-transition__walker-frame')).toHaveLength(4);
  });

  it('travels exactly once at 62 percent and clears the transition at 900ms', () => {
    const onTravel = vi.fn();
    const { container } = render(<ChapterTransition onTravel={onTravel} />);

    act(() => playChapterTransition('#scene-5'));
    act(() => vi.advanceTimersByTime(557));
    expect(onTravel).not.toHaveBeenCalled();

    act(() => vi.advanceTimersByTime(1));
    expect(onTravel).toHaveBeenCalledOnce();
    expect(onTravel).toHaveBeenCalledWith('#scene-5', { immediate: false });

    act(() => vi.advanceTimersByTime(342));
    expect(onTravel).toHaveBeenCalledOnce();
    expect(container.querySelector('.chapter-transition')).toBeNull();
  });

  it('moves keyboard focus into the destination without triggering a second scroll', () => {
    const onTravel = vi.fn();
    render(
      <>
        <section id="scene-3"><h2>Career Tree</h2></section>
        <ChapterTransition onTravel={onTravel} />
      </>
    );

    act(() => playChapterTransition('#scene-3'));
    act(() => vi.advanceTimersByTime(558));

    expect(onTravel).toHaveBeenCalledOnce();
    expect(document.activeElement).toBe(document.querySelector('#scene-3 h2'));
  });

  it('ignores repeated travel requests while one transition owns the screen', () => {
    const onTravel = vi.fn();
    render(<ChapterTransition onTravel={onTravel} />);

    act(() => {
      playChapterTransition('#scene-3');
      playChapterTransition('#scene-7');
      vi.advanceTimersByTime(900);
    });

    expect(onTravel).toHaveBeenCalledOnce();
    expect(onTravel).toHaveBeenCalledWith('#scene-3', { immediate: false });
  });

  it('travels immediately with only a short crossfade under reduced motion', () => {
    motionState.reduced = true;
    const onTravel = vi.fn();
    const { container } = render(<ChapterTransition onTravel={onTravel} />);

    act(() => playChapterTransition('#scene-2'));

    expect(onTravel).toHaveBeenCalledOnce();
    expect(onTravel).toHaveBeenCalledWith('#scene-2', { immediate: true });
    expect(container.querySelector('.chapter-transition--reduced')).not.toBeNull();
    expect(container.querySelector('.chapter-transition__walker')).toBeNull();

    act(() => vi.advanceTimersByTime(180));
    expect(container.querySelector('.chapter-transition')).toBeNull();
  });

  it('clears pending travel work and the global listener when unmounted', () => {
    const onTravel = vi.fn();
    const { unmount } = render(<ChapterTransition onTravel={onTravel} />);

    act(() => playChapterTransition('#scene-3'));
    unmount();
    act(() => {
      vi.advanceTimersByTime(900);
      playChapterTransition('#scene-5');
      vi.advanceTimersByTime(900);
    });

    expect(onTravel).not.toHaveBeenCalled();
  });

  it('never starts an idle interval', () => {
    const intervalSpy = vi.spyOn(window, 'setInterval');
    render(<ChapterTransition onTravel={() => {}} />);

    fireEvent(window, new CustomEvent('chapter-transition:start', { detail: '#scene-3' }));

    expect(intervalSpy).not.toHaveBeenCalled();
  });
});
