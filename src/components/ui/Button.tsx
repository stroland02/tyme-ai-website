import { cn } from "@/lib/utils";
import { AnchorHTMLAttributes, ButtonHTMLAttributes, forwardRef } from "react";
import Link from "next/link";

type BaseProps = {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
};

type ButtonAsButton = BaseProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof BaseProps> & {
    href?: never;
  };

type ButtonAsLink = BaseProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof BaseProps> & {
    href: string;
  };

export type ButtonProps = ButtonAsButton | ButtonAsLink;

const Button = forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", href, ...props }, ref) => {
    const classes = cn(
      // Base styles
      "inline-flex items-center justify-center rounded-full font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
      // Variants
      {
        "bg-foreground text-background hover:bg-foreground/90":
          variant === "primary",
        "bg-background text-foreground border-2 border-foreground hover:bg-foreground/10":
          variant === "secondary",
        "border border-foreground/20 bg-transparent hover:bg-foreground/5":
          variant === "outline",
        "hover:bg-foreground/5": variant === "ghost",
      },
      // Sizes
      {
        "h-9 px-4 text-sm": size === "sm",
        "h-11 px-6 text-base": size === "md",
        "h-14 px-8 text-lg": size === "lg",
      },
      className
    );

    if (href) {
      return (
        <Link
          href={href}
          className={classes}
          ref={ref as React.Ref<HTMLAnchorElement>}
          {...(props as AnchorHTMLAttributes<HTMLAnchorElement>)}
        />
      );
    }

    return (
      <button
        className={classes}
        ref={ref as React.Ref<HTMLButtonElement>}
        {...(props as ButtonHTMLAttributes<HTMLButtonElement>)}
      />
    );
  }
);

Button.displayName = "Button";

export { Button };
