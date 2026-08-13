import { StrictMode, useState } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import CaseStack from './CaseStack';

const copy = {
  previous: '上一張',
  next: '下一張',
  play: '播放影片',
  unavailable: '媒體暫時無法顯示',
};

const items = [
  { id: 'one', type: 'image', src: '/one.jpg', alt: '第一張圖', title: '第一張' },
  { id: 'two', type: 'video', src: '/two.mp4', poster: '/poster.jpg', alt: '第二張影片', title: '第二張' },
  { id: 'three', type: 'data', title: '第三張', alt: '第三張資料卡' },
];

describe('CaseStack', () => {
  it('keeps threshold drag working under React StrictMode', () => {
    function Harness() {
      const [index, setIndex] = useState(0);
      return <CaseStack items={items} index={index} onIndexChange={setIndex} copy={copy} />;
    }

    const { container } = render(<StrictMode><Harness /></StrictMode>);
    const stack = container.querySelector('.case-stack__cards');
    fireEvent.pointerDown(stack, { pointerId: 31, clientX: 20, clientY: 20 });
    fireEvent.pointerMove(stack, { pointerId: 31, clientX: 151, clientY: 20 });
    fireEvent.pointerUp(stack, { pointerId: 31, clientX: 151, clientY: 20 });

    expect(screen.getByText('2 / 3')).toBeInTheDocument();
  });

  it('is controlled, deterministic, announced, and supports explicit controls', () => {
    const onIndexChange = vi.fn();
    const { container, rerender } = render(
      <CaseStack items={items} index={0} onIndexChange={onIndexChange} copy={copy} />
    );

    expect(screen.getByText('1 / 3')).toHaveAttribute('aria-live', 'polite');
    expect(screen.getByRole('img', { name: '第一張圖' })).toBeInTheDocument();
    expect(container.querySelectorAll('[data-stack-layer]')).toHaveLength(3);
    expect(container.querySelector('[data-stack-layer="0"]')).toHaveStyle({ transform: 'translate3d(0, 0px, 0) rotate(-1.5deg) scale(1)' });

    fireEvent.click(screen.getByRole('button', { name: '下一張' }));
    expect(onIndexChange).toHaveBeenCalledWith(1);

    rerender(<CaseStack items={items} index={1} onIndexChange={onIndexChange} copy={copy} />);
    expect(screen.getByText('2 / 3')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: '上一張' }));
    expect(onIndexChange).toHaveBeenLastCalledWith(0);
  });

  it('supports keyboard and advances only past the drag threshold', () => {
    const onIndexChange = vi.fn();
    const { container } = render(<CaseStack items={items} index={0} onIndexChange={onIndexChange} copy={copy} />);
    const stack = container.querySelector('.case-stack__cards');

    fireEvent.keyDown(stack, { key: 'ArrowRight' });
    expect(onIndexChange).toHaveBeenLastCalledWith(1);
    fireEvent.keyDown(stack, { key: 'ArrowLeft' });
    expect(onIndexChange).toHaveBeenLastCalledWith(2);

    onIndexChange.mockClear();
    fireEvent.pointerDown(stack, { pointerId: 7, clientX: 20, clientY: 20 });
    fireEvent.pointerMove(stack, { pointerId: 7, clientX: 70, clientY: 20 });
    fireEvent.pointerUp(stack, { pointerId: 7, clientX: 70, clientY: 20 });
    expect(onIndexChange).not.toHaveBeenCalled();

    fireEvent.pointerDown(stack, { pointerId: 8, clientX: 20, clientY: 20 });
    fireEvent.pointerMove(stack, { pointerId: 8, clientX: 150, clientY: 20 });
    fireEvent.pointerUp(stack, { pointerId: 8, clientX: 150, clientY: 20 });
    expect(onIndexChange).toHaveBeenCalledWith(1);
  });

  it('resets safely on pointer cancel and lost capture', () => {
    const onIndexChange = vi.fn();
    const { container } = render(<CaseStack items={items} index={0} onIndexChange={onIndexChange} copy={copy} />);
    const stack = container.querySelector('.case-stack__cards');

    fireEvent.pointerDown(stack, { pointerId: 9, clientX: 10, clientY: 10 });
    fireEvent.pointerMove(stack, { pointerId: 9, clientX: 160, clientY: 10 });
    fireEvent.pointerCancel(stack, { pointerId: 9 });
    fireEvent.pointerUp(stack, { pointerId: 9, clientX: 160, clientY: 10 });
    expect(onIndexChange).not.toHaveBeenCalled();

    fireEvent.pointerDown(stack, { pointerId: 10, clientX: 10, clientY: 10 });
    fireEvent.pointerMove(stack, { pointerId: 10, clientX: 160, clientY: 10 });
    fireEvent.lostPointerCapture(stack, { pointerId: 10 });
    expect(onIndexChange).not.toHaveBeenCalled();
  });

  it('releases an owned pointer capture on window blur', () => {
    const onIndexChange = vi.fn();
    const hasCapture = vi.fn(() => true);
    const releaseCapture = vi.fn();
    Object.defineProperty(HTMLElement.prototype, 'hasPointerCapture', { configurable: true, value: hasCapture });
    Object.defineProperty(HTMLElement.prototype, 'releasePointerCapture', { configurable: true, value: releaseCapture });
    const { container, unmount } = render(<CaseStack items={items} index={0} onIndexChange={onIndexChange} copy={copy} />);
    const stack = container.querySelector('.case-stack__cards');

    fireEvent.pointerDown(stack, { pointerId: 22, clientX: 10, clientY: 10 });
    fireEvent(window, new Event('blur'));
    expect(hasCapture).toHaveBeenCalledWith(22);
    expect(releaseCapture).toHaveBeenCalledWith(22);
    unmount();
  });

  it('never autoplays video and pauses it when the active item changes or unmounts', () => {
    const play = vi.spyOn(HTMLMediaElement.prototype, 'play').mockResolvedValue();
    const pause = vi.spyOn(HTMLMediaElement.prototype, 'pause').mockImplementation(() => {});
    const onIndexChange = vi.fn();
    const { rerender, unmount } = render(<CaseStack items={items} index={1} onIndexChange={onIndexChange} copy={copy} />);
    const video = screen.getByTestId('case-stack-video');

    expect(video).not.toHaveAttribute('autoplay');
    expect(video).toHaveAttribute('preload', 'metadata');
    fireEvent.click(screen.getByRole('button', { name: '播放影片' }));
    expect(play).toHaveBeenCalled();
    fireEvent.play(video);
    expect(screen.queryByRole('button', { name: '播放影片' })).toBeNull();

    rerender(<CaseStack items={items} index={2} onIndexChange={onIndexChange} copy={copy} />);
    expect(pause).toHaveBeenCalled();
    unmount();
    expect(pause).toHaveBeenCalled();
  });

  it('does not start a stack drag from interactive video controls or the play button', () => {
    const onIndexChange = vi.fn();
    const { container } = render(<CaseStack items={items} index={1} onIndexChange={onIndexChange} copy={copy} />);
    const video = screen.getByTestId('case-stack-video');
    const playButton = screen.getByRole('button', { name: '播放影片' });

    for (const target of [video, playButton]) {
      fireEvent.pointerDown(target, { pointerId: 41, clientX: 20, clientY: 20 });
      fireEvent.pointerMove(container.querySelector('.case-stack__cards'), { pointerId: 41, clientX: 180, clientY: 20 });
      fireEvent.pointerUp(container.querySelector('.case-stack__cards'), { pointerId: 41, clientX: 180, clientY: 20 });
    }

    expect(onIndexChange).not.toHaveBeenCalled();
  });
});
