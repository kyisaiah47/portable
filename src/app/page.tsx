'use client';

import { useState } from 'react';
import Dashboard from '@/components/Dashboard';
import LoginForm from '@/components/LoginForm';
import { Shield, TrendingUp, Heart, Users, Zap, PiggyBank } from 'lucide-react';

export default function Home() {
  const [user, setUser] = useState(null);
  const [isLogin, setIsLogin] = useState(true);

  if (user) {
    return <Dashboard user={user} onLogout={() => setUser(null)} />;
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Clean Header */}
      <div className="border-b border-gray-100">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-black rounded-sm"></div>
              <span className="text-lg font-medium text-gray-900">GigBenefits</span>
            </div>
            <div className="text-sm text-gray-500">Demo</div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="container mx-auto px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center space-x-2 bg-gray-50 rounded-full px-3 py-1 mb-8 text-gray-600 text-sm border border-gray-200">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>50,000+ gig workers protected</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-normal text-gray-900 mb-6 leading-tight tracking-tight">
            Benefits that<br />
            <span className="text-gray-500">follow you</span>
          </h1>

          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-12 leading-relaxed font-light">
            Portable benefits platform for gig workers. Automatically save for health, retirement, and emergencies across all platforms.
          </p>

          <div className="flex items-center justify-center space-x-8 text-sm text-gray-400 mb-16">
            <span>FDIC Insured</span>
            <span>•</span>
            <span>40M+ Workers</span>
            <span>•</span>
            <span>$2.4K Average</span>
          </div>
        </div>

        {/* Auth Form */}
        <div className="max-w-sm mx-auto">
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <div className="flex mb-6 bg-gray-50 rounded-md p-1">
              <button
                onClick={() => setIsLogin(true)}
                className={`flex-1 py-2 px-4 text-center text-sm font-medium rounded-md transition-all ${
                  isLogin
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Login
              </button>
              <button
                onClick={() => setIsLogin(false)}
                className={`flex-1 py-2 px-4 text-center text-sm font-medium rounded-md transition-all ${
                  !isLogin
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Sign Up
              </button>
            </div>

            <LoginForm isLogin={isLogin} onSuccess={setUser} />

            {isLogin && (
              <div className="mt-4 p-3 bg-gray-50 rounded-md border">
                <p className="text-gray-600 text-xs font-medium mb-1">Demo Account:</p>
                <p className="text-xs text-gray-500 leading-relaxed">
                  sarah.driver@email.com<br />
                  demo123
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="border-t border-gray-100 bg-gray-50">
        <div className="container mx-auto px-6 py-20">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl font-normal text-gray-900 mb-4">
              How it works
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Three steps to financial security
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-12 h-12 bg-gray-900 rounded-lg flex items-center justify-center mx-auto mb-6">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">Connect platforms</h3>
              <p className="text-gray-600 leading-relaxed text-sm">
                Link Uber, DoorDash, Upwork and other accounts for automatic tracking
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-gray-900 rounded-lg flex items-center justify-center mx-auto mb-6">
                <PiggyBank className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">Auto-save</h3>
              <p className="text-gray-600 leading-relaxed text-sm">
                4% for benefits, 2% for emergencies. Set aside automatically from every payment
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-gray-900 rounded-lg flex items-center justify-center mx-auto mb-6">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">Get benefits</h3>
              <p className="text-gray-600 leading-relaxed text-sm">
                Shop for health insurance, retirement plans, and emergency coverage
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="border-t border-gray-100">
        <div className="container mx-auto px-6 py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center max-w-3xl mx-auto">
            <div>
              <div className="text-2xl font-medium text-gray-900 mb-1">40M+</div>
              <div className="text-sm text-gray-500">Gig workers</div>
            </div>
            <div>
              <div className="text-2xl font-medium text-gray-900 mb-1">$47K</div>
              <div className="text-sm text-gray-500">Avg income</div>
            </div>
            <div>
              <div className="text-2xl font-medium text-gray-900 mb-1">0%</div>
              <div className="text-sm text-gray-500">Have benefits</div>
            </div>
            <div>
              <div className="text-2xl font-medium text-gray-900 mb-1">$2.4K</div>
              <div className="text-sm text-gray-500">Target fund</div>
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
