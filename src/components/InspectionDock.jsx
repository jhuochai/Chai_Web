import dockBase from '../assets/scenes/inspection-dock/dock-base-v1.webp';
import './InspectionDock.css';

export default function InspectionDock({
  variant,
  accent,
  glow,
  specimen,
  children,
}) {
  return (
    <div
      className={`inspection-dock inspection-dock--${variant}`}
      data-testid="inspection-dock"
      data-variant={variant}
      style={{ '--dock-accent': accent, '--dock-glow': glow }}
    >
      <img
        className="inspection-dock__base"
        src={dockBase}
        alt=""
        draggable="false"
        data-testid="inspection-dock-base"
      />
      <div
        className="inspection-dock__specimen"
        data-testid="inspection-dock-specimen"
        aria-hidden="true"
      >
        <span className="inspection-dock__specimen-glow" />
        {specimen}
      </div>
      <div className="inspection-dock__content" data-testid="inspection-dock-content">
        {children}
      </div>
    </div>
  );
}
