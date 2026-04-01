import { RUNE_MIN, RUNE_MAX } from '../constants/rune';

/**
 * Validates a string input strictly as a positive integer within the Cistercian range.
 * Rejects scientific notation (e), decimals (.), or other non-digit characters.
 *
 * @param val - The raw string from the input field.
 * @returns { num: number, isValid: boolean }
 */
export function validateRuneValue(val: string): { num: number; isValid: boolean } {
  if (val === '') {
    return { num: 0, isValid: false };
  }

  // Strict integer check: only digits, no 'e', '.', or ','
  if (!/^\d+$/.test(val)) {
    return { num: 0, isValid: false };
  }

  const num = parseInt(val, 10);
  const isValid = num >= RUNE_MIN && num <= RUNE_MAX;

  return { num: isValid ? num : 0, isValid };
}

/**
 * Decomposes a Cistercian-valid integer into its four positional digits.
 *
 * @param n - Integer in the range [1, 9999].
 * @returns Tuple [units, tens, hundreds, thousands].
 */
export function decomposeRune(n: number): [number, number, number, number] {
  if (n < RUNE_MIN || n > RUNE_MAX || !Number.isInteger(n)) {
    return [0, 0, 0, 0];
  }

  return [
    n % 10,
    Math.floor((n % 100) / 10),
    Math.floor((n % 1000) / 100),
    Math.floor(n / 1000),
  ];
}
