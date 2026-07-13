import { render } from '@testing-library/react';
import { vi } from 'vitest';
import Portfolio from './Portfolio';
import { LanguageProvider } from '../i18n/LanguageContext';

vi.mock('./CircularGallery', () => ({
  default: () => <div data-testid="circular-gallery-stub" />,
}));

describe('Portfolio', () => {
  it('renders as #scene-5', () => {
    const { container } = render(
      <LanguageProvider>
        <Portfolio />
      </LanguageProvider>
    );
    expect(container.querySelector('section')).toHaveAttribute('id', 'scene-5');
  });
});
