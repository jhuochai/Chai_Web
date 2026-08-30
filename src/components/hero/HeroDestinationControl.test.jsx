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

  it('separates articulated controls into a fixed base and a moving mechanism', () => {
    const { container, rerender } = render(
      <HeroDestinationControl entry={{ id: 'career', label: '航跡樹站' }} image="/joystick.webp" motion="push" enabled onActivate={() => {}} />,
    );
    expect(container.querySelector('.hero-control__image--base')).toBeInTheDocument();
    expect(container.querySelector('.hero-control__image--moving')).toBeInTheDocument();

    rerender(<HeroDestinationControl entry={{ id: 'portfolio', label: '任務檔案庫' }} image="/knob.webp" motion="turn" enabled onActivate={() => {}} />);
    expect(container.querySelectorAll('.hero-control__image')).toHaveLength(1);
    expect(container.querySelector('.hero-control__image--moving')).not.toBeInTheDocument();
  });

  it('uses separate transparent assets for an articulated control', () => {
    const { container } = render(
      <HeroDestinationControl
        entry={{ id: 'career', label: '航跡樹站' }}
        image={{ base: '/joystick-base.webp', moving: '/joystick-grip.webp' }}
        motion="push"
        enabled
        onActivate={() => {}}
      />,
    );

    expect(container.querySelector('.hero-control__image--base')).toHaveAttribute('src', '/joystick-base.webp');
    expect(container.querySelector('.hero-control__image--moving')).toHaveAttribute('src', '/joystick-grip.webp');
  });
});
