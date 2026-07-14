import { render, screen, fireEvent, act } from '@testing-library/react';
import { vi } from 'vitest';
import LoadingScreen from './LoadingScreen';
import { LanguageProvider } from '../i18n/LanguageContext';

function renderLoading(onDone = vi.fn()) {
  render(
    <LanguageProvider>
      <LoadingScreen onDone={onDone} />
    </LanguageProvider>
  );
  return onDone;
}

describe('LoadingScreen', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders as a focusable button with no visible text', () => {
    renderLoading();
    const overlay = screen.getByRole('button', { name: 'Enter the site' });
    expect(overlay).toHaveAttribute('tabindex', '0');
    expect(overlay.textContent).toBe('');
  });

  // Each phase schedules the next timer from an effect, so timers must be
  // advanced phase-by-phase (flash+flight 510ms -> burst 950ms -> exit 550ms).
  const advanceFireSequence = () => {
    act(() => vi.advanceTimersByTime(510));
    act(() => vi.advanceTimersByTime(950));
    act(() => vi.advanceTimersByTime(550));
  };

  it('auto-fires after 3s and completes the full sequence', () => {
    const onDone = renderLoading();
    act(() => {
      vi.advanceTimersByTime(2999);
    });
    expect(onDone).not.toHaveBeenCalled();
    act(() => vi.advanceTimersByTime(1));
    advanceFireSequence();
    expect(onDone).toHaveBeenCalledTimes(1);
  });

  it('fires early on click and only once', () => {
    const onDone = renderLoading();
    const overlay = screen.getByRole('button', { name: 'Enter the site' });
    fireEvent.click(overlay, { clientX: 700, clientY: 300 });
    fireEvent.click(overlay, { clientX: 100, clientY: 100 });
    advanceFireSequence();
    expect(onDone).toHaveBeenCalledTimes(1);
  });

  it('fires on Enter for keyboard users', () => {
    const onDone = renderLoading();
    const overlay = screen.getByRole('button', { name: 'Enter the site' });
    fireEvent.keyDown(overlay, { key: 'Enter' });
    advanceFireSequence();
    expect(onDone).toHaveBeenCalledTimes(1);
  });
});
