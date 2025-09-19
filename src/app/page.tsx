'use client';

import { useState } from 'react';
import Dashboard from '@/components/Dashboard';
import LoginForm from '@/components/LoginForm';
import { Shield, TrendingUp, Heart, Users, Zap, PiggyBank } from 'lucide-react';

export default function Home() {
  const [user, setUser] = useState(null);
  const [isLogin, setIsLogin] = useState(null);

  if (user) {
    return <Dashboard user={user} onLogout={() => setUser(null)} />;
  }

  // Show auth form when login/signup is clicked
  if (isLogin !== null && (isLogin === true || isLogin === false)) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full mx-auto">
          <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-lg">
            <div className="text-center mb-8">
              <div className="flex items-center justify-center space-x-2 mb-4">
                <Shield className="w-8 h-8 text-gray-900" />
                <span className="text-xl font-medium text-gray-900">GigBenefits</span>
              </div>
              <h2 className="text-2xl font-light text-gray-900 mb-2">
                {isLogin ? 'Welcome back' : 'Get started'}
              </h2>
              <p className="text-gray-600">
                {isLogin ? 'Sign in to your account' : 'Create your account'}
              </p>
            </div>

            <div className="flex mb-6 bg-gray-50 rounded-lg p-1 border border-gray-100">
              <button
                onClick={() => setIsLogin(true)}
                className={`flex-1 py-3 px-4 text-center text-sm font-medium rounded-md transition-all ${
                  isLogin
                    ? 'bg-white text-gray-900 shadow-md border border-gray-200'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Login
              </button>
              <button
                onClick={() => setIsLogin(false)}
                className={`flex-1 py-3 px-4 text-center text-sm font-medium rounded-md transition-all ${
                  !isLogin
                    ? 'bg-white text-gray-900 shadow-md border border-gray-200'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Sign Up
              </button>
            </div>

            <LoginForm isLogin={isLogin} onSuccess={setUser} />

            {isLogin && (
              <div className="mt-6 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border border-gray-200">
                <p className="text-gray-700 text-xs font-semibold mb-2">Demo Account:</p>
                <p className="text-xs text-gray-600 leading-relaxed font-mono">
                  sarah.driver@email.com<br />
                  demo123
                </p>
              </div>
            )}

            <div className="mt-6 text-center">
              <button
                onClick={() => setIsLogin(null)}
                className="text-gray-500 hover:text-gray-700 text-sm transition-colors"
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
    <div className="min-h-screen bg-white">
      {/* Clean Header */}
      <div className="border-b border-gray-100">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Shield className="w-6 h-6 text-gray-900" />
              <span className="text-lg font-medium text-gray-900">GigBenefits</span>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsLogin(true)}
                className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                Login
              </button>
              <button
                onClick={() => setIsLogin(false)}
                className="bg-gray-900 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-800 transition-colors"
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="container mx-auto px-6 py-24">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-gray-50 to-gray-100 rounded-full px-4 py-2 mb-12 text-gray-700 text-sm border border-gray-200 shadow-sm">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="font-medium">50,000+ gig workers protected</span>
          </div>

          <h1 className="text-6xl md:text-8xl font-light text-gray-900 mb-8 leading-[0.9] tracking-tight">
            Benefits that<br />
            <span className="bg-gradient-to-r from-gray-500 to-gray-600 bg-clip-text text-transparent">follow you</span>
          </h1>

          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-16 leading-relaxed font-light">
            Portable benefits platform for gig workers. Automatically save for health, retirement, and emergencies across all platforms.
          </p>

          <div className="flex items-center justify-center space-x-12 text-sm text-gray-500 mb-16">
            <div className="flex items-center space-x-2">
              <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
              <span>FDIC Insured</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
              <span>40M+ Workers</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
              <span>$2.4K Average</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => setIsLogin(false)}
              className="bg-gray-900 text-white px-8 py-4 rounded-lg text-lg font-medium hover:bg-gray-800 transition-colors shadow-lg"
            >
              Get Started Free
            </button>
            <button
              onClick={() => setIsLogin(true)}
              className="text-gray-600 hover:text-gray-900 transition-colors text-lg font-medium"
            >
              Sign In →
            </button>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="border-t border-gray-100 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-6 py-24">
          <div className="max-w-3xl mx-auto text-center mb-20">
            <h2 className="text-4xl font-light text-gray-900 mb-6">
              How it works
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              Three steps to financial security
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-16 max-w-5xl mx-auto">
            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-gray-900 to-gray-700 rounded-xl flex items-center justify-center mx-auto mb-8 shadow-lg group-hover:scale-105 transition-transform">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-4">Connect platforms</h3>
              <p className="text-gray-600 leading-relaxed">
                Link Uber, DoorDash, Upwork and other accounts for automatic tracking
              </p>
            </div>

            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-gray-900 to-gray-700 rounded-xl flex items-center justify-center mx-auto mb-8 shadow-lg group-hover:scale-105 transition-transform">
                <PiggyBank className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-4">Auto-save</h3>
              <p className="text-gray-600 leading-relaxed">
                4% for benefits, 2% for emergencies. Set aside automatically from every payment
              </p>
            </div>

            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-gray-900 to-gray-700 rounded-xl flex items-center justify-center mx-auto mb-8 shadow-lg group-hover:scale-105 transition-transform">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-4">Get benefits</h3>
              <p className="text-gray-600 leading-relaxed">
                Shop for health insurance, retirement plans, and emergency coverage
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="border-t border-gray-100 bg-white">
        <div className="container mx-auto px-6 py-20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center max-w-4xl mx-auto">
            <div className="group">
              <div className="text-4xl font-light text-gray-900 mb-2 group-hover:text-gray-700 transition-colors">40M+</div>
              <div className="text-sm text-gray-500 uppercase tracking-wide">Gig workers</div>
            </div>
            <div className="group">
              <div className="text-4xl font-light text-gray-900 mb-2 group-hover:text-gray-700 transition-colors">$47K</div>
              <div className="text-sm text-gray-500 uppercase tracking-wide">Avg income</div>
            </div>
            <div className="group">
              <div className="text-4xl font-light text-gray-900 mb-2 group-hover:text-gray-700 transition-colors">0%</div>
              <div className="text-sm text-gray-500 uppercase tracking-wide">Have benefits</div>
            </div>
            <div className="group">
              <div className="text-4xl font-light text-gray-900 mb-2 group-hover:text-gray-700 transition-colors">$2.4K</div>
              <div className="text-sm text-gray-500 uppercase tracking-wide">Target fund</div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-100 bg-white">
        <div className="container mx-auto px-6 py-8">
          <div className="text-center text-gray-400 text-sm">
            <p>Built for HackNomics 2025 • Empowering gig workers</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
