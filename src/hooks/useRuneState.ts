import { useReducer, useDeferredValue, useCallback, useRef, type ChangeEvent, type RefObject } from 'react';
import { validateRuneValue } from '../utils/runeUtils';
import { downloadSvgBlob } from '../utils/downloadUtils';

/** Flat state managed by {@link reducer}. */
type State = { inputValue: string; shakeKey: number };

/**
 * Pure reducer for rune input state.
 *
 * Increments `shakeKey` only on a valid→error transition so the wrapper
 * element remounts and the CSS shake animation replays from the start.
 */
function reducer(state: State, nextInput: string): State {
  const { isValid: willBeValid } = validateRuneValue(nextInput);
  const { isValid: currentlyValid } = validateRuneValue(state.inputValue);

  // If next value is empty, don't trigger shake (it's "in progress"),
  // but if it's non-empty and invalid, and we were valid before, SHAKE!
  const shouldShake = nextInput !== '' && !willBeValid && currentlyValid;

  return {
    inputValue: nextInput,
    shakeKey: shouldShake ? state.shakeKey + 1 : state.shakeKey,
  };
}

const INITIAL_STATE: State = { inputValue: '1992', shakeKey: 0 };

/** Public API shape of {@link useRuneState}. */
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
 * Hook for managing the state and behavior of the Cistercian Rune converter.
 *
 * Separates concerns by delegating validation to `runeUtils` and the
 * file export bit to `downloadUtils`.
 */
export function useRuneState(): RuneState {
  const [{ inputValue, shakeKey }, dispatch] = useReducer(reducer, INITIAL_STATE);
  const deferredValue = useDeferredValue(inputValue);
  const svgRef        = useRef<SVGSVGElement>(null);

  const { num: deferredNum, isValid: isDeferredValid } = validateRuneValue(deferredValue);
  const { isValid: isInputValid }                      = validateRuneValue(inputValue);

  const handleInputChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    dispatch(e.target.value);
  }, []);

  const handleDownload = useCallback(() => {
    if (!svgRef.current || !isDeferredValid) return;

    downloadSvgBlob(svgRef.current, `cistercian-${deferredNum}.svg`);
  }, [isDeferredValid, deferredNum]);

  return {
    inputValue,
    shakeKey,
    displayValue:    isDeferredValid ? deferredNum : 0,
    isError:         inputValue !== '' && !isInputValid,
    isDeferredValid,
    deferredNum,
    svgRef,
    handleInputChange,
    handleDownload,
  };
}
