import Image from "next/image";

interface LogoProps {
  className?: string;
  size?: number;
  showText?: boolean;
  animateGradient?: boolean;
}

export function Logo({ className = "", size = 40, showText = true, animateGradient = false }: LogoProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Futuristic Spaceship Logo */}
      <Image
        src="/logo.png"
        alt="Tyme AI Logo"
        width={size}
        height={size}
        className="flex-shrink-0"
        style={{ mixBlendMode: 'lighten' }}
        priority
      />

      {/* Text logo with syntax brackets */}
      {showText && (
        <span className="font-mono text-lg font-bold">
          <span className="text-foreground-subtle">&lt;</span>
          <span className={animateGradient ? "bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]" : ""}>
            Tyme AI
          </span>
          <span className="text-foreground-subtle">/&gt;</span>
        </span>
      )}
    </div>
  );
}
