interface LogoProps {
  className?: string;
  size?: number;
  showText?: boolean;
}

export function Logo({ className = "", size = 40, showText = true }: LogoProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Futuristic Spaceship SVG */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="flex-shrink-0"
      >
        <defs>
          {/* Gradient for main body */}
          <linearGradient id="shipGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#9333ea" />
          </linearGradient>

          {/* Gradient for engines */}
          <linearGradient id="engineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#9333ea" />
            <stop offset="100%" stopColor="#3b82f6" />
          </linearGradient>

          {/* Glow effect */}
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Main ship body - sleek angular design */}
        <path
          d="M 50 10 L 70 40 L 70 60 L 50 90 L 30 60 L 30 40 Z"
          fill="url(#shipGradient)"
          opacity="0.9"
          filter="url(#glow)"
        />

        {/* Cockpit window */}
        <ellipse
          cx="50"
          cy="30"
          rx="8"
          ry="12"
          fill="#60a5fa"
          opacity="0.6"
        />

        {/* Side wings */}
        <path
          d="M 30 45 L 10 50 L 30 55 Z"
          fill="url(#shipGradient)"
          opacity="0.8"
        />
        <path
          d="M 70 45 L 90 50 L 70 55 Z"
          fill="url(#shipGradient)"
          opacity="0.8"
        />

        {/* Engine exhausts */}
        <circle
          cx="42"
          cy="80"
          r="4"
          fill="url(#engineGradient)"
          opacity="0.9"
        />
        <circle
          cx="58"
          cy="80"
          r="4"
          fill="url(#engineGradient)"
          opacity="0.9"
        />

        {/* Engine glow */}
        <circle
          cx="42"
          cy="80"
          r="6"
          fill="#9333ea"
          opacity="0.3"
          filter="url(#glow)"
        />
        <circle
          cx="58"
          cy="80"
          r="6"
          fill="#9333ea"
          opacity="0.3"
          filter="url(#glow)"
        />

        {/* Detail lines */}
        <line
          x1="50"
          y1="20"
          x2="50"
          y2="70"
          stroke="#60a5fa"
          strokeWidth="1"
          opacity="0.4"
        />
        <line
          x1="40"
          y1="50"
          x2="60"
          y2="50"
          stroke="#60a5fa"
          strokeWidth="1"
          opacity="0.4"
        />
      </svg>

      {/* Text logo */}
      {showText && (
        <span className="font-mono text-lg font-bold">
          <span className="text-foreground-subtle">&lt;</span>
          Tyme AI
          <span className="text-foreground-subtle">/&gt;</span>
        </span>
      )}
    </div>
  );
}
