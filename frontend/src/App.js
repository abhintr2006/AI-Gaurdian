import { useState, useRef, useCallback } from "react";
import axios from "axios";
import "./App.css";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

function App() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef(null);

  // ── File handling ───────────────────────────────────
  const handleFile = useCallback((f) => {
    if (!f) return;
    if (!f.type.startsWith("image/")) {
      setError("Please select a valid image file (JPG, PNG, etc.)");
      return;
    }
    setFile(f);
    setPreview(URL.createObjectURL(f));
    setResult(null);
    setError(null);
  }, []);

  const clearFile = () => {
    setFile(null);
    setPreview(null);
    setResult(null);
    setError(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  // ── Drag & drop ────────────────────────────────────
  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === "dragenter" || e.type === "dragover");
  }, []);

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);
      if (e.dataTransfer.files?.[0]) handleFile(e.dataTransfer.files[0]);
    },
    [handleFile]
  );

  // ── Upload ─────────────────────────────────────────
  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);
    setResult(null);

    const formData = new FormData();
    formData.append("image", file);

    try {
      const { data } = await axios.post(`${API_URL}/api/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        timeout: 30000,
      });
      setResult(data);
    } catch (err) {
      const msg =
        err.response?.data?.error ||
        err.message ||
        "Upload failed — check if the backend is running";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  // ── Render ─────────────────────────────────────────
  const faces = result?.mlData?.results || [];
  const faceCount = result?.mlData?.faces_detected ?? 0;

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div className="header__icon">🛡️</div>
        <h1 className="header__title">AI Guardian</h1>
        <p className="header__subtitle">
          Intelligent face detection powered by machine learning
        </p>
      </header>

      {/* Main */}
      <main className="main">
        <section className="upload-card">
          {/* Drop Zone */}
          <div
            className={`dropzone ${dragActive ? "dropzone--active" : ""}`}
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
          >
            <div className="dropzone__icon">📤</div>
            <p className="dropzone__text">
              Drag & drop an image here, or <strong>click to browse</strong>
            </p>
            <p className="dropzone__hint">
              Supports JPG, PNG, WEBP — max 10 MB
            </p>
            <input
              id="file-upload"
              ref={inputRef}
              type="file"
              accept="image/*"
              className="dropzone__input"
              onChange={(e) => handleFile(e.target.files[0])}
            />
          </div>

          {/* Image Preview */}
          {preview && (
            <div className="preview">
              <img
                src={preview}
                alt="Upload preview"
                className="preview__image"
              />
              <div className="preview__name">
                <span>📎 {file.name}</span>
                <button className="preview__remove" onClick={clearFile}>
                  Remove
                </button>
              </div>
            </div>
          )}

          {/* Upload Button */}
          <button
            id="upload-button"
            className="upload-btn"
            onClick={handleUpload}
            disabled={!file || loading}
          >
            {loading ? (
              <>
                <span className="spinner" /> Analyzing…
              </>
            ) : (
              <>🔍 Analyze Image</>
            )}
          </button>

          {/* Error */}
          {error && (
            <div className="error-banner" role="alert">
              <span className="error-banner__icon">⚠️</span>
              <span>{error}</span>
            </div>
          )}
        </section>

        {/* Results */}
        {result && (
          <section className="results">
            <div className="results__header">
              <h2 className="results__title">Detection Results</h2>
              <span
                className={`results__badge ${faceCount > 0
                    ? "results__badge--success"
                    : "results__badge--warning"
                  }`}
              >
                {faceCount > 0 ? "✅" : "⚠️"}{" "}
                {faceCount === 0
                  ? "No faces found"
                  : `${faceCount} face${faceCount > 1 ? "s" : ""} detected`}
              </span>
            </div>

            {faces.length > 0 && (
              <div className="results__grid">
                {faces.map((face, i) => (
                  <div className="face-card" key={i}>
                    <span className="face-card__icon">👤</span>
                    <div className="face-card__info">
                      <div className="face-card__label">Face #{i + 1}</div>
                      <div className="face-card__coords">
                        x:{face.face_box[0]} y:{face.face_box[1]} w:
                        {face.face_box[2]} h:{face.face_box[3]}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="footer">
        AI Guardian &copy; {new Date().getFullYear()} — Powered by OpenCV &
        FastAPI
      </footer>
    </div>
  );
}

export default App;
