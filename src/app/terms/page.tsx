"use client";

import { Container } from "@/components/layout/Container";
import { CodeLabel } from "@/components/ui/CodeLabel";

export default function TermsPage() {
  return (
    <main className="pt-24 pb-20 md:pt-32 md:pb-32 min-h-screen bg-background">
      <Container>
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="space-y-4 border-b border-border pb-8">
             <CodeLabel index="DOC">terms.md</CodeLabel>
             <h1 className="text-3xl md:text-4xl font-bold">Terms of Service</h1>
             <p className="text-foreground-muted">Last updated: January 10, 2026</p>
          </div>

          <div className="prose prose-invert max-w-none space-y-8 text-foreground-muted">
            <section className="space-y-4">
              <h2 className="text-xl font-bold text-foreground">1. Agreement to Terms</h2>
              <p>
                By accessing or using our website, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-bold text-foreground">2. Use License</h2>
              <p>
                Permission is granted to temporarily download one copy of the materials (information or software) on Tyme AI's website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>modify or copy the materials;</li>
                <li>use the materials for any commercial purpose, or for any public display (commercial or non-commercial);</li>
                <li>attempt to decompile or reverse engineer any software contained on Tyme AI's website;</li>
                <li>remove any copyright or other proprietary notations from the materials; or</li>
                <li>transfer the materials to another person or "mirror" the materials on any other server.</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-bold text-foreground">3. Disclaimer</h2>
              <p>
                The materials on Tyme AI's website are provided on an 'as is' basis. Tyme AI makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-bold text-foreground">4. Governing Law</h2>
              <p>
                These terms and conditions are governed by and construed in accordance with the laws of New Hampshire and you irrevocably submit to the exclusive jurisdiction of the courts in that State or location.
              </p>
            </section>
          </div>
        </div>
      </Container>
    </main>
  );
}
