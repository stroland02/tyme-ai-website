"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Container } from "../layout/Container";
import { CodeCTA } from "../ui/CodeCTA";
import { CodeLabel } from "../ui/CodeLabel";
import { SyntaxHighlight } from "../ui/SyntaxHighlight";
import { AnimatedGrid } from "../ui/AnimatedGrid";
import { ParticleBackground } from "../ui/ParticleBackground";

gsap.registerPlugin(ScrollTrigger);

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subheadlineRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
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
        );

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
        <div className="relative z-10 mx-auto max-w-5xl">
          {/* Code-style label */}
          <div ref={badgeRef} className="mb-8">
            <CodeLabel index="01">AI & Web Development</CodeLabel>
          </div>

          {/* Main Headline - Code aesthetic */}
          <div className="mb-8 space-y-4">
            <div ref={headlineRef}>
              <SyntaxHighlight type="const" className="mb-4 text-base md:text-lg">
                mission = &#123;
              </SyntaxHighlight>
              <h1 className="ml-4 md:ml-8 text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-tight">
                <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent glow-text">
                  Custom AI solutions.
                </span>
                <span className="block bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent glow-text">
                  Real business results.
                </span>
              </h1>
              <SyntaxHighlight type="const" className="mt-4 text-base md:text-lg">
                &#125;
              </SyntaxHighlight>
            </div>
          </div>

          {/* Subheadline */}
          <p
            ref={subheadlineRef}
            className="mb-12 ml-4 md:ml-8 max-w-2xl text-base text-foreground-muted sm:text-lg md:text-xl font-light"
          >
            We build custom automation software and modern web solutions for businesses ready to scale.
          </p>

          {/* CTA Buttons - Code style */}
          <div
            ref={ctaRef}
            className="flex flex-col gap-4 sm:flex-row sm:items-center ml-4 md:ml-8"
          >
            <CodeCTA functionName="getStarted" href="/contact" size="lg" />
            <CodeCTA
              functionName="viewWork"
              href="/portfolio"
              variant="secondary"
              size="lg"
            />
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
