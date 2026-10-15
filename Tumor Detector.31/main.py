import os
import time
import uuid
import numpy as np
from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
from werkzeug.utils import secure_filename
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.image import load_img, img_to_array

# ── App setup ────────────────────────────────────────────────────────────────
app = Flask(__name__, static_folder="frontend/dist", template_folder="templates")
CORS(app)

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER

# Exact dataset class order
class_labels = ["glioma", "meningioma", "notumor", "pituitary"]

# ── Load Real AI Model ───────────────────────────────────────────────────────
print("Initializing Tumor Detector.31 AI Engine...")
model_path = "models/tumor_detector.31.h5"
if not os.path.exists(model_path):
    model_path = "models/model98_57res_97_76.h5"

print(f"Loading weights from {model_path}...")
model = load_model(model_path, compile=False)
print("✅ Real AI Model loaded successfully!")


# ── Prediction Function (100% Real Model Only) ──────────────────────────────
def predict_tumor(image_path):
    t0 = time.time()

    # Preprocess image for 224x224 ResNet50
    img = load_img(image_path, target_size=(224, 224))
    img_array = img_to_array(img) / 255.0
    img_array = np.expand_dims(img_array, axis=0)

    # Thread-safe fast direct inference (bypasses Flask thread lock)
    prediction = model(img_array, training=False).numpy()
    probs = prediction[0]

    predicted_index = int(np.argmax(probs))
    label = class_labels[predicted_index]
    confidence = float(probs[predicted_index])
    result = "No Tumor" if label == "notumor" else f"Tumor: {label}"
    probabilities = {cls: float(probs[i]) for i, cls in enumerate(class_labels)}

    print(f"Prediction: {result} ({confidence*100:.2f}%) in {time.time() - t0:.3f}s")
    return result, label, confidence, probabilities


# ── Routes ────────────────────────────────────────────────────────────────────
@app.route("/", methods=["GET"])
def home():
    dist_dir = os.path.join(os.path.dirname(__file__), "frontend", "dist")
    if os.path.exists(os.path.join(dist_dir, "index.html")):
        return send_from_directory(dist_dir, "index.html")
    return send_from_directory("static", "index.html") if os.path.exists("static/index.html") else ("Frontend available on port 5173", 200)


@app.route("/assets/<path:filename>")
def serve_dist_assets(filename):
    dist_assets = os.path.join(os.path.dirname(__file__), "frontend", "dist", "assets")
    return send_from_directory(dist_assets, filename)


@app.route("/<path:filename>")
def serve_dist_root(filename):
    dist_dir = os.path.join(os.path.dirname(__file__), "frontend", "dist")
    file_path = os.path.join(dist_dir, filename)
    if os.path.exists(file_path):
        return send_from_directory(dist_dir, filename)
    if os.path.exists(os.path.join(dist_dir, "index.html")):
        return send_from_directory(dist_dir, "index.html")
    return ("Not Found", 404)


@app.route("/api/detect", methods=["POST"])
def detect_api():
    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files["file"]
    if file.filename == "":
        return jsonify({"error": "No file selected"}), 400

    safe_name = f"{uuid.uuid4().hex}_{secure_filename(file.filename)}"
    filepath = os.path.join(app.config["UPLOAD_FOLDER"], safe_name)
    file.save(filepath)

    try:
        result, label, confidence, probabilities = predict_tumor(filepath)
        return jsonify({
            "result": result,
            "label": label,
            "confidence": confidence,
            "probabilities": probabilities,
        })
    except Exception as err:
        print("Prediction error:", err)
        return jsonify({"error": str(err)}), 500


if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000, debug=False)