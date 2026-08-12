import { useEffect, useRef, useState } from 'react';
import {
  useReducedMotion,
} from 'motion/react';
import { Sun, MoonStars } from '@phosphor-icons/react';
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import CareerRibbonSheet from './CareerRibbonSheet';
import GameBloom from './GameBloom';
import RevealSection from './RevealSection';
import { useLanguage } from '../i18n/LanguageContext';
import treeDay from '../assets/scenes/career-tree-day-factory-v2.webp';
import treeNight from '../assets/scenes/career-tree-night-factory.webp';
import bloom01 from '../assets/scenes/blooms/bloom-01.webp';
import bloom02 from '../assets/scenes/blooms/bloom-02.webp';
import bloom03 from '../assets/scenes/blooms/bloom-03.webp';
import bloom04 from '../assets/scenes/blooms/bloom-04.webp';
import bloom05 from '../assets/scenes/blooms/bloom-05.webp';
import bloom06 from '../assets/scenes/blooms/bloom-06.webp';
import bloom07 from '../assets/scenes/blooms/bloom-07.webp';
import bloom08 from '../assets/scenes/blooms/bloom-08.webp';
import bloom09 from '../assets/scenes/blooms/bloom-09.webp';
import bloom10 from '../assets/scenes/blooms/bloom-10.webp';
import bloom11 from '../assets/scenes/blooms/bloom-11.webp';
import ribbonSmoke from '../assets/scenes/ribbons/ribbon-smoke.webp';
import ribbonCopper from '../assets/scenes/ribbons/ribbon-copper.webp';
import ribbonMoss from '../assets/scenes/ribbons/ribbon-moss.webp';
import ribbonPlum from '../assets/scenes/ribbons/ribbon-plum.webp';
import { createCareerScrollTrigger } from './careerScroll';
import './CareerTree.css';

gsap.registerPlugin(useGSAP, ScrollTrigger);

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

const RIBBON_ASSETS = {
  gamesofa: ribbonSmoke,
  ntpu: ribbonCopper,
  actg: ribbonMoss,
  eelin: ribbonPlum,
};

const GAME_BLOOM_LAYOUT = {
  'wild-rift': { left: '40.8%', top: '61.3%', mobileLeft: '18%', mobileTop: '62%', size: 'lg', branch: 'lower-left' },
  'identity-v': { left: '34.8%', top: '48.2%', mobileLeft: '50%', mobileTop: '48%', size: 'md', branch: 'crown-left' },
  stardew: { left: '44.5%', top: '26.4%', mobileLeft: '50%', mobileTop: '24%', size: 'sm', branch: 'crown-center' },
  lol: { left: '58.2%', top: '30.1%', mobileLeft: '82%', mobileTop: '27%', size: 'lg', branch: 'crown-right' },
  valorant: { left: '34.7%', top: '36.4%', mobileLeft: '18%', mobileTop: '32%', size: 'sm', branch: 'crown-left' },
  r6: { left: '64.4%', top: '42.6%', mobileLeft: '82%', mobileTop: '42%', size: 'md', branch: 'crown-right' },
  gta5: { left: '53.4%', top: '44.7%', mobileLeft: '50%', mobileTop: '37%', size: 'sm', branch: 'crown-center' },
  minecraft: { left: '63.1%', top: '54.7%', mobileLeft: '82%', mobileTop: '58%', size: 'md', branch: 'lower-right' },
  palworld: { left: '60.1%', top: '65.5%', mobileLeft: '72%', mobileTop: '72%', size: 'lg', branch: 'lower-right' },
  'dont-starve': { left: '47.5%', top: '51.2%', mobileLeft: '18%', mobileTop: '48%', size: 'md', branch: 'crown-left' },
  raft: { left: '52.4%', top: '59.2%', mobileLeft: '36%', mobileTop: '72%', size: 'sm', branch: 'lower-left' },
};

