import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import AiLab from './AiLab';
import { LanguageProvider } from '../i18n/LanguageContext';

function mount() { return render(<LanguageProvider><AiLab controls={<button>返回駕駛艙</button>} /></LanguageProvider>); }
function launch(name) { fireEvent.click(screen.getByRole('button', { name })); return screen.getByRole('dialog'); }
beforeEach(() => localStorage.setItem('site-lang', 'zh'));
afterEach(() => { vi.useRealTimers(); localStorage.clear(); });

describe('AI lab interactive projects', () => {
  it('opens a device, contains keyboard focus, and returns to its trigger on Escape', async () => {
    const { container } = mount();
    const opener = screen.getByRole('button', { name: '試用直播工作台' });
    opener.focus(); fireEvent.click(opener);
    const dialog = screen.getByRole('dialog', { name: '直播工作台 · 互動示範' });
    expect(container).toHaveAttribute('inert');
    expect(document.body.style.overflow).toBe('hidden');
    expect(within(dialog).getByRole('button', { name: '返回實驗室' })).toHaveFocus();
    within(dialog).getByRole('button', { name: '重設示範' }).focus();
    fireEvent.keyDown(document, { key: 'Tab', shiftKey: true });
    expect(within(dialog).getByRole('checkbox', { name: '整理上次直播的精華片段' })).toHaveFocus();
    fireEvent.keyDown(document, { key: 'Tab' });
    expect(within(dialog).getByRole('button', { name: '重設示範' })).toHaveFocus();
    fireEvent.keyDown(document, { key: 'Escape' });
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
    await waitFor(() => expect(opener).toHaveFocus());
    expect(container).not.toHaveAttribute('inert');
    expect(document.body.style.overflow).not.toBe('hidden');
  });

  it('supports schedule details, adding/completing tasks, theme choice and a real reset', () => {
    mount(); const dialog = launch('試用直播工作台');
    fireEvent.click(within(dialog).getByRole('button', { name: '直播班表' }));
    fireEvent.click(within(dialog).getByRole('button', { name: /週五同樂夜/ }));
    expect(dialog).toHaveTextContent('開場聊天 → 遊戲挑戰 → 觀眾回饋');
    fireEvent.click(within(dialog).getByRole('button', { name: '待辦事項' }));
    const input = within(dialog).getByLabelText('新增待辦');
    fireEvent.change(input, { target: { value: '剪一支精華' } });
    expect(input).toHaveValue('剪一支精華');
    fireEvent.submit(input.closest('form'));
    const task = within(dialog).getByRole('checkbox', { name: '剪一支精華' });
    fireEvent.click(task); expect(task).toBeChecked();
    fireEvent.click(within(dialog).getByRole('button', { name: '外觀設定' }));
    fireEvent.click(within(dialog).getByRole('button', { name: '深夜可可' }));
    expect(within(dialog).getByRole('button', { name: '深夜可可' })).toHaveAttribute('aria-pressed', 'true');
    fireEvent.click(within(dialog).getByRole('button', { name: '重設示範' }));
    fireEvent.click(within(dialog).getByRole('button', { name: '待辦事項' }));
    expect(within(dialog).queryByRole('checkbox', { name: '剪一支精華' })).toBeNull();
    expect(localStorage.length).toBe(1);
  });

  it('plays original sample text, changes opacity/translation, locks, and resets', () => {
    vi.useFakeTimers(); mount(); const dialog = launch('試用桌面歌詞');
    fireEvent.click(within(dialog).getByRole('button', { name: '播放示範' }));
    act(() => vi.advanceTimersByTime(9000));
    expect(within(dialog).getByRole('slider', { name: '播放進度' })).toHaveValue('9');
    fireEvent.click(within(dialog).getByRole('button', { name: '暫停示範' }));
    fireEvent.change(within(dialog).getByRole('slider', { name: '背景透明度' }), { target: { value: '0' } });
    expect(dialog).toHaveTextContent('0%');
    fireEvent.click(within(dialog).getByRole('checkbox', { name: '顯示翻譯' }));
    expect(within(dialog).getByRole('checkbox', { name: '顯示翻譯' })).not.toBeChecked();
    fireEvent.click(within(dialog).getByRole('button', { name: '鎖定歌詞位置' }));
    expect(within(dialog).getByRole('button', { name: '解鎖歌詞位置' })).toBeInTheDocument();
    fireEvent.click(within(dialog).getByRole('button', { name: '重設示範' }));
    expect(within(dialog).getByRole('slider', { name: '播放進度' })).toHaveValue('0');
    expect(within(dialog).getByRole('checkbox', { name: '顯示翻譯' })).toBeChecked();
  });

  it('keeps edited tasks when reading the project story and returning', () => {
    mount(); const dialog = launch('試用直播工作台');
    fireEvent.click(within(dialog).getByRole('button', { name: '待辦事項' }));
    fireEvent.click(within(dialog).getByRole('button', { name: '編輯 準備開場話題' }));
    fireEvent.change(within(dialog).getByLabelText('編輯待辦內容'), { target: { value: '先問觀眾一個問題' } });
    fireEvent.click(within(dialog).getByRole('button', { name: '儲存待辦' }));
    fireEvent.click(within(dialog).getByRole('button', { name: '製作過程', exact: true }));
    expect(within(dialog).queryByRole('checkbox', { name: '先問觀眾一個問題' })).toBeNull();
    fireEvent.click(within(dialog).getByRole('button', { name: '互動示範', exact: true }));
    expect(within(dialog).getByRole('checkbox', { name: '先問觀眾一個問題' })).toBeInTheDocument();
  });

  it('preserves lyric settings across project tabs and fits the overlay when its size changes', () => {
    const callbacks = [];
    const observed = [];
    vi.stubGlobal('ResizeObserver', class { constructor(callback) { callbacks.push(callback); } observe(el) { observed.push(el); } disconnect() {} });
    try {
      mount(); const dialog = launch('試用桌面歌詞');
      const stage = dialog.querySelector('.lyrics-stage');
      const overlay = dialog.querySelector('.lyrics-overlay');
      vi.spyOn(stage, 'getBoundingClientRect').mockReturnValue({ width: 600, height: 330 });
      vi.spyOn(overlay, 'getBoundingClientRect').mockImplementation(() => ({ width: 440, height: within(dialog).getByRole('checkbox', { name: '顯示翻譯' }).checked ? 230 : 190 }));
      fireEvent.click(within(dialog).getByRole('checkbox', { name: '顯示翻譯' }));
      for (let i = 0; i < 10; i++) fireEvent.keyDown(within(dialog).getByRole('button', { name: '移動歌詞（方向鍵或拖曳）' }), { key: 'ArrowDown' });
      expect(overlay.style.transform).toContain('62px');
      fireEvent.click(within(dialog).getByRole('checkbox', { name: '顯示翻譯' }));
      expect(observed).toContain(overlay);
      act(() => callbacks.forEach(callback => callback()));
      expect(overlay.style.transform).toContain('42px');
      fireEvent.change(within(dialog).getByRole('slider', { name: '背景透明度' }), { target: { value: '70' } });
      fireEvent.click(within(dialog).getByRole('button', { name: '下載 Windows 版' }));
      fireEvent.click(within(dialog).getByRole('button', { name: '互動示範', exact: true }));
      expect(within(dialog).getByRole('slider', { name: '背景透明度' })).toHaveValue('70');
    } finally { vi.unstubAllGlobals(); }
  });
});
