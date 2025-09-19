'use client';

import { useState } from 'react';
import { Wifi, WifiOff, Plus, TrendingUp, Calendar, DollarSign, Zap } from 'lucide-react';

interface IncomeTrackerProps {
  userId: string;
}

export default function IncomeTracker({ userId }: IncomeTrackerProps) {
  const [connectedPlatforms, setConnectedPlatforms] = useState([
    { id: 1, name: 'Uber', connected: true, lastSync: '2 hours ago', logo: '🚗' },
    { id: 2, name: 'DoorDash', connected: true, lastSync: '1 hour ago', logo: '🍔' },
    { id: 3, name: 'Upwork', connected: false, lastSync: null, logo: '💼' },
    { id: 4, name: 'Lyft', connected: false, lastSync: null, logo: '🚕' },
    { id: 5, name: 'Instacart', connected: false, lastSync: null, logo: '🛒' },
  ]);

  const [manualEntry, setManualEntry] = useState({
    platform: '',
    amount: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
  });

  const recentEarnings = [
    { id: 1, platform: 'Uber', amount: 89.50, description: '6 rides', date: '2024-09-18', time: '14:30' },
    { id: 2, platform: 'DoorDash', amount: 45.25, description: '3 deliveries', date: '2024-09-18', time: '12:15' },
    { id: 3, platform: 'Upwork', amount: 150.00, description: 'Logo design project', date: '2024-09-17', time: '16:00' },
    { id: 4, platform: 'Uber', amount: 67.80, description: '4 rides', date: '2024-09-17', time: '10:45' },
  ];

  const handleConnect = (platformId: number) => {
    setConnectedPlatforms(prev =>
      prev.map(platform =>
        platform.id === platformId
          ? { ...platform, connected: true, lastSync: 'just now' }
          : platform
      )
    );
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Manual entry:', manualEntry);
    setManualEntry({
      platform: '',
      amount: '',
      description: '',
      date: new Date().toISOString().split('T')[0],
    });
  };

  return (
    <div className="space-y-8">
      {/* Connected Platforms */}
      <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center">
              <Wifi className="w-5 h-5 text-gray-600" />
            </div>
            <div>
              <h2 className="text-xl font-medium text-gray-900">Platform Connections</h2>
              <p className="text-sm text-gray-500">Manage your gig platform integrations</p>
            </div>
          </div>
          <div className="bg-gray-50 rounded-md px-3 py-1">
            <span className="text-sm text-gray-600">
              {connectedPlatforms.filter(p => p.connected).length} connected
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {connectedPlatforms.map((platform) => (
            <div
              key={platform.id}
              className="bg-white rounded-lg p-6 border border-gray-200 hover:border-gray-300 transition-colors"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">{platform.logo}</div>
                  <div>
                    <h3 className="font-medium text-gray-900">{platform.name}</h3>
                    <div className="flex items-center space-x-2 mt-1">
                      {platform.connected ? (
                        <>
                          <Wifi className="w-4 h-4 text-gray-600" />
                          <span className="text-sm text-gray-600">Connected</span>
                        </>
                      ) : (
                        <>
                          <WifiOff className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-500">Disconnected</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {platform.connected ? (
                <div className="space-y-3">
                  <div className="bg-gray-50 rounded-md p-3 border border-gray-200">
                    <p className="text-sm text-gray-600">
                      Last sync: {platform.lastSync}
                    </p>
                  </div>
                  <button className="w-full bg-gray-900 text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-gray-800 transition-colors flex items-center justify-center space-x-2">
                    <Zap className="w-4 h-4" />
                    <span>Sync Now</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => handleConnect(platform.id)}
                  className="w-full bg-gray-900 text-white py-2 px-4 rounded-md font-medium hover:bg-gray-800 transition-colors flex items-center justify-center space-x-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Connect</span>
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Manual Entry */}
      <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center">
            <Plus className="w-5 h-5 text-gray-600" />
          </div>
          <div>
            <h2 className="text-xl font-medium text-gray-900">Add Manual Entry</h2>
            <p className="text-sm text-gray-500">Record earnings from other platforms</p>
          </div>
        </div>

        <form onSubmit={handleManualSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Platform
            </label>
            <select
              value={manualEntry.platform}
              onChange={(e) => setManualEntry(prev => ({ ...prev, platform: e.target.value }))}
              required
              className="w-full px-3 py-2 bg-white border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-300 focus:border-gray-300"
            >
              <option value="">Select platform</option>
              <option value="Other">Other</option>
              <option value="Cash">Cash</option>
              <option value="TaskRabbit">TaskRabbit</option>
              <option value="Fiverr">Fiverr</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Amount ($)
            </label>
            <input
              type="number"
              step="0.01"
              value={manualEntry.amount}
              onChange={(e) => setManualEntry(prev => ({ ...prev, amount: e.target.value }))}
              required
              className="w-full px-3 py-2 bg-white border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-300 focus:border-gray-300"
              placeholder="0.00"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <input
              type="text"
              value={manualEntry.description}
              onChange={(e) => setManualEntry(prev => ({ ...prev, description: e.target.value }))}
              placeholder="e.g., 3 rides"
              className="w-full px-3 py-2 bg-white border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-300 focus:border-gray-300"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date
            </label>
            <input
              type="date"
              value={manualEntry.date}
              onChange={(e) => setManualEntry(prev => ({ ...prev, date: e.target.value }))}
              required
              className="w-full px-3 py-2 bg-white border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-300 focus:border-gray-300"
            />
          </div>

          <div className="md:col-span-2 lg:col-span-4">
            <button
              type="submit"
              className="bg-gray-900 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-800 transition-colors flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add Earning</span>
            </button>
          </div>
        </form>
      </div>

      {/* Recent Earnings */}
      <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-gray-600" />
            </div>
            <div>
              <h2 className="text-xl font-medium text-gray-900">Recent Earnings</h2>
              <p className="text-sm text-gray-500">Your latest income activity</p>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200/50">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Platform</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Amount</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Description</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Date</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Time</th>
              </tr>
            </thead>
            <tbody>
              {recentEarnings.map((earning) => (
                <tr key={earning.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-4 font-medium text-gray-900 text-sm">{earning.platform}</td>
                  <td className="py-3 px-4">
                    <span className="text-sm font-medium text-gray-900">
                      ${earning.amount.toFixed(2)}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">{earning.description}</td>
                  <td className="py-3 px-4 text-sm text-gray-600">{earning.date}</td>
                  <td className="py-3 px-4 text-sm text-gray-600">{earning.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}