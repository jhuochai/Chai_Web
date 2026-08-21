import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import StapuPet from './StapuPet';

const motionState = { reduced: false };
vi.mock('motion/react', () => ({ useReducedMotion: () => motionState.reduced }));

describe('StapuPet', () => {
  afterEach(() => {
    vi.useRealTimers();
    motionState.reduced = false;
  });

  it('starts running, advances frames, and can be inspected', () => {
    vi.useFakeTimers();
    const onInspect = vi.fn();
    render(<StapuPet onInspect={onInspect} />);
    const pet = screen.getByRole('button', { name: /Stapu/i });
    expect(pet).toHaveAttribute('data-state', 'running-right');
    const firstX = pet.querySelector('img').style.getPropertyValue('--stapu-x');
    act(() => vi.advanceTimersByTime(140));
    expect(pet.querySelector('img').style.getPropertyValue('--stapu-x')).not.toBe(firstX);
    fireEvent.click(pet);
    expect(onInspect).toHaveBeenCalledOnce();
  });

  it('freezes in idle for reduced motion', () => {
    motionState.reduced = true;
    render(<StapuPet onInspect={() => {}} />);
    expect(screen.getByRole('button', { name: /Stapu/i })).toHaveAttribute('data-state', 'idle');
  });
});
