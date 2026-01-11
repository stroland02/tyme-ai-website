"use client";

import { useState, useMemo } from "react";
import { CodeLabel } from "@/components/ui/CodeLabel";
import { CodeCTA } from "@/components/ui/CodeCTA";

// Types for our estimator logic
type ServiceType = "web-dev" | "ai-ml" | "automation" | "consulting";

interface Feature {
  id: string;
  label: string;
  costMultiplier: number; 
  basePrice: number;
}

interface ServiceOption {
  id: ServiceType;
  label: string;
  icon: string;
  basePrice: number;
  features: Feature[];
}

const SERVICE_OPTIONS: ServiceOption[] = [
  {
    id: "web-dev",
    label: "Web Development",
    icon: "🌐",
    basePrice: 2400,
    features: [
      { id: "polyglot", label: "Multi-language Stack", costMultiplier: 1.4, basePrice: 2000 },
      { id: "cms", label: "CMS Integration", costMultiplier: 1.2, basePrice: 1200 },
      { id: "auth", label: "User Authentication", costMultiplier: 1.3, basePrice: 1600 },
      { id: "ecommerce", label: "E-commerce (Payments)", costMultiplier: 1.5, basePrice: 2800 },
      { id: "api", label: "External API Integration", costMultiplier: 1.2, basePrice: 800 },
    ]
  },
  {
    id: "ai-ml",
    label: "AI & Machine Learning",
    icon: "🤖",
    basePrice: 4000,
    features: [
      { id: "chatbot", label: "Custom RAG Chatbot", costMultiplier: 1.4, basePrice: 3200 },
      { id: "vision", label: "Computer Vision", costMultiplier: 1.5, basePrice: 4000 },
      { id: "nlp", label: "NLP / Text Analysis", costMultiplier: 1.3, basePrice: 2400 },
      { id: "predictive", label: "Predictive Modeling", costMultiplier: 1.4, basePrice: 3600 },
      { id: "fine-tuning", label: "LLM Fine-tuning", costMultiplier: 1.6, basePrice: 4800 },
    ]
  },
  {
    id: "automation",
    label: "Workflow Automation",
    icon: "⚡",
    basePrice: 1600,
    features: [
      { id: "crm", label: "CRM Sync", costMultiplier: 1.2, basePrice: 800 },
      { id: "email", label: "Email Marketing Auto", costMultiplier: 1.1, basePrice: 640 },
      { id: "scraping", label: "Data Scraping", costMultiplier: 1.3, basePrice: 1200 },
      { id: "dashboard", label: "Custom Dashboard", costMultiplier: 1.4, basePrice: 2000 },
    ]
  },
  {
    id: "consulting",
    label: "Consulting / Audit",
    icon: "🔍",
    basePrice: 1200,
    features: [
      { id: "tech-audit", label: "Tech Stack Audit", costMultiplier: 1, basePrice: 800 },
      { id: "security", label: "Security Review", costMultiplier: 1.2, basePrice: 1600 },
      { id: "strategy", label: "AI Strategy Roadmap", costMultiplier: 1.5, basePrice: 2000 },
    ]
  }
];

