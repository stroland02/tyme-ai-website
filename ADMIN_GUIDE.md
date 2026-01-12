# Admin Panel Guide

## Accessing the Admin Panel

**URL:** `http://localhost:3000/admin` (or `https://tyme-ai.com/admin` in production)

**Requirements:**
- You must be logged in
- Your user account must have `role: "admin"` in the database

## Making Your Account an Admin

To promote your account to admin, run this in your database:

```sql
-- SQLite (local development)
UPDATE users SET role = 'admin' WHERE email = 'your@email.com';
```

Or via Prisma Studio:
```bash
cd tyme-ai-website
npx prisma studio
# Navigate to User table, find your user, change role to "admin"
```

## Admin Panel Features

### 1. Dashboard (`/admin`)
**Overview of business metrics:**
- Total Users count
- New users in the last 30 days
- Monthly Revenue (placeholder for future Stripe integration)
- Active Subscriptions count
- System Health status
- Recent user signups table

### 2. User Management (`/admin/users`)
**Manage all user accounts:**
- View all registered users
- See user activity (workouts, meals logged)
- User roles (admin vs. user)
- Registration dates
- Quick view individual user details

### 3. Content Management (`/admin/content`)
**Monitor user-generated content:**
- Total health profiles created
- Total workouts logged
- Total meals tracked
- Recent workout activity with details
- Exercise count and duration tracking

### 4. Settings (`/admin/settings`)
**System configuration dashboard:**
- Database connection status
- Email service configuration (Resend)
- Authentication settings (NextAuth.js)
- Notification services (Web Push, Email, SMS)
- Environment variables status
- Quick actions (backup, test services)

## Admin Features Summary

### ✅ Currently Implemented
- **Role-based access control** - Only admins can access `/admin/*` routes
- **Protected layout** - Server-side authentication checks
- **User management** - View and monitor all users
- **Content moderation** - View user-generated workouts and meals
- **System monitoring** - Database and service status
- **Beautiful UI** - Consistent dark-mode design with sidebar navigation

### 🎯 Ideas for Enhancement

#### User Management Enhancements
1. **User Actions**
   - Ban/suspend users
   - Reset user passwords
   - Delete user accounts (with confirmation)
   - Export user data (GDPR compliance)
   - Send email to individual users

2. **User Search & Filters**
   - Search by name, email
   - Filter by role (admin/user)
   - Filter by registration date
   - Filter by activity level
   - Export filtered lists to CSV

3. **User Analytics**
   - User engagement metrics
   - Retention rates
   - Most active users leaderboard
   - Inactive user identification

#### Subscription & Revenue Management
1. **Stripe Integration**
   - View all subscription details
   - Cancel/refund subscriptions
   - See revenue by service (Health Coaching, Custom Software, etc.)
   - Monthly recurring revenue (MRR) tracking
   - Churn rate monitoring

2. **Service Metrics**
   - Users per service
   - Conversion rates
   - Trial to paid conversion
   - Plan upgrades/downgrades

#### Content Moderation
1. **Flag System**
   - Review flagged user content
   - Approve/reject workout plans
   - Moderate user-submitted meal photos
   - AI-generated content review

2. **Content Analytics**
   - Most popular workout types
   - Nutrition trends
   - Goal completion rates
   - Feature usage statistics

#### Communication Tools
1. **Announcements**
   - Create system-wide announcements
   - Target specific user segments
   - Schedule announcements
   - Track announcement engagement

2. **Email Campaigns**
   - Send newsletters
   - Promotional campaigns
   - Re-engagement emails to inactive users
   - Personalized onboarding sequences

3. **In-App Notifications**
   - Push notifications to specific users
   - Broadcast messages
   - Notification templates
   - Delivery analytics

#### Advanced Analytics
1. **Business Intelligence**
   - Custom date range reporting
   - Cohort analysis
   - A/B test results dashboard
   - Feature adoption tracking
   - User journey visualization

2. **Health Coaching Insights**
   - Average workout frequency
   - Most common fitness goals
   - Equipment usage statistics
   - Dietary preference distribution
   - AI coach interaction metrics

3. **Export & Reporting**
   - Generate PDF reports
   - Excel exports
   - Automated weekly/monthly reports
   - Custom SQL query builder (for advanced users)

#### System Administration
1. **Database Management**
   - Run migrations
   - Database backup/restore
   - View query performance
   - Optimize slow queries

2. **API Management**
   - API usage statistics (Elite tier)
   - Rate limiting configuration
   - API key management
   - Webhook configuration

3. **Feature Flags**
   - Enable/disable features globally
   - Gradual rollout (A/B testing)
   - Emergency kill switches
   - Beta testing control

4. **Logging & Monitoring**
   - Error logs viewer
   - Performance metrics
   - Security audit logs
   - User action history

#### Customer Support
1. **Support Tickets**
   - View and respond to tickets
   - Assign to team members
   - Priority levels
   - Status tracking (Open, In Progress, Resolved)

2. **Live Chat**
   - Real-time chat with users
   - Canned responses
   - Chat history
   - Team collaboration

3. **User Impersonation**
   - "Login as user" to troubleshoot
   - Audit trail for impersonation
   - Automatic logout after 15 minutes

## Technical Implementation Guide

### Adding New Admin Routes

1. Create page in `src/app/admin/your-feature/page.tsx`
2. Add navigation item to `src/app/admin/layout.tsx`
3. Implement server-side data fetching with Prisma
4. Style with existing design system

Example:
```typescript
// src/app/admin/analytics/page.tsx
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export default async function AnalyticsPage() {
  const stats = await prisma.user.groupBy({
    by: ['createdAt'],
    _count: { id: true },
  });

  return (
    <div>
      <h2>Analytics</h2>
      {/* Your content */}
    </div>
  );
}
```

### Adding Admin API Routes

For client-side data fetching or actions:

```typescript
// src/app/api/admin/users/[id]/ban/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);

  // Check admin role
  if (session?.user?.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  // Your logic here
  await prisma.user.update({
    where: { id: params.id },
    data: { banned: true }
  });

  return NextResponse.json({ success: true });
}
```

## Security Best Practices

1. **Always check admin role** on both client and server
2. **Log admin actions** for audit trail
3. **Confirm destructive actions** (delete, ban, etc.)
4. **Rate limit admin API endpoints** to prevent abuse
5. **Use HTTPS in production** (automatically handled by Vercel)
6. **Regular security audits** of admin panel code

## Current Admin URLs

- **Dashboard:** `/admin`
- **Users:** `/admin/users`
- **Content:** `/admin/content`
- **Settings:** `/admin/settings`

## Next Steps

1. **Promote your account to admin** (see instructions above)
2. **Test the admin panel** at `http://localhost:3000/admin`
3. **Choose which enhancements to implement** from the list above
4. **Integrate with Stripe** for real revenue tracking
5. **Set up monitoring** (Sentry, LogRocket) for error tracking

---

**Need help?** Check the codebase at `src/app/admin/` for implementation examples.
