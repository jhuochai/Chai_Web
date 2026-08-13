import { fireEvent, render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import StationControls from './StationControls';
import { STATIONS } from '../data/stations';
import { LanguageProvider } from '../i18n/LanguageContext';

function renderControls(props = {}) {
  return render(
    <LanguageProvider>
      <StationControls currentRoute="/profile" onTravel={() => {}} {...props} />
    </LanguageProvider>
  );
}

describe('StationControls', () => {
  afterEach(() => window.localStorage.removeItem('site-lang'));

  it('shows return and recommended controls using the recommended mapping', () => {
    const onTravel = vi.fn();
    renderControls({ onTravel });

    expect(screen.getByRole('button', { name: 'Return to Cockpit' })).toBeEnabled();
    fireEvent.click(screen.getByRole('button', { name: 'Next: Route Tree Station' }));
    expect(onTravel).toHaveBeenCalledWith('/career-tree');
  });

  it('localizes the destination name', () => {
    window.localStorage.setItem('site-lang', 'zh');
    renderControls();

    expect(screen.getByRole('button', { name: new RegExp(STATIONS[2].zh) })).toBeInTheDocument();
  });

  it('identifies the cockpit return control as current instead of retraveling', () => {
    const onTravel = vi.fn();
    const { container } = renderControls({ currentRoute: '/', onTravel });
    const returnControl = screen.getByRole('button', { name: 'Return to Cockpit' });

    expect(returnControl).toBeDisabled();
    expect(returnControl).toHaveAttribute('aria-current', 'page');
    expect(container.querySelector('.chapter-exit')).toBeNull();
  });
});
