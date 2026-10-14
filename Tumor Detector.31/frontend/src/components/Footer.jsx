import { Link } from 'react-router-dom'
import { Mail, Github, Linkedin } from 'lucide-react'
import Logo from './Logo'

export default function Footer() {
  return (
    <footer className="bg-ink text-white/70 pt-12 pb-6 px-4 sm:px-8 border-t border-white/10">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between gap-8 mb-10">
          {/* Brand */}
          <div className="flex flex-col gap-3">
            <span className="text-white font-bold text-lg tracking-tight">Tumor Detector.31</span>
            <p className="text-sm max-w-xs leading-relaxed text-white/60">
              An AI-powered cranial MRI classifier engineered by Ayush Kumar (IIT Patna) with ResNet50.
            </p>
            {/* Developer direct badge in footer */}
            <div className="flex items-center gap-3 pt-2 text-white/70 text-xs">
              <a href="mailto:Aayush_mishra2004@outlook.com" title="Email" className="hover:text-mint transition-colors">
                <Mail size={16} />
              </a>
              <a href="https://github.com/mishraayushgit" target="_blank" rel="noreferrer" title="GitHub" className="hover:text-mint transition-colors">
                <Github size={16} />
              </a>
              <a href="https://linkedin.com/in/ayush-kumar-mishra-48b80023a" target="_blank" rel="noreferrer" title="LinkedIn" className="hover:text-mint transition-colors">
                <Linkedin size={16} />
              </a>
              <span className="text-white/40">| Ayush Kumar (IIT Patna)</span>
            </div>
          </div>

          {/* Quick links */}
          <div className="flex gap-12">
            <div>
              <h3 className="text-white text-sm font-semibold mb-3">Pages</h3>
              <ul className="flex flex-col gap-2 text-sm">
                <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
                <li><Link to="/detect" className="hover:text-white transition-colors">Detect Now</Link></li>
                <li><Link to="/how-it-works" className="hover:text-white transition-colors">How It Works</Link></li>
                <li><Link to="/docs" className="hover:text-white transition-colors">Documentation</Link></li>
                <li><Link to="/about" className="hover:text-white transition-colors">About & Developer</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white text-sm font-semibold mb-3">Model Stats</h3>
              <ul className="flex flex-col gap-2 text-sm text-white/60">
                <li>ResNet50 Architecture</li>
                <li>Val Accuracy: 97.76%</li>
                <li>Train Accuracy: 98.57%</li>
                <li>4 Diagnostic Classes</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="border-t border-white/10 pt-6 text-xs text-white/50 leading-relaxed text-center">
          <p>
            <strong className="text-white/70">Educational prototype. Not a medical diagnosis.</strong>{' '}
            This tool is for educational and demonstration purposes only and does not constitute medical advice.
            Always consult a qualified radiologist or medical professional for any clinical evaluation.
          </p>
          <p className="mt-2">Developed with ❤️ by Ayush Kumar · Indian Institute of Technology Patna (IITP) · 2024</p>
        </div>
      </div>
    </footer>
  )
}
