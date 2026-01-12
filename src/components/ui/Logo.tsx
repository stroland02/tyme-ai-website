import Image from "next/image";

interface LogoProps {
  className?: string;
  size?: number;
  showText?: boolean;
  showImage?: boolean;
  animateGradient?: boolean;
}

export function Logo({ className = "", size = 56, showText = true, showImage = true, animateGradient = false }: LogoProps) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Futuristic Spaceship Logo */}
      {showImage && (
        <Image
          src="/logo-new.jpg"
          alt="Tyme AI Logo"
          width={size}
          height={size}
          className="flex-shrink-0 rounded-lg object-cover"
          priority
        />
      )}

      {/* Text logo without brackets */}
      {showText && (
        <span className={`font-mono text-xl font-bold ${animateGradient ? "bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]" : ""}`}>
          TYME AI
        </span>
      )}
    </div>
  );
}
