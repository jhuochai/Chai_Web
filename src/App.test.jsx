import { render } from '@testing-library/react';
import { vi } from 'vitest';
import App from './App';

vi.mock('./components/ClickSpark', () => ({
  default: ({ children }) => <div>{children}</div>,
}));

vi.mock('./components/CircularGallery', () => ({
  default: () => <div data-testid="circular-gallery-stub" />,
}));

describe('App', () => {
  it('renders all 8 scenes in order', () => {
    const { container } = render(<App />);
    const ids = Array.from(container.querySelectorAll('main > section')).map((el) => el.id);
    expect(ids).toEqual([
      'scene-0',
      'scene-1',
      'scene-2',
      'scene-3',
      'scene-4',
      'scene-5',
      'scene-6',
      'scene-7',
    ]);
  });
});
