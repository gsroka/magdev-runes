import { useState, useDeferredValue, useCallback, type ChangeEvent } from 'react';
import { preconnect, prefetchDNS } from 'react-dom';
import { CistercianRune } from './components/CistercianRune';
import './index.css';

const BackgroundEffects = (
  <div className="background-effects">
    <div className="glow-orb orb-1"></div>
    <div className="glow-orb orb-2"></div>
  </div>
);

const Header = (
  <header>
    <h1 className="title">Cistercian Runes</h1>
    <p className="subtitle">
      An ancient numeral system representing numbers from 1 to 9999 in a single glyph.
    </p>
  </header>
);

function App() {
  prefetchDNS('https://fonts.googleapis.com');
  preconnect('https://fonts.gstatic.com');

  const [inputValue, setInputValue] = useState<string>('1992');
  const deferredValue = useDeferredValue(inputValue);
  
  const handleInputChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  }, []);

  const validateValue = (val: string) => {
    const num = parseInt(val, 10);
    const isValid = !isNaN(num) && num >= 1 && num <= 9999;
    return { num, isValid };
  };

  const { num: deferredNum, isValid: isDeferredValid } = validateValue(deferredValue);
  const displayValue = isDeferredValid ? deferredNum : 0;

  const { isValid: isImmediateValid } = validateValue(inputValue);
  const isError = inputValue !== '' && !isImmediateValid;

  return (
    <>
      {BackgroundEffects}
      
      <div className="app-container">
        <div className="glass-panel">
          {Header}

          <main className="rune-display">
            <div className={`rune-wrapper ${isError ? 'error-shake' : ''}`}>
              <CistercianRune 
                value={displayValue} 
                color={isError ? "var(--error-color)" : "var(--accent-color)"}
                className="rune-svg" 
              />
            </div>
          </main>

          <div className="input-section">
            <label htmlFor="rune-input" className="input-label">Enter a number (1-9999)</label>
            <div className="input-with-glow">
              <input
                id="rune-input"
                type="number"
                min="1"
                max="9999"
                step="1"
                value={inputValue}
                onChange={handleInputChange}
                placeholder="e.g. 1993"
                className={`modern-input ${isError ? 'input-error' : ''}`}
                autoFocus
              />
              <div className={`input-glow ${isError ? 'glow-error' : ''}`}></div>
            </div>
            <div className="status-message">
              {isError ? "Please enter a valid integer between 1 and 9999." : "Valid Rune Sequence"}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
