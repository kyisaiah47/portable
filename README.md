# GigBenefits Platform

A portable benefits platform for gig workers built for HackNomics 2025.

## 🎥 Demo Video
[**► Watch the full demo on YouTube**](YOUTUBE_LINK_PLACEHOLDER)

> 🚀 **Live Demo**: Try it at [gigbenefits-platform.vercel.app](https://gig-benefits-platform.vercel.app) or run locally below

## 🚀 Features

- **Income Tracking**: Connect multiple gig platforms (Uber, DoorDash, Upwork, etc.)
- **Automatic Savings**: 4% of earnings automatically saved for benefits
- **Benefits Marketplace**: Health insurance, retirement plans, emergency funds
- **Real-time Dashboard**: Track earnings, contributions, and benefit enrollment
- **Demo User Journey**: Complete 6-month worker story with Sarah Johnson

## 🏗️ Tech Stack

- **Frontend**: Next.js 15, React, TypeScript, Tailwind CSS
- **Design**: Linear-style minimal UI with subtle depth and animations
- **Backend**: Next.js API routes, Prisma ORM
- **Database**: SQLite (easily deployable)
- **Charts**: Recharts for earnings visualization
- **Authentication**: JWT with bcrypt password hashing
- **Icons**: Lucide React with Shield branding

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

## 📱 User Experience

**Modern, Linear-inspired Design:**
- Clean minimal interface with subtle depth and animations
- Professional landing page with dedicated auth flow
- Interactive dashboard with hover effects and micro-interactions
- Comprehensive benefits marketplace with category filtering

**Demo Flow:**
1. **Landing Page**: Clean hero section with value proposition
2. **Authentication**: Dedicated login/signup pages (traditional SaaS pattern)
3. **Platform Connection**: Link multiple gig platforms with status tracking
4. **Dashboard**: 6-month earnings visualization with platform breakdown
5. **Benefits Marketplace**: Browse and enroll in health, retirement, emergency plans
6. **Income Tracking**: Manual entry forms plus automatic platform sync

## 🎯 Key Statistics

- **Target Market**: 40M+ gig workers with 0% traditional benefits
- **Average Income**: $47K annually across platforms
- **Auto-Savings**: 4% benefits + 2% emergency = 6% total
- **Demo Data**: 6 months of realistic earnings across Uber, DoorDash, Upwork

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/kyisaiah47/gig-benefits-platform.git
   cd gig-benefits-platform
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Setup database**:
   ```bash
   npx prisma migrate dev --name init
   npx tsx src/lib/seed.ts
   ```

4. **Start development server**:
   ```bash
   npm run dev
   ```

5. **Access the demo**:
   - Visit: `http://localhost:3000`
   - Demo login: `sarah.driver@email.com` / `demo123`

## 🏆 HackNomics 2025 Submission

This project addresses the critical gap in financial security for America's growing gig economy workforce through innovative technology and thoughtful UX design.
