import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import Hero from './Hero';
import { LanguageProvider } from '../i18n/LanguageContext';

const routeMocks = vi.hoisted(() => ({ navigateToRoute: vi.fn() }));
vi.mock('../lib/siteRoute', () => routeMocks);
const motionState = vi.hoisted(() => ({ reduced: false }));
vi.mock('motion/react', async (importOriginal) => ({
  ...(await importOriginal()),
  useReducedMotion: () => motionState.reduced,
}));

const heroStyles = readFileSync(join(process.cwd(), 'src', 'components', 'Hero.css'), 'utf8');

function renderHero(props = {}) {
  window.localStorage.setItem('site-lang', 'en');
  return render(<LanguageProvider><Hero {...props} /></LanguageProvider>);
}

function pointerEvent(type, pointerId, clientY) {
  const event = new Event(type, { bubbles: true, cancelable: true });
  Object.defineProperties(event, { pointerId: { value: pointerId }, clientY: { value: clientY } });
  return event;
}

describe('Hero 2.5D cockpit', () => {
  beforeEach(() => {
    routeMocks.navigateToRoute.mockReset();
    motionState.reduced = false;
    window.sessionStorage.clear();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('starts as an empty cockpit and reveals the layered console on approach', () => {
    const { container } = renderHero();
    const cockpit = container.querySelector('.hero__cockpit');
    const archive = screen.getByRole('button', { name: /discarded drafts archive/i });
    expect(cockpit).toHaveAttribute('data-approach', '0');
    expect(archive).toBeEnabled();
    expect(container.querySelector('.hero__console-layer')).toBeInTheDocument();
    expect(container.querySelector('.hero__control-surface')).toBeInTheDocument();
    expect(container.querySelector('.hero__city-lights')).toBeInTheDocument();
    expect(container.querySelector('.hero__atmosphere')).toBeInTheDocument();
    expect(container.querySelector('.hero__captain')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: "Captain's Office" })).toBeDisabled();
    fireEvent.wheel(cockpit, { deltaY: -800 });
    expect(cockpit).toHaveAttribute('data-approach', '1');
    expect(window.sessionStorage.getItem('hero-approached')).toBe('1');
    expect(archive).toBeDisabled();
    expect(screen.getByRole('button', { name: "Captain's Office" })).toBeEnabled();
  });

  it('returns to the captain on reverse wheel without forgetting the session visit', () => {
    const { container } = renderHero();
    const cockpit = container.querySelector('.hero__cockpit');
    fireEvent.wheel(cockpit, { deltaY: -800 });
    fireEvent.wheel(cockpit, { deltaY: 800 });
    expect(cockpit).toHaveAttribute('data-approach', '0');
    expect(window.sessionStorage.getItem('hero-approached')).toBe('1');
  });

  it('starts near on a later Hero visit and under reduced motion', () => {
    window.sessionStorage.setItem('hero-approached', '1');
    const first = renderHero();
    expect(first.container.querySelector('.hero__cockpit')).toHaveAttribute('data-approach', '1');
    first.unmount();
    window.sessionStorage.clear();
    motionState.reduced = true;
    const second = renderHero();
    expect(second.container.querySelector('.hero__cockpit')).toHaveAttribute('data-approach', '1');
  });

  it('travels immediately when a destination control is clicked', () => {
    const onTravel = vi.fn();
    window.sessionStorage.setItem('hero-approached', '1');
    renderHero({ onTravel });
    fireEvent.click(screen.getByRole('button', { name: "Captain's Office" }));
    expect(onTravel).toHaveBeenCalledWith('/profile');
  });

  it('boots a hologram before entering the AI lab', () => {
    const onTravel = vi.fn();
    window.sessionStorage.setItem('hero-approached', '1');
    renderHero({ onTravel });
    fireEvent.click(screen.getByRole('button', { name: 'AI Lab' }));
    expect(screen.getByRole('dialog', { name: /AI Lab preview/i })).toBeInTheDocument();
    expect(onTravel).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole('button', { name: /Enter AI Lab/i }));
    expect(onTravel).toHaveBeenCalledWith('/ai-lab');
  });

  it('opens the making-of archive only from the distant cockpit', () => {
    const { container } = renderHero();
    const cockpit = container.querySelector('.hero__cockpit');
    const archive = screen.getByRole('button', { name: /discarded drafts archive/i });
    fireEvent.click(archive);
    expect(routeMocks.navigateToRoute).toHaveBeenCalledWith('/making-of');
    fireEvent.wheel(cockpit, { deltaY: -800 });
    expect(archive).toBeDisabled();
  });

  it('supports a deliberate upward swipe', () => {
    const { container } = renderHero();
    const cockpit = container.querySelector('.hero__cockpit');
    fireEvent.pointerDown(cockpit, { pointerId: 7, clientY: 420 });
    const move = pointerEvent('pointermove', 7, 350);
    fireEvent(cockpit, move);
    fireEvent.pointerUp(cockpit, { pointerId: 7, clientY: 350 });
    expect(cockpit).toHaveAttribute('data-approach', '1');
    expect(move.defaultPrevented).toBe(true);
  });

  it('places each mechanical control independently and provides reduced-motion fallbacks', () => {
    expect(heroStyles).toMatch(/\.hero__control--portfolio\s*\{[^}]*left:\s*12\.9%/s);
    expect(heroStyles).toMatch(/\.hero__control--career\s*\{[^}]*left:\s*40%/s);
    expect(heroStyles).toMatch(/\.hero__control--intro\s*\{[^}]*left:\s*66\.7%/s);
    expect(heroStyles).toMatch(/\.hero__control--ai-lab\s*\{[^}]*left:\s*90\.1%/s);
    expect(heroStyles).toMatch(/\.hero__trash-bin\s*\{[^}]*right:\s*5%[^}]*bottom:\s*13%/s);
    expect(heroStyles).toMatch(/@keyframes\s+hero-city-lights/s);
    expect(heroStyles).toMatch(/@keyframes\s+hero-atmosphere/s);
    expect(heroStyles).toMatch(/@media\s*\(prefers-reduced-motion:\s*reduce\)/s);
  });
});
