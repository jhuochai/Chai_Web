import { act, render, screen, fireEvent, waitFor } from '@testing-library/react';
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
  it('does not render the retired ScrollTrigger camera pathway', () => {
    const { container } = renderTree();
    expect(container.querySelector('[data-scroll-trigger]')).toBeNull();
    expect(container.querySelector('.career-tree__heading')).toBeNull();
  });

  it('does not run the walking frames on an idle time interval', () => {
    const intervalSpy = vi.spyOn(window, 'setInterval');
    renderTree();
    expect(intervalSpy).not.toHaveBeenCalledWith(expect.any(Function), 220);
    intervalSpy.mockRestore();
  });

  it('renders a concise in-scene route label instead of a separate heading block', () => {
    const { container } = renderTree();
    expect(container.querySelector('section')).toHaveAttribute('id', 'scene-3');
    expect(screen.getByText('Career')).toBeInTheDocument();
    expect(screen.queryByText(content.en.careerTree.heading)).toBeNull();
  });

  it('uses one localized in-scene station label for each day and night mode', () => {
    renderTree();
    expect(screen.getByText('Career')).toBeInTheDocument();
    fireEvent(window, new CustomEvent('career-tree:test-progress', { detail: 0.8 }));
    fireEvent.click(screen.getByRole('button', { name: 'Switch to night' }));
    expect(screen.getByText('Games')).toBeInTheDocument();
    expect(screen.queryByText('航跡 / Career')).toBeNull();
    expect(screen.queryByText('遊戲 / Games')).toBeNull();
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

  it('uses negative wheel movement to approach and enables stories at the near threshold', () => {
    const { container } = renderTree();
    const stage = container.querySelector('.career-tree__stage');
    const event = new WheelEvent('wheel', { deltaY: -1100, cancelable: true });
    act(() => stage.dispatchEvent(event));

    expect(event.defaultPrevented).toBe(true);
    expect(stage).toHaveAttribute('data-interactive', 'true');
    expect(screen.getByRole('button', { name: content.en.careerTree.ribbons[0].org })).toBeEnabled();
  });

  it('provides explicit approach and retreat controls alongside the focused keyboard alternative', () => {
    renderTree();
    expect(screen.getByRole('button', { name: 'Approach the route tree' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Retreat from the route tree' })).toBeInTheDocument();
  });

  it('contains no scroll-linked walking strip or persistent walker', () => {
    const { container } = renderTree();
    expect(container.querySelector('.career-tree__walk')).toBeNull();
    expect(container.querySelector('.career-tree__walker')).toBeNull();
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

  it('renders four branch-attached ribbons from the same gold visual family in day mode', () => {
    const { container } = renderTree();
    const assets = screen
      .getAllByTestId('career-ribbon-asset')
      .map((image) => image.getAttribute('src'));
    expect(assets).toHaveLength(4);
    expect(new Set(assets).size).toBe(1);
    expect(container.querySelectorAll('[data-ribbon-family="route-gold"]').length).toBe(4);
    expect(container.querySelectorAll('[data-branch-anchor]').length).toBe(4);
    expect(container.querySelectorAll('[data-testid="career-ribbon-mask"]')).toHaveLength(4);
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
    expect(blooms.every((node) => node.dataset.family === 'lumen-forge-bloom')).toBe(true);
    expect(blooms.every((node) => node.dataset.branchAnchor)).toBeTruthy();
    expect(new Set(blooms.map((node) => node.dataset.asset)).size).toBe(1);
    expect(blooms.every((node) => node.dataset.stemEndpoint)).toBeTruthy();
    expect(screen.getAllByTestId('game-bloom-mask')).toHaveLength(11);
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

  it.each([
    { width: 1280, height: 720, mobile: false },
    { width: 795, height: 698, mobile: false },
    { width: 644, height: 698, mobile: false },
    { width: 390, height: 844, mobile: true },
    { width: 360, height: 800, mobile: true },
  ])('keeps bloom hit bounds separate at $width×$height', ({ width, height, mobile }) => {
    renderTree();
    fireEvent(window, new CustomEvent('career-tree:test-progress', { detail: 0.8 }));
    fireEvent.click(screen.getByRole('button', { name: 'Switch to night' }));

    const visualDiameter = (size) => {
      if (mobile) return { sm: 42, md: 50, lg: 58 }[size];
      const scale = { sm: [44, 4.2, 58], md: [54, 5.1, 72], lg: [66, 6.2, 88] }[size];
      return Math.max(scale[0], Math.min((width * scale[1]) / 100, scale[2]));
    };
    const canvasWidth = mobile ? width : Math.max(width, height * (1672 / 941));
    const canvasOffset = mobile ? 0 : (width - canvasWidth) / 2;
    const bounds = screen.getAllByTestId('game-bloom').map((bloom) => {
      const style = bloom.style;
      const left = Number.parseFloat(mobile ? style.getPropertyValue('--bloom-mobile-left') : style.left);
      const top = Number.parseFloat(mobile ? style.getPropertyValue('--bloom-mobile-top') : style.top);
      const hit = Math.max(52, visualDiameter(bloom.dataset.size));
      const centerX = canvasOffset + (canvasWidth * left) / 100;
      const centerY = (height * top) / 100;
      return {
        id: bloom.dataset.gameId,
        left: centerX - hit / 2,
        right: centerX + hit / 2,
        top: centerY - hit / 2,
        bottom: centerY + hit / 2,
      };
    });

    for (let first = 0; first < bounds.length; first += 1) {
      for (let second = first + 1; second < bounds.length; second += 1) {
        const a = bounds[first];
        const b = bounds[second];
        const overlaps = a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;
        expect(overlaps, `${a.id} overlaps ${b.id}`).toBe(false);
      }
    }
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
