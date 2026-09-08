import { afterEach, describe, expect, it, vi } from 'vitest';
import { waitForImages, waitForSceneAssets } from './sceneReady';

function pendingImage() {
  const image = new Image();
  Object.defineProperty(image, 'complete', { value: false });
  return image;
}

afterEach(() => vi.useRealTimers());
describe('scene asset readiness', () => {
  it('waits for every image and its decode', async () => {
    const first = pendingImage();
    const second = pendingImage();
    let decode;
    Object.defineProperty(first, 'naturalWidth', { value: 100 });
    first.decode = () => new Promise((resolve) => { decode = resolve; });
    const done = vi.fn();
    const ready = waitForImages([first, second]).then(done);
    first.dispatchEvent(new Event('load'));
    second.dispatchEvent(new Event('load'));
    await Promise.resolve();
    expect(done).not.toHaveBeenCalled();
    decode();
    await ready;
    expect(done).toHaveBeenCalledOnce();
  });
  it('settles failed, aborted and stalled resources without trapping navigation', async () => {
    vi.useFakeTimers();
    const broken = pendingImage();
    const failed = waitForImages([broken]);
    broken.dispatchEvent(new Event('error'));
    await failed;
    const controller = new AbortController();
    const aborted = waitForImages([pendingImage()], { signal: controller.signal });
    controller.abort();
    await aborted;
    const stalled = waitForImages([pendingImage()], { timeout: 8000 });
    await vi.advanceTimersByTimeAsync(8000);
    await stalled;
    expect(vi.getTimerCount()).toBe(0);
  });
  it('does not wait for offscreen lazy content', async () => {
    const root = document.createElement('section');
    const lazy = pendingImage();
    lazy.loading = 'lazy';
    root.append(lazy);
    await waitForSceneAssets(root);
  });
});
