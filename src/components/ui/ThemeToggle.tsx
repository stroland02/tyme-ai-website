"use client";

import { useTheme } from "../providers/ThemeProvider";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="relative group flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-background/50 backdrop-blur-sm hover:border-foreground-ghost transition-all duration-300 hover:shadow-lg hover:shadow-primary/10"
      aria-label="Toggle theme"
    >
      {/* Emoji icon */}
      <span className="text-base transition-transform duration-300 hover:scale-110">
        {theme === "light" ? "☀️" : "🌙"}
      </span>

      {/* Code-style label */}
      <span className="font-mono text-xs text-foreground-subtle">
        theme
      </span>
    </button>
  );
}
