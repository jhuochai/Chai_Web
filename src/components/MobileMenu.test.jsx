import { render, screen, fireEvent } from '@testing-library/react';
import MobileMenu from './MobileMenu';
import { LanguageProvider } from '../i18n/LanguageContext';

const links = [
  { href: '#scene-1', label: 'Home' },
  { href: '#scene-3', label: 'Story' },
  { href: '#scene-5', label: 'Work' },
];

// The overlay renders through a portal into document.body, so queries go
// through `screen`/document rather than the render container.
function renderMenu(props) {
  return render(
    <LanguageProvider>
      <MobileMenu links={links} onClose={() => {}} {...props} />
    </LanguageProvider>
  );
}

describe('MobileMenu', () => {
  it('renders nothing when closed', () => {
    renderMenu({ open: false });
    expect(document.querySelector('.mobile-menu')).toBeNull();
  });

  it('renders every link with a staggered transition delay when open', () => {
    renderMenu({ open: true });
    const items = screen.getAllByRole('link');
    expect(items).toHaveLength(3);
    expect(items[0]).toHaveAttribute('href', '#scene-1');
    expect(items[0]).toHaveStyle({ transitionDelay: '100ms' });
    expect(items[1]).toHaveStyle({ transitionDelay: '150ms' });
    expect(items[2]).toHaveStyle({ transitionDelay: '200ms' });
  });

  it('calls onClose when a link is clicked', () => {
    const onClose = vi.fn();
    renderMenu({ open: true, onClose });
    fireEvent.click(screen.getAllByRole('link')[0]);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when the backdrop is clicked', () => {
    const onClose = vi.fn();
    renderMenu({ open: true, onClose });
    fireEvent.click(document.querySelector('.mobile-menu'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when Escape is pressed', () => {
    const onClose = vi.fn();
    renderMenu({ open: true, onClose });
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('locks body scroll while open and restores it on close', () => {
    const { rerender } = render(
      <LanguageProvider>
        <MobileMenu open links={links} onClose={() => {}} />
      </LanguageProvider>
    );
    expect(document.body.style.overflow).toBe('hidden');
    rerender(
      <LanguageProvider>
        <MobileMenu open={false} links={links} onClose={() => {}} />
      </LanguageProvider>
    );
    expect(document.body.style.overflow).toBe('');
  });

  it('renders a close button that calls onClose', () => {
    const onClose = vi.fn();
    renderMenu({ open: true, onClose });
    const closeBtn = document.querySelector('.mobile-menu__close');
    expect(closeBtn).not.toBeNull();
    fireEvent.click(closeBtn);
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
