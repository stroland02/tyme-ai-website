import Image from "next/image";

interface LogoProps {
  className?: string;
  size?: number;
  showText?: boolean;
}

export function Logo({ className = "", size = 40, showText = true }: LogoProps) {
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
