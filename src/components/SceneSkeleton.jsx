import './SceneSkeleton.css';

/**
 * Shared placeholder for scenes that don't have their real content/
 * interactivity built yet (Batch 2/3). Confirms the scroll rhythm and
 * anchor wiring now without pretending these scenes are finished.
 */
export default function SceneSkeleton({ id, title, note, backgroundUrl }) {
  return (
    <section
      id={id}
      className="scene-skeleton"
      style={backgroundUrl ? { backgroundImage: `url(${backgroundUrl})` } : undefined}
    >
      <div className="scene-skeleton__scrim" aria-hidden="true" />
      <div className="scene-skeleton__content container">
        <h2>{title}</h2>
        <p>{note}</p>
      </div>
    </section>
  );
}
