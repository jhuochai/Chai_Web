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

  it('retains five archive stages and preserves collaborator seats inside the lid', () => {
    const { container } = render(<LanguageProvider><MakingOf /></LanguageProvider>);

    expect(container.querySelectorAll('.making-of__timeline > li')).toHaveLength(5);
    expect(container.querySelector('.collaborator-seats')).toBeInTheDocument();
  });

  it('returns to the observatory through the route helper', () => {
    render(<LanguageProvider><MakingOf /></LanguageProvider>);
    fireEvent.click(screen.getByRole('button', { name: /observatory/i }));
    expect(routeMocks.navigateToRoute).toHaveBeenCalledWith('/');
  });
});
