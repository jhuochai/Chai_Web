// Original geometric linework used as the site's one recurring signature.
// "corners" = restrained Art Deco corner brackets for the nameplate/portrait.
// "wild" = angular faceted shard burst for portfolio cards.
// Hand-authored shapes, not traced from any reference material.
export default function CrackTexture({ variant = 'corners', className = '' }) {
  if (variant === 'wild') {
    return (
      <svg
        className={`crack-texture crack-texture--wild ${className}`}
        viewBox="0 0 400 500"
        preserveAspectRatio="none"
        aria-hidden="true"
        focusable="false"
      >
        <path d="M370 40 L300 96 L336 150 L262 146 L286 214" className="crack-line" />
        <path d="M300 96 L344 70" className="crack-line crack-line--thin" />
        <path d="M336 150 L392 176" className="crack-line crack-line--thin" />
        <path d="M30 460 L104 402 L70 348 L142 356" className="crack-line" />
        <path d="M104 402 L58 380" className="crack-line crack-line--thin" />
        <path d="M70 348 L18 328" className="crack-line crack-line--thin" />
        <path d="M20 60 L64 96 L46 132" className="crack-line crack-line--thin" />
        <path d="M382 430 L336 400 L352 366" className="crack-line crack-line--thin" />
      </svg>
    );
  }

  if (variant === 'deco') {
    return (
      <svg
        className={`crack-texture crack-texture--deco ${className}`}
        viewBox="0 0 400 500"
        preserveAspectRatio="none"
        aria-hidden="true"
        focusable="false"
      >
        {/* Outer rectilinear border */}
        <path
          d="M18 18 L382 18 L382 482 L18 482 Z"
          className="crack-line crack-line--thin"
        />
        {/* Inner nested border, Art Deco double-line frame */}
        <path
          d="M30 30 L370 30 L370 470 L30 470 Z"
          className="crack-line crack-line--thin"
        />
        {/* Corner notches, all four corners */}
        <path d="M18 46 L34 46 L34 18" className="crack-line" />
        <path d="M382 46 L366 46 L366 18" className="crack-line" />
        <path d="M18 454 L34 454 L34 482" className="crack-line" />
        <path d="M382 454 L366 454 L366 482" className="crack-line" />
        {/* Symmetric corner step-diamonds, the Art Deco signature detail */}
        <path d="M18 18 L40 40" className="crack-line crack-line--thin" />
        <path d="M382 18 L360 40" className="crack-line crack-line--thin" />
        <path d="M18 482 L40 460" className="crack-line crack-line--thin" />
        <path d="M382 482 L360 460" className="crack-line crack-line--thin" />
      </svg>
    );
  }

  return (
    <svg
      className={`crack-texture crack-texture--corners ${className}`}
      viewBox="0 0 400 500"
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M4 40 L4 4 L40 4" className="crack-line crack-line--thin" />
      <path d="M4 26 L18 26 L26 18 L26 4" className="crack-line crack-line--thin" />
      <path d="M396 40 L396 4 L360 4" className="crack-line crack-line--thin" />
      <path d="M396 26 L382 26 L374 18 L374 4" className="crack-line crack-line--thin" />
      <path d="M4 460 L4 496 L40 496" className="crack-line crack-line--thin" />
      <path d="M4 474 L18 474 L26 482 L26 496" className="crack-line crack-line--thin" />
      <path d="M396 460 L396 496 L360 496" className="crack-line crack-line--thin" />
      <path d="M396 474 L382 474 L374 482 L374 496" className="crack-line crack-line--thin" />
    </svg>
  );
}
