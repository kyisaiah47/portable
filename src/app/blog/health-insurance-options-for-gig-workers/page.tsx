import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Health Insurance Options for Gig Workers",
  description: "No employer benefits? Compare your options: ACA marketplace, health sharing, and catastrophic plans. Find affordable coverage as an independent worker.",
  keywords: ["gig worker health insurance", "freelancer health insurance", "aca marketplace", "self employed insurance", "health sharing plans"],
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
            <span className="bg-cyan-500/20 text-cyan-400 px-3 py-1 rounded-full font-semibold">Benefits</span>
            <span>•</span><span>December 25, 2024</span><span>•</span><span>12 min read</span>
          </div>
          <h1 className="text-5xl font-bold text-white mb-6 font-space-grotesk">Health Insurance Options for Gig Workers</h1>
          <p className="text-xl text-slate-300">You don't need an employer to get good health insurance. Here's every option available to independent workers in 2025, with real costs.</p>
        </header>

        <div className="prose prose-invert prose-lg max-w-none text-slate-300">
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-6 mb-8">
            <h3 className="text-red-400 font-bold mb-2 mt-0">⚠️ Important: 2025 Open Enrollment</h3>
            <p className="mb-2"><strong>ACA Marketplace Enrollment:</strong> November 1, 2024 - January 15, 2025</p>
            <p className="mb-0">Special Enrollment: Available year-round if you lose other coverage, get married, move, or have a baby</p>
          </div>

          <h2 className="text-3xl font-bold text-white mb-4 mt-8 font-space-grotesk">Option 1: ACA Marketplace (Healthcare.gov)</h2>
          <p><strong>Best for:</strong> Anyone earning under $60,000/year</p>
          <p><strong>Monthly Cost:</strong> $0-$600 (depending on income and subsidies)</p>

          <h3 className="text-2xl font-bold text-white mb-3 mt-6">How Subsidies Work</h3>
          <p>The Affordable Care Act provides premium tax credits based on your Modified Adjusted Gross Income (MAGI):</p>
          <ul>
            <li><strong>Income $20,000/year:</strong> Plans as low as $0-50/month</li>
            <li><strong>Income $35,000/year:</strong> Average $150/month after subsidies</li>
            <li><strong>Income $50,000/year:</strong> Average $300/month</li>
            <li><strong>Income $60,000+:</strong> Full price ($400-600/month)</li>
          </ul>

          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-6 my-6">
            <h3 className="text-blue-400 font-bold mb-3 mt-0">Pro Tip: Manage Your Income to Maximize Subsidies</h3>
            <p className="mb-0">If you're close to a subsidy cutoff, consider maxing out retirement contributions (SEP IRA, Solo 401k) to lower your MAGI and qualify for better subsidies. A $6,000 IRA contribution could save you $2,000/year in premiums.</p>
          </div>

          <h3 className="text-2xl font-bold text-white mb-3 mt-6">Coverage Tiers Explained</h3>
          <ul>
            <li><strong>Bronze (60% coverage):</strong> Low premiums ($150-250), high deductibles ($6,000+). Good if you're healthy.</li>
            <li><strong>Silver (70% coverage):</strong> Moderate premiums ($250-400), moderate deductibles ($3,500). Most popular for gig workers.</li>
            <li><strong>Gold (80% coverage):</strong> Higher premiums ($400-550), lower deductibles ($1,500). Good if you have ongoing medical needs.</li>
            <li><strong>Platinum (90% coverage):</strong> Highest premiums ($550-750), lowest deductibles ($500). Best for chronic conditions.</li>
          </ul>

          <h2 className="text-3xl font-bold text-white mb-4 mt-8 font-space-grotesk">Option 2: Health Sharing Ministries</h2>
          <p><strong>Best for:</strong> Healthy individuals with religious affiliation</p>
          <p><strong>Monthly Cost:</strong> $100-$300/month</p>

          <p><strong>Popular Options:</strong></p>
          <ul>
            <li>Medi-Share (Christian Care Ministry) - $150/month</li>
            <li>Christian Healthcare Ministries - $100/month</li>
            <li>Liberty HealthShare - $200/month</li>
          </ul>

          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-6 my-6">
            <h3 className="text-yellow-400 font-bold mb-2 mt-0">⚠️ Limitations of Health Sharing</h3>
            <ul className="mb-0">
              <li>Not technically insurance (no legal obligation to pay claims)</li>
              <li>Pre-existing conditions often excluded</li>
              <li>Many exclude mental health, maternity, preventive care</li>
              <li>You pay upfront and get reimbursed (can take 90+ days)</li>
            </ul>
          </div>

          <h2 className="text-3xl font-bold text-white mb-4 mt-8 font-space-grotesk">Option 3: Short-Term Health Insurance</h2>
          <p><strong>Best for:</strong> Gaps between coverage (1-12 months)</p>
          <p><strong>Monthly Cost:</strong> $100-$300/month</p>

          <p><strong>Pros:</strong></p>
          <ul>
            <li>Cheap premiums</li>
            <li>No waiting for enrollment period</li>
            <li>Fast approval (often same-day)</li>
          </ul>

          <p><strong>Cons:</strong></p>
          <ul>
            <li>Doesn't cover pre-existing conditions</li>
            <li>Annual/lifetime limits (max $1-2 million)</li>
            <li>Can deny you based on health history</li>
            <li>Doesn't count as ACA-compliant coverage</li>
          </ul>

          <h2 className="text-3xl font-bold text-white mb-4 mt-8 font-space-grotesk">Option 4: Catastrophic Plans</h2>
          <p><strong>Best for:</strong> Under 30 or hardship exemption</p>
          <p><strong>Monthly Cost:</strong> $150-$250/month</p>

          <p>Catastrophic plans cover 3 primary care visits/year plus major medical emergencies after you hit a high deductible ($9,450 in 2025). Think of it as "disaster insurance."</p>

          <h2 className="text-3xl font-bold text-white mb-4 mt-8 font-space-grotesk">Option 5: Direct Primary Care (DPC) + Catastrophic</h2>
          <p><strong>Best for:</strong> Healthy people who want unlimited doctor access</p>
          <p><strong>Monthly Cost:</strong> $75 (DPC) + $200 (catastrophic) = $275 total</p>

          <p>Direct Primary Care is a membership model where you pay $50-150/month for unlimited access to a doctor (visits, texting, basic labs included). Pair with a catastrophic plan for major stuff. Total cost often less than a Silver ACA plan.</p>

          <h2 className="text-3xl font-bold text-white mb-4 mt-8 font-space-grotesk">Cost Comparison Table</h2>
          <div className="bg-slate-900/50 border border-white/10 rounded-lg p-6 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="pb-3 pr-4 text-white">Option</th>
                  <th className="pb-3 pr-4 text-white">Monthly</th>
                  <th className="pb-3 pr-4 text-white">Deductible</th>
                  <th className="pb-3 text-white">Pre-existing?</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-white/10">
                  <td className="py-3 pr-4 font-semibold">ACA Silver</td>
                  <td className="py-3 pr-4">$150-400</td>
                  <td className="py-3 pr-4">$3,500</td>
                  <td className="py-3 text-green-400">✓ Covered</td>
                </tr>
                <tr className="border-b border-white/10">
                  <td className="py-3 pr-4 font-semibold">Health Sharing</td>
                  <td className="py-3 pr-4">$100-300</td>
                  <td className="py-3 pr-4">$1,000-5,000</td>
                  <td className="py-3 text-red-400">✗ Excluded</td>
                </tr>
                <tr className="border-b border-white/10">
                  <td className="py-3 pr-4 font-semibold">Short-Term</td>
                  <td className="py-3 pr-4">$100-300</td>
                  <td className="py-3 pr-4">$2,500-10,000</td>
                  <td className="py-3 text-red-400">✗ Excluded</td>
                </tr>
                <tr className="border-b border-white/10">
                  <td className="py-3 pr-4 font-semibold">Catastrophic</td>
                  <td className="py-3 pr-4">$150-250</td>
                  <td className="py-3 pr-4">$9,450</td>
                  <td className="py-3 text-green-400">✓ Covered</td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-semibold">DPC + Catastrophic</td>
                  <td className="py-3 pr-4">$275</td>
                  <td className="py-3 pr-4">$9,450</td>
                  <td className="py-3 text-green-400">✓ Covered</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h2 className="text-3xl font-bold text-white mb-4 mt-8 font-space-grotesk">Tax Benefits You Can't Miss</h2>
          <p>As a self-employed gig worker, you can deduct 100% of health insurance premiums on your tax return (above-the-line deduction). This saves you 25-35% depending on your tax bracket.</p>
          <p><strong>Example:</strong> $400/month premium × 12 = $4,800/year deduction = $1,200-$1,680 tax savings</p>

          <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-6 my-8">
            <h3 className="text-green-400 font-bold mb-3 mt-0">Recommended Strategy by Income</h3>
            <ul className="mb-0">
              <li><strong>Under $30k/year:</strong> ACA Bronze or Silver (with subsidies = $0-100/month)</li>
              <li><strong>$30k-$50k/year:</strong> ACA Silver (best balance of cost and coverage)</li>
              <li><strong>$50k-$75k/year:</strong> ACA Silver or Health Sharing + short-term</li>
              <li><strong>$75k+/year:</strong> ACA Gold or DPC + Catastrophic</li>
            </ul>
          </div>

          <h2 className="text-3xl font-bold text-white mb-4 mt-8 font-space-grotesk">When to Get Help</h2>
          <p>Use a health insurance broker (free to you—they get paid by insurance companies). They can:</p>
          <ul>
            <li>Compare ALL available plans in your area</li>
            <li>Calculate exact subsidy amounts</li>
            <li>Handle the paperwork</li>
            <li>Advocate if claims get denied</li>
          </ul>

          <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-6 mt-12">
            <h3 className="text-purple-400 font-bold mb-3 mt-0">Track Health Costs as a Business Expense</h3>
            <p className="mb-4">Portable automatically categorizes health insurance premiums as deductible expenses. Maximum tax savings, zero manual tracking.</p>
            <Link href="/signup" className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-bold">Optimize Your Benefits →</Link>
          </div>
        </div>
      </article>
    </div>
  );
}
