"use client";

import Link from "next/link";
import { useState } from "react";

interface CodeCTAProps {
  functionName: string;
  href?: string;
  variant?: "primary" | "secondary";
  size?: "sm" | "md" | "lg";
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit";
}

export function CodeCTA({
  functionName,
  href,
  variant = "primary",
  size = "md",
  className = "",
  onClick,
  type = "button",
}: CodeCTAProps) {
  const [isHovered, setIsHovered] = useState(false);

  const sizeClasses = {
    sm: "px-3 py-1.5 text-xs sm:px-4 sm:py-2 sm:text-sm",
    md: "px-4 py-2 text-sm sm:px-6 sm:py-3 sm:text-base",
    lg: "px-5 py-2.5 text-sm sm:px-8 sm:py-4 sm:text-lg",
  };

  const variantClasses = {
    primary: "bg-primary text-white hover:bg-primary/90 border border-primary",
    secondary:
      "bg-transparent text-foreground border border-foreground-ghost hover:border-foreground-subtle hover:bg-foreground-dim",
  };

  const commonProps = {
    className: `
      inline-flex items-center justify-center gap-2 font-mono
      ${sizeClasses[size]}
      ${variantClasses[variant]}
      rounded transition-all duration-200
      hover:shadow-lg hover:shadow-primary/20
      ${className}
    `,
    onMouseEnter: () => setIsHovered(true),
    onMouseLeave: () => setIsHovered(false),
  };

  const content = (
    <>
      <span className={variant === "primary" ? "text-white/70" : "text-foreground-subtle"}>
        {functionName}
      </span>
      <span className="font-bold">()</span>
      {isHovered && (
        <span className="text-foreground-subtle animate-pulse">→</span>
      )}
    </>
  );

  if (href) {
    return (
      <Link href={href} {...commonProps}>
        {content}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} {...commonProps}>
      {content}
    </button>
  );
}
