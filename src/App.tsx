import { CistercianRune } from './components/CistercianRune';
import { useRuneState } from './hooks/useRuneState';
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

export default function App() {
  const {
    inputValue, shakeKey, displayValue,
    isError, isDeferredValid, deferredNum,
    svgRef, handleInputChange, handleDownload,
  } = useRuneState();

  return (
    <>
      {BackgroundEffects}

      <div className="app-container">
        <div className="glass-panel">
          {Header}

          <main className="rune-display">
            <div key={shakeKey} className={`rune-wrapper ${isError ? 'error-shake' : ''}`}>
              <CistercianRune
                ref={svgRef}
                value={displayValue}
                color={isError ? 'var(--error-color)' : 'var(--accent-color)'}
                className="rune-svg"
              />
            </div>
          </main>

          <div className="input-section">
            <label htmlFor="rune-input" className="input-label">
              Enter a number (1–9999)
            </label>

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
              <div className={`input-glow ${isError ? 'glow-error' : ''}`} />
            </div>

            <p className={`status-message ${isError ? 'status-error' : ''}`}>
              {isError
                ? 'Please enter a valid integer between 1 and 9999.'
                : 'Valid Rune Sequence'}
            </p>

            <button
              className="download-btn"
              onClick={handleDownload}
              disabled={!isDeferredValid}
              aria-label={
                isDeferredValid
                  ? `Download SVG for ${deferredNum}`
                  : 'No valid rune to download'
              }
            >
              Download SVG
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
