"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

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

      // Horizontal scroll animation
      const cards = gsap.utils.toArray(".horizontal-card");
      const scrollContainer = scrollContainerRef.current;
      const cardsWrapper = cardsWrapperRef.current;

      if (scrollContainer && cardsWrapper && cards.length > 0) {
        const scrollWidth = cardsWrapper.scrollWidth - scrollContainer.offsetWidth;

        gsap.to(cardsWrapper, {
          x: -scrollWidth,
          ease: "none",
          scrollTrigger: {
            trigger: scrollContainer,
            start: "top top",
            end: () => `+=${scrollWidth}`,
            scrub: 1,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        // Animate cards on reveal
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
      {/* Section Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div ref={headerRef} className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl mb-4">
            Our Services
          </h2>
          <p className="text-lg text-foreground/60">
            Scroll to explore our end-to-end AI and web development solutions
          </p>
        </div>
      </div>

      {/* Horizontal Scrolling Container */}
      <div ref={scrollContainerRef} className="relative overflow-hidden">
        <div
          ref={cardsWrapperRef}
          className="flex gap-6 px-4 sm:px-6 lg:px-8"
          style={{ width: "max-content" }}
        >
          {services.map((service, index) => (
            <div
              key={service.title}
              className="horizontal-card group relative flex-shrink-0 w-[380px] h-[480px] rounded-3xl border border-foreground/10 bg-background p-8 transition-all hover:border-foreground/20 hover:shadow-2xl cursor-pointer overflow-hidden"
            >
              {/* Gradient Background */}
              <div
                className={`gradient-bg absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-[0.05] transition-opacity`}
              />

              {/* Content */}
              <div className="relative z-10 h-full flex flex-col">
                {/* Category Badge */}
                <div className="mb-4">
                  <span className="inline-block px-3 py-1 text-xs font-semibold rounded-full bg-foreground/5 text-foreground/60">
                    {service.category.toUpperCase()}
                  </span>
                </div>

                {/* Icon */}
                <div className="service-icon mb-6 text-6xl">{service.icon}</div>

                {/* Title */}
                <h3 className="mb-4 text-2xl font-bold">{service.title}</h3>

                {/* Description */}
                <p className="text-foreground/60 flex-grow">{service.description}</p>

                {/* Arrow */}
                <div className="mt-6 flex items-center text-sm font-medium group-hover:gap-2 transition-all">
                  <span>Learn more</span>
                  <span className="inline-block group-hover:translate-x-1 transition-transform">
                    →
                  </span>
                </div>

                {/* Number Badge */}
                <div className="absolute top-8 right-8 text-7xl font-bold text-foreground/5">
                  {String(index + 1).padStart(2, "0")}
                </div>
              </div>
            </div>
          ))}

          {/* End CTA Card */}
          <div className="flex-shrink-0 w-[380px] h-[480px] rounded-3xl border-2 border-dashed border-foreground/20 bg-foreground/[0.02] p-8 flex items-center justify-center">
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-4">Want to see more?</h3>
              <p className="text-foreground/60 mb-6">
                Explore our full range of services and case studies
              </p>
              <Link
                href="/services"
                className="inline-block px-6 py-3 bg-foreground text-background rounded-full font-medium hover:bg-foreground/90 transition-colors"
              >
                View All Services
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Hint */}
      <div className="mt-12 text-center">
        <p className="text-sm text-foreground/40 flex items-center justify-center gap-2">
          <span>Scroll horizontally</span>
          <span className="inline-block animate-pulse">→</span>
        </p>
      </div>
    </section>
  );
}
