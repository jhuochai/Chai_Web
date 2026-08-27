import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import CollaboratorSeats from './CollaboratorSeats';
import { LanguageProvider } from '../i18n/LanguageContext';

describe('CollaboratorSeats', () => {
  it('records Codex and Claude as named collaborators without unfinished placeholders', () => {
    const { container } = render(<LanguageProvider><CollaboratorSeats /></LanguageProvider>);

    expect(screen.getByText(/Codex/)).toBeInTheDocument();
    expect(screen.getByText(/Claude/)).toBeInTheDocument();
    expect(container).not.toHaveTextContent(/pending|待補/i);
    expect(container.querySelector('.collaborator-seats__placeholder')).toBeNull();
    expect(container.querySelector('img')).toBeNull();
    expect(container.querySelector('blockquote')).toBeNull();
    expect(screen.getByText(/collaborators and choices/i)).toBeInTheDocument();
  });
});
