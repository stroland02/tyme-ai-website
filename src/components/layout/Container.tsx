import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";

interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg" | "xl" | "full";
}

export function Container({
  className,
  size = "xl",
  children,
  ...props
}: ContainerProps) {
  return (
    <div
      className={cn(
        "mx-auto w-full px-4 sm:px-6 lg:px-8",
        {
          "max-w-3xl": size === "sm",
          "max-w-5xl": size === "md",
          "max-w-6xl": size === "lg",
          "max-w-7xl": size === "xl",
          "max-w-full": size === "full",
        },
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
