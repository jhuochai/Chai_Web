import { render, screen } from '@testing-library/react';
import Hero from './Hero';
import { LanguageProvider } from '../i18n/LanguageContext';

function renderHero() {
  return render(
    <LanguageProvider>
      <Hero />
    </LanguageProvider>
  );
}

describe('Hero', () => {
  it('renders as #scene-1', () => {
    const { container } = renderHero();
    expect(container.querySelector('section')).toHaveAttribute('id', 'scene-1');
  });

  it('shows the badge and the deco-framed nameplate', () => {
    const { container } = renderHero();
    expect(screen.getAllByText('Game Marketing Coordinator').length).toBeGreaterThan(0);
    expect(container.querySelector('.framed-panel--deco')).not.toBeNull();
  });

  it('shows all three real highlight stats', () => {
    renderHero();
    expect(screen.getByText(/67%/)).toBeInTheDocument();
    expect(screen.getByText(/IG follower growth/)).toBeInTheDocument();
    expect(screen.getByText(/GA/)).toBeInTheDocument();
    expect(screen.getByText(/24/)).toBeInTheDocument();
  });

  it('has no video element anymore', () => {
    const { container } = renderHero();
    expect(container.querySelector('video')).toBeNull();
  });
});
