import { render, screen } from '@testing-library/react';
import { readFileSync } from 'node:fs';
import InspectionDock from './InspectionDock';

describe('InspectionDock', () => {
  const styles = readFileSync('src/components/InspectionDock.css', 'utf8');

  it('provides one centered physical dock with separate specimen and reading surfaces', () => {
    render(
      <InspectionDock
        variant="ribbon"
        accent="#45c7db"
        glow="rgba(69, 199, 219, 0.34)"
        specimen={<img src="/ribbon.webp" alt="" />}
      >
        <p>Work record</p>
      </InspectionDock>
    );

    expect(screen.getByTestId('inspection-dock')).toHaveAttribute('data-variant', 'ribbon');
    expect(screen.getByTestId('inspection-dock-base')).toHaveAttribute('src', expect.stringMatching(/dock-base-v1/));
    expect(screen.getByTestId('inspection-dock-specimen')).toContainElement(document.querySelector('img[src="/ribbon.webp"]'));
    expect(screen.getByTestId('inspection-dock-content')).toHaveTextContent('Work record');
    expect(styles).toMatch(/margin-inline:\s*auto/);
  });
});
