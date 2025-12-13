"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Container } from "../layout/Container";
import { Button } from "../ui/Button";
import { AnimatedGrid } from "../ui/AnimatedGrid";
import { ParticleBackground } from "../ui/ParticleBackground";

gsap.registerPlugin(ScrollTrigger);

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subheadlineRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const socialProofRef = useRef<HTMLDivElement>(null);
  const orb1Ref = useRef<HTMLDivElement>(null);
  const orb2Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Timeline for staggered entrance animations
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.from(badgeRef.current, {
        opacity: 0,
        y: 30,
        duration: 0.8,
      })
        .from(
          headlineRef.current,
          {
            opacity: 0,
            y: 40,
            duration: 1,
          },
          "-=0.5"
        )
        .from(
          subheadlineRef.current,
          {
            opacity: 0,
            y: 30,
            duration: 0.8,
          },
          "-=0.6"
        )
        .from(
          ctaRef.current,
          {
            opacity: 0,
            y: 30,
            duration: 0.8,
          },
          "-=0.5"
        )
        .from(
          socialProofRef.current,
          {
            opacity: 0,
            y: 20,
            duration: 0.8,
          },
          "-=0.4"
        );

      // Animate logo placeholders
      gsap.from(".logo-placeholder", {
        opacity: 0,
        scale: 0.8,
        duration: 0.5,
        stagger: 0.1,
        ease: "back.out(1.7)",
        scrollTrigger: {
          trigger: socialProofRef.current,
          start: "top 80%",
        },
      });

      // Floating background orbs
      if (orb1Ref.current) {
        gsap.to(orb1Ref.current, {
          scale: 1.2,
          opacity: 0.5,
          duration: 8,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      }

      if (orb2Ref.current) {
        gsap.to(orb2Ref.current, {
          scale: 1.3,
          opacity: 0.5,
          duration: 10,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative py-20 md:py-32 overflow-hidden"
    >
      {/* Animated Backgrounds */}
      <div className="absolute inset-0 z-0">
        <AnimatedGrid />
        <ParticleBackground />
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background z-0" />

      <Container>
        <div className="relative z-10 mx-auto max-w-4xl text-center">
          {/* Badge/Label */}
          <div
            ref={badgeRef}
            className="mb-6 inline-flex items-center rounded-full border border-foreground/20 px-4 py-1.5 text-sm"
          >
            <span className="text-foreground/60">
              AI & Web Development Solutions
            </span>
          </div>

          {/* Main Headline */}
          <h1
            ref={headlineRef}
            className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl leading-tight"
          >
            <span className="block">Transform Your Business With</span>
            <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              AI-Powered & Modern Web
            </span>
            <span className="block">Solutions</span>
          </h1>

          {/* Subheadline */}
          <p
            ref={subheadlineRef}
            className="mb-10 text-lg text-foreground/60 sm:text-xl md:text-2xl"
          >
            Custom AI/ML development, modern web applications, e-commerce
            solutions, and automation services to help you scale faster and
            smarter.
          </p>

          {/* CTA Buttons */}
          <div
            ref={ctaRef}
            className="flex flex-col gap-4 sm:flex-row sm:justify-center"
          >
            <div className="cta-button">
              <Button href="/contact" size="lg">
                Get Started
              </Button>
            </div>
            <div className="cta-button">
              <Button href="/portfolio" variant="outline" size="lg">
                View Our Work
              </Button>
            </div>
          </div>

          {/* Social Proof */}
          <div ref={socialProofRef} className="mt-16 text-sm text-foreground/60">
            <p className="mb-4">Trusted by innovative companies</p>
            <div className="flex flex-wrap items-center justify-center gap-8">
              {/* Placeholder for client logos */}
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="logo-placeholder h-8 w-24 rounded bg-foreground/5 hover:bg-foreground/10 transition-colors cursor-pointer"
                />
              ))}
            </div>
          </div>
        </div>
      </Container>

      {/* Background gradient orbs */}
      <div
        ref={orb1Ref}
        className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl pointer-events-none"
        style={{ opacity: 0.3 }}
      />
      <div
        ref={orb2Ref}
        className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-purple-500/10 blur-3xl pointer-events-none"
        style={{ opacity: 0.3 }}
      />
    </section>
  );
}
