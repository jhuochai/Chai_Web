export function buildContactLinkData(contact) {
  const email = contact.email?.trim() ?? '';
  const linkedin = contact.linkedin?.trim() ?? '';
  const resumeUrl = contact.resumeUrl?.trim() ?? '';
  const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validLinkedIn = /^https:\/\/www\.linkedin\.com\/in\/[A-Za-z0-9_%.-]+\/?$/i.test(linkedin);
  const safeBase = 'https://portfolio.local';
  let validResume = /^https:\/\//i.test(resumeUrl);
  if (resumeUrl.startsWith('/') && !resumeUrl.startsWith('//') && !resumeUrl.includes('\\')) {
    try {
      validResume = new URL(resumeUrl, safeBase).origin === safeBase;
    } catch {
      validResume = false;
    }
  }

  return [
    validEmail ? { id: 'email', href: `mailto:${email}`, label: email } : null,
    validLinkedIn ? { id: 'linkedin', href: linkedin, label: 'LinkedIn', external: true } : null,
    validResume ? { id: 'resume', href: resumeUrl, label: contact.resumeLabel, download: true } : null,
  ].filter(Boolean);
}
