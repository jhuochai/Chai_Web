import CrackTexture from './CrackTexture';
import './FramedPanel.css';

/**
 * The site's one recurring signature: a gold art-deco frame around
 * content, with a faint fracture texture that lights up electric-blue
 * on hover/focus. Used for the Hero nameplate and every portfolio card.
 */
export default function FramedPanel({
  as: Tag = 'div',
  variant = 'corners',
  className = '',
  children,
  ...rest
}) {
  return (
    <Tag className={`framed-panel framed-panel--${variant} ${className}`} {...rest}>
      <CrackTexture variant={variant === 'wild' ? 'wild' : 'corners'} />
      <div className="framed-panel__content">{children}</div>
    </Tag>
  );
}
