export default function Logo({ size = 32 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Tumor Detector.31 logo"
    >
      {/* Brain outline */}
      <ellipse cx="20" cy="22" rx="15" ry="13" fill="#C9F5F0" opacity="0.25" />
      <path
        d="M8 22c0-6.627 5.373-12 12-12s12 5.373 12 12"
        stroke="#C9F5F0"
        strokeWidth="2"
        strokeLinecap="round"
      />
      {/* Scan cross-hair */}
      <circle cx="20" cy="22" r="5" stroke="#C9F5F0" strokeWidth="1.5" />
      <line x1="20" y1="10" x2="20" y2="14" stroke="#C9F5F0" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="20" y1="30" x2="20" y2="34" stroke="#C9F5F0" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="10" y1="22" x2="14" y2="22" stroke="#C9F5F0" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="26" y1="22" x2="30" y2="22" stroke="#C9F5F0" strokeWidth="1.5" strokeLinecap="round" />
      {/* Dot in centre */}
      <circle cx="20" cy="22" r="2" fill="#C9F5F0" />
    </svg>
  )
}
