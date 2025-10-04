# Email Notification System

## Overview

Portable includes a comprehensive email notification system to keep freelancers informed about their financial activity and important tax deadlines.

## Features

### 1. Weekly Earnings Reports
- **Frequency**: Every Monday morning
- **Content**:
  - Total weekly earnings with week-over-week comparison
  - Platform-by-platform breakdown
  - Top earning platform
  - Estimated taxes to set aside (30% rule)
  - Savings goal progress
  - Personalized insights and tips
- **Template**: `src/lib/email-templates.ts` - `generateWeeklyEarningsEmail()`

### 2. Quarterly Tax Reminders
- **Frequency**: 30, 14, 7, 3, and 1 days before each quarterly deadline
- **Deadlines**:
  - Q1: April 15
  - Q2: June 15
  - Q3: September 15
  - Q4: January 15 (following year)
- **Content**:
  - Days until deadline
  - Estimated quarterly payment amount
  - Last quarter income
  - Year-to-date income
  - Instructions on how to pay (IRS Direct Pay, EFTPS, mail)
  - Important tax reminders
- **Template**: `src/lib/email-templates.ts` - `generateTaxReminderEmail()`

## Implementation

### Core Files

1. **Email Templates** (`src/lib/email-templates.ts`)
   - Beautiful HTML email templates with dark theme matching Portable's brand
   - Plain text fallbacks for all emails
   - Responsive design optimized for mobile and desktop

2. **Notification Service** (`src/lib/email-notifications.ts`)
   - `sendWeeklyEarningsReport(userId)` - Generate and send weekly report for specific user
   - `sendTaxDeadlineReminders()` - Check all users and send tax reminders if applicable
   - `scheduleWeeklyReports()` - Send weekly reports to all users (for cron job)
   - Includes data fetching from Supabase, income parsing, and tax calculations

3. **Settings Page** (`src/app/dashboard/settings/page.tsx`)
   - User notification preferences UI
   - Toggle switches for weekly reports and tax reminders
   - Preferences stored in `portable_users.email_preferences` JSONB field

### Database Schema

The `portable_users` table needs an `email_preferences` column:

```sql
ALTER TABLE portable_users
ADD COLUMN email_preferences JSONB DEFAULT '{"weeklyReports": true, "taxReminders": true}';
```

## Setup Required

### 1. Supabase Email Configuration

Currently, the notification system generates emails but **does not send them** because Supabase SMTP is not configured.

To enable email sending:

1. Go to your Supabase project settings
2. Navigate to **Authentication → Email Templates**
3. Configure SMTP settings:
   - SMTP Host: (e.g., smtp.sendgrid.net, smtp.gmail.com)
   - SMTP Port: 587 (TLS) or 465 (SSL)
   - SMTP Username
   - SMTP Password
   - Sender Email
   - Sender Name: "Portable"

### 2. Create Supabase Edge Function for Email Sending

Create a Supabase Edge Function to handle email sending:

```typescript
// supabase/functions/send-email/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  const { to, subject, html, text } = await req.json()

  // Use a transactional email service (SendGrid, Resend, etc.)
  // Example with SendGrid:
  const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${Deno.env.get('SENDGRID_API_KEY')}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      personalizations: [{ to: [{ email: to }] }],
      from: { email: 'hello@getportable.app', name: 'Portable' },
      subject,
      content: [
        { type: 'text/plain', value: text },
        { type: 'text/html', value: html },
      ],
    }),
  })

  return new Response(JSON.stringify({ success: response.ok }), {
    headers: { 'Content-Type': 'application/json' },
  })
})
```

### 3. Update Notification Service to Call Edge Function

Uncomment the email sending code in `src/lib/email-notifications.ts`:

```typescript
// In sendWeeklyEarningsReport():
await supabase.functions.invoke('send-email', {
  body: {
    to: user.email,
    subject: `Your Weekly Earnings Report: $${emailData.totalEarnings.toLocaleString()}`,
    html: htmlBody,
    text: textBody,
  }
});

// In sendTaxReminderForUser():
await supabase.functions.invoke('send-email', {
  body: {
    to: email,
    subject: `${emailData.quarterName} Tax Deadline: ${daysUntilDue} Days Left`,
    html: htmlBody,
    text: textBody,
  }
});
```

### 4. Set Up Cron Jobs

#### Option A: Vercel Cron Jobs (Recommended for Vercel deployments)

Create `vercel.json`:

```json
{
  "crons": [
    {
      "path": "/api/cron/weekly-reports",
      "schedule": "0 9 * * 1"
    },
    {
      "path": "/api/cron/tax-reminders",
      "schedule": "0 8 * * *"
    }
  ]
}
```

Create API routes:

