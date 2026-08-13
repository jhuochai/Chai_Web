import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import Hero from './Hero';
import { LanguageProvider } from '../i18n/LanguageContext';
import { content } from '../data/content';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

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
  Object.defineProperties(event, {
    pointerId: { value: pointerId },
    clientY: { value: clientY },
  });
  return event;
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

  it('consumes one deliberate pointer move immediately and does not replay it on pointerup', () => {
    const { container } = renderHero();
    const cockpit = container.querySelector('.hero__cockpit');
    const forwardMove = pointerEvent('pointermove', 7, 356);

    fireEvent.pointerDown(cockpit, { pointerId: 7, clientY: 420 });
    fireEvent(cockpit, forwardMove);
    expect(cockpit).toHaveAttribute('data-approach', '1');
    expect(forwardMove.defaultPrevented).toBe(true);

    const repeatMove = pointerEvent('pointermove', 7, 320);
    fireEvent(cockpit, repeatMove);
    fireEvent.pointerUp(cockpit, { pointerId: 7, clientY: 320 });
    expect(cockpit).toHaveAttribute('data-approach', '1');
    expect(repeatMove.defaultPrevented).toBe(true);

    fireEvent.pointerDown(cockpit, { pointerId: 8, clientY: 356 });
    const backwardMove = pointerEvent('pointermove', 8, 432);
    fireEvent(cockpit, backwardMove);
    expect(cockpit).toHaveAttribute('data-approach', '0');
    expect(backwardMove.defaultPrevented).toBe(true);
  });

  it('ignores taps and clears an interrupted pointer gesture without changing approach', () => {
    const { container } = renderHero();
    const cockpit = container.querySelector('.hero__cockpit');

    fireEvent.pointerDown(cockpit, { pointerId: 11, clientY: 300 });
    fireEvent.pointerMove(cockpit, { pointerId: 11, clientY: 282 });
    fireEvent.pointerUp(cockpit, { pointerId: 11, clientY: 282 });
    expect(cockpit).toHaveAttribute('data-approach', '0');

    fireEvent.pointerDown(cockpit, { pointerId: 12, clientY: 300 });
    fireEvent.pointerCancel(cockpit, { pointerId: 12 });
    fireEvent.pointerMove(cockpit, { pointerId: 12, clientY: 220 });
    expect(cockpit).toHaveAttribute('data-approach', '0');

    fireEvent.pointerDown(cockpit, { pointerId: 13, clientY: 300 });
    fireEvent(window, new Event('blur'));
    fireEvent.pointerMove(cockpit, { pointerId: 13, clientY: 220 });
    expect(cockpit).toHaveAttribute('data-approach', '0');

    fireEvent.pointerDown(cockpit, { pointerId: 14, clientY: 300 });
    fireEvent.lostPointerCapture(cockpit, { pointerId: 14 });
    fireEvent.pointerMove(cockpit, { pointerId: 14, clientY: 220 });
    expect(cockpit).toHaveAttribute('data-approach', '0');
  });

  it('does not prevent a pointer gesture that tries to move past an approach boundary', () => {
    const { container } = renderHero();
    const cockpit = container.querySelector('.hero__cockpit');
    const down = pointerEvent('pointerdown', 15, 300);
    const move = pointerEvent('pointermove', 15, 390);

    fireEvent(cockpit, down);
    fireEvent(cockpit, move);

    expect(cockpit).toHaveAttribute('data-approach', '0');
    expect(move.defaultPrevented).toBe(false);
  });

  it('does not bind cockpit wheel motion when reduced motion is requested', () => {
    motionState.reduced = true;
    const { container, unmount } = renderHero();
    const cockpit = container.querySelector('.hero__cockpit');

    expect(cockpit).toHaveAttribute('data-approach', '1');
    fireEvent.wheel(cockpit, { deltaY: 800 });
    expect(cockpit).toHaveAttribute('data-approach', '1');
    fireEvent.pointerDown(cockpit, { pointerId: 21, clientY: 250 });
    fireEvent.pointerMove(cockpit, { pointerId: 21, clientY: 340 });
    expect(cockpit).toHaveAttribute('data-approach', '1');
    unmount();
  });

  it('unbinds the native approach listener when the cockpit unmounts', () => {
    const removeListener = vi.spyOn(HTMLElement.prototype, 'removeEventListener');
    const { unmount } = renderHero();
    unmount();
    expect(removeListener.mock.calls.some(([event]) => event === 'wheel')).toBe(true);
    expect(removeListener.mock.calls.some(([event]) => event === 'pointerdown')).toBe(true);
    expect(removeListener.mock.calls.some(([event]) => event === 'pointermove')).toBe(true);
  });

  it('keeps a readable archive hint visible in the compact mobile rule', () => {
    expect(heroStyles).toMatch(
      /@media\s*\(max-width:700px\)[\s\S]*?\.hero__trash-hint\{[^}]*display:(?:block|inline-block)[^}]*white-space:normal/s
    );
    expect(heroStyles).not.toMatch(
      /@media\s*\(max-width:700px\)[\s\S]*?\.hero__trash-hint\{[^}]*display:\s*none/s
    );
  });
});
