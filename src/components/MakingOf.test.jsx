import { fireEvent, render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import MakingOf from './MakingOf';
import { LanguageProvider } from '../i18n/LanguageContext';

const routeMocks = vi.hoisted(() => ({ navigateToRoute: vi.fn() }));
vi.mock('../lib/siteRoute', () => routeMocks);

describe('MakingOf', () => {
  beforeEach(() => routeMocks.navigateToRoute.mockClear());

  it('renders a five-stage making-of archive from localized content', () => {
    const { container } = render(
      <LanguageProvider>
        <MakingOf />
      </LanguageProvider>
    );

    expect(screen.getByRole('main')).toHaveClass('making-of');
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
    expect(container.querySelectorAll('.making-of__timeline > li')).toHaveLength(5);
    expect(container.querySelector('.framed-panel')).toBeNull();
  });

  it('returns to the observatory through the route helper', () => {
    render(
      <LanguageProvider>
        <MakingOf />
      </LanguageProvider>
    );

    fireEvent.click(screen.getByRole('button', { name: /觀景台|observatory/i }));
    expect(routeMocks.navigateToRoute).toHaveBeenCalledWith('/');
  });
});
