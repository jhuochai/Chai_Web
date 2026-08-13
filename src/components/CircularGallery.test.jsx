import { fireEvent, render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import CircularGallery from './CircularGallery';

const items = [
  { id: 'cat', image: '/cat.jpg', text: '貓咪造咖' },
  { id: 'chess', image: '/chess.svg', text: '暗棋' },
];

describe('CircularGallery', () => {
  it('keeps WebGL presentation and exposes synchronized semantic case controls', () => {
    const onSelect = vi.fn();
    render(
      <CircularGallery
        items={items}
        activeId="cat"
        onSelect={onSelect}
        ariaLabel="作品案例環形觀景窗"
        selectLabel={(item) => `開啟案例：${item.text}`}
      />
    );

    expect(screen.getByRole('region', { name: '作品案例環形觀景窗' })).toBeInTheDocument();
    expect(document.querySelector('.circular-gallery__canvas')).toHaveAttribute('tabindex', '-1');
    expect(screen.getAllByRole('button')).toHaveLength(2);
    expect(screen.getByRole('button', { name: '開啟案例：貓咪造咖' })).toHaveAttribute('aria-current', 'true');
    fireEvent.click(screen.getByRole('button', { name: '開啟案例：暗棋' }));
    expect(onSelect).toHaveBeenCalledWith(items[1]);
  });
});
