import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import Intro from './Intro';
import { LanguageProvider } from '../i18n/LanguageContext';
import { content } from '../data/content';

function renderIntro(lang = 'en') {
  window.localStorage.setItem('site-lang', lang);
  return render(<LanguageProvider><Intro /></LanguageProvider>);
}

describe("Captain's Office", () => {
  it('presents the profile as a captain dossier board with a temporary artwork portrait', () => {
    const { container } = renderIntro();

    expect(container.querySelector('.intro__dossier')).toBeInTheDocument();
    expect(container.querySelector('.intro__portrait')).toBeInTheDocument();
    expect(container.querySelector('.intro__metal-board')).toBeInTheDocument();
    expect(screen.getByText("Captain's Office")).toBeInTheDocument();
  });

  it('keeps all profile content and relocates the old hero tagline to the dossier', () => {
    const { container } = renderIntro();
    const text = container.textContent;

    expect(text).toContain(content.en.hero.tagline);
    expect(text).toContain(content.en.name.display);
    expect(text).toContain(content.en.title);
    for (const trait of content.en.traits) expect(text).toContain(trait.desc);
    expect(text).toContain(content.en.personalityBlurb);
  });

  it('uses Captain wording and a readable Chinese dossier', () => {
    renderIntro('zh');
    expect(screen.getByText(/艦長辦公室/)).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: content.zh.name.display })).toBeInTheDocument();
  });
});
