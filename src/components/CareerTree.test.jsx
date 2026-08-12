import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import CareerTree from './CareerTree';
import { createCareerScrollTrigger } from './careerScroll';
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
  it('pins only when the tree stage itself reaches the viewport top', () => {
    const stage = document.createElement('div');
    const config = createCareerScrollTrigger(stage, () => {});

    expect(config).toEqual(expect.objectContaining({
      trigger: stage,
      pin: stage,
      start: 'top top',
      end: '+=140%',
      scrub: 0.7,
    }));
  });

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
    fireEvent(window, new CustomEvent('career-tree:test-progress', { detail: 0.8 }));
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

  it('keeps hotspots disabled until the camera push completes', () => {
    const { container } = renderTree();
    const stage = container.querySelector('.career-tree__stage');
    const ribbon = screen.getByRole('button', {
      name: content.en.careerTree.ribbons[0].org,
    });

    expect(stage).toHaveAttribute('data-interactive', 'false');
    expect(ribbon).toBeDisabled();

    fireEvent(window, new CustomEvent('career-tree:test-progress', { detail: 0.8 }));

    expect(stage).toHaveAttribute('data-interactive', 'true');
    expect(ribbon).toBeEnabled();
  });

  it('opens a ribbon chapter with Enter and returns focus after Escape', async () => {
    renderTree();
    fireEvent(window, new CustomEvent('career-tree:test-progress', { detail: 0.8 }));
    const ribbon = content.en.careerTree.ribbons[0];
    const trigger = screen.getByRole('button', { name: ribbon.org });
    trigger.focus();
    fireEvent.keyDown(trigger, { key: 'Enter' });
    const dialog = screen.getByRole('dialog', { name: ribbon.org });
    expect(dialog).toBeInTheDocument();
    expect(dialog).toHaveClass('career-ribbon-sheet__panel');
    expect(screen.getByText(ribbon.role)).toBeInTheDocument();
    expect(screen.getByText(ribbon.points[0])).toBeInTheDocument();
    fireEvent.keyDown(document, { key: 'Escape' });
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
    expect(trigger).toHaveFocus();
  });

  it('renders four distinct low-saturation ribbon assets in day mode', () => {
    const { container } = renderTree();
    const assets = screen
      .getAllByTestId('career-ribbon-asset')
      .map((image) => image.getAttribute('src'));
    expect(assets).toHaveLength(4);
    expect(new Set(assets).size).toBe(4);
    expect(
      Array.from(container.querySelectorAll('[data-ribbon-id]')).map((node) =>
        node.getAttribute('data-ribbon-id')
      )
    ).toEqual(content.en.careerTree.ribbons.map((ribbon) => ribbon.id));
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
    fireEvent(window, new CustomEvent('career-tree:test-progress', { detail: 0.8 }));
    fireEvent.click(screen.getByRole('button', { name: 'Switch to night' }));
    const flower = content.en.careerTree.flowers[0];
    fireEvent.click(screen.getByRole('button', { name: flower.name }));
    const dialog = screen.getByRole('dialog', { name: flower.name });
    expect(dialog).toBeInTheDocument();
    expect(dialog.closest('.framed-panel')).toBeNull();
    expect(screen.getByText(flower.desc)).toBeInTheDocument();
  });

  it('renders eleven distinct game blooms without the old shelf group', () => {
    renderTree();
    fireEvent(window, new CustomEvent('career-tree:test-progress', { detail: 0.8 }));
    fireEvent.click(screen.getByRole('button', { name: 'Switch to night' }));

    const blooms = screen.getAllByTestId('game-bloom');
    expect(blooms).toHaveLength(11);
    expect(new Set(blooms.map((node) => node.dataset.asset)).size).toBe(11);
    expect(screen.queryByText(/Bookshelf|書架上還有/i)).not.toBeInTheDocument();
  });

  it('uses three bloom sizes and keeps at most three blooms on a branch', () => {
    renderTree();
    fireEvent(window, new CustomEvent('career-tree:test-progress', { detail: 0.8 }));
    fireEvent.click(screen.getByRole('button', { name: 'Switch to night' }));

    const blooms = screen.getAllByTestId('game-bloom');
    expect(new Set(blooms.map((node) => node.dataset.position)).size).toBe(11);
    expect(new Set(blooms.map((node) => node.dataset.size))).toEqual(
      new Set(['sm', 'md', 'lg'])
    );

    const branchCounts = blooms.reduce((counts, bloom) => {
      counts[bloom.dataset.branch] = (counts[bloom.dataset.branch] ?? 0) + 1;
      return counts;
    }, {});
    expect(Math.max(...Object.values(branchCounts))).toBeLessThanOrEqual(3);
  });

  it('keeps the camera interaction gate in QA mode while preserving test control', () => {
    window.history.replaceState({}, '', '/?impact-qa=2');
    const { container } = renderTree();
    expect(container.querySelector('.career-tree__stage')).toHaveAttribute(
      'data-interactive',
      'true'
    );
    window.history.replaceState({}, '', '/');
  });
});
