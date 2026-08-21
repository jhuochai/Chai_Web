import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { useState } from 'react';
import RouteMap from './RouteMap';
import { LanguageProvider } from '../i18n/LanguageContext';

function renderRouteMap(props = {}) {
  return render(
    <LanguageProvider>
      <button type="button">Route map opener</button>
      <RouteMap
        open
        currentRoute="/"
        onClose={() => {}}
        onTravel={() => {}}
        onOpenContact={() => {}}
        {...props}
      />
    </LanguageProvider>
  );
}

describe('RouteMap', () => {
  afterEach(() => {
    document.body.style.overflow = '';
    window.localStorage.removeItem('site-lang');
  });

  it('lists the formal stations and marks the current station', () => {
    renderRouteMap({ currentRoute: '/profile' });

    expect(screen.getByRole('button', { name: 'Cockpit' })).toBeEnabled();
    expect(screen.getByRole('button', { name: "Captain's Office" })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('button', { name: 'Route Tree Station' })).toBeEnabled();
    expect(screen.getByRole('button', { name: 'Analysis Bay' })).toBeEnabled();
    expect(screen.getByRole('button', { name: 'AI Lab' })).toBeEnabled();
  });

  it('identifies coming-soon stations as disabled without navigable links', () => {
    renderRouteMap();

    for (const label of ['Private Archive']) {
      const station = screen.getByRole('button', { name: new RegExp(label) });
      expect(station).toBeDisabled();
      expect(station).not.toHaveAttribute('href');
      expect(station).toHaveTextContent('Coming soon');
    }
  });

  it('uses the approved Traditional Chinese names for pending stations and comms', () => {
    window.localStorage.setItem('site-lang', 'zh');
    renderRouteMap();

    expect(screen.getByRole('button', { name: 'AI 實驗艙' })).toBeEnabled();
    expect(screen.getByRole('button', { name: '私人典藏艙建置中' })).toBeDisabled();
    expect(screen.getByRole('button', { name: '通訊台' })).toBeEnabled();
  });

  it('travels to a different formal station once and then closes', () => {
    const onTravel = vi.fn();
    const onClose = vi.fn();
    renderRouteMap({ onTravel, onClose });

    fireEvent.click(screen.getByRole('button', { name: "Captain's Office" }));

    expect(onTravel).toHaveBeenCalledTimes(1);
    expect(onTravel).toHaveBeenCalledWith('/profile');
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('travels to the AI lab as a real station', () => {
    const onTravel = vi.fn();
    const onClose = vi.fn();
    renderRouteMap({ currentRoute: '/profile', onTravel, onClose });

    fireEvent.click(screen.getByRole('button', { name: 'AI Lab' }));

    expect(onTravel).toHaveBeenCalledWith('/ai-lab');
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('does not retravel when its current station is selected', () => {
    const onTravel = vi.fn();
    renderRouteMap({ currentRoute: '/profile', onTravel });

    fireEvent.click(screen.getByRole('button', { name: "Captain's Office" }));

    expect(onTravel).not.toHaveBeenCalled();
  });

  it('opens comms through its callback and closes the panel', () => {
    const onOpenContact = vi.fn();
    const onClose = vi.fn();
    renderRouteMap({ onOpenContact, onClose });

    fireEvent.click(screen.getByRole('button', { name: 'Comms' }));

    expect(onOpenContact).toHaveBeenCalledTimes(1);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('hands focus to comms without restoring focus to its detached route-map control', async () => {
    const onOpenContact = vi.fn();
    function Harness() {
      const [open, setOpen] = useState(false);
      return (
        <LanguageProvider>
          <button type="button" onClick={() => setOpen(true)}>Route map opener</button>
          <RouteMap
            open={open}
            currentRoute="/"
            onClose={() => setOpen(false)}
            onTravel={() => {}}
            onOpenContact={onOpenContact}
          />
        </LanguageProvider>
      );
    }
    render(<Harness />);
    const opener = screen.getByRole('button', { name: 'Route map opener' });
    opener.focus();
    fireEvent.click(opener);
    fireEvent.click(screen.getByRole('button', { name: 'Comms' }));

    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
    expect(onOpenContact).toHaveBeenCalledTimes(1);
    expect(opener).not.toHaveFocus();
  });

  it('closes on Escape and only on a safe backdrop click', () => {
    const onClose = vi.fn();
    renderRouteMap({ onClose });

    fireEvent.mouseDown(screen.getByTestId('route-map-backdrop'));
    fireEvent.keyDown(document, { key: 'Escape' });

    expect(onClose).toHaveBeenCalledTimes(2);
  });

  it('focuses the panel, traps tabbing, restores its opener, and cleans up the body lock', async () => {
    document.body.style.overflow = 'scroll';
    function Harness() {
      const [open, setOpen] = useState(false);
      return (
        <LanguageProvider>
          <button type="button" onClick={() => setOpen(true)}>Route map opener</button>
          <RouteMap open={open} currentRoute="/" onClose={() => setOpen(false)} onTravel={() => {}} onOpenContact={() => {}} />
        </LanguageProvider>
      );
    }
    const { container } = render(<Harness />);
    const opener = screen.getByRole('button', { name: 'Route map opener' });
    opener.focus();
    fireEvent.click(opener);

    expect(document.body.style.overflow).toBe('hidden');
    expect(screen.getByRole('dialog')).toHaveFocus();
    expect(container).toHaveAttribute('aria-hidden', 'true');

    const buttons = screen.getAllByRole('button');
    buttons.at(-1).focus();
    fireEvent.keyDown(document, { key: 'Tab' });
    expect(screen.getByRole('button', { name: 'Close route map' })).toHaveFocus();

    fireEvent.keyDown(document, { key: 'Escape' });

    expect(document.body.style.overflow).toBe('scroll');
    expect(container).not.toHaveAttribute('aria-hidden');
    await waitFor(() => expect(opener).toHaveFocus());
  });
});
