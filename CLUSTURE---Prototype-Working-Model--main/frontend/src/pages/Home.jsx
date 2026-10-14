import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Brain, Upload, Zap, BarChart3, GraduationCap, Stethoscope, User, CheckCircle, AlertCircle } from 'lucide-react'
import Footer from '../components/Footer'

/* ── Hero Clinical Scanner MRI Graphic (Full Aspect Ratio in Modern Console) ─── */
/* ── Hero MRI Clean Image (No outer box, no top/bottom bars) ─── */
function MRIHeroGraphic() {
  return (
    <div className="relative w-full max-w-lg mx-auto select-none flex justify-center">
      <img
        src="/hero-mri.png"
        alt="Multi-sequence Cranial MRI Analysis"
        className="w-full h-auto object-contain rounded-2xl shadow-2xl drop-shadow-[0_20px_50px_rgba(0,0,0,0.8)] hover:scale-[1.02] transition-transform duration-500"
      />
    </div>
  )
}

/* ── Stat card ─────────────────────────────────────────────────────────── */
function StatCard({ icon: Icon, value, label }) {
  return (
    <div className="flex flex-col items-center gap-2 p-6 rounded-2xl bg-white/5 border border-white/10">
      <Icon className="text-mint" size={28} />
      <span className="text-white text-2xl font-semibold">{value}</span>
      <span className="text-white/60 text-sm text-center">{label}</span>
    </div>
  )
}

/* ── Step card ─────────────────────────────────────────────────────────── */
function StepCard({ number, title, description }) {
  return (
    <div className="flex flex-col items-center text-center gap-3 p-6">
      <div className="w-12 h-12 rounded-full bg-plum text-white font-bold text-lg flex items-center justify-center">
        {number}
      </div>
      <h3 className="font-semibold text-gray-900 text-lg">{title}</h3>
      <p className="text-gray-500 text-sm leading-relaxed max-w-xs">{description}</p>
    </div>
  )
}

/* ── Audience row ──────────────────────────────────────────────────────── */
function AudienceRow({ icon: Icon, title, description }) {
  return (
    <div className="flex gap-5 items-start py-6 border-b border-gray-100 last:border-0">
      <div className="w-12 h-12 rounded-xl bg-mintbg flex items-center justify-center shrink-0">
        <Icon className="text-plum" size={22} />
      </div>
      <div>
        <h3 className="font-semibold text-gray-900 mb-1">{title}</h3>
        <p className="text-gray-500 text-sm leading-relaxed">{description}</p>
      </div>
    </div>
  )
}

