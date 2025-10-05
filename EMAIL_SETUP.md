# Weekly Email Reports Setup Guide

This guide explains how to set up automated weekly earnings email reports for Portable users.

## Overview

The weekly email reports feature sends users a beautiful HTML email every Monday at 9 AM with:
- Total weekly earnings
- Week-over-week change
- Platform breakdown
- Taxes set aside (30% rule)
- Savings goal progress
- Personalized insights

## Architecture

1. **Vercel Cron Job**: Triggers `/api/cron/weekly-reports` every Monday at 9 AM
2. **Email Templates**: HTML and plain text templates in `/src/lib/email-templates.ts`
3. **Database**: Uses `email_reports_enabled` column in users table
4. **Email Service**: Resend (recommended) or SendGrid

## Setup Steps

### 1. Set Up Email Service (Resend)

We recommend [Resend](https://resend.com) for transactional emails:

```bash
# Install Resend SDK
npm install resend
```

**Sign up for Resend:**
1. Go to https://resend.com
2. Create an account (free tier: 3,000 emails/month)
3. Verify your domain or use onboarding@resend.dev for testing
4. Get your API key from the dashboard

### 2. Configure Environment Variables

Add these to your Vercel environment variables:

```bash
# Vercel Cron authentication
CRON_SECRET=<generate-a-random-secret>

# Resend API key
RESEND_API_KEY=<your-resend-api-key>
```

Generate CRON_SECRET:
```bash
openssl rand -base64 32
```

Add to Vercel:
```bash
vercel env add CRON_SECRET
vercel env add RESEND_API_KEY
```

### 3. Update Database Schema

The schema has already been updated with:
- `email_reports_enabled BOOLEAN DEFAULT true`
- `savings_goal NUMERIC(10, 2) DEFAULT 5000.00`

Run the migration:
```bash
# Apply to local Supabase
supabase db reset

# Apply to production Supabase
# Run the SQL in Supabase dashboard SQL editor
```

### 4. Implement Email Sending

Update `/src/app/api/cron/weekly-reports/route.ts` to use Resend:

```typescript
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

async function sendEmail(params: {
  to: string;
  subject: string;
  html: string;
  text: string;
}) {
  await resend.emails.send({
    from: 'Portable Reports <reports@getportable.app>', // Must be verified domain
    to: params.to,
    subject: params.subject,
    html: params.html,
    text: params.text,
  });
}
```

### 5. Verify Domain (Production)

For production, you need to verify your sending domain:

1. Go to Resend dashboard → Domains
2. Add `getportable.app`
3. Add DNS records provided by Resend:
   - SPF record
   - DKIM record
   - DMARC record (optional but recommended)

4. Wait for verification (usually < 1 hour)

### 6. Test the Cron Job

**Local testing:**
```bash
# Start local dev server
npm run dev

# In another terminal, trigger the cron manually
curl -X GET http://localhost:3000/api/cron/weekly-reports \
  -H "Authorization: Bearer YOUR_CRON_SECRET"
```

**Production testing:**
```bash
# Trigger production cron
curl -X GET https://your-app.vercel.app/api/cron/weekly-reports \
  -H "Authorization: Bearer YOUR_CRON_SECRET"
```

### 7. Deploy to Vercel

The `vercel.json` already includes the cron configuration:

```json
{
  "crons": [
    {
      "path": "/api/cron/weekly-reports",
      "schedule": "0 9 * * 1"  // Every Monday at 9 AM UTC
    }
  ]
}
```

Deploy:
```bash
vercel --prod
```

Vercel will automatically set up the cron job.

## Cron Schedule Format

The schedule `"0 9 * * 1"` uses standard cron syntax:

```
┌───────────── minute (0-59)
│ ┌─────────── hour (0-23)
│ │ ┌───────── day of month (1-31)
│ │ │ ┌─────── month (1-12)
│ │ │ │ ┌───── day of week (0-6, 0=Sunday)
│ │ │ │ │
0 9 * * 1
```

**Common schedules:**
- `0 9 * * 1` - Every Monday at 9 AM
- `0 9 * * *` - Every day at 9 AM
- `0 9 1 * *` - First day of every month at 9 AM

Vercel uses UTC timezone by default.

## Email Template Customization

Edit `/src/lib/email-templates.ts` to customize:

- Brand colors
- Email layout
- Insights logic
- CTA buttons

Preview your emails:
1. Use [React Email](https://react.email) for better templates
2. Test with [Litmus](https://litmus.com) or [Email on Acid](https://www.emailonacid.com)

## User Settings

Add a settings page where users can:
- Enable/disable weekly reports
- Set savings goal
- Choose report frequency (weekly/monthly)

Example settings component:

```tsx
// /src/components/EmailSettings.tsx
export default function EmailSettings() {
  const [enabled, setEnabled] = useState(true);
  const [savingsGoal, setSavingsGoal] = useState(5000);

  async function updateSettings() {
    await supabase
      .from('users')
      .update({
        email_reports_enabled: enabled,
        savings_goal: savingsGoal,
      })
      .eq('id', user.id);
  }

  return (
    <div>
      <label>
        <input
          type="checkbox"
          checked={enabled}
          onChange={(e) => setEnabled(e.target.checked)}
        />
        Enable weekly email reports
      </label>

      <input
        type="number"
        value={savingsGoal}
        onChange={(e) => setSavingsGoal(Number(e.target.value))}
        placeholder="Savings goal"
      />

      <button onClick={updateSettings}>Save Settings</button>
    </div>
  );
}
```

## Monitoring

### Check Cron Execution

View cron logs in Vercel:
1. Go to your project dashboard
2. Click "Deployments" → Select deployment
3. Click "Functions" tab
4. Find `/api/cron/weekly-reports`
5. View logs and execution times

### Email Delivery Monitoring

Monitor in Resend dashboard:
- Delivery rate
- Open rate
- Bounce rate
- Spam complaints

Set up webhooks for email events:
```typescript
// /src/app/api/webhooks/resend/route.ts
export async function POST(request: Request) {
  const payload = await request.json();

  // Handle email.delivered, email.bounced, etc.
  console.log('Email event:', payload.type);

  return new Response('OK');
}
```

## Cost Estimation

**Resend Pricing:**
- Free: 3,000 emails/month
- Paid: $20/month for 50,000 emails

**Example:**
- 1,000 users = 4,000 emails/month (weekly) = $20/month
- 10,000 users = 40,000 emails/month = $20/month
- 20,000 users = 80,000 emails/month = $40/month

## Troubleshooting

### Emails not sending

1. Check Vercel cron logs for errors
2. Verify RESEND_API_KEY is set correctly
3. Check domain verification status
4. Ensure users have `email_reports_enabled = true`

### Wrong timezone

Vercel crons use UTC. Adjust schedule:
- For 9 AM EST (UTC-5): Use `14 * * *` (9 + 5)
- For 9 AM PST (UTC-8): Use `17 * * *` (9 + 8)

### Rate limiting

Resend allows 10 emails/second. For large user bases:

```typescript
// Process in batches
const BATCH_SIZE = 100;
for (let i = 0; i < users.length; i += BATCH_SIZE) {
  const batch = users.slice(i, i + BATCH_SIZE);
  await Promise.all(batch.map(sendReport));
  await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1s between batches
}
```

## Future Enhancements

1. **Monthly summary emails**
2. **Tax deadline reminders** (quarterly)
3. **Platform-specific tips** based on top platform
4. **A/B testing email templates**
5. **SMS notifications** for high earners
6. **Push notifications** via PWA

## Resources

- [Resend Documentation](https://resend.com/docs)
- [Vercel Cron Jobs](https://vercel.com/docs/cron-jobs)
- [Email Design Best Practices](https://www.campaignmonitor.com/resources/guides/email-design/)
- [MJML Email Framework](https://mjml.io/) - Better email layouts
