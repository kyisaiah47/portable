# Deployment Guide

Complete guide to deploying Portable to production.

---

## 🚀 Vercel Deployment (Recommended)

### Prerequisites

- GitHub account with this repo
- Vercel account (free tier is fine to start)
- Supabase project configured
- Plaid sandbox/production credentials

### Step 1: Prepare Your Repository

```bash
# Make sure everything is committed
git status

# Push to GitHub if not already there
git push origin main
```

### Step 2: Connect to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Click "Add New Project"
4. Import your `portable` repository
5. Configure project:
   - **Framework Preset:** Next.js
   - **Root Directory:** `./`
   - **Build Command:** `npm run build`
   - **Output Directory:** `.next`

### Step 3: Configure Environment Variables

In Vercel project settings → Environment Variables, add:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://yourproject.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Plaid (use sandbox first, then upgrade to production)
PLAID_CLIENT_ID=your_client_id
PLAID_SECRET=your_sandbox_secret
PLAID_ENV=sandbox

# App URL (update after deployment)
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
```

**Important:** Set all variables for **Production**, **Preview**, and **Development** environments.

### Step 4: Deploy

1. Click "Deploy"
2. Wait 2-3 minutes for build to complete
3. Click "Visit" to see your live site

### Step 5: Update App URL

1. Copy your Vercel deployment URL (e.g., `https://portable-xyz.vercel.app`)
2. Go back to Environment Variables
3. Update `NEXT_PUBLIC_APP_URL` with your actual URL
4. Redeploy (Deployments → Three dots → Redeploy)

### Step 6: Configure Custom Domain (Optional)

1. In Vercel project → Settings → Domains
2. Add your custom domain (e.g., `getportable.app`)
3. Configure DNS records as instructed by Vercel
4. Wait for SSL certificate provisioning (~1 hour)
5. Update `NEXT_PUBLIC_APP_URL` to your custom domain
6. Redeploy

---

## 🗄️ Supabase Production Setup

### Create Production Project

