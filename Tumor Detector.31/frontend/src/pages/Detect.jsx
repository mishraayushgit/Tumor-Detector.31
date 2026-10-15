import { useState, useRef, useCallback, useEffect } from 'react'
import { Upload, RefreshCw, AlertTriangle, CheckCircle2, XCircle, Loader2 } from 'lucide-react'
import Footer from '../components/Footer'

// Smart URL Resolver (Handles both root URL and /api/detect automatically)
const RAW_URL = import.meta.env.VITE_API_URL || 'https://tumor-detector-31-lite.onrender.com'
const CLEAN_BASE = RAW_URL.replace(/\/+$/, '')
const API_URL = CLEAN_BASE.endsWith('/api/detect') ? CLEAN_BASE : `${CLEAN_BASE}/api/detect`

const CLASS_LABELS = ['glioma', 'meningioma', 'notumor', 'pituitary']
const DISPLAY_NAMES = { 
  glioma: 'Glioma', 
  meningioma: 'Meningioma', 
  notumor: 'No Tumor', 
  pituitary: 'Pituitary' 
}
const STATUS_MESSAGES = [
  'Uploading scan…',
  'Connecting to AI Cloud Engine…',
  'Running ResNet50 analysis…',
  'Finalizing diagnosis result…'
]
const TIMEOUT_MS = 60_000
const MAX_SIZE_MB = 10
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']

/* ── Skeleton card ─────────────────────────────────────────────────────── */
function SkeletonCard() {
  return (
    <div className="animate-pulse bg-gray-100 rounded-2xl p-6 mt-6 space-y-4">
      <div className="h-4 bg-gray-200 rounded w-1/3" />
      <div className="h-8 bg-gray-200 rounded w-1/2" />
      <div className="h-3 bg-gray-200 rounded w-full" />
      <div className="h-3 bg-gray-200 rounded w-5/6" />
    </div>
  )
}

