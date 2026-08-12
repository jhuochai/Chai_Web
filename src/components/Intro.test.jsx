import { render, screen } from '@testing-library/react';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { beforeEach, describe, expect, it } from 'vitest';
import Intro from './Intro';
import { LanguageProvider } from '../i18n/LanguageContext';
import { content } from '../data/content';

const globalStyles = readFileSync(join(process.cwd(), 'src', 'index.css'), 'utf8');
const introStyles = readFileSync(join(process.cwd(), 'src', 'components', 'Intro.css'), 'utf8');

function renderIntro(lang = 'en') {
  window.localStorage.setItem('site-lang', lang);
  return render(
    <LanguageProvider>
      <Intro />
    </LanguageProvider>
  );
}

describe('Intro', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('renders an open, text-led introduction without a frame, person, or numbered resume rows', () => {
    const { container } = renderIntro();

    expect(container.querySelector('section')).toHaveAttribute('id', 'scene-2');
    expect(container.querySelector('.intro__copy')).toBeInTheDocument();
    expect(container.querySelector('.framed-panel')).toBeNull();
    expect(container.querySelector('.intro__character-bridge, .intro img')).toBeNull();
    expect(container.querySelector('.intro__trait-index')).toBeNull();
    expect(container.querySelector('.badge, .pill, .tag')).toBeNull();
  });

  it('presents the claim, identity, positioning, evidence, and player view in that order', () => {
    const { container } = renderIntro();
    const text = container.textContent;
    const positioning = `${content.en.positioning.before}${content.en.positioning.emphasis}${content.en.positioning.after}`;

    const checkpoints = [
      content.en.hero.tagline,
      content.en.name.display,
      content.en.title,
      positioning,
      ...content.en.traits.flatMap((trait) => [trait.label, trait.desc]),
      content.en.intro.playerViewTitle,
      content.en.personalityBlurb,
    ];

    checkpoints.forEach((copy) => expect(text).toContain(copy));
    checkpoints.reduce((previousIndex, copy) => {
      const index = text.indexOf(copy);
      expect(index).toBeGreaterThan(previousIndex);
      return index;
    }, -1);
    expect(
      screen.getByRole('complementary', { name: content.en.intro.playerViewTitle })
    ).toHaveTextContent(content.en.personalityBlurb);
    expect(
      screen.getByRole('list', { name: content.en.intro.strengthsLabel })
    ).toBeInTheDocument();
  });

  it('uses the authoritative Traditional Chinese copy without losing mixed-script spacing', () => {
    const { container } = renderIntro('zh');

    expect(screen.getByRole('heading', { name: content.zh.name.display })).toBeInTheDocument();
    expect(container.querySelector('.intro__claim')).toHaveTextContent(content.zh.hero.tagline);
    expect(
      screen.getByRole('complementary', { name: content.zh.intro.playerViewTitle })
    ).toHaveTextContent(content.zh.personalityBlurb);
    expect(
      screen.getByRole('heading', { name: content.zh.intro.playerViewTitle })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('list', { name: content.zh.intro.strengthsLabel })
    ).toBeInTheDocument();
    for (const trait of content.zh.traits) {
      expect(screen.getByRole('heading', { name: trait.label })).toBeInTheDocument();
      expect(screen.getByText(trait.desc)).toBeInTheDocument();
    }
  });

  it('scopes legible Traditional Chinese typography globally', () => {
    expect(globalStyles).toMatch(/:lang\(zh-Hant\)[^{]*\{[^}]*font-family:\s*['"]LXGW WenKai TC['"]/s);
    expect(globalStyles).toMatch(/:lang\(zh-Hant\)[^{]*\{[^}]*letter-spacing:\s*0\.02em/s);
    expect(globalStyles).toMatch(/:lang\(zh-Hant\)\s+p\s*\{[^}]*line-height:\s*1\.9/s);
    expect(globalStyles).toMatch(/:lang\(zh-Hant\)\s+(?:em|i)[^{,]*(?:,[^{]*)?\{[^}]*font-style:\s*normal/s);
    expect(globalStyles).toMatch(/h1,\s*h2,\s*h3,\s*h4\s*\{[^}]*text-wrap:\s*balance/s);
    expect(globalStyles).toMatch(/p\s*\{[^}]*max-width:\s*70ch[^}]*text-wrap:\s*pretty/s);
  });

  it('keeps the secondary name at the readable text token', () => {
    expect(introStyles).toMatch(
      /\.intro__name-sub\s*\{[^}]*color:\s*var\(--parchment-dim\)/s
    );
    expect(introStyles).not.toMatch(
      /\.intro__name-sub\s*\{[^}]*color:\s*var\(--parchment-faint\)/s
    );
  });
});
