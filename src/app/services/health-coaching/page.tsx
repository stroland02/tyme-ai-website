"use client";

import { Container } from "@/components/layout/Container";
import { CodeLabel } from "@/components/ui/CodeLabel";
import { CodeCTA } from "@/components/ui/CodeCTA";
import { AnimatedGrid } from "@/components/ui/AnimatedGrid";
import { ParticleBackground } from "@/components/ui/ParticleBackground";
import { Check, Zap, TrendingUp, Heart, Target, Award } from "lucide-react";

const features = [
  {
    icon: "📈",
    title: "Fitness Portfolio Analytics",
    description: "Track your health like an investment portfolio with ROI metrics, diversification analysis, and risk assessment. See your health dividends compound.",
    gradient: "from-blue-500 to-cyan-400"
  },
  {
    icon: "🎯",
    title: "AI Prediction Engine",
    description: "Know exactly when you'll hit your goals. AI predicts plateaus before they happen and optimizes workout timing based on your performance patterns.",
    gradient: "from-purple-500 to-pink-500"
  },
  {
    icon: "🧪",
    title: "A/B Test Your Fitness",
    description: "Run experiments on training splits, nutrition protocols, and supplement timing. Get statistical analysis on what actually works for YOUR body.",
    gradient: "from-green-500 to-emerald-400"
  },
  {
    icon: "🤖",
    title: "Context-Aware AI Coach",
    description: "Traveling? Injured? Low sleep? AI adapts your plan in real-time based on life circumstances, not generic templates.",
    gradient: "from-orange-500 to-red-500"
  },
  {
    icon: "⚡",
    title: "Recovery Intelligence",
    description: "Integrates with Apple Health, Whoop, Oura Ring. AI adjusts workout intensity based on HRV, sleep quality, and muscle fatigue mapping.",
    gradient: "from-indigo-500 to-purple-500"
  },
  {
    icon: "🔗",
    title: "API & Webhook Access",
    description: "For developers: Full REST API access, webhook integrations with Notion/Sheets, and export all your data. Your data, your control.",
    gradient: "from-cyan-500 to-blue-500"
  }
];

const pricingPlans = [
  {
    name: "Free Trial",
    price: "$0",
    duration: "14 days",
    description: "Experience everything risk-free",
    features: [
      "Full AI workout generation",
      "Portfolio analytics dashboard",
      "AI prediction engine",
      "Progress charts & analytics",
      "No credit card required"
    ],
    cta: "Start Free Trial",
    popular: false,
    gradient: "from-gray-500 to-gray-600"
  },
  {
    name: "Pro",
    price: "$14.99",
    duration: "per month",
    description: "For serious data-driven athletes",
    features: [
      "Everything in Free Trial",
      "A/B testing & experiments",
      "Recovery intelligence (HRV)",
      "Context-aware AI adjustments",
      "Food photo recognition",
      "Priority support"
    ],
    cta: "Get Started",
    popular: true,
    gradient: "from-blue-500 to-purple-600"
  },
  {
    name: "Elite",
    price: "$29.99",
    duration: "per month",
    description: "Full control + API access",
    features: [
      "Everything in Pro",
      "Full REST API access",
      "Webhook integrations",
      "Data export (CSV/JSON)",
      "Custom dashboard support",
      "Early feature access",
      "1-on-1 onboarding call"
    ],
    cta: "Maximum Power",
    popular: false,
    gradient: "from-purple-500 to-pink-500"
  }
];

const howItWorks = [
  {
    step: "01",
    title: "Set Your Goals",
    description: "Tell us your fitness level, goals, available equipment, and dietary preferences",
    icon: Target
  },
  {
    step: "02",
    title: "AI Builds Your Plan",
    description: "Our AI coach generates personalized workout and nutrition plans tailored to you",
    icon: Zap
  },
  {
    step: "03",
    title: "Track & Improve",
    description: "Log workouts, meals, and measurements. Watch your progress visualized in real-time",
    icon: TrendingUp
  }
];

