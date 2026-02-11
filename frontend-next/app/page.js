"use client";

import { useState, useRef, useCallback } from "react";
import axios from "axios";

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
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="pt-10 pb-6 px-6 text-center">
        <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-wide uppercase text-accent mb-3">
          <span className="w-1.5 h-1.5 rounded-full bg-accent" />
          AI Guardian
        </div>
        <h1 className="text-2xl font-bold text-gray-50 tracking-tight">
          Face Detection
        </h1>
        <p className="text-sm text-gray-400 mt-2">
          Upload an image to detect and locate faces using OpenCV.
        </p>
      </header>

      {/* Main */}
      <main className="flex-1 w-full max-w-content mx-auto px-6 pb-12">
        <section className="bg-gray-900 border border-gray-800 rounded-md p-6">
          {/* Drop Zone */}
          <div
            className={`border-[1.5px] border-dashed rounded-sm p-10 text-center cursor-pointer
              transition-[border-color,background] duration-[150ms] ease-default
              ${
                dragActive
                  ? "border-accent bg-accent-muted"
                  : "border-gray-700 hover:border-accent hover:bg-accent-muted"
              }`}
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
          >
            <svg
              className="w-8 h-8 mx-auto mb-3 text-gray-500"
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
            <p className="text-sm text-gray-400 leading-relaxed">
              Drop an image here or{" "}
              <strong className="text-accent font-medium">browse files</strong>
            </p>
            <p className="text-xs text-gray-500 mt-2">
              JPG, PNG, WEBP up to 10 MB
            </p>
            <input
              id="file-upload"
              ref={inputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleFile(e.target.files[0])}
            />
          </div>

          {/* Preview */}
          {preview && (
            <div className="mt-5 animate-fade-in">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={preview}
                alt="Selected file preview"
                className="w-full block rounded-sm border border-gray-800"
              />
              <div className="flex items-center justify-between mt-3 px-4 py-3 bg-gray-800 rounded-sm text-xs text-gray-400">
                <span>{file.name}</span>
                <button
                  className="text-error font-medium px-2 py-1 rounded-sm
                    transition-colors duration-[150ms] ease-default hover:bg-error-bg"
                  onClick={clearFile}
                >
                  Remove
                </button>
              </div>
            </div>
          )}

          {/* Submit */}
          <button
            id="upload-button"
            className="flex items-center justify-center gap-2 w-full mt-5 py-3 px-6
              text-sm font-medium text-white bg-accent rounded-sm
              transition-[background,transform] duration-[150ms] ease-default
              hover:bg-accent-hover hover:-translate-y-px
              active:translate-y-0
              disabled:opacity-disabled disabled:cursor-not-allowed"
            onClick={handleUpload}
            disabled={!file || loading}
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-white/25 border-t-white rounded-full animate-spin" />
                Analyzing
              </>
            ) : (
              "Analyze image"
            )}
          </button>

          {/* Error */}
          {error && (
            <div
              className="flex items-start gap-3 mt-4 px-4 py-3
                bg-error-bg border border-error-border rounded-sm
                text-sm text-error"
              role="alert"
            >
              {error}
            </div>
          )}
        </section>

        {/* Results */}
        {result && (
          <section className="mt-6 animate-slide-up">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-gray-200">Results</h2>
              <span
                className={`inline-flex items-center px-3 py-1 text-xs font-medium rounded-sm ${
                  faceCount > 0
                    ? "bg-success-bg text-success"
                    : "bg-warning-bg text-warning"
                }`}
              >
                {faceCount === 0
                  ? "No faces found"
                  : `${faceCount} face${faceCount > 1 ? "s" : ""} detected`}
              </span>
            </div>

            {faces.length > 0 && (
              <div className="grid gap-2">
                {faces.map((face, i) => (
                  <div
                    className="flex items-center gap-4 px-4 py-3
                      bg-gray-900 border border-gray-800 rounded-sm
                      transition-colors duration-[150ms] ease-default
                      hover:border-gray-700"
                    key={i}
                  >
                    <span
                      className="w-7 h-7 flex items-center justify-center
                        text-xs font-semibold text-accent bg-accent-muted rounded-sm shrink-0"
                    >
                      {i + 1}
                    </span>
                    <div>
                      <div className="text-sm font-medium text-gray-200">
                        Face {i + 1}
                      </div>
                      <div className="text-xs text-gray-500 mt-0.5 font-mono">
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
      <footer className="text-center py-5 text-xs text-gray-600">
        AI Guardian &middot; OpenCV &middot; FastAPI &middot; Next.js
      </footer>
    </div>
  );
}
