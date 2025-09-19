'use client';

import { useState, useEffect } from 'react';
import IncomeTracker from './IncomeTracker';
import BenefitsMarketplace from './BenefitsMarketplace';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

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
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">GigBenefits</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">
                Welcome, {user.firstName}!
              </span>
              <button
                onClick={handleLogout}
                className="text-gray-500 hover:text-gray-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {['overview', 'income', 'benefits'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Total Earnings (6 months)
                </h3>
                <p className="text-3xl font-bold text-green-600">
                  ${totalEarnings.toLocaleString()}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Average: ${Math.round(totalEarnings / 6).toLocaleString()}/month
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Benefits Contributions
                </h3>
                <p className="text-3xl font-bold text-blue-600">
                  ${totalContributions.toLocaleString()}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  4% of earnings automatically saved
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Emergency Fund
                </h3>
                <p className="text-3xl font-bold text-purple-600">
                  ${emergencyFund.toLocaleString()}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  2% of earnings for emergencies
                </p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Earnings & Contributions Trend
              </h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="earnings"
                      stroke="#10b981"
                      strokeWidth={2}
                      name="Earnings"
                    />
                    <Line
                      type="monotone"
                      dataKey="contributions"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      name="Benefits Contributions"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Platform Breakdown (This Month)
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                    <span>Uber</span>
                  </div>
                  <span className="font-medium">$1,890 (44%)</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
                    <span>DoorDash</span>
                  </div>
                  <span className="font-medium">$1,290 (30%)</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-purple-500 rounded-full mr-3"></div>
                    <span>Upwork</span>
                  </div>
                  <span className="font-medium">$1,120 (26%)</span>
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