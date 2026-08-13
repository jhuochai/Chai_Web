import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import CollaboratorSeats from './CollaboratorSeats';
import { LanguageProvider } from '../i18n/LanguageContext';

describe('CollaboratorSeats', () => {
  it('records Codex and Claude as collaborators with pending descriptions, not portraits or quotes', () => {
    const { container } = render(<LanguageProvider><CollaboratorSeats /></LanguageProvider>);

    expect(screen.getByText(/Codex/)).toBeInTheDocument();
    expect(screen.getByText(/Claude/)).toBeInTheDocument();
    expect(screen.getAllByText(/pending/i)).toHaveLength(2);
    expect(container.querySelector('img')).toBeNull();
    expect(container.querySelector('blockquote')).toBeNull();
  });
});
