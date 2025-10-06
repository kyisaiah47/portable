# Portable

**Financial clarity for gig workers.**

A comprehensive financial platform designed specifically for the 70M+ gig workers in America. No more spreadsheets, surprise tax bills, or financial chaos.

## 🎥 Demo

**Live App**: [portable-buwubjqtb-kyisaiah47s-projects.vercel.app](https://portable-buwubjqtb-kyisaiah47s-projects.vercel.app)

**Demo Credentials**:
- Email: `sarah.driver@email.com`
- Password: `demo123`

**Or**: Upload the included sample CSV (`public/sample-bank-statement.csv`) to see your own data

---

## 💡 The Problem

70 million Americans work in the gig economy. Most have no idea how much they're actually making.

- You work for Uber, DoorDash, Upwork, Fiverr, YouTube
- 5 different apps. 5 different payment schedules. Zero clarity.
- Tax season hits and you're scrambling through bank statements
- The IRS wants quarterly payments. You're guessing.
- Average gig worker misses $3,000-$5,000 in deductions every year

**There's no financial platform built for how gig workers actually work.**

---

## ✨ The Solution

**Portable** - The first financial platform designed from the ground up for gig workers.

Upload your bank statement once. That's it. Portable does everything else.

### Core Features

**📊 Automatic Income Tracking**
- Recognizes income from 50+ platforms (Uber, Lyft, DoorDash, Instacart, Upwork, Fiverr, YouTube, Patreon, etc.)
- See exactly what you made, broken down by platform, week, and month
- No more spreadsheets. No more guessing.

**💰 Smart Expense Tracking**
- Automatically categorizes business expenses
- Gas stations? Deductible for rideshare/delivery. Phone bills? 80% deductible. Adobe subscription? Fully deductible for creators.
- Every transaction analyzed, categorized, and calculated for tax deduction
- Stop leaving thousands on the table

**📝 Real-Time Tax Calculations**
- Exact quarterly tax liability calculated in real-time
- Self-employment tax, federal income tax, state estimates
- Know exactly what you owe, when you owe it
- No more panic in April. No more underpayment penalties.

**📈 Income Stability Score**
- Are you earning consistently or all over the place?
- Matters for apartments, loans, credit cards
- Traditional credit systems don't understand variable income. We're fixing that.

**🎓 Personalized Content**
- Hyper-relevant guides based on your platforms and location
- How to maximize earnings during surge in your city
- Best zones for delivery. Tax strategies for creators.
- Not generic advice. Built for you.

---

## 🏗️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Database**: Supabase (PostgreSQL + Auth + Realtime)
- **UI Components**: Shadcn UI + Radix
- **Charts**: Recharts
- **Icons**: Lucide React + React Icons
- **Notifications**: Sonner (toast)
- **Fonts**: Space Grotesk, Inter, Outfit, Sora

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Supabase account (free tier works)

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/portable.git
   cd portable
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Setup environment variables**:
   ```bash
   cp .env.example .env.local
   # Add your Supabase URL and anon key
   ```

4. **Run database migrations**:
   ```bash
   # Execute the SQL in database/supabase-migration-portable.sql in your Supabase SQL editor
   ```

5. **Start development server**:
   ```bash
   npm run dev
   ```

6. **Access the app**:
   - Visit: `http://localhost:3000`
   - Sign up or use demo: `sarah.driver@email.com` / `demo123`

---

## 📁 Project Structure

```
portable/
├── src/
│   ├── app/                    # Next.js app router pages
│   │   ├── dashboard/          # Protected dashboard routes
│   │   ├── login/              # Auth pages
│   │   └── globals.css         # Global styles
│   ├── components/
│   │   ├── Dashboard.tsx       # Main dashboard component
│   │   ├── ui/                 # Shadcn UI components
│   │   └── ...
│   ├── lib/
│   │   ├── income-parser.ts    # Income detection logic
│   │   ├── expense-parser.ts   # Expense categorization
│   │   ├── tax-calculator.ts   # Tax calculations
│   │   └── supabase.ts         # Supabase client
│   ├── hooks/
│   │   └── useSupabaseData.ts  # Data fetching hooks
│   └── contexts/
│       └── AuthContext.tsx     # Auth state management
├── public/
│   ├── sample-bank-statement.csv  # Demo data
│   └── logo.svg
├── database/                   # SQL migration files
├── docs/                       # Project documentation
├── DEMO_NARRATION.txt         # Final demo script (for ElevenLabs)
└── DEMO_SCRIPT_V2.md          # Demo script with context
```

---

## 🎯 Key Innovation

**Most financial apps treat gig workers as an afterthought.** QuickBooks is built for traditional businesses. Mint doesn't understand gig work. Your tax software only helps once a year.

**Portable is different:**
- ✅ Built from scratch for gig workers
- ✅ Understands variable income
- ✅ Knows which expenses are deductible for which gig types
- ✅ Real-time tax calculations, not year-end surprises
- ✅ Income stability scoring for credit decisions

**The gig economy is 40% of the American workforce. We're building the financial infrastructure they actually need.**

---

## 📊 Current Status

**Working Features**:
- ✅ CSV bank statement upload
- ✅ Automatic income detection (50+ platforms)
- ✅ Expense categorization with deduction rates
- ✅ Real-time tax calculations (quarterly + annual)
- ✅ Income stability scoring
- ✅ Multi-page dashboard (Income, Expenses, Taxes, Benefits, Learn)
- ✅ User authentication and profiles
- ✅ Settings and data management
- ✅ Demo data generation
- ✅ Responsive design

**Future Enhancements**:
- [ ] Plaid integration for automatic bank sync
- [ ] Actual benefit provider partnerships
- [ ] AI-powered financial insights
- [ ] Mobile app (iOS/Android)
- [ ] Export tax documents (1099, Schedule C)

---

## 🧪 Testing

**Try it yourself**:
1. Sign up with any email
2. Upload `public/sample-bank-statement.csv`
3. Explore the dashboard and see how it automatically:
   - Detects income from Uber, DoorDash, Lyft, Upwork, etc.
   - Categorizes expenses (gas, insurance, phone bills, etc.)
   - Calculates quarterly tax liability
   - Generates stability scores

---

## 🎨 Design Philosophy

**Modern, gradient-rich aesthetic** inspired by fintech leaders like Revolut:
- Clean, dark mode interface
- Blue → Purple → Pink gradient palette
- Floating cards with glassmorphism
- Smooth animations and micro-interactions
- Data visualization that's actually useful

**Every design choice serves the user**: Clear hierarchy, readable typography, actionable insights.

---

## 📄 Documentation

See `/docs/` for additional documentation:
- Design specifications
- Implementation guides
- Security audit
- Performance optimization
- Deployment instructions

---

## 🤝 Contributing

This project is built for the social good of gig workers everywhere. Contributions welcome!

---

## 📄 License

MIT License - Use this for good!

---

## 🙏 Built For

The 70 million Americans building careers on their own terms. The drivers, deliverers, creators, and freelancers who deserve financial tools that actually work for them.

**Your work is portable. Your financial platform should be too.**
