import { useId } from 'react';

export default function TreeOcclusionLayer({ source, mode, patches, active }) {
  const instanceId = useId().replaceAll(':', '');
  const maskId = `tree-occlusion-${mode}-${instanceId}`;
  const softenId = `tree-occlusion-soften-${mode}-${instanceId}`;

  return (
    <svg
      className={`career-tree__occlusion career-tree__occlusion--${mode}${active ? ' career-tree__occlusion--active' : ''}`}
      viewBox="0 0 1672 941"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      focusable="false"
      data-testid={`tree-occlusion-${mode}`}
    >
      <defs>
        <filter id={softenId} x="-20%" y="-40%" width="140%" height="180%">
          <feGaussianBlur stdDeviation="1.4" />
        </filter>
        <mask id={maskId} maskUnits="userSpaceOnUse" x="0" y="0" width="1672" height="941">
          <rect width="1672" height="941" fill="black" />
          <g fill="white" filter={`url(#${softenId})`}>
            {patches.map((patch) => (
              <ellipse
                key={patch.id}
                cx={patch.cx}
                cy={patch.cy}
                rx={patch.rx}
                ry={patch.ry}
                transform={`rotate(${patch.rotation} ${patch.cx} ${patch.cy})`}
              />
            ))}
          </g>
        </mask>
      </defs>
      <image
        href={source}
        width="1672"
        height="941"
        preserveAspectRatio="xMidYMid slice"
        mask={`url(#${maskId})`}
      />
    </svg>
  );
}
