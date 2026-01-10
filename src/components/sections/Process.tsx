"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Container } from "../layout/Container";
import { CodeLabel } from "../ui/CodeLabel";
import { SyntaxHighlight } from "../ui/SyntaxHighlight";

gsap.registerPlugin(ScrollTrigger);

const steps = [
  {
    id: "01",
    phase: "Analyze",
    func: "ingestData()",
    desc: "We deep dive into your existing infrastructure, auditing data integrity and identifying bottlenecks in your current workflows.",
    output: "return { bottlenecks, dataSchema }",
  },
  {
    id: "02",
    phase: "Architect",
    func: "designSystem()",
    desc: "We design a professional-grade architecture, selecting the right mix of AI models and robust enterprise frameworks (DevExpress/WinForms).",
    output: "return { architecture, techStack }",
  },
  {
    id: "03",
    phase: "Execute",
    func: "deploySolution()",
    desc: "We build and deploy the solution in a fixed timeline sprint. Rigorous testing ensures production-readiness from day one.",
    output: "return { productionReady: true }",
  },
];

export function Process() {
  const sectionRef = useRef<HTMLElement>(null);
  const stepsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      stepsRef.current.forEach((step, index) => {
        gsap.from(step, {
          opacity: 0,
          y: 50,
          duration: 0.8,
          delay: index * 0.2,
          scrollTrigger: {
            trigger: step,
            start: "top 85%",
          },
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-20 md:py-32 border-t border-border bg-background/50">
      <Container>
        <div className="mb-16 md:mb-24">
          <CodeLabel index="SYS">system.process</CodeLabel>
          <h2 className="mt-6 text-3xl md:text-5xl font-bold tracking-tight">
            The <span className="text-primary glow-text">Sprint</span> Methodology
          </h2>
          <p className="mt-4 text-xl text-foreground-muted max-w-2xl font-light">
            We don't do endless consulting. We follow a strict, code-driven process to deliver tangible value in weeks, not months.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 relative">
          {/* Connector Line (Desktop) */}
          <div className="hidden lg:block absolute top-12 left-0 w-full h-0.5 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-blue-600/20 z-0" />

          {steps.map((step, index) => (
            <div
              key={step.id}
              ref={(el) => {
                if (el) stepsRef.current[index] = el;
              }}
              className="relative z-10 bg-background border border-border p-8 rounded-xl hover:border-primary/50 transition-colors duration-300 group"
            >
              <div className="flex items-center justify-between mb-6">
                <span className="text-4xl font-bold text-foreground-ghost/20 group-hover:text-primary/20 transition-colors">
                  {step.id}
                </span>
                <div className="px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-mono text-primary">
                  {step.phase}
                </div>
              </div>

              <div className="space-y-4">
                <SyntaxHighlight type="function" className="text-lg">
                  {step.func}
                </SyntaxHighlight>
                <p className="text-foreground-muted leading-relaxed min-h-[80px]">
                  {step.desc}
                </p>
                <div className="pt-4 border-t border-border/50">
                   <p className="font-mono text-xs text-green-500">
                     {`// Output: ${step.output}`}
                   </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
