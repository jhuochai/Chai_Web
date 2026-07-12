import { render, screen, fireEvent } from '@testing-library/react';
import MobileMenu from './MobileMenu';

const links = [
  { href: '#scene-1', label: 'Home' },
  { href: '#scene-3', label: 'Story' },
  { href: '#scene-5', label: 'Work' },
];

describe('MobileMenu', () => {
  it('renders nothing when closed', () => {
    const { container } = render(<MobileMenu open={false} links={links} onClose={() => {}} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders every link with a staggered transition delay when open', () => {
    render(<MobileMenu open links={links} onClose={() => {}} />);
    const items = screen.getAllByRole('link');
    expect(items).toHaveLength(3);
    expect(items[0]).toHaveAttribute('href', '#scene-1');
    expect(items[0]).toHaveStyle({ transitionDelay: '100ms' });
    expect(items[1]).toHaveStyle({ transitionDelay: '150ms' });
    expect(items[2]).toHaveStyle({ transitionDelay: '200ms' });
  });

  it('calls onClose when a link is clicked', () => {
    const onClose = vi.fn();
    render(<MobileMenu open links={links} onClose={onClose} />);
    fireEvent.click(screen.getAllByRole('link')[0]);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when the backdrop is clicked', () => {
    const onClose = vi.fn();
    const { container } = render(<MobileMenu open links={links} onClose={onClose} />);
    fireEvent.click(container.querySelector('.mobile-menu'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
