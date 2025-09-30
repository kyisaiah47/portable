'use client';

import { useState, useEffect } from 'react';
import IncomeTracker from './IncomeTracker';
import BenefitsMarketplace from './BenefitsMarketplace';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { BarChart3, DollarSign, PiggyBank, Shield, LogOut, User, TrendingUp } from 'lucide-react';

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
  const [activeTab, setActiveTab] = useState('overview');

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
                  { id: 'overview', label: 'Overview', icon: BarChart3 },
                  { id: 'income', label: 'Income', icon: DollarSign },
                  { id: 'benefits', label: 'Benefits', icon: Shield }
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
      </div>
    </div>
  );
}