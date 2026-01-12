"use client";

import { useState } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { CodeCTA } from "../ui/CodeCTA";
import { ThemeToggle } from "../ui/ThemeToggle";
import { Button } from "../ui/Button";

export function MobileMenu() {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);

  const closeMenu = () => setIsOpen(false);

  return (
    <div className="relative md:hidden">
      {/* Hamburger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
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
            onClick={closeMenu}
            aria-hidden="true"
          />

          {/* Dropdown Content */}
          <div className="fixed right-4 top-[4.5rem] w-[calc(100vw-2rem)] max-w-xs rounded-lg border border-border bg-background shadow-2xl z-[70]">
            <nav className="flex flex-col py-2">
              {/* Auth Buttons */}
              <div className="flex flex-col gap-2 px-4 py-3 border-b border-border">
                {session ? (
                  <>
                    <div className="text-sm font-mono text-foreground-subtle mb-2">
                      Hi, <span className="text-foreground font-semibold">{session.user?.name || session.user?.email}</span>
                    </div>
                    <Button href="/account" variant="outline" size="sm" onClick={closeMenu} className="w-full">
                      Dashboard
                    </Button>
                    <Button onClick={() => { signOut(); closeMenu(); }} variant="secondary" size="sm" className="w-full">
                      Log Out
                    </Button>
                  </>
                ) : (
                  <>
                    <Button href="/auth/signin" variant="outline" size="sm" onClick={closeMenu} className="w-full">
                      Login
                    </Button>
                    <Button href="/auth/signup" variant="primary" size="sm" onClick={closeMenu} className="w-full">
                      Sign Up
                    </Button>
                  </>
                )}
              </div>

              {/* Navigation Links */}
              <Link href="/services" className="px-4 py-3 font-mono text-sm text-foreground-subtle hover:text-foreground hover:bg-foreground-dim transition-colors border-b border-border" onClick={closeMenu}>
                services
              </Link>
              <Link href="/portfolio" className="px-4 py-3 font-mono text-sm text-foreground-subtle hover:text-foreground hover:bg-foreground-dim transition-colors border-b border-border" onClick={closeMenu}>
                portfolio
              </Link>
              <Link href="/about" className="px-4 py-3 font-mono text-sm text-foreground-subtle hover:text-foreground hover:bg-foreground-dim transition-colors border-b border-border" onClick={closeMenu}>
                about
              </Link>
              <Link href="/blog" className="px-4 py-3 font-mono text-sm text-foreground-subtle hover:text-foreground hover:bg-foreground-dim transition-colors border-b border-border" onClick={closeMenu}>
                blog
              </Link>

              {/* Theme Toggle & CTA */}
              <div className="px-4 py-3 border-b border-border">
                <ThemeToggle />
              </div>
              <div className="px-4 py-3">
                <CodeCTA functionName="contact" href="/contact" size="sm" className="w-full justify-center" onClick={closeMenu}/>
              </div>
            </nav>
          </div>
        </>
      )}
    </div>
  );
}
