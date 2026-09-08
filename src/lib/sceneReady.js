// Wait for image load/decode, with a bounded fallback for broken networks.
export function waitForImages(images, { signal, timeout = 8000 } = {}) {
  return new Promise((resolve) => {
    const cleanups = [];
    let settled = false;
    const finish = () => {
      if (settled) return;
      settled = true;
      cleanups.forEach((cleanup) => cleanup());
      resolve();
    };
    const timer = window.setTimeout(finish, timeout);
    cleanups.push(() => window.clearTimeout(timer));
    signal?.addEventListener('abort', finish, { once: true });
    cleanups.push(() => signal?.removeEventListener('abort', finish));
    if (signal?.aborted) return finish();
    Promise.all(images.map((image) => new Promise((done) => {
      const decoded = () => {
        if (image.decode && image.naturalWidth) image.decode().catch(() => {}).then(done);
        else done();
      };
      if (image.complete) return decoded();
      image.addEventListener('load', decoded, { once: true });
      image.addEventListener('error', done, { once: true });
      cleanups.push(() => {
        image.removeEventListener('load', decoded);
        image.removeEventListener('error', done);
      });
    }))).then(finish);
  });
}

export function preloadImages(sources, options) {
  return waitForImages(sources.map((source) => {
    const image = new Image();
    image.src = source;
    return image;
  }), options);
}

export function waitForSceneAssets(root, options) {
  if (!root) return Promise.resolve();
  const visible = (element) => {
    const rect = element.getBoundingClientRect();
    const style = getComputedStyle(element);
    return rect.width > 0 && rect.height > 0 && rect.bottom > 0 && rect.top < window.innerHeight
      && style.display !== 'none' && style.visibility !== 'hidden';
  };
  const images = [...root.querySelectorAll('img')].filter((image) => image.loading !== 'lazy' || visible(image));
  const backgrounds = new Set();
  for (const element of [root, ...root.querySelectorAll('*')]) {
    if (!visible(element)) continue;
    for (const match of getComputedStyle(element).backgroundImage.matchAll(/url\(["']?(.*?)["']?\)/g)) backgrounds.add(match[1]);
  }
  return Promise.all([waitForImages(images, options), preloadImages([...backgrounds], options)]);
}
