import { render, screen, fireEvent, act } from '@testing-library/react';
import { vi } from 'vitest';
import MusicToggle from './MusicToggle';
import { LanguageProvider } from '../i18n/LanguageContext';

class AudioMock {
  static instances = [];

  constructor(src) {
    this.src = src;
    this.loop = false;
    this.volume = 1;
    this.preload = '';
    this.paused = true;
    this.listeners = {};
    AudioMock.instances.push(this);
  }

  addEventListener(type, fn) {
    this.listeners[type] = fn;
  }

  removeEventListener(type) {
    delete this.listeners[type];
  }

  play() {
    this.paused = false;
    return Promise.resolve();
  }

  pause() {
    this.paused = true;
  }
}

function renderToggle() {
  return render(
    <LanguageProvider>
      <MusicToggle />
    </LanguageProvider>
  );
}

describe('MusicToggle', () => {
  beforeEach(() => {
    AudioMock.instances = [];
    vi.stubGlobal('Audio', AudioMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('renders the toggle, defaulting to music-on state', () => {
    renderToggle();
    expect(screen.getByRole('button', { name: 'Turn music off' })).toHaveAttribute(
      'aria-pressed',
      'true'
    );
  });

  it('starts playback on the first gesture anywhere on the page', () => {
    renderToggle();
    const audio = AudioMock.instances[0];
    expect(audio.paused).toBe(true);
    fireEvent.pointerDown(document.body);
    expect(audio.paused).toBe(false);
  });

  it('pauses on toggle and does not restart on later gestures', () => {
    renderToggle();
    const audio = AudioMock.instances[0];
    fireEvent.click(screen.getByRole('button', { name: 'Turn music off' }));
    expect(audio.paused).toBe(true);
    fireEvent.pointerDown(document.body);
    expect(audio.paused).toBe(true);
    expect(screen.getByRole('button', { name: 'Turn music on' })).toHaveAttribute(
      'aria-pressed',
      'false'
    );
  });

  it('removes itself when the track file is missing', () => {
    renderToggle();
    const audio = AudioMock.instances[0];
    act(() => {
      audio.listeners.error?.();
    });
    expect(screen.queryByRole('button')).toBeNull();
  });
});
