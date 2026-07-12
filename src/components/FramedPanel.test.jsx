import { render } from '@testing-library/react';
import FramedPanel from './FramedPanel';

describe('FramedPanel deco variant', () => {
  it('renders the deco frame class on the wrapper and the deco crack texture', () => {
    const { container } = render(<FramedPanel variant="deco">content</FramedPanel>);
    const wrapper = container.firstChild;
    expect(wrapper.className).toContain('framed-panel--deco');
    expect(container.querySelector('.crack-texture--deco')).not.toBeNull();
  });

  it('still renders the existing corners variant unchanged', () => {
    const { container } = render(<FramedPanel variant="corners">content</FramedPanel>);
    expect(container.querySelector('.crack-texture--corners')).not.toBeNull();
  });
});
