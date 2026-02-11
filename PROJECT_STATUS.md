# AI Guardian - Project Status

**Date:** 2026-02-11
**Version:** 0.1.0 (Prototype)

## 1. Architecture Overview

The project follows a 3-tier architecture:

- **Frontend**: Next.js 16 (React 19) - `http://localhost:3000`
- **Backend**: Express 5 (Node.js) - `http://localhost:5000`
- **ML Service**: FastAPI (Python) - `http://localhost:8000`

## 2. Current Features

### ✅ Implemented

- **Face Detection**: Upload an image to detect faces using OpenCV Haar Cascades.
  - _Optimization_: Tuned parameters (scale=1.2, minNeighbors=6) to reduce false positives.
  - _Filtering_: Automatically ignores noise/small objects (<15% of max face size).
- **Drag & Drop UI**: Modern dark-themed interface for file uploads.
- **API Relay**: Backend proxies files from Frontend to ML Service securely.
- **Docker/Env**: Basic environment handling via `.env`.

### 🚧 In Progress / Found in File System

- **Missing Persons Database**: Directory `ml-service/missing_faces_db` exists with 2 samples (`child1.jpj`, `child2.jpj`).
  - _Status_: Feature not yet implemented in code.
  - _Next Step_: Implement face recognition to match uploaded faces against this database.

## 3. Technology Stack

- **Languages**: JavaScript (Node/React), Python 3.10+
- **ML Libraries**: `opencv-python-headless`, `numpy`
- **Styling**: TailwindCSS

## 4. Known Issues / To-Do

- [ ] **Face Recognition**: Compare uploaded face with `missing_faces_db` images.
- [ ] **Bounding Boxes**: Visual feedback on the image (currently only shows coordinates).
- [ ] **Database**: No persistent storage for alerts/logs yet.
- [ ] **Data Cleanup**: Rename `.jpj` files to `.jpg` if they are standard images.
