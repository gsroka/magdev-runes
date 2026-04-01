import { CistercianRune } from './components/CistercianRune';
import { Header } from './components/Header';
import { BackgroundEffects } from './components/BackgroundEffects';
import { useRuneState } from './hooks/useRuneState';
import { RUNE_MIN, RUNE_MAX } from './constants/rune';
import './index.css';

export default function App() {
  const {
    inputValue, shakeKey, displayValue,
    isError, isDeferredValid, deferredNum,
    svgRef, handleInputChange, handleDownload,
  } = useRuneState();

  return (
    <>
      <BackgroundEffects />

      <div className="app-container">
        <div className="glass-panel">
          <Header />

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
              Enter a number ({RUNE_MIN}–{RUNE_MAX})
            </label>

            <div className="input-with-glow">
              <input
                id="rune-input"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={inputValue}
                onChange={handleInputChange}
                placeholder={`e.g. ${RUNE_MAX}`}
                className={`modern-input ${isError ? 'input-error' : ''}`}
                autoFocus
              />
              <div className={`input-glow ${isError ? 'glow-error' : ''}`} />
            </div>

            <p className={`status-message ${isError ? 'status-error' : ''}`}>
              {isError
                ? `Please enter a valid integer between ${RUNE_MIN} and ${RUNE_MAX}.`
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
