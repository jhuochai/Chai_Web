import { render } from '@testing-library/react';
import { vi } from 'vitest';
import App from './App';

vi.mock('./components/ClickSpark', () => ({
  default: ({ children }) => <div>{children}</div>,
}));

vi.mock('./components/CircularGallery', () => ({
  default: () => <div data-testid="circular-gallery-stub" />,
}));

vi.mock('./components/LiquidEther', () => ({
  default: () => <div data-testid="liquid-ether-stub" />,
}));

describe('App', () => {
  it('renders scenes 1-7 in order (scene 0 is the loading overlay, not a section)', () => {
    const { container } = render(<App />);
    const ids = Array.from(container.querySelectorAll('main > section')).map((el) => el.id);
    expect(ids).toEqual([
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
