import { afterEach, describe, expect, it, vi } from 'vitest';
import { scrollToScene, setScrollEngine } from './scrollToScene';

describe('scrollToScene', () => {
  afterEach(() => {
    setScrollEngine(null);
    vi.restoreAllMocks();
  });

  it('uses the shared smooth-scroll engine when it is ready', () => {
    const engine = { scrollTo: vi.fn() };
    setScrollEngine(engine);

    scrollToScene('#scene-3', { immediate: false });

    expect(engine.scrollTo).toHaveBeenCalledWith(
      '#scene-3',
      expect.objectContaining({ immediate: false, duration: 1.05 })
    );
  });

  it('falls back to native scrolling when the engine is unavailable', () => {
    const scrollIntoView = vi.fn();
    vi.spyOn(document, 'querySelector').mockReturnValue({ scrollIntoView });

    scrollToScene('#scene-3', { immediate: true });

    expect(scrollIntoView).toHaveBeenCalledWith({ behavior: 'auto' });
  });
});
