'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import Logo, { ShiftMark } from '@/components/Logo';

/* ---------------------------------------------------------------------------
 * Stylized product preview rendered in plain HTML — sits inside a hairline
 * "browser" frame under the hero, the way calm fintech landing pages show
 * the real dashboard instead of marketing illustrations.
 * ------------------------------------------------------------------------ */
function DashboardPreview() {
  const rows = [
    { date: 'Jun 24', desc: 'UBER TRIP EARNINGS WEEKLY', platform: 'Uber', amount: '$495.00' },
    { date: 'Jun 22', desc: 'DOORDASH DASHER PAYMENT', platform: 'DoorDash', amount: '$295.50' },
    { date: 'Jun 19', desc: 'UPWORK PROJECT PAYMENT', platform: 'Upwork', amount: '$1,200.00' },
    { date: 'Jun 17', desc: 'DD DRIVER WEEKLY DEPOSIT', platform: 'DoorDash', amount: '$310.00' },
    { date: 'Jun 15', desc: 'UBER TECHNOLOGIES INC', platform: 'Uber', amount: '$480.75' },
  ];

  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-[0_24px_60px_-24px_rgba(30,30,60,0.18)] overflow-hidden text-left select-none pointer-events-none">
      {/* Browser chrome */}
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-gray-200 bg-gray-50">
        <span className="w-2.5 h-2.5 rounded-full bg-gray-300" />
        <span className="w-2.5 h-2.5 rounded-full bg-gray-300" />
        <span className="w-2.5 h-2.5 rounded-full bg-gray-300" />
        <div className="ml-3 flex-1 max-w-xs h-5 rounded bg-white border border-gray-200" />
      </div>
      <div className="flex">
        {/* Mini sidebar */}
        <div className="hidden sm:block w-44 border-r border-gray-200 bg-gray-50/60 p-4">
          <Logo className="mb-6" />
          <div className="space-y-1 text-[13px]">
            {['Home', 'Income', 'Expenses', 'Taxes', 'Insights'].map((item, i) => (
              <div
                key={item}
                className={`px-2.5 py-1.5 rounded-md ${
                  i === 1 ? 'bg-indigo-50 text-indigo-700 font-medium' : 'text-gray-500'
                }`}
              >
                {item}
              </div>
            ))}
          </div>
        </div>
        {/* Content */}
        <div className="flex-1 p-5 sm:p-7">
          <div className="text-[11px] font-medium uppercase tracking-wider text-gray-400 mb-1">
            Income · June
          </div>
          <div className="flex items-baseline gap-3 mb-6">
            <span className="text-3xl sm:text-4xl font-semibold tracking-tight text-gray-900">
              $7,910.75
            </span>
            <span className="text-[13px] font-medium text-emerald-700">+12% vs May</span>
          </div>
          <table className="w-full text-[13px]">
            <thead>
              <tr className="text-[11px] uppercase tracking-wider text-gray-400 border-b border-gray-200">
                <th className="text-left font-medium py-2 pr-3">Date</th>
                <th className="text-left font-medium py-2 pr-3">Description</th>
                <th className="text-left font-medium py-2 pr-3 hidden sm:table-cell">Platform</th>
                <th className="text-right font-medium py-2">Amount</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.desc} className="border-b border-gray-100 last:border-0">
                  <td className="py-2.5 pr-3 text-gray-500 whitespace-nowrap">{row.date}</td>
                  <td className="py-2.5 pr-3 text-gray-900 truncate max-w-[160px]">{row.desc}</td>
                  <td className="py-2.5 pr-3 hidden sm:table-cell">
                    <span className="inline-flex items-center rounded px-1.5 py-0.5 text-[11px] font-medium bg-gray-100 text-gray-600">
                      {row.platform}
                    </span>
                  </td>
                  <td className="py-2.5 text-right font-medium text-emerald-700">{row.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* Small inline visuals for the feature rows ------------------------------- */

function ClassifierVisual() {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 text-[13px]">
      <div className="text-[11px] uppercase tracking-wider text-gray-400 font-medium mb-3">
        Classification
      </div>
      {[
        { desc: 'SHELL OIL 57442', tag: 'Vehicle · 100% deductible', via: 'Pattern' },
        { desc: 'GOPRO HERO 12 B&H', tag: 'Equipment · deductible', via: 'AI' },
        { desc: 'TRADER JOES #552', tag: 'Personal · not deductible', via: 'Pattern' },
      ].map((r) => (
        <div key={r.desc} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
          <div>
            <div className="text-gray-900">{r.desc}</div>
            <div className="text-[11px] text-gray-500">{r.tag}</div>
          </div>
          <span
            className={`text-[10px] font-semibold uppercase tracking-wide rounded px-1.5 py-0.5 ${
              r.via === 'AI' ? 'bg-indigo-50 text-indigo-700' : 'bg-gray-100 text-gray-500'
            }`}
          >
            {r.via}
          </span>
        </div>
      ))}
    </div>
  );
}

