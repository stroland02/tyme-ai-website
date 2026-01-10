"use client";

import { Container } from "@/components/layout/Container";
import { CodeLabel } from "@/components/ui/CodeLabel";

export default function PrivacyPage() {
  return (
    <main className="pt-24 pb-20 md:pt-32 md:pb-32 min-h-screen bg-background">
      <Container>
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="space-y-4 border-b border-border pb-8">
             <CodeLabel index="DOC">privacy.md</CodeLabel>
             <h1 className="text-3xl md:text-4xl font-bold">Privacy Policy</h1>
             <p className="text-foreground-muted">Last updated: January 10, 2026</p>
          </div>

          <div className="prose prose-invert max-w-none space-y-8 text-foreground-muted">
            <section className="space-y-4">
              <h2 className="text-xl font-bold text-foreground">1. Introduction</h2>
              <p>
                At Tyme AI ("we," "our," or "us"), we respect your privacy and are committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our website (regardless of where you visit it from) and tell you about your privacy rights and how the law protects you.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-bold text-foreground">2. Data We Collect</h2>
              <p>
                We may collect, use, store and transfer different kinds of personal data about you which we have grouped together follows:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>Identity Data:</strong> includes first name, last name, username or similar identifier.</li>
                <li><strong>Contact Data:</strong> includes email address and telephone number.</li>
                <li><strong>Technical Data:</strong> includes internet protocol (IP) address, your login data, browser type and version, time zone setting and location, browser plug-in types and versions, operating system and platform and other technology on the devices you use to access this website.</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-bold text-foreground">3. How We Use Your Data</h2>
              <p>
                We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Where we need to perform the contract we are about to enter into or have entered into with you.</li>
                <li>Where it is necessary for our legitimate interests (or those of a third party) and your interests and fundamental rights do not override those interests.</li>
                <li>Where we need to comply with a legal or regulatory obligation.</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-bold text-foreground">4. Contact Us</h2>
              <p>
                If you have any questions about this privacy policy or our privacy practices, please contact us via our <a href="/contact" className="text-primary hover:underline">contact page</a>.
              </p>
            </section>
          </div>
        </div>
      </Container>
    </main>
  );
}
