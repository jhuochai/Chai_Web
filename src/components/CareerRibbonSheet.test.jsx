import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { useRef, useState } from 'react';
import CareerRibbonSheet from './CareerRibbonSheet';

const item = {
  id: 'gamesofa',
  org: 'Gamesofa 慧邦科技',
  role: 'Game Marketing Intern',
  period: 'Mar 2026 – Present',
  summary: 'Social growth and audience testing.',
  points: ['Grew the community with evidence-led content.'],
  closeLabel: 'Close',
};

function RibbonHarness() {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef(null);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        aria-label={item.org}
        onClick={() => setOpen(true)}
      >
        Ribbon
      </button>
      <CareerRibbonSheet
        item={item}
        open={open}
        onClose={() => setOpen(false)}
        triggerRef={triggerRef}
      />
    </>
  );
}

describe('CareerRibbonSheet', () => {
  it('opens from one click without a pull gesture', () => {
    render(<RibbonHarness />);
    fireEvent.click(screen.getByRole('button', { name: item.org }));
    expect(screen.getByRole('dialog', { name: item.org })).toBeInTheDocument();
    expect(screen.getByTestId('inspection-dock')).toHaveAttribute('data-variant', 'ribbon');
    expect(screen.queryByRole('status')).toBeNull();
  });

  it('traps focus, locks scroll, and returns focus after Escape', async () => {
    render(<RibbonHarness />);
    const trigger = screen.getByRole('button', { name: item.org });
    trigger.focus();
    fireEvent.click(trigger);
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
    fireEvent.click(screen.getByRole('button', { name: item.org }));
    fireEvent.click(screen.getByTestId('career-ribbon-backdrop'));
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
  });
});
