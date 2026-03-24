import { memo, type Ref } from 'react';

type CistercianRuneProps = {
  value: number;
  ref?: Ref<SVGSVGElement>;
  color?: string;
  strokeWidth?: number;
  className?: string;
};

/**
 * SVG path data for digits 1–9, anchored at the top-right quadrant origin.
 * All other quadrants reuse the same paths via SVG transforms.
 */
const RUNE_PATHS: Record<number, string> = {
  1: 'M 0,0 L 30,0',
  2: 'M 0,30 L 30,30',
  3: 'M 0,0 L 30,30',
  4: 'M 0,30 L 30,0',
  5: 'M 0,0 L 30,0 M 0,30 L 30,0',
  6: 'M 30,0 L 30,30',
  7: 'M 0,0 L 30,0 L 30,30',
  8: 'M 0,30 L 30,30 L 30,0',
  9: 'M 0,0 L 30,0 L 30,30 L 0,30',
};

/**
 * SVG transform for each positional quadrant in order:
 * units (top-right), tens (top-left), hundreds (bottom-right), thousands (bottom-left).
 */
const QUADRANTS = [
  'translate(50, 20)',
  'translate(50, 20) scale(-1, 1)',
  'translate(50, 130) scale(1, -1)',
  'translate(50, 130) scale(-1, -1)',
] as const;

/**
 * Decomposes a Cistercian-valid integer into its four positional digits.
 *
 * @param n - Integer in the range 1–9999.
 * @returns Tuple `[units, tens, hundreds, thousands]`.
 *          Returns `[0, 0, 0, 0]` for out-of-range or non-integer input.
 */
const decompose = (n: number): [number, number, number, number] =>
  n >= 1 && n <= 9999 && Number.isInteger(n)
    ? [n % 10, Math.floor((n % 100) / 10), Math.floor((n % 1000) / 100), Math.floor(n / 1000)]
    : [0, 0, 0, 0];

/**
 * Renders a single Cistercian numeral as an inline SVG.
 *
 * In React 19, `ref` is passed as a regular prop; `forwardRef` is not required.
 *
 * @param value       - Integer to render (1–9999). Values outside the range render the bare stem.
 * @param ref         - Optional ref forwarded to the underlying `<svg>` element.
 * @param color       - SVG stroke colour (default: `'currentColor'`).
 * @param strokeWidth - SVG stroke width in user units (default: `6`).
 * @param className   - Additional CSS class(es) applied to the root `<svg>` element.
 */
export const CistercianRune = memo(function CistercianRune({
  value,
  ref,
  color = 'currentColor',
  strokeWidth = 6,
  className = '',
}: CistercianRuneProps) {
  const digits  = decompose(value);
  const isValid = digits.some(Boolean);

  return (
    <svg
      ref={ref}
      viewBox="0 0 100 150"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="square"
      strokeLinejoin="miter"
      role="img"
      aria-label={isValid ? `Cistercian numeral ${value}` : 'Empty Cistercian stem'}
      className={className}
    >
      <line x1="50" y1="20" x2="50" y2="130" />

      {QUADRANTS.map((transform, i) =>
        digits[i] > 0 && (
          <path key={transform} d={RUNE_PATHS[digits[i]]} transform={transform} />
        )
      )}
    </svg>
  );
});
