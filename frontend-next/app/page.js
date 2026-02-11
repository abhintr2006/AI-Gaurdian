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

  const handleFile = useCallback((f) => {
    if (!f) return;
    if (!f.type.startsWith("image/")) {
      setError("Invalid file type. Select a JPG, PNG, or WEBP image.");
      return;
    }
    if (f.size > 10 * 1024 * 1024) {
      setError("File exceeds 10 MB limit.");
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
      setError(
        err.response?.data?.error ||
        err.message ||
        "Request failed. Verify backend and ML service are running."
      );
    } finally {
      setLoading(false);
    }
  };

  const faces = result?.mlData?.results || [];
  const faceCount = result?.mlData?.faces_detected ?? 0;

  return (
    <div className={styles.page}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerLabel}>
          <span className={styles.headerDot} />
          AI Guardian
        </div>
        <h1 className={styles.headerTitle}>Face Detection</h1>
        <p className={styles.headerDesc}>
          Upload an image to detect and locate faces using OpenCV.
        </p>
      </header>

      {/* Main */}
      <main className={styles.main}>
        <section className={styles.card}>
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
            <svg
              className={styles.uploadIcon}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            <p className={styles.dropzoneLabel}>
              Drop an image here or <strong>browse files</strong>
            </p>
            <p className={styles.dropzoneHint}>JPG, PNG, WEBP up to 10 MB</p>
            <input
              id="file-upload"
              ref={inputRef}
              type="file"
              accept="image/*"
              className={styles.dropzoneInput}
              onChange={(e) => handleFile(e.target.files[0])}
            />
          </div>

          {/* Preview */}
          {preview && (
            <div className={styles.preview}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={preview}
                alt="Selected file preview"
                className={styles.previewImage}
              />
              <div className={styles.previewMeta}>
                <span>{file.name}</span>
                <button className={styles.removeBtn} onClick={clearFile}>
                  Remove
                </button>
              </div>
            </div>
          )}

          {/* Submit */}
          <button
            id="upload-button"
            className={styles.submitBtn}
            onClick={handleUpload}
            disabled={!file || loading}
          >
            {loading ? (
              <>
                <span className={styles.spinner} />
                Analyzing
              </>
            ) : (
              "Analyze image"
            )}
          </button>

          {/* Error */}
          {error && (
            <div className={styles.error} role="alert">
              {error}
            </div>
          )}
        </section>

        {/* Results */}
        {result && (
          <section className={styles.results}>
            <div className={styles.resultsHeader}>
              <h2 className={styles.resultsTitle}>Results</h2>
              <span
                className={`${styles.badge} ${faceCount > 0 ? styles.badgeSuccess : styles.badgeWarning
                  }`}
              >
                {faceCount === 0
                  ? "No faces found"
                  : `${faceCount} face${faceCount > 1 ? "s" : ""} detected`}
              </span>
            </div>

            {faces.length > 0 && (
              <div className={styles.resultsGrid}>
                {faces.map((face, i) => (
                  <div className={styles.faceRow} key={i}>
                    <span className={styles.faceIndex}>{i + 1}</span>
                    <div>
                      <div className={styles.faceLabel}>Face {i + 1}</div>
                      <div className={styles.faceCoords}>
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
        AI Guardian &middot; OpenCV &middot; FastAPI &middot; Next.js
      </footer>
    </div>
  );
}
