import Link from "next/link";
import { Container } from "../layout/Container";
import { Button } from "../ui/Button";

export function Hero() {
  return (
    <section className="relative py-20 md:py-32">
      <Container>
        <div className="mx-auto max-w-4xl text-center">
          {/* Badge/Label */}
          <div className="mb-6 inline-flex items-center rounded-full border border-foreground/20 px-4 py-1.5 text-sm">
            <span className="text-foreground/60">AI & Web Development Solutions</span>
          </div>

          {/* Main Headline */}
          <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            Transform Your Business with{" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              AI-Powered & Modern Web
            </span>{" "}
            Solutions
          </h1>

          {/* Subheadline */}
          <p className="mb-10 text-lg text-foreground/60 sm:text-xl md:text-2xl">
            Custom AI/ML development, modern web applications, e-commerce solutions,
            and automation services to help you scale faster and smarter.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Button href="/contact" size="lg">
              Get Started
            </Button>
            <Button href="/portfolio" variant="outline" size="lg">
              View Our Work
            </Button>
          </div>

          {/* Social Proof */}
          <div className="mt-16 text-sm text-foreground/60">
            <p className="mb-4">Trusted by innovative companies</p>
            <div className="flex flex-wrap items-center justify-center gap-8">
              {/* Placeholder for client logos */}
              <div className="h-8 w-24 rounded bg-foreground/5" />
              <div className="h-8 w-24 rounded bg-foreground/5" />
              <div className="h-8 w-24 rounded bg-foreground/5" />
              <div className="h-8 w-24 rounded bg-foreground/5" />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
