"use client";

import { useState } from "react";
import { Container } from "@/components/layout/Container";
import { CodeLabel } from "@/components/ui/CodeLabel";
import { AnimatedGrid } from "@/components/ui/AnimatedGrid";
import { CodeCTA } from "@/components/ui/CodeCTA";

const services = [
  "Web Development",
  "AI & Machine Learning",
  "Enterprise Software",
  "Workflow Automation",
];

import { ProjectEstimator } from "@/components/features/ProjectEstimator";

function SimpleContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const data = new FormData();
    data.append('name', formData.name);
    data.append('email', formData.email);
    data.append('service', formData.subject || "General Inquiry");
    data.append('scope', formData.message);
    data.append('budget', "N/A - Simple Message");

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        body: data,
      });

      if (!res.ok) throw new Error('Something went wrong.');
      setIsSubmitted(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="text-center space-y-6 py-12">
        <h2 className="text-3xl font-bold text-primary">Message Sent!</h2>
        <p className="text-foreground-muted">We've received your message and will get back to you shortly.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto border border-border bg-background/30 backdrop-blur-md rounded-xl p-8 shadow-2xl">
      {error && <div className="text-red-500 text-sm font-mono">// Error: {error}</div>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          required
          type="text"
          placeholder="Name"
          className="w-full p-4 rounded-lg border border-border bg-background/50 focus:ring-2 focus:ring-primary focus:outline-none"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
        <input
          required
          type="email"
          placeholder="Email"
          className="w-full p-4 rounded-lg border border-border bg-background/50 focus:ring-2 focus:ring-primary focus:outline-none"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
      </div>
      <input
        type="text"
        placeholder="Subject (Optional)"
        className="w-full p-4 rounded-lg border border-border bg-background/50 focus:ring-2 focus:ring-primary focus:outline-none"
        value={formData.subject}
        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
      />
      <textarea
        required
        placeholder="How can we help you?"
        rows={5}
        className="w-full p-4 rounded-lg border border-border bg-background/50 focus:ring-2 focus:ring-primary focus:outline-none"
        value={formData.message}
        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
      />
      <div className="text-right">
        <CodeCTA functionName={isLoading ? "sending..." : "sendMessage"} type="submit" size="lg" />
      </div>
    </form>
  );
}

export default function ContactPageWrapper() {
  const [mode, setMode] = useState<"estimator" | "simple">("estimator");

  return (
    <main className="relative pt-24 pb-20 md:pt-32 md:pb-32 overflow-hidden min-h-screen">
      <div className="absolute inset-0 z-0">
        <AnimatedGrid />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/80 to-background z-0" />
      
      <Container className="relative z-10">
        <div className="space-y-6 text-center max-w-2xl mx-auto mb-12">
          <CodeLabel index="05">contact.init</CodeLabel>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            Let's <span className="text-primary glow-text">Connect</span>
          </h1>
          
          <div className="flex justify-center gap-4 mt-8">
            <button 
              onClick={() => setMode("estimator")}
              className={`px-6 py-2 rounded-full text-sm font-mono transition-all ${
                mode === "estimator" ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" : "bg-background/50 border border-border text-foreground-muted hover:border-primary/50"
              }`}
            >
              PROJECT_ESTIMATOR
            </button>
            <button 
              onClick={() => setMode("simple")}
              className={`px-6 py-2 rounded-full text-sm font-mono transition-all ${
                mode === "simple" ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" : "bg-background/50 border border-border text-foreground-muted hover:border-primary/50"
              }`}
            >
              SIMPLE_MESSAGE
            </button>
          </div>
        </div>

        {mode === "estimator" ? <ProjectEstimator /> : <SimpleContactForm />}
      </Container>
    </main>
  )
}
