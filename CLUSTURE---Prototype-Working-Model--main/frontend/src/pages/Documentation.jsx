import { FileText, Terminal, Code, Database, ShieldAlert, Cpu, Check, Copy } from 'lucide-react'
import { useState } from 'react'
import Footer from '../components/Footer'

function CodeBlock({ code, language = 'bash' }) {
  const [copied, setCopied] = useState(false)

  const copy = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="bg-ink rounded-2xl border border-white/10 overflow-hidden my-4">
      <div className="flex items-center justify-between px-4 py-2 bg-white/5 border-b border-white/10 text-xs text-white/50">
        <span>{language}</span>
        <button
          onClick={copy}
          className="hover:text-mint transition-colors flex items-center gap-1.5 focus:outline-none"
        >
          {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
          <span>{copied ? 'Copied' : 'Copy'}</span>
        </button>
      </div>
      <pre className="p-4 text-xs font-mono text-mint/90 overflow-x-auto leading-relaxed">
        {code}
      </pre>
    </div>
  )
}

export default function Documentation() {
  return (
    <div className="pt-16 min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="bg-plum text-white px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <span className="inline-block bg-mint/20 text-mint text-xs font-semibold px-3 py-1 rounded-full mb-3">
            Developer & API Manual
          </span>
          <h1 className="font-medium text-4xl sm:text-5xl mb-4">Tumor Detector.31 Documentation</h1>
          <p className="text-white/70 text-lg leading-relaxed max-w-2xl">
            API endpoints, local installation, environment dependencies, model tensor contracts, and execution workflows.
          </p>
        </div>
      </div>

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-12 space-y-12">

        {/* ── SECTION 1: ARCHITECTURE & STACK ─────────────────────────── */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-3 flex items-center gap-2">
            <Cpu className="text-plum" size={24} /> 1. System Specifications & Tech Stack
          </h2>
          <p className="text-gray-600 text-sm leading-relaxed mb-4">
            Tumor Detector.31 uses a decoupled client-server micro-architecture where a high-performance React (Vite) single-page client delegates inference payloads to a synchronous Python Flask runtime embedding TensorFlow/Keras.
          </p>
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4">
              <span className="text-xs text-plum font-semibold uppercase">Inference Engine</span>
              <h3 className="font-bold text-gray-900 mt-1">Python 3.10 + TensorFlow</h3>
              <p className="text-gray-500 text-xs mt-1">ResNet50 backbone, Keras HDF5 serialisation, NumPy vectorization.</p>
            </div>
            <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4">
              <span className="text-xs text-plum font-semibold uppercase">API Gateway</span>
              <h3 className="font-bold text-gray-900 mt-1">Flask REST Microservice</h3>
              <p className="text-gray-500 text-xs mt-1">Werkzeug file sanitization, Flask-CORS handling, Multipart streaming.</p>
            </div>
            <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4">
              <span className="text-xs text-plum font-semibold uppercase">User Interface</span>
              <h3 className="font-bold text-gray-900 mt-1">React 18 + Vite 5</h3>
              <p className="text-gray-500 text-xs mt-1">Tailwind CSS v3 design tokens, React Router 6, Lucide icons.</p>
            </div>
          </div>
        </section>

        {/* ── SECTION 2: API SPECIFICATION ────────────────────────────── */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-3 flex items-center gap-2">
            <Code className="text-plum" size={24} /> 2. REST API Specification
          </h2>
          <p className="text-gray-600 text-sm leading-relaxed mb-4">
            The core prediction interface accepts raw image uploads and computes forward passes across four target classification classes.
          </p>

          <div className="border border-gray-200 rounded-2xl p-5 mb-4">
            <div className="flex items-center gap-3 mb-2">
              <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-1 rounded-md">POST</span>
              <span className="font-mono text-sm font-semibold text-gray-800">/api/detect</span>
            </div>
            <p className="text-gray-500 text-xs">Processes a single brain MRI image and returns classification label with probability distribution.</p>

            <h4 className="text-xs font-semibold text-gray-700 mt-4 uppercase">Request Headers</h4>
            <p className="font-mono text-xs text-gray-600 bg-gray-50 p-2 rounded-lg mt-1">Content-Type: multipart/form-data</p>

            <h4 className="text-xs font-semibold text-gray-700 mt-4 uppercase">Form Fields</h4>
            <table className="w-full text-xs text-left mt-1 border-t border-gray-100">
              <thead>
                <tr className="text-gray-400">
                  <th className="py-2">Field</th>
                  <th className="py-2">Type</th>
                  <th className="py-2">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <tr>
                  <td className="py-2 font-mono font-medium text-plum">file</td>
                  <td className="py-2 text-gray-500">Binary Image</td>
                  <td className="py-2 text-gray-600">JPG, PNG or WebP cranial MRI scan (Max: 10MB)</td>
                </tr>
              </tbody>
            </table>

            <h4 className="text-xs font-semibold text-gray-700 mt-5 uppercase">Success Response (200 OK)</h4>
            <CodeBlock language="json" code={`{
  "result": "Tumor: glioma",
  "label": "glioma",
  "confidence": 0.9743,
  "probabilities": {
    "glioma": 0.9743,
    "meningioma": 0.0121,
    "notumor": 0.0089,
    "pituitary": 0.0047
  }
}`} />

            <h4 className="text-xs font-semibold text-gray-700 mt-3 uppercase">Error Response (400 Bad Request)</h4>
            <CodeBlock language="json" code={`{
  "error": "No file part"
}`} />
          </div>
        </section>

        {/* ── SECTION 3: SETUP INSTRUCTIONS ───────────────────────────── */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-3 flex items-center gap-2">
            <Terminal className="text-plum" size={24} /> 3. Local Installation & Deployment
          </h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            Follow these commands to configure the development workspace and run both servers simultaneously.
          </p>

          <h3 className="font-semibold text-gray-800 text-sm mt-4">Step 1: Python Virtual Environment & Flask Gateway</h3>
          <CodeBlock code={`# 1. Install Python packages
pip install flask flask-cors tensorflow keras numpy werkzeug

# 2. Run Flask backend (starts on http://127.0.0.1:5000)
python main.py`} />

          <h3 className="font-semibold text-gray-800 text-sm mt-6">Step 2: Frontend Client (Vite Dev Server)</h3>
          <CodeBlock code={`# 1. Navigate to frontend directory
cd frontend

# 2. Install Node dependencies
npm install

# 3. Launch Vite client (starts on http://localhost:5173)
npm run dev`} />
        </section>

        {/* ── SECTION 4: MODEL TENSOR SPECS ───────────────────────────── */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-3 flex items-center gap-2">
            <Database className="text-plum" size={24} /> 4. Tensor Preprocessing & Output Contract
          </h2>
          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 text-sm text-gray-700 space-y-3">
            <div className="flex justify-between items-center py-1 border-b border-gray-200">
              <span className="text-gray-500 font-medium">Input Tensor Geometry</span>
              <span className="font-mono text-plum font-semibold">(1, 224, 224, 3)</span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-gray-200">
              <span className="text-gray-500 font-medium">Interpolation Method</span>
              <span className="font-mono text-gray-900">Bilinear / Bicubic Resampling</span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-gray-200">
              <span className="text-gray-500 font-medium">Scalar Normalization</span>
              <span className="font-mono text-gray-900">x / 255.0 -&gt; [0.0, 1.0]</span>
            </div>
            <div className="flex justify-between items-center py-1">
              <span className="text-gray-500 font-medium">Output Softmax Vector</span>
              <span className="font-mono text-plum font-semibold">['glioma', 'meningioma', 'notumor', 'pituitary']</span>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  )
}
