# GigBenefits Platform

A portable benefits platform for gig workers built for the HackNomics hackathon.

## 🚀 Features

- **Income Tracking**: Connect multiple gig platforms (Uber, DoorDash, Upwork, etc.)
- **Automatic Savings**: 4% of earnings automatically saved for benefits
- **Benefits Marketplace**: Health insurance, retirement plans, emergency funds
- **Real-time Dashboard**: Track earnings, contributions, and benefit enrollment
- **Demo User Journey**: Complete 6-month worker story with Sarah Johnson

## 🏗️ Tech Stack

- **Frontend**: Next.js 15, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API routes, Prisma ORM
- **Database**: SQLite (easily deployable)
- **Charts**: Recharts for data visualization
- **Authentication**: JWT with bcrypt

## 🎯 Demo Story

**Meet Sarah Johnson**: An Uber driver who earned $47K last year but had no benefits. Watch her:
- Connect her gig platforms automatically
- Build a $2,400 emergency fund (2% auto-save)
- Enroll in health insurance through our marketplace
- Track retirement contributions (4% auto-save)
- Access tax preparation tools

## 🚀 Quick Start

1. **Clone and install**:
   ```bash
   cd gig-benefits-platform
   npm install
   ```

2. **Setup database**:
   ```bash
   npx prisma migrate dev --name init
   npx tsx src/lib/seed.ts
   ```

3. **Start development**:
   ```bash
   npm run dev
   ```

4. **Demo login**:
   - Email: `sarah.driver@email.com`
   - Password: `demo123`

## 📊 Key Metrics

- **Impact**: Addresses 40M+ gig workers lacking benefits
- **Innovation**: Smart pooling + API integrations + micro-contributions
- **Economic Data**: Real BLS data on gig economy growth
- **Feasibility**: Built in 3 weeks with working prototype

## 🏆 HackNomics Alignment

- ✅ **Real-World Impact**: Combats gig worker inequality
- ✅ **Financial Innovation**: Portable benefits system
- ✅ **Economic Data**: Integration with BLS and Federal Reserve data
- ✅ **Technical Execution**: Full-stack working prototype
- ✅ **Social Good**: Financial inclusion for underserved workers

## 📱 Demo Flow

1. **Landing Page**: Problem explanation + value props
2. **Registration**: Quick signup for new gig workers
3. **Platform Connection**: Link Uber, DoorDash, Upwork accounts
4. **Dashboard**: 6-month earnings overview with charts
5. **Benefits Marketplace**: Enroll in health, retirement, emergency plans
6. **Auto-Savings**: Watch contributions grow automatically

Visit `http://localhost:3000` to try the demo!
