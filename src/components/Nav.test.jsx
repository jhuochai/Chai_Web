import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import Nav from './Nav';
import { LanguageProvider } from '../i18n/LanguageContext';

function renderNav(props = {}) {
  return render(
    <LanguageProvider>
      <Nav currentRoute="/" onTravel={() => {}} onOpenContact={() => {}} {...props} />
    </LanguageProvider>
  );
}

describe('Nav', () => {
  it('renders no scene-anchor or contact navigation links', () => {
    renderNav();

    expect(screen.queryByRole('link')).toBeNull();
    expect(document.querySelector('[href^="#scene-"]')).toBeNull();
  });

  it('opens the route map with correct disclosure semantics while retaining language and music controls', () => {
    renderNav();
    const routeButton = screen.getByRole('button', { name: 'Open route map' });

    expect(screen.getByRole('button', { name: 'Turn music off' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Switch to Chinese' })).toBeInTheDocument();
    expect(routeButton).toHaveAttribute('aria-expanded', 'false');
    expect(routeButton).toHaveAttribute('aria-controls', 'ship-route-map');

    fireEvent.click(routeButton);

    expect(routeButton).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('dialog', { name: 'Ship route map' })).toBeInTheDocument();
  });

  it('passes travel through the embedded route map', () => {
    const onTravel = vi.fn();
    renderNav({ onTravel });

    fireEvent.click(screen.getByRole('button', { name: 'Open route map' }));
    fireEvent.click(screen.getByRole('button', { name: "Captain's Office" }));

    expect(onTravel).toHaveBeenCalledWith('/profile');
  });
});
