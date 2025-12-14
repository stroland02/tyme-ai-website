"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CodeLabel } from "../ui/CodeLabel";
import { CodeCTA } from "../ui/CodeCTA";

gsap.registerPlugin(ScrollTrigger);

const services = [
  {
    title: "Custom Web Applications",
    description:
      "Full-stack web application development using modern frameworks like Next.js, React, and Django for scalable solutions.",
    icon: "💻",
    category: "web",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    title: "AI/ML Consulting",
    description:
      "Strategic guidance to identify AI opportunities and develop implementation roadmaps tailored to your business goals.",
    icon: "🎯",
    category: "ai",
    gradient: "from-purple-500 to-pink-500",
  },
  {
    title: "E-commerce Solutions",
    description:
      "Build powerful online stores with integrated payment systems, inventory management, and seamless user experiences.",
    icon: "🛒",
    category: "web",
    gradient: "from-green-500 to-emerald-500",
  },
  {
    title: "Custom AI Development",
    description:
      "Build bespoke machine learning models and AI systems designed specifically for your unique use cases.",
    icon: "🤖",
    category: "ai",
    gradient: "from-orange-500 to-red-500",
  },
  {
    title: "Website Design & Development",
    description:
      "Modern, responsive, and high-performance websites that drive engagement and convert visitors into customers.",
    icon: "🎨",
    category: "web",
    gradient: "from-pink-500 to-rose-500",
  },
  {
    title: "Automation Solutions",
    description:
      "Automate repetitive tasks and workflows using AI to increase efficiency and reduce operational costs.",
    icon: "⚡",
    category: "ai",
    gradient: "from-yellow-500 to-orange-500",
  },
  {
    title: "API Development & Integration",
    description:
      "RESTful APIs, third-party integrations, and microservices architecture to connect your systems seamlessly.",
    icon: "🔗",
    category: "web",
    gradient: "from-indigo-500 to-blue-500",
  },
  {
    title: "Data Analysis & Insights",
    description:
      "Transform raw data into actionable insights using advanced analytics and machine learning techniques.",
    icon: "📊",
    category: "ai",
    gradient: "from-teal-500 to-cyan-500",
  },
];