/* ── Contact form ──────────────────────────────────────────────────────── */
function ContactForm() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [errors, setErrors] = useState({})
  const [sent, setSent] = useState(false)

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Name is required'
    if (!form.email.trim()) e.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email'
    if (!form.message.trim()) e.message = 'Message is required'
    return e
  }

  const handleSubmit = e => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    // Demo success state
    setSent(true)
  }

  if (sent) {
    return (
      <div className="flex flex-col items-center gap-4 py-10 text-center">
        <CheckCircle className="text-success" size={48} />
        <h3 className="font-semibold text-gray-900 text-lg">Message received!</h3>
        <p className="text-gray-500 text-sm">We'll get back to you shortly.</p>
        <button onClick={() => { setSent(false); setForm({ name:'',email:'',message:'' }) }}
          className="text-plum text-sm font-medium underline">
          Send another
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
        <input
          id="name" type="text" value={form.name}
          onChange={e => setForm(f=>({...f,name:e.target.value}))}
          className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-plum ${errors.name ? 'border-red-400' : 'border-gray-200'}`}
          placeholder="Your name"
        />
        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
        <input
          id="email" type="email" value={form.email}
          onChange={e => setForm(f=>({...f,email:e.target.value}))}
          className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-plum ${errors.email ? 'border-red-400' : 'border-gray-200'}`}
          placeholder="you@example.com"
        />
        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
      </div>
      <div>
        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message</label>
        <textarea
          id="message" rows={4} value={form.message}
          onChange={e => setForm(f=>({...f,message:e.target.value}))}
          className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-plum resize-none ${errors.message ? 'border-red-400' : 'border-gray-200'}`}
          placeholder="Your message…"
        />
        {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message}</p>}
      </div>
      <button type="submit"
        className="bg-plum text-white font-semibold py-3 rounded-xl hover:bg-plum/90 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-plum">
        Send Message
      </button>
    </form>
  )
}

/* ══════════════════════════════════════════════════════════════════════ */
export default function Home() {
  return (
    <div className="pt-16">

      {/* ── HERO BAND (near-black with dimmed MRI scanner room background) ── */}
      <section className="relative bg-ink min-h-[92vh] flex items-center px-4 py-20 overflow-hidden">
        {/* Visible Background MRI Room Image with Balanced Contrast */}
        <div className="absolute inset-0 z-0">
          <img
            src="/mri-room-bg.png"
            alt="MRI Laboratory Ambient Background"
            className="w-full h-full object-cover object-center opacity-55 brightness-90 contrast-110"
          />
          {/* Subtle dark gradient overlay to ensure text remains 100% readable */}
          <div className="absolute inset-0 bg-ink/65" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-ink/70" />
        </div>

        {/* Hero Content — Widened and Spread Left-to-Right */}
        <div className="relative z-10 max-w-7xl mx-auto w-full grid md:grid-cols-2 gap-12 lg:gap-20 items-center px-4 sm:px-8">
          <div className="max-w-xl">
            <span className="inline-block bg-mint/10 text-mint text-xs font-semibold px-3 py-1 rounded-full mb-5 border border-mint/20 backdrop-blur-sm">
              Educational Prototype · ResNet50
            </span>
            <h1 className="text-white font-medium text-[clamp(2.5rem,6vw,4.25rem)] leading-[1.12] mb-6 drop-shadow-md">
              Detect brain tumors<br />from MRI in seconds
            </h1>
            <p className="text-white/70 text-lg leading-relaxed mb-8 max-w-lg">
              Upload a brain MRI scan and let our AI classify it into four categories with confidence scores. Built for learning — not diagnosis.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/detect"
                className="bg-mint text-ink font-semibold px-8 py-3.5 rounded-full hover:bg-mint/90 transition-all hover:scale-105 shadow-lg shadow-mint/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-mint">
                Try Detection
              </Link>
              <Link to="/about"
                className="border border-white/20 bg-white/5 backdrop-blur-sm text-white font-medium px-8 py-3.5 rounded-full hover:bg-white/10 transition-colors">
                Learn more
              </Link>
            </div>
          </div>
          <div className="flex justify-center md:justify-end w-full">
            <MRIHeroGraphic />
          </div>
        </div>
      </section>

      {/* ── PURPLE INFO BAND ────────────────────────────────────────────── */}
      <section id="about" className="bg-plum px-4 sm:px-8 py-20">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-white text-center font-medium text-3xl sm:text-4xl mb-3">
            The Tumor Detector.31 Experience
          </h2>
          <p className="text-white/50 text-center mb-12 max-w-xl mx-auto">
            Powered by deep learning, designed for clarity.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            <StatCard icon={Brain}     value="ResNet50"  label="Deep learning architecture" />
            <StatCard icon={BarChart3} value="4"         label="Tumor classes classified" />
            <StatCard icon={Zap}       value="97.76%"    label="Validation accuracy" />
            <StatCard icon={Zap}       value="98.57%"    label="Training accuracy" />
          </div>
        </div>
      </section>

      {/* ── MINT STEPS BAND ─────────────────────────────────────────────── */}
      <section id="how" className="bg-mintbg px-4 sm:px-8 py-20">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-gray-900 text-center font-medium text-3xl sm:text-4xl mb-3">
            Using Tumor Detector.31 is simple
          </h2>
          <p className="text-gray-500 text-center mb-12 max-w-xl mx-auto">
            Three steps from upload to result.
          </p>
          <div className="grid sm:grid-cols-3 gap-4">
            <StepCard number="1" title="Upload MRI"
              description="Drag and drop or select a brain MRI scan (JPG/PNG, max 10 MB). Only MRI scans are supported." />
            <StepCard number="2" title="AI Analyzes"
              description="Our ResNet50 model processes the image — resize, normalize, forward pass — and returns class probabilities." />
            <StepCard number="3" title="View Result"
              description="See the detected class, a confidence score, and all four class probabilities. Always consult a doctor." />
          </div>
        </div>
      </section>

      {/* ── AUDIENCE BAND (white) ────────────────────────────────────────── */}
      <section id="who" className="bg-white px-4 py-20">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-gray-900 font-medium text-3xl sm:text-4xl mb-3 text-center">
            Who is it for?
          </h2>
          <p className="text-gray-500 text-center mb-12">A tool built for multiple audiences.</p>
          <div>
            <AudienceRow icon={GraduationCap} title="Students & Researchers"
              description="Explore how transfer learning and ResNet50 can be applied to real-world medical image classification tasks. Ideal for ML coursework and projects." />
            <AudienceRow icon={Stethoscope} title="Doctors (Screening Aid)"
              description="Use as a quick first-pass indicator. This tool is not a substitute for professional radiology — it is a supplementary educational resource only." />
            <AudienceRow icon={User} title="Patients (Awareness)"
              description="Understand what AI-assisted MRI analysis looks like. This tool does not provide medical diagnosis. Always consult a qualified radiologist." />
          </div>
        </div>
      </section>

      {/* ── CONTACT BAND (light grey) ────────────────────────────────────── */}
      <section id="contact" className="bg-gray-50 px-4 py-20">
        <div className="max-w-xl mx-auto">
          <h2 className="text-gray-900 font-medium text-3xl sm:text-4xl mb-3 text-center">Get in touch</h2>
          <p className="text-gray-500 text-center mb-10">Questions, feedback, or collaboration? We'd love to hear from you.</p>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <ContactForm />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
