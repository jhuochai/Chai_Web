import '@testing-library/jest-dom';

// jsdom doesn't implement matchMedia; motion/react's useReducedMotion()
// calls it on every component that imports it (Hero, Nav, etc.).
if (!window.matchMedia) {
  window.matchMedia = (query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  });
}

// jsdom doesn't implement ResizeObserver either; several components
// (CircularGallery, ClickSpark) use it and will throw on mount without this.
if (!window.ResizeObserver) {
  window.ResizeObserver = class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
}