const GAME_BLOOM_ASSETS = [
  bloom01,
  bloom02,
  bloom03,
  bloom04,
  bloom05,
  bloom06,
  bloom07,
  bloom08,
  bloom09,
  bloom10,
  bloom11,
];

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
export default function CareerTree() {
  const { t } = useLanguage();
  const reduce = useReducedMotion();
  const tree = t.careerTree;
  const [night, setNight] = useState(false);
  const [activeId, setActiveId] = useState(null);
  const [interactive, setInteractive] = useState(false);
  const sectionRef = useRef(null);
  const stageRef = useRef(null);
  const cameraRef = useRef(null);
  const ribbonTriggerRefs = useRef(new Map());

  const nightItems = tree.flowers.slice(0, GAME_BLOOM_ASSETS.length);
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

  useGSAP(
    () => {
      if (reduce || new URLSearchParams(window.location.search).has('impact-qa')) {
        setInteractive(true);
        return;
      }
      if (import.meta.env.MODE === 'test' || !stageRef.current || !cameraRef.current) return;

      setInteractive(false);
      gsap.set(cameraRef.current, { scale: 1, transformOrigin: '50% 48%' });
      gsap.set(stageRef.current, { '--camera-progress': 0 });
      gsap.to(cameraRef.current, {
        scale: 1.16,
        ease: 'none',
        scrollTrigger: createCareerScrollTrigger(stageRef.current, ({ progress }) => {
            stageRef.current?.style.setProperty('--camera-progress', progress.toFixed(3));
            setInteractive((current) => {
              const next = progress >= 0.72;
              return current === next ? current : next;
            });
          }),
      });
    },
    { scope: sectionRef, dependencies: [reduce], revertOnUpdate: true }
  );

  useEffect(() => {
    if (import.meta.env.MODE !== 'test') return undefined;
    const onTestProgress = (event) => setInteractive(event.detail >= 0.72);
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

  return (
    <section id="scene-3" className="career-tree" ref={sectionRef}>
      <RevealSection className="career-tree__heading container">
        <p className="eyebrow">{tree.eyebrow}</p>
        <h2>{tree.heading}</h2>
        <p className="career-tree__intro">{tree.intro}</p>
      </RevealSection>

      <div
        ref={stageRef}
        className={`career-tree__stage ${night ? 'career-tree__stage--night' : ''}`}
        data-interactive={interactive}
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
              ? items.map((item, index) => {
                  const position = GAME_BLOOM_LAYOUT[item.id];
                  return (
                    <GameBloom
                      key={`flower-${item.id}`}
                      game={item}
                      position={position}
                      size={position.size}
                      asset={GAME_BLOOM_ASSETS[index]}
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
                  return (
                    <div key={`ribbon-${item.id}`}>
                      <button
                        ref={triggerRef}
                        type="button"
                        className="career-tree__spot career-tree__spot--ribbon"
                        data-ribbon-id={item.id}
                        style={spots[item.id]}
                        aria-label={item.org}
                        aria-haspopup="dialog"
                        aria-expanded={activeId === item.id}
                        disabled={!interactive}
                      >
                        <img
                          src={RIBBON_ASSETS[item.id]}
                          alt=""
                          data-testid="career-ribbon-asset"
                          draggable="false"
                        />
                      </button>
                      <CareerRibbonSheet
                        item={{
                          ...item,
                          dragHint: tree.pullHint,
                          pullReady: tree.pullReady,
                          closeLabel: tree.closeLabel,
                        }}
                        open={activeId === item.id}
                        onOpen={() => setActiveId(item.id)}
                        onClose={() => setActiveId(null)}
                        triggerRef={triggerRef}
                      />
                    </div>
                  );
                })}
          </div>
          <LeafCanvas dense={Boolean(activeItem)} />
        </div>

        <button
          type="button"
          className="career-tree__toggle btn-glass"
          onClick={toggleNight}
          aria-label={night ? tree.toggleToDay : tree.toggleToNight}
          aria-pressed={night}
          disabled={!interactive}
        >
          {night ? <Sun size={20} weight="light" /> : <MoonStars size={20} weight="light" />}
          <span>{night ? tree.dayLabel : tree.nightLabel}</span>
        </button>

        <p className="career-tree__hint" aria-live="polite">
          {night ? tree.nightHint : tree.pullHint}
        </p>

      </div>

    </section>
  );
}
