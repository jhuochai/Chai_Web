import { render } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => {
  const instance = {
    destroy: vi.fn(),
    on: vi.fn(),
    raf: vi.fn(),
    scrollTo: vi.fn(),
    start: vi.fn(),
    stop: vi.fn(),
  };
  const Lenis = vi.fn(function LenisMock() {
    return instance;
  });
  const ticker = {
    add: vi.fn(),
    lagSmoothing: vi.fn(),
    remove: vi.fn(),
  };
  const ScrollTrigger = {
    refresh: vi.fn(),
    update: vi.fn(),
  };

  return { instance, Lenis, ScrollTrigger, ticker };
});

vi.mock('lenis', () => ({ default: mocks.Lenis }));
vi.mock('gsap', () => ({
  gsap: {
    registerPlugin: vi.fn(),
    ticker: mocks.ticker,
  },
}));
vi.mock('gsap/ScrollTrigger', () => ({ ScrollTrigger: mocks.ScrollTrigger }));

import SmoothScroll from './SmoothScroll';
import { scrollToScene, setScrollEngine } from '../lib/scrollToScene';

describe('SmoothScroll', () => {
  afterEach(() => {
    setScrollEngine(null);
    vi.clearAllMocks();
  });

  it('shares one Lenis loop with GSAP and cleans it up on unmount', () => {
    const { unmount } = render(<SmoothScroll paused />);

    expect(mocks.Lenis).toHaveBeenCalledWith(
      expect.objectContaining({
        anchors: true,
        autoRaf: false,
        respectReducedMotion: true,
        stopInertiaOnNavigate: true,
      })
    );
    expect(mocks.instance.on).toHaveBeenCalledWith('scroll', mocks.ScrollTrigger.update);
    expect(mocks.ticker.add).toHaveBeenCalledTimes(1);
    expect(mocks.instance.stop).toHaveBeenCalled();

    const tickerCallback = mocks.ticker.add.mock.calls[0][0];
    tickerCallback(1.5);
    expect(mocks.instance.raf).toHaveBeenCalledWith(1500);

    scrollToScene('#scene-3');
    expect(mocks.instance.scrollTo).toHaveBeenCalledWith(
      '#scene-3',
      expect.objectContaining({ duration: 1.05 })
    );

    unmount();
    expect(mocks.ticker.remove).toHaveBeenCalledWith(tickerCallback);
    expect(mocks.instance.destroy).toHaveBeenCalledTimes(1);
  });
});
