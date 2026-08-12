import { useState } from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, vi } from 'vitest';
import GameBloom from './GameBloom';

const motionPreference = vi.hoisted(() => ({ reduce: false }));

vi.mock('motion/react', async (importOriginal) => {
  const original = await importOriginal();
  return {
    ...original,
    useReducedMotion: () => motionPreference.reduce,
  };
});

const labels = {
  close: 'Close game details',
  play: 'Play clip',
  mediaFuture: 'Gameplay stills and clips can be added here later.',
};

const baseGame = {
  id: 'raft',
  name: 'Raft',
  desc: 'Starting with a tiny platform and gradually making it home is the part I keep coming back for.',
};

function BloomHarness({ game = baseGame }) {
  const [active, setActive] = useState(false);
  return (
    <GameBloom
      game={game}
      position={{ left: '52%', top: '59%', branch: 'lower-left' }}
      size="sm"
      asset="/bloom-11.webp"
      active={active}
      onOpen={() => setActive(true)}
      onClose={() => setActive(false)}
      labels={labels}
    />
  );
}

describe('GameBloom', () => {
  beforeEach(() => {
    motionPreference.reduce = false;
  });

  it('shows a flower trigger but no play control when the game has no video', () => {
    render(<BloomHarness />);
    expect(screen.getByRole('button', { name: 'Raft' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Play clip' })).not.toBeInTheDocument();
  });

  it('opens a frameless dialog, locks scroll, and returns focus after Escape', async () => {
    render(<BloomHarness />);
    const trigger = screen.getByRole('button', { name: 'Raft' });
    trigger.focus();
    fireEvent.click(trigger);

    const dialog = screen.getByRole('dialog', { name: 'Raft' });
    expect(dialog).toBeInTheDocument();
    expect(dialog.closest('.framed-panel')).toBeNull();
    expect(document.body.style.overflow).toBe('hidden');
    expect(screen.getByText(baseGame.desc)).toBeInTheDocument();
    expect(screen.getByText(labels.mediaFuture)).toBeInTheDocument();

    fireEvent.keyDown(document, { key: 'Escape' });
    await waitFor(() => expect(screen.queryByRole('dialog', { name: 'Raft' })).toBeNull());
    expect(document.body.style.overflow).toBe('');
    expect(trigger).toHaveFocus();
  });

  it('closes from the backdrop while ignoring clicks inside the sheet', () => {
    render(<BloomHarness />);
    fireEvent.click(screen.getByRole('button', { name: 'Raft' }));
    const dialog = screen.getByRole('dialog', { name: 'Raft' });

    fireEvent.click(dialog);
    expect(dialog).toBeInTheDocument();

    fireEvent.click(screen.getByTestId('game-bloom-backdrop'));
    expect(screen.queryByRole('dialog', { name: 'Raft' })).not.toBeInTheDocument();
  });

  it('loads a muted inline video only after the visitor asks to play it', async () => {
    const otherVideo = document.createElement('video');
    otherVideo.pause = vi.fn();
    document.body.append(otherVideo);

    render(
      <BloomHarness
        game={{
          ...baseGame,
          poster: '/raft-poster.webp',
          video: '/raft-clip.mp4',
        }}
      />
    );
    fireEvent.click(screen.getByRole('button', { name: 'Raft' }));

    expect(document.querySelector('video[data-game-media]')).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: 'Play clip' }));

    const video = await waitFor(() => document.querySelector('video[data-game-media]'));
    expect(video).toHaveAttribute('src', '/raft-clip.mp4');
    expect(video).toHaveAttribute('preload', 'none');
    expect(video.muted).toBe(true);
    expect(video.playsInline).toBe(true);
    expect(otherVideo.pause).toHaveBeenCalled();

    otherVideo.remove();
  });

  it('uses only the poster when reduced motion is requested', () => {
    motionPreference.reduce = true;
    render(
      <BloomHarness
        game={{
          ...baseGame,
          poster: '/raft-poster.webp',
          video: '/raft-clip.mp4',
        }}
      />
    );
    fireEvent.click(screen.getByRole('button', { name: 'Raft' }));

    expect(screen.queryByRole('button', { name: 'Play clip' })).not.toBeInTheDocument();
    expect(document.querySelector('video[data-game-media]')).toBeNull();
    expect(document.querySelector('img[src="/raft-poster.webp"]')).toBeInTheDocument();
  });

  it('falls back to the poster when a requested video fails', async () => {
    render(
      <BloomHarness
        game={{
          ...baseGame,
          poster: '/raft-poster.webp',
          video: '/raft-clip.mp4',
        }}
      />
    );
    fireEvent.click(screen.getByRole('button', { name: 'Raft' }));
    fireEvent.click(screen.getByRole('button', { name: 'Play clip' }));
    const video = await waitFor(() => document.querySelector('video[data-game-media]'));

    fireEvent.error(video);

    expect(document.querySelector('video[data-game-media]')).toBeNull();
    expect(screen.queryByRole('button', { name: 'Play clip' })).not.toBeInTheDocument();
    expect(document.querySelector('img[src="/raft-poster.webp"]')).toBeInTheDocument();
  });
});
