"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { CodeCTA } from "../ui/CodeCTA";

export function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <>
      {/* Hamburger Button - More visible */}
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          console.log('Menu button clicked, isOpen:', !isOpen);
          setIsOpen(!isOpen);
        }}
        className="md:hidden flex flex-col justify-center items-center gap-1.5 p-3 rounded-lg border-2 border-foreground-ghost hover:border-foreground hover:bg-foreground-dim transition-all active:scale-95"
        aria-label="Toggle menu"
        type="button"
      >
        <span
          className={`block h-0.5 w-6 bg-foreground transition-all duration-300 ${
            isOpen ? "rotate-45 translate-y-2" : ""
          }`}
        />
        <span
          className={`block h-0.5 w-6 bg-foreground transition-all duration-300 ${
            isOpen ? "opacity-0" : ""
          }`}
        />
        <span
          className={`block h-0.5 w-6 bg-foreground transition-all duration-300 ${
            isOpen ? "-rotate-45 -translate-y-2" : ""
          }`}
        />
      </button>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/95 backdrop-blur-xl md:hidden overflow-y-auto"
          style={{ zIndex: 9999 }}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setIsOpen(false);
            }
          }}
        >
          <div
            className="min-h-screen flex flex-col items-center justify-center py-20 px-6"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-6 right-6 text-foreground hover:text-foreground-muted transition-colors"
              aria-label="Close menu"
            >
              <span className="text-3xl font-light">×</span>
            </button>

            <div className="flex flex-col items-center gap-8 w-full max-w-sm">
              {/* Logo */}
              <Link
                href="/"
                className="font-mono text-2xl font-bold"
                onClick={() => setIsOpen(false)}
              >
                <span className="text-foreground-subtle">&lt;</span>
                Tyme AI
                <span className="text-foreground-subtle">/&gt;</span>
              </Link>

              {/* Navigation Links */}
              <nav className="flex flex-col items-center gap-6 w-full">
                <Link
                  href="/services"
                  className="text-xl font-mono text-foreground-subtle hover:text-foreground transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  services
                </Link>
                <Link
                  href="/portfolio"
                  className="text-xl font-mono text-foreground-subtle hover:text-foreground transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  portfolio
                </Link>
                <Link
                  href="/about"
                  className="text-xl font-mono text-foreground-subtle hover:text-foreground transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  about
                </Link>
                <Link
                  href="/blog"
                  className="text-xl font-mono text-foreground-subtle hover:text-foreground transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  blog
                </Link>
              </nav>

              {/* CTA Button */}
              <div className="mt-4 w-full flex justify-center" onClick={() => setIsOpen(false)}>
                <CodeCTA functionName="contact" href="/contact" size="lg" />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
