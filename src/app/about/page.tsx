"use client";

import { Container } from "@/components/layout/Container";
import { CodeLabel } from "@/components/ui/CodeLabel";
import { SyntaxHighlight } from "@/components/ui/SyntaxHighlight";
import { AnimatedGrid } from "@/components/ui/AnimatedGrid";
import { ParticleBackground } from "@/components/ui/ParticleBackground";
import { CodeCTA } from "@/components/ui/CodeCTA";

export default function AboutPage() {
  return (
    <main className="relative pt-24 pb-20 md:pt-32 md:pb-32 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 z-0">
        <AnimatedGrid />
        <ParticleBackground />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/80 to-background z-0" />

      <Container className="relative z-10">
        <div className="max-w-4xl mx-auto space-y-16 md:space-y-24">
          {/* Header Section */}
          <div className="space-y-6">
            <CodeLabel index="01">about.md</CodeLabel>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
              Building the future with <span className="text-primary glow-text">Intelligence</span>.
            </h1>
            <p className="text-xl text-foreground-muted max-w-2xl font-light leading-relaxed">
              We are a team of engineers and innovators dedicated to transforming businesses through advanced AI solutions and modern web technologies.
            </p>
          </div>

          {/* Mission Section */}
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-2xl md:text-3xl font-bold font-mono">
                <span className="text-primary mr-2">//</span>Our Mission
              </h2>
              <p className="text-foreground-muted leading-relaxed">
                At Tyme AI, we believe that artificial intelligence isn't just a buzzword—it's a fundamental shift in how value is created. Our mission is to democratize access to enterprise-grade AI, empowering businesses of all sizes to automate, optimize, and scale.
              </p>
              <p className="text-foreground-muted leading-relaxed">
                We combine deep technical expertise with strategic business insight to deliver solutions that don't just work, but drive tangible growth.
              </p>
            </div>
            <div className="bg-background/50 backdrop-blur-sm border border-border rounded-xl p-6 shadow-xl">
              <SyntaxHighlight type="const">
                {`const values = {
  innovation: "Continuous",
  integrity: "Data-First",
  quality: "Professional-Grade",
  focus: "Enterprise-Ready"
};

function deliverValue() {
  while(true) {
    ensureDataIntegrity();
    solveComplexProblems();
    exceedExpectations();
  }
}`}
              </SyntaxHighlight>
            </div>
          </div>

          {/* Team/Founder Section */}
          <div className="space-y-8">
            <h2 className="text-2xl md:text-3xl font-bold font-mono border-b border-border pb-4">
              <span className="text-primary mr-2">//</span>Leadership
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {/* Founder Card */}
              <div className="col-span-1 md:col-span-3 lg:col-span-2 group">
                <div className="relative overflow-hidden rounded-xl border border-border bg-background/50 p-8 hover:border-primary/50 transition-colors duration-300">
                  <div className="flex flex-col md:flex-row gap-8 items-start">
                    <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shrink-0">
                      <span className="text-4xl font-bold text-white">SR</span>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-2xl font-bold group-hover:text-primary transition-colors">Sebastian Roland</h3>
                        <p className="text-primary font-mono text-sm mt-1">Founder & Lead Engineer</p>
                      </div>
                      <p className="text-foreground-muted leading-relaxed">
                        With a passion for cutting-edge technology and a vision for the future of AI, Sebastian founded Tyme AI to bridge the gap between complex machine learning models and practical business applications. He holds a Bachelor of Science in Mechanical Engineering from the University of New Hampshire, and his expertise spans from professional-grade software implementations to high-scale data integrity systems.
                      </p>
                      <div className="flex items-center gap-4 text-sm font-mono text-foreground-ghost">
                        <span>📍 Dover, NH</span>
                        <span>•</span>
                        <span>🚀 est. 2025</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="rounded-xl bg-gradient-to-br from-blue-600/10 to-purple-600/10 border border-primary/20 p-8 md:p-12 text-center space-y-6">
            <h2 className="text-2xl md:text-3xl font-bold">Ready to transform your business?</h2>
            <p className="text-foreground-muted max-w-xl mx-auto">
              Let's discuss how our AI solutions can help you achieve your goals.
            </p>
            <div className="flex justify-center">
              <CodeCTA functionName="contactUs" href="/contact" size="lg" />
            </div>
          </div>
        </div>
      </Container>
    </main>
  );
}
