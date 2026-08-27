import { fireEvent, render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import CircularGallery from './CircularGallery';

const items = [
  { id: 'cat', image: '/cat.webp', text: '貓咪造咖' },
  { id: 'chess', image: '/chess.webp', text: '暗棋' },
];

describe('CircularGallery', () => {
  it('renders case cards as the only selectors', () => {
    render(<CircularGallery items={items} activeId="cat" onSelect={vi.fn()} ariaLabel="作品案例環形觀景窗" selectLabel={(item) => `開啟案例：${item.text}`} />);
    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(2);
    expect(buttons[0]).toHaveClass('circular-gallery__card');
    expect(buttons[0]).toHaveAttribute('aria-current', 'true');
    expect(document.querySelector('.circular-gallery__selectors')).toBeNull();
  });

  it('centers with arrow keys without opening', () => {
    const onSelect = vi.fn();
    render(<CircularGallery items={items} activeId="cat" onSelect={onSelect} ariaLabel="作品案例環形觀景窗" selectLabel={(item) => `開啟案例：${item.text}`} />);
    fireEvent.keyDown(screen.getByRole('region'), { key: 'ArrowRight' });
    expect(screen.getByRole('button', { name: '開啟案例：暗棋' })).toHaveAttribute('aria-current', 'true');
    expect(onSelect).not.toHaveBeenCalled();
  });

  it('centers after a pointer drag', () => {
    render(<CircularGallery items={items} activeId="cat" onSelect={vi.fn()} ariaLabel="作品案例環形觀景窗" selectLabel={(item) => `開啟案例：${item.text}`} />);
    const region = screen.getByRole('region');
    fireEvent.pointerDown(region, { clientX: 260, pointerId: 1 });
    fireEvent.pointerUp(region, { clientX: 150, pointerId: 1 });
    expect(screen.getByRole('button', { name: '開啟案例：暗棋' })).toHaveAttribute('aria-current', 'true');
  });

  it('opens the clicked card', () => {
    const onSelect = vi.fn();
    render(<CircularGallery items={items} activeId="cat" onSelect={onSelect} ariaLabel="作品案例環形觀景窗" selectLabel={(item) => `開啟案例：${item.text}`} />);
    fireEvent.click(screen.getByRole('button', { name: '開啟案例：暗棋' }));
    expect(onSelect).toHaveBeenCalledWith(items[1]);
  });
});