```typescript
// src/app/api/cron/weekly-reports/route.ts
import { scheduleWeeklyReports } from '@/lib/email-notifications';

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 });
  }

  await scheduleWeeklyReports();
  return Response.json({ success: true });
}

// src/app/api/cron/tax-reminders/route.ts
import { sendTaxDeadlineReminders } from '@/lib/email-notifications';

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 });
  }

  await sendTaxDeadlineReminders();
  return Response.json({ success: true });
}
```

#### Option B: Supabase pg_cron

```sql
-- Run weekly reports every Monday at 9 AM
SELECT cron.schedule(
  'weekly-earnings-reports',
  '0 9 * * 1',
  $$
  SELECT net.http_post(
    url := 'https://your-project.supabase.co/functions/v1/send-weekly-reports',
    headers := jsonb_build_object('Authorization', 'Bearer ' || current_setting('app.anon_key'))
  );
  $$
);

-- Run tax reminders daily at 8 AM
SELECT cron.schedule(
  'tax-deadline-reminders',
  '0 8 * * *',
  $$
  SELECT net.http_post(
    url := 'https://your-project.supabase.co/functions/v1/send-tax-reminders',
    headers := jsonb_build_object('Authorization', 'Bearer ' || current_setting('app.anon_key'))
  );
  $$
);
```

## Testing

### Manual Testing

You can test the email generation locally:

```typescript
import { sendWeeklyEarningsReport, sendTaxReminderForUser } from '@/lib/email-notifications';

// Test weekly report
await sendWeeklyEarningsReport('user-id-here');

// Check console for generated email data
```

### Preview Emails

The email templates are pure HTML/CSS, so you can:

1. Copy the generated HTML from console logs
2. Save to an `.html` file
3. Open in a browser to preview

### Test Notifications

Create a test user and:
1. Go to Settings
2. Enable/disable notifications
3. Check that preferences are saved correctly
4. Verify that the notification service respects user preferences

## User Preferences

Users can control their notification preferences in **Dashboard → Settings → Email Notifications**:

- **Weekly Earnings Reports**: Toggle on/off
- **Quarterly Tax Reminders**: Toggle on/off

Preferences are stored in `portable_users.email_preferences` as:

```json
{
  "weeklyReports": true,
  "taxReminders": true
}
```

## Email Design

All emails feature:
- Dark theme matching Portable's brand (#0f172a background, #1e293b cards)
- Gradient accents (blue → purple → pink)
- Mobile-responsive layout
- Clear call-to-action buttons
- Professional footer with unsubscribe link
- Plain text fallback for email clients that don't support HTML

## Future Enhancements

Potential improvements:

1. **Transaction Alerts**: Real-time notifications for large deposits
2. **Savings Milestones**: Celebrate when users hit savings goals
3. **Platform-Specific Insights**: "Your Uber earnings dropped 20% this week"
4. **Tax Filing Reminders**: Annual tax deadline notifications
5. **Income Stability Alerts**: "Your income variability increased - consider diversifying"
6. **Custom Notification Schedules**: Let users choose when they receive reports
7. **SMS Notifications**: Text reminders for critical tax deadlines
8. **Push Notifications**: Browser/mobile push for real-time updates

## Troubleshooting

### Emails Not Sending

1. Check Supabase SMTP configuration
2. Verify Edge Function is deployed: `supabase functions list`
3. Check Edge Function logs: `supabase functions logs send-email`
4. Ensure environment variables are set (SENDGRID_API_KEY, etc.)

### Wrong Data in Emails

1. Check that income parsing is working correctly
2. Verify tax calculations in `src/lib/tax-calculator.ts`
3. Ensure user has transactions in database

### Notifications Not Respecting Preferences

1. Check `portable_users.email_preferences` column exists
2. Verify preferences are being saved in Settings page
3. Check notification service reads preferences before sending

## Cost Considerations

Email sending services typically charge per email:

- **SendGrid**: 100 emails/day free, then $0.00085/email
- **Resend**: 3,000 emails/month free, then $0.00085/email
- **Amazon SES**: $0.0001/email

For 1,000 users:
- Weekly reports: 1,000 emails/week = 4,000/month
- Tax reminders: 5 reminders/quarter × 1,000 users = 5,000 emails/quarter
- Total: ~5,700 emails/month = **~$5-10/month**

## Production Checklist

Before going live with email notifications:

- [ ] Add `email_preferences` column to `portable_users` table
- [ ] Configure Supabase SMTP settings
- [ ] Set up email service (SendGrid/Resend/SES) and get API key
- [ ] Deploy Supabase Edge Function for email sending
- [ ] Set up cron jobs (Vercel Cron or pg_cron)
- [ ] Test email delivery end-to-end
- [ ] Add unsubscribe/preferences link to email footer
- [ ] Set up email deliverability (SPF, DKIM, DMARC records)
- [ ] Monitor email bounce rates and spam complaints
- [ ] Add analytics tracking to email links
- [ ] Test on multiple email clients (Gmail, Outlook, Apple Mail)
