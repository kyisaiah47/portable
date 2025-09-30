'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Check, Zap, Shield } from 'lucide-react';

export default function StripeStyle() {
  return (
    <div className="min-h-screen bg-slate-950">
      {/* Nav */}
      <nav className="border-b border-white/10 sticky top-0 bg-slate-950/80 backdrop-blur-md z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Image src="/logo.svg" alt="Portable" width={28} height={28} className="brightness-0 invert" />
              <span className="text-xl font-semibold text-white">Portable</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#" className="text-sm text-slate-400 hover:text-white transition-colors">Products</a>
              <a href="#" className="text-sm text-slate-400 hover:text-white transition-colors">Solutions</a>
              <a href="#" className="text-sm text-slate-400 hover:text-white transition-colors">Developers</a>
              <a href="#" className="text-sm text-slate-400 hover:text-white transition-colors">Pricing</a>
            </div>
            <div className="flex items-center space-x-4">
              <button className="text-sm text-slate-400 hover:text-white transition-colors">Sign in</button>
              <button className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-500 transition-colors">
                Get started
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-28 pb-32 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-900/20 via-slate-950 to-slate-950"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500/10 border border-indigo-500/30 rounded-lg mb-8">
                <Zap className="w-4 h-4 text-indigo-400" />
                <span className="text-sm font-semibold text-indigo-400">Enterprise-grade infrastructure</span>
              </div>

              <h1 className="text-6xl md:text-7xl font-bold text-white mb-8 leading-[1.05] tracking-tight">
                Financial infrastructure
                <br />
                <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">for the gig economy</span>
              </h1>

              <p className="text-xl text-slate-400 mb-10 leading-relaxed">
                Millions of gig workers use Portable to track income, build savings, and access benefits designed for the modern workforce.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <button className="bg-indigo-600 text-white px-10 py-4 rounded-lg text-base font-semibold hover:bg-indigo-500 transition-colors inline-flex items-center gap-2 shadow-lg shadow-indigo-600/30">
                  Start now
                  <ArrowRight className="w-5 h-5" />
                </button>
                <button className="text-slate-300 px-10 py-4 rounded-lg text-base font-semibold hover:bg-white/5 transition-colors inline-flex items-center gap-2 border border-slate-700">
                  Contact sales
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>

              {/* Trust badges */}
              <div className="grid grid-cols-3 gap-6 pt-8 border-t border-slate-800">
                <div>
                  <div className="flex items-center gap-2 text-green-400 mb-2">
                    <Check className="w-5 h-5" />
                    <span className="text-sm font-semibold">FDIC Insured</span>
                  </div>
                  <p className="text-xs text-slate-500">Up to $250k</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 text-green-400 mb-2">
                    <Shield className="w-5 h-5" />
                    <span className="text-sm font-semibold">256-bit encryption</span>
                  </div>
                  <p className="text-xs text-slate-500">Bank-level</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 text-green-400 mb-2">
                    <Check className="w-5 h-5" />
                    <span className="text-sm font-semibold">SOC 2</span>
                  </div>
                  <p className="text-xs text-slate-500">Compliant</p>
                </div>
              </div>
            </div>

            {/* Dashboard mockup */}
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl blur-2xl opacity-10"></div>
              <div className="relative bg-slate-900 rounded-2xl shadow-2xl border border-slate-800 overflow-hidden">
                <div className="bg-slate-800 px-6 py-4 flex items-center gap-2 border-b border-slate-700">
                  <div className="w-3 h-3 rounded-full bg-slate-600"></div>
                  <div className="w-3 h-3 rounded-full bg-slate-600"></div>
                  <div className="w-3 h-3 rounded-full bg-slate-600"></div>
                  <div className="ml-4 text-xs text-slate-500 font-mono">dashboard.portable.app</div>
                </div>
                <div className="p-8">
                  <div className="h-32 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-xl border border-indigo-500/30 p-6 mb-6">
                    <div className="text-sm text-slate-400 mb-2">Total Balance</div>
                    <div className="text-4xl font-bold text-white">$23,847.32</div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="h-24 bg-slate-800 rounded-xl border border-slate-700 p-4">
                      <div className="text-xs text-slate-500 mb-2">Savings</div>
                      <div className="text-xl font-bold text-white">$8,492</div>
                    </div>
                    <div className="h-24 bg-slate-800 rounded-xl border border-slate-700 p-4">
                      <div className="text-xs text-slate-500 mb-2">Invested</div>
                      <div className="text-xl font-bold text-white">$13,355</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 px-6 border-y border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-5xl font-bold text-white mb-2">40M+</div>
              <div className="text-sm text-slate-400 uppercase tracking-wide">Eligible workers</div>
            </div>
            <div>
              <div className="text-5xl font-bold text-white mb-2">$18M</div>
              <div className="text-sm text-slate-400 uppercase tracking-wide">Savings managed</div>
            </div>
            <div>
              <div className="text-5xl font-bold text-white mb-2">100+</div>
              <div className="text-sm text-slate-400 uppercase tracking-wide">Platform integrations</div>
            </div>
            <div>
              <div className="text-5xl font-bold text-white mb-2">99.9%</div>
              <div className="text-sm text-slate-400 uppercase tracking-wide">Uptime SLA</div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature sections */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-20 items-center mb-32">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/20 text-indigo-400 rounded-full text-sm font-semibold mb-6 border border-indigo-500/30">
                <Zap className="w-4 h-4" />
                Income tracking
              </div>
              <h2 className="text-5xl font-bold text-white mb-6 leading-tight">
                See every dollar you earn
              </h2>
              <p className="text-lg text-slate-400 leading-relaxed mb-8">
                Connect your bank account and automatically categorize income from over 100 gig platforms. From ride-sharing to freelancing, we track it all in real-time.
              </p>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-indigo-400 flex-shrink-0 mt-1" />
                  <span className="text-slate-300">Automatic categorization across 100+ platforms</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-indigo-400 flex-shrink-0 mt-1" />
                  <span className="text-slate-300">Real-time sync with bank-level encryption</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-indigo-400 flex-shrink-0 mt-1" />
                  <span className="text-slate-300">Detailed earnings insights and trends</span>
                </li>
              </ul>
              <a href="#" className="text-indigo-400 font-semibold inline-flex items-center gap-2 hover:gap-3 transition-all">
                Learn more <ArrowRight className="w-5 h-5" />
              </a>
            </div>
            <div>
              <div className="bg-gradient-to-br from-indigo-500/20 via-purple-500/20 to-pink-500/20 rounded-2xl h-[500px] shadow-2xl border border-white/10"></div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-20 items-center">
            <div className="order-2 md:order-1">
              <div className="bg-gradient-to-br from-green-500/20 via-emerald-500/20 to-teal-500/20 rounded-2xl h-[500px] shadow-2xl border border-white/10"></div>
            </div>
            <div className="order-1 md:order-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm font-semibold mb-6 border border-green-500/30">
                <Shield className="w-4 h-4" />
                Smart savings
              </div>
              <h2 className="text-5xl font-bold text-white mb-6 leading-tight">
                Build your safety net automatically
              </h2>
              <p className="text-lg text-slate-400 leading-relaxed mb-8">
                Get personalized recommendations for emergency funds, retirement savings, and tax withholding. We calculate the perfect amounts based on your income patterns.
              </p>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-1" />
                  <span className="text-slate-300">Smart guidance for 4% retirement, 2% emergency, 25% taxes</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-1" />
                  <span className="text-slate-300">Automated savings suggestions based on your earnings</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-1" />
                  <span className="text-slate-300">Track progress toward your financial goals</span>
                </li>
              </ul>
              <a href="#" className="text-green-400 font-semibold inline-flex items-center gap-2 hover:gap-3 transition-all">
                Learn more <ArrowRight className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 bg-gradient-to-br from-indigo-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Ready to get started?
          </h2>
          <p className="text-xl text-indigo-100 mb-10">
            Join thousands of gig workers building financial security with Portable.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button className="bg-white text-indigo-600 px-10 py-4 rounded-lg text-lg font-semibold hover:bg-slate-100 transition-colors shadow-xl">
              Create free account
            </button>
            <button className="text-white px-10 py-4 rounded-lg text-lg font-semibold hover:bg-white/10 transition-colors border-2 border-white/20">
              Talk to sales
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center space-x-2">
              <Image src="/logo.svg" alt="Portable" width={24} height={24} className="brightness-0 invert" />
              <span className="font-semibold text-white">Portable</span>
            </div>
            <div className="text-sm text-slate-500">© 2025 Portable, Inc. All rights reserved.</div>
          </div>
        </div>
      </footer>

      {/* Back link */}
      <div className="fixed bottom-6 left-6 z-50">
        <Link
          href="/styles"
          className="bg-gray-900 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-800 shadow-lg"
        >
          ← All styles
        </Link>
      </div>
    </div>
  );
}