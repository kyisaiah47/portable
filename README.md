<div align="center">

<img src="assets/banner.png" alt="banner" width="100%" />

# 🎒 Portable

**Benefits that move with you — portable health, retirement, and insurance for gig workers**

![Next.js](https://img.shields.io/badge/Next.js_15-black?style=for-the-badge&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS_v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)

*HackNomics 2025*

</div>

<br/>

Portable is a financial platform built from the ground up for the 70 million Americans working in the gig economy. Upload a bank statement once and Portable automatically detects income from 50+ platforms, categorizes deductible expenses, and calculates your real-time quarterly tax liability — turning financial chaos into clarity. Where traditional finance tools treat gig work as a side hustle, Portable treats it as the full-time career it is.

## ✨ Features

- **Automatic Income Tracking** — Recognizes income from 50+ platforms including Uber, Lyft, DoorDash, Instacart, Upwork, Fiverr, YouTube, and Patreon; broken down by platform, week, and month
- **Smart Expense Categorization** — Applies IRS-approved deduction rates to every transaction automatically — gas, phone bills, subscriptions, and more — so you stop leaving $3,000–$5,000 on the table each year
- **Real-Time Tax Calculator** — Computes self-employment tax (15.3%), federal income tax, and state estimates with quarterly deadlines and a full-year projection based on current earnings
- **Income Stability Score** — Proprietary algorithm that translates variable gig income into a consistency score that landlords and lenders actually understand
- **Benefits & Services Hub** — Connects gig workers with health insurance, retirement accounts, and financial products designed for self-employed income
- **Hyper-Personalized Guidance** — Platform- and city-specific advice on maximizing earnings, surge opportunities, and tax strategies tailored to your income mix

## 🎥 Demo

[![Watch Demo](https://img.shields.io/badge/YouTube-Watch%20Demo-FF0000?style=for-the-badge&logo=youtube&logoColor=white)](https://www.youtube.com/watch?v=9AjgeyStgtI)

**Live App**: [portable-buwubjqtb-kyisaiah47s-projects.vercel.app](https://portable-buwubjqtb-kyisaiah47s-projects.vercel.app)

Demo credentials: `sarah.driver@email.com` / `demo123` — or upload `public/sample-bank-statement.csv` to try it with sample data.

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Database / Auth | Supabase (PostgreSQL + Realtime) |
| UI Components | Shadcn UI + Radix |
| Charts | Recharts |
| Icons | Lucide React + React Icons |
| Notifications | Sonner |
| Fonts | Space Grotesk, Inter, Outfit, Sora |

## 🚀 Getting Started

**Prerequisites**: Node.js 18+, Supabase account (free tier)

```bash
git clone https://github.com/kyisaiah47/portable.git
cd portable
npm install
cp .env.example .env.local   # add your Supabase URL and anon key
# run database/supabase-migration-portable.sql in your Supabase SQL editor
npm run dev
# visit http://localhost:3000
```

## 📄 License

MIT
