import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Blog — Financial Tips for Gig Workers",
  description: "Expert advice on income tracking, tax planning, and financial stability for Uber drivers, DoorDash dashers, freelancers, and independent contractors.",
  keywords: [
    "gig worker tips",
    "uber driver taxes",
    "doordash income",
    "freelancer finance",
    "1099 tax guide",
    "gig economy advice",
  ],
};

const blogPosts = [
  {
    slug: "how-to-track-income-across-multiple-gig-platforms",
    title: "How to Track Income Across Multiple Gig Platforms",
    excerpt: "Working on Uber, DoorDash, and Upwork? Learn how to automatically consolidate all your income streams in one place.",
    category: "Income Tracking",
    readTime: "5 min read",
    date: "January 4, 2025",
  },
  {
    slug: "quarterly-tax-guide-for-gig-workers",
    title: "Quarterly Tax Guide for Gig Workers (2025)",
    excerpt: "Don't get hit with penalties. Complete guide to quarterly tax payments for 1099 contractors, including deadlines and calculations.",
    category: "Taxes",
    readTime: "8 min read",
    date: "January 3, 2025",
  },
  {
    slug: "top-10-tax-deductions-for-uber-drivers",
    title: "Top 10 Tax Deductions for Uber Drivers",
    excerpt: "Maximize your tax savings with these often-overlooked deductions. Save thousands on your 2025 taxes.",
    category: "Taxes",
    readTime: "6 min read",
    date: "January 2, 2025",
  },
  {
    slug: "building-emergency-fund-as-freelancer",
    title: "Building an Emergency Fund as a Freelancer",
    excerpt: "Income fluctuates? Here's how to build a safety net that protects you during slow months.",
    category: "Savings",
    readTime: "7 min read",
    date: "December 30, 2024",
  },
  {
    slug: "doordash-vs-uber-eats-which-pays-more",
    title: "DoorDash vs Uber Eats: Which Pays More in 2025?",
    excerpt: "Real data from 10,000+ drivers. See which platform pays better in your city and time slot.",
    category: "Income Optimization",
    readTime: "10 min read",
    date: "December 28, 2024",
  },
  {
    slug: "health-insurance-options-for-gig-workers",
    title: "Health Insurance Options for Gig Workers",
    excerpt: "No employer benefits? Compare your options: ACA marketplace, health sharing, and catastrophic plans.",
    category: "Benefits",
    readTime: "12 min read",
    date: "December 25, 2024",
  },
];

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-slate-950 font-inter">
      {/* Navigation */}
      <nav className="backdrop-blur-xl bg-slate-900/70 border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-white font-bold text-xl font-space-grotesk hover:text-slate-300 transition-colors">
            Portable
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-slate-300 hover:text-white text-sm">
              Login
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

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-white mb-4 font-space-grotesk">
            Financial Advice for Gig Workers
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Expert tips on income tracking, taxes, savings, and benefits for independent contractors.
          </p>
        </div>

        {/* Featured Post */}
        <div className="mb-16">
          <Link href={`/blog/${blogPosts[0].slug}`} className="block group">
            <div className="bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 backdrop-blur-xl rounded-2xl p-8 border border-white/10 hover:border-white/20 transition-all">
              <div className="flex flex-col md:flex-row gap-8">
                <div className="md:w-1/2">
                  <div className="aspect-video bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg flex items-center justify-center">
                    <p className="text-slate-400 text-sm">[Featured Image]</p>
                  </div>
                </div>
                <div className="md:w-1/2 flex flex-col justify-center">
                  <span className="text-blue-400 text-sm font-semibold mb-2">{blogPosts[0].category}</span>
                  <h2 className="text-3xl font-bold text-white mb-4 font-space-grotesk group-hover:text-blue-400 transition-colors">
                    {blogPosts[0].title}
                  </h2>
                  <p className="text-slate-300 mb-4 text-lg">
                    {blogPosts[0].excerpt}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-slate-400">
                    <span>{blogPosts[0].date}</span>
                    <span>•</span>
                    <span>{blogPosts[0].readTime}</span>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Blog Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.slice(1).map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="group">
              <div className="bg-slate-900/50 backdrop-blur-xl rounded-xl border border-white/10 overflow-hidden hover:border-white/20 transition-all h-full flex flex-col">
                <div className="aspect-video bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
                  <p className="text-slate-500 text-sm">[Image]</p>
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <span className="text-blue-400 text-xs font-semibold mb-2 uppercase">{post.category}</span>
                  <h3 className="text-xl font-bold text-white mb-3 font-space-grotesk group-hover:text-blue-400 transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-slate-300 mb-4 text-sm flex-1">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center gap-3 text-xs text-slate-400">
                    <span>{post.date}</span>
                    <span>•</span>
                    <span>{post.readTime}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Categories */}
        <div className="mt-16 pt-16 border-t border-white/10">
          <h2 className="text-2xl font-bold text-white mb-8 font-space-grotesk">Browse by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {['Income Tracking', 'Taxes', 'Savings', 'Benefits', 'Income Optimization', 'Gig Platforms', 'Tools & Apps', 'Success Stories'].map((category) => (
              <Link
                key={category}
                href={`/blog/category/${category.toLowerCase().replace(/\s+/g, '-')}`}
                className="bg-slate-900/50 backdrop-blur-xl rounded-lg p-4 border border-white/10 hover:border-blue-500/50 transition-all text-center"
              >
                <p className="text-white font-semibold">{category}</p>
              </Link>
            ))}
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="mt-16 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 backdrop-blur-xl rounded-2xl p-12 border border-white/10 text-center">
          <h2 className="text-3xl font-bold text-white mb-4 font-space-grotesk">
            Get Weekly Tips in Your Inbox
          </h2>
          <p className="text-slate-300 mb-8 max-w-2xl mx-auto">
            Join 10,000+ gig workers getting actionable financial advice every Tuesday. No spam, unsubscribe anytime.
          </p>
          <form className="max-w-md mx-auto flex gap-3">
            <input
              type="email"
              placeholder="your@email.com"
              className="flex-1 bg-slate-900/50 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
            />
            <button
              type="submit"
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity whitespace-nowrap"
            >
              Subscribe
            </button>
          </form>
          <p className="text-xs text-slate-400 mt-4">
            We respect your privacy. See our <Link href="/privacy" className="text-blue-400 hover:text-blue-300">Privacy Policy</Link>.
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/10 mt-24">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-slate-400 text-sm">© 2025 Portable. All rights reserved.</p>
            <div className="flex gap-6">
              <Link href="/privacy" className="text-slate-400 hover:text-white text-sm">
                Privacy
              </Link>
              <Link href="/terms" className="text-slate-400 hover:text-white text-sm">
                Terms
              </Link>
              <Link href="/" className="text-slate-400 hover:text-white text-sm">
                Home
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
