# Tumor Detector.31 — Render Backend Deployment Guide

Tere system mein **`render_backend`** folder ready hai!
Path: `CLUSTURE---Prototype-Working-Model--main/render_backend`

---

## 🚀 Steps to Deploy on Render (Free, 2 Minutes):

### Step 1: GitHub pe Push karo
1. Is `render_backend` folder ko ya toh ek new GitHub repo bana lo, ya fir apne existing repo mein push kar do.

### Step 2: Render.com Setup
1. [dashboard.render.com](https://dashboard.render.com) pe jao.
2. Click **New +** ➔ **Web Service**.
3. Apna GitHub repository select karo.
4. Settings mein yeh daalo:
   - **Name:** `tumordetect-backend`
   - **Root Directory:** `render_backend` (agar alag repo hai toh blank chhod do)
   - **Environment:** `Python 3`
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `gunicorn app:app`
   - **Instance Type:** Free

5. Click **Create Web Service**.

---

## 🔗 Result:
Render tujhe ek live URL dega, jaise:
`https://tumordetect-backend.onrender.com`

---

## 🌐 Vercel Frontend se Connect kaise kare:
Frontend folder mein `Detect.jsx` mein line 133 par:
```javascript
// Local ki jagah apna Render URL daal do:
const res = await fetch('https://tumordetect-backend.onrender.com/api/detect', {
  method: 'POST',
  body: fd
})
```
Bass! Ab tera frontend Vercel par aur backend Render par 24/7 bina kisi crash ke live rahega!
