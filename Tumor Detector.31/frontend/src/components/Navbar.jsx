import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import Logo from './Logo'

const links = [
  { to: '/', label: 'Home' },
  { to: '/how-it-works', label: 'How it works' },
  { to: '/docs', label: 'Documentation' },
  { to: '/about', label: 'About' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-ink/95 backdrop-blur-md border-b border-white/10">
      <nav className="max-w-7xl mx-auto px-4 sm:px-8 flex items-center justify-between h-16">
        {/* Direct Bold Wordmark Logo shifted to left */}
        <Link to="/" className="flex items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-mint rounded-md group">
          <span className="text-white font-bold text-xl tracking-tight group-hover:text-mint transition-colors">
            Tumor Detector.31
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-6">
          {links.map(l => (
            <NavLink
              key={l.label}
              to={l.to}
              className={({ isActive }) =>
                `text-sm font-medium transition-colors ${
                  isActive ? 'text-mint font-semibold' : 'text-white/70 hover:text-white'
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
          <NavLink
            to="/detect"
            className="bg-mint text-ink text-sm font-semibold px-5 py-2 rounded-full hover:bg-mint/90 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-mint"
          >
            Detect Now
          </NavLink>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-white p-2 rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-mint"
          onClick={() => setOpen(o => !o)}
          aria-label={open ? 'Close menu' : 'Open menu'}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {/* Mobile drawer */}
      {open && (
        <div className="md:hidden bg-ink border-t border-white/10 px-4 pb-4 flex flex-col gap-4 pt-3">
          {links.map(l => (
            <NavLink
              key={l.label}
              to={l.to}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `text-sm font-medium ${isActive ? 'text-mint font-semibold' : 'text-white/80 hover:text-white'}`
              }
            >
              {l.label}
            </NavLink>
          ))}
          <NavLink
            to="/detect"
            onClick={() => setOpen(false)}
            className="bg-mint text-ink text-sm font-semibold px-5 py-2.5 rounded-full text-center"
          >
            Detect Now
          </NavLink>
        </div>
      )}
    </header>
  )
}
