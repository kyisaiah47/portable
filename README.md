<div align="center">

# 🧾 Stub

**The books your gig work never came with — upload a bank statement, get your income, write-offs, and quarterly taxes sorted.**

![Next.js](https://img.shields.io/badge/Next.js_15-black?style=for-the-badge&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS_v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![Claude](https://img.shields.io/badge/Claude_Sonnet-D97757?style=for-the-badge&logo=anthropic&logoColor=white)

</div>

<br/>

Stub is a financial platform for independent workers. Upload a bank-statement CSV and it recognizes gig income across 50+ platforms (Uber, DoorDash, Upwork, YouTube, Airbnb…), catches deductible expenses with the IRS-grade reason behind each one, and computes what to set aside for quarterly self-employment taxes.

## How the classification works

A hybrid pipeline keeps it fast and nearly free:

1. **Regex first pass** — 20+ platform patterns classify the obvious transactions instantly, at zero cost
2. **Claude for the rest** — anything ambiguous is batched to `claude-sonnet-4-6`, which returns structured JSON: platform, income category, deductibility, rationale, confidence
3. **Math stays deterministic** — self-employment tax (15.3%), federal estimates, and quarterly set-asides are computed in plain TypeScript (`tax-calculator.ts`); the model narrates numbers, it never does arithmetic

A typical statement costs a few cents to classify; most cost less than one.

## Features

- **First-run wizard** — new accounts are walked straight into their first upload
- **"Can I deduct this?"** — ask about any transaction, get a grounded answer with the deduction category and why
- **AI quarterly summary** — a plain-English read of what you owe and what to set aside
- **Platform insights** — compare earnings across platforms and spot where the next dollar comes from
- **Income stability score** — translates variable gig income into a number landlords and lenders understand
- **Referrals, benefits hub, tax learn center**

## Stack

Next.js 15 (App Router) · TypeScript · Tailwind v4 · shadcn/ui · Supabase (Postgres + Auth, RLS per user) · Anthropic API

## Running locally

```bash
npm install
cp .env.example .env.local   # Supabase URL/keys + ANTHROPIC_API_KEY
npm run dev
```

Try it without real data: sign up, then upload `public/sample-bank-statement.csv` (76 fake transactions across 7 platforms).

```bash
npm test        # vitest — parser, hybrid classifier, tax calculator
npm run build
```

## License

MIT