1. Go to [supabase.com](https://supabase.com)
2. Create new project: `portable-production`
3. Choose same region as Vercel deployment
4. Wait for provisioning

### Run Database Schema

1. Go to SQL Editor
2. Open `supabase-schema.sql` from repo
3. Copy and paste entire contents
4. Click "Run"
5. Verify all tables created in Table Editor

### Configure Authentication

1. Go to Authentication → Settings
2. **Site URL:** Update to your production URL
3. **Redirect URLs:** Add:
   - `https://your-app.vercel.app/dashboard`
   - `https://your-custom-domain.com/dashboard` (if using custom domain)
4. **Email Templates:** Customize confirmation/reset emails
5. **SMTP Settings:** (Optional) Configure custom email provider

### Enable Row Level Security

Already configured in schema, but verify:
1. Go to Authentication → Policies
2. Ensure policies exist for all tables:
   - users
   - plaid_items
   - transactions
   - parsed_income

### Get Production Credentials

1. Go to Settings → API
2. Copy credentials and add to Vercel:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - anon public → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - service_role → `SUPABASE_SERVICE_ROLE_KEY`

---

## 🏦 Plaid Production Setup

### Upgrade from Sandbox

1. Go to [dashboard.plaid.com](https://dashboard.plaid.com)
2. Navigate to Team Settings → Account
3. Click "Request Production Access"
4. Fill out application:
   - **Company Name:** Portable
   - **Use Case:** Personal finance management for gig workers
   - **Expected Volume:** Start with 100-500 users
   - **Compliance:** Confirm you have privacy policy & terms
5. Submit application

**Processing Time:** 1-3 business days

### Configure Production

Once approved:
1. Go to Team Settings → Keys
2. Copy **Production Secret**
3. Update Vercel environment variables:
   - `PLAID_SECRET=your_production_secret`
   - `PLAID_ENV=production`
4. Redeploy

### Test Production Plaid

1. Visit your production site
2. Try connecting a real bank account
3. Verify transactions sync correctly
4. Monitor Plaid dashboard for any errors

---

## ✅ Post-Deployment Checklist

### Functionality Testing

- [ ] Sign up with new account
- [ ] Verify email confirmation works
- [ ] Log in successfully
- [ ] Connect bank account via Plaid
- [ ] Verify transactions sync
- [ ] Check all dashboard pages load
- [ ] Test on mobile device
- [ ] Test in incognito/private mode

### Performance & SEO

- [ ] Run Lighthouse audit (target: 90+ on all metrics)
- [ ] Verify all meta tags present
- [ ] Test Open Graph images on social media
- [ ] Check robots.txt accessible
- [ ] Submit sitemap to Google Search Console

### Monitoring

- [ ] Set up error tracking (Sentry recommended)
- [ ] Configure analytics (PostHog, Mixpanel, or Google Analytics)
- [ ] Set up uptime monitoring (UptimeRobot, Pingdom)
- [ ] Enable Vercel Analytics
- [ ] Configure alerting for 5xx errors

### Legal & Compliance

- [ ] Privacy policy live and linked
- [ ] Terms of service live and linked
- [ ] Cookie consent banner (if EU traffic)
- [ ] GDPR compliance measures
- [ ] Plaid production compliance review

### Marketing

- [ ] Add to Product Hunt (draft)
- [ ] Submit to Indie Hackers
- [ ] Share on Twitter/LinkedIn
- [ ] Post in relevant Reddit communities (after 1 week live)
- [ ] Reach out to initial beta testers

---

## 🔒 Security Checklist

### Environment Security

- [ ] All API keys stored as environment variables (not hardcoded)
- [ ] `.env.local` in `.gitignore`
- [ ] Service role key never exposed to client
- [ ] HTTPS enabled (automatic with Vercel)
- [ ] CORS configured properly in Supabase

### Supabase Security

- [ ] Row Level Security enabled on all tables
- [ ] User can only access their own data
- [ ] Service role key used only in API routes
- [ ] Email confirmations enabled
- [ ] Rate limiting configured (Supabase Dashboard → Auth → Rate Limits)

### Plaid Security

- [ ] Access tokens encrypted in database
- [ ] API routes validate user authentication
- [ ] Webhook verification implemented (future)
- [ ] Production credentials in secure storage

### Application Security

- [ ] Auth context validates sessions on every page
- [ ] No sensitive data in client-side code
- [ ] API routes validate user permissions
- [ ] Error messages don't leak sensitive info
- [ ] Dependencies updated (run `npm audit`)

---

## 📊 Monitoring & Alerts

### Set Up Sentry (Error Tracking)

```bash
npm install @sentry/nextjs
npx @sentry/wizard -i nextjs
```

Add to Vercel environment variables:
```env
NEXT_PUBLIC_SENTRY_DSN=your_sentry_dsn
SENTRY_AUTH_TOKEN=your_auth_token
```

### Configure Vercel Analytics

1. Go to Vercel project → Analytics
2. Enable Web Analytics
3. Add `<Analytics />` to root layout (already done)

### Set Up UptimeRobot

1. Go to [uptimerobot.com](https://uptimerobot.com)
2. Add monitor for your production URL
3. Configure alerts (email, SMS, Slack)
4. Set check interval to 5 minutes

### Log Monitoring

1. Go to Vercel → Logs
2. Enable "Real-time Logs" during initial launch
3. Monitor for errors in:
   - API routes (`/api/plaid/*`)
   - Authentication flows
   - Database queries

---

## 🚨 Common Deployment Issues

### Build Fails on Vercel

**Check:**
- Environment variables are set correctly
- All required variables present in Production environment
- No `.env.local` secrets in git

**Solution:**
```bash
# Test build locally first
npm run build

# If successful, push to trigger new Vercel build
git push origin main
```

### "Invalid Supabase URL" Error

**Cause:** Environment variable not set or malformed

**Solution:**
1. Go to Vercel → Settings → Environment Variables
2. Verify `NEXT_PUBLIC_SUPABASE_URL` starts with `https://`
3. Redeploy

### Plaid Link Doesn't Open

**Check:**
- `PLAID_CLIENT_ID` set in Vercel
- Browser console for errors
- Plaid dashboard for API errors

**Solution:**
1. Verify all Plaid env vars are set
2. Check Plaid dashboard → Logs
3. Ensure `NEXT_PUBLIC_APP_URL` matches your deployed URL

### Authentication Redirect Loop

**Cause:** Site URL mismatch in Supabase

**Solution:**
1. Supabase Dashboard → Authentication → URL Configuration
2. Update Site URL to match production URL
3. Add all redirect URLs
4. Clear cookies and retry

### CORS Errors

**Cause:** Supabase not allowing your domain

**Solution:**
1. Supabase Dashboard → Settings → API
2. Add your domain to allowed origins
3. Redeploy if needed

---

## 🔄 Continuous Deployment

Vercel automatically deploys when you push to GitHub:

```bash
# Make changes
git add .
git commit -m "Add new feature"
git push origin main

# Vercel will automatically:
# 1. Detect push
# 2. Run build
# 3. Deploy to production (if main branch)
# 4. Notify you via email/Slack
```

### Preview Deployments

Every pull request gets its own preview URL:
1. Create feature branch
2. Push changes
3. Open PR on GitHub
4. Vercel comments with preview URL
5. Test before merging to main

---

## 📈 Scaling Considerations

### When to Upgrade Supabase

**Free Tier Limits:**
- 500MB database
- 1GB file storage
- 2GB bandwidth/month
- 50,000 monthly active users

**Upgrade Triggers:**
- 100+ concurrent users
- 200k+ database rows
- Slow query performance
- Need for dedicated resources

**Pro Plan ($25/mo):**
- 8GB database
- 100GB file storage
- 250GB bandwidth
- Daily backups

### When to Upgrade Plaid

**Sandbox:** Free, test data only
**Development:** $0-$300/mo, real data, limited volume
**Production:** Custom pricing, full access

**Upgrade when:**
- Ready to launch to real users
- Need production bank connections
- Expect 100+ users/month

### Vercel Scaling

**Hobby (Free):**
- 100GB bandwidth/month
- Serverless functions
- Automatic scaling

**Pro ($20/mo):**
- 1TB bandwidth
- Longer function timeout
- Advanced analytics
- Password protection

**Enterprise:**
- Custom limits
- SLA guarantees
- Dedicated support

---

## 🎉 You're Live!

After deployment:

1. **Announce Launch**
   - Tweet about it
   - Post on LinkedIn
   - Share in indie hacker communities
   - Email beta list (if you have one)

2. **Monitor First 24 Hours**
   - Watch error logs closely
   - Track signup conversions
   - Monitor Plaid connection success rate
   - Respond to user feedback quickly

3. **Iterate Fast**
   - Fix critical bugs immediately
   - Collect user feedback
   - Ship improvements daily
   - Build in public (share metrics, learnings)

4. **Celebrate!** 🎊
   - You shipped a real product
   - Users are getting value
   - You're learning and growing

---

**Questions?** Open an issue on GitHub or reach out to the team.

**Good luck! 🚀**