/* ── Probability bar ───────────────────────────────────────────────────── */
function ProbBar({ label, value, highlight }) {
  const pct = (value * 100).toFixed(1)
  return (
    <div className="flex items-center gap-3">
      <span className={`text-sm w-28 shrink-0 ${highlight ? 'font-semibold text-gray-900' : 'text-gray-500'}`}>
        {DISPLAY_NAMES[label]}
      </span>
      <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
        <div
          className={`h-2 rounded-full transition-all duration-700 ${highlight ? 'bg-indigo-600' : 'bg-gray-300'}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className={`text-sm w-12 text-right ${highlight ? 'font-semibold text-gray-900' : 'text-gray-400'}`}>
        {pct}%
      </span>
    </div>
  )
}

/* ── Result card ───────────────────────────────────────────────────────── */
function ResultCard({ data, onReset }) {
  const isTumor = data.label !== 'notumor'
  const confPct = (data.confidence * 100).toFixed(1)
  const uncertain = data.confidence < 0.60

  return (
    <div id="result-card" className="mt-8 bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-5">
      {/* Badge */}
      <div className="flex items-center gap-3">
        {isTumor
          ? <span className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-700 font-semibold text-sm px-3 py-1 rounded-full"><AlertTriangle size={14}/>Tumor detected</span>
          : <span className="inline-flex items-center gap-1.5 bg-green-50 text-green-700 font-semibold text-sm px-3 py-1 rounded-full"><CheckCircle2 size={14}/>No Tumor Detected</span>
        }
        {uncertain && (
          <span className="text-xs text-orange-500 font-medium">⚠ Result uncertain (confidence &lt; 60%)</span>
        )}
      </div>

      {/* Main classification */}
      <div>
        <p className="text-xs text-gray-400 uppercase tracking-wider font-medium">Classification</p>
        <p className="text-3xl font-bold text-gray-900 mt-1">{DISPLAY_NAMES[data.label]}</p>
        <p className="text-sm text-gray-500 mt-0.5">
          Confidence: <span className="font-semibold text-gray-800">{confPct}%</span>
        </p>
      </div>

      {/* Probability breakdown */}
      {data.probabilities && (
        <div className="space-y-2 pt-2 border-t border-gray-100">
          <p className="text-xs text-gray-400 uppercase tracking-wider font-medium mb-3">Confidence Breakdown</p>
          {CLASS_LABELS.map(cls => (
            <ProbBar
              key={cls}
              label={cls}
              value={data.probabilities[cls] ?? 0}
              highlight={cls === data.label}
            />
          ))}
        </div>
      )}

      {/* Reset */}
      <div className="pt-2">
        <button
          onClick={onReset}
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 font-medium transition-colors"
        >
          <RefreshCw size={14} /> Analyze another scan
        </button>
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════════════ */
export default function Detect() {
  const [phase, setPhase]     = useState('idle')        // idle | preview | loading | result | error
  const [file, setFile]       = useState(null)
  const [preview, setPreview] = useState(null)
  const [result, setResult]   = useState(null)
  const [errorMsg, setErrorMsg] = useState('')
  const [statusIdx, setStatusIdx] = useState(0)
  const [dragging, setDragging] = useState(false)
  const fileRef = useRef(null)
  const statusTimer = useRef(null)
  const abortRef = useRef(null)

  /* rotating status text */
  useEffect(() => {
    if (phase === 'loading') {
      statusTimer.current = setInterval(() => {
        setStatusIdx(i => (i + 1) % STATUS_MESSAGES.length)
      }, 3000)
    }
    return () => clearInterval(statusTimer.current)
  }, [phase])

  /* scroll to result */
  useEffect(() => {
    if (phase === 'result') {
      document.getElementById('result-card')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }, [phase])

  const validate = f => {
    if (!ALLOWED_TYPES.includes(f.type)) return 'Only JPG, PNG, or WebP images are accepted.'
    if (f.size > MAX_SIZE_MB * 1024 * 1024) return `File too large. Max ${MAX_SIZE_MB} MB.`
    return null
  }

  const loadFile = f => {
    const err = validate(f)
    if (err) { setErrorMsg(err); setPhase('error'); return }
    setFile(f)
    setPreview(URL.createObjectURL(f))
    setPhase('preview')
  }

  const handleDrop = useCallback(e => {
    e.preventDefault(); setDragging(false)
    const f = e.dataTransfer.files[0]
    if (f) loadFile(f)
  }, [])

  const handleDragOver = e => { e.preventDefault(); setDragging(true) }
  const handleDragLeave = () => setDragging(false)

  const reset = () => {
    setPhase('idle'); setFile(null); setPreview(null); setResult(null)
    setErrorMsg(''); setStatusIdx(0)
    if (fileRef.current) fileRef.current.value = ''
    abortRef.current?.abort()
  }

  const detect = async () => {
    setPhase('loading'); setStatusIdx(0)
    const ctrl = new AbortController()
    abortRef.current = ctrl
    const timeoutId = setTimeout(() => ctrl.abort(), TIMEOUT_MS)

    try {
      const fd = new FormData()
      fd.append('file', file)
      
      const res = await fetch(API_URL, {
        method: 'POST',
        body: fd,
        signal: ctrl.signal
      })

      clearTimeout(timeoutId)
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body.error || `Server error ${res.status}`)
      }
      const data = await res.json()
      setResult(data)
      setPhase('result')
    } catch (err) {
      clearTimeout(timeoutId)
      if (err.name === 'AbortError') {
        setErrorMsg('Request timed out. The cloud server is waking up — please click Try Again in 10 seconds.')
      } else {
        setErrorMsg(err.message || 'Something went wrong. Please check your connection and try again.')
      }
      setPhase('error')
    }
  }

  /* ── Render ─────────────────────────────────────────────────────────── */
  return (
    <div className="pt-16 min-h-screen bg-gray-50 flex flex-col">
      <main className="flex-1 flex flex-col items-center px-4 py-12">
        <div className="w-full max-w-xl">
          <h1 className="text-gray-900 font-medium text-4xl mb-2 text-center">Detect Brain Tumor</h1>
          <p className="text-gray-500 text-center mb-8 text-sm">
            Upload a brain MRI scan and get an AI classification with confidence score.
          </p>

          {/* Upload card */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => phase !== 'loading' && fileRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
              dragging
                ? 'border-indigo-600 bg-indigo-50/50'
                : 'border-gray-300 bg-white hover:border-gray-400'
            } ${phase === 'loading' ? 'pointer-events-none opacity-60' : ''}`}
          >
            <input
              ref={fileRef}
              type="file"
              accept=".jpg,.jpeg,.png,.webp"
              className="hidden"
              onChange={e => e.target.files[0] && loadFile(e.target.files[0])}
            />

            {preview ? (
              <div className="flex flex-col items-center gap-3">
                <img
                  src={preview}
                  alt="MRI preview"
                  className="max-h-56 rounded-xl object-contain shadow-sm border border-gray-100"
                />
                <p className="text-xs text-gray-400">{file?.name}</p>
                <span className="text-xs text-indigo-600 underline">Click or drop to replace image</span>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3 py-6">
                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                  <Upload size={22} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800">
                    Drop your MRI scan here, or <span className="text-indigo-600">browse</span>
                  </p>
                  <p className="text-xs text-gray-400 mt-1">Supports JPG, PNG, WebP up to 10 MB</p>
                </div>
              </div>
            )}
          </div>

          {/* Action buttons */}
          {phase === 'preview' && (
            <button
              onClick={detect}
              className="mt-5 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 rounded-xl transition-colors shadow-sm flex items-center justify-center gap-2"
            >
              Analyze Scan with AI
            </button>
          )}

          {phase === 'loading' && (
            <div className="mt-6 flex flex-col items-center gap-3 text-center">
              <Loader2 className="animate-spin text-indigo-600" size={32} />
              <p className="text-sm text-gray-600 font-medium">{STATUS_MESSAGES[statusIdx]}</p>
              <SkeletonCard />
            </div>
          )}

          {phase === 'error' && (
            <div className="mt-5 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
              <XCircle className="text-red-500 shrink-0 mt-0.5" size={18} />
              <div className="flex-1">
                <p className="text-sm font-medium text-red-800">Error</p>
                <p className="text-xs text-red-600 mt-0.5">{errorMsg}</p>
              </div>
              <button onClick={reset} className="text-xs font-semibold text-red-700 hover:underline">
                Try Again
              </button>
            </div>
          )}

          {phase === 'result' && result && (
            <ResultCard data={result} onReset={reset} />
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
