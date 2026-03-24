import { useReducer, useDeferredValue, useCallback, useRef, type ChangeEvent, type RefObject } from 'react';

/**
 * Parses a raw input string into a validated Cistercian numeral.
 *
 * @param val - Raw string from the number input.
 * @returns `{ num, isValid }` where `num` is the parsed integer and
 *          `isValid` is `true` when `num` is an integer in [1, 9999].
 */
export const validateValue = (val: string) => {
  const num = parseInt(val, 10);
  const isValid = !isNaN(num) && num >= 1 && num <= 9999;
  return { num, isValid };
};

/**
 * Returns `true` when `val` is non-empty but fails Cistercian validation.
 *
 * @param val - Raw string from the number input.
 */
const isError = (val: string): boolean => {
  const { isValid } = validateValue(val);
  return val !== '' && !isValid;
};

/** Flat state managed by {@link reducer}. */
type State = { inputValue: string; shakeKey: number };

/**
 * Pure reducer for rune input state.
 *
 * The action is the next raw input string directly — a single-action
 * reducer does not benefit from a discriminated union wrapper.
 *
 * `shakeKey` increments only on a valid→error transition so the wrapper
 * element remounts and the CSS shake animation replays from the start.
 *
 * @param state     - Current state.
 * @param nextInput - Next raw input string dispatched from the change handler.
 */
function reducer(state: State, nextInput: string): State {
  const willError = isError(nextInput);
  const wasError  = isError(state.inputValue);
  return {
    inputValue: nextInput,
    shakeKey: willError && !wasError ? state.shakeKey + 1 : state.shakeKey,
  };
}

const INITIAL_STATE: State = { inputValue: '1992', shakeKey: 0 };

/** Shape of the value returned by {@link useRuneState}. */
export type RuneState = {
  inputValue:        string;
  shakeKey:          number;
  displayValue:      number;
  isError:           boolean;
  isDeferredValid:   boolean;
  deferredNum:       number;
  svgRef:            RefObject<SVGSVGElement | null>;
  handleInputChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleDownload:    () => void;
};

/**
 * Encapsulates all state and event-handling logic for the rune converter.
 *
 * Separating state from the view keeps `App` a pure, zero-logic component
 * and makes this hook independently testable.
 *
 * @returns {@link RuneState} — derived values, refs, and stable callbacks
 *          ready to be spread into the view.
 */
export function useRuneState(): RuneState {
  const [{ inputValue, shakeKey }, dispatch] = useReducer(reducer, INITIAL_STATE);
  const deferredValue = useDeferredValue(inputValue);
  const svgRef        = useRef<SVGSVGElement>(null);

  const { num: deferredNum, isValid: isDeferredValid } = validateValue(deferredValue);

  const handleInputChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    dispatch(e.target.value);
  }, []);

  const handleDownload = useCallback(() => {
    if (!svgRef.current || !isDeferredValid) return;

    const svgStr = new XMLSerializer().serializeToString(svgRef.current);
    const url    = URL.createObjectURL(new Blob([svgStr], { type: 'image/svg+xml' }));
    const anchor = Object.assign(document.createElement('a'), {
      href:     url,
      download: `cistercian-${deferredNum}.svg`,
    });

    anchor.click();
    URL.revokeObjectURL(url);
  }, [isDeferredValid, deferredNum]);

  return {
    inputValue,
    shakeKey,
    displayValue:    isDeferredValid ? deferredNum : 0,
    isError:         isError(inputValue),
    isDeferredValid,
    deferredNum,
    svgRef,
    handleInputChange,
    handleDownload,
  };
}
