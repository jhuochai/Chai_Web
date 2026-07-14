import { useCallback, useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'motion/react';
import { useLanguage } from '../i18n/LanguageContext';
import gunHand from '../assets/scenes/gun-hand.webp';
import './LoadingScreen.css';

const AUTO_FIRE_MS = 3000;
const FLASH_MS = 130;
const FLIGHT_MS = 380;
const BURST_MS = 950;
const EXIT_MS = 550;

const SPARK_COLORS = ['#e0bc6a', '#c9a24b', '#3fc1d6', '#ede3d0'];

/**
 * Scene 0: the entrance is a shot, not a spinner. A gun held level on
 * the left, a glint pulsing on the trigger as the only hint. Click
 * anywhere (or wait 3s) and the shot fires: muzzle flash, bullet
 * streak to the impact point, a firework burst, then a glow washes
 * the screen and hands over to the Hero. No visible text by design.
 */
export default function LoadingScreen({ onDone }) {
  const { t } = useLanguage();
  const reduce = useReducedMotion();
  // idle -> firing -> burst -> exit
  const [phase, setPhase] = useState('idle');
  const [target, setTarget] = useState(null);
  const firedRef = useRef(false);
  const rootRef = useRef(null);
  const muzzleRef = useRef(null);
  const bulletRef = useRef(null);
  const canvasRef = useRef(null);
  const rafRef = useRef(0);

  const fire = useCallback(
    (point) => {
      if (firedRef.current) return;
      firedRef.current = true;

      if (reduce) {
        setPhase('exit');
        return;
      }

      const fallback = {
        x: window.innerWidth * 0.62,
        y: window.innerHeight * 0.4,
      };
      setTarget(point ?? fallback);
      setPhase('firing');
    },
    [reduce]
  );

  // Auto-fire after 3s so nobody gets stuck on the splash.
  useEffect(() => {
    const timer = window.setTimeout(() => fire(null), AUTO_FIRE_MS);
    return () => window.clearTimeout(timer);
  }, [fire]);

  // Phase clock: setTimeout-driven so the sequence also completes in
  // environments where CSS transitions never emit events (tests).
  useEffect(() => {
    if (phase === 'firing') {
      const timer = window.setTimeout(() => setPhase('burst'), FLASH_MS + FLIGHT_MS);
      return () => window.clearTimeout(timer);
    }
    if (phase === 'burst') {
      const timer = window.setTimeout(() => setPhase('exit'), BURST_MS);
      return () => window.clearTimeout(timer);
    }
    if (phase === 'exit') {
      const timer = window.setTimeout(() => onDone?.(), reduce ? 200 : EXIT_MS);
      return () => window.clearTimeout(timer);
    }
    return undefined;
  }, [phase, reduce, onDone]);

  // Bullet flight: position at the muzzle, then translate to the target.
  useEffect(() => {
    if (phase !== 'firing' || !target) return;
    const bullet = bulletRef.current;
    const muzzle = muzzleRef.current;
    if (!bullet || !muzzle) return;

    const rect = muzzle.getBoundingClientRect();
    const startX = rect.left + rect.width / 2;
    const startY = rect.top + rect.height / 2;
    const dx = target.x - startX;
    const dy = target.y - startY;
    const angle = Math.atan2(dy, dx);

    bullet.style.left = `${startX}px`;
    bullet.style.top = `${startY}px`;
    bullet.style.transform = `rotate(${angle}rad) translateX(0)`;
    bullet.style.transition = 'none';
    // Force a reflow so the starting position lands before the flight.
    void bullet.offsetWidth;
    bullet.style.transition = `transform ${FLIGHT_MS}ms cubic-bezier(0.2, 0.6, 0.35, 1)`;
    bullet.style.transform = `rotate(${angle}rad) translateX(${Math.hypot(dx, dy)}px)`;
  }, [phase, target]);

  // Firework burst on canvas at the impact point.
  useEffect(() => {
    if (phase !== 'burst' || !target) return undefined;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext?.('2d');
    if (!ctx) return undefined;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = Array.from({ length: 70 }, (_, i) => {
      const angle = (Math.PI * 2 * i) / 70 + Math.random() * 0.4;
      const speed = 2.2 + Math.random() * 5.2;
      return {
        x: target.x,
        y: target.y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1,
        decay: 0.012 + Math.random() * 0.02,
        size: 1.4 + Math.random() * 2.4,
        color: SPARK_COLORS[i % SPARK_COLORS.length],
      };
    });

    let alive = true;
    const step = () => {
      if (!alive) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let anyAlive = false;
      for (const p of particles) {
        if (p.life <= 0) continue;
        anyAlive = true;
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.055;
        p.vx *= 0.985;
        p.life -= p.decay;
        ctx.globalAlpha = Math.max(p.life, 0);
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      if (anyAlive) rafRef.current = window.requestAnimationFrame(step);
    };
    rafRef.current = window.requestAnimationFrame(step);

    return () => {
      alive = false;
      window.cancelAnimationFrame(rafRef.current);
    };
  }, [phase, target]);

  const handleClick = (event) => {
    fire({ x: event.clientX, y: event.clientY });
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      fire(null);
    }
  };

  const glowStyle =
    target && phase === 'exit'
      ? { left: `${target.x}px`, top: `${target.y}px` }
      : undefined;

  return (
    <div
      ref={rootRef}
      className={`loading-screen loading-screen--${phase}`}
      role="button"
      tabIndex={0}
      aria-label={t.ui.enterLabel}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
    >
      <div className="loading-screen__gun" aria-hidden="true">
        <img src={gunHand} alt="" className="loading-screen__gun-image" draggable="false" />
        <span className="loading-screen__glint" />
        <span ref={muzzleRef} className="loading-screen__muzzle">
          <span className="loading-screen__flash" />
        </span>
      </div>
      {phase === 'firing' && <span ref={bulletRef} className="loading-screen__bullet" aria-hidden="true" />}
      <canvas ref={canvasRef} className="loading-screen__canvas" aria-hidden="true" />
      <div className="loading-screen__glow" style={glowStyle} aria-hidden="true" />
    </div>
  );
}
