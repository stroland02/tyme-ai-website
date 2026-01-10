"use client";

import { Container } from "@/components/layout/Container";
import { CodeLabel } from "@/components/ui/CodeLabel";
import { AnimatedGrid } from "@/components/ui/AnimatedGrid";
import { ParticleBackground } from "@/components/ui/ParticleBackground";
import Link from "next/link";

const posts = [
  {
    id: 1,
    slug: "future-of-ai-automation",
    title: "The Future of AI Automation in Small Business",
    excerpt: "How small businesses can leverage large language models to automate customer service and internal workflows without breaking the bank.",
    date: "2024-03-15",
    readTime: "5 min read",
    tags: ["AI", "Automation", "SMB"]
  },
  {
    id: 2,
    slug: "nextjs-performance-optimization",
    title: "Optimizing Next.js Applications for Core Web Vitals",
    excerpt: "A deep dive into advanced caching strategies, image optimization, and server components to achieve a perfect 100 Lighthouse score.",
    date: "2024-02-28",
    readTime: "8 min read",
    tags: ["Web Dev", "Performance", "Next.js"]
  },
  {
    id: 3,
    slug: "building-ethical-ai",
    title: "Principles for Building Ethical AI Systems",
    excerpt: "Exploring the responsibility of developers to ensure fairness, transparency, and accountability in machine learning models.",
    date: "2024-01-10",
    readTime: "6 min read",
    tags: ["Ethics", "AI", "Society"]
  }
];

export default function BlogPage() {
  return (
    <main className="relative pt-24 pb-20 md:pt-32 md:pb-32 overflow-hidden min-h-screen">
       {/* Background Elements */}
       <div className="absolute inset-0 z-0">
        <AnimatedGrid />
        <ParticleBackground />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/80 to-background z-0" />

      <Container className="relative z-10">
        <div className="max-w-4xl mx-auto space-y-16">
          {/* Header */}
          <div className="space-y-6">
            <CodeLabel index="04">blog.latest</CodeLabel>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              Insights & <span className="text-primary glow-text">Thoughts</span>
            </h1>
            <p className="text-xl text-foreground-muted font-light leading-relaxed">
              Technical articles, industry trends, and updates from the Tyme AI team.
            </p>
          </div>

          {/* Blog List */}
          <div className="space-y-8">
            {posts.map((post) => (
              <article 
                key={post.id}
                className="group relative border border-border bg-background/50 rounded-xl p-6 md:p-8 hover:border-primary/50 transition-all duration-300"
              >
                <div className="flex flex-col md:flex-row gap-6 md:items-start justify-between">
                  <div className="space-y-4 max-w-2xl">
                    <div className="flex items-center gap-3 text-xs font-mono text-foreground-subtle">
                      <span>{post.date}</span>
                      <span>//</span>
                      <span>{post.readTime}</span>
                    </div>
                    
                    <h2 className="text-2xl font-bold group-hover:text-primary transition-colors">
                      <Link href={`#`} className="focus:outline-none">
                        <span className="absolute inset-0" aria-hidden="true" />
                        {post.title}
                      </Link>
                    </h2>
                    
                    <p className="text-foreground-muted leading-relaxed">
                      {post.excerpt}
                    </p>

                    <div className="flex flex-wrap gap-2 pt-2">
                       {post.tags.map((tag) => (
                         <span key={tag} className="text-xs font-mono px-2 py-1 rounded bg-foreground-dim/30 text-foreground-subtle">
                           #{tag}
                         </span>
                       ))}
                    </div>
                  </div>

                  <div className="hidden md:flex items-center justify-center h-full">
                     <span className="text-primary/0 group-hover:text-primary transition-all duration-300 transform translate-x-[-10px] group-hover:translate-x-0">
                       Read →
                     </span>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Newsletter / RSS Placeholder */}
          <div className="border-t border-border pt-12 text-center">
             <p className="font-mono text-sm text-foreground-subtle">
               // More articles coming soon...
             </p>
          </div>

        </div>
      </Container>
    </main>
  );
}
