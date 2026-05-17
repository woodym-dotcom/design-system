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
/**
 * Person / team avatar. Falls back to initials with a deterministic
 * brand-palette accent colour when no image is available or the image
 * fails to load.
 */
export declare function Avatar({ name, src, size, shape, colorSeed, onClick, className, }: AvatarProps): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=Avatar.d.ts.map