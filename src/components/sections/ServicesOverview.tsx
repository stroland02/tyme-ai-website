"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Container } from "../layout/Container";

gsap.registerPlugin(ScrollTrigger);

const services = [
  {
    title: "Custom Web Applications",
    description:
      "Full-stack web application development using modern frameworks like Next.js, React, and Django for scalable solutions.",
    icon: "💻",
    category: "web",
  },
  {
    title: "AI/ML Consulting",
    description:
      "Strategic guidance to identify AI opportunities and develop implementation roadmaps tailored to your business goals.",
    icon: "🎯",
    category: "ai",
  },
  {
    title: "E-commerce Solutions",
    description:
      "Build powerful online stores with integrated payment systems, inventory management, and seamless user experiences.",
    icon: "🛒",
    category: "web",
  },
  {
    title: "Custom AI Development",
    description:
      "Build bespoke machine learning models and AI systems designed specifically for your unique use cases.",
    icon: "🤖",
    category: "ai",
  },
  {
    title: "Website Design & Development",
    description:
      "Modern, responsive, and high-performance websites that drive engagement and convert visitors into customers.",
    icon: "🎨",
    category: "web",
  },
  {
    title: "Automation Solutions",
    description:
      "Automate repetitive tasks and workflows using AI to increase efficiency and reduce operational costs.",
    icon: "⚡",
    category: "ai",
  },
  {
    title: "API Development & Integration",
    description:
      "RESTful APIs, third-party integrations, and microservices architecture to connect your systems seamlessly.",
    icon: "🔗",
    category: "web",
  },
  {
    title: "Data Analysis & Insights",
    description:
      "Transform raw data into actionable insights using advanced analytics and machine learning techniques.",
    icon: "📊",
    category: "ai",
  },
];

export function ServicesOverview() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

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

      // Stagger animate service cards
      gsap.from(".service-card", {
        opacity: 0,
        y: 60,
        scale: 0.95,
        duration: 0.8,
        stagger: {
          amount: 0.6,
          from: "start",
        },
        ease: "power3.out",
        scrollTrigger: {
          trigger: gridRef.current,
          start: "top 80%",
        },
      });

      // Animate CTA link
      gsap.from(".services-cta", {
        opacity: 0,
        y: 20,
        duration: 0.6,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".services-cta",
          start: "top 90%",
        },
      });

      // Add hover animations for cards
      const cards = document.querySelectorAll(".service-card");
      cards.forEach((card) => {
        const icon = card.querySelector(".service-icon");
        const arrow = card.querySelector(".service-arrow");

        card.addEventListener("mouseenter", () => {
          gsap.to(icon, {
            scale: 1.1,
            rotation: 5,
            duration: 0.3,
            ease: "back.out(1.7)",
          });
          gsap.to(card, {
            y: -8,
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
          gsap.to(card, {
            y: 0,
            duration: 0.3,
            ease: "power2.out",
          });
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="py-20 md:py-32 bg-foreground/[0.02]"
    >
      <Container>
        {/* Section Header */}
        <div
          ref={headerRef}
          className="mx-auto max-w-3xl text-center mb-16"
        >
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl mb-4">
            Our Services
          </h2>
          <p className="text-lg text-foreground/60">
            End-to-end AI and web development solutions to help you innovate and
            compete in the modern market
          </p>
        </div>

        {/* Services Grid */}
        <div
          ref={gridRef}
          className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3"
        >
          {services.map((service) => (
            <div
              key={service.title}
              className="service-card group relative rounded-2xl border border-foreground/10 bg-background p-8 transition-all hover:border-foreground/20 hover:shadow-lg cursor-pointer"
            >
              {/* Icon */}
              <div className="service-icon mb-4 text-4xl">{service.icon}</div>

              {/* Title */}
              <h3 className="mb-3 text-xl font-semibold">{service.title}</h3>

              {/* Description */}
              <p className="text-foreground/60">{service.description}</p>

              {/* Hover Arrow */}
              <div className="service-arrow mt-4 text-sm font-medium opacity-0 transition-opacity group-hover:opacity-100">
                Learn more →
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="services-cta mt-12 text-center">
          <Link
            href="/services"
            className="text-base font-medium hover:underline inline-block"
          >
            View all services →
          </Link>
        </div>
      </Container>
    </section>
  );
}
