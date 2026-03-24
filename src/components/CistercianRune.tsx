import { memo } from 'react';

type CistercianRuneProps = {
  value: number;
  color?: string;
  strokeWidth?: number;
  className?: string;
};

const RUNE_PATHS = new Map<number, string>([
  [1, "M 0,0 L 30,0"],
  [2, "M 0,30 L 30,30"],
  [3, "M 0,0 L 30,30"],
  [4, "M 0,30 L 30,0"],
  [5, "M 0,0 L 30,0 M 0,30 L 30,0"],
  [6, "M 30,0 L 30,30"],
  [7, "M 0,0 L 30,0 L 30,30"],
  [8, "M 0,30 L 30,30 M 30,30 L 30,0"], // Adjusted for visual continuity
  [9, "M 0,0 L 30,0 L 30,30 L 0,30"]
]);

export const CistercianRune = memo(({ 
  value, 
  color = "currentColor", 
  strokeWidth = 6,
  className = ""
}: CistercianRuneProps) => {
  // If value is completely out of bounds or not an integer, just render the empty stem.
  const isValid = value >= 1 && value <= 9999 && Number.isInteger(value);

  const units = isValid ? value % 10 : 0;
  const tens = isValid ? Math.floor((value % 100) / 10) : 0;
  const hundreds = isValid ? Math.floor((value % 1000) / 100) : 0;
  const thousands = isValid ? Math.floor(value / 1000) : 0;

  return (
    <div className={`transition-all duration-300 ${className}`}>
      <svg 
        viewBox="0 0 100 150" 
        fill="none" 
        stroke={color} 
        strokeWidth={strokeWidth} 
        strokeLinecap="square"
        strokeLinejoin="miter"
        className="size-full"
      >
        {/* Central Stem */}
        <line x1="50" y1="20" x2="50" y2="130" className="transition-all duration-300" />
        
        {/* Top Right Quadrant (Units 1-9) */}
        {units > 0 && (
          <path d={RUNE_PATHS.get(units)} transform="translate(50, 20)" className="transition-all duration-300" />
        )}
        
        {/* Top Left Quadrant (Tens 10-90) */}
        {tens > 0 && (
          <path d={RUNE_PATHS.get(tens)} transform="translate(50, 20) scale(-1, 1)" className="transition-all duration-300" />
        )}
        
        {/* Bottom Right Quadrant (Hundreds 100-900) */}
        {hundreds > 0 && (
          <path d={RUNE_PATHS.get(hundreds)} transform="translate(50, 130) scale(1, -1)" className="transition-all duration-300" />
        )}
        
        {/* Bottom Left Quadrant (Thousands 1000-9000) */}
        {thousands > 0 && (
          <path d={RUNE_PATHS.get(thousands)} transform="translate(50, 130) scale(-1, -1)" className="transition-all duration-300" />
        )}
      </svg>
    </div>
  );
});
