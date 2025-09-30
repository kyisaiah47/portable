'use client';

import { useState } from 'react';
import Dashboard from '@/components/Dashboard';
import LoginForm from '@/components/LoginForm';
import { ArrowRight, Globe, Shield, Zap, CreditCard, TrendingUp } from 'lucide-react';
import Image from 'next/image';

export default function Home() {
  const [user, setUser] = useState(null);
  const [isLogin, setIsLogin] = useState(null);

  if (user) {
    return <Dashboard user={user} onLogout={() => setUser(null)} />;
  }

  if (isLogin !== null) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
        <div className="max-w-md w-full">
          <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl p-8 shadow-xl border border-white/10">
            <div className="text-center mb-8">
              <div className="flex items-center justify-center mb-6">
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600"></div>
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-purple-600"></div>
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-500 to-pink-600"></div>
                </div>
              </div>
              <h2 className="text-2xl font-semibold text-white mb-2">
                {isLogin ? 'Welcome back' : 'Create your account'}
              </h2>
              <p className="text-slate-400">
                {isLogin ? 'Sign in to continue' : 'Start building your safety net'}
              </p>
            </div>

            <LoginForm isLogin={isLogin} onSuccess={setUser} />

            {isLogin && (
              <div className="mt-6 p-4 bg-indigo-500/10 rounded-lg border border-indigo-500/30">
                <p className="text-indigo-400 text-xs font-semibold mb-1">Demo Account</p>
                <p className="text-xs text-indigo-300 font-mono">
                  sarah.driver@email.com / demo123
                </p>
              </div>
            )}

            <div className="mt-6 text-center">
              <button
                onClick={() => setIsLogin(null)}
                className="text-slate-400 hover:text-white text-sm font-medium"
              >
                ← Back to home
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950">
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
              <span className="text-2xl font-bold text-white">Portable</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#" className="text-sm font-medium text-slate-400 hover:text-white">Personal</a>
              <a href="#" className="text-sm font-medium text-slate-400 hover:text-white">Business</a>
              <a href="#" className="text-sm font-medium text-slate-400 hover:text-white">Features</a>
              <a href="#" className="text-sm font-medium text-slate-400 hover:text-white">About</a>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsLogin(true)}
                className="text-sm font-semibold text-slate-400 hover:text-white"
              >
                Log in
              </button>
              <button
                onClick={() => setIsLogin(false)}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2.5 rounded-full text-sm font-bold hover:opacity-90 transition-opacity"
              >
                Get started
              </button>
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
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-blue-600"></div>
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-purple-600"></div>
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-pink-500 to-pink-600"></div>
              </div>
              <span className="text-sm font-semibold text-white">Join 2.4M gig workers worldwide</span>
            </div>

            <h1 className="text-7xl md:text-8xl lg:text-9xl font-bold mb-10 leading-[0.95]">
              <span className="inline-block bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-gradient">
                One app.
              </span>
              <br />
              <span className="text-white">All your money.</span>
            </h1>

            <p className="text-2xl md:text-3xl text-slate-300 mb-14 leading-relaxed max-w-4xl mx-auto font-light">
              Track gig income, spend globally, invest smart, and build savings—all in one beautiful app.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-5 mb-20">
              <button
                onClick={() => setIsLogin(false)}
                className="group relative bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white px-14 py-6 rounded-full text-lg font-bold hover:scale-105 transition-transform shadow-2xl shadow-purple-600/50 inline-flex items-center gap-3"
              >
                <span>Get Portable</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
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
                <div className="text-sm text-blue-200 font-semibold mb-3 uppercase tracking-wider">Total Balance</div>
                <div className="text-6xl font-black text-white mb-5">$23,847</div>
                <div className="flex items-center gap-2 text-lg">
                  <TrendingUp className="w-6 h-6 text-green-300" />
                  <span className="text-green-300 font-bold">+12.4%</span>
                  <span className="text-blue-200">this month</span>
                </div>
              </div>
            </div>

            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-purple-600 rounded-3xl blur opacity-50 group-hover:opacity-75 transition-opacity"></div>
              <div className="relative bg-gradient-to-br from-purple-600 to-purple-700 rounded-3xl p-10 border border-purple-400/50 transform group-hover:-translate-y-2 transition-transform">
                <div className="text-sm text-purple-200 font-semibold mb-3 uppercase tracking-wider">Savings</div>
                <div className="text-6xl font-black text-white mb-5">$8,492</div>
                <div className="text-purple-200 text-lg">4.0% APY earning</div>
              </div>
            </div>

            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-pink-500 to-pink-600 rounded-3xl blur opacity-50 group-hover:opacity-75 transition-opacity"></div>
              <div className="relative bg-gradient-to-br from-pink-600 to-pink-700 rounded-3xl p-10 border border-pink-400/50 transform group-hover:-translate-y-2 transition-transform">
                <div className="text-sm text-pink-200 font-semibold mb-3 uppercase tracking-wider">Invested</div>
                <div className="text-6xl font-black text-white mb-5">$4,231</div>
                <div className="text-pink-200 text-lg">6 stocks • 3 crypto</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features grid */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-bold mb-6 text-white">
              Everything you need
            </h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              Portable brings together all your financial tools in one place
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-slate-900/50 backdrop-blur-xl rounded-3xl p-8 border border-white/10 hover:border-white/20 transition-all">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6">
                <span className="text-3xl">💰</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Track gig income</h3>
              <p className="text-slate-400 leading-relaxed">
                Automatically sync earnings from 100+ platforms. Uber, DoorDash, Upwork—all in real-time.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-slate-900/50 backdrop-blur-xl rounded-3xl p-8 border border-white/10 hover:border-white/20 transition-all">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6">
                <CreditCard className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Smart card</h3>
              <p className="text-slate-400 leading-relaxed">
                Spend anywhere with cashback rewards. Virtual cards for online shopping, Apple Pay ready.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-slate-900/50 backdrop-blur-xl rounded-3xl p-8 border border-white/10 hover:border-white/20 transition-all">
              <div className="w-14 h-14 bg-gradient-to-br from-pink-500 to-pink-600 rounded-2xl flex items-center justify-center mb-6">
                <span className="text-3xl">📈</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Invest easily</h3>
              <p className="text-slate-400 leading-relaxed">
                Commission-free trading. Fractional shares, crypto, commodities. Start with just $1.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-slate-900/50 backdrop-blur-xl rounded-3xl p-8 border border-white/10 hover:border-white/20 transition-all">
              <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mb-6">
                <span className="text-3xl">🏦</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">High-yield savings</h3>
              <p className="text-slate-400 leading-relaxed">
                Earn 4% APY on your savings. No minimum balance, FDIC insured up to $250k.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-slate-900/50 backdrop-blur-xl rounded-3xl p-8 border border-white/10 hover:border-white/20 transition-all">
              <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mb-6">
                <Globe className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Global accounts</h3>
              <p className="text-slate-400 leading-relaxed">
                Hold 30+ currencies. Send money internationally with zero fees. Real exchange rates.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-slate-900/50 backdrop-blur-xl rounded-3xl p-8 border border-white/10 hover:border-white/20 transition-all">
              <div className="w-14 h-14 bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl flex items-center justify-center mb-6">
                <Shield className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Benefits access</h3>
              <p className="text-slate-400 leading-relaxed">
                Health insurance, dental, vision, retirement. All curated for gig workers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-20"></div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-8">
            Join 2.4M gig workers
          </h2>
          <p className="text-xl text-white/90 mb-12 max-w-2xl mx-auto">
            Get started in minutes. No credit check, no monthly fees, no minimum balance.
          </p>
          <button
            onClick={() => setIsLogin(false)}
            className="bg-white text-gray-900 px-14 py-5 rounded-full text-lg font-bold hover:bg-gray-100 transition-colors shadow-2xl inline-flex items-center gap-3"
          >
            Download Portable
            <ArrowRight className="w-5 h-5" />
          </button>
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
              <span className="text-xl font-bold text-white">Portable</span>
            </div>
            <div className="text-sm text-slate-500">© 2025 Portable Financial Ltd. All rights reserved.</div>
          </div>
        </div>
      </footer>
    </div>
  );
}
