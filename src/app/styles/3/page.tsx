'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, TrendingUp } from 'lucide-react';

export default function RobinhoodStyle() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Nav */}
      <nav className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Image src="/logo.svg" alt="Portable" width={28} height={28} className="brightness-0 invert" />
              <span className="text-xl font-bold">Portable</span>
            </div>
            <div className="flex items-center space-x-8">
              <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">Products</a>
              <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">Learn</a>
              <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">Support</a>
              <button className="text-sm text-gray-400 hover:text-white transition-colors">Sign in</button>
              <button className="bg-emerald-500 text-black px-5 py-2 rounded-full text-sm font-bold hover:bg-emerald-400 transition-colors">
                Sign up
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-24 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h1 className="text-6xl md:text-7xl font-bold mb-6 leading-[1.05]">
                Investing for
                <br />
                <span className="text-emerald-500">Everyone</span>
              </h1>
              <p className="text-xl text-gray-400 mb-10 leading-relaxed">
                Commission-free trading for gig workers. Track your income, invest your earnings, and build wealth—all in one place.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <button className="bg-emerald-500 text-black px-10 py-4 rounded-full text-lg font-bold hover:bg-emerald-400 transition-colors">
                  Get started
                </button>
                <button className="text-emerald-500 px-10 py-4 rounded-full text-lg font-bold hover:bg-white/5 transition-colors border border-emerald-500/30">
                  Learn more
                </button>
              </div>
              <div className="flex items-center gap-8 text-sm text-gray-500">
                <div>✓ No account minimums</div>
                <div>✓ Commission-free</div>
                <div>✓ SIPC protected</div>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-emerald-500/20 rounded-3xl blur-3xl"></div>
              <div className="relative bg-gradient-to-br from-emerald-500/20 to-teal-500/20 backdrop-blur-xl rounded-3xl p-8 border border-white/10">
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-6 bg-white/5 rounded-2xl border border-white/10">
                    <div>
                      <div className="text-sm text-gray-400 mb-1">Total balance</div>
                      <div className="text-3xl font-bold">$21,847.32</div>
                    </div>
                    <div className="flex items-center gap-2 text-emerald-500">
                      <TrendingUp className="w-5 h-5" />
                      <span className="text-lg font-bold">+12.4%</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-6 bg-white/5 rounded-2xl border border-white/10">
                      <div className="text-sm text-gray-400 mb-2">Savings</div>
                      <div className="text-2xl font-bold">$8,492</div>
                    </div>
                    <div className="p-6 bg-white/5 rounded-2xl border border-white/10">
                      <div className="text-sm text-gray-400 mb-2">Invested</div>
                      <div className="text-2xl font-bold">$13,355</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 px-6 border-y border-white/10 bg-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-5xl font-bold mb-2">$18M+</div>
              <div className="text-sm text-gray-400 uppercase tracking-wider">Assets under management</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">2.4M</div>
              <div className="text-sm text-gray-400 uppercase tracking-wider">Active users</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">$0</div>
              <div className="text-sm text-gray-400 uppercase tracking-wider">Commission fees</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">24/7</div>
              <div className="text-sm text-gray-400 uppercase tracking-wider">Market access</div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature cards */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-bold mb-6">
              Built for gig workers
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Everything you need to manage and grow your money
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 backdrop-blur-xl rounded-3xl p-10 border border-white/10 hover:border-emerald-500/30 transition-all">
              <div className="w-14 h-14 bg-emerald-500/20 rounded-2xl flex items-center justify-center mb-6">
                <span className="text-3xl">📊</span>
              </div>
              <h3 className="text-2xl font-bold mb-4">Track income</h3>
              <p className="text-gray-400 leading-relaxed mb-6">
                Automatically sync earnings from 100+ gig platforms. See everything in real-time.
              </p>
              <a href="#" className="text-emerald-500 font-semibold inline-flex items-center gap-2 hover:gap-3 transition-all">
                Learn more <ArrowRight className="w-4 h-4" />
              </a>
            </div>

            <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 backdrop-blur-xl rounded-3xl p-10 border border-white/10 hover:border-blue-500/30 transition-all">
              <div className="w-14 h-14 bg-blue-500/20 rounded-2xl flex items-center justify-center mb-6">
                <span className="text-3xl">💰</span>
              </div>
              <h3 className="text-2xl font-bold mb-4">Smart investing</h3>
              <p className="text-gray-400 leading-relaxed mb-6">
                Invest your earnings with zero commission. Fractional shares, crypto, and more.
              </p>
              <a href="#" className="text-blue-500 font-semibold inline-flex items-center gap-2 hover:gap-3 transition-all">
                Learn more <ArrowRight className="w-4 h-4" />
              </a>
            </div>

            <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-xl rounded-3xl p-10 border border-white/10 hover:border-purple-500/30 transition-all">
              <div className="w-14 h-14 bg-purple-500/20 rounded-2xl flex items-center justify-center mb-6">
                <span className="text-3xl">🏥</span>
              </div>
              <h3 className="text-2xl font-bold mb-4">Get benefits</h3>
              <p className="text-gray-400 leading-relaxed mb-6">
                Access health insurance, retirement accounts, and financial products.
              </p>
              <a href="#" className="text-purple-500 font-semibold inline-flex items-center gap-2 hover:gap-3 transition-all">
                Learn more <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Large CTA */}
      <section className="py-32 px-6 bg-gradient-to-br from-emerald-500 to-teal-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl md:text-6xl font-bold mb-6 text-black">
            Start building wealth today
          </h2>
          <p className="text-xl text-black/70 mb-12">
            Join 2.4M gig workers taking control of their financial future
          </p>
          <button className="bg-black text-white px-12 py-5 rounded-full text-lg font-bold hover:bg-gray-900 transition-colors shadow-2xl">
            Sign up for Portable
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center space-x-2">
              <Image src="/logo.svg" alt="Portable" width={24} height={24} className="brightness-0 invert" />
              <span className="font-bold">Portable</span>
            </div>
            <div className="text-sm text-gray-500">© 2025 Portable Financial Technologies, Inc.</div>
          </div>
        </div>
      </footer>

      {/* Back link */}
      <div className="fixed bottom-6 left-6 z-50">
        <Link
          href="/styles"
          className="bg-white text-black px-4 py-2 rounded-full text-sm font-bold hover:bg-gray-100 shadow-lg"
        >
          ← All styles
        </Link>
      </div>
    </div>
  );
}