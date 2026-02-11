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

import os
import cv2
import numpy as np

# ── Load known faces from DB ────────────────────────────
KNOWN_FACES_DIR = "missing_faces_db"
known_face_names = {}  # {id: name}
recognizer = None

# Initialize Face Detector (Haar) again for detection
face_cascade = cv2.CascadeClassifier(
    cv2.data.haarcascades + "haarcascade_frontalface_default.xml"
)

def train_model():
    global recognizer, known_face_names
    
    if not os.path.exists(KNOWN_FACES_DIR):
        os.makedirs(KNOWN_FACES_DIR)
        print(f"⚠️ Created {KNOWN_FACES_DIR} directory (empty)")
        return

    print("🔄 Training Recognition Model...")
    faces = []
    ids = []
    current_id = 1

    for filename in os.listdir(KNOWN_FACES_DIR):
        if filename.endswith((".jpg", ".jpeg", ".png")):
            path = os.path.join(KNOWN_FACES_DIR, filename)
            try:
                # Load image in grayscale
                img = cv2.imread(path, cv2.IMREAD_GRAYSCALE)
                if img is None:
                    continue
                
                # Detect faces in training image to crop exactly
                faces_rects = face_cascade.detectMultiScale(img, 1.1, 4)
                
                for (x, y, w, h) in faces_rects:
                    roi = img[y:y+h, x:x+w]
                    faces.append(roi)
                    ids.append(current_id)
                    
                    # Map ID to filename (without extension)
                    name = os.path.splitext(filename)[0]
                    known_face_names[current_id] = name
                    print(f"✅ Trained on: {name} (ID: {current_id})")
                    
                    # We only need one good face per file usually, but robust handles multiple
                    break 
                current_id += 1
            except Exception as e:
                print(f"❌ Error training {filename}: {e}")

    if faces:
        # Create and train LBPH Recognizer
        recognizer = cv2.face.LBPHFaceRecognizer_create()
        recognizer.train(faces, np.array(ids))
        print(f"🎯 Model trained with {len(ids)} faces.")
    else:
        print("⚠️ No valid training data found. Recognition will be disabled.")

# Train on startup
train_model()

@app.get("/")
def home():
    return {"message": "AI Guardian ML Service is Online 🛡️"}


@app.get("/health")
def health():
    return {
        "status": "ok",
        "model": "LBPH Face Recognizer (OpenCV)",
        "known_faces": len(known_face_names)
    }


@app.post("/analyze")
async def analyze(request: Request):
    raw = await request.body()
    npimg = np.frombuffer(raw, np.uint8)
    img = cv2.imdecode(npimg, cv2.IMREAD_COLOR)

    if img is None:
        return {"error": "Could not decode image"}

    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

    # Detect faces
    faces = face_cascade.detectMultiScale(
        gray,
        scaleFactor=1.1,
        minNeighbors=5,
        minSize=(30, 30)
    )

    results = []

    for (x, y, w, h) in faces:
        # Default
        name = "Unknown"
        is_match = False
        confidence = 0.0

        if recognizer:
            roi_gray = gray[y:y+h, x:x+w]
            try:
                # predict() returns (label, confidence_distance)
                # Lower confidence means better match (distance)
                label, distance = recognizer.predict(roi_gray)
                
                # Setup threshold (usually < 100 is a match, < 50 is strong)
                if distance < 85: 
                    name = known_face_names.get(label, "Unknown")
                    is_match = True
                    # Convert distance to % confidence (roughly)
                    confidence = max(0, 100 - distance)
                else:
                    confidence = max(0, 100 - distance)
            except Exception as e:
                print(f"Prediction error: {e}")

        results.append({
            "face_box": [int(x), int(y), int(w), int(h)],
            "recognition": {
                "match": is_match,
                "name": name,
                "confidence": round(confidence, 2)
            }
        })

    return {
        "faces_detected": len(results),
        "results": results,
        "matches_found": len([r for r in results if r["recognition"]["match"]])
    }
