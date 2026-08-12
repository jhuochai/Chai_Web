import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import Hero from './Hero';
import { LanguageProvider } from '../i18n/LanguageContext';
import { content } from '../data/content';

const scrollMocks = vi.hoisted(() => ({ scrollToScene: vi.fn() }));
const routeMocks = vi.hoisted(() => ({ navigateToRoute: vi.fn() }));

vi.mock('../lib/scrollToScene', () => scrollMocks);
vi.mock('../lib/siteRoute', () => routeMocks);

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

    fireEvent.click(screen.getByRole('button', { name: content.en.hero.entries[1].label }));

    expect(scrollMocks.scrollToScene).toHaveBeenCalledWith('#scene-3', { immediate: false });
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
