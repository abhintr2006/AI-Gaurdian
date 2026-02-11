# 🛡️ AI Guardian

AI-powered surveillance & safety system — upload images and detect faces using machine learning.

## Architecture

```
Frontend (React :3000) → Backend (Express :5000) → ML Service (FastAPI :8000)
```

## Quick Start

### 1. ML Service (Python)

```bash
cd ml-service
python -m venv venv
venv\Scripts\activate        # Windows
pip install -r requirements.txt
uvicorn main:app --reload
```

### 2. Backend (Node.js)

```bash
cd backend
npm install
cp .env.example .env         # configure environment
npm run dev
```

### 3. Frontend (React)

```bash
cd frontend
npm install
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `5000` | Backend server port |
| `ML_SERVICE_URL` | `http://127.0.0.1:8000` | ML service base URL |

## Tech Stack

- **Frontend**: React 19, Axios
- **Backend**: Express 5, Multer, Node-Fetch
- **ML Service**: FastAPI, OpenCV, NumPy
