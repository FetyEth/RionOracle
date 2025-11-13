export function DecorativeAccent({
  position = "top-left",
}: { position?: "top-left" | "top-right" | "bottom-left" | "bottom-right" }) {
  const positionClasses = {
    "top-left": "top-0 left-0",
    "top-right": "top-0 right-0 rotate-90",
    "bottom-left": "bottom-0 left-0 -rotate-90",
    "bottom-right": "bottom-0 right-0 rotate-180",
  }

  return (
    <div className={`absolute ${positionClasses[position]} w-32 h-32 pointer-events-none opacity-30`}>
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <defs>
          <linearGradient id={`accent-gradient-${position}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--primary)" stopOpacity="0" />
            <stop offset="50%" stopColor="var(--primary)" stopOpacity="0.3" />
            <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
          </linearGradient>
        </defs>
        <line x1="0" y1="0" x2="100" y2="0" stroke={`url(#accent-gradient-${position})`} strokeWidth="1" />
        <line x1="0" y1="0" x2="0" y2="100" stroke={`url(#accent-gradient-${position})`} strokeWidth="1" />
        <circle cx="0" cy="0" r="2" fill="var(--primary)" opacity="0.5">
          <animate attributeName="opacity" values="0.3;0.8;0.3" dur="3s" repeatCount="indefinite" />
        </circle>
      </svg>
    </div>
  )
}
