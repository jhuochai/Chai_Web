import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { CaretLeft, CaretRight, Play } from '@phosphor-icons/react';
import './CaseStack.css';

const DRAG_THRESHOLD = 110;
const ROTATIONS = [-1.5, 1.1, -0.6];

function wrapIndex(index, length) {
  if (!length) return 0;
  return (index + length) % length;
}

function ActiveMedia({ item, copy }) {
  const videoRef = useRef(null);
  const [unavailable, setUnavailable] = useState(false);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    setUnavailable(false);
    setPlaying(false);
  }, [item?.id]);

  useEffect(() => {
    const media = videoRef.current;
    return () => media?.pause();
  }, [item?.id]);

  if (!item || unavailable) {
    return (
      <div className="case-stack__unavailable" role="status">
        <span aria-hidden="true">NO SIGNAL</span>
        <p>{copy.unavailable}</p>
      </div>
    );
  }

  if (item.type === 'image') {
    return (
      <img
        className="case-stack__image"
        src={item.src}
        alt={item.alt}
        loading="eager"
        decoding="async"
        draggable="false"
        onError={() => setUnavailable(true)}
      />
    );
  }

  if (item.type === 'video' && item.src) {
    const playVideo = () => {
      const promise = videoRef.current?.play();
      promise?.then?.(() => setPlaying(true)).catch?.(() => setUnavailable(true));
    };

    return (
      <div className="case-stack__video-wrap">
        <video
          ref={videoRef}
          data-testid="case-stack-video"
          className="case-stack__video"
          src={item.src}
          poster={item.poster}
          preload="metadata"
          playsInline
          controls
          aria-label={item.alt}
          onError={() => setUnavailable(true)}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
        />
        {!playing ? (
          <button type="button" className="case-stack__play" aria-label={copy.play} onClick={playVideo}>
            <Play size={22} weight="fill" aria-hidden="true" />
          </button>
        ) : null}
      </div>
    );
  }

  return (
    <div className="case-stack__data-card" aria-label={item.alt}>
      <span className="case-stack__data-kicker">DATA RECORD</span>
      <span className="case-stack__data-orbit" aria-hidden="true" />
      <strong>{item.title}</strong>
      <span className="case-stack__data-status">SIGNAL / DECISION</span>
    </div>
  );
}

export default function CaseStack({ items, index, onIndexChange, copy }) {
  const cardsRef = useRef(null);
  const gestureRef = useRef(null);
  const mountedRef = useRef(true);
  const [drag, setDrag] = useState({ x: 0, y: 0 });
  const [reducedMotion, setReducedMotion] = useState(false);
  const itemCount = items.length;
  const activeIndex = wrapIndex(index, itemCount);
  const activeItem = items[activeIndex];

  useEffect(() => {
    const media = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    const update = () => setReducedMotion(Boolean(media?.matches));
    update();
    media?.addEventListener?.('change', update);
    return () => media?.removeEventListener?.('change', update);
  }, []);

  const releaseGestureCapture = useCallback(() => {
    const pointerId = gestureRef.current?.pointerId;
    const target = cardsRef.current;
    if (pointerId === undefined || !target) return;
    try {
      if (target.hasPointerCapture?.(pointerId)) target.releasePointerCapture(pointerId);
    } catch {
      // Capture may already be gone after a native cancel/lost-capture event.
    }
  }, []);

  const resetGesture = () => {
    releaseGestureCapture();
    gestureRef.current = null;
    setDrag({ x: 0, y: 0 });
  };

  useEffect(() => {
    const handleBlur = () => {
      releaseGestureCapture();
      gestureRef.current = null;
      setDrag({ x: 0, y: 0 });
    };
    window.addEventListener('blur', handleBlur);
    return () => {
      window.removeEventListener('blur', handleBlur);
      mountedRef.current = false;
      releaseGestureCapture();
      gestureRef.current = null;
    };
  }, [releaseGestureCapture]);

  useEffect(() => {
    setDrag({ x: 0, y: 0 });
    gestureRef.current = null;
  }, [activeIndex, activeItem?.id]);

  const layers = useMemo(
    () => Array.from({ length: Math.min(itemCount, 3) }, (_, layer) => layer),
    [itemCount]
  );

  const moveBy = (delta) => {
    if (itemCount > 1) onIndexChange(wrapIndex(activeIndex + delta, itemCount));
  };

  const handlePointerDown = (event) => {
    if (!mountedRef.current) return;
    if (event.button !== undefined && event.button !== 0) return;
    gestureRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      x: 0,
      y: 0,
    };
    try {
      event.currentTarget.setPointerCapture?.(event.pointerId);
    } catch {
      // Older browsers may expose the method without supporting this pointer.
    }
  };

  const handlePointerMove = (event) => {
    const gesture = gestureRef.current;
    if (!gesture || gesture.pointerId !== event.pointerId) return;
    const x = event.clientX - gesture.startX;
    const y = event.clientY - gesture.startY;
    gesture.x = x;
    gesture.y = y;
    if (!reducedMotion) setDrag({ x, y });
    if (Math.hypot(x, y) > 8) event.preventDefault();
  };

  const handlePointerUp = (event) => {
    const gesture = gestureRef.current;
    if (!gesture || gesture.pointerId !== event.pointerId) return;
    const distance = Math.hypot(gesture.x, gesture.y);
    resetGesture();
    if (distance >= DRAG_THRESHOLD) moveBy(1);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      moveBy(1);
    }
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      moveBy(-1);
    }
  };

  return (
    <div className={`case-stack${reducedMotion ? ' case-stack--reduced' : ''}`}>
      <div
        ref={cardsRef}
        className="case-stack__cards"
        tabIndex={0}
        onKeyDown={handleKeyDown}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={resetGesture}
        onLostPointerCapture={resetGesture}
      >
        {[...layers].reverse().map((layer) => {
          const isActive = layer === 0;
          const rotation = ROTATIONS[layer] ?? 0;
          const translateY = layer * 10;
          const scale = 1 - layer * 0.045;
          const transform = isActive && !reducedMotion
            ? `translate3d(${drag.x === 0 ? '0' : `${drag.x}px`}, ${drag.y}px, 0) rotate(${rotation + drag.x * 0.015}deg) scale(${scale})`
            : `translate3d(0, ${translateY}px, 0) rotate(${rotation}deg) scale(${scale})`;
          return (
            <div
              key={layer}
              className={`case-stack__layer${isActive ? ' case-stack__layer--active' : ''}`}
              data-stack-layer={layer}
              aria-hidden={isActive ? undefined : 'true'}
              style={{ transform }}
            >
              {isActive ? <ActiveMedia item={activeItem} copy={copy} /> : <div className="case-stack__ghost" />}
            </div>
          );
        })}
      </div>

      <div className="case-stack__controls">
        <button type="button" aria-label={copy.previous} onClick={() => moveBy(-1)}>
          <CaretLeft size={22} aria-hidden="true" />
        </button>
        <p className="case-stack__counter">
          <span aria-live="polite" aria-atomic="true">{activeIndex + 1} / {itemCount}</span>
          <strong>{activeItem?.title}</strong>
        </p>
        <button type="button" aria-label={copy.next} onClick={() => moveBy(1)}>
          <CaretRight size={22} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
