import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import Intro from './Intro';
import { LanguageProvider } from '../i18n/LanguageContext';
import { content } from '../data/content';

const routeMocks = vi.hoisted(() => ({ navigateToRoute: vi.fn() }));
vi.mock('../lib/siteRoute', () => routeMocks);

function renderIntro(lang = 'en') {
  window.localStorage.setItem('site-lang', lang);
  return render(<LanguageProvider><Intro /></LanguageProvider>);
}

describe("Captain's Office", () => {
  it('presents the profile as a finished captain dossier with a front portrait', () => {
    const { container } = renderIntro();

    expect(container.querySelector('.intro__dossier')).toBeInTheDocument();
    expect(container.querySelector('.intro__portrait')).toBeInTheDocument();
    expect(container.querySelector('.intro__portrait img')).toHaveAttribute('src', expect.stringContaining('captain-portrait-front'));
    expect(container.querySelector('.intro__metal-board')).toBeInTheDocument();
    expect(screen.getByText("Captain's Office")).toBeInTheDocument();
    expect(container).not.toHaveTextContent(/TEMP|temporary artwork/i);
  });

  it('leads with recruiter-readable positioning, verified results, and a case action', () => {
    const { container } = renderIntro();
    const text = container.textContent;

    expect(content.en.hero.tagline).toBeUndefined();
    expect(text).toContain(content.en.name.display);
    expect(text).toContain(content.en.title);
    expect(text).toMatch(/18k.*30k/i);
    expect(text).toMatch(/24.*26/);
    expect(text).toMatch(/three KOC/i);
    for (const trait of content.en.traits) expect(text).toContain(trait.desc);
    expect(text).toContain(content.en.personalityBlurb);
    const caseButton = screen.getByRole('button', { name: /View marketing cases/i });
    fireEvent.click(caseButton);
    expect(routeMocks.navigateToRoute).toHaveBeenCalledWith('/portfolio');
    expect(text).not.toMatch(/Aim on instinct/i);
  });

  it('uses Captain wording and a readable Chinese dossier', () => {
    const { container } = renderIntro('zh');
    expect(screen.getByText(/艦長辦公室/)).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: content.zh.name.display })).toBeInTheDocument();
    expect(container).toHaveTextContent('任職期間 IG 追蹤由 1.8 萬增至 3 萬');
    expect(container).not.toHaveTextContent(/暫用|靠直覺瞄準/);
  });
});
