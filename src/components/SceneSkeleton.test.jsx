import { render } from '@testing-library/react';
import SceneSkeleton from './SceneSkeleton';

describe('SceneSkeleton', () => {
  it('renders a section with the given id and the title/note text', () => {
    const { container, getByText } = render(
      <SceneSkeleton id="scene-4" title="Scene 4 — Interests" note="Content coming in a later pass" />
    );
    const section = container.querySelector('section');
    expect(section).toHaveAttribute('id', 'scene-4');
    expect(getByText('Scene 4 — Interests')).toBeInTheDocument();
    expect(getByText('Content coming in a later pass')).toBeInTheDocument();
  });

  it('has no background-image style when backgroundUrl is omitted', () => {
    const { container } = render(<SceneSkeleton id="scene-2" title="t" note="n" />);
    const section = container.querySelector('section');
    expect(section.style.backgroundImage).toBe('');
  });

  it('sets a background-image style when backgroundUrl is provided', () => {
    const { container } = render(
      <SceneSkeleton id="scene-3" title="t" note="n" backgroundUrl="/fake/tree-day.webp" />
    );
    const section = container.querySelector('section');
    expect(section.style.backgroundImage).toContain('/fake/tree-day.webp');
  });
});
