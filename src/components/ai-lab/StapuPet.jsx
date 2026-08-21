import { forwardRef, useEffect, useState } from 'react';
import { useReducedMotion } from 'motion/react';
import stapuSheet from '../../assets/pets/stapu-spritesheet.webp';
import { getStapuFrameStyle, STAPU_STATES } from './stapuSprite';
import './StapuPet.css';

const patrol = ['running-right', 'waving', 'running-left', 'idle'];

const StapuPet = forwardRef(function StapuPet({ onInspect, label = 'Inspect Stapu' }, ref) {
  const reduce = useReducedMotion();
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [frame, setFrame] = useState(0);
  const state = reduce ? 'idle' : patrol[phaseIndex];
  const animation = STAPU_STATES[state];

  useEffect(() => {
    setFrame(0);
    if (reduce) return undefined;
    const frameTimer = window.setInterval(() => setFrame((value) => (value + 1) % animation.frames), 130);
    return () => window.clearInterval(frameTimer);
  }, [animation.frames, reduce, state]);

  useEffect(() => {
    if (reduce) return undefined;
    const phaseTimer = window.setInterval(() => setPhaseIndex((value) => (value + 1) % patrol.length), 2400);
    return () => window.clearInterval(phaseTimer);
  }, [reduce]);

  return (
    <button ref={ref} type="button" className="stapu-pet" aria-label={label} data-state={state} onClick={onInspect}>
      <span className="stapu-pet__viewport" aria-hidden="true">
        <img
          src={stapuSheet}
          alt=""
          draggable="false"
          style={getStapuFrameStyle({ row: animation.row, frame })}
        />
      </span>
      <span className="stapu-pet__shadow" aria-hidden="true" />
    </button>
  );
});

export default StapuPet;
