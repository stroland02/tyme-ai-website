"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Container } from "../layout/Container";
import { CodeCTA } from "../ui/CodeCTA";
import { CodeLabel } from "../ui/CodeLabel";

gsap.registerPlugin(ScrollTrigger);

export function CTA() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const orb1Ref = useRef<HTMLDivElement>(null);
  const orb2Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate the card scaling in
      gsap.from(cardRef.current, {
        scale: 0.9,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: cardRef.current,
          start: "top 80%",
        },
      });

      // Animate content with stagger
      gsap.from([contentRef.current?.children].flat(), {
        opacity: 0,
        y: 30,
        duration: 0.8,
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: {
          trigger: contentRef.current,
          start: "top 70%",
        },
      });

      // Animate decorative orbs
      gsap.to(orb1Ref.current, {
        x: 20,
        y: -20,
        scale: 1.2,
        duration: 4,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      gsap.to(orb2Ref.current, {
        x: -20,
        y: 20,
        scale: 1.3,
        duration: 5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-20 md:py-32">
      <Container>
        <div
          ref={cardRef}
          className="relative overflow-hidden rounded-xl border border-border bg-gradient-to-br from-blue-600/10 to-purple-600/10 px-8 py-16 md:px-16 md:py-24"
        >
          <div
            ref={contentRef}
            className="relative z-10 mx-auto max-w-3xl"
          >
            <CodeLabel index="03" className="mb-6">ready.to.start()</CodeLabel>
            <h2 className="mb-6 text-3xl font-bold sm:text-4xl md:text-5xl">
              Let's build something great.
            </h2>
            <p className="mb-8 text-lg text-foreground-muted md:text-xl font-light">
              Free consultation. Custom solutions. Real results.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row">
              <CodeCTA
                functionName="startProject"
                href="/contact"
                size="lg"
                variant="primary"
              />
              <CodeCTA
                functionName="viewPortfolio"
                href="/portfolio"
                size="lg"
                variant="secondary"
              />
            </div>
          </div>

          {/* Decorative gradient orbs */}
          <div
            ref={orb1Ref}
            className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-blue-500/20 blur-3xl pointer-events-none"
          />
          <div
            ref={orb2Ref}
            className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-purple-500/20 blur-3xl pointer-events-none"
          />
        </div>
      </Container>
    </section>
  );
}