const faqs = [
  {
    question: "What is 'Portfolio Analytics' for fitness?",
    answer: "We treat your health like an investment portfolio - tracking ROI per workout, diversification across muscle groups, risk assessment for injuries, and 'dividends' like energy gains and sleep quality. It's fitness metrics that actually matter to data-driven people."
  },
  {
    question: "How accurate are the AI predictions?",
    answer: "Our prediction engine uses your historical data to forecast goal completion dates with ±3-5 day accuracy. It also predicts plateaus 1-2 weeks in advance with 85%+ accuracy, giving you time to adjust your approach."
  },
  {
    question: "What can I do with API access?",
    answer: "Elite tier includes full REST API access - export all your data to Google Sheets, Notion, or custom dashboards. Set up webhooks to log workouts in your productivity apps. Your data, your control. Built for developers who want to integrate fitness into their workflow."
  },
  {
    question: "How does A/B testing work for fitness?",
    answer: "Run controlled experiments: morning vs evening workouts, different training splits, nutrition protocols, or supplement timing. We track performance metrics and provide statistical analysis on what actually works for YOUR body - no more guessing."
  },
  {
    question: "Do I need a wearable for Recovery Intelligence?",
    answer: "No, but if you have Apple Watch, Whoop, or Oura Ring, we'll integrate HRV and sleep data to auto-adjust workout intensity. Without a wearable, you can manually log sleep quality and soreness for similar benefits."
  },
  {
    question: "Is this for beginners or advanced athletes?",
    answer: "Both! The AI adapts to your level. Beginners get simplified tracking and education. Advanced athletes get deep analytics, prediction modeling, and A/B testing. The platform grows with you."
  }
];

