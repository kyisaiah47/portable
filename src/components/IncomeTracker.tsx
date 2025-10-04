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
    // TODO: Save manual entry to Supabase
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
      <div className="bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:border-white/20 transition-all">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg flex items-center justify-center border border-blue-500/20">
              <Wifi className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white font-space-grotesk">Platform Connections</h2>
              <p className="text-sm text-slate-400">Manage your gig platform integrations</p>
            </div>
          </div>
          <div className="bg-slate-800/50 rounded-md px-3 py-1 border border-white/10">
            <span className="text-sm text-slate-300">
              {connectedPlatforms.filter(p => p.connected).length} connected
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {connectedPlatforms.map((platform) => (
            <div
              key={platform.id}
              className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-500/20 transition-all"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">{platform.logo}</div>
                  <div>
                    <h3 className="font-medium text-white">{platform.name}</h3>
                    <div className="flex items-center space-x-2 mt-1">
                      {platform.connected ? (
                        <>
                          <Wifi className="w-4 h-4 text-green-400" />
                          <span className="text-sm text-green-400">Connected</span>
                        </>
                      ) : (
                        <>
                          <WifiOff className="w-4 h-4 text-slate-500" />
                          <span className="text-sm text-slate-500">Disconnected</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {platform.connected ? (
                <div className="space-y-3">
                  <div className="bg-slate-700/50 rounded-md p-3 border border-white/10">
                    <p className="text-sm text-slate-300">
                      Last sync: {platform.lastSync}
                    </p>
                  </div>
                  <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 px-4 rounded-md text-sm font-medium hover:opacity-90 transition-opacity flex items-center justify-center space-x-2">
                    <Zap className="w-4 h-4" />
                    <span>Sync Now</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => handleConnect(platform.id)}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 px-4 rounded-md font-medium hover:opacity-90 transition-opacity flex items-center justify-center space-x-2"
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
      <div className="bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:border-white/20 transition-all">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-lg flex items-center justify-center border border-purple-500/20">
            <Plus className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-white font-space-grotesk">Add Manual Entry</h2>
            <p className="text-sm text-slate-400">Record earnings from other platforms</p>
          </div>
        </div>

        <form onSubmit={handleManualSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Platform
            </label>
            <select
              value={manualEntry.platform}
              onChange={(e) => setManualEntry(prev => ({ ...prev, platform: e.target.value }))}
              required
              className="w-full px-3 py-2 bg-slate-800/50 border border-white/10 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-white"
            >
              <option value="">Select platform</option>
              <option value="Other">Other</option>
              <option value="Cash">Cash</option>
              <option value="TaskRabbit">TaskRabbit</option>
              <option value="Fiverr">Fiverr</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Amount ($)
            </label>
            <input
              type="number"
              step="0.01"
              value={manualEntry.amount}
              onChange={(e) => setManualEntry(prev => ({ ...prev, amount: e.target.value }))}
              required
              className="w-full px-3 py-2 bg-slate-800/50 border border-white/10 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-white placeholder-slate-500"
              placeholder="0.00"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Description
            </label>
            <input
              type="text"
              value={manualEntry.description}
              onChange={(e) => setManualEntry(prev => ({ ...prev, description: e.target.value }))}
              placeholder="e.g., 3 rides"
              className="w-full px-3 py-2 bg-slate-800/50 border border-white/10 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-white placeholder-slate-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Date
            </label>
            <input
              type="date"
              value={manualEntry.date}
              onChange={(e) => setManualEntry(prev => ({ ...prev, date: e.target.value }))}
              required
              className="w-full px-3 py-2 bg-slate-800/50 border border-white/10 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-white"
            />
          </div>

          <div className="md:col-span-2 lg:col-span-4">
            <button
              type="submit"
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:opacity-90 transition-opacity flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add Earning</span>
            </button>
          </div>
        </form>
      </div>

      {/* Recent Earnings */}
      <div className="bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:border-white/20 transition-all">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-lg flex items-center justify-center border border-green-500/20">
              <TrendingUp className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white font-space-grotesk">Recent Earnings</h2>
              <p className="text-sm text-slate-400">Your latest income activity</p>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">Platform</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">Amount</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">Description</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">Date</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">Time</th>
              </tr>
            </thead>
            <tbody>
              {recentEarnings.map((earning) => (
                <tr key={earning.id} className="border-b border-white/5 hover:bg-slate-800/50 transition-colors">
                  <td className="py-3 px-4 font-medium text-white text-sm">{earning.platform}</td>
                  <td className="py-3 px-4">
                    <span className="text-sm font-medium text-green-400">
                      ${earning.amount.toFixed(2)}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-slate-400">{earning.description}</td>
                  <td className="py-3 px-4 text-sm text-slate-400">{earning.date}</td>
                  <td className="py-3 px-4 text-sm text-slate-400">{earning.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}