function TaxVisual() {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 text-[13px]">
      <div className="text-[11px] uppercase tracking-wider text-gray-400 font-medium mb-3">
        Estimated quarterly payment
      </div>
      <div className="text-2xl font-semibold tracking-tight text-gray-900 mb-3">$1,184</div>
      {[
        ['Self-employment tax', '$2,418'],
        ['Federal income tax', '$1,765'],
        ['State tax (est.)', '$553'],
      ].map(([label, value]) => (
        <div key={label} className="flex items-center justify-between py-1.5 border-b border-gray-100 last:border-0">
          <span className="text-gray-500">{label}</span>
          <span className="font-medium text-gray-900">{value}</span>
        </div>
      ))}
      <div className="mt-3 text-[11px] text-gray-400">Q3 due September 15</div>
    </div>
  );
}

function DeductionVisual() {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 text-[13px]">
      <div className="flex items-center justify-between mb-3">
        <div className="text-[11px] uppercase tracking-wider text-gray-400 font-medium">
          Can I deduct this?
        </div>
        <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium bg-emerald-50 text-emerald-700">
          Deductible
        </span>
      </div>
      <div className="text-gray-900 mb-1">AUTOZONE #1182 — $86.40</div>
      <p className="text-gray-500 leading-relaxed">
        Vehicle maintenance for a rideshare vehicle is an ordinary and necessary business
        expense. Deduct the business-use share if you take actual expenses instead of the
        standard mileage rate.
      </p>
    </div>
  );
}

