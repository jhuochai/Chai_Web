import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
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
  ['/ai-lab', 'scene-ai-lab'],
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

  it('embeds career station controls inside the route-tree stage instead of below it', () => {
    window.history.replaceState({}, '', '/career-tree');
    const { container } = render(<App />);
    const stage = container.querySelector('.career-tree__stage');
    expect(stage.querySelector('.station-controls')).toBeInTheDocument();
    expect(container.querySelector('main > .station-controls')).toBeNull();
  });

  it('embeds AI lab station controls inside the lab instead of below it', () => {
    window.history.replaceState({}, '', '/ai-lab');
    const { container } = render(<App />);
    const lab = container.querySelector('.ai-lab__room');
    expect(lab.querySelector('.station-controls')).toBeInTheDocument();
    expect(container.querySelector('main > .station-controls')).toBeNull();
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

  it.each(routes)('opens global comms from the route map at %s and returns focus to the global map button', async (pathname) => {
    window.history.replaceState({}, '', pathname);
    render(<App />);

    const routeMapButton = screen.getByRole('button', { name: 'Open route map' });
    routeMapButton.focus();
    fireEvent.click(routeMapButton);
    fireEvent.click(screen.getByRole('button', { name: 'Comms' }));

    expect(screen.getByRole('dialog', { name: 'Ship communications console' })).toBeInTheDocument();
    expect(screen.queryByRole('dialog', { name: 'Ship route map' })).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: 'Close communications console' }));
    await waitFor(() => expect(routeMapButton).toHaveFocus());
  });

  it('keeps scrolling locked when loading finishes behind comms and restores it after close', async () => {
    vi.useFakeTimers();
    render(<App />);

    fireEvent.pointerDown(screen.getByRole('button', { name: /enter the site/i }), {
      clientX: 100,
      clientY: 100,
    });
    fireEvent.click(screen.getByRole('button', { name: 'Open route map' }));
    fireEvent.click(screen.getByRole('button', { name: 'Comms' }));
    expect(document.body.style.overflow).toBe('hidden');

    act(() => vi.advanceTimersByTime(430));
    act(() => vi.advanceTimersByTime(950));
    act(() => vi.advanceTimersByTime(550));
    expect(screen.getByRole('dialog', { name: 'Ship communications console' })).toBeInTheDocument();
    expect(document.body.style.overflow).toBe('hidden');

    fireEvent.click(screen.getByRole('button', { name: 'Close communications console' }));
    act(() => vi.runOnlyPendingTimers());
    expect(document.body.style.overflow).toBe('');
    vi.useRealTimers();
  });
});
