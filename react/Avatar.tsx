import * as React from 'react';

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type AvatarShape = 'circle' | 'square';

export interface AvatarProps {
  /** Person/team name. Required — used for initials fallback + alt text. */
  name: string;
  /** Image URL. If missing or fails to load, initials render. */
  src?: string;
  /** Visual size. Default 'md'. */
  size?: AvatarSize;
  /** Corner shape. Default 'circle'. */
  shape?: AvatarShape;
  /** Deterministic accent colour seed (defaults to `name`). */
  colorSeed?: string;
  /** Render as a button when onClick provided. */
  onClick?: () => void;
  className?: string;
}

const PALETTE = [
  'var(--viz-1, #2c5282)',
  'var(--viz-2, #2f855a)',
  'var(--viz-3, #b7791f)',
  'var(--viz-4, #6b46c1)',
  'var(--viz-5, #b83280)',
  'var(--viz-6, #2c7a7b)',
];

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function hashColor(seed: string): string {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0;
  }
  return PALETTE[Math.abs(hash) % PALETTE.length];
}

/**
 * Person / team avatar. Falls back to initials with a deterministic
 * brand-palette accent colour when no image is available or the image
 * fails to load.
 */
export function Avatar({
  name,
  src,
  size = 'md',
  shape = 'circle',
  colorSeed,
  onClick,
  className,
}: AvatarProps) {
  const [imgFailed, setImgFailed] = React.useState(false);
  const accent = hashColor(colorSeed ?? name);
  const showImage = src && !imgFailed;

  const classes = [
    'cc-avatar',
    `cc-avatar--${size}`,
    `cc-avatar--${shape}`,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const inner = showImage ? (
    <img
      src={src}
      alt={name}
      className="cc-avatar__img"
      onError={() => setImgFailed(true)}
      loading="lazy"
    />
  ) : (
    <span aria-label={name} className="cc-avatar__initials" style={{ background: accent }}>
      {initials(name)}
    </span>
  );

  if (onClick) {
    return (
      <button type="button" className={classes} onClick={onClick} aria-label={name}>
        {inner}
      </button>
    );
  }
  return <span className={classes}>{inner}</span>;
}
