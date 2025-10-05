'use client';

import { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Minus, Award, Target, Clock, Calendar } from 'lucide-react';
import { analyzePlatformPerformance, getPlatformIcon, getPlatformColor } from '@/lib/platform-insights';

interface Transaction {
  date: Date;
  amount: number;
  platform: string;
  merchant_name?: string;
}

interface PlatformInsightsProps {
  transactions: Transaction[];
}

export default function PlatformInsights({ transactions }: PlatformInsightsProps) {
  const analysis = useMemo(() => {
    if (!transactions || transactions.length === 0) return null;
    return analyzePlatformPerformance(transactions);
  }, [transactions]);

  if (!analysis || analysis.platforms.length === 0) {
    return (
      <Card className="bg-slate-900/50 border-white/10">
        <CardContent className="p-12 text-center">
          <Target className="w-16 h-16 text-slate-600 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-white mb-2">No platform data yet</h3>
          <p className="text-sm text-slate-400">
            Connect your bank account to see detailed platform comparison insights
          </p>
        </CardContent>
      </Card>
    );
  }

  const { platforms, topPerformer, mostConsistent, recommendations } = analysis;

  return (
    <div className="space-y-6">
      {/* Top Performers */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-blue-500/20">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-blue-400" />
              <CardDescription className="text-slate-400">Top Earner</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white flex items-center gap-2">
              <span>{getPlatformIcon(topPerformer)}</span>
              <span>{topPerformer}</span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              ${platforms.find((p) => p.platform === topPerformer)?.totalEarnings.toLocaleString()}
              total
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/20">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-green-400" />
              <CardDescription className="text-slate-400">Most Consistent</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white flex items-center gap-2">
              <span>{getPlatformIcon(mostConsistent)}</span>
              <span>{mostConsistent}</span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              {platforms.find((p) => p.platform === mostConsistent)?.consistency}% consistency score
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/20">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-purple-400" />
              <CardDescription className="text-slate-400">Best Per-Trip</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              ${platforms[0]?.averagePerTrip.toFixed(2)}
            </div>
            <p className="text-xs text-slate-400 mt-1">{platforms[0]?.platform} average</p>
          </CardContent>
        </Card>
      </div>

      {/* Platform Comparison Table */}
      <Card className="bg-slate-900/50 border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Platform Performance Comparison</CardTitle>
          <CardDescription className="text-slate-400">
            Compare earnings, consistency, and trends across all platforms
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {platforms.map((platform, index) => {
              const color = getPlatformColor(platform.platform);
              const trendIcon =
                platform.trend === 'up' ? (
                  <TrendingUp className="w-4 h-4 text-green-400" />
                ) : platform.trend === 'down' ? (
                  <TrendingDown className="w-4 h-4 text-red-400" />
                ) : (
                  <Minus className="w-4 h-4 text-slate-400" />
                );

              const trendColor =
                platform.trend === 'up'
                  ? 'text-green-400'
                  : platform.trend === 'down'
                  ? 'text-red-400'
                  : 'text-slate-400';

              return (
                <div
                  key={platform.platform}
                  className="bg-slate-800/50 rounded-lg p-4 border border-white/5 hover:border-white/10 transition-all"
                >
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex items-center gap-3 flex-1">
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center text-2xl"
                        style={{ backgroundColor: `${color}20` }}
                      >
                        {getPlatformIcon(platform.platform)}
                      </div>
                      <div>
                        <h3 className="text-white font-bold">{platform.platform}</h3>
                        <p className="text-xs text-slate-400">
                          {platform.tripCount} trips • {platform.bestDays[0] || 'N/A'} peak day
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-xl font-bold text-white">
                        ${platform.totalEarnings.toLocaleString()}
                      </div>
                      <div className={`flex items-center gap-1 justify-end text-sm ${trendColor}`}>
                        {trendIcon}
                        <span>{Math.abs(platform.trendPercentage)}%</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-slate-400 text-xs mb-1">Avg per Trip</p>
                      <p className="text-white font-semibold">
                        ${platform.averagePerTrip.toFixed(2)}
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-400 text-xs mb-1">Consistency</p>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-slate-700 rounded-full h-2 overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                            style={{ width: `${platform.consistency}%` }}
                          ></div>
                        </div>
                        <span className="text-white font-semibold w-8">{platform.consistency}%</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-slate-400 text-xs mb-1">Best Hours</p>
                      <p className="text-white font-semibold text-xs">
                        {platform.bestHours[0] || 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Recommendations */}
      <Card className="bg-gradient-to-br from-blue-500/5 to-purple-500/5 border-white/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Target className="w-5 h-5 text-blue-400" />
            Personalized Recommendations
          </CardTitle>
          <CardDescription className="text-slate-400">
            Data-driven insights to maximize your earnings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recommendations.map((rec, index) => (
              <div
                key={index}
                className="flex gap-3 p-4 bg-slate-900/50 border border-blue-500/20 rounded-lg"
              >
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-sm font-bold">
                  {index + 1}
                </div>
                <p className="text-slate-200 text-sm leading-relaxed">{rec}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Best Times to Work */}
      <Card className="bg-slate-900/50 border-white/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Calendar className="w-5 h-5 text-purple-400" />
            Optimize Your Schedule
          </CardTitle>
          <CardDescription className="text-slate-400">
            Work these times to maximize earnings per hour
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            {platforms.slice(0, 4).map((platform) => (
              <div key={platform.platform} className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{getPlatformIcon(platform.platform)}</span>
                  <h4 className="text-white font-semibold">{platform.platform}</h4>
                </div>

                <div>
                  <p className="text-xs text-slate-400 mb-2">Best Days:</p>
                  <div className="flex flex-wrap gap-2">
                    {platform.bestDays.map((day) => (
                      <span
                        key={day}
                        className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs font-semibold"
                      >
                        {day}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-xs text-slate-400 mb-2">Peak Hours:</p>
                  <div className="flex flex-wrap gap-2">
                    {platform.bestHours.map((hour) => (
                      <span
                        key={hour}
                        className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-xs font-semibold"
                      >
                        {hour}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
