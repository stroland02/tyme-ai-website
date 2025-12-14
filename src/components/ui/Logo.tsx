import Image from "next/image";

interface LogoProps {
  className?: string;
  size?: number;
  showText?: boolean;
}

export function Logo({ className = "", size = 40, showText = true }: LogoProps) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
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

      {/* Text logo with animated gradient */}
      {showText && (
        <span className="font-mono text-2xl font-bold bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">
          Tyme AI
        </span>
      )}
    </div>
  );
}
