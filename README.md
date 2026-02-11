# 🛡️ AI Guardian

AI-powered surveillance & safety system — upload images and detect faces using machine learning.

## Architecture

```
Frontend (Next.js :3000) → Backend (Express :5000) → ML Service (FastAPI :8000)
```

## Quick Start

### 1. ML Service (Python)

```bash
cd ml-service
python -m venv venv
venv\Scripts\activate        # Windows
pip install -r requirements.txt
uvicorn main:app --host 127.0.0.1 --port 8000
```

### 2. Backend (Node.js)

```bash
cd backend
npm install
cp .env.example .env         # configure environment
npm run dev
```

### 3. Frontend (Next.js)

```bash
cd frontend-next
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

> **Note:** Once you restart your PC, you can rename `frontend-next` to `frontend` using:
> ```bash
> ren frontend-next frontend
> ```

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `5000` | Backend server port |
| `ML_SERVICE_URL` | `http://127.0.0.1:8000` | ML service base URL |
| `NEXT_PUBLIC_API_URL` | `http://localhost:5000` | Backend URL (frontend) |

## Tech Stack

- **Frontend**: Next.js 16, React 19
- **Backend**: Express 5, Multer, Node-Fetch
- **ML Service**: FastAPI, OpenCV, NumPy
