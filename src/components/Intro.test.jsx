import { render, screen } from '@testing-library/react';
import Intro from './Intro';
import { LanguageProvider } from '../i18n/LanguageContext';

function renderIntro() {
  return render(
    <LanguageProvider>
      <Intro />
    </LanguageProvider>
  );
}

describe('Intro', () => {
  it('renders as #scene-2 with the deco gallery frame', () => {
    const { container } = renderIntro();
    expect(container.querySelector('section')).toHaveAttribute('id', 'scene-2');
    expect(container.querySelector('.framed-panel--deco')).not.toBeNull();
  });

  it('shows name, positioning statement, and all three traits as text (no badges)', () => {
    const { container } = renderIntro();
    expect(screen.getByRole('heading', { name: /Chai Yi Chen/ })).toBeInTheDocument();
    expect(screen.getByText(/instinct and creativity/)).toBeInTheDocument();
    expect(screen.getByText('Efficiency')).toBeInTheDocument();
    expect(screen.getByText('Multitasking')).toBeInTheDocument();
    expect(screen.getByText('Creativity & Intuition')).toBeInTheDocument();
    expect(container.querySelector('.badge, .pill, .tag')).toBeNull();
  });

  it('shows the personality blurb', () => {
    renderIntro();
    expect(screen.getByText(/Right-brain by nature/)).toBeInTheDocument();
  });
});
