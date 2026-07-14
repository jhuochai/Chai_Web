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

// jsdom has no 2D canvas backend; getContext logs a "not implemented"
// error and returns null. Components guard on a null context, so stub
// it to return null quietly instead of spamming test output.
if (window.HTMLCanvasElement) {
  window.HTMLCanvasElement.prototype.getContext = () => null;
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

// jsdom doesn't implement IntersectionObserver; framer-motion and RevealSection
// use it and will throw on mount without this.
if (!window.IntersectionObserver) {
  window.IntersectionObserver = class IntersectionObserver {
    constructor() {}
    observe() {}
    unobserve() {}
    disconnect() {}
  };
}
