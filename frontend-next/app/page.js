"use client";

import { useState, useRef, useCallback } from "react";
import axios from "axios";
import styles from "./page.module.css";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function Home() {
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
        "Upload failed — check if backend & ML service are running";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  // ── Render ─────────────────────────────────────────
  const faces = result?.mlData?.results || [];
  const faceCount = result?.mlData?.faces_detected ?? 0;

  return (
    <div className={styles.app}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.header__icon}>🛡️</div>
        <h1 className={styles.header__title}>AI Guardian</h1>
        <p className={styles.header__subtitle}>
          Intelligent face detection powered by machine learning
        </p>
      </header>

      {/* Main */}
      <main className={styles.main}>
        <section className={styles.uploadCard}>
          {/* Drop Zone */}
          <div
            className={`${styles.dropzone} ${dragActive ? styles.dropzoneActive : ""
              }`}
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
          >
            <div className={styles.dropzoneIcon}>📤</div>
            <p className={styles.dropzoneText}>
              Drag & drop an image here, or <strong>click to browse</strong>
            </p>
            <p className={styles.dropzoneHint}>
              Supports JPG, PNG, WEBP — max 10 MB
            </p>
            <input
              id="file-upload"
              ref={inputRef}
              type="file"
              accept="image/*"
              className={styles.dropzoneInput}
              onChange={(e) => handleFile(e.target.files[0])}
            />
          </div>

          {/* Image Preview */}
          {preview && (
            <div className={styles.preview}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={preview}
                alt="Upload preview"
                className={styles.previewImage}
              />
              <div className={styles.previewName}>
                <span>📎 {file.name}</span>
                <button className={styles.previewRemove} onClick={clearFile}>
                  Remove
                </button>
              </div>
            </div>
          )}

          {/* Upload Button */}
          <button
            id="upload-button"
            className={styles.uploadBtn}
            onClick={handleUpload}
            disabled={!file || loading}
          >
            {loading ? (
              <>
                <span className={styles.spinner} /> Analyzing…
              </>
            ) : (
              <>🔍 Analyze Image</>
            )}
          </button>

          {/* Status Indicator */}
          <div className={styles.statusBar}>
            <span className={styles.statusDot}></span>
            Backend: localhost:5000 · ML: localhost:8000
          </div>

          {/* Error */}
          {error && (
            <div className={styles.errorBanner} role="alert">
              <span className={styles.errorBannerIcon}>⚠️</span>
              <span>{error}</span>
            </div>
          )}
        </section>

        {/* Results */}
        {result && (
          <section className={styles.results}>
            <div className={styles.resultsHeader}>
              <h2 className={styles.resultsTitle}>Detection Results</h2>
              <span
                className={`${styles.badge} ${faceCount > 0 ? styles.badgeSuccess : styles.badgeWarning
                  }`}
              >
                {faceCount > 0 ? "✅" : "⚠️"}{" "}
                {faceCount === 0
                  ? "No faces found"
                  : `${faceCount} face${faceCount > 1 ? "s" : ""} detected`}
              </span>
            </div>

            {faces.length > 0 && (
              <div className={styles.resultsGrid}>
                {faces.map((face, i) => (
                  <div className={styles.faceCard} key={i}>
                    <span className={styles.faceCardIcon}>👤</span>
                    <div className={styles.faceCardInfo}>
                      <div className={styles.faceCardLabel}>
                        Face #{i + 1}
                      </div>
                      <div className={styles.faceCardCoords}>
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
      <footer className={styles.footer}>
        AI Guardian © {new Date().getFullYear()} — Powered by Next.js, OpenCV &
        FastAPI
      </footer>
    </div>
  );
}
