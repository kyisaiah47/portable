'use client';

import { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Minus, Award, Target, Clock, Calendar } from 'lucide-react';
import { analyzePlatformPerformance, getPlatformColor } from '@/lib/platform-insights';

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
      <Card className="border-white/10 shadow-none">
        <CardContent className="p-12 text-center">
          <Target className="w-9 h-9 text-slate-600 mx-auto mb-4" strokeWidth={1.5} />
          <h3 className="text-base font-semibold text-white mb-1">No platform data yet</h3>
          <p className="text-sm text-slate-400">Upload a bank statement to see detailed platform comparison insights</p>
        </CardContent>
      </Card>
    );
  }

  const { platforms, topPerformer, mostConsistent, recommendations } = analysis;

  return (
    <div className="space-y-6">
      {/* Top Performers */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card className="border-white/10 shadow-none">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-indigo-400" />
              <CardDescription className="text-[11px] font-medium uppercase tracking-wider text-slate-500">Top Earner</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold tracking-tight text-white">
              <span>{topPerformer}</span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              ${platforms.find((p) => p.platform === topPerformer)?.totalEarnings.toLocaleString()}
              total
            </p>
          </CardContent>
        </Card>

        <Card className="border-white/10 shadow-none">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-emerald-600" />
              <CardDescription className="text-[11px] font-medium uppercase tracking-wider text-slate-500">Most Consistent</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold tracking-tight text-white">
              <span>{mostConsistent}</span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              {platforms.find((p) => p.platform === mostConsistent)?.consistency}% consistency score
            </p>
          </CardContent>
        </Card>

        <Card className="border-white/10 shadow-none">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-indigo-400" />
              <CardDescription className="text-[11px] font-medium uppercase tracking-wider text-slate-500">Best Per-Trip</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold tracking-tight text-white">
              ${platforms[0]?.averagePerTrip.toFixed(2)}
            </div>
            <p className="text-xs text-slate-400 mt-1">{platforms[0]?.platform} average</p>
          </CardContent>
        </Card>
      </div>

      {/* Platform Comparison Table */}
      <Card className="border-white/10 shadow-none">
        <CardHeader>
          <CardTitle className="text-white text-sm font-semibold">Platform performance</CardTitle>
          <CardDescription className="text-slate-400">Earnings, consistency, and trends across platforms</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {platforms.map((platform, index) => {
              const color = getPlatformColor(platform.platform);
              const trendIcon =
                platform.trend === 'up' ? (
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                ) : platform.trend === 'down' ? (
                  <TrendingDown className="w-3.5 h-3.5 text-red-400" />
                ) : (
                  <Minus className="w-3.5 h-3.5 text-slate-500" />
                );

              const trendColor =
                platform.trend === 'up'
                  ? 'text-emerald-400'
                  : platform.trend === 'down'
                    ? 'text-red-400'
                    : 'text-slate-500';

              return (
                <div
                  key={platform.platform}
                  className="rounded-md border border-white/10 p-4 hover:bg-slate-800/60 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex items-center gap-3 flex-1">
                      <div
                        className="w-2 h-2 rounded-full shrink-0"
                        style={{ backgroundColor: color }}
                      ></div>
                      <div>
                        <h3 className="text-white font-medium text-sm">{platform.platform}</h3>
                        <p className="text-xs text-slate-400">
                          {platform.tripCount} trips • {platform.bestDays[0] || 'N/A'} peak day
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-base font-semibold text-white">
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
                      <p className="text-[11px] font-medium uppercase tracking-wider text-slate-500 mb-1">Avg per Trip</p>
                      <p className="text-white font-medium text-sm">
                        ${platform.averagePerTrip.toFixed(2)}
                      </p>
                    </div>
                    <div>
                      <p className="text-[11px] font-medium uppercase tracking-wider text-slate-500 mb-1">Consistency</p>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-slate-800 rounded-full h-1.5 overflow-hidden">
                          <div
                            className="h-full bg-indigo-400/70 rounded-full"
                            style={{ width: `${platform.consistency}%` }}
                          ></div>
                        </div>
                        <span className="text-white font-medium text-xs w-8">{platform.consistency}%</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-[11px] font-medium uppercase tracking-wider text-slate-500 mb-1">Best Hours</p>
                      <p className="text-white font-medium text-xs">
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
      <Card className="border-white/10 shadow-none">
        <CardHeader>
          <CardTitle className="text-white text-sm font-semibold flex items-center gap-2">
            <Target className="w-4 h-4 text-indigo-400" />
            Recommendations
          </CardTitle>
          <CardDescription className="text-slate-400">Data-driven ways to raise your earnings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recommendations.map((rec, index) => (
              <div
                key={index}
                className="flex gap-3 p-3.5 rounded-md border border-white/10"
              >
                <div className="flex-shrink-0 w-5 h-5 rounded-full bg-indigo-500/10 text-indigo-300 flex items-center justify-center text-xs font-semibold">
                  {index + 1}
                </div>
                <p className="text-slate-400 text-sm leading-relaxed">{rec}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Best Times to Work */}
      <Card className="border-white/10 shadow-none">
        <CardHeader>
          <CardTitle className="text-white text-sm font-semibold flex items-center gap-2"><Calendar className="w-4 h-4 text-indigo-400" />Optimize your schedule</CardTitle>
          <CardDescription className="text-slate-400">Work these times to maximize earnings per hour</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            {platforms.slice(0, 4).map((platform) => (
              <div key={platform.platform} className="space-y-3">
                <div className="flex items-center gap-2">
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: getPlatformColor(platform.platform) }}
                  ></span>
                  <h4 className="text-white font-medium text-sm">{platform.platform}</h4>
                </div>

                <div>
                  <p className="text-[11px] font-medium uppercase tracking-wider text-slate-500 mb-2">Best days</p>
                  <div className="flex flex-wrap gap-2">
                    {platform.bestDays.map((day) => (
                      <span
                        key={day}
                        className="px-2 py-0.5 bg-slate-800 text-slate-400 rounded text-xs font-medium"
                      >
                        {day}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-[11px] font-medium uppercase tracking-wider text-slate-500 mb-2">Peak hours</p>
                  <div className="flex flex-wrap gap-2">
                    {platform.bestHours.map((hour) => (
                      <span
                        key={hour}
                        className="px-2 py-0.5 bg-indigo-500/10 text-indigo-300 rounded text-xs font-medium"
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
