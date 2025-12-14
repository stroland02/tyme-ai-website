"use client";

import { useState } from "react";
import Link from "next/link";
import { CodeCTA } from "../ui/CodeCTA";

export function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Hamburger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden flex flex-col gap-1.5 p-2"
        aria-label="Toggle menu"
      >
        <span
          className={`block h-0.5 w-6 bg-foreground transition-transform ${
            isOpen ? "rotate-45 translate-y-2" : ""
          }`}
        />
        <span
          className={`block h-0.5 w-6 bg-foreground transition-opacity ${
            isOpen ? "opacity-0" : ""
          }`}
        />
        <span
          className={`block h-0.5 w-6 bg-foreground transition-transform ${
            isOpen ? "-rotate-45 -translate-y-2" : ""
          }`}
        />
      </button>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-background/95 backdrop-blur-xl z-50 md:hidden"
          onClick={() => setIsOpen(false)}
        >
          <div className="flex flex-col items-center justify-center h-full gap-8">
            {/* Close button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-6 right-6 text-foreground-subtle hover:text-foreground"
            >
              <span className="text-2xl">×</span>
            </button>

            {/* Logo */}
            <Link
              href="/"
              className="font-mono text-2xl font-bold mb-8"
              onClick={() => setIsOpen(false)}
            >
              <span className="text-foreground-subtle">&lt;</span>
              Tyme AI
              <span className="text-foreground-subtle">/&gt;</span>
            </Link>

            {/* Navigation Links */}
            <nav className="flex flex-col items-center gap-6">
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
            <div className="mt-8" onClick={() => setIsOpen(false)}>
              <CodeCTA functionName="contact" href="/contact" size="lg" />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
