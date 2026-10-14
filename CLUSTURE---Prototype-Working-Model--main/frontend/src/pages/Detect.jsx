import { useState, useRef, useCallback, useEffect } from 'react'
import { Upload, RefreshCw, AlertTriangle, CheckCircle2, XCircle, Loader2 } from 'lucide-react'
import Footer from '../components/Footer'

const CLASS_LABELS = ['glioma', 'meningioma', 'notumor', 'pituitary']
const DISPLAY_NAMES = { glioma: 'Glioma', meningioma: 'Meningioma', notumor: 'No Tumor', pituitary: 'Pituitary' }
const STATUS_MESSAGES = ['Uploading scan…', 'Analyzing scan…', 'Preparing result…']
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
          className={`h-2 rounded-full transition-all duration-700 ${highlight ? 'bg-plum' : 'bg-gray-300'}`}
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
          ? <span className="inline-flex items-center gap-1.5 bg-amber/10 text-amber font-semibold text-sm px-3 py-1 rounded-full"><AlertTriangle size={14}/>Tumor detected</span>
          : <span className="inline-flex items-center gap-1.5 bg-success/10 text-green-700 font-semibold text-sm px-3 py-1 rounded-full"><CheckCircle2 size={14}/>No Tumor</span>
        }
        {uncertain && (
          <span className="text-xs text-orange-500 font-medium">⚠ Result uncertain (confidence &lt; 60%)</span>
        )}
      </div>

      {/* Headline */}
      <div>
        <h2 className="text-gray-900 font-semibold text-2xl">{data.result}</h2>
        <p className="text-gray-500 text-sm mt-1">
          {isTumor
            ? `The scan indicates the presence of a ${DISPLAY_NAMES[data.label]} tumor. Please consult a medical professional.`
            : 'No signs of a tumor were found in this scan.'}
        </p>
      </div>

      {/* Confidence bar */}
      <div>
        <div className="flex justify-between text-sm mb-1">
          <span className="text-gray-500">Confidence</span>
          <span className="font-semibold text-gray-900">{confPct}%</span>
        </div>
        <div className="bg-gray-100 rounded-full h-2.5 overflow-hidden">
          <div
            className={`h-2.5 rounded-full transition-all duration-700 ${isTumor ? 'bg-amber' : 'bg-success'}`}
            style={{ width: `${confPct}%` }}
          />
        </div>
      </div>

      {/* All 4 probabilities */}
      <div className="space-y-2.5">
        <h3 className="text-sm font-semibold text-gray-700 mb-2">All class probabilities</h3>
        {CLASS_LABELS.map(cls => (
          <ProbBar key={cls} label={cls} value={data.probabilities[cls]} highlight={cls === data.label} />
        ))}
      </div>

      {/* Disclaimer */}
      <p className="text-xs text-gray-400 leading-relaxed border-t border-gray-100 pt-4">
        <strong>Educational prototype. Not a medical diagnosis.</strong>{' '}
        Consult a qualified radiologist for any health concerns. This tool is for educational purposes only.
      </p>

      {/* Reset */}
      <button
        onClick={onReset}
        className="w-full border border-gray-200 text-gray-700 font-medium py-3 rounded-xl hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-plum"
      >
        <RefreshCw size={16} /> Scan another image
      </button>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════════════ */
