import Link from "next/link";
import { Container } from "./Container";

export function Footer() {
  return (
    <footer className="border-t border-foreground/10 bg-background">
      <Container>
        <div className="py-12 md:py-16">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
            {/* Company Info */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold">Tyme AI</h3>
              <p className="text-sm text-foreground/60">
                AI/ML solutions for modern businesses
              </p>
            </div>

            {/* Services */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold">Services</h4>
              <ul className="space-y-2 text-sm text-foreground/60">
                <li>
                  <Link href="/services" className="hover:text-foreground">
                    AI Consulting
                  </Link>
                </li>
                <li>
                  <Link href="/services" className="hover:text-foreground">
                    Custom AI Development
                  </Link>
                </li>
                <li>
                  <Link href="/services" className="hover:text-foreground">
                    AI Integration
                  </Link>
                </li>
                <li>
                  <Link href="/services" className="hover:text-foreground">
                    Automation
                  </Link>
                </li>
              </ul>
            </div>

            {/* Company */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold">Company</h4>
              <ul className="space-y-2 text-sm text-foreground/60">
                <li>
                  <Link href="/about" className="hover:text-foreground">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="/portfolio" className="hover:text-foreground">
                    Portfolio
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="hover:text-foreground">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-foreground">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold">Legal</h4>
              <ul className="space-y-2 text-sm text-foreground/60">
                <li>
                  <Link href="/privacy" className="hover:text-foreground">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-foreground">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="mt-12 border-t border-foreground/10 pt-8 text-center text-sm text-foreground/60">
            <p>&copy; {new Date().getFullYear()} Tyme AI. All rights reserved.</p>
          </div>
        </div>
      </Container>
    </footer>
  );
}