const platforms = [
  'Uber',
  'Lyft',
  'DoorDash',
  'Instacart',
  'Grubhub',
  'Upwork',
  'Fiverr',
  'YouTube',
  'Twitch',
  'Airbnb',
];

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Navigation */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-gray-200">
        <nav className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" aria-label="Stub home">
            <Logo />
          </Link>
          <div className="flex items-center gap-2">
            <Link
              href="/blog"
              className="hidden sm:inline-block px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              Blog
            </Link>
            <Link
              href="/login"
              className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              Log in
            </Link>
            <Link
              href="/signup"
              className="px-3.5 py-1.5 text-sm font-medium rounded-md bg-gray-900 text-white hover:bg-gray-800 transition-colors"
            >
              Open account
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero */}
      <section className="px-6 pt-20 pb-16 sm:pt-28">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl md:text-[56px] font-semibold tracking-tight leading-[1.08] mb-5">
            Banking-grade clarity for gig income.
          </h1>
          <p className="text-lg text-gray-500 leading-relaxed max-w-xl mx-auto mb-8">
            Stub reads your bank statement, sorts every payout by platform, flags deductible
            expenses, and tells you exactly what to set aside for quarterly taxes.
          </p>
          <div className="flex items-center justify-center gap-3">
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 transition-colors"
            >
              Open account
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center px-5 py-2.5 rounded-md border border-gray-300 text-sm font-medium text-gray-700 hover:border-gray-400 transition-colors"
            >
              See the demo
            </Link>
          </div>
        </div>

        {/* Product frame */}
        <div className="max-w-4xl mx-auto mt-16">
          <DashboardPreview />
        </div>

        {/* Platform row */}
        <div className="max-w-4xl mx-auto mt-14">
          <p className="text-center text-[11px] font-medium uppercase tracking-wider text-gray-400 mb-5">
            Detects payouts from 50+ platforms
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
            {platforms.map((name) => (
              <span key={name} className="text-sm font-medium text-gray-400">
                {name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Feature rows */}
      <section id="features" className="border-t border-gray-200">
        <div className="max-w-5xl mx-auto px-6 py-20 space-y-20">
          {/* Row 1 */}
          <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center">
            <div>
              <div className="text-[11px] font-medium uppercase tracking-wider text-indigo-600 mb-3">
                Income
              </div>
              <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight mb-3">
                Every payout, one ledger.
              </h2>
              <p className="text-gray-500 leading-relaxed">
                Upload a CSV from any bank. A hybrid pipeline — fast pattern matching first,
                Claude for the ambiguous remainder — labels each deposit with its platform, so
                Uber, DoorDash, and Upwork stop living in five different apps.
              </p>
            </div>
            <ClassifierVisual />
          </div>

          {/* Row 2 */}
          <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center">
            <div className="md:order-2">
              <div className="text-[11px] font-medium uppercase tracking-wider text-indigo-600 mb-3">
                Taxes
              </div>
              <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight mb-3">
                Know the number before the IRS does.
              </h2>
              <p className="text-gray-500 leading-relaxed">
                Self-employment tax, federal brackets, and state estimates are computed from
                your real income — then translated into one quarterly payment and a plain-English
                summary of why you owe it.
              </p>
            </div>
            <div className="md:order-1">
              <TaxVisual />
            </div>
          </div>

          {/* Row 3 */}
          <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center">
            <div>
              <div className="text-[11px] font-medium uppercase tracking-wider text-indigo-600 mb-3">
                Deductions
              </div>
              <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight mb-3">
                Ask about any expense.
              </h2>
              <p className="text-gray-500 leading-relaxed">
                Deductible expenses are flagged automatically as your statement is parsed. Not
                sure about a charge? One click gets a grounded verdict — category, deduction
                rate, and the reasoning behind it.
              </p>
            </div>
            <DeductionVisual />
          </div>
        </div>
      </section>

      {/* Quiet CTA */}
      <section className="border-t border-gray-200">
        <div className="max-w-3xl mx-auto px-6 py-20 text-center">
          <ShiftMark className="mx-auto mb-6 h-9 text-indigo-600" />
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight mb-3">
            Your income is already complicated. Your books shouldn&apos;t be.
          </h2>
          <p className="text-gray-500 mb-8">
            Free to start. Upload one statement and see where you stand.
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 transition-colors"
          >
            Open account
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-14">
          <div className="grid sm:grid-cols-4 gap-10 mb-10">
            <div>
              <Logo className="mb-3" />
              <p className="text-sm text-gray-500 leading-relaxed">
                Financial tools for gig workers and independent contractors.
              </p>
            </div>
            <div>
              <h3 className="text-[11px] font-medium uppercase tracking-wider text-gray-400 mb-3">
                Product
              </h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#features" className="hover:text-gray-900">Features</a></li>
                <li><Link href="/blog" className="hover:text-gray-900">Blog</Link></li>
                <li><Link href="/signup" className="hover:text-gray-900">Get started</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-[11px] font-medium uppercase tracking-wider text-gray-400 mb-3">
                Company
              </h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><Link href="/privacy" className="hover:text-gray-900">Privacy</Link></li>
                <li><Link href="/terms" className="hover:text-gray-900">Terms</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-[11px] font-medium uppercase tracking-wider text-gray-400 mb-3">
                Connect
              </h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="mailto:support@portable.app" className="hover:text-gray-900">Support</a></li>
                <li><a href="mailto:hello@portable.app" className="hover:text-gray-900">Contact</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-200 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-[13px] text-gray-400">© 2026 Stub Financial Ltd. All rights reserved.</p>
            <div className="flex items-center gap-5 text-[13px] text-gray-500">
              <Link href="/privacy" className="hover:text-gray-900">Privacy</Link>
              <Link href="/terms" className="hover:text-gray-900">Terms</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