export default function Detect() {
  const [phase, setPhase]   = useState('idle')        // idle | preview | loading | result | error
  const [file, setFile]     = useState(null)
  const [preview, setPreview] = useState(null)
  const [result, setResult] = useState(null)
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
      const res = await fetch('/api/detect', { method: 'POST', body: fd, signal: ctrl.signal })
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
        setErrorMsg('Request timed out after 60 seconds. The server may be busy — please retry.')
      } else {
        setErrorMsg(err.message || 'Something went wrong. Please try again.')
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

          {/* ── IDLE: drop zone ───────────────────────────────────────── */}
          {(phase === 'idle') && (
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              className={`border-2 border-dashed rounded-2xl p-12 flex flex-col items-center gap-4 transition-colors cursor-pointer
                ${dragging ? 'border-mint bg-mint/10' : 'border-gray-200 bg-white hover:border-mint/60 hover:bg-mintbg/30'}`}
              onClick={() => fileRef.current?.click()}
              role="button"
              tabIndex={0}
              aria-label="Upload MRI scan"
              onKeyDown={e => e.key === 'Enter' && fileRef.current?.click()}
            >
              <div className="w-14 h-14 rounded-full bg-mintbg flex items-center justify-center">
                <Upload className="text-plum" size={24} />
              </div>
              <div className="text-center">
                <p className="font-medium text-gray-700">Drag &amp; drop your MRI scan here</p>
                <p className="text-gray-400 text-sm mt-1">or click to browse</p>
              </div>
              <input
                ref={fileRef}
                type="file"
                accept=".jpg,.jpeg,.png,.webp"
                hidden
                onChange={e => e.target.files[0] && loadFile(e.target.files[0])}
                aria-label="File input"
              />
              <p className="text-xs text-gray-400 text-center">
                MRI scans only (T1, T2, FLAIR) · JPG / PNG · Max {MAX_SIZE_MB} MB
              </p>
            </div>
          )}

          {/* ── PREVIEW ──────────────────────────────────────────────── */}
          {(phase === 'preview' || phase === 'loading' || phase === 'result') && preview && (
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 flex flex-col items-center gap-5">
              <img
                src={preview}
                alt="Uploaded MRI scan preview"
                className="max-h-72 w-full object-contain rounded-xl bg-gray-50"
              />
              {phase === 'preview' && (
                <div className="flex gap-3 w-full">
                  <button
                    onClick={detect}
                    className="flex-1 bg-plum text-white font-semibold py-3 rounded-xl hover:bg-plum/90 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-plum"
                  >
                    Detect Tumor
                  </button>
                  <button
                    onClick={reset}
                    className="border border-gray-200 text-gray-600 px-5 py-3 rounded-xl hover:bg-gray-50 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-400"
                  >
                    Reset
                  </button>
                </div>
              )}

              {phase === 'loading' && (
                <div className="flex flex-col items-center gap-3 w-full">
                  <button
                    disabled
                    className="w-full bg-plum/60 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 cursor-not-allowed"
                  >
                    <Loader2 size={18} className="animate-spin" />
                    Detecting…
                  </button>
                  <p className="text-gray-400 text-sm animate-pulse">{STATUS_MESSAGES[statusIdx]}</p>
                </div>
              )}
            </div>
          )}

          {/* ── LOADING skeleton ─────────────────────────────────────── */}
          {phase === 'loading' && <SkeletonCard />}

          {/* ── RESULT ───────────────────────────────────────────────── */}
          {phase === 'result' && result && (
            <ResultCard data={result} onReset={reset} />
          )}

          {/* ── ERROR ────────────────────────────────────────────────── */}
          {phase === 'error' && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-6 flex flex-col items-center gap-4 text-center">
              <XCircle className="text-red-400" size={40} />
              <div>
                <h3 className="font-semibold text-red-700 mb-1">Something went wrong</h3>
                <p className="text-red-500 text-sm">{errorMsg}</p>
              </div>
              <button
                onClick={reset}
                className="bg-red-100 text-red-700 font-medium px-6 py-2.5 rounded-xl hover:bg-red-200 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
              >
                Try again
              </button>
            </div>
          )}

          {/* ── INFO CARD ─────────────────────────────────────────────── */}
          <div className="mt-8 bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
            <h3 className="font-semibold text-gray-800 mb-3 text-sm">What You Can Upload</h3>
            <ul className="space-y-1.5 text-sm text-gray-500">
              <li className="flex items-start gap-2"><span className="text-mint font-bold mt-0.5">•</span> MRI scans only — T1-weighted, T2-weighted, FLAIR sequences</li>
              <li className="flex items-start gap-2"><span className="text-mint font-bold mt-0.5">•</span> File formats: JPG, PNG (max 10 MB)</li>
              <li className="flex items-start gap-2"><span className="text-mint font-bold mt-0.5">•</span> Detects: Glioma, Meningioma, Pituitary tumor, or No Tumor</li>
            </ul>
            <p className="mt-4 text-xs text-gray-400 leading-relaxed">
              Educational prototype. Not a medical diagnosis. Consult a qualified radiologist for any health concerns.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
