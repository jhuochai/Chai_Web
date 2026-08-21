import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import HeroHologram from './HeroHologram';
import { LanguageProvider } from '../../i18n/LanguageContext';

function renderHologram(props = {}) {
  return render(
    <LanguageProvider>
      <button type="button">Core opener</button>
      <HeroHologram open onClose={() => {}} onEnter={() => {}} {...props} />
    </LanguageProvider>
  );
}

describe('HeroHologram', () => {
  it('focuses the preview, enters the lab, and closes on Escape', async () => {
    const onClose = vi.fn();
    const onEnter = vi.fn();
    renderHologram({ onClose, onEnter });
    const dialog = screen.getByRole('dialog', { name: /AI Lab preview/i });
    await waitFor(() => expect(dialog).toHaveFocus());

    fireEvent.click(screen.getByRole('button', { name: /Enter AI Lab/i }));
    expect(onEnter).toHaveBeenCalledOnce();
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('locks body scroll and returns focus to the opener when dismissed', async () => {
    const opener = document.createElement('button');
    document.body.append(opener);
    opener.focus();
    const onClose = vi.fn();
    const { rerender } = render(
      <LanguageProvider><HeroHologram open openerRef={{ current: opener }} onClose={onClose} onEnter={() => {}} /></LanguageProvider>
    );
    expect(document.body.style.overflow).toBe('hidden');
    rerender(<LanguageProvider><HeroHologram open={false} openerRef={{ current: opener }} onClose={onClose} onEnter={() => {}} /></LanguageProvider>);
    await waitFor(() => expect(opener).toHaveFocus());
    expect(document.body.style.overflow).toBe('');
    opener.remove();
  });
});
