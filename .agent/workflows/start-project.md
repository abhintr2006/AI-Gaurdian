---
description: Start the entire AI-Guardian stack (ML Service, Backend, and Frontend)
---

This workflow starts all three components of the application. You will need to run these in separate terminals or allow me to run them in the background.

## 1. Start ML Service (Python/FastAPI)

```bash
cd ml-service
# python -m venv venv
# .\venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

## 2. Start Backend (Node.js/Express)

```bash
cd backend
npm install
npm run dev
```

## 3. Start Frontend (Next.js)

```bash
cd frontend-next
npm install
npm run dev
```
