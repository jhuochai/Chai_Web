import { act, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import ShuffleText from './ShuffleText';

const motionState = vi.hoisted(() => ({ reduced: false }));
vi.mock('motion/react', async (importOriginal) => ({
  ...(await importOriginal()),
  useReducedMotion: () => motionState.reduced,
}));

describe('ShuffleText', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    motionState.reduced = false;
  });
  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  it('keeps the complete unicode text available while decorative glyphs shuffle once', () => {
    const onComplete = vi.fn();
    render(<ShuffleText text="職涯 Route 2.0 🚀" active onComplete={onComplete} />);

    expect(screen.getByText('職涯 Route 2.0 🚀')).toBeInTheDocument();
    expect(screen.getByText('職涯 Route 2.0 🚀')).toHaveClass('shuffle-text__accessible');
    act(() => vi.advanceTimersByTime(600));
    expect(onComplete).toHaveBeenCalledOnce();
  });

  it('cancels a stale run when the text changes and finishes the current text once', () => {
    const onComplete = vi.fn();
    const { rerender } = render(<ShuffleText text="First" active onComplete={onComplete} />);
    act(() => vi.advanceTimersByTime(80));
    rerender(<ShuffleText text="Next" active onComplete={onComplete} />);
    act(() => vi.advanceTimersByTime(600));

    expect(onComplete).toHaveBeenCalledOnce();
    expect(screen.getByText('Next', { selector: '.shuffle-text__accessible' })).toBeInTheDocument();
  });

  it('shows final text and completes immediately under reduced motion', () => {
    motionState.reduced = true;
    const onComplete = vi.fn();
    render(<ShuffleText text="Analysis Bay" active onComplete={onComplete} />);

    expect(screen.getByText('Analysis Bay', { selector: '.shuffle-text__accessible' })).toBeInTheDocument();
    expect(onComplete).toHaveBeenCalledOnce();
  });
});
