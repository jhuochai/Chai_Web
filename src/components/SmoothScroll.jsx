import { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import 'lenis/dist/lenis.css';
import { setScrollEngine } from '../lib/scrollToScene';

gsap.registerPlugin(ScrollTrigger);

export default function SmoothScroll({ paused = false }) {
  const lenisRef = useRef(null);

  useEffect(() => {
    const lenis = new Lenis({
      anchors: true,
      autoRaf: false,
      respectReducedMotion: true,
      stopInertiaOnNavigate: true,
    });
    const removeScrollListener = lenis.on('scroll', ScrollTrigger.update);
    const update = (time) => lenis.raf(time * 1000);

    lenisRef.current = lenis;
    setScrollEngine(lenis);
    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);

    if (paused) lenis.stop();

    return () => {
      if (typeof removeScrollListener === 'function') removeScrollListener();
      gsap.ticker.remove(update);
      setScrollEngine(null);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  useEffect(() => {
    const lenis = lenisRef.current;
    if (!lenis) return;

    if (paused) lenis.stop();
    else lenis.start();
  }, [paused]);

  return null;
}
