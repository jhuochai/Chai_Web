import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import AiLab from './AiLab';
import { LanguageProvider } from '../i18n/LanguageContext';

function renderLab() {
  return render(
    <LanguageProvider>
      <AiLab controls={<button type="button">Return to Cockpit</button>} />
    </LanguageProvider>
  );
}

describe('AiLab', () => {
  afterEach(() => { document.body.style.overflow = ''; });

  it('renders one honest incubator, Stapu, Skills, and in-scene controls', () => {
    const { container } = renderLab();
    expect(screen.getByRole('heading', { name: 'AI Lab' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Inspect Stapu/i })).toBeEnabled();
    expect(screen.getByRole('button', { name: /Open Skills cabinet/i })).toBeEnabled();
    expect(screen.getByText(/Incubating/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Return to Cockpit' })).toBeInTheDocument();
    expect(container.querySelectorAll('.incubation-pod')).toHaveLength(1);
    expect(container.querySelectorAll('.ai-lab__project-card')).toHaveLength(0);
  });

  it('opens the Stapu record and returns focus on Escape', async () => {
    renderLab();
    const opener = screen.getByRole('button', { name: /Inspect Stapu/i });
    opener.focus();
    fireEvent.click(opener);
    expect(screen.getByRole('dialog', { name: /Stapu/i })).toBeInTheDocument();
    expect(document.body.style.overflow).toBe('hidden');
    fireEvent.keyDown(document, { key: 'Escape' });
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
    await waitFor(() => expect(opener).toHaveFocus());
  });

  it('lists only the four Skills actually used in this project', () => {
    renderLab();
    fireEvent.click(screen.getByRole('button', { name: /Open Skills cabinet/i }));
    const dialog = screen.getByRole('dialog', { name: /Skills Cabinet/i });
    for (const skill of ['impeccable', 'grill-me', 'brainstorming', 'hatch-pet']) {
      expect(dialog).toHaveTextContent(skill);
    }
    expect(dialog.querySelectorAll('li')).toHaveLength(4);
  });
});
