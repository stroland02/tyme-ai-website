import Link from "next/link";
import { Container } from "./Container";
import { Button } from "../ui/Button";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-foreground/10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <Container>
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="text-xl font-bold">
            Tyme AI
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/services"
              className="text-sm font-medium transition-colors hover:text-foreground/80"
            >
              Services
            </Link>
            <Link
              href="/portfolio"
              className="text-sm font-medium transition-colors hover:text-foreground/80"
            >
              Portfolio
            </Link>
            <Link
              href="/about"
              className="text-sm font-medium transition-colors hover:text-foreground/80"
            >
              About
            </Link>
            <Link
              href="/blog"
              className="text-sm font-medium transition-colors hover:text-foreground/80"
            >
              Blog
            </Link>
          </nav>

          {/* CTA Button */}
          <div className="flex items-center gap-4">
            <Button href="/contact" size="sm">
              Get Quote
            </Button>
          </div>
        </div>
      </Container>
    </header>
  );
}
