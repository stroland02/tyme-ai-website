import Link from "next/link";
import { Container } from "../layout/Container";
import { Button } from "../ui/Button";

export function CTA() {
  return (
    <section className="py-20 md:py-32">
      <Container>
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-16 md:px-16 md:py-24">
          <div className="relative z-10 mx-auto max-w-3xl text-center">
            <h2 className="mb-6 text-3xl font-bold text-white sm:text-4xl md:text-5xl">
              Ready to Transform Your Business?
            </h2>
            <p className="mb-8 text-lg text-white/90 md:text-xl">
              Let's discuss how AI can help you achieve your goals. Get a free
              consultation and project quote today.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button
                href="/contact"
                size="lg"
                className="bg-white text-black hover:bg-white/90"
              >
                Get Free Consultation
              </Button>
              <Button
                href="/portfolio"
                variant="outline"
                size="lg"
                className="border-white text-white hover:bg-white/10"
              >
                See Case Studies
              </Button>
            </div>
          </div>

          {/* Decorative Elements */}
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
        </div>
      </Container>
    </section>
  );
}
