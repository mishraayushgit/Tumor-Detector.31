import { Mail, Phone, MapPin, Linkedin, Github, Cpu, ShieldCheck } from 'lucide-react'
import Footer from '../components/Footer'

function Section({ title, children }) {
  return (
    <section className="mb-12">
      <h2 className="text-gray-900 font-semibold text-2xl mb-5 pb-3 border-b border-gray-100">{title}</h2>
      {children}
    </section>
  )
}

function InfoRow({ label, value }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-4 py-2.5 border-b border-gray-50 last:border-0">
      <span className="text-gray-500 text-sm sm:w-44 shrink-0">{label}</span>
      <span className="text-gray-900 text-sm font-medium">{value}</span>
    </div>
  )
}

function AccuracyBar({ label, value, color }) {
  return (
    <div>
      <div className="flex justify-between text-sm mb-1.5">
        <span className="text-gray-600">{label}</span>
        <span className="font-semibold text-gray-900">{value}%</span>
      </div>
      <div className="bg-gray-100 rounded-full h-3 overflow-hidden">
        <div className={`h-3 rounded-full ${color}`} style={{ width: `${value}%` }} />
      </div>
    </div>
  )
}

export default function About() {
  return (
    <div className="pt-16 min-h-screen bg-white flex flex-col">
      {/* Page header */}
      <div className="bg-plum text-white px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <span className="inline-block bg-mint/20 text-mint text-xs font-semibold px-3 py-1 rounded-full mb-3">
            Author Profile & Technical Overview
          </span>
          <h1 className="font-medium text-4xl sm:text-5xl mb-4">About the Project & Developer</h1>
          <p className="text-white/70 text-lg leading-relaxed max-w-2xl">
            Tumor Detector.31 is an end-to-end deep learning clinical screening prototype designed, engineered, and integrated by Ayush Kumar (IIT Patna).
          </p>
        </div>
      </div>

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-12">

        {/* ── DEVELOPER PROFILE CARD (Top Section) ────────────────────── */}
        <div className="bg-gradient-to-br from-ink via-plum to-[#1A0B33] text-white rounded-3xl p-6 sm:p-8 mb-12 shadow-xl border border-white/10 relative overflow-hidden">
          <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-mint/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col md:flex-row gap-6 md:items-start justify-between relative z-10">
            <div>
              <div className="inline-flex items-center gap-2 bg-mint/15 text-mint border border-mint/20 text-xs px-3 py-1 rounded-full font-medium mb-3">
                <Cpu size={14} /> Lead Developer & AI Systems Engineer
              </div>
              <h2 className="text-3xl font-semibold text-white tracking-tight">Ayush Kumar</h2>
              <p className="text-mint font-medium text-base mt-1">
                Indian Institute of Technology Patna (IIT Patna)
              </p>
              <p className="text-white/70 text-sm mt-1">
                B.S. in Computer Science & Data Analytics (2023 – 2027) · CPI: 7.92 / 10.0
              </p>
              <p className="text-white/60 text-sm mt-3 max-w-xl leading-relaxed">
                Undergraduate researcher and developer with hands-on expertise in AI/ML systems, NLP pipelines, deep learning computer vision, and federated learning. Previously Data & Research Analyst Intern at HealiTri Tech.
              </p>
            </div>

            {/* Quick Contact Badges */}
            <div className="flex flex-col gap-2.5 sm:min-w-[240px] bg-white/5 p-4 rounded-2xl border border-white/10 text-xs text-white/80">
              <a href="mailto:Aayush_mishra2004@outlook.com" className="flex items-center gap-2 hover:text-mint transition-colors">
                <Mail size={15} className="text-mint shrink-0" />
                <span className="truncate">Aayush_mishra2004@outlook.com</span>
              </a>
              <a href="tel:+918527213584" className="flex items-center gap-2 hover:text-mint transition-colors">
                <Phone size={15} className="text-mint shrink-0" />
                <span>+91 8527213584</span>
              </a>
              <div className="flex items-center gap-2 text-white/60">
                <MapPin size={15} className="text-mint shrink-0" />
                <span>Delhi & Patna, India</span>
              </div>
              <div className="pt-2 border-t border-white/10 flex items-center gap-4 text-sm">
                <a
                  href="https://github.com/mishraayushgit"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 text-white hover:text-mint transition-colors font-medium"
                >
                  <Github size={15} /> GitHub
                </a>
                <a
                  href="https://linkedin.com/in/ayush-kumar-mishra-48b80023a"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 text-white hover:text-mint transition-colors font-medium"
                >
                  <Linkedin size={15} /> LinkedIn
                </a>
              </div>
            </div>
          </div>

          {/* Skill tags */}
          <div className="mt-6 pt-5 border-t border-white/10 flex flex-wrap gap-2 text-xs">
            {['TensorFlow / Keras', 'Python', 'Flask / FastAPI', 'PyTorch', 'React & Tailwind', 'Deep Learning Vision', 'Medical Imaging Pipelines', 'SQL & Power BI'].map((skill) => (
              <span key={skill} className="bg-white/10 text-white/90 px-3 py-1 rounded-lg">
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* ── MANDATORY DISCLAIMER ────────────────────────────────────── */}
        <div className="bg-amber/10 border border-amber/30 rounded-2xl px-5 py-4 mb-10 text-sm text-amber-950 leading-relaxed flex items-start gap-3">
          <ShieldCheck className="text-amber-600 shrink-0 mt-0.5" size={20} />
          <div>
            <strong>Educational Prototype & Screening Notice:</strong> This platform is engineered for academic research, demonstrations, and clinical triage assistance. It is <em>not</em> an FDA/CE-cleared medical diagnostic instrument. Radiologists and neuro-oncologists must interpret clinical scans.
          </div>
        </div>

        {/* ── PROJECT SUMMARY ─────────────────────────────────────────── */}
        <Section title="Project Vision & Motivation">
          <p className="text-gray-600 text-sm leading-relaxed mb-4">
            Brain tumors represent high-mortality clinical anomalies where delays in cross-sectional MRI interpretation directly impair patient prognosis. In overburdened healthcare setups and Tier-2/3 regions, radiologist shortages introduce diagnostic backlogs.
          </p>
          <p className="text-gray-600 text-sm leading-relaxed">
            <strong>Tumor Detector.31</strong> demonstrates an automated, reproducible AI triage engine. By evaluating axial T1-weighted cranial MRI scans against deep residual neural representations, it produces class probabilities across Glioma, Meningioma, Pituitary Adenoma, or Healthy Brain tissue in sub-second inference latencies.
          </p>
        </Section>

        {/* ── DATASET SPECIFICATION ───────────────────────────────────── */}
        <Section title="Dataset Details">
          <InfoRow label="Benchmark Source" value="Kaggle — Brain Tumor MRI Dataset (Masoud Nickparvar benchmark)" />
          <InfoRow label="Dataset Volume" value="~7,023 Cranial MRI Images across 4 balanced categories" />
          <InfoRow label="Imaging Protocol" value="T1-weighted Contrast Enhanced & Non-Contrast MRI slices" />
          <InfoRow label="Resolution & Channels" value="Standardized to 224 × 224 pixels with 3-channel RGB mapping" />
          <InfoRow label="Partition Scheme" value="80% Training (~5,620 scans) / 20% Evaluation (~1,403 unseen scans)" />

          <h3 className="text-gray-700 font-semibold text-sm mt-6 mb-3">Diagnostic Classes & Volume Distribution</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'Glioma', count: '~1,500 scans', desc: 'Infiltrative glial tissue neoplasms' },
              { label: 'Meningioma', count: '~1,300 scans', desc: 'Dural & arachnoid envelope lesions' },
              { label: 'Pituitary', count: '~1,500 scans', desc: 'Sellar region endocrine adenomas' },
              { label: 'No Tumor', count: '~2,000 scans', desc: 'Healthy parenchyma & ventricular control' },
            ].map(c => (
              <div key={c.label} className="rounded-xl p-4 bg-gray-50 border border-gray-100">
                <p className="font-semibold text-gray-900 text-base">{c.label}</p>
                <p className="text-plum font-medium text-xs mt-0.5">{c.count}</p>
                <p className="text-gray-400 text-[11px] mt-1">{c.desc}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* ── ARCHITECTURE HIGHLIGHTS ─────────────────────────────────── */}
        <Section title="Deep Learning Architecture (ResNet50)">
          <p className="text-gray-600 text-sm leading-relaxed mb-4">
            Deep convolutional neural networks suffer from degradation when layer depths expand. ResNet50 solves this through <strong>identity residual connections</strong> (F(x) + x), enabling gradient preservation across deep convolutional blocks.
          </p>
          <div className="bg-ink text-mint/90 rounded-2xl p-6 font-mono text-xs leading-relaxed overflow-x-auto shadow-inner">
            <p className="text-white/40">// Architectural Tensor Pipeline</p>
            <p className="text-white mt-1">Input Tensor: [Batch, 224, 224, 3] Normalized (0.0 to 1.0)</p>
            <p className="text-white/40 ml-4">│</p>
            <p className="text-mint font-semibold">├── ResNet50 Feature Extractor (Pre-trained ImageNet Weights)</p>
            <p className="text-white/60 ml-8">• Conv Blocks 1-4 Frozen (Static low-level Edge/Texture extractors)</p>
            <p className="text-white/60 ml-8">• Conv Block 5 Unfrozen (Fine-tuned for cranial microstructures)</p>
            <p className="text-white/40 ml-4">│</p>
            <p className="text-mint">├── GlobalAveragePooling2D() [Extracts 2048-dim feature latent vector]</p>
            <p className="text-mint">├── Dropout(rate = 0.40) [Stochastic neuron deactivation for regularization]</p>
            <p className="text-mint">├── Dense(128 Units, Activation = 'ReLU') [Non-linear manifold transformation]</p>
            <p className="text-mint">├── Dropout(rate = 0.20)</p>
            <p className="text-mint">└── Dense(4 Units, Activation = 'Softmax')</p>
            <p className="text-white/40 ml-4">│</p>
            <p className="text-success font-semibold">Output Distribution: P(Glioma), P(Meningioma), P(NoTumor), P(Pituitary)</p>
          </div>
        </Section>

        {/* ── PERFORMANCE EVALUATION ─────────────────────────────────── */}
        <Section title="Validation & Benchmarks">
          <div className="grid sm:grid-cols-2 gap-6 mb-6">
            <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5">
              <AccuracyBar label="Training Accuracy" value={98.57} color="bg-plum" />
              <p className="text-gray-400 text-xs mt-2">Achieved through Adam optimizer with LR scheduling</p>
            </div>
            <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5">
              <AccuracyBar label="Validation Accuracy (Unseen Test)" value={97.76} color="bg-emerald-500" />
              <p className="text-gray-400 text-xs mt-2">Demonstrates solid cross-validation without overfitting gap (0.81%)</p>
            </div>
          </div>
        </Section>

        {/* ── DEVELOPER CONTACT FOOTER CARD ───────────────────────────── */}
        <div className="bg-gray-50 border border-gray-200 rounded-3xl p-8 text-center mt-12">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Have inquiries or research collaboration proposals?</h3>
          <p className="text-gray-500 text-sm max-w-xl mx-auto mb-6">
            Feel free to connect directly with Ayush Kumar for research exchanges, code inspections, or pipeline deployment support.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <a
              href="mailto:Aayush_mishra2004@outlook.com"
              className="bg-plum text-white font-medium text-sm px-6 py-2.5 rounded-full hover:bg-plum/90 transition-colors inline-flex items-center gap-2"
            >
              <Mail size={16} /> Send Email
            </a>
            <a
              href="https://linkedin.com/in/ayush-kumar-mishra-48b80023a"
              target="_blank"
              rel="noreferrer"
              className="bg-white border border-gray-200 text-gray-700 font-medium text-sm px-6 py-2.5 rounded-full hover:bg-gray-100 transition-colors inline-flex items-center gap-2"
            >
              <Linkedin size={16} /> Connect on LinkedIn
            </a>
            <a
              href="https://github.com/mishraayushgit"
              target="_blank"
              rel="noreferrer"
              className="bg-white border border-gray-200 text-gray-700 font-medium text-sm px-6 py-2.5 rounded-full hover:bg-gray-100 transition-colors inline-flex items-center gap-2"
            >
              <Github size={16} /> GitHub Profile
            </a>
          </div>
        </div>

      </main>
      <Footer />
    </div>
  )
}
