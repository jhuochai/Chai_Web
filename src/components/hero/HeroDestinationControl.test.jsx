import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import HeroDestinationControl from './HeroDestinationControl';

const motionState = { reduced: false };
vi.mock('motion/react', () => ({ useReducedMotion: () => motionState.reduced }));

describe('HeroDestinationControl', () => {
  afterEach(() => {
    vi.useRealTimers();
    motionState.reduced = false;
  });

  it('plays one tactile motion before activating', () => {
    vi.useFakeTimers();
    const onActivate = vi.fn();
    render(<HeroDestinationControl entry={{ id: 'career', label: '航跡樹站' }} image="/control.webp" motion="push" enabled onActivate={onActivate} />);

    const control = screen.getByRole('button', { name: '航跡樹站' });
    fireEvent.click(control);
    fireEvent.click(control);
    expect(onActivate).not.toHaveBeenCalled();
    expect(control).toHaveAttribute('data-motion', 'push');
    act(() => vi.advanceTimersByTime(450));
    expect(onActivate).toHaveBeenCalledOnce();
  });

  it('activates immediately with reduced motion and respects disabled state', () => {
    motionState.reduced = true;
    const onActivate = vi.fn();
    const { rerender } = render(<HeroDestinationControl entry={{ id: 'intro', label: '艦長辦公室' }} motion="pull" enabled={false} onActivate={onActivate} />);
    fireEvent.click(screen.getByRole('button'));
    expect(onActivate).not.toHaveBeenCalled();

    rerender(<HeroDestinationControl entry={{ id: 'intro', label: '艦長辦公室' }} motion="pull" enabled onActivate={onActivate} />);
    fireEvent.click(screen.getByRole('button'));
    expect(onActivate).toHaveBeenCalledOnce();
  });
});
