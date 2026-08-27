import { useEffect, useRef, useState } from 'react';

import './CircularGallery.css';

const DRAG_THRESHOLD = 36;

function wrap(index, length) {
  if (!length) return 0;
  return ((index % length) + length) % length;
}

function cardOffset(index, activeIndex, length) {
  let offset = index - activeIndex;
  if (offset > length / 2) offset -= length;
  if (offset < -length / 2) offset += length;
  return offset;
}

export default function CircularGallery({
  items = [],
  activeId,
  onSelect,
  selectLabel = (item) => item.text,
  ariaLabel = 'Circular image gallery. Use left and right arrow keys to navigate.',
}) {
  const initialIndex = Math.max(0, items.findIndex((item) => item.id === activeId));
  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const pointerStart = useRef(null);
  const dragged = useRef(false);

  useEffect(() => {
    const nextIndex = items.findIndex((item) => item.id === activeId);
    if (nextIndex >= 0) setActiveIndex(nextIndex);
  }, [activeId, items]);

  const move = (direction) => {
    if (!items.length) return;
    setActiveIndex((current) => wrap(current + direction, items.length));
  };

  const handleKeyDown = (event) => {
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      move(1);
    }
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      move(-1);
    }
  };

  const handlePointerDown = (event) => {
    pointerStart.current = event.clientX;
    dragged.current = false;
  };

  const finishPointer = (event) => {
    if (pointerStart.current === null) return;
    const delta = pointerStart.current - event.clientX;
    pointerStart.current = null;
    if (Math.abs(delta) < DRAG_THRESHOLD) return;
    dragged.current = true;
    move(delta > 0 ? 1 : -1);
  };

  const cancelPointer = () => {
    pointerStart.current = null;
    dragged.current = false;
  };

  return (
    <div
      className="circular-gallery"
      role="region"
      aria-label={ariaLabel}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onPointerDown={handlePointerDown}
      onPointerUp={finishPointer}
      onPointerCancel={cancelPointer}
    >
      <div className="circular-gallery__track">
        {items.map((item, itemIndex) => {
          const offset = cardOffset(itemIndex, activeIndex, items.length);
          const side = offset < 0 ? 'left' : offset > 0 ? 'right' : 'center';

          return (
            <button
              key={item.id ?? itemIndex}
              type="button"
              className="circular-gallery__card"
              aria-label={selectLabel(item)}
              aria-current={offset === 0 ? 'true' : undefined}
              data-side={side}
              style={{
                '--card-x': `${offset * 58}%`,
                '--card-rotate': `${offset * -24}deg`,
                '--card-scale': offset === 0 ? 1 : 0.72,
                '--card-depth': offset === 0 ? 2 : 1,
              }}
              onClick={() => {
                if (!dragged.current) onSelect?.(item);
                dragged.current = false;
              }}
            >
              <img src={item.image} alt="" draggable="false" />
              <span className="circular-gallery__plate" aria-hidden="true">
                {item.text}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
