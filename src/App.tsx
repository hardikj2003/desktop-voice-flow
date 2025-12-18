import { useTranscription } from "./hooks/useTranscription";
import "./App.css";

function App() {
  const DEEPGRAM_API_KEY = import.meta.env.VITE_DEEPGRAM_API_KEY;

const { transcription, isRecording, error, startRecording, stopRecording } = 
    useTranscription(DEEPGRAM_API_KEY);

  return (
    <main className="app-container">
      <header>
        <div className={`status-dot ${isRecording ? "pulse" : ""}`}></div>
        <h1>VoiceFlow</h1>
      </header>

      <section className="transcript-container">
        <div className="transcript-box">
          {error && (
            <div className="error-banner">
              <span className="error-icon">⚠️</span>
              <p>{error}</p>
            </div>
          )}
          {transcription ? (
            <p>{transcription}</p>
          ) : (
            <p className="placeholder">Hold the button and start speaking...</p>
          )}
        </div>
      </section>

      <footer className="controls">
        <button
          className={`ptt-button ${isRecording ? "recording" : ""}`}
          onMouseDown={startRecording}
          onMouseUp={stopRecording}
          onMouseLeave={isRecording ? stopRecording : undefined}
        >
          {isRecording ? (
            <div className="button-content">
              <span className="icon">●</span>
              <span>LISTENING</span>
            </div>
          ) : (
            <div className="button-content">
              <span className="icon">🎤</span>
              <span>HOLD TO SPEAK</span>
            </div>
          )}
        </button>

        <div className="action-bar">
          <button
            className="secondary-button"
            onClick={() => navigator.clipboard.writeText(transcription)}
            disabled={!transcription}
          >
            Copy to Clipboard
          </button>
        </div>
      </footer>
    </main>
  );
}

export default App;
