import { render, screen } from '@testing-library/react';
import Interests from './Interests';
import { LanguageProvider } from '../i18n/LanguageContext';
import { content } from '../data/content';

describe('Interests', () => {
  it('renders as #scene-4 with the loop, hobbies, and strengths', () => {
    const { container } = render(
      <LanguageProvider>
        <Interests />
      </LanguageProvider>
    );
    expect(container.querySelector('section')).toHaveAttribute('id', 'scene-4');
    const interests = content.en.interests;
    for (const step of interests.loop) {
      expect(screen.getByText(step.label)).toBeInTheDocument();
    }
    for (const hobby of interests.hobbies) {
      expect(screen.getByText(hobby.name)).toBeInTheDocument();
    }
    for (const strength of interests.strengths) {
      expect(screen.getByText(strength.title)).toBeInTheDocument();
      expect(screen.getByText(strength.desc)).toBeInTheDocument();
    }
  });
});
