import { act, render } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { LanguageProvider } from '../i18n/LanguageContext';
import ChapterTransition from './ChapterTransition';
import { playStationTransition } from '../lib/chapterTransition';

const motionState = vi.hoisted(() => ({ reduced: false }));
vi.mock('motion/react', async (original) => ({ ...(await original()), useReducedMotion: () => motionState.reduced }));
vi.mock('../lib/sceneReady', () => ({ preloadImages: () => Promise.resolve() }));
const tick = (ms) => act(() => vi.advanceTimersByTimeAsync(ms));
const start = (path = '/profile') => act(() => { playStationTransition(path); });
const mount = (props = {}) => render(<LanguageProvider><ChapterTransition {...props} /></LanguageProvider>);

describe('loading-gated spacecraft door', () => {
  beforeEach(() => { vi.useFakeTimers(); motionState.reduced = false; });
  afterEach(() => { vi.useRealTimers(); });

  it('starts closed, keeps the door shut for pending destination assets, then opens and restores interaction', async () => {
    let ready;
    const onTravel = vi.fn(() => new Promise((resolve) => { ready = resolve; }));
    const onComplete = vi.fn();
    const onActiveChange = vi.fn();
    const { container } = mount({ onTravel, onComplete, onActiveChange });
    start('/making-of');
    expect(container.querySelector('.chapter-transition')).toBeNull();
    start();
    expect(container.querySelector('.chapter-transition')).toHaveAttribute('data-phase', 'closed');
    expect(document.body.style.overflow).toBe('hidden');
    await tick(3000);
    expect(onTravel).toHaveBeenCalledOnce();
    expect(container.querySelector('.chapter-transition')).toHaveAttribute('data-phase', 'closed');
    expect(onComplete).not.toHaveBeenCalled();
    await act(async () => ready());
    expect(container.querySelector('.chapter-transition')).toHaveAttribute('data-phase', 'opening');
    await tick(1000);
    expect(container.querySelector('.chapter-transition')).toHaveAttribute('data-phase', 'exiting');
    await tick(260);
    expect(container.querySelector('.chapter-transition')).toBeNull();
    expect(document.body.style.overflow).not.toBe('hidden');
    expect(onComplete).toHaveBeenCalledWith('/profile');
    expect(onActiveChange.mock.calls).toEqual([[true], [false]]);
  });

  it('ignores repeated requests and uses the same artwork for fixed frame and moving leaf', async () => {
    const onTravel = vi.fn();
    const { container } = mount({ onTravel });
    start('/career-tree');
    start('/portfolio');
    await tick(400);
    expect(onTravel).toHaveBeenCalledOnce();
    expect(onTravel.mock.calls[0][0]).toBe('/career-tree');
    expect(container.querySelector('.chapter-transition__surround').src).toBe(container.querySelector('.chapter-transition__leaf').src);
    expect(container.querySelector('[role="status"]')).toHaveTextContent('Route Tree Station');
  });

  it('waits for loading under reduced motion, then only fades', async () => {
    motionState.reduced = true;
    let ready;
    const onTravel = vi.fn(() => new Promise((resolve) => { ready = resolve; }));
    const { container } = mount({ onTravel });
    start();
    expect(onTravel).toHaveBeenCalledOnce();
    await tick(1000);
    expect(container.querySelector('.chapter-transition')).toHaveAttribute('data-phase', 'closed');
    await act(async () => ready());
    expect(container.querySelector('.chapter-transition')).toHaveAttribute('data-phase', 'exiting');
    expect(container.querySelector('.chapter-transition--reduced')).not.toBeNull();
    await tick(180);
    expect(container.querySelector('.chapter-transition')).toBeNull();
  });

  it('releases the screen even if destination preparation rejects', async () => {
    const { container } = mount({ onTravel: () => Promise.reject(new Error('asset failed')) });
    start();
    await tick(1800);
    expect(container.querySelector('.chapter-transition')).toBeNull();
    expect(document.body.style.overflow).not.toBe('hidden');
  });

  it('cancels pending travel on unmount', async () => {
    const onTravel = vi.fn();
    const { unmount } = mount({ onTravel });
    start();
    unmount();
    await tick(2000);
    expect(onTravel).not.toHaveBeenCalled();
    expect(document.body.style.overflow).not.toBe('hidden');
  });
});
