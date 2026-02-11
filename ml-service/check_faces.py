import cv2
import os

DB_DIR = "missing_faces_db"
face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')

print(f"🔍 Checking faces in '{DB_DIR}'...")

if not os.path.exists(DB_DIR):
    print(f"❌ Directory '{DB_DIR}' not found!")
    exit()

files = os.listdir(DB_DIR)
if not files:
    print("❌ No files found in directory.")

for f in files:
    path = os.path.join(DB_DIR, f)
    print(f"\n📂 File: {f}")
    
    img = cv2.imread(path)
    if img is None:
        print("   ❌ Failed to load image. Corrupt or invalid format?")
        continue
        
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    faces = face_cascade.detectMultiScale(gray, 1.1, 4)
    
    if len(faces) == 0:
        print("   ⚠️  No faces detected (Try cropping closer or better lighting)")
    else:
        print(f"   ✅ Found {len(faces)} face(s)")
