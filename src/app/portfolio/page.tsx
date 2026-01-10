"use client";

import { Container } from "@/components/layout/Container";
import { CodeLabel } from "@/components/ui/CodeLabel";
import { AnimatedGrid } from "@/components/ui/AnimatedGrid";
import { ParticleBackground } from "@/components/ui/ParticleBackground";
import { CodeCTA } from "@/components/ui/CodeCTA";

const projects = [
  {
    id: 1,
    title: "EcoSmart Analytics",
    category: "AI & Data Visualization",
    description: "A comprehensive dashboard for monitoring industrial energy consumption, utilizing machine learning to predict usage spikes and recommend optimization strategies.",
    tech: ["Next.js", "Python", "TensorFlow", "D3.js"],
    status: "Completed",
    link: "#"
  },
  {
    id: 2,
    title: "Nexus Commerce",
    category: "E-Commerce Platform",
    description: "A headless e-commerce solution with AI-powered product recommendations and dynamic pricing engine.",
    tech: ["Shopify Plus", "React", "Node.js", "Redis"],
    status: "In Progress",
    link: "#"
  },
  {
    id: 3,
    title: "HealthGuard AI",
    category: "Healthcare Tech",
    description: "HIPAA-compliant patient monitoring system that uses computer vision to detect falls and anomalies in real-time.",
    tech: ["AWS", "PyTorch", "React Native", "WebRTC"],
    status: "Completed",
    link: "#"
  },
  {
    id: 4,
    title: "EBOM Automation Tool",
    category: "Manufacturing & Automation",
    description: "A Python desktop tool that automates the entire Engineering Bill of Materials (EBOM) creation process. It utilizes agentic workflows to parse engineering data, integrate with external APIs for parts validation, and eliminate manual data entry errors, reducing a full day's work to just one hour.",
    tech: ["Python", "ttkbootstrap", "API Integration", "Agentic Workflows"],
    status: "Completed",
    link: "#"
  }
];

export default function PortfolioPage() {
  return (
    <main className="relative pt-24 pb-20 md:pt-32 md:pb-32 overflow-hidden min-h-screen">
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
            <CodeLabel index="03">portfolio.map()</CodeLabel>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              Selected <span className="text-primary glow-text">Works</span>
            </h1>
            <p className="text-xl text-foreground-muted font-light leading-relaxed">
              Explore a collection of our recent projects where we've applied cutting-edge technology to solve real-world problems.
            </p>
          </div>

          {/* Project Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project) => (
              <div 
                key={project.id}
                className="group flex flex-col h-full overflow-hidden rounded-xl border border-border bg-background/50 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5"
              >
                {/* Placeholder Image Area */}
                <div className="h-48 bg-gradient-to-br from-foreground-ghost/10 to-foreground-subtle/10 border-b border-border relative overflow-hidden group-hover:opacity-90 transition-opacity">
                  <div className="absolute inset-0 flex items-center justify-center">
                     <span className="font-mono text-4xl opacity-20 group-hover:scale-110 transition-transform duration-500">
                       {`{ project_${project.id} }`}
                     </span>
                  </div>
                </div>

                <div className="p-6 flex flex-col flex-grow space-y-4">
                   <div className="flex justify-between items-start">
                      <div>
                        <p className="text-xs font-mono text-primary mb-1">{project.category}</p>
                        <h3 className="text-xl font-bold group-hover:text-primary transition-colors">{project.title}</h3>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono border border-border bg-background/50">
                        {project.status}
                      </span>
                   </div>

                   <p className="text-sm text-foreground-muted leading-relaxed flex-grow">
                     {project.description}
                   </p>

                   <div className="pt-4 border-t border-border/50">
                      <div className="flex flex-wrap gap-2">
                        {project.tech.map((t) => (
                          <span key={t} className="text-xs font-mono text-foreground-subtle bg-foreground-dim/50 px-2 py-1 rounded">
                            {t}
                          </span>
                        ))}
                      </div>
                   </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* CTA */}
           <div className="flex flex-col items-center justify-center space-y-6 pt-12">
              <p className="text-foreground-muted text-center">Interested in seeing more detailed case studies?</p>
              <CodeCTA functionName="requestAccess" href="/contact" size="md" variant="secondary" />
           </div>

        </div>
      </Container>
    </main>
  );
}
