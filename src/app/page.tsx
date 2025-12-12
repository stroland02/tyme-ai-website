import { Hero } from "@/components/sections/Hero";
import { ServicesOverview } from "@/components/sections/ServicesOverview";
import { CTA } from "@/components/sections/CTA";

export default function Home() {
  return (
    <main>
      <Hero />
      <ServicesOverview />
      <CTA />
    </main>
  );
}
