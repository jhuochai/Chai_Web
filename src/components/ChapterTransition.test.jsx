import { act, fireEvent, render } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { LanguageProvider } from '../i18n/LanguageContext';
import ChapterTransition from './ChapterTransition';
import { playStationTransition } from '../lib/chapterTransition';

const motionState = vi.hoisted(() => ({ reduced: false }));

vi.mock('motion/react', async (importOriginal) => ({
  ...(await importOriginal()),
  useReducedMotion: () => motionState.reduced,
}));

function renderTransition(onTravel) {
  return render(<LanguageProvider><ChapterTransition onTravel={onTravel} /></LanguageProvider>);
}

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
    const { container } = renderTransition(() => {});

    expect(container.querySelector('.chapter-transition')).toBeNull();
    expect(container.querySelector('.chapter-transition__walker')).toBeNull();

    act(() => playStationTransition('/making-of'));
    expect(container.querySelector('.chapter-transition')).toBeNull();

    act(() => playStationTransition('/career-tree'));
    expect(container.querySelector('.chapter-transition')).not.toBeNull();
    expect(container.querySelector('.chapter-transition__walker')).not.toBeNull();
    expect(container.querySelectorAll('.chapter-transition__walker-frame')).toHaveLength(4);
    expect(container.querySelector('.chapter-transition__frame')).not.toBeNull();
  });

  it('travels exactly once at the 50 percent midpoint and clears the transition at 900ms', () => {
    const onTravel = vi.fn();
    const { container } = renderTransition(onTravel);

    act(() => playStationTransition('/portfolio'));
    act(() => vi.advanceTimersByTime(449));
    expect(onTravel).not.toHaveBeenCalled();

    act(() => vi.advanceTimersByTime(1));
    expect(onTravel).toHaveBeenCalledOnce();
    expect(onTravel).toHaveBeenCalledWith('/portfolio', { immediate: false });

    act(() => vi.advanceTimersByTime(450));
    expect(onTravel).toHaveBeenCalledOnce();
    expect(container.querySelector('.chapter-transition')).toBeNull();
  });

  it('keeps a localized one-language arrival indicator at the midpoint', () => {
    const onTravel = vi.fn();
    const { container } = renderTransition(onTravel);

    act(() => playStationTransition('/career-tree'));
    act(() => vi.advanceTimersByTime(450));

    expect(onTravel).toHaveBeenCalledOnce();
    expect(container.querySelector('.chapter-transition__arrival')).toHaveTextContent('Route Tree Station');
    expect(container.querySelector('.chapter-transition__arrival')).not.toHaveTextContent('職涯路線樹站');
  });

  it('ignores repeated travel requests while one transition owns the screen', () => {
    const onTravel = vi.fn();
    renderTransition(onTravel);

    act(() => {
      playStationTransition('/career-tree');
      playStationTransition('/portfolio');
      vi.advanceTimersByTime(900);
    });

    expect(onTravel).toHaveBeenCalledOnce();
    expect(onTravel).toHaveBeenCalledWith('/career-tree', { immediate: false });
  });

  it('travels immediately with only a short crossfade under reduced motion', () => {
    motionState.reduced = true;
    const onTravel = vi.fn();
    const { container } = renderTransition(onTravel);

    act(() => playStationTransition('/profile'));

    expect(onTravel).toHaveBeenCalledOnce();
    expect(onTravel).toHaveBeenCalledWith('/profile', { immediate: true });
    expect(container.querySelector('.chapter-transition--reduced')).not.toBeNull();
    expect(container.querySelector('.chapter-transition__walker')).toBeNull();

    act(() => vi.advanceTimersByTime(180));
    expect(container.querySelector('.chapter-transition')).toBeNull();
  });

  it('clears pending travel work and the global listener when unmounted', () => {
    const onTravel = vi.fn();
    const { unmount } = renderTransition(onTravel);

    act(() => playStationTransition('/career-tree'));
    unmount();
    act(() => {
      vi.advanceTimersByTime(900);
      playStationTransition('/portfolio');
      vi.advanceTimersByTime(900);
    });

    expect(onTravel).not.toHaveBeenCalled();
  });

  it('never starts an idle interval', () => {
    const intervalSpy = vi.spyOn(window, 'setInterval');
    renderTransition(() => {});

    fireEvent(window, new CustomEvent('station-transition:start', { detail: '/career-tree' }));

    expect(intervalSpy).not.toHaveBeenCalled();
  });

});
