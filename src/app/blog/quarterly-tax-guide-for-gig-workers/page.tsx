import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Quarterly Tax Guide for Gig Workers (2025)",
  description: "Complete guide to quarterly tax payments for 1099 contractors. Deadlines, calculations, and how to avoid penalties.",
  keywords: ["quarterly taxes", "1099 taxes", "gig worker taxes", "self employment tax", "estimated taxes"],
  openGraph: {
    title: "Quarterly Tax Guide for Gig Workers (2025)",
    description: "Complete guide to quarterly tax payments for 1099 contractors. Deadlines, calculations, and how to avoid penalties.",
    type: "article",
    publishedTime: "2025-01-03T00:00:00.000Z",
    authors: ["Portable"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Quarterly Tax Guide for Gig Workers (2025)",
    description: "Complete guide to quarterly tax payments for 1099 contractors. Deadlines, calculations, and how to avoid penalties.",
  },
};

export default function BlogPost() {
  return (
    <div className="min-h-screen bg-slate-950 font-inter">
      <nav className="backdrop-blur-xl bg-slate-900/70 border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-white font-bold text-xl font-space-grotesk hover:text-slate-300 transition-colors">
            Portable
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/blog" className="text-slate-300 hover:text-white text-sm">
              ← Back to Blog
            </Link>
            <Link href="/signup" className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      <article className="max-w-4xl mx-auto px-6 py-16">
        <header className="mb-12">
          <div className="flex items-center gap-3 text-sm text-slate-400 mb-4">
            <span className="bg-purple-500/20 text-purple-400 px-3 py-1 rounded-full font-semibold">Taxes</span>
            <span>•</span>
            <span>January 3, 2025</span>
            <span>•</span>
            <span>8 min read</span>
          </div>
          <h1 className="text-5xl font-bold text-white mb-6 font-space-grotesk leading-tight">
            Quarterly Tax Guide for Gig Workers (2025)
          </h1>
          <p className="text-xl text-slate-300 leading-relaxed">
            Avoid penalties and stay on top of your tax obligations as a 1099 contractor. Here's everything you need to know about quarterly estimated tax payments.
          </p>
        </header>

        <div className="prose prose-invert prose-lg max-w-none">
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-6 mb-8">
            <h3 className="text-blue-400 font-bold mb-2 mt-0">2025 Quarterly Tax Deadlines</h3>
            <ul className="mb-0 text-slate-300">
              <li><strong>Q1 2025 (Jan 1 - Mar 31):</strong> Due April 15, 2025</li>
              <li><strong>Q2 2025 (Apr 1 - May 31):</strong> Due June 16, 2025</li>
              <li><strong>Q3 2025 (Jun 1 - Aug 31):</strong> Due September 15, 2025</li>
              <li><strong>Q4 2025 (Sep 1 - Dec 31):</strong> Due January 15, 2026</li>
            </ul>
          </div>

          <h2 className="text-3xl font-bold text-white mb-4 font-space-grotesk">Why Gig Workers Pay Quarterly Taxes</h2>
          <p className="text-slate-300">
            Unlike traditional employees who have taxes withheld from each paycheck, independent contractors are responsible for paying their own taxes throughout the year. The IRS requires quarterly estimated tax payments if you expect to owe $1,000 or more in taxes.
          </p>

          <h2 className="text-3xl font-bold text-white mb-4 mt-8 font-space-grotesk">What Taxes Do You Owe?</h2>
          <p className="text-slate-300">As a gig worker, you're responsible for:</p>
          <ul className="text-slate-300">
            <li><strong>Income Tax:</strong> Federal and state income tax based on your tax bracket</li>
            <li><strong>Self-Employment Tax (15.3%):</strong> Covers Social Security (12.4%) and Medicare (2.9%)</li>
          </ul>

          <h2 className="text-3xl font-bold text-white mb-4 mt-8 font-space-grotesk">How to Calculate Quarterly Taxes</h2>
          <div className="bg-slate-900/50 border border-white/10 rounded-lg p-6">
            <h3 className="text-white font-semibold mb-3">Simple Formula:</h3>
            <ol className="text-slate-300 space-y-2">
              <li>Calculate your <strong>total income</strong> for the quarter</li>
              <li>Subtract <strong>business expenses</strong> (mileage, phone, supplies)</li>
              <li>This is your <strong>net profit</strong></li>
              <li>Multiply by <strong>30%</strong> (covers income tax + self-employment tax)</li>
              <li>This is your quarterly payment</li>
            </ol>
          </div>

          <p className="text-slate-300 mt-6">
            <strong>Example:</strong> If you earned $10,000 in Q1 with $2,000 in expenses, your net profit is $8,000. Your quarterly payment: $8,000 × 0.30 = $2,400.
          </p>

          <h2 className="text-3xl font-bold text-white mb-4 mt-8 font-space-grotesk">How to Pay Quarterly Taxes</h2>
          <p className="text-slate-300">Three easy methods:</p>
          <ol className="text-slate-300">
            <li><strong>IRS Direct Pay:</strong> Free online payment at <a href="https://www.irs.gov/payments" className="text-blue-400 hover:text-blue-300">irs.gov/payments</a></li>
            <li><strong>IRS2Go Mobile App:</strong> Pay from your smartphone</li>
            <li><strong>Mail a Check:</strong> Send Form 1040-ES with your payment</li>
          </ol>

          <h2 className="text-3xl font-bold text-white mb-4 mt-8 font-space-grotesk">Penalties for Late Payment</h2>
          <p className="text-slate-300">
            If you underpay or miss a quarterly deadline, the IRS charges a penalty of approximately 0.5% per month on the unpaid amount. For a $2,000 payment that's 3 months late, that's about $30 in penalties—not huge, but avoidable.
          </p>

          <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-6 mt-8">
            <h3 className="text-green-400 font-bold mb-2 mt-0">Pro Tips for Gig Workers</h3>
            <ul className="mb-0 text-slate-300">
              <li>Set aside 30% of every payment immediately</li>
              <li>Use Portable to automatically track quarterly earnings</li>
              <li>Keep a separate savings account for taxes</li>
              <li>Track ALL business expenses (you'll thank yourself later)</li>
              <li>If your income varies, pay based on actual quarterly earnings, not last year's total</li>
            </ul>
          </div>

          <h2 className="text-3xl font-bold text-white mb-4 mt-8 font-space-grotesk">What If You Can't Pay?</h2>
          <p className="text-slate-300">
            If you're short on a quarterly payment, pay what you can and set up a payment plan with the IRS. It's better to pay something than nothing—penalties and interest compound quickly.
          </p>

          <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-6 mt-12">
            <h3 className="text-purple-400 font-bold mb-3 mt-0">Ready to Simplify Your Taxes?</h3>
            <p className="text-slate-300 mb-4">
              Portable automatically calculates your quarterly tax estimates based on your actual income from all platforms. No more guesswork, no more spreadsheets.
            </p>
            <Link href="/signup" className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-bold hover:opacity-90 transition-opacity">
              Start Free Trial →
            </Link>
          </div>
        </div>
      </article>
    </div>
  );
}
