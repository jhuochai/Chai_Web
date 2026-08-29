import { useEffect, useRef, useState } from 'react';
import {
  useReducedMotion,
} from 'motion/react';
import { Sun, MoonStars } from '@phosphor-icons/react';
import CareerRibbonSheet from './CareerRibbonSheet';
import GameBloom from './GameBloom';
import TreeOcclusionLayer from './TreeOcclusionLayer';
import { useLanguage } from '../i18n/LanguageContext';
import { getCareerVisual } from '../data/careerVisuals';
import {
  DAY_OCCLUSION_PATCHES,
  GAME_BLOOM_LAYOUT,
  NIGHT_OCCLUSION_PATCHES,
  RIBBON_SPOTS,
} from '../data/careerTreeLayout';
import treeDay from '../assets/scenes/career-tree-day-factory-clean-v3.webp';
import treeNight from '../assets/scenes/career-tree-night-factory-clean-v2.webp';
import { createCareerCameraController, INTERACTIVE_PROGRESS } from './careerCamera';
import './CareerTree.css';

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
 * Scene 3: the career tree. Day hangs work-history ribbons on the
 * branches; night blooms flowers holding the games she plays. A
 * sun/moon toggle crossfades the sky; clicking a hotspot opens its
 * chapter in a framed card while the leaves pick up.
 */
export default function CareerTree({ controls }) {
  const { t, lang } = useLanguage();
  const reduce = useReducedMotion();
  const tree = t.careerTree;
  const [night, setNight] = useState(false);
  const [activeId, setActiveId] = useState(null);
  const query = new URLSearchParams(window.location.search);
  const initialProgress = reduce ? 1 : (query.has('impact-qa') ? INTERACTIVE_PROGRESS : 0);
  const [progress, setProgress] = useState(initialProgress);
  const sectionRef = useRef(null);
  const stageRef = useRef(null);
  const cameraRef = useRef(null);
  const controllerRef = useRef(null);
  const ribbonTriggerRefs = useRef(new Map());

  const nightItems = tree.flowers;
  const items = night ? nightItems : tree.ribbons;
  const spots = RIBBON_SPOTS;
  const activeItem = activeId
    ? [...tree.ribbons, ...nightItems].find((item) => item.id === activeId)
    : null;

  const getRibbonTriggerRef = (id) => {
    if (!ribbonTriggerRefs.current.has(id)) {
      ribbonTriggerRefs.current.set(id, { current: null });
    }
    return ribbonTriggerRefs.current.get(id);
  };

  const interactive = progress >= INTERACTIVE_PROGRESS;

  useEffect(() => {
    if (!stageRef.current) return undefined;
    const controller = createCareerCameraController({
      stage: stageRef.current,
      reduceMotion: reduce,
      initialProgress,
      onProgress: setProgress,
    });
    controllerRef.current = controller;
    return () => {
      controller.destroy();
      controllerRef.current = null;
    };
  }, [initialProgress, reduce]);

  useEffect(() => {
    const onTestProgress = (event) => controllerRef.current?.setProgress(event.detail);
    window.addEventListener('career-tree:test-progress', onTestProgress);
    return () => window.removeEventListener('career-tree:test-progress', onTestProgress);
  }, []);

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

  const toggleNight = () => {
    setNight((prev) => !prev);
    setActiveId(null);
  };

  const stationLabel = night
    ? (lang === 'zh' ? '遊戲' : 'Games')
    : (lang === 'zh' ? '航跡' : 'Career');
  const hint = interactive
    ? (night ? tree.nightHint : tree.dayHint)
    : (lang === 'zh' ? '向上滾動，靠近航跡樹' : 'Scroll up to approach the route tree');

  return (
    <section id="scene-3" className="career-tree" ref={sectionRef}>
      <div
        ref={stageRef}
        className={`career-tree__stage ${night ? 'career-tree__stage--night' : ''}`}
        data-interactive={interactive}
        data-camera-progress={progress.toFixed(3)}
        style={{ '--camera-progress': progress }}
        tabIndex={0}
        aria-label={stationLabel}
      >
        <div ref={cameraRef} className="career-tree__camera">
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
            {night
              ? items.map((item) => {
                  const position = GAME_BLOOM_LAYOUT[item.id];
                  const visual = getCareerVisual('game', item.id);
                  return (
                    <GameBloom
                      key={`flower-${item.id}`}
                      game={item}
                      position={position}
                      size={position.size}
                      asset={visual.asset}
                      accent={visual.accent}
                      glow={visual.glow}
                      active={activeId === item.id}
                      disabled={!interactive}
                      onOpen={setActiveId}
                      onClose={() => setActiveId(null)}
                      labels={{
                        close: tree.closeGameLabel,
                        play: tree.playGameLabel,
                        mediaFuture: tree.mediaFuture,
                      }}
                    />
                  );
                })
              : items.map((item) => {
                  const triggerRef = getRibbonTriggerRef(item.id);
                  const visual = getCareerVisual('ribbon', item.id);
                  return (
                    <div key={`ribbon-${item.id}`}>
                      <button
                        ref={triggerRef}
                        type="button"
                        className="career-tree__spot career-tree__spot--ribbon"
                        data-ribbon-id={item.id}
                        data-ribbon-family="career-record"
                        data-branch-anchor={spots[item.id].anchor}
                        style={{
                          ...spots[item.id],
                          '--item-accent': visual.accent,
                          '--item-glow': visual.glow,
                        }}
                        aria-label={item.org}
                        aria-haspopup="dialog"
                        aria-expanded={activeId === item.id}
                        disabled={!interactive}
                        onClick={() => setActiveId(item.id)}
                        onKeyDown={(event) => {
                          if (event.key !== 'Enter' && event.key !== ' ') return;
                          event.preventDefault();
                          setActiveId(item.id);
                        }}
                      >
                        <img
                          src={visual.asset}
                          alt=""
                          data-testid="career-ribbon-asset"
                          draggable="false"
                        />
                      </button>
                      <CareerRibbonSheet
                        item={{ ...item, closeLabel: tree.closeLabel }}
                        open={activeId === item.id}
                        onClose={() => setActiveId(null)}
                        triggerRef={triggerRef}
                        visual={visual}
                      />
                    </div>
                  );
                })}
            <TreeOcclusionLayer
              source={treeDay}
              mode="day"
              patches={DAY_OCCLUSION_PATCHES}
              active={!night}
            />
            <TreeOcclusionLayer
              source={treeNight}
              mode="night"
              patches={NIGHT_OCCLUSION_PATCHES}
              active={night}
            />
          </div>
          <LeafCanvas dense={Boolean(activeItem)} />
        </div>

        <p className="career-tree__station-label" aria-hidden="true">{stationLabel}</p>

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
          {hint}
        </p>

        {controls && <div className="career-tree__station-controls">{controls}</div>}

      </div>

    </section>
  );
}
