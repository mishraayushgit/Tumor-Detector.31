import os
import time
import uuid
import numpy as np
from flask import Flask, jsonify, request
from flask_cors import CORS
from werkzeug.utils import secure_filename
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.image import load_img, img_to_array

app = Flask(__name__)
# Enable CORS for all domains so Vercel frontend can call it smoothly
CORS(app, resources={r"/*": {"origins": "*"}})

UPLOAD_FOLDER = "/tmp/uploads" if os.name != "nt" else "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER

class_labels = ["glioma", "meningioma", "notumor", "pituitary"]

# Load model
model = None
model_path = "models/tumor_detector.31.h5"
if not os.path.exists(model_path):
    model_path = "models/model98_57res_97_76.h5"
if not os.path.exists(model_path):
    model_path = "../models/tumor_detector.31.h5"

if os.path.exists(model_path):
    try:
        model = load_model(model_path, compile=False)
        print(f"TensorFlow model loaded successfully from {model_path}.")
    except Exception as e:
        print("Error loading model:", e)
        model = None


def predict_tumor(image_path):
    t0 = time.time()
    img = load_img(image_path, target_size=(224, 224))
    img_array = img_to_array(img) / 255.0
    img_array = np.expand_dims(img_array, axis=0)

    prediction = model(img_array, training=False).numpy()
    probs = prediction[0]

    predicted_index = int(np.argmax(probs))
    label = class_labels[predicted_index]
    confidence = float(probs[predicted_index])
    result = "No Tumor" if label == "notumor" else f"Tumor: {label}"
    probabilities = {cls: float(probs[i]) for i, cls in enumerate(class_labels)}

    print(f"Prediction done in {time.time() - t0:.3f}s -> {result} ({confidence*100:.1f}%)")
    return result, label, confidence, probabilities


@app.route("/", methods=["GET"])
def health():
    return jsonify({
        "status": "online",
        "service": "Tumor Detector.31 AI Backend",
        "endpoints": {
            "detect": "POST /api/detect (form-data: 'file')"
        }
    })


@app.route("/api/detect", methods=["POST"])
def detect_api():
    if "file" not in request.files:
        return jsonify({"error": "No file part"}), 400

    file = request.files["file"]
    if file.filename == "":
        return jsonify({"error": "No selected file"}), 400

    safe_name = f"{uuid.uuid4().hex}_{secure_filename(file.filename)}"
    filepath = os.path.join(app.config["UPLOAD_FOLDER"], safe_name)
    file.save(filepath)

    try:
        result, label, confidence, probabilities = predict_tumor(filepath)
        return jsonify({
            "result": result,
            "label": label,
            "confidence": confidence,
            "probabilities": probabilities
        })
    except Exception as err:
        return jsonify({"error": str(err)}), 500


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)
