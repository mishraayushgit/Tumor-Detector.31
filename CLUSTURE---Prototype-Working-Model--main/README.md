# Tumor Detector.31 — AI Brain MRI Classifier

> **Educational prototype. Not a medical diagnosis.**  
> Always consult a qualified radiologist for any health concerns.

---

## Project Structure

```
.
├── main.py                        # Flask backend + REST API
├── models/
│   └── model98_57res_97_76.h5    # Pre-trained ResNet50 model (do not retrain)
├── uploads/                       # Uploaded scans (auto-created)
├── frontend/                      # React + Vite + Tailwind frontend
│   ├── src/
│   │   ├── App.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Detect.jsx
│   │   │   └── About.jsx
│   │   └── components/
│   │       ├── Navbar.jsx
│   │       ├── Footer.jsx
│   │       └── Logo.jsx
│   ├── vite.config.js             # Proxy /api → http://127.0.0.1:5000
│   ├── tailwind.config.js
│   └── package.json
└── README.md
```

---

## Backend Setup (Flask)

### Prerequisites
- Python 3.10+
- pip

### Install dependencies

```bash
pip install flask flask-cors tensorflow keras numpy werkzeug
```

### Run the server

```bash
python main.py
```

Flask starts on **http://127.0.0.1:5000**  
You'll see `Model ready.` in the console when warm-up completes.

### API endpoint

| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/detect` | Upload image → get prediction JSON |

**Response format:**
```json
{
  "result": "Tumor: glioma",
  "label": "glioma",
  "confidence": 0.9743,
  "probabilities": {
    "glioma": 0.9743,
    "meningioma": 0.0121,
    "notumor": 0.0089,
    "pituitary": 0.0047
  }
}
```

---

## Frontend Setup (React + Vite)

### Prerequisites
- Node.js 18+ / 20+

### Install and run

```bash
cd frontend
npm install
npm run dev
```

Vite starts on **http://localhost:5173**  
API calls to `/api/*` are proxied automatically to the Flask backend.

### Build for production

```bash
cd frontend
npm run build
```

Static files are output to `frontend/dist/`.

---

## Pages

| Route | Description |
|-------|-------------|
| `/` | Home — hero, info band, steps, audience, contact |
| `/detect` | Upload MRI → AI result with confidence & probabilities |
| `/about` | Dataset, architecture, training params, results |

---

## What you need to supply

| Item | Where |
|------|-------|
| Hero MRI image | Replace the placeholder in `Home.jsx` `MRIPlaceholder` component |
| Confusion matrix image | Replace placeholder in `About.jsx` |
| Sample test MRI scan | For testing the `/detect` page end-to-end |

---

## Model info

- **Architecture:** ResNet50 + GlobalAveragePooling → Dropout(0.4) → Dense(128) → Dropout(0.2) → Dense(4, Softmax)
- **Classes (in order):** `['glioma', 'meningioma', 'notumor', 'pituitary']`
- **Input:** 224 × 224 × 3, normalized to [0, 1]
- **Training accuracy:** 98.57%
- **Validation accuracy:** 97.76%
- **Dataset:** Kaggle Brain Tumor MRI Dataset (~7,023 images)

---

## Changes made to main.py

1. Removed duplicate `load_model` import
2. Removed stray `import tensorflow` / `print(tf.__version__)` after `app.run()`
3. Added model warm-up dummy predict at startup
4. Added `flask-cors` (CORS enabled for all routes)
5. `/api/detect` now returns `label`, `confidence` (float), and `probabilities` dict
6. Uploads use `secure_filename` + UUID prefix
7. `debug=False`

---

*Educational prototype built with Flask, TensorFlow/Keras, React, Vite, and Tailwind CSS.*
