from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
import cv2
import numpy as np

app = FastAPI(title="AI Guardian ML Service")

# ── CORS ────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Load pre-trained Haar Cascade model ─────────────────
face_cascade = cv2.CascadeClassifier(
    cv2.data.haarcascades + "haarcascade_frontalface_default.xml"
)


@app.get("/")
def home():
    return {"message": "ML service is alive 🤖"}


@app.get("/health")
def health():
    return {"status": "ok", "model": "haarcascade_frontalface_default"}


@app.post("/analyze")
async def analyze(request: Request):
    raw = await request.body()
    npimg = np.frombuffer(raw, np.uint8)
    img = cv2.imdecode(npimg, cv2.IMREAD_COLOR)

    if img is None:
        return {"error": "Could not decode image"}

    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

    # detect faces
    faces = face_cascade.detectMultiScale(
        gray, scaleFactor=1.1, minNeighbors=4
    )

    results = []
    for (x, y, w, h) in faces:
        results.append({"face_box": [int(x), int(y), int(w), int(h)]})

    return {"faces_detected": len(faces), "results": results}
