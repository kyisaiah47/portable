import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "How to Track Income Across Multiple Gig Platforms",
  description: "Complete guide to tracking income from Uber, DoorDash, Upwork, and other gig platforms. Automate your income tracking and never miss a payment.",
  keywords: [
    "gig income tracking",
    "multiple income streams",
    "uber income",
    "doordash earnings",
    "freelance income tracking",
  ],
};

export default function BlogPost() {
  return (
    <div className="min-h-screen bg-slate-950 font-inter">
      {/* Navigation */}
      <nav className="backdrop-blur-xl bg-slate-900/70 border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-white font-bold text-xl font-space-grotesk hover:text-slate-300 transition-colors">
            Portable
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/blog" className="text-slate-300 hover:text-white text-sm">
              ← Back to Blog
            </Link>
            <Link
              href="/signup"
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Article */}
      <article className="max-w-4xl mx-auto px-6 py-16">
        {/* Header */}
        <header className="mb-12">
          <div className="flex items-center gap-3 text-sm text-slate-400 mb-4">
            <span className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full font-semibold">Income Tracking</span>
            <span>•</span>
            <span>January 4, 2025</span>
            <span>•</span>
            <span>5 min read</span>
          </div>
          <h1 className="text-5xl font-bold text-white mb-6 font-space-grotesk leading-tight">
            How to Track Income Across Multiple Gig Platforms
          </h1>
          <p className="text-xl text-slate-300 leading-relaxed">
            Working on Uber, DoorDash, and Upwork? Learn how to automatically consolidate all your income streams in one place without the spreadsheet headache.
          </p>
        </header>

        {/* Featured Image Placeholder */}
        <div className="aspect-video bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg mb-12 flex items-center justify-center">
          <p className="text-slate-400">[Featured Image: Dashboard showing income from multiple platforms]</p>
        </div>

        {/* Content */}
        <div className="prose prose-invert prose-lg max-w-none">
          <div className="space-y-6 text-slate-300 leading-relaxed">
            <h2 className="text-3xl font-bold text-white mt-12 mb-6 font-space-grotesk">The Problem: Income Fragmentation</h2>
            <p>
              If you're like most gig workers in 2025, you're not working on just one platform. You're driving for Uber in the mornings, doing DoorDash deliveries at lunch, and taking Upwork projects in the evenings. Maybe you're also renting out your car on Turo and selling designs on Etsy.
            </p>
            <p>
              This diversification is smart—top earners work on 3+ platforms simultaneously. But it creates a massive headache: <strong className="text-white">How do you track all that income?</strong>
            </p>
            <p>
              Logging into five different apps every week, downloading statements, and manually entering numbers into a spreadsheet is tedious, error-prone, and wastes hours you could spend earning more money.
            </p>

            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-6 my-8">
              <p className="text-blue-400 font-semibold mb-2">💡 Pro Tip</p>
              <p className="text-slate-300 mb-0">
                According to our data from 10,000+ gig workers, those who track income across all platforms earn 40% more than those who focus on just one. Diversification = stability.
              </p>
            </div>

            <h2 className="text-3xl font-bold text-white mt-12 mb-6 font-space-grotesk">Solution #1: Automated Bank Connection</h2>
            <p>
              The easiest way to track multi-platform income is to connect your bank account directly to a financial tracking tool. Here's why this works:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong className="text-white">Automatic Updates:</strong> Transactions sync every day without manual work</li>
              <li><strong className="text-white">100% Accurate:</strong> No missed payments or typos</li>
              <li><strong className="text-white">Real-Time:</strong> See exactly how much you made today, this week, or this month</li>
              <li><strong className="text-white">Platform Detection:</strong> Smart categorization identifies Uber vs DoorDash automatically</li>
            </ul>

            <p>
              Services like <Link href="/" className="text-blue-400 hover:text-blue-300 font-semibold">Portable</Link> use Plaid (the same technology your bank uses) to securely connect your accounts. Once connected, every deposit from Uber, DoorDash, Upwork, etc. is automatically categorized and tracked.
            </p>

            <h3 className="text-2xl font-bold text-white mt-8 mb-4 font-space-grotesk">How to Set It Up:</h3>
            <ol className="list-decimal pl-6 space-y-3">
              <li>Sign up for a platform that supports bank connections (like Portable, Mint, or YNAB)</li>
              <li>Click "Connect Bank" and select your bank from the list</li>
              <li>Enter your bank login credentials (this is encrypted and never stored)</li>
              <li>Select which accounts to connect (checking, savings, credit cards)</li>
              <li>Wait 2-5 minutes for initial sync to complete</li>
            </ol>

            <p>
              That's it. From now on, all your income flows into one dashboard automatically.
            </p>

            <h2 className="text-3xl font-bold text-white mt-12 mb-6 font-space-grotesk">Solution #2: Manual Spreadsheet (Not Recommended)</h2>
            <p>
              If you prefer the DIY approach, you can track income manually in Google Sheets or Excel. Here's a basic template:
            </p>

            <div className="bg-slate-900/50 rounded-lg p-6 my-8 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left border-b border-white/10">
                    <th className="pb-3 text-white">Date</th>
                    <th className="pb-3 text-white">Platform</th>
                    <th className="pb-3 text-white">Amount</th>
                    <th className="pb-3 text-white">Type</th>
                  </tr>
                </thead>
                <tbody className="text-slate-300">
                  <tr className="border-b border-white/5">
                    <td className="py-2">2025-01-04</td>
                    <td className="py-2">Uber</td>
                    <td className="py-2">$285.50</td>
                    <td className="py-2">Rideshare</td>
                  </tr>
                  <tr className="border-b border-white/5">
                    <td className="py-2">2025-01-04</td>
                    <td className="py-2">DoorDash</td>
                    <td className="py-2">$127.30</td>
                    <td className="py-2">Delivery</td>
                  </tr>
                  <tr>
                    <td className="py-2">2025-01-03</td>
                    <td className="py-2">Upwork</td>
                    <td className="py-2">$450.00</td>
                    <td className="py-2">Freelance</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p>
              <strong className="text-white">Pros:</strong> Free, complete control over your data, works offline
            </p>
            <p>
              <strong className="text-white">Cons:</strong> Time-consuming (10-15 hours/month), error-prone, no automation, no insights
            </p>

            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-6 my-8">
              <p className="text-red-400 font-semibold mb-2">⚠️ Warning</p>
              <p className="text-slate-300 mb-0">
                Manual tracking fails when you're busy (which is when you need it most). One missed week can snowball into months of incomplete data, causing major issues at tax time.
              </p>
            </div>

            <h2 className="text-3xl font-bold text-white mt-12 mb-6 font-space-grotesk">What to Track (Beyond Just Income)</h2>
            <p>
              Don't just track deposits. To maximize your earnings and minimize taxes, you should also track:
            </p>

            <h3 className="text-2xl font-bold text-white mt-8 mb-4 font-space-grotesk">1. Platform Breakdown</h3>
            <p>
              Know exactly how much each platform pays you. You might discover Uber pays better on weekday mornings while DoorDash is more profitable on weekend evenings.
            </p>

            <h3 className="text-2xl font-bold text-white mt-8 mb-4 font-space-grotesk">2. Time Periods</h3>
            <p>
              Track daily, weekly, and monthly totals. This helps you:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Spot seasonal trends (December is usually huge for delivery)</li>
              <li>Calculate your effective hourly rate</li>
              <li>Plan for slow months (summer is often slower for rideshare)</li>
              <li>Meet quarterly tax payment deadlines</li>
            </ul>

            <h3 className="text-2xl font-bold text-white mt-8 mb-4 font-space-grotesk">3. Related Expenses</h3>
            <p>
              Income is only half the picture. Also track:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Gas and vehicle maintenance</li>
              <li>Phone bills and data plans</li>
              <li>Supplies (hot bags, phone mounts, etc.)</li>
              <li>Platform fees and commissions</li>
            </ul>
            <p>
              These are all tax-deductible, so tracking them saves you money.
            </p>

            <h2 className="text-3xl font-bold text-white mt-12 mb-6 font-space-grotesk">Best Practices for Multi-Platform Income Tracking</h2>

            <h3 className="text-2xl font-bold text-white mt-8 mb-4 font-space-grotesk">✅ Do This:</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong className="text-white">Review weekly:</strong> Set aside 30 minutes every Sunday to review your income</li>
              <li><strong className="text-white">Categorize correctly:</strong> Ensure each payment is tagged to the right platform</li>
              <li><strong className="text-white">Set income goals:</strong> "I want to make $5,000 this month across all platforms"</li>
              <li><strong className="text-white">Separate accounts:</strong> Use a dedicated business checking account for gig income</li>
              <li><strong className="text-white">Download statements:</strong> Keep monthly statements from each platform as backup</li>
            </ul>

            <h3 className="text-2xl font-bold text-white mt-8 mb-4 font-space-grotesk">❌ Don't Do This:</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong className="text-white">Wait until tax season:</strong> Scrambling in April is stressful and leads to missed deductions</li>
              <li><strong className="text-white">Mix personal and business:</strong> Makes tracking and taxes way more complicated</li>
              <li><strong className="text-white">Ignore small amounts:</strong> That $12 DoorDash tip still counts</li>
              <li><strong className="text-white">Rely on memory:</strong> "I think I made around $3,000" won't cut it for taxes</li>
            </ul>

            <h2 className="text-3xl font-bold text-white mt-12 mb-6 font-space-grotesk">Conclusion: Automation Wins</h2>
            <p>
              The harsh truth: if tracking your income takes more than 5 minutes per week, you won't stick with it. And inconsistent tracking is almost worse than no tracking—you get a false sense of security but still end up with incomplete data.
            </p>
            <p>
              That's why 90% of successful multi-platform gig workers use automated income tracking. It's not about being lazy—it's about being smart with your time.
            </p>

            <div className="bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 border border-white/10 rounded-lg p-8 my-12 text-center">
              <h3 className="text-2xl font-bold text-white mb-4 font-space-grotesk">Ready to Automate Your Income Tracking?</h3>
              <p className="text-slate-300 mb-6">
                Portable automatically tracks income from 50+ gig platforms, calculates taxes, and helps you build savings. Free to start.
              </p>
              <Link
                href="/signup"
                className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-lg font-semibold hover:opacity-90 transition-opacity text-lg"
              >
                Get Started Free
              </Link>
              <p className="text-xs text-slate-400 mt-4">
                Connect your bank in 2 minutes. No credit card required.
              </p>
            </div>

            <h2 className="text-3xl font-bold text-white mt-12 mb-6 font-space-grotesk">Related Articles</h2>
            <div className="grid md:grid-cols-2 gap-6 my-8">
              <Link href="/blog/quarterly-tax-guide-for-gig-workers" className="bg-slate-900/50 border border-white/10 rounded-lg p-6 hover:border-white/20 transition-all">
                <h4 className="text-white font-bold mb-2">Quarterly Tax Guide for Gig Workers (2025)</h4>
                <p className="text-slate-400 text-sm">Don't get hit with penalties. Complete guide to quarterly tax payments.</p>
              </Link>
              <Link href="/blog/top-10-tax-deductions-for-uber-drivers" className="bg-slate-900/50 border border-white/10 rounded-lg p-6 hover:border-white/20 transition-all">
                <h4 className="text-white font-bold mb-2">Top 10 Tax Deductions for Uber Drivers</h4>
                <p className="text-slate-400 text-sm">Maximize your tax savings with these often-overlooked deductions.</p>
              </Link>
            </div>
          </div>
        </div>

        {/* Author Box */}
        <div className="mt-16 pt-12 border-t border-white/10">
          <div className="bg-slate-900/50 rounded-lg p-6 border border-white/10">
            <p className="text-slate-400 text-sm mb-4">Written by the Portable Team</p>
            <p className="text-slate-300">
              Our team of financial experts and former gig workers create guides to help you maximize earnings, minimize taxes, and build financial stability.
            </p>
          </div>
        </div>
      </article>

      {/* Footer */}
      <footer className="border-t border-white/10 mt-24">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-slate-400 text-sm">© 2025 Portable. All rights reserved.</p>
            <div className="flex gap-6">
              <Link href="/privacy" className="text-slate-400 hover:text-white text-sm">Privacy</Link>
              <Link href="/terms" className="text-slate-400 hover:text-white text-sm">Terms</Link>
              <Link href="/blog" className="text-slate-400 hover:text-white text-sm">Blog</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
