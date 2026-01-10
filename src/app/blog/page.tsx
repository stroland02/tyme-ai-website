"use client";

import { Container } from "@/components/layout/Container";
import { CodeLabel } from "@/components/ui/CodeLabel";
import { AnimatedGrid } from "@/components/ui/AnimatedGrid";
import { ParticleBackground } from "@/components/ui/ParticleBackground";
import Link from "next/link";

const posts = [
  {
    id: 1,
    slug: "the-bitter-lesson",
    title: "The Bitter Lesson",
    author: "Rich Sutton",
    source: "http://www.incompleteideas.net/IncIdeas/BitterLesson.html",
    excerpt: "The biggest lesson from 70 years of AI research is that general-purpose methods that leverage computation are ultimately the most effective. Attempts to build-in human knowledge are often eclipsed by the sheer power of scalable computation, a 'bitter' pill for many researchers to swallow.",
    date: "2019-03-13",
    readTime: "7 min read",
    tags: ["AI", "Strategy", "Computation"]
  },
  {
    id: 2,
    slug: "choose-boring-technology",
    title: "Choose Boring Technology",
    author: "Dan McKinley",
    source: "https://mcfunley.com/choose-boring-technology",
    excerpt: "Innovation is a limited resource. 'Boring' technologies—stable, well-understood tools—are often the best choice because they let you focus on solving the actual business problem, not the problems of the technology itself. Spend your innovation tokens wisely.",
    date: "2015-04-03",
    readTime: "6 min read",
    tags: ["Software Engineering", "Architecture", "Strategy"]
  },
  {
    id: 3,
    slug: "no-silver-bullet",
    title: "No Silver Bullet — Essence and Accident in Software Engineering",
    author: "Fred Brooks",
    source: "http://worrydream.com/refs/Brooks-NoSilverBullet.pdf",
    excerpt: "There is no single development, in either technology or management technique, which by itself promises even one order-of-magnitude improvement in productivity. We must distinguish between 'essential' complexity (the problem itself) and 'accidental' complexity (the tools). The easy wins are over.",
    date: "1986-04-01",
    readTime: "15 min read",
    tags: ["Classic", "Software Engineering", "Project Management"]
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
            <CodeLabel index="04">blog.read</CodeLabel>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              Foundational <span className="text-primary glow-text">Insights</span>
            </h1>
            <p className="text-xl text-foreground-muted font-light leading-relaxed">
              Our philosophy is built on time-tested principles from the software and AI industries. Here are a few of the foundational essays that shape our approach.
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
                    <div className="flex flex-col sm:flex-row sm:items-center gap-x-3 gap-y-1 text-xs font-mono text-foreground-subtle">
                      <span>{post.date}</span>
                      <span className="hidden sm:inline">//</span>
                      <span>By {post.author}</span>
                      <span className="hidden sm:inline">//</span>
                      <span>{post.readTime}</span>
                    </div>
                    
                    <h2 className="text-2xl font-bold group-hover:text-primary transition-colors">
                      <Link href={post.source} target="_blank" rel="noopener noreferrer" className="focus:outline-none">
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

                  <div className="flex items-center justify-start sm:justify-center h-full text-foreground-subtle group-hover:text-primary transition-all duration-300">
                     <span className="flex items-center gap-1 font-mono text-xs">
                       Read Original <span className="transform group-hover:translate-x-1 transition-transform">→</span>
                     </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </Container>
    </main>
  );
}
