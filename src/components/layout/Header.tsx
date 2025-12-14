import Link from "next/link";
import { Container } from "./Container";
import { CodeCTA } from "../ui/CodeCTA";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-xl">
      <Container>
        <div className="flex h-16 items-center justify-between">
          {/* Logo - Code style */}
          <Link href="/" className="font-mono text-lg font-bold hover:text-foreground-muted transition-colors">
            <span className="text-foreground-subtle">&lt;</span>
            Tyme AI
            <span className="text-foreground-subtle">/&gt;</span>
          </Link>

          {/* Navigation */}
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

          {/* CTA Button */}
          <div className="flex items-center gap-4">
            <CodeCTA functionName="contact" href="/contact" size="sm" />
          </div>
        </div>
      </Container>
    </header>
  );
}
