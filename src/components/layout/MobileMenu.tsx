"use client";

import { useState } from "react";
import Link from "next/link";
import { CodeCTA } from "../ui/CodeCTA";
import { Logo } from "../ui/Logo";
import { ThemeToggle } from "../ui/ThemeToggle";

export function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative md:hidden">
      {/* Hamburger Button */}
      <button
        onClick={() => {
          console.log('Toggle clicked, current state:', isOpen);
          setIsOpen(!isOpen);
        }}
        className="flex flex-col justify-center items-center gap-1.5 p-2.5 rounded-lg border border-foreground-ghost hover:border-foreground hover:bg-foreground-dim transition-all active:scale-95 bg-background"
        aria-label="Toggle menu"
        aria-expanded={isOpen}
        type="button"
      >
        <span
          className={`block h-0.5 w-5 bg-foreground transition-all duration-300 ${
            isOpen ? "rotate-45 translate-y-2" : ""
          }`}
        />
        <span
          className={`block h-0.5 w-5 bg-foreground transition-all duration-300 ${
            isOpen ? "opacity-0" : ""
          }`}
        />
        <span
          className={`block h-0.5 w-5 bg-foreground transition-all duration-300 ${
            isOpen ? "-rotate-45 -translate-y-2" : ""
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          {/* Backdrop - close menu when clicking outside */}
          <div
            className="fixed inset-0 z-[60]"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />

          {/* Dropdown Content - positioned fixed to break out of header constraints */}
          <div className="fixed right-4 top-[4.5rem] w-[calc(100vw-2rem)] max-w-xs rounded-lg border border-border bg-background shadow-2xl z-[70]">
            {/* Navigation Links */}
            <nav className="flex flex-col py-2">
              <Link
                href="/services"
                className="px-4 py-3 font-mono text-sm text-foreground-subtle hover:text-foreground hover:bg-foreground-dim transition-colors border-b border-border"
                onClick={() => setIsOpen(false)}
              >
                services
              </Link>
              <Link
                href="/portfolio"
                className="px-4 py-3 font-mono text-sm text-foreground-subtle hover:text-foreground hover:bg-foreground-dim transition-colors border-b border-border"
                onClick={() => setIsOpen(false)}
              >
                portfolio
              </Link>
              <Link
                href="/about"
                className="px-4 py-3 font-mono text-sm text-foreground-subtle hover:text-foreground hover:bg-foreground-dim transition-colors border-b border-border"
                onClick={() => setIsOpen(false)}
              >
                about
              </Link>
              <Link
                href="/blog"
                className="px-4 py-3 font-mono text-sm text-foreground-subtle hover:text-foreground hover:bg-foreground-dim transition-colors border-b border-border"
                onClick={() => setIsOpen(false)}
              >
                blog
              </Link>

              {/* Theme Toggle */}
              <div className="px-4 py-3 border-b border-border">
                <ThemeToggle />
              </div>

              {/* CTA Button */}
              <div className="px-4 py-3">
                <CodeCTA
                  functionName="contact"
                  href="mailto:tyme.ai25@gmail.com"
                  size="sm"
                  className="w-full justify-center"
                />
              </div>
            </nav>
          </div>
        </>
      )}
    </div>
  );
}
