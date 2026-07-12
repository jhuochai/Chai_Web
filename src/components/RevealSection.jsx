import { motion, useReducedMotion } from 'motion/react';

/**
 * Scroll reveal used across every section: content rises out of the
 * dark with a soft gold glow spreading behind it, standing in for a
 * spotlight finding the canvas rather than a plain fade-in.
 */
export default function RevealSection({
  as: Tag = 'div',
  delay = 0,
  className = '',
  glow = true,
  children,
  ...rest
}) {
  const reduce = useReducedMotion();
  const MotionTag = motion[Tag] ?? motion.div;

  return (
    <MotionTag
      className={`reveal-section ${className}`}
      initial={reduce ? false : { opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
      style={
        glow && !reduce
          ? { position: 'relative' }
          : undefined
      }
      {...rest}
    >
      {children}
    </MotionTag>
  );
}
