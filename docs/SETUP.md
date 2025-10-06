# Portable - Setup Guide

Complete setup instructions for Supabase + Plaid integration.

---

## 🚀 Quick Start

### 1. **Clone and Install**

```bash
git clone <your-repo>
cd portable
npm install
```

### 2. **Set up Supabase**

#### Create a Supabase Project
1. Go to [https://supabase.com](https://supabase.com)
2. Create a new project
3. Wait for database to provision (~2 minutes)

#### Run Database Schema
1. In Supabase Dashboard, go to **SQL Editor**
2. Copy the contents of `supabase-schema.sql`
3. Paste and run the SQL
4. Verify tables were created in **Table Editor**

#### Get Supabase Credentials
1. Go to **Project Settings → API**
2. Copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** key → `SUPABASE_SERVICE_ROLE_KEY` (keep this secret!)

### 3. **Set up Plaid**

#### Create Plaid Account
1. Go to [https://dashboard.plaid.com/signup](https://dashboard.plaid.com/signup)
2. Sign up for a free account
3. Verify your email

#### Get Plaid Credentials
1. Go to **Team Settings → Keys**
2. Copy:
   - **client_id** → `PLAID_CLIENT_ID`
   - **sandbox secret** → `PLAID_SECRET`
3. Start with `sandbox` environment (free, uses test data)

### 4. **Configure Environment Variables**

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Edit `.env.local` and fill in your values:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# Plaid
PLAID_CLIENT_ID=your-client-id
PLAID_SECRET=your-sandbox-secret
PLAID_ENV=sandbox

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 5. **Run the App**

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

---

## 🔧 How It Works

### **Architecture**

```
User → PlaidLink Component → API Routes → Plaid API
                                ↓
                         Supabase Database
                                ↓
                          Dashboard UI
```

### **Data Flow**

1. **User connects bank** via Plaid Link
2. **Public token** exchanged for access token (stored in Supabase)
3. **Transactions synced** from Plaid to Supabase
4. **Dashboard** queries Supabase for real-time data
5. **Auto-refresh** syncs new transactions periodically

---

## 📊 Database Schema

### **Tables**

- **users** - User profiles (linked to Supabase Auth)
- **plaid_items** - Bank connections (access tokens)
- **transactions** - All transactions from Plaid
- **parsed_income** - Aggregated income analysis

### **Row Level Security (RLS)**

All tables have RLS enabled. Users can only access their own data.

---

## 🧪 Testing with Plaid Sandbox

Plaid Sandbox uses **test credentials** instead of real banks.

### **Test Bank Accounts**

Use these credentials in Plaid Link:

**Username:** `user_good`
**Password:** `pass_good`

**Institutions to test:**
- Chase
- Bank of America
- Wells Fargo
- Citi

### **Sample Transactions**

Sandbox accounts come with ~3 months of sample transactions automatically.

---

## 🔐 Security Best Practices

✅ **DO:**
- Keep `.env.local` in `.gitignore`
- Use Supabase RLS policies
- Store Plaid access tokens encrypted in database
- Use HTTPS in production

❌ **DON'T:**
- Commit API keys to git
- Expose service role key to client
- Share Plaid production credentials

---

## 🚢 Deploying to Production

### **1. Deploy to Vercel**

```bash
vercel deploy
```

Add environment variables in Vercel dashboard.

### **2. Upgrade Plaid**

1. Complete Plaid account verification
2. Request production access
3. Update environment variables:
   - `PLAID_ENV=production`
   - `PLAID_SECRET=your-production-secret`

### **3. Configure Supabase**

1. Update CORS settings for your domain
2. Enable email confirmations
3. Set up custom SMTP (optional)

---

## 🐛 Troubleshooting

### **"Invalid API key" error**
- Check `.env.local` has correct values
- Restart dev server (`npm run dev`)

### **Plaid Link won't open**
- Verify `PLAID_CLIENT_ID` is set
- Check browser console for errors
- Try clearing localStorage

### **Transactions not syncing**
- Check Supabase tables were created
- Verify RLS policies are set
- Check API route logs

### **Auth not working**
- Ensure Supabase URL is correct
- Check auth.users table exists
- Verify RLS is enabled

---

## 📚 Resources

- [Supabase Docs](https://supabase.com/docs)
- [Plaid Quickstart](https://plaid.com/docs/quickstart/)
- [Next.js 15 Docs](https://nextjs.org/docs)
- [Recharts Documentation](https://recharts.org/)

---

## 🤝 Need Help?

1. Check this guide first
2. Review error messages in console
3. Check Supabase logs
4. Review Plaid dashboard logs

---

Built with ❤️ using Next.js, Supabase, Plaid, and shadcn/ui.
