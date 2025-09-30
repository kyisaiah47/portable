'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Dashboard from '@/components/Dashboard';
import { ArrowRight, Globe, Shield, Zap, CreditCard, TrendingUp, PiggyBank, FileText, BarChart3, MessageCircle } from 'lucide-react';
import Image from 'next/image';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import Link from 'next/link';

export default function Home() {
  const [user, setUser] = useState(null);

  if (user) {
    return <Dashboard user={user} onLogout={() => setUser(null)} />;
  }

  return (
    <div className="min-h-screen bg-slate-950 font-inter">
      {/* Navigation */}
      <nav className="backdrop-blur-xl bg-slate-900/70 border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="flex -space-x-2">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-blue-600"></div>
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-purple-600"></div>
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-pink-500 to-pink-600"></div>
              </div>
              <span className="text-2xl font-bold text-white font-space-grotesk">Portable</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#" className="text-sm font-medium text-slate-400 hover:text-white">Personal</a>
              <a href="#" className="text-sm font-medium text-slate-400 hover:text-white">Business</a>
              <a href="#" className="text-sm font-medium text-slate-400 hover:text-white">Features</a>
              <a href="#" className="text-sm font-medium text-slate-400 hover:text-white">About</a>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/login"
                className="text-sm font-semibold text-slate-400 hover:text-white"
              >
                Log in
              </Link>
              <Link
                href="/signup"
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2.5 rounded-full text-sm font-bold hover:opacity-90 transition-opacity"
              >
                Get started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-28 pb-32 px-6 relative overflow-hidden">
        {/* Animated gradient mesh */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-96 h-96 bg-blue-500/30 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
          <div className="absolute top-40 right-20 w-96 h-96 bg-purple-500/30 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-20 left-1/2 w-96 h-96 bg-pink-500/30 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center max-w-5xl mx-auto mb-20">
            <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 backdrop-blur-sm rounded-full border border-white/10 mb-10">
              <div className="flex -space-x-2">
                <Avatar className="w-6 h-6 border-2 border-slate-950">
                  <AvatarImage src="https://api.dicebear.com/7.x/notionists/svg?seed=Felix&backgroundColor=3B82F6" alt="" />
                  <AvatarFallback>F</AvatarFallback>
                </Avatar>
                <Avatar className="w-6 h-6 border-2 border-slate-950">
                  <AvatarImage src="https://api.dicebear.com/7.x/notionists/svg?seed=Aneka&backgroundColor=A855F7" alt="" />
                  <AvatarFallback>A</AvatarFallback>
                </Avatar>
                <Avatar className="w-6 h-6 border-2 border-slate-950">
                  <AvatarImage src="https://api.dicebear.com/7.x/notionists/svg?seed=Luna&backgroundColor=EC4899" alt="" />
                  <AvatarFallback>L</AvatarFallback>
                </Avatar>
              </div>
              <span className="text-sm font-semibold text-white">Join 60M+ independent workers</span>
            </div>

            <h1 className="text-7xl md:text-8xl lg:text-9xl font-bold mb-10 leading-[0.95] font-space-grotesk">
              <span className="inline-block bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-gradient">
                Benefits for
              </span>
              <br />
              <span className="text-white">gig workers.</span>
            </h1>

            <p className="text-xl md:text-2xl text-slate-300 mb-14 leading-relaxed max-w-4xl mx-auto font-light">
              Navigate the gig economy with confidence. Access health insurance, retirement plans, and financial guidance designed for independent workers.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-5 mb-20">
              <Link
                href="/signup"
                className="group relative bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white px-14 py-6 rounded-full text-lg font-bold hover:scale-105 transition-transform shadow-2xl shadow-purple-600/50 inline-flex items-center gap-3"
              >
                <span>Get Portable</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <button className="text-white px-14 py-6 rounded-full text-lg font-semibold hover:bg-white/5 transition-colors border-2 border-white/20 inline-flex items-center gap-3">
                <span>Watch demo</span>
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              </button>
            </div>
          </div>

          {/* Floating cards */}
          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl blur opacity-50 group-hover:opacity-75 transition-opacity"></div>
              <div className="relative bg-gradient-to-br from-blue-600 to-blue-700 rounded-3xl p-10 border border-blue-400/50 transform group-hover:-translate-y-2 transition-transform">
                <div className="text-sm text-blue-200 font-semibold mb-3 uppercase tracking-wider">Health Insurance</div>
                <div className="text-5xl font-black text-white mb-5 font-space-grotesk">Covered</div>
                <div className="text-blue-200 text-lg">Medical, dental, vision plans starting at $150/mo</div>
              </div>
            </div>

            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-purple-600 rounded-3xl blur opacity-50 group-hover:opacity-75 transition-opacity"></div>
              <div className="relative bg-gradient-to-br from-purple-600 to-purple-700 rounded-3xl p-10 border border-purple-400/50 transform group-hover:-translate-y-2 transition-transform">
                <div className="text-sm text-purple-200 font-semibold mb-3 uppercase tracking-wider">Retirement</div>
                <div className="text-5xl font-black text-white mb-5 font-space-grotesk">Building</div>
                <div className="text-purple-200 text-lg">Portable 401(k) that moves with you</div>
              </div>
            </div>

            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-pink-500 to-pink-600 rounded-3xl blur opacity-50 group-hover:opacity-75 transition-opacity"></div>
              <div className="relative bg-gradient-to-br from-pink-600 to-pink-700 rounded-3xl p-10 border border-pink-400/50 transform group-hover:-translate-y-2 transition-transform">
                <div className="text-sm text-pink-200 font-semibold mb-3 uppercase tracking-wider">Tax Prep</div>
                <div className="text-5xl font-black text-white mb-5 font-space-grotesk">Simplified</div>
                <div className="text-pink-200 text-lg">Track deductions across all platforms</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Story/About Section */}
      <section className="py-40 px-6 bg-slate-900/30">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-6 font-space-grotesk">
              The safety net you deserve
            </h2>
            <p className="text-xl text-slate-400">
              Traditional employment comes with benefits. Gig work shouldn't be any different.
            </p>
          </div>

          <div className="space-y-8 text-lg text-slate-300 leading-relaxed">
            <p>
              Over <span className="bg-gradient-to-r from-blue-400 to-blue-500 bg-clip-text text-transparent font-semibold">60 million independent workers</span> across the US are building careers on their own terms—driving for Uber, delivering with DoorDash, creating on YouTube and TikTok, streaming on Twitch, designing on Upwork, renting on Airbnb. The freedom is incredible. But there's a catch: no employer means no benefits.
            </p>

            <p>
              When you're juggling multiple platforms and income streams, basic questions become impossible to answer. <span className="bg-gradient-to-r from-purple-400 to-purple-500 bg-clip-text text-transparent font-semibold">How much did I actually earn last month?</span> Which expenses can I deduct? Can I afford health insurance? What about retirement?
            </p>

            <p>
              Portable was built to answer these questions. We bring together everything gig workers need to thrive: <span className="bg-gradient-to-r from-blue-400 to-blue-500 bg-clip-text text-transparent font-semibold">affordable health insurance</span> that doesn't require an employer, <span className="bg-gradient-to-r from-purple-400 to-purple-500 bg-clip-text text-transparent font-semibold">portable retirement accounts</span> that follow you from gig to gig, <span className="bg-gradient-to-r from-pink-400 to-pink-500 bg-clip-text text-transparent font-semibold">income tracking</span> across all your platforms, and <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent font-semibold">tax tools</span> that actually understand 1099 life.
            </p>

            <p>
              We believe independent work is the future. But that future only works if gig workers have access to the same financial security and benefits that traditional employees take for granted. That's why we're here—to build the infrastructure that makes gig work sustainable for the long term.
            </p>

            <div className="pt-8 border-t border-white/10 mt-12">
              <p className="text-2xl font-semibold font-space-grotesk mb-4">
                <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">Your work is already portable. Your benefits should be too.</span>
              </p>
              <p className="text-slate-400">
                Join thousands of gig workers who are building financial security on their own terms.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features grid */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-bold mb-6 text-white font-space-grotesk">
              Built for the gig economy
            </h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              Everything you need to thrive as an independent worker
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-slate-900/50 backdrop-blur-xl rounded-3xl p-8 border border-white/10 hover:border-white/20 transition-all">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6">
                <Shield className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4 font-space-grotesk">Health insurance</h3>
              <p className="text-slate-400 leading-relaxed">
                Access affordable health, dental, and vision plans. No employer required.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-slate-900/50 backdrop-blur-xl rounded-3xl p-8 border border-white/10 hover:border-white/20 transition-all">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6">
                <PiggyBank className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4 font-space-grotesk">Retirement plans</h3>
              <p className="text-slate-400 leading-relaxed">
                Solo 401(k) and SEP IRA options that follow you from gig to gig.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-slate-900/50 backdrop-blur-xl rounded-3xl p-8 border border-white/10 hover:border-white/20 transition-all">
              <div className="w-14 h-14 bg-gradient-to-br from-pink-500 to-pink-600 rounded-2xl flex items-center justify-center mb-6">
                <BarChart3 className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4 font-space-grotesk">Income tracking</h3>
              <p className="text-slate-400 leading-relaxed">
                Connect all your gig platforms. See your total earnings in one place.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-slate-900/50 backdrop-blur-xl rounded-3xl p-8 border border-white/10 hover:border-white/20 transition-all">
              <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mb-6">
                <FileText className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4 font-space-grotesk">Tax assistance</h3>
              <p className="text-slate-400 leading-relaxed">
                Quarterly tax estimates, deduction tracking, and 1099 management.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-slate-900/50 backdrop-blur-xl rounded-3xl p-8 border border-white/10 hover:border-white/20 transition-all">
              <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mb-6">
                <Zap className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4 font-space-grotesk">Emergency fund</h3>
              <p className="text-slate-400 leading-relaxed">
                Build a safety net for slow months or unexpected expenses.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-slate-900/50 backdrop-blur-xl rounded-3xl p-8 border border-white/10 hover:border-white/20 transition-all">
              <div className="w-14 h-14 bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl flex items-center justify-center mb-6">
                <MessageCircle className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4 font-space-grotesk">Expert guidance</h3>
              <p className="text-slate-400 leading-relaxed">
                Chat with financial advisors who understand the gig economy.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600"></div>
        <div className="absolute inset-0 opacity-20" style={{backgroundImage: "url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')"}}></div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-8 font-space-grotesk">
            Join 60M+ independent workers
          </h2>
          <p className="text-xl text-white/90 mb-12 max-w-2xl mx-auto">
            Get started in minutes. No credit check, no monthly fees, no minimum balance.
          </p>
          <Link
            href="/signup"
            className="bg-white text-gray-900 px-14 py-5 rounded-full text-lg font-bold hover:bg-gray-100 transition-colors shadow-2xl inline-flex items-center gap-3"
          >
            Download Portable
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-16 px-6 bg-slate-900/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center space-x-2">
              <div className="flex -space-x-2">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-blue-600"></div>
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-purple-600"></div>
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-pink-500 to-pink-600"></div>
              </div>
              <span className="text-xl font-bold text-white font-space-grotesk">Portable</span>
            </div>
            <div className="text-sm text-slate-500">© 2025 Portable Financial Ltd. All rights reserved.</div>
          </div>
        </div>
      </footer>
    </div>
  );
}
