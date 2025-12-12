# Tyme AI Website - Requirements Document

## Project Overview

**Domain**: tyme-ai.com
**Company**: Tyme AI
**Purpose**: State-of-the-art website for selling AI/ML Engineering services

**Target Audience**:
- B2B Enterprise clients
- SMB/Startups
- Direct Consumers

**Timeline**: Flexible - Learning focused

## Technology Stack

### Core Technologies
- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4
- **Fonts**: Geist Sans & Geist Mono
- **Package Manager**: npm

### Planned Integrations
- **Database**: PostgreSQL (via Vercel Postgres or Supabase)
- **ORM**: Prisma
- **Authentication**: NextAuth.js
- **Email**: SendGrid or Resend
- **File Storage**: AWS S3 or Vercel Blob
- **Analytics**: Vercel Analytics or Plausible
- **Deployment**: Vercel

## Website Structure

### Public Pages (MVP)

#### 1. Homepage (`/`)
- Hero section with value proposition
- AI services overview
- Social proof (testimonials/client logos)
- Featured case studies
- Clear CTA (Get Quote / Contact)

#### 2. Services (`/services`)
- AI/ML Solutions & Consulting
- AI Automation & Workflow Optimization
- Custom AI Model Development
- AI System Integration
- Data Analysis & Insights

#### 3. Portfolio/Case Studies (`/portfolio`)
- Filterable project showcase
- Individual case study pages (`/portfolio/[slug]`)
- Metrics and results
- Technologies used
- Client testimonials

#### 4. About (`/about`)
- Company mission and values
- Team/founder information
- Expertise and credentials
- Development process

#### 5. Contact/Get Quote (`/contact`)
- Multi-step lead qualification form
- Budget range selector
- Project scope questions
- File upload capability
- Auto-response email

#### 6. Blog (`/blog`)
- Technical AI/ML articles
- Case studies
- Industry insights
- SEO-focused content

### Authenticated Pages (Future Phase)

#### Client Portal (`/portal`)
- Dashboard (`/portal/dashboard`)
- Project details (`/portal/projects/[id]`)
- Messaging (`/portal/messages`)
- Documents (`/portal/documents`)

## Core Features

### Phase 1: MVP (Weeks 1-4)
1. **Static Public Website**
   - Homepage with hero and services
   - About page
   - Contact form (basic)
   - Responsive design
   - SEO optimization

2. **Branding**
   - Color scheme selection
   - Typography system
   - Component design system
   - Logo creation (or placeholder)

### Phase 2: Portfolio System (Weeks 5-8)
1. **Case Studies**
   - Dynamic case study pages
   - Filtering by industry/technology
   - Search functionality
   - Admin panel for adding projects

2. **Content Management**
   - Markdown-based case studies
   - Image optimization
   - Meta tags for SEO

### Phase 3: Lead Generation (Weeks 9-12)
1. **Lead Qualification Form**
   - Multi-step form with conditional logic
   - Lead scoring system
   - Email notifications
   - CRM integration (optional)

2. **Communication Hub**
   - Live chat widget
   - Consultation booking (Cal.com)
   - Email automation

### Phase 4: Client Portal (Weeks 13-18)
1. **Authentication System**
   - Secure login/registration
   - Password reset
   - OAuth options (Google, GitHub)

2. **Project Management**
   - Client dashboard
   - Real-time messaging
   - Document sharing
   - Progress tracking

## Design Requirements

### Branding (To Be Created)
- **Color Palette**: Modern, professional AI-focused colors
  - Suggested: Deep blues, purples, with accent colors
- **Typography**: Using Geist Sans (modern, clean)
- **Tone**: Professional, innovative, trustworthy
- **Style**: Modern, minimal, tech-forward

### Responsive Design
- Mobile-first approach
- Breakpoints: mobile (< 640px), tablet (640-1024px), desktop (> 1024px)
- Touch-friendly interactions

### Accessibility
- WCAG 2.1 AA compliance
- Keyboard navigation
- Screen reader support
- Color contrast ratios

## Technical Requirements

### Performance
- Lighthouse score > 90
- First Contentful Paint < 1.5s
- Time to Interactive < 3s
- Image optimization (WebP, lazy loading)

### SEO
- Server-side rendering
- Meta tags (title, description, OG tags)
- Structured data (Schema.org)
- Sitemap.xml
- robots.txt

### Security
- HTTPS only
- CSRF protection
- XSS prevention
- Input validation
- Rate limiting on forms
- Secure authentication (if implemented)

## Content Requirements

### Placeholder Content Needed
- Company description
- Service descriptions
- 3-5 case studies
- Team/founder bio
- Testimonials (3-5)
- Blog posts (optional for MVP)

### Assets Needed
- Logo (to be designed or created)
- Hero images
- Service icons
- Project screenshots
- Team photos (if applicable)

## Success Criteria

### MVP Launch (Month 1)
- ✅ Website live at tyme-ai.com
- ✅ Homepage, Services, About, Contact pages functional
- ✅ Mobile responsive
- ✅ Contact form working
- ✅ SSL certificate active

### Phase 2 (Months 2-3)
- ✅ Portfolio with 3-5 case studies
- ✅ Blog system setup
- ✅ Lead qualification form
- ✅ 100+ monthly visitors

### Phase 3 (Months 4-6)
- ✅ Client portal (if applicable)
- ✅ 10+ qualified leads/month
- ✅ Integrated communication tools
- ✅ Analytics tracking active

## Development Workflow

### Version Control
- Git repository initialized
- GitHub for remote hosting
- Branch strategy: main (production), develop (staging), feature branches

### Code Quality
- TypeScript strict mode
- ESLint configuration
- Prettier for formatting
- Pre-commit hooks (Husky)

### Testing (Future)
- Unit tests (Jest)
- E2E tests (Playwright)
- Visual regression tests

### Deployment
- Vercel for hosting
- Automatic deployments from main branch
- Preview deployments for PRs
- Environment variables for secrets

## Next Steps

1. ✅ Initialize Next.js project
2. ⏳ Create requirements document (this file)
3. ⏳ Set up project folder structure
4. ⏳ Design color scheme and branding
5. ⏳ Build homepage MVP
6. ⏳ Deploy to Vercel
7. ⏳ Configure custom domain (tyme-ai.com)

## Notes

- This is a learning project - focus on understanding each technology
- Start simple, iterate and improve
- Document decisions and learnings
- Build in public, gather feedback early
- Prioritize shipping over perfection for MVP
