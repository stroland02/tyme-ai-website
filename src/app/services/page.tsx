"use client";

import { Container } from "@/components/layout/Container";
import { CodeLabel } from "@/components/ui/CodeLabel";
import { AnimatedGrid } from "@/components/ui/AnimatedGrid";
import { ParticleBackground } from "@/components/ui/ParticleBackground";
import { CodeCTA } from "@/components/ui/CodeCTA";

const services = [
  {
    id: "web-dev",
    title: "Web Development",
    description: "Diverse expertise in industry-leading full-stack environments. Whether it's high-performance interfaces, robust backends, or scalable microservices, we build for any scale.",
    icon: "🌐",
    features: ["Polyglot Full-Stack", "Python", "Go / Node.js / Rust", "Cloud-Native Infrastructure"],
    gradient: "from-blue-500 to-cyan-400"
  },
  {
    id: "ai-ml",
    title: "AI & Machine Learning",
    description: "Custom AI models and MLOps pipelines to automate complex tasks and generate actionable insights while ensuring strict data integrity.",
    icon: "🤖",
    features: ["Custom Model Training", "MLOps Pipelines", "Workflow Orchestration", "Data Integrity & Validation"],
    gradient: "from-purple-500 to-pink-500"
  },
  {
    id: "enterprise-solutions",
    title: "Enterprise Software",
    description: "Professional-grade desktop and web applications using robust component suites for complex data management and high-performance user interfaces.",
    icon: "🏢",
    features: ["Enterprise Components", "Native Desktop", "High-Performance Grid", "Legacy Migration"],
    gradient: "from-blue-600 to-indigo-700"
  },
  {
    id: "automation",
    title: "Workflow Automation",
    description: "Streamline your business operations by connecting your favorite tools and automating repetitive manual processes.",
    icon: "⚡",
    features: ["Process Analysis", "API Integration", "Custom Workflows", "Bot Development"],
    gradient: "from-amber-400 to-orange-500"
  },
  {
    id: "data-analysis",
    title: "Data Analysis & Insights",
    description: "Transform raw data into actionable intelligence with custom dashboards and BI integrations to uncover patterns and drive decisions.",
    icon: "📊",
    features: ["BI Dashboards", "Data Visualization", "Statistical Modeling", "A/B Testing Analysis"],
    gradient: "from-teal-400 to-cyan-500"
  }
];

export default function ServicesPage() {
  return (
    <main className="relative pt-24 pb-20 md:pt-32 md:pb-32 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 z-0">
        <AnimatedGrid />
        <ParticleBackground />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/80 to-background z-0" />

      <Container className="relative z-10">
        <div className="max-w-6xl mx-auto space-y-16">
          {/* Header */}
          <div className="space-y-6 max-w-3xl">
            <CodeLabel index="02">services.json</CodeLabel>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              Comprehensive <span className="text-primary glow-text">Technology Solutions</span>
            </h1>
            <p className="text-xl text-foreground-muted font-light leading-relaxed">
              From building pixel-perfect interfaces to training complex neural networks, we provide end-to-end services to power your digital growth.
            </p>
          </div>

          {/* Services Grid */}
          <div className="grid md:grid-cols-2 gap-8">
            {services.map((service) => (
              <div 
                key={service.id}
                className="group relative overflow-hidden rounded-xl border border-border bg-background/50 p-8 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10"
              >
                <div className={`absolute top-0 left-0 w-1 h-full bg-gradient-to-b ${service.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                
                <div className="relative z-10 space-y-6">
                  <div className="flex items-center gap-4">
                    <span className="text-4xl">{service.icon}</span>
                    <h3 className="text-2xl font-bold group-hover:text-foreground transition-colors">{service.title}</h3>
                  </div>
                  
                  <p className="text-foreground-muted leading-relaxed">
                    {service.description}
                  </p>

                  <div className="space-y-3">
                    <p className="text-xs font-mono text-foreground-subtle uppercase tracking-wider">// Capabilities</p>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {service.features.map((feature) => (
                        <li key={feature} className="flex items-center gap-2 text-sm text-foreground-muted font-mono">
                          <span className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${service.gradient}`} />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom CTA */}
          <div className="text-center pt-12 border-t border-border">
            <p className="text-lg text-foreground-muted mb-6">Need a custom solution tailored to your specific needs?</p>
            <CodeCTA functionName="getQuote" href="/contact" size="lg" />
          </div>
        </div>
      </Container>
    </main>
  );
}
