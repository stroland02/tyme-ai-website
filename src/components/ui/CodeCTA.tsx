"use client";

import Link from "next/link";
import { useState } from "react";

interface CodeCTAProps {
  functionName: string;
  href: string;
  variant?: "primary" | "secondary";
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function CodeCTA({
  functionName,
  href,
  variant = "primary",
  size = "md",
  className = "",
}: CodeCTAProps) {
  const [isHovered, setIsHovered] = useState(false);

  const sizeClasses = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  const variantClasses = {
    primary: "bg-primary text-white hover:bg-primary/90 border border-primary",
    secondary:
      "bg-transparent text-foreground border border-foreground-ghost hover:border-foreground-subtle hover:bg-foreground-dim",
  };

  return (
    <Link
      href={href}
      className={`
        inline-flex items-center gap-2 font-mono
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        rounded transition-all duration-200
        hover:shadow-lg hover:shadow-primary/20
        ${className}
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <span className={variant === "primary" ? "text-white/70" : "text-foreground-subtle"}>
        {functionName}
      </span>
      <span className="font-bold">()</span>
      {isHovered && (
        <span className="text-foreground-subtle animate-pulse">→</span>
      )}
    </Link>
  );
}
