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
    <div className="min-h-screen bg-white">
      {/* Clean Navigation */}
      <nav className="border-b border-gray-100 bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 bg-black rounded-sm"></div>
              <h1 className="text-lg font-medium text-gray-900">GigBenefits</h1>
            </div>
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-gray-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {user.firstName}
                  </p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 text-gray-500 hover:text-gray-700 transition-colors text-sm"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Minimal Tab Navigation */}
        <div className="mb-8">
          <nav className="flex space-x-1 bg-gray-50 rounded-lg p-1">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3 },
              { id: 'income', label: 'Income', icon: DollarSign },
              { id: 'benefits', label: 'Benefits', icon: Shield }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Clean Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white border border-gray-200 rounded-lg p-6 hover:border-gray-300 transition-colors">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-green-600" />
                  </div>
                  <span className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded">6 months</span>
                </div>
                <h3 className="text-sm font-medium text-gray-600 mb-2">
                  Total Earnings
                </h3>
                <p className="text-3xl font-medium text-gray-900 mb-1">
                  ${totalEarnings.toLocaleString()}
                </p>
                <p className="text-sm text-gray-500">
                  ${Math.round(totalEarnings / 6).toLocaleString()}/month average
                </p>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6 hover:border-gray-300 transition-colors">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                    <PiggyBank className="w-5 h-5 text-blue-600" />
                  </div>
                  <span className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded">4% auto</span>
                </div>
                <h3 className="text-sm font-medium text-gray-600 mb-2">
                  Benefits Fund
                </h3>
                <p className="text-3xl font-medium text-gray-900 mb-1">
                  ${totalContributions.toLocaleString()}
                </p>
                <p className="text-sm text-gray-500">
                  Ready for health insurance
                </p>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6 hover:border-gray-300 transition-colors">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                    <Shield className="w-5 h-5 text-purple-600" />
                  </div>
                  <span className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded">2% auto</span>
                </div>
                <h3 className="text-sm font-medium text-gray-600 mb-2">
                  Emergency Fund
                </h3>
                <p className="text-3xl font-medium text-gray-900 mb-1">
                  ${emergencyFund.toLocaleString()}
                </p>
                <p className="text-sm text-gray-500">
                  60% to $2.4K goal
                </p>
              </div>
            </div>

            {/* Chart Section */}
            <div className="bg-white border border-gray-200 rounded-lg p-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-1">
                    Earnings & Contributions
                  </h3>
                  <p className="text-sm text-gray-500">6 month overview</p>
                </div>
                <div className="flex items-center space-x-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-gray-900 rounded-full"></div>
                    <span className="text-gray-600">Earnings</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                    <span className="text-gray-600">Contributions</span>
                  </div>
                </div>
              </div>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                    <XAxis
                      dataKey="month"
                      stroke="#9ca3af"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      stroke="#9ca3af"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="earnings"
                      stroke="#111827"
                      strokeWidth={2}
                      name="Earnings"
                      dot={{ fill: '#111827', strokeWidth: 0, r: 4 }}
                      activeDot={{ r: 6, stroke: '#111827', strokeWidth: 2, fill: '#fff' }}
                    />
                    <Line
                      type="monotone"
                      dataKey="contributions"
                      stroke="#6b7280"
                      strokeWidth={2}
                      name="Contributions"
                      dot={{ fill: '#6b7280', strokeWidth: 0, r: 4 }}
                      activeDot={{ r: 6, stroke: '#6b7280', strokeWidth: 2, fill: '#fff' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Platform Breakdown */}
            <div className="bg-white border border-gray-200 rounded-lg p-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-1">
                    Platform Breakdown
                  </h3>
                  <p className="text-sm text-gray-500">June 2024 earnings</p>
                </div>
              </div>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="border border-gray-200 rounded-lg p-6 hover:border-gray-300 transition-colors">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-lg">
                      🚗
                    </div>
                    <span className="text-sm text-gray-500">44%</span>
                  </div>
                  <h4 className="font-medium text-gray-900 mb-1">Uber</h4>
                  <p className="text-2xl font-medium text-gray-900 mb-1">$1,890</p>
                  <p className="text-sm text-gray-500">+12% from last month</p>
                </div>

                <div className="border border-gray-200 rounded-lg p-6 hover:border-gray-300 transition-colors">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-lg">
                      🍔
                    </div>
                    <span className="text-sm text-gray-500">30%</span>
                  </div>
                  <h4 className="font-medium text-gray-900 mb-1">DoorDash</h4>
                  <p className="text-2xl font-medium text-gray-900 mb-1">$1,290</p>
                  <p className="text-sm text-gray-500">+8% from last month</p>
                </div>

                <div className="border border-gray-200 rounded-lg p-6 hover:border-gray-300 transition-colors">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-lg">
                      💼
                    </div>
                    <span className="text-sm text-gray-500">26%</span>
                  </div>
                  <h4 className="font-medium text-gray-900 mb-1">Upwork</h4>
                  <p className="text-2xl font-medium text-gray-900 mb-1">$1,120</p>
                  <p className="text-sm text-gray-500">+15% from last month</p>
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