import { fireEvent, render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import App from './App';

vi.mock('./components/ClickSpark', () => ({
  default: ({ children }) => <div>{children}</div>,
}));

vi.mock('./components/CircularGallery', () => ({
  default: () => <div data-testid="circular-gallery-stub" />,
}));

vi.mock('./components/LiquidEther', () => ({
  default: () => <div data-testid="liquid-ether-stub" />,
}));

vi.mock('./components/SmoothScroll', () => ({
  default: ({ paused }) => <div data-testid="smooth-scroll-stub" data-paused={paused} />,
}));

describe('App', () => {
  it('renders the retained home chapters in order (scene 0 is the loading overlay, not a section)', () => {
    const { container } = render(<App />);
    const ids = Array.from(container.querySelectorAll('main > section')).map((el) => el.id);
    expect(ids).toEqual([
      'scene-1',
      'scene-2',
      'scene-3',
      'scene-5',
      'scene-7',
    ]);
  });

  it('renders the making-of route and returns to home through browser history', () => {
    window.history.replaceState({}, '', '/making-of');
    render(<App />);

    expect(screen.getByRole('heading', { name: /網站製作幕後/i })).toBeInTheDocument();
    window.history.replaceState({}, '', '/');
    fireEvent.popState(window);

    expect(screen.queryByRole('heading', { name: /網站製作幕後/i })).not.toBeInTheDocument();
  });

  it('wraps every chapter in one continuous atmospheric scene flow', () => {
    const { container } = render(<App />);
    expect(container.querySelector('main')).toHaveClass('scene-flow');
  });

  it('keeps the walker absent until an explicit chapter transition', () => {
    const { container } = render(<App />);
    expect(container.querySelector('.floating-companion')).toBeNull();
    expect(container.querySelector('.career-tree__walker')).toBeNull();
    expect(container.querySelector('.chapter-transition__walker')).toBeNull();
  });

  it('pauses the shared scroll engine while the loading overlay is active', () => {
    const { getByTestId } = render(<App />);
    expect(getByTestId('smooth-scroll-stub')).toHaveAttribute('data-paused', 'true');
  });
});
