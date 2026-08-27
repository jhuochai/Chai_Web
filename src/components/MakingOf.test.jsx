import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import MakingOf from './MakingOf';
import { LanguageProvider } from '../i18n/LanguageContext';

const routeMocks = vi.hoisted(() => ({ navigateToRoute: vi.fn() }));
vi.mock('../lib/siteRoute', () => routeMocks);

describe('MakingOf', () => {
  beforeEach(() => {
    routeMocks.navigateToRoute.mockClear();
    vi.spyOn(window, 'scrollTo').mockImplementation(() => {});
  });

  it('hides timeline records without evidence and preserves collaborator credits', () => {
    const { container } = render(<LanguageProvider><MakingOf /></LanguageProvider>);

    expect(container.querySelectorAll('.making-of__timeline > li')).toHaveLength(0);
    expect(container.querySelector('.making-of__open-slot')).toBeNull();
    expect(container.querySelector('.collaborator-seats')).toBeInTheDocument();
    expect(screen.getByText(/decisions and collaborators/i)).toBeInTheDocument();
  });

  it('uses the approved archive name and returns to the cockpit', () => {
    render(<LanguageProvider><MakingOf /></LanguageProvider>);
    expect(screen.getByText('Making-of Archive')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Return to the cockpit/i })).toBeInTheDocument();
  });

  it('returns to the observatory through the route helper', () => {
    render(<LanguageProvider><MakingOf /></LanguageProvider>);
    fireEvent.click(screen.getByRole('button', { name: /cockpit/i }));
    expect(routeMocks.navigateToRoute).toHaveBeenCalledWith('/');
  });
});
