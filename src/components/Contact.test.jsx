import { render } from '@testing-library/react';
import Contact from './Contact';
import { LanguageProvider } from '../i18n/LanguageContext';

describe('Contact', () => {
  it('renders as #scene-7 with the deco frame', () => {
    const { container } = render(
      <LanguageProvider>
        <Contact />
      </LanguageProvider>
    );
    expect(container.querySelector('section')).toHaveAttribute('id', 'scene-7');
    expect(container.querySelector('.framed-panel--deco')).not.toBeNull();
  });
});
