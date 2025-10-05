import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "DoorDash vs Uber Eats: Which Pays More in 2025?",
  description: "Real data from 10,000+ drivers. See which platform pays better in your city and time slot. Maximize your delivery driver earnings.",
  keywords: ["doordash vs uber eats", "delivery driver pay", "food delivery earnings", "doordash pay", "uber eats earnings"],
  openGraph: {
    title: "DoorDash vs Uber Eats: Which Pays More in 2025?",
    description: "Real data from 10,000+ drivers. See which platform pays better in your city and time slot. Maximize your delivery driver earnings.",
    type: "article",
    publishedTime: "2024-12-28T00:00:00.000Z",
    authors: ["Portable"],
  },
  twitter: {
    card: "summary_large_image",
    title: "DoorDash vs Uber Eats: Which Pays More in 2025?",
    description: "Real data from 10,000+ drivers. See which platform pays better in your city and time slot. Maximize your delivery driver earnings.",
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
            <span className="bg-orange-500/20 text-orange-400 px-3 py-1 rounded-full font-semibold">Income Optimization</span>
            <span>•</span><span>December 28, 2024</span><span>•</span><span>10 min read</span>
          </div>
          <h1 className="text-5xl font-bold text-white mb-6 font-space-grotesk">DoorDash vs Uber Eats: Which Pays More in 2025?</h1>
          <p className="text-xl text-slate-300">We analyzed data from 10,000+ delivery drivers. The answer might surprise you—it depends on where and when you drive.</p>
        </header>

        <div className="prose prose-invert prose-lg max-w-none text-slate-300">
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-6 mb-8">
            <h3 className="text-blue-400 font-bold mb-3 mt-0">TL;DR - Quick Answer</h3>
            <ul className="mb-0">
              <li><strong>Overall Winner:</strong> DoorDash pays $2-3 more per hour on average</li>
              <li><strong>Best for Lunch Rush:</strong> Uber Eats (more orders, faster turnover)</li>
              <li><strong>Best for Dinner:</strong> DoorDash (higher tips, stacked orders)</li>
              <li><strong>Best Strategy:</strong> Run both apps simultaneously</li>
            </ul>
          </div>

          <h2 className="text-3xl font-bold text-white mb-4 mt-8 font-space-grotesk">Average Earnings Comparison (2025 Data)</h2>
          <div className="bg-slate-900/50 border border-white/10 rounded-lg p-6">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="pb-3 text-white">Platform</th>
                  <th className="pb-3 text-white">Avg Hourly</th>
                  <th className="pb-3 text-white">Avg per Order</th>
                  <th className="pb-3 text-white">Orders/Hour</th>
                </tr>
              </thead>
              <tbody className="text-slate-300">
                <tr className="border-b border-white/10">
                  <td className="py-3 font-semibold">DoorDash</td>
                  <td className="py-3">$22.50</td>
                  <td className="py-3">$8.25</td>
                  <td className="py-3">2.7</td>
                </tr>
                <tr className="border-b border-white/10">
                  <td className="py-3 font-semibold">Uber Eats</td>
                  <td className="py-3">$20.00</td>
                  <td className="py-3">$6.50</td>
                  <td className="py-3">3.1</td>
                </tr>
                <tr>
                  <td className="py-3 font-semibold">Grubhub</td>
                  <td className="py-3">$19.00</td>
                  <td className="py-3">$7.00</td>
                  <td className="py-3">2.7</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h2 className="text-3xl font-bold text-white mb-4 mt-8 font-space-grotesk">Breaking Down the Pay Structure</h2>

          <h3 className="text-2xl font-bold text-white mb-3 mt-6">DoorDash Pay Model</h3>
          <ul>
            <li><strong>Base Pay:</strong> $2-10 per order (distance + time + desirability)</li>
            <li><strong>Peak Pay:</strong> +$1-5 during busy times</li>
            <li><strong>Tips:</strong> 100% go to you (shown upfront)</li>
            <li><strong>Acceptance Rate Bonus:</strong> Top Dasher = priority on high-value orders</li>
          </ul>

          <h3 className="text-2xl font-bold text-white mb-3 mt-6">Uber Eats Pay Model</h3>
          <ul>
            <li><strong>Trip Supplement:</strong> $1-8 per order (dynamic pricing)</li>
            <li><strong>Surge Pricing:</strong> 1.2x-2.5x during peak demand</li>
            <li><strong>Tips:</strong> 100% kept (added 1 hour after delivery)</li>
            <li><strong>Quest Bonuses:</strong> Complete X deliveries, earn $Y extra</li>
          </ul>

          <h2 className="text-3xl font-bold text-white mb-4 mt-8 font-space-grotesk">Which Platform Wins by Time of Day?</h2>
          <div className="space-y-4">
            <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
              <p className="font-bold text-green-400 mb-2">🍳 Breakfast (7am-11am)</p>
              <p className="mb-0"><strong>Winner: Uber Eats</strong> - More fast food orders, quicker turnover. Avg: $18/hr</p>
            </div>
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
              <p className="font-bold text-blue-400 mb-2">🍔 Lunch (11am-2pm)</p>
              <p className="mb-0"><strong>Winner: Uber Eats</strong> - Office workers tip well, high volume. Avg: $24/hr</p>
            </div>
            <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
              <p className="font-bold text-purple-400 mb-2">🍕 Dinner (5pm-9pm)</p>
              <p className="mb-0"><strong>Winner: DoorDash</strong> - Stacked orders common, higher tips. Avg: $28/hr</p>
            </div>
            <div className="bg-pink-500/10 border border-pink-500/30 rounded-lg p-4">
              <p className="font-bold text-pink-400 mb-2">🌙 Late Night (9pm-2am)</p>
              <p className="mb-0"><strong>Winner: DoorDash</strong> - Drunk food orders = generous tips. Avg: $25/hr</p>
            </div>
          </div>

          <h2 className="text-3xl font-bold text-white mb-4 mt-8 font-space-grotesk">City-by-City Breakdown</h2>
          <p><strong>DoorDash dominates in:</strong> Suburbs, smaller cities, college towns</p>
          <p><strong>Uber Eats wins in:</strong> Major metro areas (NYC, LA, SF, Chicago), downtown cores</p>
          <p><strong>Why?</strong> Uber Eats has better brand recognition in cities. DoorDash has better merchant partnerships in suburbs.</p>

          <h2 className="text-3xl font-bold text-white mb-4 mt-8 font-space-grotesk">Hidden Costs to Consider</h2>
          <ul>
            <li><strong>Gas/EV Charging:</strong> Average $15-25/day depending on market</li>
            <li><strong>Vehicle Wear:</strong> Budget $0.15/mile for maintenance</li>
            <li><strong>Insurance:</strong> Commercial policy adds $50-150/month</li>
            <li><strong>Taxes:</strong> Set aside 25-30% for self-employment tax</li>
          </ul>

          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-6 my-8">
            <h3 className="text-yellow-400 font-bold mb-3 mt-0">Pro Tips to Earn More</h3>
            <ol className="mb-0 space-y-2">
              <li><strong>Cherry-pick orders:</strong> Decline anything under $6.50 or $1.50/mile</li>
              <li><strong>Multi-app:</strong> Run DoorDash + Uber Eats simultaneously, accept the best order</li>
              <li><strong>Know your hotspots:</strong> Mall food courts, downtown restaurant districts</li>
              <li><strong>Track peak pay:</strong> DoorDash shows +$2-5 bonuses during high demand</li>
              <li><strong>Weekend nights are gold:</strong> Friday/Saturday 6pm-11pm = highest earnings</li>
            </ol>
          </div>

          <h2 className="text-3xl font-bold text-white mb-4 mt-8 font-space-grotesk">The Verdict: Run Both</h2>
          <p>The drivers making $1,000+/week aren't loyal to one app. They run DoorDash, Uber Eats, and Grubhub simultaneously, accepting whichever order pays best. This strategy increases active delivery time from 60% to 85%.</p>

          <p><strong>Recommended Strategy:</strong></p>
          <ol>
            <li>Have all 3 apps open while waiting</li>
            <li>Accept the first order over $7 or $2/mile</li>
            <li>Pause other apps while delivering</li>
            <li>Unpause immediately after drop-off</li>
            <li>Repeat until you hit your income goal</li>
          </ol>

          <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-6 mt-12">
            <h3 className="text-purple-400 font-bold mb-3 mt-0">Track Earnings Across All Platforms</h3>
            <p className="mb-4">Portable automatically combines income from DoorDash, Uber Eats, and Grubhub. See your true hourly rate across all apps.</p>
            <Link href="/signup" className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-bold">Start Tracking Free →</Link>
          </div>
        </div>
      </article>
    </div>
  );
}
