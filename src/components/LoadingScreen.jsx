import { useCallback, useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'motion/react';
import { useLanguage } from '../i18n/LanguageContext';
import gunHand from '../assets/scenes/gun-hand-cropped.webp';
import { createFireParticles, getAutoTarget, getCanvasMetrics } from './loadingFire';
import './LoadingScreen.css';

const AUTO_FIRE_MS = 3000;
const FLASH_MS = 130;
const FLIGHT_MS = 380;
const BURST_MS = 950;
const EXIT_MS = 550;

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

      const impact = point ?? getAutoTarget(window.innerWidth, window.innerHeight);
      rootRef.current?.style.setProperty('--impact-x', `${impact.x}px`);
      rootRef.current?.style.setProperty('--impact-y', `${impact.y}px`);
      setTarget(impact);
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

    const metrics = getCanvasMetrics(
      window.innerWidth,
      window.innerHeight,
      window.devicePixelRatio || 1
    );
    canvas.width = metrics.cssWidth * metrics.dpr;
    canvas.height = metrics.cssHeight * metrics.dpr;
    canvas.style.width = `${metrics.cssWidth}px`;
    canvas.style.height = `${metrics.cssHeight}px`;
    ctx.setTransform(metrics.dpr, 0, 0, metrics.dpr, 0, 0);

    const particles = createFireParticles(target);

    let alive = true;
    const step = () => {
      if (!alive) return;
      ctx.clearRect(0, 0, metrics.cssWidth, metrics.cssHeight);
      let anyAlive = false;
      for (const p of particles) {
        if (p.life <= 0) continue;
        anyAlive = true;
        p.x += p.vx;
        p.y += p.vy;
        const gravity = p.kind === 'core' ? 0.015 : p.kind === 'arcane' ? 0.025 : 0.085;
        p.vy += gravity;
        p.vx *= p.kind === 'spark' ? 0.988 : 0.978;
        p.life -= p.decay;
        ctx.globalAlpha = Math.max(p.life, 0);
        ctx.globalCompositeOperation = 'lighter';
        ctx.shadowColor = p.color;
        ctx.shadowBlur = p.kind === 'core' ? 28 : p.kind === 'arcane' ? 18 : 10;

        if (p.kind === 'spark' || p.kind === 'arcane') {
          const trail = p.kind === 'spark' ? 4.8 : 2.8;
          ctx.strokeStyle = p.color;
          ctx.lineWidth = Math.max(1, p.size * (p.kind === 'spark' ? 0.52 : 0.35));
          ctx.lineCap = 'round';
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x - p.vx * trail, p.y - p.vy * trail);
          ctx.stroke();
        } else {
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * (0.6 + p.life * 0.7), 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = 'source-over';
      ctx.shadowBlur = 0;
      if (anyAlive) rafRef.current = window.requestAnimationFrame(step);
    };
    rafRef.current = window.requestAnimationFrame(step);

    return () => {
      alive = false;
      window.cancelAnimationFrame(rafRef.current);
    };
  }, [phase, target]);

  const handlePointerDown = (event) => {
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
      onPointerDown={handlePointerDown}
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
