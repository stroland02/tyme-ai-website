import Link from "next/link";
import Image from "next/image";
import { Container } from "./Container";
import { Logo } from "../ui/Logo";

export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <Container>
        <div className="py-8 md:py-12 lg:py-16">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4">
            {/* Company Info */}
            <div className="space-y-4">
              <Logo size={72} showText={true} showImage={false} />
              <p className="text-sm text-foreground-muted">
                AI & Web solutions for modern businesses
              </p>
              <div className="pt-2">
                <Image
                  src="/logo.png"
                  alt="Tyme AI Logo"
                  width={200}
                  height={200}
                  className="object-contain w-full max-w-[200px] opacity-90 hover:opacity-100 transition-opacity duration-300"
                />
              </div>
            </div>

            {/* Services */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold font-mono text-foreground-subtle">// Services</h4>
              <ul className="space-y-2 text-sm text-foreground-muted font-mono">
                <li>
                  <Link href="/services" className="hover:text-foreground transition-colors">
                    webDev
                  </Link>
                </li>
                <li>
                  <Link href="/services" className="hover:text-foreground transition-colors">
                    ecommerce
                  </Link>
                </li>
                <li>
                  <Link href="/services" className="hover:text-foreground transition-colors">
                    aiMl
                  </Link>
                </li>
                <li>
                  <Link href="/services" className="hover:text-foreground transition-colors">
                    automation
                  </Link>
                </li>
              </ul>
            </div>

            {/* Company */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold font-mono text-foreground-subtle">// Company</h4>
              <ul className="space-y-2 text-sm text-foreground-muted font-mono">
                <li>
                  <Link href="/about" className="hover:text-foreground transition-colors">
                    about
                  </Link>
                </li>
                <li>
                  <Link href="/portfolio" className="hover:text-foreground transition-colors">
                    portfolio
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="hover:text-foreground transition-colors">
                    blog
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-foreground transition-colors">
                    contact
                  </Link>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold font-mono text-foreground-subtle">// Legal</h4>
              <ul className="space-y-2 text-sm text-foreground-muted font-mono">
                <li>
                  <Link href="/privacy" className="hover:text-foreground transition-colors">
                    privacy.md
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-foreground transition-colors">
                    terms.md
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="mt-8 md:mt-12 border-t border-border-subtle pt-6 md:pt-8 text-sm text-foreground-ghost">
            <div className="flex flex-col md:flex-row justify-between items-center gap-2 text-center md:text-left">
              <p className="font-mono text-xs">
                © {new Date().getFullYear()} Tyme AI. All rights reserved.
              </p>
              <p className="font-mono text-xs">
                Based in Dover, New Hampshire
              </p>
              <p className="font-mono text-xs">
                built by Sebastian Roland
              </p>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
}
