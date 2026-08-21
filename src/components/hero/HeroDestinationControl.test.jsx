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

  it('activates immediately while preventing a duplicate tactile action', () => {
    vi.useFakeTimers();
    const onActivate = vi.fn();
    render(<HeroDestinationControl entry={{ id: 'career', label: '航跡樹站' }} image="/control.webp" motion="push" enabled onActivate={onActivate} />);

    const control = screen.getByRole('button', { name: '航跡樹站' });
    fireEvent.click(control);
    fireEvent.click(control);
    expect(onActivate).toHaveBeenCalledOnce();
    expect(control).toHaveAttribute('data-motion', 'push');
    act(() => vi.runAllTimers());
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
