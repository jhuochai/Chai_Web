import { render, screen, fireEvent } from '@testing-library/react';
import Nav from './Nav';
import { LanguageProvider } from '../i18n/LanguageContext';

function renderNav() {
  return render(
    <LanguageProvider>
      <Nav />
    </LanguageProvider>
  );
}

describe('Nav', () => {
  it('renders the curated 3-link desktop nav pointing at the new scene anchors', () => {
    renderNav();
    expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute('href', '#scene-1');
    expect(screen.getByRole('link', { name: 'Story' })).toHaveAttribute('href', '#scene-3');
    expect(screen.getByRole('link', { name: 'Work' })).toHaveAttribute('href', '#scene-5');
  });

  it('opens the mobile menu when the hamburger button is clicked', () => {
    renderNav();
    expect(screen.queryByRole('navigation', { name: 'Mobile' })).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /menu/i }));
    expect(screen.getByRole('navigation', { name: 'Mobile' })).toBeInTheDocument();
  });
});
