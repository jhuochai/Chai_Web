import { useEffect, useRef, useState } from 'react';
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
  AnimatePresence,
} from 'motion/react';
import { Sun, MoonStars, X } from '@phosphor-icons/react';
import FramedPanel from './FramedPanel';
import RevealSection from './RevealSection';
import { useLanguage } from '../i18n/LanguageContext';
import treeDay from '../assets/scenes/career-tree-day-factory-v2.webp';
import treeNight from '../assets/scenes/career-tree-night-factory.webp';
import ribbonSprite from '../assets/scenes/tree-ribbon.webp';
import flowerSprite from '../assets/scenes/single-flower.webp';
import walkFrame0 from '../assets/scenes/character-walk-aligned-0.webp';
import walkFrame1 from '../assets/scenes/character-walk-aligned-1.webp';
import walkFrame2 from '../assets/scenes/character-walk-aligned-2.webp';
import walkFrame3 from '../assets/scenes/character-walk-aligned-3.webp';
import { getWalkFrame } from './careerWalk';
import './CareerTree.css';

// Contact pose → passing pose → contact (other leg) → passing.
const WALK_FRAMES = [walkFrame0, walkFrame1, walkFrame2, walkFrame3];

// Hotspot anchors in % of the BACKGROUND IMAGE (not the stage): the day
// tree has glowing ribbons and the night tree glowing flower clusters
// painted right into the art, so the click targets sit on those. The
// canvas element reproduces object-fit: cover geometry, which keeps
// these glued to the branches at every viewport size. Kept within
// 22-78% horizontally so no hotspot is cropped away down to ~1024px.
const RIBBON_SPOTS = {
  gamesofa: { left: '34.3%', top: '47.7%' },
  ntpu: { left: '65.9%', top: '54.1%' },
  actg: { left: '38.9%', top: '61.8%' },
  eelin: { left: '59.6%', top: '63.6%' },
};

const FLOWER_SPOTS = {
  mlbb: { left: '64.4%', top: '43.4%' },
  idv: { left: '34.9%', top: '48.5%' },
  stardew: { left: '44.7%', top: '26.9%' },
  shelf: { left: '60.2%', top: '64%' },
};

const LEAF_COLORS = ['rgba(201,162,75,0.75)', 'rgba(224,188,106,0.6)', 'rgba(110,139,61,0.65)'];

/**
 * Falling-leaf ambience over the tree stage. Density steps up while a
 * detail card is open to deepen the "leaning in closer" feeling.
 */
