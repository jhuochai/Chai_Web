import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { useRef, useState } from 'react';
import Contact from './Contact';
import { buildContactLinkData } from '../lib/contactLinks';
import { LanguageProvider } from '../i18n/LanguageContext';

function renderContact(props = {}) {
  return render(
    <LanguageProvider>
      <Contact open onClose={() => {}} {...props} />
    </LanguageProvider>
  );
}

describe('Contact', () => {
  afterEach(() => {
    document.body.style.overflow = '';
    window.localStorage.removeItem('site-lang');
  });

  it('renders nothing while closed and opens as a compact communications dialog', () => {
    const { container, rerender } = render(
      <LanguageProvider>
        <Contact open={false} onClose={() => {}} />
      </LanguageProvider>
    );

    expect(screen.queryByRole('dialog', { name: 'Ship communications console' })).toBeNull();

    rerender(
      <LanguageProvider>
        <Contact open onClose={() => {}} />
      </LanguageProvider>
    );

    expect(screen.getByRole('dialog', { name: 'Ship communications console' })).toBeInTheDocument();
    expect(container.querySelector('#scene-7')).toBeNull();
    expect(screen.queryByText(/Creative sets the direction/i)).toBeNull();
  });

  it('uses no decorative frame or legacy closing presentation', () => {
    const { container } = renderContact();
    const dialog = screen.getByRole('dialog', { name: 'Ship communications console' });
    expect(dialog.querySelector('.framed-panel')).toBeNull();
    expect(document.querySelector('.closing')).toBeNull();
    expect(document.querySelector('.closing__fog')).toBeNull();
    expect(container.querySelector('#scene-7')).toBeNull();
  });

  it('uses the real LinkedIn profile and keeps external navigation safe', () => {
    renderContact();

    expect(screen.getByRole('link', { name: /LinkedIn/i })).toHaveAttribute(
      'href',
      'https://www.linkedin.com/in/yichen-chai-3019492b4/'
    );
    expect(screen.getByRole('link', { name: /LinkedIn/i })).toHaveAttribute('target', '_blank');
    expect(screen.getByRole('link', { name: /LinkedIn/i })).toHaveAttribute('rel', 'noreferrer');
  });

  it('does not leave pending or invalid contact rows in the interface', () => {
    renderContact();
    expect(document.querySelector('.closing__links-pending')).toBeNull();
    for (const link of screen.getAllByRole('link')) {
      expect(link.getAttribute('href')?.trim()).toBeTruthy();
    }
  });

  it('locks and restores the page, traps focus, closes safely, and returns to a stable opener', async () => {
    document.body.style.overflow = 'scroll';

    function Harness() {
      const [open, setOpen] = useState(false);
      const openerRef = useRef(null);
      return (
        <LanguageProvider>
          <button ref={openerRef} type="button" onClick={() => setOpen(true)}>Open comms</button>
          <Contact open={open} onClose={() => setOpen(false)} returnFocusTo={openerRef} />
        </LanguageProvider>
      );
    }

    const { container } = render(<Harness />);
    const opener = screen.getByRole('button', { name: 'Open comms' });
    opener.focus();
    fireEvent.click(opener);

    expect(document.body.style.overflow).toBe('hidden');
    expect(container).toHaveAttribute('inert');
    expect(screen.getByRole('button', { name: 'Close communications console' })).toHaveFocus();

    const messageButton = screen.getByRole('button', { name: /Leave a message/i });
    messageButton.focus();
    fireEvent.keyDown(document, { key: 'Tab' });
    expect(screen.getByRole('button', { name: 'Close communications console' })).toHaveFocus();

    fireEvent.mouseDown(screen.getByTestId('comms-backdrop').firstElementChild);
    expect(screen.getByRole('dialog', { name: 'Ship communications console' })).toBeInTheDocument();

    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.queryByRole('dialog', { name: 'Ship communications console' })).toBeNull();
    expect(document.body.style.overflow).toBe('scroll');
    expect(container).not.toHaveAttribute('inert');
    await waitFor(() => expect(opener).toHaveFocus());
  });

  it('keeps the message dialog user initiated and restores focus inside comms when it closes', async () => {
    renderContact();
    const trigger = screen.getByRole('button', { name: /Leave a message/i });

    expect(screen.queryByRole('dialog', { name: /Send a message/i })).toBeNull();
    fireEvent.click(trigger);
    expect(screen.getByRole('dialog', { name: /Send a message/i })).toBeInTheDocument();

    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.queryByRole('dialog', { name: /Send a message/i })).toBeNull();
    expect(screen.getByRole('dialog', { name: 'Ship communications console' })).toBeInTheDocument();
    await waitFor(() => expect(trigger).toHaveFocus());
  });

  it('lets Escape close only the nested message dialog before it closes comms', async () => {
    const onClose = vi.fn();
    renderContact({ onClose });
    const trigger = screen.getByRole('button', { name: /Leave a message/i });
    fireEvent.click(trigger);

    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.queryByRole('dialog', { name: /Send a message/i })).toBeNull();
    expect(screen.getByRole('dialog', { name: 'Ship communications console' })).toBeInTheDocument();
    expect(onClose).not.toHaveBeenCalled();
    await waitFor(() => expect(trigger).toHaveFocus());

    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('omits malformed email, LinkedIn, and unsafe resume destinations', () => {
    expect(buildContactLinkData({
      email: 'not-an-email',
      linkedin: 'https://example.com/not-linkedin',
      resumeUrl: 'javascript:alert(1)',
      resumeLabel: '履歷',
    })).toEqual([]);

    expect(buildContactLinkData({
      resumeUrl: '/\\evil.com/file.pdf',
      resumeLabel: '履歷',
    })).toEqual([]);

    expect(buildContactLinkData({
      email: 'chai@example.com',
      linkedin: 'https://www.linkedin.com/in/yichen-chai-3019492b4/',
      resumeUrl: '/resume.pdf',
      resumeLabel: '履歷',
    })).toHaveLength(3);
  });
});
