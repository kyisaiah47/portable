# Portable - Quick Start Guide

Get Portable running locally in under 10 minutes.

---

## ⚡ Fast Track (For Developers)

```bash
# 1. Clone and install
git clone <your-repo-url>
cd portable
npm install

# 2. Set up environment
cp .env.example .env.local
# Edit .env.local with your credentials (see below)

# 3. Run development server
npm run dev

# 4. Open http://localhost:3000
```

---

## 🔑 Required Setup

### 1. Supabase Setup (5 minutes)

**Create Project:**
1. Go to [supabase.com](https://supabase.com)
2. Click "New Project"
3. Choose org, name it "portable-dev", select region
4. Wait ~2 min for provisioning

**Run Schema:**
1. In Supabase Dashboard → SQL Editor
2. Click "New Query"
3. Copy entire contents of `supabase-schema.sql`
4. Paste and click "Run"
5. Verify tables in Table Editor (users, plaid_items, transactions, parsed_income)

**Get Credentials:**
1. Go to Settings → API
2. Copy **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
3. Copy **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Copy **service_role** key → `SUPABASE_SERVICE_ROLE_KEY` (keep secret!)

**Update .env.local:**
```env
NEXT_PUBLIC_SUPABASE_URL=https://yourproject.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 2. Plaid Setup (3 minutes)

**Create Account:**
1. Go to [dashboard.plaid.com/signup](https://dashboard.plaid.com/signup)
2. Sign up (free for sandbox)
3. Verify email

**Get Credentials:**
1. Go to Team Settings → Keys
2. Copy **client_id** → `PLAID_CLIENT_ID`
3. Copy **sandbox secret** → `PLAID_SECRET`

**Update .env.local:**
```env
PLAID_CLIENT_ID=your_client_id_here
PLAID_SECRET=your_sandbox_secret_here
PLAID_ENV=sandbox
```

### 3. Test the App

**Sign Up:**
1. Go to http://localhost:3000/signup
2. Create account (use real email format)
3. You'll auto-login after signup

**Connect Bank (Sandbox):**
1. Go to Income tab
2. Click "Connect Bank"
3. Select any bank (e.g., "Chase")
4. Use test credentials:
   - Username: `user_good`
   - Password: `pass_good`
5. Select accounts to link
6. Wait for sync to complete

**View Data:**
1. Dashboard should populate with sample transactions
2. Charts should show transaction data
3. Check browser console for any errors

---

## 🗂️ Project Structure

```
portable/
├── src/
│   ├── app/                 # Next.js 15 App Router
│   │   ├── api/            # API routes (Plaid, Auth)
│   │   ├── dashboard/      # Dashboard pages
│   │   ├── login/          # Login page
│   │   ├── signup/         # Signup page
│   │   └── page.tsx        # Landing page
│   ├── components/         # React components
│   │   ├── Dashboard.tsx   # Main dashboard component
│   │   ├── PlaidLink.tsx   # Plaid integration
│   │   └── ui/             # shadcn/ui components
│   ├── contexts/           # React contexts
│   │   └── AuthContext.tsx # Auth state management
│   ├── hooks/              # Custom React hooks
│   │   └── useSupabaseData.ts # Data fetching
│   ├── lib/                # Utilities
│   │   ├── supabase.ts     # Supabase client
│   │   ├── plaid.ts        # Plaid client
│   │   ├── income-parser.ts # Transaction parsing
│   │   ├── expense-parser.ts
│   │   ├── tax-calculator.ts
│   │   └── content-registry.ts
│   └── styles/             # Alternative designs
├── public/                 # Static assets
├── supabase-schema.sql     # Database schema
├── .env.example            # Environment template
├── .env.local              # Your credentials (git-ignored)
├── SETUP.md                # Detailed setup guide
├── ROADMAP.md              # Product roadmap
└── README.md               # Project overview
```

---

## 🎨 Tech Stack

- **Frontend:** Next.js 15, React 18, TypeScript
- **Styling:** Tailwind CSS, shadcn/ui
- **Charts:** Recharts (via shadcn)
- **Database:** Supabase (PostgreSQL)
- **Auth:** Supabase Auth
- **Banking:** Plaid API
- **Deployment:** Vercel (recommended)

---

## 🐛 Common Issues

### Build Fails with "Invalid supabaseUrl"
**Solution:** Make sure `.env.local` has valid HTTPS URLs
```env
NEXT_PUBLIC_SUPABASE_URL=https://placeholder.supabase.co  # ✓ Valid
NEXT_PUBLIC_SUPABASE_URL=placeholder.supabase.co          # ✗ Invalid
```

### "No rows found" error in Dashboard
**Cause:** No transactions synced yet
**Solution:** Connect a bank account via Plaid Link, wait for sync

### Plaid Link won't open
**Check:**
1. `PLAID_CLIENT_ID` is set in `.env.local`
2. Browser console for errors
3. Clear localStorage: `localStorage.clear()`

### Auth redirect loop
**Solution:** Clear localStorage and cookies, restart dev server

### TypeScript errors
**Solution:** Delete `.next` folder and rebuild
```bash
rm -rf .next
npm run build
```

---

## 🚀 Deployment

### Vercel (Recommended)

**1. Push to GitHub:**
```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

**2. Deploy:**
1. Go to [vercel.com](https://vercel.com)
2. Import your GitHub repo
3. Add environment variables (copy from `.env.local`)
4. Click "Deploy"

**3. Configure Domain:**
1. Go to Project Settings → Domains
2. Add custom domain
3. Update DNS records as instructed

**4. Post-Deploy:**
- Update `NEXT_PUBLIC_APP_URL` in Vercel env vars
- Test signup/login flow
- Test Plaid connection
- Monitor Vercel logs for errors

### Production Checklist

Before going live:
- [ ] Switch Plaid from sandbox to production (requires approval)
- [ ] Enable Supabase email confirmations
- [ ] Set up Supabase SMTP for custom emails
- [ ] Add privacy policy URL
- [ ] Add terms of service URL
- [ ] Set up error monitoring (Sentry)
- [ ] Configure analytics (PostHog, Mixpanel, etc.)
- [ ] Set up uptime monitoring (Pingdom, UptimeRobot)
- [ ] Test on mobile devices
- [ ] Run Lighthouse audit (target: 90+ on all metrics)

---

## 📚 Learn More

- **Detailed Setup:** See [SETUP.md](./SETUP.md)
- **Product Roadmap:** See [ROADMAP.md](./ROADMAP.md)
- **Supabase Docs:** [supabase.com/docs](https://supabase.com/docs)
- **Plaid Docs:** [plaid.com/docs](https://plaid.com/docs)
- **Next.js Docs:** [nextjs.org/docs](https://nextjs.org/docs)
- **shadcn/ui:** [ui.shadcn.com](https://ui.shadcn.com)

---

## 🤝 Contributing

This is a solo/small team project. If you want to contribute:

1. Fork the repo
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📞 Support

**Issues?** Open a GitHub issue with:
- What you were trying to do
- What happened instead
- Error messages (full text)
- Screenshots if relevant
- Your environment (OS, Node version, browser)

**Questions?** Check existing issues first, then open a new discussion.

---

## 🎯 Next Steps

Once you have the app running:

1. **Explore the Dashboard** - Check out all tabs (Income, Expenses, Taxes, Benefits, Learn)
2. **Test Features** - Upload a CSV, connect multiple banks, explore charts
3. **Read the Roadmap** - See what's coming next
4. **Start Building** - Pick a feature from Phase 1 and start coding
5. **Deploy** - Get it live on Vercel and share with real users

---

**Happy Building! 🚀**

*Questions? Found a bug? Open an issue on GitHub.*
