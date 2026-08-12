import { useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, useReducedMotion } from 'motion/react';
import { Play, X } from '@phosphor-icons/react';
import './GameBloom.css';

const FOCUSABLE = [
  'a[href]',
  'button:not([disabled])',
  'video[controls]',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

const DEFAULT_LABELS = {
  close: 'Close game details',
  play: 'Play gameplay clip',
  mediaFuture: 'Gameplay stills and short clips can be added here later.',
};

export default function GameBloom({
  game,
  position,
  size,
  asset,
  active,
  disabled = false,
  onOpen,
  onClose,
  labels = DEFAULT_LABELS,
}) {
  const reduce = useReducedMotion();
  const triggerRef = useRef(null);
  const panelRef = useRef(null);
  const closeRef = useRef(null);
  const videoRef = useRef(null);
  const onCloseRef = useRef(onClose);
  const [assetFailed, setAssetFailed] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);
  const [posterFailed, setPosterFailed] = useState(false);
  const titleId = useId();
  const descriptionId = useId();
  const copy = { ...DEFAULT_LABELS, ...labels };

  onCloseRef.current = onClose;

  useEffect(() => {
    if (!active) {
      setVideoLoaded(false);
      setVideoFailed(false);
      setPosterFailed(false);
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;
    const trigger = triggerRef.current;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onCloseRef.current?.();
        return;
      }
      if (event.key !== 'Tab') return;

      const focusable = Array.from(panelRef.current?.querySelectorAll(FOCUSABLE) ?? []);
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable.at(-1);
      if (focusable.length === 1) {
        event.preventDefault();
        first.focus();
      } else if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
      trigger?.focus();
    };
  }, [active]);

  useEffect(() => {
    if (!active || !videoLoaded || reduce || !videoRef.current) return;
    const current = videoRef.current;
    document.querySelectorAll('video').forEach((video) => {
      if (video !== current) video.pause();
    });
    current.play().catch(() => {
      // Native controls remain available if a browser declines playback.
    });
  }, [active, reduce, videoLoaded]);

  const dialog = active && typeof document !== 'undefined'
    ? createPortal(
        <motion.div
          className="game-bloom__backdrop"
          data-testid="game-bloom-backdrop"
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: reduce ? 0 : 0.24 }}
          onClick={(event) => {
            if (event.target === event.currentTarget) onCloseRef.current?.();
          }}
        >
          <motion.article
            ref={panelRef}
            className="game-bloom__sheet"
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            aria-describedby={descriptionId}
            initial={reduce ? false : { opacity: 0, y: 24, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: reduce ? 0 : 0.42, ease: [0.16, 1, 0.3, 1] }}
            onClick={(event) => event.stopPropagation()}
          >
            <button
              ref={closeRef}
              type="button"
              className="game-bloom__close"
              onClick={() => onCloseRef.current?.()}
              aria-label={copy.close}
            >
              <X size={22} weight="light" aria-hidden="true" />
            </button>

            <div className="game-bloom__portrait" aria-hidden="true">
              {!assetFailed && (
                <img src={asset} alt="" draggable="false" onError={() => setAssetFailed(true)} />
              )}
            </div>

            <div className="game-bloom__copy">
              {game.note && <p className="game-bloom__note">{game.note}</p>}
              <h3 id={titleId}>{game.name}</h3>
              <p id={descriptionId} className="game-bloom__description">{game.desc}</p>

              <div className="game-bloom__media">
                {game.video && !reduce && !videoFailed ? (
                  videoLoaded ? (
                    <video
                      ref={videoRef}
                      src={game.video}
                      poster={game.poster}
                      preload="none"
                      muted
                      playsInline
                      controls
                      data-game-media
                      onError={() => setVideoFailed(true)}
                    />
                  ) : (
                    <button
                      type="button"
                      className="game-bloom__play"
                      onClick={() => setVideoLoaded(true)}
                      style={game.poster ? { backgroundImage: `url(${game.poster})` } : undefined}
                      aria-label={copy.play}
                    >
                      <Play size={22} weight="fill" aria-hidden="true" />
                      <span>{copy.play}</span>
                    </button>
                  )
                ) : game.poster && !posterFailed ? (
                  <img
                    src={game.poster}
                    alt=""
                    loading="lazy"
                    onError={() => setPosterFailed(true)}
                  />
                ) : (
                  <p className="game-bloom__media-future">{copy.mediaFuture}</p>
                )}
              </div>
            </div>
          </motion.article>
        </motion.div>,
        document.body
      )
    : null;

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        className={`career-tree__spot career-tree__spot--flower game-bloom game-bloom--${size}`}
        style={{
          left: position.left,
          top: position.top,
          '--bloom-mobile-left': position.mobileLeft,
          '--bloom-mobile-top': position.mobileTop,
        }}
        onClick={() => onOpen?.(game.id)}
        aria-label={game.name}
        aria-haspopup="dialog"
        aria-expanded={active}
        disabled={disabled}
        data-testid="game-bloom"
        data-game-id={game.id}
        data-asset={asset}
        data-position={`${position.left}-${position.top}`}
        data-size={size}
        data-branch={position.branch}
      >
        {!assetFailed && (
          <img
            src={asset}
            alt=""
            draggable="false"
            loading="lazy"
            onError={() => setAssetFailed(true)}
          />
        )}
        <span className="game-bloom__name">{game.name}</span>
      </button>
      {dialog}
    </>
  );
}
