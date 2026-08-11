import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import Hero from './Hero';
import { LanguageProvider } from '../i18n/LanguageContext';
import { content } from '../data/content';

const scrollMocks = vi.hoisted(() => ({ scrollToScene: vi.fn() }));

vi.mock('../lib/scrollToScene', () => scrollMocks);

vi.mock('./LiquidEther', () => ({
  default: () => <div data-testid="liquid-ether-stub" />,
}));

function renderHero() {
  return render(
    <LanguageProvider>
      <Hero />
    </LanguageProvider>
  );
}

describe('Hero', () => {
  it('renders as #scene-1 with the tagline inside the glass window, no frame/stats clutter', () => {
    const { container } = renderHero();
    expect(container.querySelector('section')).toHaveAttribute('id', 'scene-1');
    expect(container.querySelector('.hero__window')).not.toBeNull();
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(content.en.hero.tagline);
    expect(container.querySelector('.framed-panel')).toBeNull();
    expect(container.querySelector('.hero__stats')).toBeNull();
    expect(container.querySelector('video')).toBeNull();
  });

  it('shows the three chapter labels with the first active', () => {
    renderHero();
    for (const scene of content.en.hero.scenes) {
      expect(screen.getByRole('button', { name: new RegExp(scene.label) })).toBeInTheDocument();
    }
    expect(screen.getByRole('button', { name: /Work/ })).toHaveAttribute('aria-pressed', 'true');
  });

  it('switches the scene when the pointer rests on a label', () => {
    const { container } = renderHero();
    fireEvent.mouseEnter(screen.getByRole('button', { name: /Career/ }));
    expect(screen.getByRole('button', { name: /Career/ })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: /Work/ })).toHaveAttribute('aria-pressed', 'false');
    expect(container.querySelectorAll('.hero__scene--active')).toHaveLength(1);
  });

  it('ignores further switches during the crossfade cooldown', () => {
    renderHero();
    fireEvent.mouseEnter(screen.getByRole('button', { name: /Career/ }));
    fireEvent.mouseEnter(screen.getByRole('button', { name: /Games/ }));
    expect(screen.getByRole('button', { name: /Career/ })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: /Games/ })).toHaveAttribute('aria-pressed', 'false');
  });

  it('broadcasts the career-tree mode when a chapter is clicked', () => {
    renderHero();
    const heard = [];
    const onMode = (event) => heard.push(event.detail);
    window.addEventListener('career-tree:mode', onMode);
    fireEvent.click(screen.getByRole('button', { name: /Games/ }));
    window.removeEventListener('career-tree:mode', onMode);
    expect(heard).toEqual(['night']);
    expect(scrollMocks.scrollToScene).toHaveBeenCalledWith('#scene-3', { immediate: false });
  });
});
