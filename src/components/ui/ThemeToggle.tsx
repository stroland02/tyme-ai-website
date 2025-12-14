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
      {/* Code-style wrapper */}
      <span className="font-mono text-xs text-foreground-subtle">
        theme:
      </span>

      {/* Icon container with smooth transition */}
      <div className="relative w-5 h-5 flex items-center justify-center">
        {/* Sun icon (light mode) */}
        <svg
          className={`absolute w-4 h-4 transition-all duration-300 ${
            theme === "light"
              ? "rotate-0 opacity-100"
              : "rotate-180 opacity-0"
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <circle cx="12" cy="12" r="4" strokeWidth="2" />
          <path
            strokeLinecap="round"
            strokeWidth="2"
            d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M2 12h2m16 0h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"
          />
        </svg>

        {/* Moon icon (dark mode) */}
        <svg
          className={`absolute w-4 h-4 transition-all duration-300 ${
            theme === "dark"
              ? "rotate-0 opacity-100"
              : "-rotate-180 opacity-0"
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
          />
        </svg>
      </div>
    </button>
  );
}
