import { render, screen, fireEvent } from '@testing-library/react';
import Hero from './Hero';
import { LanguageProvider } from '../i18n/LanguageContext';
import { content } from '../data/content';

function renderHero() {
  return render(
    <LanguageProvider>
      <Hero />
    </LanguageProvider>
  );
}

describe('Hero', () => {
  it('renders as #scene-1 with the tagline and no frame/stats clutter', () => {
    const { container } = renderHero();
    expect(container.querySelector('section')).toHaveAttribute('id', 'scene-1');
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      content.en.hero.tagline
    );
    expect(container.querySelector('.framed-panel')).toBeNull();
    expect(container.querySelector('.hero__stats')).toBeNull();
    expect(container.querySelector('video')).toBeNull();
  });

  it('shows all three scene switch buttons with the first active', () => {
    renderHero();
    for (const scene of content.en.hero.scenes) {
      expect(screen.getByRole('button', { name: scene.label })).toBeInTheDocument();
    }
    expect(screen.getByRole('button', { name: 'Starry Night' })).toHaveAttribute(
      'aria-pressed',
      'true'
    );
  });

  it('switches the active scene on click', () => {
    const { container } = renderHero();
    fireEvent.click(screen.getByRole('button', { name: 'Daylight Tree' }));
    expect(screen.getByRole('button', { name: 'Daylight Tree' })).toHaveAttribute(
      'aria-pressed',
      'true'
    );
    expect(screen.getByRole('button', { name: 'Starry Night' })).toHaveAttribute(
      'aria-pressed',
      'false'
    );
    expect(container.querySelectorAll('.hero__scene--active')).toHaveLength(1);
  });

  it('ignores clicks during the crossfade cooldown', () => {
    renderHero();
    fireEvent.click(screen.getByRole('button', { name: 'Daylight Tree' }));
    fireEvent.click(screen.getByRole('button', { name: 'Night Bloom' }));
    expect(screen.getByRole('button', { name: 'Daylight Tree' })).toHaveAttribute(
      'aria-pressed',
      'true'
    );
    expect(screen.getByRole('button', { name: 'Night Bloom' })).toHaveAttribute(
      'aria-pressed',
      'false'
    );
  });
});
