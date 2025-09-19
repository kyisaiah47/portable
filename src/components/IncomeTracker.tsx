'use client';

import { useState } from 'react';

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
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Connected Platforms
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {connectedPlatforms.map((platform) => (
            <div
              key={platform.id}
              className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <span className="text-2xl mr-3">{platform.logo}</span>
                  <h3 className="font-medium text-gray-900">{platform.name}</h3>
                </div>
                <div className={`w-3 h-3 rounded-full ${
                  platform.connected ? 'bg-green-500' : 'bg-gray-300'
                }`}></div>
              </div>

              {platform.connected ? (
                <div>
                  <p className="text-sm text-gray-600 mb-2">
                    Last sync: {platform.lastSync}
                  </p>
                  <button className="text-blue-600 text-sm hover:text-blue-700">
                    Sync now
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => handleConnect(platform.id)}
                  className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700"
                >
                  Connect
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Manual Entry
        </h2>
        <form onSubmit={handleManualSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Platform
            </label>
            <select
              value={manualEntry.platform}
              onChange={(e) => setManualEntry(prev => ({ ...prev, platform: e.target.value }))}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select platform</option>
              <option value="Other">Other</option>
              <option value="Cash">Cash</option>
              <option value="TaskRabbit">TaskRabbit</option>
              <option value="Fiverr">Fiverr</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Amount ($)
            </label>
            <input
              type="number"
              step="0.01"
              value={manualEntry.amount}
              onChange={(e) => setManualEntry(prev => ({ ...prev, amount: e.target.value }))}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <input
              type="text"
              value={manualEntry.description}
              onChange={(e) => setManualEntry(prev => ({ ...prev, description: e.target.value }))}
              placeholder="e.g., 3 rides"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date
            </label>
            <input
              type="date"
              value={manualEntry.date}
              onChange={(e) => setManualEntry(prev => ({ ...prev, date: e.target.value }))}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="md:col-span-2 lg:col-span-4">
            <button
              type="submit"
              className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700"
            >
              Add Earning
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Recent Earnings
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-900">Platform</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Amount</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Description</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Date</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Time</th>
              </tr>
            </thead>
            <tbody>
              {recentEarnings.map((earning) => (
                <tr key={earning.id} className="border-b border-gray-100">
                  <td className="py-3 px-4">{earning.platform}</td>
                  <td className="py-3 px-4 font-medium text-green-600">
                    ${earning.amount.toFixed(2)}
                  </td>
                  <td className="py-3 px-4 text-gray-600">{earning.description}</td>
                  <td className="py-3 px-4 text-gray-600">{earning.date}</td>
                  <td className="py-3 px-4 text-gray-600">{earning.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}