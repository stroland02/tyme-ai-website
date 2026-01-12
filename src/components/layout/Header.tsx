"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Container } from "./Container";
import { CodeCTA } from "../ui/CodeCTA";
import { MobileMenu } from "./MobileMenu";
import { Logo } from "../ui/Logo";
import { ThemeToggle } from "../ui/ThemeToggle";
import { Button } from "../ui/Button";

export function Header() {
  const { data: session } = useSession();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-xl">
      <Container>
        <div className="flex h-16 items-center justify-between gap-4">
          <Link href="/" className="hover:opacity-80 transition-opacity flex-shrink-0">
            <Logo showText={true} showImage={false} animateGradient={true} />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="/services"
              className="text-sm font-mono text-foreground-subtle hover:text-foreground transition-colors"
            >
              services
            </Link>
            <Link
              href="/portfolio"
              className="text-sm font-mono text-foreground-subtle hover:text-foreground transition-colors"
            >
              portfolio
            </Link>
            <Link
              href="/about"
              className="text-sm font-mono text-foreground-subtle hover:text-foreground transition-colors"
            >
              about
            </Link>
            <Link
              href="/blog"
              className="text-sm font-mono text-foreground-subtle hover:text-foreground transition-colors"
            >
              blog
            </Link>
          </nav>

          {/* Desktop Auth Buttons, CTA & Theme Toggle */}
          <div className="hidden md:flex items-center gap-4">
            <ThemeToggle />
            {session ? (
              <>
                <span className="text-sm font-mono text-foreground-subtle">
                  Hi, <span className="text-foreground font-semibold">{session.user?.name || session.user?.email}</span>
                </span>
                <Button href="/account" variant="outline" size="sm">
                  Dashboard
                </Button>
                <Button onClick={() => signOut()} variant="secondary" size="sm">
                  Log Out
                </Button>
              </>
            ) : (
              <>
                <Button href="/auth/signin" variant="outline" size="sm">
                  Login
                </Button>
                <Button href="/auth/signup" variant="primary" size="sm">
                  Sign Up
                </Button>
              </>
            )}
            <CodeCTA functionName="contact" href="/contact" size="sm" />
          </div>

          {/* Mobile Menu */}
          <MobileMenu />
        </div>
      </Container>
    </header>
  );
}
