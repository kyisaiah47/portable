import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Top 10 Tax Deductions for Uber Drivers",
  description: "Maximize your tax savings with these often-overlooked deductions. Save thousands on your 2025 taxes as an Uber or Lyft driver.",
  keywords: ["uber tax deductions", "rideshare taxes", "lyft deductions", "mileage deduction", "1099 deductions"],
  openGraph: {
    title: "Top 10 Tax Deductions for Uber Drivers",
    description: "Maximize your tax savings with these often-overlooked deductions. Save thousands on your 2025 taxes as an Uber or Lyft driver.",
    type: "article",
    publishedTime: "2025-01-02T00:00:00.000Z",
    authors: ["Portable"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Top 10 Tax Deductions for Uber Drivers",
    description: "Maximize your tax savings with these often-overlooked deductions. Save thousands on your 2025 taxes as an Uber or Lyft driver.",
  },
};

export default function BlogPost() {
  return (
    <div className="min-h-screen bg-slate-950 font-inter">
      <nav className="backdrop-blur-xl bg-slate-900/70 border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-white font-bold text-xl font-space-grotesk">Portable</Link>
          <div className="flex items-center gap-4">
            <Link href="/blog" className="text-slate-300 hover:text-white text-sm">← Back to Blog</Link>
            <Link href="/signup" className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg text-sm font-semibold">Get Started</Link>
          </div>
        </div>
      </nav>

      <article className="max-w-4xl mx-auto px-6 py-16">
        <header className="mb-12">
          <div className="flex items-center gap-3 text-sm text-slate-400 mb-4">
            <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full font-semibold">Taxes</span>
            <span>•</span><span>January 2, 2025</span><span>•</span><span>6 min read</span>
          </div>
          <h1 className="text-5xl font-bold text-white mb-6 font-space-grotesk">Top 10 Tax Deductions for Uber Drivers</h1>
          <p className="text-xl text-slate-300">Most Uber and Lyft drivers overpay on taxes by thousands of dollars. Here are the deductions you can't afford to miss.</p>
        </header>

        <div className="prose prose-invert prose-lg max-w-none text-slate-300">
          <p>As a rideshare driver, you're an independent contractor—which means you can deduct business expenses to lower your taxable income. The average Uber driver can save $3,000-$5,000 annually with proper deductions.</p>

          <h2 className="text-3xl font-bold text-white mb-4 mt-8 font-space-grotesk">1. Mileage Deduction (The Big One)</h2>
          <p><strong>2025 Rate: 70¢ per mile</strong></p>
          <p>This is your biggest tax savings. Track every mile driven while waiting for rides, driving to pick up passengers, and taking passengers to destinations. If you drive 20,000 miles for Uber, that's a $14,000 deduction.</p>
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 my-4">
            <p className="mb-0"><strong>Pro tip:</strong> Use Stride or MileIQ to automatically track miles. Manual logs work too—just be consistent.</p>
          </div>

          <h2 className="text-3xl font-bold text-white mb-4 mt-8 font-space-grotesk">2. Phone & Service</h2>
          <p>Deduct the business portion of your phone bill (typically 50-80% if you use it primarily for rideshare). Example: $100/month × 70% business use × 12 months = $840 deduction.</p>

          <h2 className="text-3xl font-bold text-white mb-4 mt-8 font-space-grotesk">3. Car Washes & Detailing</h2>
          <p>Keep your car clean for 5-star ratings? Fully deductible. Save every receipt. Average annual deduction: $300-$600.</p>

          <h2 className="text-3xl font-bold text-white mb-4 mt-8 font-space-grotesk">4. Roadside Assistance</h2>
          <p>AAA membership, emergency kits, jumper cables—all deductible if you carry them for rideshare.</p>

          <h2 className="text-3xl font-bold text-white mb-4 mt-8 font-space-grotesk">5. Snacks & Water for Passengers</h2>
          <p>Offering bottled water or mints? Keep receipts. Typical deduction: $100-$200/year.</p>

          <h2 className="text-3xl font-bold text-white mb-4 mt-8 font-space-grotesk">6. Uber/Lyft Commission & Fees</h2>
          <p>The 25-30% platform fee Uber takes from each ride is deductible. This is already subtracted from your 1099, but if you're tracking gross earnings, remember this.</p>

          <h2 className="text-3xl font-bold text-white mb-4 mt-8 font-space-grotesk">7. Parking & Tolls</h2>
          <p>Paid parking while waiting for rides and toll roads during trips are 100% deductible.</p>

          <h2 className="text-3xl font-bold text-white mb-4 mt-8 font-space-grotesk">8. Car Accessories</h2>
          <p>Dash cam ($100-$200), phone mount ($30), seat covers ($50), floor mats ($40)—all deductible in the year purchased.</p>

          <h2 className="text-3xl font-bold text-white mb-4 mt-8 font-space-grotesk">9. Health Insurance Premiums</h2>
          <p>If you're self-employed and pay for your own health insurance, you can deduct 100% of premiums. This is an above-the-line deduction (even better than itemized).</p>

          <h2 className="text-3xl font-bold text-white mb-4 mt-8 font-space-grotesk">10. Retirement Contributions</h2>
          <p>Contribute to a SEP IRA or Solo 401(k) and deduct up to $66,000 (2024 limit). If you earned $50,000 driving and contribute $10,000, you only pay taxes on $40,000.</p>

          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-6 my-8">
            <h3 className="text-red-400 font-bold mb-2 mt-0">⚠️ You Cannot Deduct:</h3>
            <ul className="mb-0 text-slate-300">
              <li>Commute from home to first ride (personal miles)</li>
              <li>Traffic tickets or parking violations</li>
              <li>Meals for yourself (unless traveling overnight)</li>
            </ul>
          </div>

          <h2 className="text-3xl font-bold text-white mb-4 mt-8 font-space-grotesk">Standard vs. Actual Expense Method</h2>
          <p><strong>Standard Mileage (70¢/mile in 2025):</strong> Simpler. Just track miles.</p>
          <p><strong>Actual Expense Method:</strong> Track gas, insurance, repairs, depreciation. More work but can save more if you drive a newer, expensive car.</p>
          <p className="font-semibold">Most drivers save more with standard mileage.</p>

          <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-6 mt-12">
            <h3 className="text-purple-400 font-bold mb-3 mt-0">Track Deductions Automatically</h3>
            <p className="mb-4">Portable connects to your bank and auto-categorizes rideshare expenses. Never miss a deduction again.</p>
            <Link href="/signup" className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-bold">Start Free Trial →</Link>
          </div>
        </div>
      </article>
    </div>
  );
}