export function ServicesOverview() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const cardsWrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate section header
      gsap.from(headerRef.current, {
        opacity: 0,
        y: 40,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: headerRef.current,
          start: "top 80%",
        },
      });

      // Horizontal scroll animation with centered cards
      const cards = gsap.utils.toArray(".horizontal-card");
      const scrollContainer = scrollContainerRef.current;
      const cardsWrapper = cardsWrapperRef.current;

      if (scrollContainer && cardsWrapper && cards.length > 0) {
        // Calculate the distance needed to scroll
        // We want to center cards, so we need extra space on both sides
        const cardWidth = 380; // Card width from the component
        const gap = 24; // 6 unit gap (6 * 4px = 24px)
        const viewportWidth = window.innerWidth;

        // Calculate starting position to center first card
        const startOffset = (viewportWidth - cardWidth) / 2;

        // Set initial position to center first card
        gsap.set(cardsWrapper, { x: startOffset });

        // Calculate total scroll distance
        // Each card should end up centered, so we scroll card width + gap for each transition
        const totalCards = cards.length + 1; // +1 for the CTA card
        const scrollWidth = (cardWidth + gap) * (totalCards - 1);

        gsap.to(cardsWrapper, {
          x: -(scrollWidth - startOffset),
          ease: "none",
          scrollTrigger: {
            trigger: scrollContainer,
            start: "top 10%", // Start pinning when section is near top but not cut off
            end: () => `+=${scrollWidth * 2}`, // Longer scroll for smoother experience
            scrub: 1,
            pin: true,
            pinSpacing: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        // Animate cards on reveal with scale effect based on position
        cards.forEach((card, index) => {
          gsap.from(card as HTMLElement, {
            opacity: 0,
            scale: 0.8,
            duration: 0.6,
            scrollTrigger: {
              trigger: scrollContainer,
              start: "top center",
              end: "bottom top",
            },
            delay: index * 0.1,
          });
        });
      }

      // Add hover animations for cards
      const cardElements = document.querySelectorAll(".horizontal-card");
      cardElements.forEach((card) => {
        const icon = card.querySelector(".service-icon");
        const gradientBg = card.querySelector(".gradient-bg");

        card.addEventListener("mouseenter", () => {
          gsap.to(icon, {
            scale: 1.2,
            rotation: 10,
            duration: 0.4,
            ease: "back.out(1.7)",
          });
          gsap.to(gradientBg, {
            opacity: 0.15,
            duration: 0.3,
          });
          gsap.to(card, {
            scale: 1.05,
            duration: 0.3,
            ease: "power2.out",
          });
        });

        card.addEventListener("mouseleave", () => {
          gsap.to(icon, {
            scale: 1,
            rotation: 0,
            duration: 0.3,
            ease: "power2.inOut",
          });
          gsap.to(gradientBg, {
            opacity: 0.05,
            duration: 0.3,
          });
          gsap.to(card, {
            scale: 1,
            duration: 0.3,
            ease: "power2.out",
          });
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-20 md:py-32 overflow-hidden">
      {/* Pinnable Container - includes header and cards */}
      <div ref={scrollContainerRef} className="relative">
        {/* Section Header */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
          <div ref={headerRef} className="mx-auto max-w-3xl">
            <CodeLabel index="02" className="mb-6">services.map()</CodeLabel>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl mb-4">
              What We Build
            </h2>
            <p className="text-lg text-foreground-muted font-mono">
              <span className="text-foreground-ghost">// </span>Scroll to explore →
            </p>
          </div>
        </div>

        {/* Horizontal Scrolling Cards */}
        <div className="relative overflow-hidden flex items-center" style={{ minHeight: '600px' }}>
        <div
          ref={cardsWrapperRef}
          className="flex gap-6"
          style={{ width: "max-content" }}
        >
          {services.map((service, index) => (
            <div
              key={service.title}
              className="horizontal-card group relative flex-shrink-0 w-[380px] h-[480px] rounded-xl border border-border bg-background p-8 transition-all hover:border-foreground-ghost hover:shadow-2xl hover:shadow-primary/10 cursor-pointer overflow-hidden my-auto"
            >
              {/* Gradient Background */}
              <div
                className={`gradient-bg absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-[0.03] transition-opacity`}
              />

              {/* Content */}
              <div className="relative z-10 h-full flex flex-col">
                {/* Code-style index */}
                <div className="mb-6">
                  <span className="font-mono text-xs text-foreground-ghost tracking-wider">
                    {String(index + 1).padStart(2, "0")} // {service.category}
                  </span>
                </div>

                {/* Icon */}
                <div className="service-icon mb-6 text-5xl opacity-80">{service.icon}</div>

                {/* Title */}
                <h3 className="mb-4 text-xl font-bold tracking-tight">{service.title}</h3>

                {/* Description */}
                <p className="text-foreground-muted text-sm leading-relaxed flex-grow">{service.description}</p>

                {/* Arrow - code style */}
                <div className="mt-6 flex items-center text-sm font-mono text-foreground-subtle group-hover:text-foreground group-hover:gap-2 transition-all">
                  <span>explore()</span>
                  <span className="inline-block group-hover:translate-x-1 transition-transform">
                    →
                  </span>
                </div>
              </div>
            </div>
          ))}

          {/* End CTA Card */}
          <div className="flex-shrink-0 w-[380px] h-[480px] rounded-xl border border-dashed border-border bg-foreground-dim/50 p-8 flex items-center justify-center my-auto">
            <div className="text-center">
              <div className="font-mono text-sm text-foreground-ghost mb-4">
                export &#123;
              </div>
              <h3 className="text-2xl font-bold mb-4">Ready to build?</h3>
              <p className="text-foreground-muted mb-8 text-sm">
                Explore our portfolio and start your project
              </p>
              <CodeCTA functionName="viewAll" href="/services" variant="primary" />
              <div className="font-mono text-sm text-foreground-ghost mt-4">
                &#125;
              </div>
            </div>
          </div>
        </div>
        </div>

        {/* Scroll Hint */}
        <div className="mt-12 text-center">
          <p className="text-sm text-foreground-ghost font-mono flex items-center justify-center gap-2">
            <span>// scroll horizontally</span>
            <span className="inline-block animate-pulse">→</span>
          </p>
        </div>
      </div>
    </section>
  );
}