function LeafCanvas({ dense }) {
  const canvasRef = useRef(null);
  const denseRef = useRef(dense);
  const reduce = useReducedMotion();
  denseRef.current = dense;

  useEffect(() => {
    if (reduce) return undefined;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext?.('2d');
    if (!ctx) return undefined;

    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const spawn = () => ({
      x: Math.random() * width,
      y: -10 - Math.random() * height * 0.3,
      vy: 0.35 + Math.random() * 0.8,
      swayAmp: 18 + Math.random() * 26,
      swaySpeed: 0.6 + Math.random() * 0.9,
      phase: Math.random() * Math.PI * 2,
      size: 2.6 + Math.random() * 3.2,
      tilt: Math.random() * Math.PI,
      color: LEAF_COLORS[Math.floor(Math.random() * LEAF_COLORS.length)],
    });

    let leaves = Array.from({ length: 14 }, spawn);
    let raf = 0;
    let t = 0;

    const onResize = () => {
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener('resize', onResize);

    const step = () => {
      t += 0.016;
      const targetCount = denseRef.current ? 30 : 14;
      while (leaves.length < targetCount) leaves.push(spawn());
      if (leaves.length > targetCount) leaves = leaves.slice(0, targetCount);

      ctx.clearRect(0, 0, width, height);
      for (const leaf of leaves) {
        leaf.y += leaf.vy;
        const sway = Math.sin(t * leaf.swaySpeed + leaf.phase) * leaf.swayAmp;
        if (leaf.y > height + 12) {
          Object.assign(leaf, spawn(), { y: -12 });
        }
        ctx.save();
        ctx.translate(leaf.x + sway, leaf.y);
        ctx.rotate(leaf.tilt + Math.sin(t + leaf.phase) * 0.6);
        ctx.fillStyle = leaf.color;
        ctx.beginPath();
        ctx.ellipse(0, 0, leaf.size, leaf.size * 0.55, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
      raf = window.requestAnimationFrame(step);
    };
    raf = window.requestAnimationFrame(step);

    return () => {
      window.cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
    };
  }, [reduce]);

  return <canvas ref={canvasRef} className="career-tree__leaves" aria-hidden="true" />;
}

/**
 * Scroll-linked walking pass: the character crosses the strip from left
 * to right as it scrolls through the viewport, cycling through the four
 * walk poses like a hand-drawn flipbook. Used both to enter the tree
 * scene and to walk off toward the next scene.
 */
function WalkStrip() {
  const stripRef = useRef(null);
  const reduce = useReducedMotion();
  const [frame, setFrame] = useState(0);
  const { scrollYProgress } = useScroll({
    target: stripRef,
    offset: ['start end', 'end start'],
  });
  const x = useTransform(scrollYProgress, [0, 1], ['-18vw', '82vw']);

  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    if (!reduce) setFrame(getWalkFrame(latest, WALK_FRAMES.length));
  });

  useEffect(() => {
    if (reduce) return undefined;
    // Preload every pose so the first cycle doesn't flicker.
    for (const src of WALK_FRAMES) {
      const img = new Image();
      img.src = src;
    }
    return undefined;
  }, [reduce]);

  return (
    <div className="career-tree__walk" ref={stripRef} aria-hidden="true">
      <motion.img
        src={WALK_FRAMES[frame]}
        alt=""
        className="career-tree__walker"
        style={reduce ? undefined : { x }}
        loading="lazy"
        draggable="false"
      />
    </div>
  );
}

/**
 * Scene 3: the career tree. Day hangs work-history ribbons on the
 * branches; night blooms flowers holding the games she plays. A
 * sun/moon toggle crossfades the sky; clicking a hotspot opens its
 * chapter in a framed card while the leaves pick up.
 */
export default function CareerTree() {
  const { t } = useLanguage();
  const reduce = useReducedMotion();
  const tree = t.careerTree;
  const [night, setNight] = useState(false);
  const [activeId, setActiveId] = useState(null);
  const closeButtonRef = useRef(null);

  const items = night ? tree.flowers : tree.ribbons;
  const spots = night ? FLOWER_SPOTS : RIBBON_SPOTS;
  const activeItem = activeId
    ? [...tree.ribbons, ...tree.flowers].find((item) => item.id === activeId)
    : null;

  // The hero's chapter menu can send visitors here in a specific mode
  // ("Career" lands on the day tree, "Games" on the night bloom).
  useEffect(() => {
    const onMode = (event) => {
      setNight(event.detail === 'night');
      setActiveId(null);
    };
    window.addEventListener('career-tree:mode', onMode);
    return () => window.removeEventListener('career-tree:mode', onMode);
  }, []);

  useEffect(() => {
    if (!activeItem) return undefined;
    closeButtonRef.current?.focus();
    const onKeyDown = (event) => {
      if (event.key === 'Escape') setActiveId(null);
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [activeItem]);

  const toggleNight = () => {
    setNight((prev) => !prev);
    setActiveId(null);
  };

  return (
    <section id="scene-3" className="career-tree">
      <WalkStrip />

      <RevealSection className="career-tree__heading container">
        <p className="eyebrow">{tree.eyebrow}</p>
        <h2>{tree.heading}</h2>
        <p className="career-tree__intro">{tree.intro}</p>
      </RevealSection>

      <div className={`career-tree__stage ${night ? 'career-tree__stage--night' : ''}`}>
        {/* Reproduces object-fit: cover for the wide tree art, so the
            hotspots inside share the image's own coordinate system. */}
        <div className="career-tree__canvas">
          <img
            src={treeDay}
            alt=""
            className={`career-tree__sky ${night ? '' : 'career-tree__sky--active'}`}
            draggable="false"
          />
          <img
            src={treeNight}
            alt=""
            className={`career-tree__sky ${night ? 'career-tree__sky--active' : ''}`}
            loading="lazy"
            draggable="false"
          />
          {items.map((item) => (
            <button
              key={`${night ? 'flower' : 'ribbon'}-${item.id}`}
              type="button"
              className="career-tree__spot"
              style={spots[item.id]}
              onClick={() => setActiveId(item.id)}
              aria-label={night ? item.name : item.org}
              aria-haspopup="dialog"
            />
          ))}
        </div>
        <LeafCanvas dense={Boolean(activeItem)} />

        <button
          type="button"
          className="career-tree__toggle btn-glass"
          onClick={toggleNight}
          aria-label={night ? tree.toggleToDay : tree.toggleToNight}
          aria-pressed={night}
        >
          {night ? <Sun size={20} weight="light" /> : <MoonStars size={20} weight="light" />}
          <span>{night ? tree.dayLabel : tree.nightLabel}</span>
        </button>

        <p className="career-tree__hint" aria-live="polite">
          {night ? tree.nightHint : tree.dayHint}
        </p>

        <AnimatePresence>
          {activeItem && (
            <motion.div
              className="career-tree__backdrop"
              initial={reduce ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={reduce ? undefined : { opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={(event) => {
                if (event.target === event.currentTarget) setActiveId(null);
              }}
            >
              <motion.div
                initial={reduce ? false : { opacity: 0, scale: 0.92, y: 18 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={reduce ? undefined : { opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="career-tree__card-wrap"
              >
                <FramedPanel
                  variant="deco"
                  className="career-tree__card"
                  role="dialog"
                  aria-modal="true"
                  aria-label={night ? activeItem.name : activeItem.org}
                >
                  <button
                    ref={closeButtonRef}
                    type="button"
                    className="career-tree__close btn-glass btn-glass--ghost"
                    onClick={() => setActiveId(null)}
                    aria-label={tree.closeLabel}
                  >
                    <X size={18} weight="light" />
                  </button>

                  <img
                    src={activeItem.org ? ribbonSprite : flowerSprite}
                    alt=""
                    className="career-tree__card-emblem"
                    aria-hidden="true"
                    draggable="false"
                  />

                  {activeItem.org ? (
                    <>
                      <p className="eyebrow">{activeItem.period}</p>
                      <h3 className="career-tree__card-title">{activeItem.org}</h3>
                      <p className="career-tree__card-role">{activeItem.role}</p>
                      <p className="career-tree__card-summary">{activeItem.summary}</p>
                      <ul className="career-tree__card-points">
                        {activeItem.points.map((point) => (
                          <li key={point}>{point}</li>
                        ))}
                      </ul>
                    </>
                  ) : (
                    <>
                      {activeItem.note && <p className="eyebrow">{activeItem.note}</p>}
                      <h3 className="career-tree__card-title">{activeItem.name}</h3>
                      <p className="career-tree__card-summary">{activeItem.desc}</p>
                    </>
                  )}
                </FramedPanel>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <WalkStrip />
    </section>
  );
}
