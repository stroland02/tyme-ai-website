import Link from "next/link";
import { Container } from "../layout/Container";

const services = [
  {
    title: "AI/ML Consulting",
    description:
      "Strategic guidance to identify AI opportunities and develop implementation roadmaps tailored to your business goals.",
    icon: "🎯",
  },
  {
    title: "Custom AI Development",
    description:
      "Build bespoke machine learning models and AI systems designed specifically for your unique use cases.",
    icon: "🤖",
  },
  {
    title: "AI Integration",
    description:
      "Seamlessly integrate AI capabilities into your existing systems and workflows with minimal disruption.",
    icon: "🔗",
  },
  {
    title: "Automation Solutions",
    description:
      "Automate repetitive tasks and workflows using AI to increase efficiency and reduce operational costs.",
    icon: "⚡",
  },
  {
    title: "Data Analysis & Insights",
    description:
      "Transform raw data into actionable insights using advanced analytics and machine learning techniques.",
    icon: "📊",
  },
  {
    title: "AI System Optimization",
    description:
      "Improve performance, accuracy, and efficiency of your existing AI systems through expert optimization.",
    icon: "🚀",
  },
];

export function ServicesOverview() {
  return (
    <section className="py-20 md:py-32 bg-foreground/[0.02]">
      <Container>
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl mb-4">
            Our Services
          </h2>
          <p className="text-lg text-foreground/60">
            End-to-end AI solutions to help you innovate and compete in the modern market
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <div
              key={service.title}
              className="group relative rounded-2xl border border-foreground/10 bg-background p-8 transition-all hover:border-foreground/20 hover:shadow-lg"
            >
              {/* Icon */}
              <div className="mb-4 text-4xl">{service.icon}</div>

              {/* Title */}
              <h3 className="mb-3 text-xl font-semibold">{service.title}</h3>

              {/* Description */}
              <p className="text-foreground/60">{service.description}</p>

              {/* Hover Arrow */}
              <div className="mt-4 text-sm font-medium opacity-0 transition-opacity group-hover:opacity-100">
                Learn more →
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <Link
            href="/services"
            className="text-base font-medium hover:underline"
          >
            View all services →
          </Link>
        </div>
      </Container>
    </section>
  );
}
