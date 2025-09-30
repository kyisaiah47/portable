'use client';

import { useState, useEffect } from 'react';
import IncomeTracker from './IncomeTracker';
import BenefitsMarketplace from './BenefitsMarketplace';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { BarChart3, DollarSign, PiggyBank, Shield, LogOut, User, TrendingUp, FileText, MessageCircle, Zap, Globe, ArrowRight, Heart, Wallet, Briefcase, Receipt, TrendingUp as TrendingUpIcon, BookOpen, Users, Target } from 'lucide-react';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

interface DashboardProps {
  user: User;
  onLogout: () => void;
}

export default function Dashboard({ user, onLogout }: DashboardProps) {
  const [activeTab, setActiveTab] = useState('home');

  const monthlyData = [
    { month: 'Jan', earnings: 3200, contributions: 128, emergency: 64 },
    { month: 'Feb', earnings: 2800, contributions: 112, emergency: 56 },
    { month: 'Mar', earnings: 3600, contributions: 144, emergency: 72 },
    { month: 'Apr', earnings: 4100, contributions: 164, emergency: 82 },
    { month: 'May', earnings: 3900, contributions: 156, emergency: 78 },
    { month: 'Jun', earnings: 4300, contributions: 172, emergency: 86 },
  ];

  const totalEarnings = monthlyData.reduce((sum, month) => sum + month.earnings, 0);
  const totalContributions = monthlyData.reduce((sum, month) => sum + month.contributions, 0);
  const emergencyFund = monthlyData.reduce((sum, month) => sum + month.emergency, 0);

  const handleLogout = () => {
    localStorage.removeItem('token');
    onLogout();
  };

  return (
    <div className="min-h-screen bg-slate-950 font-inter">
      {/* Navigation */}
      <nav className="backdrop-blur-xl bg-slate-900/70 border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-2">
                <div className="flex -space-x-2">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-blue-600"></div>
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-purple-600"></div>
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-pink-500 to-pink-600"></div>
                </div>
                <h1 className="text-2xl font-bold text-white font-space-grotesk">Portable</h1>
              </div>
              <div className="hidden md:flex items-center space-x-1">
                {[
                  { id: 'home', label: 'Home', icon: BarChart3 },
                  { id: 'income', label: 'Income', icon: DollarSign },
                  { id: 'benefits', label: 'Benefits', icon: Shield },
                  { id: 'taxes', label: 'Taxes', icon: FileText },
                  { id: 'learn', label: 'Learn', icon: MessageCircle }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                      activeTab === tab.id
                        ? 'text-white'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <tab.icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full flex items-center justify-center border border-white/10">
                  <User className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">
                    {user.firstName}
                  </p>
                  <p className="text-xs text-slate-400">{user.email}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 text-slate-400 hover:text-white transition-colors text-sm"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">

        {activeTab === 'home' && (
          <div className="space-y-8">
            {/* Hero message - SHORT AND PUNCHY */}
            <div className="bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 backdrop-blur-sm border border-white/10 rounded-lg p-8">
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-2 font-space-grotesk">
                You're crushing it, {user.firstName}
              </h1>
              <p className="text-base md:text-lg text-slate-300">
                $4,300 earned this month. Auto-saved $876 for benefits and $1,075 for taxes. Most people don't have their shit this together.
              </p>
            </div>

            {/* Divider */}
            <div className="border-t border-white/10"></div>

            {/* Recommended for you - TOP OF FEED */}
            <div>
              <div className="mb-4">
                <h2 className="text-lg font-bold text-white font-space-grotesk">Recommended for you</h2>
                <p className="text-xs text-slate-400">Personalized based on your activity</p>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-slate-900/50 backdrop-blur-xl rounded-lg p-5 border border-white/10 hover:border-blue-500/50 transition-all cursor-pointer group">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                        <Heart className="w-4 h-4 text-blue-400" />
                      </div>
                      <h3 className="text-base font-bold text-white font-space-grotesk">Get health insurance</h3>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-400 transition-colors" />
                  </div>
                  <p className="text-xs text-slate-400 mb-2">As an Uber driver, having health coverage protects you and your income. Plans start at $200/mo with subsidies available.</p>
                  <div className="text-xs text-blue-400 font-semibold">Browse marketplace →</div>
                </div>

                <div className="bg-slate-900/50 backdrop-blur-xl rounded-lg p-5 border border-white/10 hover:border-purple-500/50 transition-all cursor-pointer group">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center">
                        <PiggyBank className="w-4 h-4 text-purple-400" />
                      </div>
                      <h3 className="text-base font-bold text-white font-space-grotesk">Start a retirement fund</h3>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-purple-400 transition-colors" />
                  </div>
                  <p className="text-xs text-slate-400 mb-2">Solo 401(k) designed for gig workers. Tax advantages + we'll auto-contribute based on your earnings.</p>
                  <div className="text-xs text-purple-400 font-semibold">Learn more →</div>
                </div>

                <div className="bg-slate-900/50 backdrop-blur-xl rounded-lg p-5 border border-white/10 hover:border-pink-500/50 transition-all cursor-pointer group">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-pink-500/20 rounded-lg flex items-center justify-center">
                        <Briefcase className="w-4 h-4 text-pink-400" />
                      </div>
                      <h3 className="text-base font-bold text-white font-space-grotesk">Connect Instacart</h3>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-pink-400 transition-colors" />
                  </div>
                  <p className="text-xs text-slate-400 mb-2">Top earners work 3+ platforms. Instacart pairs well with your Uber schedule and could add $800+/mo.</p>
                  <div className="text-xs text-pink-400 font-semibold">Connect platform →</div>
                </div>

                <div className="bg-slate-900/50 backdrop-blur-xl rounded-lg p-5 border border-white/10 hover:border-green-500/50 transition-all cursor-pointer group">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
                        <Receipt className="w-4 h-4 text-green-400" />
                      </div>
                      <h3 className="text-base font-bold text-white font-space-grotesk">Tax deduction tracker</h3>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-green-400 transition-colors" />
                  </div>
                  <p className="text-xs text-slate-400 mb-2">Automatically track mileage, phone bills, and other deductions. Average user saves $2,800/year.</p>
                  <div className="text-xs text-green-400 font-semibold">Start tracking →</div>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-white/10"></div>

            {/* Platform breakdown - DENSE GRID */}
            <div>
              <div className="mb-4">
                <h2 className="text-xl font-bold text-white font-space-grotesk">Where your money's coming from</h2>
                <p className="text-sm text-slate-400">You're crushing it on Uber. DoorDash is solid. Upwork? You're leaving money on the table.</p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Uber */}
                <div className="bg-slate-900/50 backdrop-blur-xl rounded-lg p-5 border border-white/10 hover:border-blue-500/50 transition-all">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <div className="text-2xl">🚗</div>
                      <div>
                        <h3 className="text-base font-bold text-white font-space-grotesk">Uber</h3>
                        <p className="text-xs text-slate-400">Rideshare</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-black bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent font-space-grotesk">$1,890</div>
                      <div className="text-xs text-slate-400">44% of income</div>
                    </div>
                  </div>
                  <div className="h-1.5 bg-slate-800 rounded-full mb-2 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full" style={{width: '44%'}}></div>
                  </div>
                  <p className="text-xs text-blue-400"><strong>Your best hours:</strong> 5-9pm weekdays when surge hits</p>
                </div>

                {/* DoorDash */}
                <div className="bg-slate-900/50 backdrop-blur-xl rounded-lg p-5 border border-white/10 hover:border-purple-500/50 transition-all">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <div className="text-2xl">🍔</div>
                      <div>
                        <h3 className="text-base font-bold text-white font-space-grotesk">DoorDash</h3>
                        <p className="text-xs text-slate-400">Delivery</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-black bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent font-space-grotesk">$1,290</div>
                      <div className="text-xs text-slate-400">30% of income</div>
                    </div>
                  </div>
                  <div className="h-1.5 bg-slate-800 rounded-full mb-2 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-purple-500 to-purple-600 rounded-full" style={{width: '30%'}}></div>
                  </div>
                  <p className="text-xs text-purple-400"><strong>Pro tip:</strong> Downtown & university = stacked orders</p>
                </div>

                {/* Upwork */}
                <div className="bg-slate-900/50 backdrop-blur-xl rounded-lg p-5 border border-white/10 hover:border-pink-500/50 transition-all">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <div className="text-2xl">💼</div>
                      <div>
                        <h3 className="text-base font-bold text-white font-space-grotesk">Upwork</h3>
                        <p className="text-xs text-slate-400">Freelance</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-black bg-gradient-to-r from-pink-400 to-pink-600 bg-clip-text text-transparent font-space-grotesk">$1,120</div>
                      <div className="text-xs text-slate-400">26% of income</div>
                    </div>
                  </div>
                  <div className="h-1.5 bg-slate-800 rounded-full mb-2 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-pink-500 to-pink-600 rounded-full" style={{width: '26%'}}></div>
                  </div>
                  <p className="text-xs text-pink-400"><strong>Real talk:</strong> Bump your rate 15%. You're undercharging.</p>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-white/10"></div>

            {/* More sections side by side */}
            <div className="grid md:grid-cols-2 gap-4">
              {/* Quick actions */}
              <div className="bg-slate-900/50 backdrop-blur-xl rounded-lg p-5 border border-white/10">
                <h3 className="text-lg font-bold text-white mb-3 font-space-grotesk">Quick actions</h3>
                <div className="space-y-2">
                  <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white p-3 rounded-lg text-left hover:opacity-90 transition-opacity flex items-center justify-between">
                    <div>
                      <div className="text-sm font-semibold">Connect new platform</div>
                      <div className="text-xs text-blue-100">Sync earnings automatically</div>
                    </div>
                    <Globe className="w-5 h-5" />
                  </button>
                  <button className="w-full bg-slate-800/50 text-white p-3 rounded-lg text-left hover:bg-slate-800 transition-colors flex items-center justify-between">
                    <div>
                      <div className="text-sm font-semibold">Calculate taxes</div>
                      <div className="text-xs text-slate-400">See Q1 estimate</div>
                    </div>
                    <FileText className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Financial health */}
              <div className="bg-slate-900/50 backdrop-blur-xl rounded-lg p-5 border border-white/10">
                <h3 className="text-lg font-bold text-white mb-3 font-space-grotesk">Financial health</h3>
                <div className="flex items-center space-x-4 mb-3">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-500/20 to-emerald-500/20 border-4 border-green-500/30 flex items-center justify-center">
                    <div className="text-xl font-black text-white font-space-grotesk">78</div>
                  </div>
                  <div>
                    <div className="text-base font-bold text-white mb-1">Looking good</div>
                    <div className="text-xs text-slate-400">Better than 65% of gig workers</div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Emergency fund</span>
                    <span className="text-green-400 font-semibold">✓ On track</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Retirement</span>
                    <span className="text-yellow-400 font-semibold">⚠ Needs work</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Health coverage</span>
                    <span className="text-green-400 font-semibold">✓ Active</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-white/10"></div>

            {/* Educational content */}
            <div>
              <div className="mb-4">
                <h2 className="text-lg font-bold text-white font-space-grotesk">Learn & grow</h2>
                <p className="text-xs text-slate-400">Articles based on your work</p>
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-slate-900/50 backdrop-blur-xl rounded-lg p-5 border border-white/10 hover:border-blue-500/50 transition-all cursor-pointer group">
                  <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center mb-3">
                    <BookOpen className="w-4 h-4 text-blue-400" />
                  </div>
                  <h3 className="text-sm font-bold text-white mb-2 font-space-grotesk group-hover:text-blue-400 transition-colors">Maximizing Uber earnings in your city</h3>
                  <p className="text-xs text-slate-400 mb-3">Learn the best times, zones, and strategies to increase your hourly rate by 30% or more.</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-blue-400">5 min read</span>
                    <ArrowRight className="w-3 h-3 text-slate-400 group-hover:text-blue-400 transition-colors" />
                  </div>
                </div>

                <div className="bg-slate-900/50 backdrop-blur-xl rounded-lg p-5 border border-white/10 hover:border-purple-500/50 transition-all cursor-pointer group">
                  <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center mb-3">
                    <Heart className="w-4 h-4 text-purple-400" />
                  </div>
                  <h3 className="text-sm font-bold text-white mb-2 font-space-grotesk group-hover:text-purple-400 transition-colors">The gig worker's guide to health insurance</h3>
                  <p className="text-xs text-slate-400 mb-3">Everything you need to know about getting affordable coverage without an employer.</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-purple-400">8 min read</span>
                    <ArrowRight className="w-3 h-3 text-slate-400 group-hover:text-purple-400 transition-colors" />
                  </div>
                </div>

                <div className="bg-slate-900/50 backdrop-blur-xl rounded-lg p-5 border border-white/10 hover:border-pink-500/50 transition-all cursor-pointer group">
                  <div className="w-8 h-8 bg-pink-500/20 rounded-lg flex items-center justify-center mb-3">
                    <Receipt className="w-4 h-4 text-pink-400" />
                  </div>
                  <h3 className="text-sm font-bold text-white mb-2 font-space-grotesk group-hover:text-pink-400 transition-colors">How to track mileage for tax deductions</h3>
                  <p className="text-xs text-slate-400 mb-3">Simple systems to capture every deductible mile and maximize your tax savings.</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-pink-400">6 min read</span>
                    <ArrowRight className="w-3 h-3 text-slate-400 group-hover:text-pink-400 transition-colors" />
                  </div>
                </div>

                <div className="bg-slate-900/50 backdrop-blur-xl rounded-lg p-5 border border-white/10 hover:border-green-500/50 transition-all cursor-pointer group">
                  <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center mb-3">
                    <Wallet className="w-4 h-4 text-green-400" />
                  </div>
                  <h3 className="text-sm font-bold text-white mb-2 font-space-grotesk group-hover:text-green-400 transition-colors">Building an emergency fund on variable income</h3>
                  <p className="text-xs text-slate-400 mb-3">Proven strategies to save consistently even when your earnings fluctuate month to month.</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-green-400">7 min read</span>
                    <ArrowRight className="w-3 h-3 text-slate-400 group-hover:text-green-400 transition-colors" />
                  </div>
                </div>

                <div className="bg-slate-900/50 backdrop-blur-xl rounded-lg p-5 border border-white/10 hover:border-orange-500/50 transition-all cursor-pointer group">
                  <div className="w-8 h-8 bg-orange-500/20 rounded-lg flex items-center justify-center mb-3">
                    <FileText className="w-4 h-4 text-orange-400" />
                  </div>
                  <h3 className="text-sm font-bold text-white mb-2 font-space-grotesk group-hover:text-orange-400 transition-colors">Quarterly tax estimates explained</h3>
                  <p className="text-xs text-slate-400 mb-3">How to calculate, when to pay, and how to avoid penalties on your self-employment taxes.</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-orange-400">10 min read</span>
                    <ArrowRight className="w-3 h-3 text-slate-400 group-hover:text-orange-400 transition-colors" />
                  </div>
                </div>

                <div className="bg-slate-900/50 backdrop-blur-xl rounded-lg p-5 border border-white/10 hover:border-indigo-500/50 transition-all cursor-pointer group">
                  <div className="w-8 h-8 bg-indigo-500/20 rounded-lg flex items-center justify-center mb-3">
                    <Target className="w-4 h-4 text-indigo-400" />
                  </div>
                  <h3 className="text-sm font-bold text-white mb-2 font-space-grotesk group-hover:text-indigo-400 transition-colors">Retirement planning for freelancers</h3>
                  <p className="text-xs text-slate-400 mb-3">Solo 401(k)s, SEP IRAs, and other retirement accounts designed for independent workers.</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-indigo-400">12 min read</span>
                    <ArrowRight className="w-3 h-3 text-slate-400 group-hover:text-indigo-400 transition-colors" />
                  </div>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-white/10"></div>

            {/* Community insights */}
            <div className="bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 backdrop-blur-sm border border-white/10 rounded-lg p-6">
              <div className="flex items-center space-x-2 mb-3">
                <Users className="w-5 h-5 text-blue-400" />
                <h2 className="text-lg font-bold text-white font-space-grotesk">Community insights</h2>
              </div>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 flex-shrink-0"></div>
                  <p className="text-sm text-slate-300">
                    <span className="font-bold text-white">12,000 Uber drivers</span> on Portable average <span className="font-bold text-blue-400">$2,100/mo more</span> with multi-platform strategies
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-1.5 flex-shrink-0"></div>
                  <p className="text-sm text-slate-300">
                    <span className="font-bold text-white">Top earners in your area</span> work <span className="font-bold text-purple-400">3+ platforms simultaneously</span>
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-pink-500 rounded-full mt-1.5 flex-shrink-0"></div>
                  <p className="text-sm text-slate-300">
                    <span className="font-bold text-pink-400">95% of members</span> hit their emergency fund goal <span className="font-bold text-white">within 8 months</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-200 group">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform border border-green-500/20">
                    <DollarSign className="w-6 h-6 text-green-400" />
                  </div>
                  <span className="text-xs text-slate-400 bg-slate-800/50 px-3 py-1 rounded-full border border-white/10">6 months</span>
                </div>
                <h3 className="text-sm font-medium text-slate-400 mb-2">
                  Total Earnings
                </h3>
                <p className="text-3xl font-bold text-white mb-1">
                  ${totalEarnings.toLocaleString()}
                </p>
                <p className="text-sm text-slate-500">
                  ${Math.round(totalEarnings / 6).toLocaleString()}/month average
                </p>
              </div>

              <div className="bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:border-purple-500/50 hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-200 group">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform border border-blue-500/20">
                    <PiggyBank className="w-6 h-6 text-blue-400" />
                  </div>
                  <span className="text-xs text-slate-400 bg-slate-800/50 px-3 py-1 rounded-full border border-white/10">4% auto</span>
                </div>
                <h3 className="text-sm font-medium text-slate-400 mb-2">
                  Benefits Fund
                </h3>
                <p className="text-3xl font-bold text-white mb-1">
                  ${totalContributions.toLocaleString()}
                </p>
                <p className="text-sm text-slate-500">
                  Ready for health insurance
                </p>
              </div>

              <div className="bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:border-pink-500/50 hover:shadow-2xl hover:shadow-pink-500/20 transition-all duration-200 group">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500/20 to-purple-600/20 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform border border-purple-500/20">
                    <Shield className="w-6 h-6 text-purple-400" />
                  </div>
                  <span className="text-xs text-slate-400 bg-slate-800/50 px-3 py-1 rounded-full border border-white/10">2% auto</span>
                </div>
                <h3 className="text-sm font-medium text-slate-400 mb-2">
                  Emergency Fund
                </h3>
                <p className="text-3xl font-bold text-white mb-1">
                  ${emergencyFund.toLocaleString()}
                </p>
                <p className="text-sm text-slate-500">
                  60% to $2.4K goal
                </p>
              </div>
            </div>

            {/* Chart Section */}
            <div className="bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:border-white/20 transition-all">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2 font-space-grotesk">
                    Earnings & Contributions
                  </h3>
                  <p className="text-sm text-slate-400">6 month overview</p>
                </div>
                <div className="flex items-center space-x-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full"></div>
                    <span className="text-slate-400">Earnings</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-slate-500 rounded-full"></div>
                    <span className="text-slate-400">Contributions</span>
                  </div>
                </div>
              </div>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis
                      dataKey="month"
                      stroke="#94a3b8"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      stroke="#94a3b8"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1e293b',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '12px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.5)',
                        color: '#fff'
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="earnings"
                      stroke="url(#gradient)"
                      strokeWidth={3}
                      name="Earnings"
                      dot={{ fill: '#8b5cf6', strokeWidth: 0, r: 4 }}
                      activeDot={{ r: 6, stroke: '#8b5cf6', strokeWidth: 2, fill: '#fff' }}
                    />
                    <Line
                      type="monotone"
                      dataKey="contributions"
                      stroke="#64748b"
                      strokeWidth={2}
                      name="Contributions"
                      dot={{ fill: '#64748b', strokeWidth: 0, r: 4 }}
                      activeDot={{ r: 6, stroke: '#64748b', strokeWidth: 2, fill: '#fff' }}
                    />
                    <defs>
                      <linearGradient id="gradient" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#3b82f6" />
                        <stop offset="50%" stopColor="#8b5cf6" />
                        <stop offset="100%" stopColor="#ec4899" />
                      </linearGradient>
                    </defs>
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Platform Breakdown */}
            <div className="bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:border-white/20 transition-all">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2 font-space-grotesk">
                    Platform Breakdown
                  </h3>
                  <p className="text-sm text-slate-400">June 2024 earnings</p>
                </div>
              </div>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-slate-800/50 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-200 group">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-xl flex items-center justify-center text-xl group-hover:scale-105 transition-transform border border-blue-500/20">
                      🚗
                    </div>
                    <span className="text-sm text-slate-400 bg-slate-700/50 px-3 py-1 rounded-full border border-white/10">44%</span>
                  </div>
                  <h4 className="font-medium text-white mb-1">Uber</h4>
                  <p className="text-2xl font-bold text-white mb-1">$1,890</p>
                  <p className="text-sm text-slate-500">+12% from last month</p>
                </div>

                <div className="bg-slate-800/50 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:border-orange-500/50 hover:shadow-2xl hover:shadow-orange-500/20 transition-all duration-200 group">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-500/20 to-orange-600/20 rounded-xl flex items-center justify-center text-xl group-hover:scale-105 transition-transform border border-orange-500/20">
                      🍔
                    </div>
                    <span className="text-sm text-slate-400 bg-slate-700/50 px-3 py-1 rounded-full border border-white/10">30%</span>
                  </div>
                  <h4 className="font-medium text-white mb-1">DoorDash</h4>
                  <p className="text-2xl font-bold text-white mb-1">$1,290</p>
                  <p className="text-sm text-slate-500">+8% from last month</p>
                </div>

                <div className="bg-slate-800/50 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:border-purple-500/50 hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-200 group">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500/20 to-purple-600/20 rounded-xl flex items-center justify-center text-xl group-hover:scale-105 transition-transform border border-purple-500/20">
                      💼
                    </div>
                    <span className="text-sm text-slate-400 bg-slate-700/50 px-3 py-1 rounded-full border border-white/10">26%</span>
                  </div>
                  <h4 className="font-medium text-white mb-1">Upwork</h4>
                  <p className="text-2xl font-bold text-white mb-1">$1,120</p>
                  <p className="text-sm text-slate-500">+15% from last month</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'income' && <IncomeTracker userId={user.id} />}
        {activeTab === 'benefits' && <BenefitsMarketplace userId={user.id} />}

        {activeTab === 'taxes' && (
          <div className="relative">
            {/* Animated gradient blobs */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute top-0 right-20 w-96 h-96 bg-orange-500/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
              <div className="absolute top-40 left-20 w-96 h-96 bg-yellow-500/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
            </div>

            <div className="relative z-10 space-y-12">
              {/* Hero */}
              <div className="text-center py-12">
                <h1 className="text-7xl md:text-8xl font-bold mb-6 font-space-grotesk">
                  <span className="inline-block bg-gradient-to-r from-orange-400 via-yellow-400 to-orange-400 bg-clip-text text-transparent">
                    Tax Center
                  </span>
                </h1>
                <p className="text-2xl text-slate-300 font-light">Quarterly estimates, deductions, and 1099s</p>
              </div>

              {/* Main Tax Cards */}
              <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                <div className="group relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-red-600 rounded-3xl blur opacity-50 group-hover:opacity-75 transition-opacity"></div>
                  <div className="relative bg-gradient-to-br from-orange-600 to-red-700 rounded-3xl p-10 border border-orange-400/50 transform group-hover:-translate-y-2 transition-transform">
                    <div className="text-sm text-orange-200 font-semibold mb-3 uppercase tracking-wider">Q1 2024</div>
                    <div className="text-7xl font-black text-white mb-4 font-space-grotesk">$1,075</div>
                    <div className="text-orange-200 text-xl mb-6">Due April 15</div>
                    <button className="w-full bg-white text-orange-700 py-3 px-6 rounded-full text-lg font-bold hover:scale-105 transition-transform">
                      Pay Now
                    </button>
                  </div>
                </div>

                <div className="group relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl blur opacity-50 group-hover:opacity-75 transition-opacity"></div>
                  <div className="relative bg-gradient-to-br from-blue-600 to-blue-700 rounded-3xl p-10 border border-blue-400/50 transform group-hover:-translate-y-2 transition-transform">
                    <div className="text-sm text-blue-200 font-semibold mb-3 uppercase tracking-wider">Deductions</div>
                    <div className="text-7xl font-black text-white mb-4 font-space-grotesk">$2,340</div>
                    <div className="text-blue-200 text-xl mb-6">Tracked this year</div>
                    <button className="w-full bg-white/20 backdrop-blur-sm text-white py-3 px-6 rounded-full text-lg font-bold hover:bg-white/30 transition-colors border border-white/30">
                      View Details
                    </button>
                  </div>
                </div>

                <div className="group relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-purple-600 rounded-3xl blur opacity-50 group-hover:opacity-75 transition-opacity"></div>
                  <div className="relative bg-gradient-to-br from-purple-600 to-purple-700 rounded-3xl p-10 border border-purple-400/50 transform group-hover:-translate-y-2 transition-transform">
                    <div className="text-sm text-purple-200 font-semibold mb-3 uppercase tracking-wider">1099 Forms</div>
                    <div className="text-7xl font-black text-white mb-4 font-space-grotesk">3</div>
                    <div className="text-purple-200 text-xl mb-6">Ready to download</div>
                    <button className="w-full bg-white/20 backdrop-blur-sm text-white py-3 px-6 rounded-full text-lg font-bold hover:bg-white/30 transition-colors border border-white/30">
                      Download
                    </button>
                  </div>
                </div>
              </div>

            <div className="bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white font-space-grotesk mb-4">Common Tax Deductions for Gig Workers</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-800/50 rounded-lg p-4 border border-white/10">
                  <div className="flex items-start space-x-3">
                    <span className="text-2xl">🚗</span>
                    <div>
                      <h4 className="text-white font-medium mb-1">Mileage</h4>
                      <p className="text-sm text-slate-400">$0.67 per mile for business use (2024 rate)</p>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-800/50 rounded-lg p-4 border border-white/10">
                  <div className="flex items-start space-x-3">
                    <span className="text-2xl">📱</span>
                    <div>
                      <h4 className="text-white font-medium mb-1">Phone & Internet</h4>
                      <p className="text-sm text-slate-400">Business portion of monthly bills</p>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-800/50 rounded-lg p-4 border border-white/10">
                  <div className="flex items-start space-x-3">
                    <span className="text-2xl">🏠</span>
                    <div>
                      <h4 className="text-white font-medium mb-1">Home Office</h4>
                      <p className="text-sm text-slate-400">Dedicated workspace expenses</p>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-800/50 rounded-lg p-4 border border-white/10">
                  <div className="flex items-start space-x-3">
                    <span className="text-2xl">🛠️</span>
                    <div>
                      <h4 className="text-white font-medium mb-1">Supplies & Equipment</h4>
                      <p className="text-sm text-slate-400">Tools, software, bags, etc.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            </div>
          </div>
        )}

        {activeTab === 'learn' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-purple-500/10 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
              <h2 className="text-3xl font-bold text-white mb-2 font-space-grotesk">Learning Center 📚</h2>
              <p className="text-slate-300 text-lg">Master the gig economy with guides, tips, and community wisdom</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:border-blue-500/50 transition-all cursor-pointer">
                <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-3xl">🚗</span>
                </div>
                <h3 className="text-white font-semibold mb-2">Rideshare Guide</h3>
                <p className="text-sm text-slate-400 mb-4">Uber, Lyft optimization strategies</p>
                <ul className="space-y-2 text-sm text-slate-400">
                  <li>• Peak hour strategies</li>
                  <li>• Zone optimization</li>
                  <li>• Tax deductions</li>
                  <li>• Vehicle maintenance</li>
                </ul>
              </div>

              <div className="bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:border-purple-500/50 transition-all cursor-pointer">
                <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-3xl">🍔</span>
                </div>
                <h3 className="text-white font-semibold mb-2">Delivery Guide</h3>
                <p className="text-sm text-slate-400 mb-4">DoorDash, Uber Eats, Instacart tips</p>
                <ul className="space-y-2 text-sm text-slate-400">
                  <li>• Multi-apping strategies</li>
                  <li>• Hot zones & timing</li>
                  <li>• Gas expense tracking</li>
                  <li>• Customer ratings</li>
                </ul>
              </div>

              <div className="bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:border-pink-500/50 transition-all cursor-pointer">
                <div className="w-12 h-12 bg-pink-500/20 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-3xl">💼</span>
                </div>
                <h3 className="text-white font-semibold mb-2">Freelance Guide</h3>
                <p className="text-sm text-slate-400 mb-4">Upwork, Fiverr, Freelancer.com</p>
                <ul className="space-y-2 text-sm text-slate-400">
                  <li>• Profile optimization</li>
                  <li>• Pricing strategies</li>
                  <li>• Client communication</li>
                  <li>• Contract templates</li>
                </ul>
              </div>

              <div className="bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:border-red-500/50 transition-all cursor-pointer">
                <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-3xl">📹</span>
                </div>
                <h3 className="text-white font-semibold mb-2">Creator Guide</h3>
                <p className="text-sm text-slate-400 mb-4">YouTube, TikTok, Twitch</p>
                <ul className="space-y-2 text-sm text-slate-400">
                  <li>• Monetization setup</li>
                  <li>• Sponsorship deals</li>
                  <li>• Tax considerations</li>
                  <li>• Content strategy</li>
                </ul>
              </div>

              <div className="bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:border-green-500/50 transition-all cursor-pointer">
                <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-3xl">🏠</span>
                </div>
                <h3 className="text-white font-semibold mb-2">Hosting Guide</h3>
                <p className="text-sm text-slate-400 mb-4">Airbnb, Vrbo optimization</p>
                <ul className="space-y-2 text-sm text-slate-400">
                  <li>• Listing optimization</li>
                  <li>• Pricing strategies</li>
                  <li>• Cleaning & maintenance</li>
                  <li>• Tax deductions</li>
                </ul>
              </div>

              <div className="bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:border-yellow-500/50 transition-all cursor-pointer">
                <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-3xl">🛠️</span>
                </div>
                <h3 className="text-white font-semibold mb-2">Task Guide</h3>
                <p className="text-sm text-slate-400 mb-4">TaskRabbit, Handy, Thumbtack</p>
                <ul className="space-y-2 text-sm text-slate-400">
                  <li>• Service offerings</li>
                  <li>• Tool investments</li>
                  <li>• Safety considerations</li>
                  <li>• Insurance needs</li>
                </ul>
              </div>
            </div>

            <div className="bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white font-space-grotesk mb-4">Featured Articles</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-4 p-4 bg-slate-800/50 rounded-lg border border-white/10 hover:border-blue-500/50 transition-all cursor-pointer">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">💰</span>
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-1">How to Earn $100K as a Gig Worker</h4>
                    <p className="text-sm text-slate-400 mb-2">Multi-platform strategies from top earners</p>
                    <span className="text-xs text-blue-400">8 min read</span>
                  </div>
                </div>

                <div className="flex items-start space-x-4 p-4 bg-slate-800/50 rounded-lg border border-white/10 hover:border-purple-500/50 transition-all cursor-pointer">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">🏥</span>
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-1">Health Insurance Options for Gig Workers</h4>
                    <p className="text-sm text-slate-400 mb-2">Complete guide to coverage without an employer</p>
                    <span className="text-xs text-purple-400">12 min read</span>
                  </div>
                </div>

                <div className="flex items-start space-x-4 p-4 bg-slate-800/50 rounded-lg border border-white/10 hover:border-pink-500/50 transition-all cursor-pointer">
                  <div className="w-16 h-16 bg-gradient-to-br from-pink-500/20 to-red-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">📊</span>
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-1">Self-Employment Tax Breakdown</h4>
                    <p className="text-sm text-slate-400 mb-2">Everything you need to know about quarterly payments</p>
                    <span className="text-xs text-pink-400">10 min read</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8 px-6 bg-slate-900/50 backdrop-blur-xl mt-16">
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