export function ProjectEstimator() {
  const [step, setStep] = useState(1);
  
  // State
  const [selectedService, setSelectedService] = useState<ServiceType | null>(null);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  
  // Discovery State
  const [discovery, setDiscovery] = useState({
    businessStage: "",
    timeline: "",
    priority: "",
  });

  const [formData, setFormData] = useState({
    scope: "",
    name: "",
    email: "",
    file: null as File | null,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Calculate dynamic estimate
  const estimate = useMemo(() => {
    if (!selectedService) return { min: 0, max: 0 };
    
    const service = SERVICE_OPTIONS.find(s => s.id === selectedService)!;
    let total = service.basePrice;
    
    // Add feature costs
    selectedFeatures.forEach(featId => {
      const feat = service.features.find(f => f.id === featId);
      if (feat) {
        total += feat.basePrice;
      }
    });

    // Adjust based on priority (Speed often costs more)
    let multiplier = 1.3; // Default buffer
    if (discovery.priority === "speed") multiplier = 1.5;
    if (discovery.priority === "budget") multiplier = 1.1;

    return {
      min: total,
      max: Math.round(total * multiplier)
    };
  }, [selectedService, selectedFeatures, discovery.priority]);

  const handleNext = () => setStep((prev) => prev + 1);
  const handleBack = () => setStep((prev) => prev - 1);
  const toggleFeature = (id: string) => {
    setSelectedFeatures(prev => 
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const data = new FormData();
    data.append('service', selectedService || '');
    data.append('features', selectedFeatures.join(', '));
    data.append('budget', `$${estimate.min.toLocaleString()} - $${estimate.max.toLocaleString()}`);
    
    // Add Discovery Data
    data.append('businessStage', discovery.businessStage);
    data.append('timeline', discovery.timeline);
    data.append('priority', discovery.priority);
    
    data.append('scope', formData.scope);
    data.append('name', formData.name);
    data.append('email', formData.email);
    if (formData.file) data.append('file', formData.file);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        body: data,
      });

      if (!res.ok) {
        throw new Error('Something went wrong.');
      }

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
         <div className="inline-block p-4 rounded-full bg-primary/10 mb-4">
            <span className="text-4xl">🚀</span>
         </div>
         <h2 className="text-3xl font-bold text-foreground">Estimate Sent!</h2>
         <p className="text-foreground-muted max-w-md mx-auto">
           We've received your project details. Based on your selections, your estimated range is <span className="text-primary font-bold">${estimate.min.toLocaleString()} - ${estimate.max.toLocaleString()}</span>. We'll be in touch shortly to refine this.
         </p>
         <button onClick={() => window.location.reload()} className="text-sm font-mono text-primary hover:underline mt-8">
           Start New Estimate
         </button>
       </div>
    );
  }

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="flex justify-between items-end">
                <h3 className="text-2xl font-bold">1. Select Project Type</h3>
                <span className="text-xs font-mono text-foreground-subtle">STEP 01/05</span>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {SERVICE_OPTIONS.map((s) => (
                <button
                  key={s.id}
                  onClick={() => {
                    setSelectedService(s.id);
                    setSelectedFeatures([]); 
                    handleNext();
                  }}
                  className={`group p-6 rounded-xl border text-left transition-all duration-200 hover:shadow-lg ${
                    selectedService === s.id
                      ? "bg-primary/10 border-primary shadow-primary/10"
                      : "border-border hover:border-primary/50 bg-background/50"
                  }`}
                >
                  <span className="text-3xl mb-3 block group-hover:scale-110 transition-transform duration-200">{s.icon}</span>
                  <div className="font-bold text-lg mb-1">{s.label}</div>
                  <div className="text-sm text-foreground-muted">Starting at ${s.basePrice.toLocaleString()}</div>
                </button>
              ))}
            </div>
          </div>
        );
      
      case 2:
        return (
           <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
             <div className="flex justify-between items-end">
                <div>
                  <h3 className="text-2xl font-bold">2. Business Context</h3>
                  <p className="text-foreground-muted text-sm mt-1">Help us understand your goals.</p>
                </div>
                <span className="text-xs font-mono text-foreground-subtle">STEP 02/05</span>
            </div>

            <div className="space-y-4">
              {/* Business Stage */}
              <div>
                <label className="text-sm font-bold block mb-2">Current Stage</label>
                <div className="grid grid-cols-3 gap-2">
                  {["Idea / Concept", "Early Startup", "Established Biz"].map(opt => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setDiscovery({ ...discovery, businessStage: opt })}
                      className={`p-3 text-sm rounded-lg border text-center transition-all ${
                        discovery.businessStage === opt ? "bg-primary/20 border-primary text-primary" : "bg-background/30 border-border hover:bg-background/50"
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Timeline */}
              <div>
                <label className="text-sm font-bold block mb-2">Desired Timeline</label>
                <div className="grid grid-cols-3 gap-2">
                  {["ASAP (< 1 mo)", "Standard (1-3 mo)", "Flexible"].map(opt => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setDiscovery({ ...discovery, timeline: opt })}
                      className={`p-3 text-sm rounded-lg border text-center transition-all ${
                        discovery.timeline === opt ? "bg-primary/20 border-primary text-primary" : "bg-background/30 border-border hover:bg-background/50"
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Priority */}
              <div>
                <label className="text-sm font-bold block mb-2">Top Priority</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: "quality", label: "Quality" }, 
                    { id: "speed", label: "Speed" }, 
                    { id: "budget", label: "Cost" }
                  ].map(opt => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setDiscovery({ ...discovery, priority: opt.id })}
                      className={`p-3 text-sm rounded-lg border text-center transition-all ${
                        discovery.priority === opt.id ? "bg-primary/20 border-primary text-primary" : "bg-background/30 border-border hover:bg-background/50"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
           </div>
        );

      case 3:
        const currentService = SERVICE_OPTIONS.find(s => s.id === selectedService);
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="flex justify-between items-end">
                <div>
                    <h3 className="text-2xl font-bold">3. Add Features</h3>
                    <p className="text-foreground-muted text-sm mt-1">Select the key components you need.</p>
                </div>
                <span className="text-xs font-mono text-foreground-subtle">STEP 03/05</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {currentService?.features.map((f) => (
                <button
                  key={f.id}
                  onClick={() => toggleFeature(f.id)}
                  className={`p-4 rounded-lg border text-left transition-all flex justify-between items-center ${
                    selectedFeatures.includes(f.id)
                      ? "bg-primary/10 border-primary"
                      : "border-border hover:border-primary/50 bg-background/30"
                  }`}
                >
                  <span className="font-medium">{f.label}</span>
                  <span className={`text-xs font-mono ${selectedFeatures.includes(f.id) ? "text-primary" : "text-foreground-subtle"}`}>
                    {selectedFeatures.includes(f.id) ? "✓ ADDED" : "+ ADD"}
                  </span>
                </button>
              ))}
            </div>
            
            <div className="pt-4 border-t border-border mt-4">
                <div className="flex justify-between items-center text-sm">
                    <span className="text-foreground-muted">Estimated Base:</span>
                    <span className="font-mono font-bold text-lg text-primary">
                        ${estimate.min.toLocaleString()} - ${estimate.max.toLocaleString()}
                    </span>
                </div>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
             <div className="flex justify-between items-end">
                <h3 className="text-2xl font-bold">4. Project Details</h3>
                <span className="text-xs font-mono text-foreground-subtle">STEP 04/05</span>
            </div>
            
            <textarea
              value={formData.scope}
              onChange={(e) => setFormData({ ...formData, scope: e.target.value })}
              className="w-full p-4 rounded-lg border border-border bg-background/50 focus:ring-2 focus:ring-primary focus:outline-none min-h-[150px]"
              placeholder="Tell us a bit more about what you're building. Specific goals, timeline requirements, or competitor examples..."
            />
            
            <div className="w-full px-4 py-8 rounded-lg border border-dashed border-border bg-background/30 text-center hover:bg-background/50 transition-colors">
              <input 
                type="file" 
                id="file-upload"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && setFormData({ ...formData, file: e.target.files[0] })}
              />
              <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center gap-2">
                <span className="text-2xl">📎</span>
                <span className="text-sm font-mono text-primary hover:underline">
                    {formData.file ? formData.file.name : "Attach specs or mockups (Optional)"}
                </span>
              </label>
            </div>
          </div>
        );
      case 5:
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="flex justify-between items-end">
                <h3 className="text-2xl font-bold">5. Finalize Estimate</h3>
                <span className="text-xs font-mono text-foreground-subtle">STEP 05/05</span>
            </div>

            <div className="bg-primary/5 border border-primary/20 rounded-lg p-6 space-y-4">
                <h4 className="font-bold text-lg">Summary</h4>
                <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                        <span className="text-foreground-muted">Service:</span>
                        <span className="font-medium">{SERVICE_OPTIONS.find(s => s.id === selectedService)?.label}</span>
                    </div>
                     <div className="flex justify-between">
                        <span className="text-foreground-muted">Timeline:</span>
                        <span className="font-medium">{discovery.timeline || "Not selected"}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-foreground-muted">Features:</span>
                        <span className="font-medium">{selectedFeatures.length} selected</span>
                    </div>
                    <div className="border-t border-primary/20 pt-2 flex justify-between text-base">
                        <span className="font-bold">Estimated Range:</span>
                        <span className="font-mono font-bold text-primary">${estimate.min.toLocaleString()} - ${estimate.max.toLocaleString()}</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-mono text-foreground-muted uppercase">Name</label>
                <input
                    required
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full p-3 rounded-md border border-border bg-background/50 focus:ring-2 focus:ring-primary focus:outline-none"
                    placeholder="Jane Doe"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-mono text-foreground-muted uppercase">Email</label>
                <input
                    required
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full p-3 rounded-md border border-border bg-background/50 focus:ring-2 focus:ring-primary focus:outline-none"
                    placeholder="jane@company.com"
                />
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="relative border border-border bg-background/30 backdrop-blur-md rounded-xl p-6 md:p-10 shadow-2xl">
        <form onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-4 rounded-lg mb-6 text-sm font-mono text-center">
                // Error: {error}
            </div>
          )}
          
          <div className="min-h-[300px]">
            {renderStep()}
          </div>
          
          <div className="mt-8 pt-6 border-t border-border/50 flex justify-between items-center">
            {step > 1 ? (
              <button type="button" onClick={handleBack} disabled={isLoading} className="text-sm font-mono text-foreground-subtle hover:text-foreground disabled:opacity-50 transition-colors">
                ← BACK
              </button>
            ) : <div />}
            
            {step < 5 ? (
                 <CodeCTA 
                    functionName="nextStep"
                    onClick={handleNext}
                    type="button"
                    size="md"
                    // Disable next if no service selected in step 1, or discovery fields empty in step 2
                    className={
                        (step === 1 && !selectedService) ||
                        (step === 2 && (!discovery.businessStage || !discovery.timeline))
                        ? "opacity-50 pointer-events-none" : ""
                    }
                 />
            ) : (
                <CodeCTA 
                    functionName={isLoading ? "sending..." : "getEstimate"}
                    type="submit"
                    size="lg" 
                    className={isLoading ? "opacity-50 cursor-not-allowed" : ""}
                />
            )}
          </div>
        </form>
      </div>
    </div>
  );
}