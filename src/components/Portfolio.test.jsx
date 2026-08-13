import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
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

describe('Portfolio analysis bay', () => {
  beforeEach(() => {
    window.localStorage.clear();
    document.body.style.overflow = '';
  });

  it('lands in a thick circular viewport with two whole case selectors', () => {
    const { container } = renderPortfolio();

    expect(container.querySelector('[data-station="portfolio"]')).toBeInTheDocument();
    expect(container.querySelector('.analysis-viewport__bezel')).toBeInTheDocument();
    expect(container.querySelector('.analysis-viewport__gasket')).toBeInTheDocument();
    expect(screen.getByRole('region', { name: '作品案例環形觀景窗' })).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: /開啟案例：/ })).toHaveLength(2);
    expect(screen.getByRole('button', { name: '開啟案例：貓咪造咖' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '開啟案例：暗棋廣告受眾測試' })).toBeInTheDocument();
    expect(screen.queryByText(/ROG Phone 9/i)).toBeNull();
  });

  it('opens a case at the same route, dims the gallery, and restores focus on close', async () => {
    window.history.replaceState({}, '', '/portfolio');
    const { container } = renderPortfolio();
    const opener = screen.getByRole('button', { name: '開啟案例：貓咪造咖' });
    opener.focus();

    fireEvent.click(opener);

    expect(window.location.pathname).toBe('/portfolio');
    expect(screen.getByRole('dialog', { name: '貓咪造咖案例分析桌' })).toBeInTheDocument();
    expect(container.querySelector('.analysis-viewport')).toHaveClass('analysis-viewport--dimmed');
    expect(document.body.style.overflow).toBe('hidden');
    expect(screen.getByRole('button', { name: '關閉案例分析桌' })).toHaveFocus();

    fireEvent.keyDown(document, { key: 'Escape' });

    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
    expect(document.body.style.overflow).toBe('');
    expect(opener).toHaveFocus();
  });

  it('opens the data-only Dark Chess case without fabricated media', () => {
    renderPortfolio();
    fireEvent.click(screen.getByRole('button', { name: '開啟案例：暗棋廣告受眾測試' }));

    const dialog = screen.getByRole('dialog', { name: '暗棋廣告受眾測試案例分析桌' });
    expect(within(dialog).getByText(/實際成效未達預期/)).toBeInTheDocument();
    expect(within(dialog).getByText(/即時停止投放/)).toBeInTheDocument();
    expect(within(dialog).queryByRole('img')).toBeNull();
    expect(within(dialog).queryByRole('video')).toBeNull();
  });

  it('renders localized English controls and copy', () => {
    renderPortfolio('en');

    expect(screen.getByRole('region', { name: 'Circular case viewport' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Open case: Cat Café' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Open case: Dark Chess audience test' })).toBeInTheDocument();
  });
});
