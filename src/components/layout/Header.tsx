import Link from "next/link";
import { Container } from "./Container";
import { CodeCTA } from "../ui/CodeCTA";
import { MobileMenu } from "./MobileMenu";
import { Logo } from "../ui/Logo";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-xl">
      <Container>
        <div className="flex h-20 md:h-24 items-center justify-between gap-4">
          {/* Logo with Spaceship */}
          <Link href="/" className="hover:opacity-80 transition-opacity flex-shrink-0">
            <Logo size={80} showText={true} animateGradient={true} />
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

          {/* Desktop CTA Button */}
          <div className="hidden md:flex items-center gap-4">
            <CodeCTA functionName="contact" href="/contact" size="sm" />
          </div>

          {/* Mobile Menu */}
          <MobileMenu />
        </div>
      </Container>
    </header>
  );
}
