import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import Hero from './Hero';
import { LanguageProvider } from '../i18n/LanguageContext';
import { content } from '../data/content';

const routeMocks = vi.hoisted(() => ({ navigateToRoute: vi.fn() }));
vi.mock('../lib/siteRoute', () => routeMocks);

const motionState = vi.hoisted(() => ({ reduced: false }));
vi.mock('motion/react', async (importOriginal) => ({
  ...(await importOriginal()),
  useReducedMotion: () => motionState.reduced,
}));

function renderHero(props = {}) {
  window.localStorage.setItem('site-lang', 'en');
  return render(<LanguageProvider><Hero {...props} /></LanguageProvider>);
}

describe('Hero cockpit', () => {
  beforeEach(() => {
    routeMocks.navigateToRoute.mockReset();
    motionState.reduced = false;
  });

  afterEach(() => vi.restoreAllMocks());

  it('uses tactile cockpit controls instead of a vertical entry list or hash targets', () => {
    const { container } = renderHero();

    expect(container.querySelector('.hero__cockpit')).toBeInTheDocument();
    expect(container.querySelector('.hero__control-desk')).toBeInTheDocument();
    expect(container.querySelector('.hero__entries')).toBeNull();
    expect(content.en.hero.entries.every((entry) => !entry.target?.startsWith('#'))).toBe(true);
  });

  it('sends the three formal controls through pathname travel and keeps AI non-navigable', () => {
    const onTravel = vi.fn();
    renderHero({ onTravel });

    for (const entry of content.en.hero.entries.slice(0, 3)) {
      fireEvent.click(screen.getByRole('button', { name: entry.label }));
      expect(onTravel).toHaveBeenLastCalledWith(entry.target);
    }

    fireEvent.click(screen.getByRole('button', { name: content.en.hero.entries[3].label }));
    expect(onTravel).toHaveBeenCalledTimes(3);
    expect(screen.getByRole('status')).toHaveTextContent(/prepared/i);
  });

  it('renders a discoverable metal archive bin with original monkey graffiti', () => {
    const { container } = renderHero();

    expect(container.querySelector('.hero__trash-bin')).toBeInTheDocument();
    expect(container.querySelector('.hero__trash-graffiti')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /discarded drafts archive/i }));
    expect(routeMocks.navigateToRoute).toHaveBeenCalledWith('/making-of');
  });

  it('maps forward wheel approach to a nearer cockpit and reverse wheel back to captain', () => {
    const { container } = renderHero();
    const cockpit = container.querySelector('.hero__cockpit');

    expect(cockpit).toHaveAttribute('data-approach', '0');
    fireEvent.wheel(cockpit, { deltaY: -800 });
    expect(cockpit).toHaveAttribute('data-approach', '1');
    expect(container.querySelector('.hero__captain--near')).toBeInTheDocument();
    expect(container.querySelector('.hero__contact-shadow')).toBeInTheDocument();

    fireEvent.wheel(cockpit, { deltaY: 800 });
    expect(cockpit).toHaveAttribute('data-approach', '0');
    expect(container.querySelector('.hero__captain--initial')).toBeInTheDocument();
  });

  it('does not bind cockpit wheel motion when reduced motion is requested', () => {
    motionState.reduced = true;
    const { container, unmount } = renderHero();
    const cockpit = container.querySelector('.hero__cockpit');

    expect(cockpit).toHaveAttribute('data-approach', '1');
    fireEvent.wheel(cockpit, { deltaY: 800 });
    expect(cockpit).toHaveAttribute('data-approach', '1');
    unmount();
  });

  it('unbinds the native approach listener when the cockpit unmounts', () => {
    const removeListener = vi.spyOn(HTMLElement.prototype, 'removeEventListener');
    const { unmount } = renderHero();
    unmount();
    expect(removeListener.mock.calls.some(([event]) => event === 'wheel')).toBe(true);
  });
});
