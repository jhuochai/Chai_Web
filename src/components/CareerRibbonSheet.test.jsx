import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { useRef, useState } from 'react';
import { vi } from 'vitest';
import CareerRibbonSheet from './CareerRibbonSheet';

const item = {
  id: 'gamesofa',
  org: 'Gamesofa 慧邦科技',
  role: 'Game Marketing Intern',
  period: 'Mar 2026 – Present',
  summary: 'Social growth and audience testing.',
  points: ['Grew the community with evidence-led content.'],
  dragHint: 'Hold the ribbon and pull down',
  closeLabel: 'Close',
};

function RibbonHarness({ onOpenSpy = () => {} }) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef(null);

  return (
    <>
      <button ref={triggerRef} type="button" aria-label={item.org}>
        Ribbon
      </button>
      <CareerRibbonSheet
        item={item}
        open={open}
        onOpen={() => {
          onOpenSpy();
          setOpen(true);
        }}
        onClose={() => setOpen(false)}
        triggerRef={triggerRef}
      />
    </>
  );
}

describe('CareerRibbonSheet', () => {
  it('shows a discoverable pull hint when the trigger receives focus', () => {
    render(<RibbonHarness />);
    fireEvent.focus(screen.getByRole('button', { name: item.org }));
    expect(screen.getByText(item.dragHint)).toBeInTheDocument();
  });

  it('opens only after a downward pull reaches the viewport-aware threshold', () => {
    const onOpen = vi.fn();
    render(<RibbonHarness onOpenSpy={onOpen} />);
    const trigger = screen.getByRole('button', { name: item.org });

    fireEvent.pointerDown(trigger, { pointerId: 1, clientY: 100 });
    fireEvent.pointerMove(window, { pointerId: 1, clientY: 160 });
    fireEvent.pointerUp(window, { pointerId: 1, clientY: 160 });
    expect(onOpen).not.toHaveBeenCalled();
    expect(screen.queryByRole('dialog')).toBeNull();

    fireEvent.pointerDown(trigger, { pointerId: 2, clientY: 100 });
    fireEvent.pointerMove(window, { pointerId: 2, clientY: 240 });
    fireEvent.pointerUp(window, { pointerId: 2, clientY: 240 });
    expect(onOpen).toHaveBeenCalledTimes(1);
    expect(screen.getByRole('dialog', { name: item.org })).toBeInTheDocument();
  });

  it('restores the ribbon after pointer cancellation without opening', () => {
    const onOpen = vi.fn();
    render(<RibbonHarness onOpenSpy={onOpen} />);
    const trigger = screen.getByRole('button', { name: item.org });

    fireEvent.pointerDown(trigger, { pointerId: 7, clientY: 40 });
    fireEvent.pointerMove(window, { pointerId: 7, clientY: 210 });
    fireEvent.pointerCancel(window, { pointerId: 7 });

    expect(onOpen).not.toHaveBeenCalled();
    expect(trigger.style.getPropertyValue('--ribbon-pull')).toBe('0px');
  });

  it('opens with Space, traps focus, locks scroll, and returns focus after Escape', async () => {
    render(<RibbonHarness />);
    const trigger = screen.getByRole('button', { name: item.org });
    trigger.focus();

    fireEvent.keyDown(trigger, { key: ' ' });
    const dialog = screen.getByRole('dialog', { name: item.org });
    const close = screen.getByRole('button', { name: item.closeLabel });

    expect(dialog).toBeInTheDocument();
    expect(document.body.style.overflow).toBe('hidden');
    expect(close).toHaveFocus();

    fireEvent.keyDown(document, { key: 'Tab' });
    expect(close).toHaveFocus();

    fireEvent.keyDown(document, { key: 'Escape' });
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
    expect(document.body.style.overflow).toBe('');
    expect(trigger).toHaveFocus();
  });

  it('closes when the safe backdrop is clicked', async () => {
    render(<RibbonHarness />);
    const trigger = screen.getByRole('button', { name: item.org });
    fireEvent.keyDown(trigger, { key: 'Enter' });

    fireEvent.click(screen.getByTestId('career-ribbon-backdrop'));
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
  });
});
