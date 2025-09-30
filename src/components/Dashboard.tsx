'use client';

import { useState, useEffect } from 'react';
import IncomeTracker from './IncomeTracker';
import BenefitsMarketplace from './BenefitsMarketplace';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { BarChart3, DollarSign, PiggyBank, Shield, LogOut, User, TrendingUp, FileText, MessageCircle, Zap, Globe, ArrowRight } from 'lucide-react';

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
          <div className="space-y-6">
            {/* Welcome Section */}
            <div className="bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
              <h2 className="text-3xl font-bold text-white mb-2 font-space-grotesk">Welcome back, {user.firstName}! 👋</h2>
              <p className="text-slate-300 text-lg">Here's your financial snapshot for this month</p>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:border-blue-500/50 transition-all">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-slate-400 text-sm">This Month</span>
                  <TrendingUp className="w-4 h-4 text-green-400" />
                </div>
                <p className="text-3xl font-bold text-white mb-1">$4,300</p>
                <p className="text-sm text-green-400">+12% vs last month</p>
              </div>

              <div className="bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:border-purple-500/50 transition-all">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-slate-400 text-sm">Saved</span>
                  <PiggyBank className="w-4 h-4 text-purple-400" />
                </div>
                <p className="text-3xl font-bold text-white mb-1">$876</p>
                <p className="text-sm text-slate-400">Benefits + Emergency</p>
              </div>

              <div className="bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:border-orange-500/50 transition-all">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-slate-400 text-sm">Tax Set Aside</span>
                  <DollarSign className="w-4 h-4 text-orange-400" />
                </div>
                <p className="text-3xl font-bold text-white mb-1">$1,075</p>
                <p className="text-sm text-slate-400">25% of earnings</p>
              </div>

              <div className="bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:border-pink-500/50 transition-all">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-slate-400 text-sm">Active Platforms</span>
                  <Zap className="w-4 h-4 text-pink-400" />
                </div>
                <p className="text-3xl font-bold text-white mb-1">3</p>
                <p className="text-sm text-slate-400">Uber, DoorDash, Upwork</p>
              </div>
            </div>

            {/* Educational Insights */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Platform Performance */}
              <div className="bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-semibold text-white font-space-grotesk">Platform Performance</h3>
                    <p className="text-sm text-slate-400">See which gigs pay best</p>
                  </div>
                  <BarChart3 className="w-5 h-5 text-blue-400" />
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <span className="text-xl">🚗</span>
                        <span className="text-white font-medium">Uber</span>
                      </div>
                      <span className="text-white font-bold">$1,890</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 bg-slate-800 rounded-full h-2">
                        <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full" style={{width: '44%'}}></div>
                      </div>
                      <span className="text-sm text-slate-400">44%</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">💡 Peak hours: 5-9pm weekdays</p>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <span className="text-xl">🍔</span>
                        <span className="text-white font-medium">DoorDash</span>
                      </div>
                      <span className="text-white font-bold">$1,290</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 bg-slate-800 rounded-full h-2">
                        <div className="bg-gradient-to-r from-purple-500 to-purple-600 h-2 rounded-full" style={{width: '30%'}}></div>
                      </div>
                      <span className="text-sm text-slate-400">30%</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">💡 Best zones: Downtown & University</p>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <span className="text-xl">💼</span>
                        <span className="text-white font-medium">Upwork</span>
                      </div>
                      <span className="text-white font-bold">$1,120</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 bg-slate-800 rounded-full h-2">
                        <div className="bg-gradient-to-r from-pink-500 to-pink-600 h-2 rounded-full" style={{width: '26%'}}></div>
                      </div>
                      <span className="text-sm text-slate-400">26%</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">💡 Tip: Increase your rate by 15%</p>
                  </div>
                </div>
              </div>

              {/* Financial Health Score */}
              <div className="bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-semibold text-white font-space-grotesk">Financial Health</h3>
                    <p className="text-sm text-slate-400">Your money wellness score</p>
                  </div>
                  <Shield className="w-5 h-5 text-green-400" />
                </div>

                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-br from-green-500/20 to-emerald-500/20 border-4 border-green-500/30 mb-4">
                    <div className="text-center">
                      <p className="text-4xl font-bold text-white">78</p>
                      <p className="text-sm text-slate-400">Good</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <span className="text-sm text-slate-300">Emergency fund</span>
                    </div>
                    <span className="text-sm font-medium text-green-400">✓ On track</span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                      <span className="text-sm text-slate-300">Retirement savings</span>
                    </div>
                    <span className="text-sm font-medium text-yellow-400">! Needs attention</span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <span className="text-sm text-slate-300">Health coverage</span>
                    </div>
                    <span className="text-sm font-medium text-green-400">✓ Active</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Educational Content */}
            <div className="bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-white font-space-grotesk">Recommended for You</h3>
                  <p className="text-sm text-slate-400">Personalized tips based on your gig work</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-slate-800/50 rounded-xl p-5 border border-white/10 hover:border-blue-500/50 transition-all cursor-pointer">
                  <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center mb-3">
                    <span className="text-2xl">📊</span>
                  </div>
                  <h4 className="text-white font-semibold mb-2">Tax Deduction Guide</h4>
                  <p className="text-sm text-slate-400 mb-3">Learn what rideshare drivers can write off</p>
                  <div className="flex items-center text-blue-400 text-sm font-medium">
                    <span>Read article</span>
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </div>
                </div>

                <div className="bg-slate-800/50 rounded-xl p-5 border border-white/10 hover:border-purple-500/50 transition-all cursor-pointer">
                  <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center mb-3">
                    <span className="text-2xl">🎯</span>
                  </div>
                  <h4 className="text-white font-semibold mb-2">Maximize Your Earnings</h4>
                  <p className="text-sm text-slate-400 mb-3">Data shows these hours pay 40% more</p>
                  <div className="flex items-center text-purple-400 text-sm font-medium">
                    <span>View insights</span>
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </div>
                </div>

                <div className="bg-slate-800/50 rounded-xl p-5 border border-white/10 hover:border-pink-500/50 transition-all cursor-pointer">
                  <div className="w-10 h-10 bg-pink-500/20 rounded-lg flex items-center justify-center mb-3">
                    <span className="text-2xl">🏥</span>
                  </div>
                  <h4 className="text-white font-semibold mb-2">Health Insurance 101</h4>
                  <p className="text-sm text-slate-400 mb-3">Understanding your coverage options</p>
                  <div className="flex items-center text-pink-400 text-sm font-medium">
                    <span>Learn more</span>
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:border-blue-500/50 transition-all cursor-pointer">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-white font-semibold mb-1">Connect New Platform</h4>
                    <p className="text-sm text-slate-400">Sync earnings automatically</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center">
                    <Globe className="w-6 h-6 text-blue-400" />
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:border-purple-500/50 transition-all cursor-pointer">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-white font-semibold mb-1">Calculate Quarterly Taxes</h4>
                    <p className="text-sm text-slate-400">See what you owe for Q1</p>
                  </div>
                  <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center">
                    <FileText className="w-6 h-6 text-purple-400" />
                  </div>
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
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-orange-500/10 via-yellow-500/10 to-orange-500/10 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
              <h2 className="text-3xl font-bold text-white mb-2 font-space-grotesk">Tax Center 📊</h2>
              <p className="text-slate-300 text-lg">Manage your quarterly estimates, deductions, and 1099s</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-xl p-6">
                <h3 className="text-white font-semibold mb-4">Q1 2024 Estimate</h3>
                <p className="text-4xl font-bold text-white mb-2">$1,075</p>
                <p className="text-sm text-slate-400 mb-4">Due: April 15, 2024</p>
                <button className="w-full bg-gradient-to-r from-orange-600 to-yellow-600 text-white py-2 px-4 rounded-md text-sm font-medium hover:opacity-90 transition-opacity">
                  Pay Now
                </button>
              </div>

              <div className="bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-xl p-6">
                <h3 className="text-white font-semibold mb-4">Tracked Deductions</h3>
                <p className="text-4xl font-bold text-white mb-2">$2,340</p>
                <p className="text-sm text-slate-400 mb-4">Mileage, phone, supplies</p>
                <button className="w-full bg-slate-800 text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-slate-700 transition-colors">
                  View Details
                </button>
              </div>

              <div className="bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-xl p-6">
                <h3 className="text-white font-semibold mb-4">1099 Forms</h3>
                <p className="text-4xl font-bold text-white mb-2">3</p>
                <p className="text-sm text-slate-400 mb-4">Ready to download</p>
                <button className="w-full bg-slate-800 text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-slate-700 transition-colors">
                  Download All
                </button>
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
    </div>
  );
}