export default function HealthCoachingPage() {
  return (
    <main className="relative pt-24 pb-20 md:pt-32 md:pb-32 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 z-0">
        <AnimatedGrid />
        <ParticleBackground />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/80 to-background z-0" />

      <Container className="relative z-10">
        <div className="max-w-6xl mx-auto space-y-24">

          {/* Hero Section */}
          <div className="space-y-8 text-center max-w-4xl mx-auto">
            <CodeLabel index="01">health_coach.init()</CodeLabel>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              Invest in Your Health Like a <span className="text-primary glow-text">Portfolio</span>
            </h1>
            <p className="text-xl text-foreground-muted font-light leading-relaxed max-w-3xl mx-auto">
              The only fitness platform built for data-driven professionals. AI predictions, A/B testing,
              portfolio analytics, and context-aware coaching. Track ROI on every workout.
            </p>
            <div className="flex flex-wrap gap-3 justify-center text-sm text-foreground-muted font-mono max-w-2xl mx-auto">
              <span className="px-3 py-1 rounded-full bg-primary/10 border border-primary/20">📊 Portfolio Analytics</span>
              <span className="px-3 py-1 rounded-full bg-primary/10 border border-primary/20">🎯 AI Predictions</span>
              <span className="px-3 py-1 rounded-full bg-primary/10 border border-primary/20">🧪 A/B Testing</span>
              <span className="px-3 py-1 rounded-full bg-primary/10 border border-primary/20">🔗 API Access</span>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
              <CodeCTA functionName="startFreeTrial" href="/auth/signup" size="lg" variant="primary" />
              <CodeCTA functionName="viewDemo" href="#features" size="lg" />
            </div>
            <p className="text-sm text-foreground-ghost font-mono">
              {`// const trial = { duration: 14, creditCard: false, fullAccess: true }`}
            </p>
          </div>

          {/* Features Grid */}
          <div className="space-y-12">
            <div className="text-center">
              <CodeLabel index="02" className="mb-4">features.map()</CodeLabel>
              <h2 className="text-3xl md:text-4xl font-bold">Everything You Need to Succeed</h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature) => (
                <div
                  key={feature.title}
                  className="group relative overflow-hidden rounded-xl border border-border bg-background/50 p-6 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10"
                >
                  <div className={`absolute top-0 left-0 w-1 h-full bg-gradient-to-b ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

                  <div className="relative z-10 space-y-4">
                    <div className="text-4xl">{feature.icon}</div>
                    <h3 className="text-xl font-bold">{feature.title}</h3>
                    <p className="text-foreground-muted text-sm leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Why Different Section */}
          <div className="space-y-12 bg-foreground-dim/30 -mx-4 px-4 py-16 rounded-2xl border border-border">
            <div className="text-center max-w-3xl mx-auto">
              <CodeLabel index="03" className="mb-4">differentiators.filter(unique)</CodeLabel>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Not Another Fitness App</h2>
              <p className="text-foreground-muted text-lg leading-relaxed">
                Built for engineers, data scientists, and professionals who treat fitness like they treat their work:
                <span className="text-foreground font-semibold"> analytically, systematically, and measurably.</span>
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              <div className="text-center space-y-3 p-6">
                <div className="text-3xl">❌</div>
                <h3 className="font-bold text-lg">Other Apps</h3>
                <ul className="text-sm text-foreground-muted space-y-2">
                  <li>Generic templates</li>
                  <li>Basic logging</li>
                  <li>Simple charts</li>
                  <li>No data export</li>
                  <li>Social toxicity</li>
                </ul>
              </div>

              <div className="text-center space-y-3 p-6 border-x border-border">
                <div className="text-3xl">🎯</div>
                <h3 className="font-bold text-lg text-primary">This Platform</h3>
                <ul className="text-sm text-foreground space-y-2 font-medium">
                  <li>AI adapts daily to YOU</li>
                  <li>Portfolio-style analytics</li>
                  <li>Predictive modeling</li>
                  <li>Full API access</li>
                  <li>Anonymous competition</li>
                </ul>
              </div>

              <div className="text-center space-y-3 p-6">
                <div className="text-3xl">💼</div>
                <h3 className="font-bold text-lg">Your Benefit</h3>
                <ul className="text-sm text-foreground-muted space-y-2">
                  <li>Know exact ETA to goals</li>
                  <li>Prevent plateaus early</li>
                  <li>Optimize for YOUR body</li>
                  <li>Own your data</li>
                  <li>Stay motivated longer</li>
                </ul>
              </div>
            </div>

            <div className="text-center">
              <p className="text-xs font-mono text-foreground-ghost max-w-2xl mx-auto">
                {`// if (you.love === "data" && you.hate === "guesswork") { return this.platform; }`}
              </p>
            </div>
          </div>

          {/* How It Works */}
          <div className="space-y-12">
            <div className="text-center">
              <CodeLabel index="04" className="mb-4">workflow.execute()</CodeLabel>
              <h2 className="text-3xl md:text-4xl font-bold">How It Works</h2>
              <p className="text-foreground-muted mt-4 max-w-2xl mx-auto">
                Get started in minutes. Our AI handles the complexity, you focus on the results.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {howItWorks.map((item) => (
                <div key={item.step} className="relative text-center space-y-4">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 border border-primary/20">
                    <item.icon className="w-8 h-8 text-primary" />
                  </div>
                  <div className="space-y-2">
                    <p className="font-mono text-sm text-foreground-ghost">// step {item.step}</p>
                    <h3 className="text-xl font-bold">{item.title}</h3>
                    <p className="text-foreground-muted text-sm">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing Section */}
          <div id="pricing" className="space-y-12">
            <div className="text-center">
              <CodeLabel index="05" className="mb-4">pricing.select()</CodeLabel>
              <h2 className="text-3xl md:text-4xl font-bold">Simple, Transparent Pricing</h2>
              <p className="text-foreground-muted mt-4">
                Start free, upgrade when you're ready. No hidden fees.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {pricingPlans.map((plan) => (
                <div
                  key={plan.name}
                  className={`relative rounded-xl border p-8 ${
                    plan.popular
                      ? 'border-primary bg-primary/5 shadow-lg shadow-primary/20 scale-105'
                      : 'border-border bg-background/50'
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-bold">
                        <Award className="w-3 h-3" />
                        MOST POPULAR
                      </span>
                    </div>
                  )}

                  <div className="space-y-6">
                    <div>
                      <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                      <p className="text-sm text-foreground-muted">{plan.description}</p>
                    </div>

                    <div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-bold">{plan.price}</span>
                        <span className="text-foreground-muted">/{plan.duration}</span>
                      </div>
                    </div>

                    <ul className="space-y-3">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-2 text-sm">
                          <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                          <span className="text-foreground-muted">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <CodeCTA
                      functionName={plan.name === "Free Trial" ? "startTrial" : "subscribe"}
                      href="/auth/signup"
                      variant={plan.popular ? "primary" : "secondary"}
                      className="w-full"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* FAQ Section */}
          <div id="faq" className="space-y-12">
            <div className="text-center">
              <CodeLabel index="06" className="mb-4">faq.get()</CodeLabel>
              <h2 className="text-3xl md:text-4xl font-bold">Frequently Asked Questions</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
              {faqs.map((faq) => (
                <div
                  key={faq.question}
                  className="p-6 rounded-xl border border-border bg-background/50"
                >
                  <h3 className="font-bold mb-3 text-lg">{faq.question}</h3>
                  <p className="text-foreground-muted text-sm leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Final CTA */}
          <div className="text-center space-y-6 py-12 border-t border-border">
            <h2 className="text-3xl md:text-4xl font-bold">
              Ready to Transform Your Health?
            </h2>
            <p className="text-foreground-muted max-w-2xl mx-auto">
              Join thousands crushing their fitness goals with AI-powered coaching.
              Start your free 14-day trial today - no credit card required.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
              <CodeCTA functionName="startNow" href="/auth/signup" size="lg" variant="primary" />
              <CodeCTA functionName="contact" href="/contact" size="lg" />
            </div>
            <p className="text-xs text-foreground-ghost font-mono">
              {`// risk_free = true; commitment = false; results = guaranteed;`}
            </p>
          </div>

        </div>
      </Container>
    </main>
  );
}
