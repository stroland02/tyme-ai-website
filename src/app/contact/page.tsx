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

const budgets = [
  "<$5,000", 
  "$5,000 - $10,000", 
  "$10,000 - $25,000", 
  "$25,000+"
];

function ContactForm() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    service: "",
    scope: "",
    budget: "",
    name: "",
    email: "",
    file: null as File | null,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleNext = () => setStep((prev) => prev + 1);
  const handleBack = () => setStep((prev) => prev - 1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const data = new FormData();
    Object.keys(formData).forEach(key => {
      const value = formData[key as keyof typeof formData];
      if (value) {
        data.append(key, value);
      }
    });

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        body: data,
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Something went wrong.');
      }

      setIsSubmitted(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, file: e.target.files[0] });
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-8">
            <h3 className="text-2xl font-bold">What service are you interested in?</h3>
            <div className="grid grid-cols-2 gap-4">
              {services.map((s) => (
                <button
                  key={s}
                  onClick={() => {
                    setFormData({ ...formData, service: s });
                    handleNext();
                  }}
                  className={`p-6 rounded-lg border text-left transition-colors ${
                    formData.service === s
                      ? "bg-primary/10 border-primary"
                      : "border-border hover:border-primary/50 bg-background/50"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold">Tell us about your project.</h3>
            <p className="text-foreground-muted">Briefly describe the scope, primary goals, and attach any relevant documents.</p>
            <textarea
              value={formData.scope}
              onChange={(e) => setFormData({ ...formData, scope: e.target.value })}
              className="w-full p-4 rounded-lg border border-border bg-background/50 focus:ring-2 focus:ring-primary focus:outline-none"
              rows={5}
              placeholder="e.g., 'We need to automate our invoicing process by connecting our CRM to our accounting software...'"
            />
            <div className="w-full px-4 py-3 rounded-lg border border-dashed border-border bg-background/50 text-center">
              <input 
                type="file" 
                id="file-upload"
                className="hidden"
                onChange={handleFileChange}
              />
              <label htmlFor="file-upload" className="cursor-pointer text-sm font-mono text-primary hover:underline">
                {formData.file ? `Selected: ${formData.file.name}` : "Attach a file (optional)"}
              </label>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-8">
            <h3 className="text-2xl font-bold">What is your estimated budget?</h3>
            <div className="grid grid-cols-2 gap-4">
              {budgets.map((b) => (
                <button
                  key={b}
                  onClick={() => {
                    setFormData({ ...formData, budget: b });
                    handleNext();
                  }}
                  className={`p-6 rounded-lg border text-left transition-colors ${
                    formData.budget === b
                      ? "bg-primary/10 border-primary"
                      : "border-border hover:border-primary/50 bg-background/50"
                  }`}
                >
                  {b}
                </button>
              ))}
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold">Finally, your contact details.</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Full Name"
                className="w-full p-4 rounded-lg border border-border bg-background/50 focus:ring-2 focus:ring-primary focus:outline-none"
              />
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="Email Address"
                className="w-full p-4 rounded-lg border border-border bg-background/50 focus:ring-2 focus:ring-primary focus:outline-none"
              />
            </div>
          </div>
        );
      default:
        return null;
    }
  };
  
  if (isSubmitted) {
    return (
       <div className="text-center space-y-6">
         <h2 className="text-3xl font-bold text-primary">Thank You!</h2>
         <p className="text-foreground-muted">Your inquiry has been received. We will get back to you at <span className="font-bold text-foreground">{formData.email}</span> within 24 hours.</p>
         <p className="text-xs font-mono text-foreground-ghost">// process.exit(0)</p>
       </div>
    )
  }

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="relative border border-border bg-background/30 backdrop-blur-sm rounded-xl p-8 md:p-12">
        <form onSubmit={handleSubmit}>
          {error && <p className="text-red-500 text-sm mb-4 font-mono text-center">{`// Error: ${error}`}</p>}
          
          <div style={{ minHeight: '250px' }}>
            {renderStep()}
          </div>
          
          <div className="mt-8 pt-6 border-t border-border/50 flex justify-between items-center">
            {step > 1 ? (
              <button type="button" onClick={handleBack} disabled={isLoading} className="text-sm font-mono text-foreground-subtle hover:text-foreground disabled:opacity-50">
                ← Back
              </button>
            ) : <div />}
            
            {step === 2 || step === 4 ? (
              <CodeCTA 
                functionName={isLoading ? "Submitting..." : (step === 4 ? "submitInquiry" : "nextStep")}
                onClick={step === 2 ? handleNext : undefined}
                type={step === 4 ? "submit" : "button"}
                size="md" 
                className={isLoading ? "opacity-50 cursor-not-allowed" : ""}
              />
            ) : <div />}
          </div>
        </form>
      </div>
    </div>
  );
}

export default function ContactPageWrapper() {
  return (
    <main className="relative pt-24 pb-20 md:pt-32 md:pb-32 overflow-hidden min-h-screen">
      <div className="absolute inset-0 z-0">
        <AnimatedGrid />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/80 to-background z-0" />
      
      <Container className="relative z-10">
        <div className="space-y-6 text-center max-w-2xl mx-auto mb-16">
          <CodeLabel index="05">contact.form</CodeLabel>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            Start a <span className="text-primary glow-text">Sprint</span>
          </h1>
          <p className="text-xl text-foreground-muted font-light leading-relaxed">
            Let's build something great. Fill out the form to begin the process.
          </p>
        </div>

        <ContactForm />
      </Container>
    </main>
  )
}
