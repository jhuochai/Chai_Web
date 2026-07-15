import { render, screen } from '@testing-library/react';
import BuildStory from './BuildStory';
import { LanguageProvider } from '../i18n/LanguageContext';
import { content } from '../data/content';

describe('BuildStory', () => {
  it('renders as #scene-6 with all five process steps and the takeaway', () => {
    const { container } = render(
      <LanguageProvider>
        <BuildStory />
      </LanguageProvider>
    );
    expect(container.querySelector('section')).toHaveAttribute('id', 'scene-6');
    for (const step of content.en.buildStory.steps) {
      expect(screen.getByText(step.label)).toBeInTheDocument();
    }
    expect(screen.getByText(content.en.buildStory.takeaway)).toBeInTheDocument();
  });
});
