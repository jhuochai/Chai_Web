import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import Portfolio from './Portfolio';
import { LanguageProvider } from '../i18n/LanguageContext';

function renderPortfolio(lang = 'zh') {
  window.localStorage.setItem('site-lang', lang);
  return render(
    <LanguageProvider>
      <Portfolio />
    </LanguageProvider>
  );
}

describe('Portfolio', () => {
  beforeEach(() => {
    window.localStorage.clear();
    document.body.style.overflow = '';
  });

  it('renders as #scene-5', () => {
    const { container } = renderPortfolio();
    expect(container.querySelector('section')).toHaveAttribute('id', 'scene-5');
  });

  it('renders one Cat Cafe hero and eight evidence figures without retired work', () => {
    const { container } = renderPortfolio();

    expect(screen.getByRole('heading', { name: '貓咪造咖' })).toBeInTheDocument();
    expect(container.querySelectorAll('[data-evidence-id]')).toHaveLength(8);
    expect(container.querySelector('.circular-gallery')).toBeNull();
    expect(screen.queryByText(/ROG Phone 9/i)).toBeNull();
    expect(screen.queryByText(/KOC 異業合作/i)).toBeNull();
    expect(container.querySelector('.portfolio__player')).toBeNull();
  });

  it('groups the evidence under four content pillars and keeps the Dark Chess learning note', () => {
    const { container } = renderPortfolio();

    expect(container.querySelectorAll('.portfolio-pillar__head h3')).toHaveLength(4);
    expect(screen.getByRole('heading', { name: '暗棋廣告受眾測試' })).toBeInTheDocument();
    expect(screen.getByText(/實際成效未達預期/)).toBeInTheDocument();
    expect(screen.getByText(/即時停止投放/)).toBeInTheDocument();
  });

  it('opens evidence in an accessible lightbox and restores focus on Escape', async () => {
    renderPortfolio();
    const opener = screen.getByRole('button', { name: /放大檢視：7 月水果貓/ });

    opener.focus();
    fireEvent.click(opener);

    const dialog = screen.getByRole('dialog', { name: '7 月水果貓' });
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(document.querySelector('#scene-5')).toHaveAttribute('inert');
    expect(document.body.style.overflow).toBe('hidden');
    expect(screen.getByRole('button', { name: '關閉作品檢視' })).toHaveFocus();

    fireEvent.keyDown(document, { key: 'Escape' });

    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
    expect(document.body.style.overflow).toBe('');
    expect(document.querySelector('#scene-5')).not.toHaveAttribute('inert');
    expect(opener).toHaveFocus();
  });

  it('closes the lightbox from its backdrop', async () => {
    renderPortfolio();
    fireEvent.click(screen.getByRole('button', { name: /放大檢視：世界海洋日/ }));

    fireEvent.mouseDown(screen.getByTestId('portfolio-lightbox-backdrop'));

    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
  });

  it('renders the English case copy when English is selected', () => {
    renderPortfolio('en');

    expect(screen.getByRole('heading', { name: 'Cat Café' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Dark Chess audience test' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Open detail: July Watermelon Cat/ })).toBeInTheDocument();
  });
});
