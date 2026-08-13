import { render, screen } from '@testing-library/react';
import Contact from './Contact';
import { LanguageProvider } from '../i18n/LanguageContext';

describe('Contact', () => {
  it('renders as #scene-7 without a decorative frame', () => {
    const { container } = render(
      <LanguageProvider>
        <Contact />
      </LanguageProvider>
    );
    expect(container.querySelector('section')).toHaveAttribute('id', 'scene-7');
    expect(container.querySelector('.framed-panel')).toBeNull();
  });

  it('uses the real LinkedIn profile and keeps external navigation safe', () => {
    render(
      <LanguageProvider>
        <Contact />
      </LanguageProvider>
    );

    expect(screen.getByRole('link', { name: /LinkedIn/i })).toHaveAttribute(
      'href',
      'https://www.linkedin.com/in/yichen-chai-3019492b4/'
    );
    expect(screen.getByRole('link', { name: /LinkedIn/i })).toHaveAttribute('target', '_blank');
    expect(screen.getByRole('link', { name: /LinkedIn/i })).toHaveAttribute('rel', 'noreferrer');
  });
});
