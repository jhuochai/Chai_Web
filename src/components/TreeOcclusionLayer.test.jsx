import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import TreeOcclusionLayer from './TreeOcclusionLayer';

const patches = [
  { id: 'first', cx: 200, cy: 300, rx: 18, ry: 8, rotation: -12 },
  { id: 'second', cx: 900, cy: 440, rx: 22, ry: 10, rotation: 16 },
];

describe('TreeOcclusionLayer', () => {
  it('reuses the matching scene pixels for one decorative foreground layer', () => {
    render(<TreeOcclusionLayer source="night.webp" mode="night" patches={patches} active />);

    const layer = screen.getByTestId('tree-occlusion-night');
    expect(layer).toHaveAttribute('aria-hidden', 'true');
    expect(layer).toHaveAttribute('focusable', 'false');
    expect(layer).toHaveAttribute('preserveAspectRatio', 'xMidYMid slice');
    expect(layer).toHaveClass('career-tree__occlusion--active');
    expect(layer.querySelectorAll('ellipse')).toHaveLength(2);
    expect(layer.querySelector('image')).toHaveAttribute('href', 'night.webp');
    expect(layer.querySelector('image')).toHaveAttribute('preserveAspectRatio', 'xMidYMid slice');
    expect(layer.querySelector('image').getAttribute('mask')).toContain('tree-occlusion-night');
    expect(layer.querySelector('feGaussianBlur')).toHaveAttribute('stdDeviation', '1.4');
  });

  it('keeps the inactive mode mounted for a synchronized crossfade', () => {
    render(<TreeOcclusionLayer source="day.webp" mode="day" patches={patches} active={false} />);

    expect(screen.getByTestId('tree-occlusion-day')).not.toHaveClass('career-tree__occlusion--active');
  });
});
