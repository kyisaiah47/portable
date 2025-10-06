import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Building an Emergency Fund as a Freelancer",
  description: "Income fluctuates? Here's how to build a safety net that protects you during slow months. Complete guide for gig workers and freelancers.",
  keywords: ["emergency fund", "freelancer savings", "gig worker savings", "financial stability", "income stability"],
  openGraph: {
    title: "Building an Emergency Fund as a Freelancer",
    description: "Income fluctuates? Here's how to build a safety net that protects you during slow months. Complete guide for gig workers and freelancers.",
    type: "article",
    publishedTime: "2024-12-30T00:00:00.000Z",
    authors: ["Portable"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Building an Emergency Fund as a Freelancer",
    description: "Income fluctuates? Here's how to build a safety net that protects you during slow months. Complete guide for gig workers and freelancers.",
  },
};

export default function BlogPost() {
  return (
    <div className="min-h-screen bg-slate-950 font-inter">
      <nav className="backdrop-blur-xl bg-slate-900/70 border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-white font-bold text-xl font-space-grotesk">Portable</Link>
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-slate-300 hover:text-white text-sm">Dashboard</Link>
            <Link href="/signup" className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg text-sm font-semibold">Get Started</Link>
          </div>
        </div>
      </nav>

      <article className="max-w-4xl mx-auto px-6 py-16">
        <header className="mb-12">
          <div className="flex items-center gap-3 text-sm text-slate-400 mb-4">
            <span className="bg-pink-500/20 text-pink-400 px-3 py-1 rounded-full font-semibold">Savings</span>
            <span>•</span><span>December 30, 2024</span><span>•</span><span>7 min read</span>
          </div>
          <h1 className="text-5xl font-bold text-white mb-6 font-space-grotesk">Building an Emergency Fund as a Freelancer</h1>
          <p className="text-xl text-slate-300">When your income changes every month, a traditional emergency fund doesn't cut it. Here's how to build a safety net that actually works for gig workers.</p>
        </header>

        <div className="prose prose-invert prose-lg max-w-none text-slate-300">
          <p>Traditional advice says "save 3-6 months of expenses." But when your monthly income swings from $3,000 to $7,000, that's not specific enough. Let's build a real plan.</p>

          <h2 className="text-3xl font-bold text-white mb-4 mt-8 font-space-grotesk">Why Freelancers Need MORE Than 3-6 Months</h2>
          <p>Here's what financial advisors don't tell you: If you have a W-2 job and lose it, you get unemployment insurance. As a 1099 contractor, you don't. That's why freelancers should aim for <strong>6-12 months</strong> of expenses, not 3-6.</p>

          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-6 my-6">
            <h3 className="text-blue-400 font-bold mb-3 mt-0">How Much Do You Actually Need?</h3>
            <p className="mb-2"><strong>Step 1:</strong> Calculate your baseline monthly expenses (rent, food, insurance, utilities)</p>
            <p className="mb-2"><strong>Step 2:</strong> Multiply by 6 months (minimum) or 12 months (ideal)</p>
            <p className="mb-0"><strong>Example:</strong> $2,500/month × 6 = $15,000 emergency fund</p>
          </div>

          <h2 className="text-3xl font-bold text-white mb-4 mt-8 font-space-grotesk">The "Peaks and Valleys" Strategy</h2>
          <p>Don't try to save the same amount every month. That's setting yourself up for failure. Instead:</p>
          <ul>
            <li><strong>Good months ($5,000+):</strong> Save 30-40% of income</li>
            <li><strong>Average months ($3,000-$5,000):</strong> Save 15-20%</li>
            <li><strong>Slow months (under $3,000):</strong> Save what you can, or $0</li>
          </ul>

          <h2 className="text-3xl font-bold text-white mb-4 mt-8 font-space-grotesk">Automate in Tiers, Not Fixed Amounts</h2>
          <div className="bg-slate-900/50 border border-white/10 rounded-lg p-6 my-6">
            <p className="mb-3">Set up automatic transfers based on account balance:</p>
            <ul className="space-y-2 mb-0">
              <li><strong>When balance hits $3,000:</strong> Auto-transfer $200 to emergency fund</li>
              <li><strong>When balance hits $5,000:</strong> Auto-transfer $500</li>
              <li><strong>When balance hits $7,000:</strong> Auto-transfer $1,000</li>
            </ul>
          </div>

          <h2 className="text-3xl font-bold text-white mb-4 mt-8 font-space-grotesk">Where to Keep Your Emergency Fund</h2>
          <p><strong>Best options in 2025:</strong></p>
          <ul>
            <li><strong>High-Yield Savings Account (5.0%+ APY):</strong> Marcus, Ally, CIT Bank</li>
            <li><strong>Money Market Fund:</strong> Vanguard, Fidelity (similar rates, check-writing access)</li>
            <li><strong>Don't use:</strong> Regular savings (0.01% APY), checking account (too easy to spend)</li>
          </ul>

          <h2 className="text-3xl font-bold text-white mb-4 mt-8 font-space-grotesk">The 50/30/20 Rule (Modified for Gig Workers)</h2>
          <p>Traditional: 50% needs, 30% wants, 20% savings. For freelancers:</p>
          <ul>
            <li><strong>40% Needs</strong> (rent, food, insurance)</li>
            <li><strong>30% Taxes</strong> (set aside immediately)</li>
            <li><strong>20% Savings</strong> (emergency fund + retirement)</li>
            <li><strong>10% Wants</strong> (fun money)</li>
          </ul>

          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-6 my-8">
            <h3 className="text-yellow-400 font-bold mb-2 mt-0">What Counts as an "Emergency"?</h3>
            <p className="mb-2 font-semibold text-white">DO use emergency fund for:</p>
            <ul className="mb-3">
              <li>Car repair needed to work (Uber/Lyft drivers)</li>
              <li>Medical emergency</li>
              <li>Rent due during zero-income month</li>
            </ul>
            <p className="mb-2 font-semibold text-white">DON'T use for:</p>
            <ul className="mb-0">
              <li>New phone (unless current one is broken and needed for work)</li>
              <li>Vacation</li>
              <li>"I just really want this"</li>
            </ul>
          </div>

          <h2 className="text-3xl font-bold text-white mb-4 mt-8 font-space-grotesk">Milestones to Celebrate</h2>
          <ul>
            <li>✅ <strong>$1,000:</strong> You can handle most minor emergencies</li>
            <li>✅ <strong>1 month expenses:</strong> You can cover rent if income drops to $0</li>
            <li>✅ <strong>3 months:</strong> Traditional "safe" emergency fund</li>
            <li>✅ <strong>6 months:</strong> Gig worker comfort zone</li>
            <li>✅ <strong>12 months:</strong> You can weather any storm</li>
          </ul>

          <h2 className="text-3xl font-bold text-white mb-4 mt-8 font-space-grotesk">What If You're Starting from $0?</h2>
          <p><strong>Month 1-2:</strong> Save $500 (even if it means cutting everything)</p>
          <p><strong>Month 3-6:</strong> Build to $2,000 (2 weeks of expenses)</p>
          <p><strong>Month 7-12:</strong> Reach $5,000 (1 month fully covered)</p>
          <p><strong>Year 2:</strong> Hit 6-month goal</p>

          <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-6 mt-12">
            <h3 className="text-purple-400 font-bold mb-3 mt-0">Build Your Safety Net on Autopilot</h3>
            <p className="mb-4">Portable automatically sets aside percentages for taxes, savings, and emergency funds based on your actual income. Works with variable income.</p>
            <Link href="/signup" className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-bold">Start Saving Smarter →</Link>
          </div>
        </div>
      </article>
    </div>
  );
}
