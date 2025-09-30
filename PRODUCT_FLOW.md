# 🔄 Portable Income → Advisor Flow

The complete product journey from income parsing to financial health.

---

## Step 1: Parse Income (Foundation)

### What We Do
- **Bank aggregator + regex** → classify payouts by source
- Build timeline by gig platform (Uber, DoorDash, YouTube, Upwork, etc.)
- Detect cadence (weekly, biweekly) → baseline stability score

### Output
**Unified Income Dashboard**
- All gig income in one place
- Timeline view by platform
- Income stability score

---

## Step 2: Core Financials

### What We Do
- Auto-calculate tax set-aside (25–30%)
- Detect recurring business expenses (gas, car, phone, gear)
- Calculate net vs gross income

### Output
**Safe-to-Spend View**
- Clear breakdown: Gross → Taxes → Expenses → Net
- Visual progress bars
- "You have $X safe to spend this month"

---

## Step 3: Insights & Nudges

### What We Do
- Compare hourly rates vs city averages
- Spot missed deductions
- Detect gaps across platforms

### AI-Generated Tips
- "Try Friday lunch shift → +$120/wk"
- "Set aside $980 this quarter for taxes"
- "DoorDash drivers in your city average $X/hr during dinner shifts — adding 2 shifts could +$400/mo"

### Output
**Personalized Advisor Nudges**
- Income optimization suggestions
- Tax reminders
- Deduction opportunities

---

## Step 4: AI Knowledge Layer

### What We Provide
Contextual guides right inside dashboard (3-4 min reads, ~600-800 words)

### Examples
- "How to file quarterly taxes as a DoorDash driver"
- "Uber surge hacks in NYC"
- "How Fiverr reviews affect rates"
- "Mileage deductions explained for rideshare drivers"

### City-Specific Content
- Local surge patterns
- City-specific tax rules
- Regional platform tips

### Output
**Free Learn Center + Gig-specific playbooks**
- Searchable by gig type
- Localized to user's city
- AI summaries + curated best practices

---

## Step 5: Portable Benefits Layer

### What We Offer
In-app prompts for:
- Health insurance plans (link to HealthCare.gov / state marketplace)
- Portable retirement savings (link to Vanguard, Fidelity, Betterment IRA pages)
- Emergency fund envelopes
- Tax tools (IRS quarterly guide, TurboTax/H&R Block Self-Employed)

### MVP Approach (No Referrals Yet)
**Framing:** "We're not selling you anything — just pointing you to the best current tools."

### Future Monetization
Once trust is built → layer in referral partners (commissions)

### Output
**Benefits Marketplace**
- Curated list of trusted providers
- No user fees
- Transparent recommendations

---

## Step 6: Gamified Financial Health

### What We Track
Composite score based on:
- Income stability
- Tax readiness
- Benefits coverage

### Visual Tracker
- Progress bar with current score
- Motivates improvement
- Celebrates milestones

### Nudges
- "Add health coverage to boost your score from 62 → 75"
- "You're 80% to your emergency fund goal — keep going!"

### Output
**Portable Financial Health Score**
- Single number (0-100)
- Clear improvement path
- Personalized recommendations

---

## 🎯 Narrative for Pitch/Deck

**"Portable turns raw gig income into an all-in-one financial advisor."**

From parsing deposits → tax guidance → optimization → benefits → long-term financial health, Portable is the **Mint for gig workers** — free, AI-powered, and built for the 60M+ people without traditional benefits.

---

## 🔎 Detecting Missed Deductions

### How It Works
1. **Transaction categorization** via MCC + regex
2. **Heuristics:** "We saw $245 at Jiffy Lube. If you're an Uber driver, this is deductible."
3. **Onboarding:** Ask gig type(s) → tailor deduction rules

### By Gig Type

#### Rideshare (Uber/Lyft)
- Mileage (standard deduction, 67¢/mile in 2024)
- Gas, car washes, oil changes, insurance
- Car lease/loan interest (partial)
- Phone/data plan

#### Delivery (DoorDash/Instacart/Grubhub)
- Mileage, parking, tolls
- Hot bags, carts, insulated gear
- Phone/data

#### Freelance / Creator (Upwork, Fiverr, YouTube, Etsy)
- Software subscriptions (Canva, Adobe, editing tools)
- Home office, internet
- Equipment (camera, mic, laptop, ring light)
- Platform fees

---

## 🔄 Spotting Gaps Across Platforms

### What This Means
Income optimization opportunities based on user's current gig mix

### Examples

#### Rideshare Driver (Uber only)
- "DoorDash drivers in your city average $X/hr during dinner shifts"
- "Adding 2 delivery shifts could add +$400/mo"

#### Freelancer (Upwork only)
- "Fiverr rates for similar roles are 15% higher"
- "Want to cross-list your services?"

#### Diversification Advice
- "You work 40 hrs/week only on Uber. Adding DoorDash during slow hours could maximize earnings."
- "Top earners in your area work 3+ platforms simultaneously"

**It's basically advice to diversify their income stack.**

---

## 🏙️ Context by City

### Why This Matters
Uber, DoorDash, Instacart, etc. all have regional quirks:
- Surge patterns
- Hotspots
- Batch sizes
- Local competition

