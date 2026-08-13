import { render, screen } from '@testing-library/react';
import Contact from './Contact';
import { buildContactLinkData } from '../lib/contactLinks';
import { LanguageProvider } from '../i18n/LanguageContext';

function renderContact() {
  return render(
    <LanguageProvider>
      <Contact />
    </LanguageProvider>
  );
}

describe('Contact', () => {
  it('renders as #scene-7 without a decorative frame', () => {
    const { container } = renderContact();
    expect(container.querySelector('section')).toHaveAttribute('id', 'scene-7');
    expect(container.querySelector('.framed-panel')).toBeNull();
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
    const { container } = renderContact();
    expect(container.querySelector('.closing__links-pending')).toBeNull();
    for (const link of screen.getAllByRole('link')) {
      expect(link.getAttribute('href')?.trim()).toBeTruthy();
    }
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
