import { useState } from 'react';
import { CistercianRune } from './components/CistercianRune';
import './index.css';

function App() {
  const [inputValue, setInputValue] = useState<string>('1992');
  
  const numValue = parseInt(inputValue, 10);
  const isValid = !isNaN(numValue) && numValue >= 1 && numValue <= 9999;
  const displayValue = isValid ? numValue : 0; // 0 renders just the stem
  const isError = inputValue !== '' && !isValid;

  return (
    <>
      <div className="background-effects">
        <div className="glow-orb orb-1"></div>
        <div className="glow-orb orb-2"></div>
      </div>
      
      <div className="app-container">
        <div className="glass-panel">
          <header>
            <h1 className="title">Cistercian Runes</h1>
            <p className="subtitle">
              An ancient numeral system representing numbers from 1 to 9999 in a single glyph.
            </p>
          </header>

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
                onChange={(e) => setInputValue(e.target.value)}
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
