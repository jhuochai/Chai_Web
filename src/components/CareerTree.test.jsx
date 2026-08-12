import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import CareerTree from './CareerTree';
import { LanguageProvider } from '../i18n/LanguageContext';
import { content } from '../data/content';

function renderTree() {
  return render(
    <LanguageProvider>
      <CareerTree />
    </LanguageProvider>
  );
}

describe('CareerTree', () => {
  it('does not run the walking frames on an idle time interval', () => {
    const intervalSpy = vi.spyOn(window, 'setInterval');
    renderTree();
    expect(intervalSpy).not.toHaveBeenCalledWith(expect.any(Function), 220);
    intervalSpy.mockRestore();
  });

  it('renders as #scene-3 with the career-tree heading', () => {
    const { container } = renderTree();
    expect(container.querySelector('section')).toHaveAttribute('id', 'scene-3');
    expect(screen.getByText(content.en.careerTree.heading)).toBeInTheDocument();
  });

  it('shows the four work-experience ribbons in day mode', () => {
    renderTree();
    for (const ribbon of content.en.careerTree.ribbons) {
      expect(screen.getByRole('button', { name: ribbon.org })).toBeInTheDocument();
    }
  });

  it('switches to flowers (games) in night mode and back', () => {
    renderTree();
    fireEvent.click(screen.getByRole('button', { name: 'Switch to night' }));
    for (const flower of content.en.careerTree.flowers) {
      expect(screen.getByRole('button', { name: flower.name })).toBeInTheDocument();
    }
    expect(screen.queryByRole('button', { name: content.en.careerTree.ribbons[0].org })).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: 'Switch to day' }));
    expect(
      screen.getByRole('button', { name: content.en.careerTree.ribbons[0].org })
    ).toBeInTheDocument();
  });

  it('opens a ribbon detail card and closes it with Escape', async () => {
    renderTree();
    const ribbon = content.en.careerTree.ribbons[0];
    fireEvent.click(screen.getByRole('button', { name: ribbon.org }));
    const dialog = screen.getByRole('dialog', { name: ribbon.org });
    expect(dialog).toBeInTheDocument();
    expect(screen.getByText(ribbon.role)).toBeInTheDocument();
    expect(screen.getByText(ribbon.points[0])).toBeInTheDocument();
    fireEvent.keyDown(document, { key: 'Escape' });
    // AnimatePresence keeps the card mounted until the exit animation ends.
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
  });

  it('switches to night mode when the hero broadcasts games mode', () => {
    renderTree();
    fireEvent(window, new CustomEvent('career-tree:mode', { detail: 'night' }));
    expect(
      screen.getByRole('button', { name: content.en.careerTree.flowers[0].name })
    ).toBeInTheDocument();
  });

  it('opens a flower detail card in night mode', () => {
    renderTree();
    fireEvent.click(screen.getByRole('button', { name: 'Switch to night' }));
    const flower = content.en.careerTree.flowers[0];
    fireEvent.click(screen.getByRole('button', { name: flower.name }));
    expect(screen.getByRole('dialog', { name: flower.name })).toBeInTheDocument();
    expect(screen.getByText(flower.desc)).toBeInTheDocument();
  });
});
