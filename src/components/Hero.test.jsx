import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import Hero from './Hero';
import { LanguageProvider } from '../i18n/LanguageContext';
import { content } from '../data/content';

const scrollMocks = vi.hoisted(() => ({ scrollToScene: vi.fn() }));
const routeMocks = vi.hoisted(() => ({ navigateToRoute: vi.fn() }));
const transitionMocks = vi.hoisted(() => ({ playChapterTransition: vi.fn() }));

vi.mock('../lib/scrollToScene', () => scrollMocks);
vi.mock('../lib/siteRoute', () => routeMocks);
vi.mock('../lib/chapterTransition', () => transitionMocks);

function renderHero() {
  window.localStorage.setItem('site-lang', 'en');
  return render(
    <LanguageProvider>
      <Hero />
    </LanguageProvider>
  );
}

describe('Hero', () => {
  beforeEach(() => {
    scrollMocks.scrollToScene.mockReset();
    routeMocks.navigateToRoute.mockReset();
    transitionMocks.playChapterTransition.mockReset();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders one industrial observatory with four chapter controls and a back-facing character', () => {
    const { container } = renderHero();

    expect(container.querySelector('section')).toHaveAttribute('id', 'scene-1');
    expect(container.querySelector('.hero__observatory')).not.toBeNull();
    expect(screen.getByRole('navigation', { name: content.en.hero.switcherLabel })).toBeInTheDocument();

    for (const entry of content.en.hero.entries) {
      expect(screen.getByRole('button', { name: entry.label })).toBeInTheDocument();
    }

    expect(container.querySelectorAll('.hero__scene')).toHaveLength(1);
    expect(container.querySelector('.hero__character--hanging')).toBeNull();
    expect(container.querySelector('.hero__character--back')).not.toBeNull();
  });

  it('travels to each available chapter from the console', () => {
    renderHero();

    for (const entry of content.en.hero.entries.slice(0, 3)) {
      fireEvent.click(screen.getByRole('button', { name: entry.label }));
      expect(transitionMocks.playChapterTransition).toHaveBeenLastCalledWith(entry.target);
    }

    expect(transitionMocks.playChapterTransition).toHaveBeenCalledTimes(3);
    expect(scrollMocks.scrollToScene).not.toHaveBeenCalled();
  });

  it('cancels a queued parallax frame when the pointer leaves the observatory', () => {
    const requestFrame = vi.spyOn(window, 'requestAnimationFrame').mockReturnValue(42);
    const cancelFrame = vi.spyOn(window, 'cancelAnimationFrame');
    const { container } = renderHero();
    const section = container.querySelector('.hero');

    fireEvent.pointerMove(section, { clientX: 120, clientY: 180 });
    fireEvent.pointerLeave(section);

    expect(requestFrame).toHaveBeenCalledOnce();
    expect(cancelFrame).toHaveBeenLastCalledWith(42);
  });

  it('announces that the AI lab is being prepared', () => {
    renderHero();

    expect(screen.queryByRole('status')).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: content.en.hero.entries[3].label }));

    expect(screen.getByRole('status')).toHaveTextContent(/lab is being prepared/i);
    expect(scrollMocks.scrollToScene).not.toHaveBeenCalled();
  });

  it('opens the making-of route from the discarded-drafts bin', () => {
    renderHero();

    fireEvent.click(screen.getByRole('button', { name: /discarded drafts archive/i }));

    expect(routeMocks.navigateToRoute).toHaveBeenCalledWith('/making-of');
  });

  it('keeps the bookshelf decorative and outside the tab order', () => {
    const { container } = renderHero();
    const bookshelf = container.querySelector('.hero__bookshelf');

    expect(bookshelf).toHaveAttribute('aria-hidden', 'true');
    expect(bookshelf).not.toHaveAttribute('tabindex');
  });
});
