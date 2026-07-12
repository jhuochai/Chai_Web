import './GrainOverlay.css';

/**
 * Fixed, non-scrolling canvas-grain layer for the oil-paint / spray
 * texture the brief asks for. Kept off scrolling containers per
 * performance guidance (no repaint cost while scrolling).
 */
export default function GrainOverlay() {
  return (
    <svg className="grain-overlay" aria-hidden="true" focusable="false">
      <filter id="grain-filter">
        <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" stitchTiles="stitch" />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width="100%" height="100%" filter="url(#grain-filter)" />
    </svg>
  );
}
