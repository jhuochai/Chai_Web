import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import App from './App';

vi.mock('./components/ClickSpark', () => ({
  default: ({ children }) => <div>{children}</div>,
}));

vi.mock('./components/SmoothScroll', () => ({
  default: ({ paused }) => <div data-testid="smooth-scroll-stub" data-paused={paused} />,
}));

const routes = [
  ['/', 'scene-1'],
  ['/profile', 'scene-2'],
  ['/career-tree', 'scene-3'],
  ['/portfolio', 'scene-5'],
];

describe('App station routes', () => {
  beforeEach(() => window.history.replaceState({}, '', '/'));
  afterEach(() => window.history.replaceState({}, '', '/'));

  it.each(routes)('renders only %s at %s', (pathname, stationId) => {
    window.history.replaceState({}, '', pathname);
    const { container } = render(<App />);

    expect(container.querySelector(`section#${stationId}`)).toBeInTheDocument();
    expect(container.querySelectorAll('main > section')).toHaveLength(1);
    expect(container.querySelector('header.nav')).toBeInTheDocument();
    expect(container.querySelector('.chapter-exit')).toBeNull();
    expect(container.querySelectorAll('.station-controls')).toHaveLength(1);
  });

  it('renders the making-of archive without the formal station navigation', () => {
    window.history.replaceState({}, '', '/making-of');
    const { container } = render(<App />);

    expect(container.querySelector('main.making-of')).toBeInTheDocument();
    expect(container.querySelector('header.nav')).toBeNull();
    expect(container.querySelectorAll('main > section')).toHaveLength(1);
    expect(container.querySelector('.station-controls')).toBeNull();
  });

  it('updates the rendered station after browser history changes', () => {
    const { container } = render(<App />);
    window.history.replaceState({}, '', '/portfolio');
    act(() => window.dispatchEvent(new PopStateEvent('popstate')));

    expect(container.querySelector('section#scene-5')).toBeInTheDocument();
    expect(container.querySelectorAll('main > section')).toHaveLength(1);
  });

  it('navigates through the route map without rendering another station', () => {
    const { container } = render(<App />);
    vi.useFakeTimers();
    const scrollTo = vi.spyOn(window, 'scrollTo').mockImplementation(() => {});

    fireEvent.click(screen.getByRole('button', { name: 'Open route map' }));
    fireEvent.click(screen.getByRole('button', { name: "Captain's Office" }));

    expect(window.location.pathname).toBe('/');
    act(() => vi.advanceTimersByTime(450));
    expect(window.location.pathname).toBe('/profile');
    expect(container.querySelector('section#scene-2')).toBeInTheDocument();
    expect(container.querySelectorAll('main > section')).toHaveLength(1);
    expect(scrollTo).toHaveBeenCalledWith({ top: 0, left: 0, behavior: 'auto' });
    act(() => vi.advanceTimersByTime(1));
    expect(document.activeElement).toBe(container.querySelector('#scene-2 h2'));
    vi.useRealTimers();
  });

  it('pauses the shared scroll engine while the loading overlay is active', () => {
    render(<App />);
    expect(screen.getByTestId('smooth-scroll-stub')).toHaveAttribute('data-paused', 'true');
  });
});