### What We Do
- Tie advice to city averages + local tips
- AI guides localized automatically
- Example: "Uber surge patterns in Chicago vs NYC"

### Feels Ultra-Relevant
- "Drivers in Austin average $28/hr on Friday nights"
- "Best DoorDash zones in San Francisco: Mission District, Marina"

---

## 📖 Article Length (MVP Guides)

### Sweet Spot
**3-4 minute reads (~600-800 words)**

### Why This Length
- Long enough to feel valuable
- Short enough to be digestible in-app
- Can be read during downtime between gigs

### MVP Approach
1. Start with AI summaries
2. Add curated best practices
3. Expand based on user feedback

---

## 🎨 User Experience Philosophy

### Core Principles
1. **No jargon** - Write like you're texting a friend
2. **Actionable** - Every insight has a clear next step
3. **Personalized** - Based on their gig type, city, and income
4. **Non-judgmental** - Financial advice without shame
5. **Visual** - Charts, progress bars, color-coded scores

### Tone Examples
- ❌ "Your tax liability for Q1 is estimated at..."
- ✅ "Set aside $980 this quarter for taxes"

- ❌ "Suboptimal platform diversification detected"
- ✅ "You're crushing it on Uber. DoorDash could add $400/mo during slow hours."

---

## 🚀 MVP → Full Product Roadmap

### Phase 1: Core - Income Parsing → Unified Earnings Dashboard ✅
**Goal:** Mint for gig workers

**Completed:**
- ✅ Income parsing (manual CSV upload)
- ✅ Basic dashboard with platform breakdown
- ✅ Tax calculator (simple % of income)
- ✅ Static guides (top 20 articles)
- ✅ Benefits links (no referrals)

**Features Delivered:**
- Show totals by platform (Uber, DoorDash, YouTube, Upwork, etc.)
- Platform breakdown with payment counts
- Income stability score
- Date range tracking
- CSV persistence in localStorage

### Phase 2: Advisor Nudges & Tax Guidance
**Goal:** Automated tax planning and smart spending guidance

**Features:**
- ✅ Auto-calc tax set-aside (25-30% of income)
- ✅ Quarterly tax deadline tracking with due dates
- ⏳ "Safe-to-spend" calculator (after tax + benefits)
- ⏳ Smart nudges: "You made $3,200 this month. Save $960 for taxes."
- ⏳ Weekly/monthly income trends visualization
- ⏳ Countdown timers for tax deadlines
- ⏳ Alert system for upcoming payments

### Phase 3: Expense Classification
**Goal:** Track business expenses and maximize deductions

**Features:**
- ⏳ Detect car/gas/phone/gear expenses → suggest deductions
- ⏳ Show profit (net income), not just gross income
- ⏳ Expense categorization by gig type
- ⏳ Deduction calculator by category
- ⏳ Smart nudges: "You spent $320 on gas. Deductible at tax time → save $80."
- ⏳ Receipt upload and categorization
- ⏳ Monthly expense summaries

### Phase 4: Earnings Optimization
**Goal:** Help workers earn more per hour across platforms

**Features:**
- ⏳ Compare earnings across platforms
- ⏳ Show hourly averages by platform
- ⏳ City-specific benchmarks
- ⏳ AI-generated personalized insights:
  - "Your Uber hourly is $18. In your city, average is $22 — try working Friday nights."
  - "Adding DoorDash could add +$600/mo based on your current hours."
- ⏳ Peak hour recommendations
- ⏳ Multi-platform stacking suggestions
- ⏳ Surge/bonus timing alerts

### Phase 5: Benefits Layer - Portable Safety Net
**Goal:** Complete financial protection and security

**Features:**
- ✅ Benefits marketplace (health, retirement, emergency, tax)
- ⏳ Personalized benefit recommendations based on income
- ⏳ In-app health insurance quotes
- ⏳ Retirement account setup (Portable IRA/401k)
- ⏳ Emergency savings goal tracking
- ⏳ AI-surfaced guides + actions: "Ready to cover yourself? Plans start at $150/mo."
- ⏳ Benefits referral partnerships (monetization)

### Phase 6: Financial Health Score
**Goal:** Gamified long-term engagement

**Features:**
- ⏳ Composite metric: income stability + tax readiness + benefits coverage
- ⏳ Score visualization (0-100)
- ⏳ Improvement recommendations
- ⏳ Milestone celebrations
- ⏳ Gamify improvement: "You're 60/100, add health coverage to hit 75."
- ⏳ Monthly progress tracking
- ⏳ Peer comparisons (optional)

### Phase 7: Advanced Features
**Features:**
- ⏳ Bank aggregation (Plaid integration)
- ⏳ Real-time income sync
- ⏳ Automated expense detection
- ⏳ Mobile app (iOS/Android)
- ⏳ Receipt scanning for deductions
- ⏳ Multi-language support
- ⏳ Contractor management tools
- ⏳ Business banking integration
- ⏳ Tax filing integration (TurboTax/H&R Block)

---

## 📊 Current Status

**Phase 1: Complete ✅**
**Phase 2: In Progress (0/7 features)**
**Next Up:** Safe-to-spend calculator and smart nudges