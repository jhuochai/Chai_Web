import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import Hero from './Hero';
import { LanguageProvider } from '../i18n/LanguageContext';
import { content } from '../data/content';

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

  it('shows the three short scene labels with the first active', () => {
    renderHero();
    for (const scene of content.en.hero.scenes) {
      expect(screen.getByRole('button', { name: new RegExp(scene.label) })).toBeInTheDocument();
    }
    expect(screen.getByRole('button', { name: /Star/ })).toHaveAttribute('aria-pressed', 'true');
  });

  it('switches the scene when the pointer rests on a label', () => {
    const { container } = renderHero();
    fireEvent.mouseEnter(screen.getByRole('button', { name: /Day/ }));
    expect(screen.getByRole('button', { name: /Day/ })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: /Star/ })).toHaveAttribute('aria-pressed', 'false');
    expect(container.querySelectorAll('.hero__scene--active')).toHaveLength(1);
  });

  it('ignores further switches during the crossfade cooldown', () => {
    renderHero();
    fireEvent.mouseEnter(screen.getByRole('button', { name: /Day/ }));
    fireEvent.mouseEnter(screen.getByRole('button', { name: /Night/ }));
    expect(screen.getByRole('button', { name: /Day/ })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: /Night/ })).toHaveAttribute('aria-pressed', 'false');
  });
});
