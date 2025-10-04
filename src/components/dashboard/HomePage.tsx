'use client';

import { DollarSign, Receipt, Shield, ArrowRight, Heart, PiggyBank, Briefcase, BarChart3, TrendingDown, Users, BookOpen, Wallet, Target, FileText, Calendar, Upload } from 'lucide-react';
import { getTips } from '@/lib/content-registry';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import {
  LineChart,
  Line,
} from 'recharts';
import { DashboardData } from '@/components/DashboardLayout';
import { HomePageSkeleton } from '@/components/LoadingSkeleton';
import CSVUpload from '@/components/CSVUpload';
import { useState } from 'react';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

interface HomePageProps {
  dashboardData: DashboardData;
  user: User;
}

export default function HomePage({ dashboardData, user }: HomePageProps) {
  const { parsedIncome } = dashboardData;
  const [showUpload, setShowUpload] = useState(!parsedIncome);
  const [refreshKey, setRefreshKey] = useState(0);

  // Show loading skeleton if no data yet
  if (!parsedIncome && !showUpload) {
    return <HomePageSkeleton />;
  }

  const handleUploadComplete = () => {
    setShowUpload(false);
    setRefreshKey(prev => prev + 1);
    window.location.reload(); // Refresh to show new data
  };

  return (
    <div className="space-y-8">
      {/* Hero message - SHORT AND PUNCHY */}
      <div className="bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 backdrop-blur-sm border border-white/10 rounded-lg p-8">
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-2 font-space-grotesk">
          You&apos;re crushing it, {user.firstName}
        </h1>
        <p className="text-base md:text-lg text-slate-300">
          {parsedIncome?.parsed?.totalIncome ? (
            <>
              ${parsedIncome.parsed.totalIncome.toLocaleString()} earned. Auto-saved ${Math.round(parsedIncome.parsed.totalIncome * 0.30).toLocaleString()} for taxes. Most people don&apos;t have their shit this together.
            </>
          ) : (
            <>
              Connect your bank to automatically track your earnings across all gig platforms in one place.
            </>
          )}
        </p>
      </div>

      {/* CSV Upload Section - Show when no data or on demand */}
      {(!parsedIncome || showUpload) && (
        <CSVUpload userId={user.id} onUploadComplete={handleUploadComplete} />
      )}

      {parsedIncome && !showUpload && (
        <div className="flex justify-end">
          <button
            onClick={() => setShowUpload(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-semibold transition-colors"
          >
            <Upload className="w-4 h-4" />
            Upload More Transactions
          </button>
        </div>
      )}

      {/* Dynamic Insights & Key Metrics */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Earnings Card */}
        <div className="bg-gradient-to-br from-blue-900/40 via-blue-900/20 to-slate-900/40 backdrop-blur-xl rounded-lg p-6 border border-blue-500/20">
          <div className="flex items-center justify-between mb-2">
            <DollarSign className="w-5 h-5 text-blue-400" />
            {parsedIncome?.stability.weeklyAverage && (
              <span className="text-xs text-blue-400 font-semibold">
                +{((parsedIncome.stability.weeklyAverage * 4 / (parsedIncome.parsed.totalIncome / (parsedIncome.parsed.income.length / 4))) * 100 - 100).toFixed(0)}%
              </span>
            )}
          </div>
          <div className="text-3xl font-black text-white font-space-grotesk mb-1">
            ${parsedIncome?.stability.weeklyAverage ? (parsedIncome.stability.weeklyAverage * 4).toFixed(0) : '0'}
          </div>
          <div className="text-xs text-slate-400 mb-3">Earned this month</div>

          {/* Mini Sparkline */}
          {parsedIncome?.parsed?.income && parsedIncome.parsed.income.length > 0 && (
            <div className="h-12 -mx-2">
              <ChartContainer
                config={{ income: { label: 'Income', color: '#3b82f6' } }}
                className="h-full w-full"
              >
                <LineChart
                  data={(() => {
                    // Get last 6 weeks of income
                    const weeklyData: Record<string, number> = {};
                    parsedIncome.parsed.income.forEach((item: any) => {
                      const date = new Date(item.date);
                      const weekStart = new Date(date);
                      weekStart.setDate(date.getDate() - date.getDay());
                      const key = weekStart.toLocaleDateString('en-US', { month: 'numeric', day: 'numeric' });
                      weeklyData[key] = (weeklyData[key] || 0) + item.amount;
                    });
                    return Object.entries(weeklyData)
                      .sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime())
                      .slice(-6)
                      .map(([week, amount]) => ({ week, amount }));
                  })()}
                >
                  <Line
                    type="monotone"
                    dataKey="amount"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ChartContainer>
            </div>
          )}
        </div>

        {/* Tax Readiness Card */}
        <div className="bg-gradient-to-br from-purple-900/40 via-purple-900/20 to-slate-900/40 backdrop-blur-xl rounded-lg p-6 border border-purple-500/20">
          <div className="flex items-center justify-between mb-2">
            <Receipt className="w-5 h-5 text-purple-400" />
            {parsedIncome?.stability?.weeklyAverage && (
              <span className="text-xs text-purple-400 font-semibold">
                {(((parsedIncome.stability.weeklyAverage * 4) * 0.25) / ((parsedIncome.stability.weeklyAverage * 4) * 0.30) * 100).toFixed(0)}%
              </span>
            )}
          </div>
          <div className="text-3xl font-black text-white font-space-grotesk mb-1">
            ${parsedIncome?.stability?.weeklyAverage ? ((parsedIncome.stability.weeklyAverage * 4) * 0.25).toFixed(0) : '0'}
          </div>
          <div className="text-xs text-slate-400">Set aside for taxes</div>
        </div>

        {/* Benefits Coverage Card */}
        <div className="bg-gradient-to-br from-pink-900/40 via-pink-900/20 to-slate-900/40 backdrop-blur-xl rounded-lg p-6 border border-pink-500/20">
          <div className="flex items-center justify-between mb-2">
            <Shield className="w-5 h-5 text-pink-400" />
            {parsedIncome?.stability?.weeklyAverage && (
              <span className="text-xs text-pink-400 font-semibold">
                {((parsedIncome.stability.weeklyAverage * 4 * 0.20) / (parsedIncome.stability.weeklyAverage * 4)).toFixed(1)} mo
              </span>
            )}
          </div>
          <div className="text-3xl font-black text-white font-space-grotesk mb-1">
            ${parsedIncome?.stability?.weeklyAverage ? ((parsedIncome.stability.weeklyAverage * 4) * 0.20).toFixed(0) : '0'}
          </div>
          <div className="text-xs text-slate-400">Emergency fund target</div>
        </div>

        {/* Next Deadline Card */}
        <div className="bg-gradient-to-br from-orange-900/40 via-orange-900/20 to-slate-900/40 backdrop-blur-xl rounded-lg p-6 border border-orange-500/20">
          <div className="flex items-center justify-between mb-2">
            <Calendar className="w-5 h-5 text-orange-400" />
            <span className="text-xs text-orange-400 font-semibold">
              {(() => {
                const now = new Date();
                const currentQuarter = Math.floor(now.getMonth() / 3) + 1;
                const nextQuarter = currentQuarter === 4 ? 1 : currentQuarter + 1;
                const year = nextQuarter === 1 ? now.getFullYear() + 1 : now.getFullYear();
                const deadlineMonth = [3, 6, 9, 0][nextQuarter - 1]; // Q1=Apr, Q2=Jun, Q3=Sep, Q4=Jan
                const deadlineDate = new Date(year, deadlineMonth, 15);
                const weeksAway = Math.ceil((deadlineDate.getTime() - now.getTime()) / (7 * 24 * 60 * 60 * 1000));
                return `${weeksAway} weeks`;
              })()}
            </span>
          </div>
          <div className="text-xl font-black text-white font-space-grotesk mb-1">
            Q{(() => {
              const now = new Date();
              const currentQuarter = Math.floor(now.getMonth() / 3) + 1;
              return currentQuarter === 4 ? 1 : currentQuarter + 1;
            })()} Taxes
          </div>
          <div className="text-xs text-slate-400">Next deadline</div>
        </div>
      </div>

      {/* Financial Pillars */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Earnings Stability Pillar */}
        <div className="bg-gradient-to-br from-slate-900/80 via-slate-900/50 to-slate-900/80 backdrop-blur-xl rounded-lg p-6 border border-white/10">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Earnings Stability</h3>
              <p className="text-xs text-slate-400">
                {parsedIncome ? 'Good' : 'No data'}
              </p>
            </div>
          </div>
          <p className="text-xs text-slate-300">
            {parsedIncome && parsedIncome.stability?.weeklyAverage
              ? `$${parsedIncome.stability.weeklyAverage.toFixed(0)}/week average • ${parsedIncome.stability.variability}% variability`
              : 'Upload income data to track stability'}
          </p>
        </div>

        {/* Tax Readiness Pillar */}
        <div className="bg-gradient-to-br from-slate-900/80 via-slate-900/50 to-slate-900/80 backdrop-blur-xl rounded-lg p-6 border border-white/10">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
              <Receipt className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Tax Readiness</h3>
              <p className="text-xs text-slate-400">On track</p>
            </div>
          </div>
          <p className="text-xs text-slate-300">Q3 deadline in 2 weeks • 68% of taxes set aside</p>
        </div>

        {/* Benefits Coverage Pillar */}
        <div className="bg-gradient-to-br from-slate-900/80 via-slate-900/50 to-slate-900/80 backdrop-blur-xl rounded-lg p-6 border border-white/10">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-pink-500/20 flex items-center justify-center">
              <Shield className="w-5 h-5 text-pink-400" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Benefits Coverage</h3>
              <p className="text-xs text-slate-400">Partial</p>
            </div>
          </div>
          <p className="text-xs text-slate-300">Emergency fund covers 1.2 months • Consider health insurance</p>
        </div>

        {/* Expenses & Deductions Pillar */}
        <div className="bg-gradient-to-br from-slate-900/80 via-slate-900/50 to-slate-900/80 backdrop-blur-xl rounded-lg p-6 border border-white/10">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
              <TrendingDown className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Expenses & Deductions</h3>
              <p className="text-xs text-slate-400">Optimized</p>
            </div>
          </div>
          <p className="text-xs text-slate-300">Tracking $1,240 in deductible expenses this month</p>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-white/10"></div>

      {/* Personalized Tips */}
      {parsedIncome && (() => {
        // Get filtered tips from centralized registry
        const tips = getTips([], []);

        const topTips = tips.slice(0, 6); // Show top 6 tips

        return (
          <div>
            <div className="mb-4">
              <h2 className="text-xl font-bold text-white font-space-grotesk">Personalized tips</h2>
              <p className="text-xs text-slate-400">Based on your income, platforms, and location</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {topTips.map((tip) => {
                const colorClasses = {
                  blue: 'border-blue-500/50 hover:border-blue-500',
                  green: 'border-green-500/50 hover:border-green-500',
                  purple: 'border-purple-500/50 hover:border-purple-500',
                  orange: 'border-orange-500/50 hover:border-orange-500',
                  red: 'border-red-500/50 hover:border-red-500',
                  yellow: 'border-yellow-500/50 hover:border-yellow-500',
                };

                return (
                  <div
                    key={tip.id}
                    className={`bg-slate-900/50 backdrop-blur-xl rounded-lg p-5 border border-white/10 ${colorClasses[tip.color as keyof typeof colorClasses]} transition-all cursor-pointer group`}
                  >
                    <div className="flex items-start space-x-3 mb-3">
                      <div className="text-2xl flex-shrink-0">{tip.icon}</div>
                      <div className="flex-1">
                        <h3 className="text-sm font-bold text-white mb-1 font-space-grotesk">{tip.title}</h3>
                        <p className="text-xs text-slate-400 leading-relaxed">{tip.description}</p>
                      </div>
                    </div>
                    {tip.action && (
                      <div className="flex items-center justify-between pt-3 border-t border-white/5">
                        <span className={`text-xs font-semibold text-${tip.color}-400`}>{tip.action}</span>
                        <ArrowRight className={`w-3 h-3 text-${tip.color}-400 group-hover:translate-x-1 transition-transform`} />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })()}

      {/* Divider */}
      <div className="border-t border-white/10"></div>

      {/* Recommended for you - TOP OF FEED */}
      <div>
        <div className="mb-4">
          <h2 className="text-lg font-bold text-white font-space-grotesk">Recommended for you</h2>
          <p className="text-xs text-slate-400">Quick actions to improve your financial health</p>
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
            <p className="text-xs text-slate-400 mb-2">Solo 401(k) designed for gig workers. Tax advantages + we&apos;ll auto-contribute based on your earnings.</p>
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
          <h2 className="text-xl font-bold text-white font-space-grotesk">Where your money&apos;s coming from</h2>
          <p className="text-sm text-slate-400">You&apos;re crushing it on Uber. DoorDash is solid. Upwork? You&apos;re leaving money on the table.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {parsedIncome?.parsed?.byPlatform && Array.from(parsedIncome.parsed.byPlatform.entries())
            .sort(([, a], [, b]) => b - a)
            .slice(0, 6)
            .map(([platform, amount], index) => {
              const percentage = ((amount / parsedIncome.parsed.totalIncome) * 100).toFixed(0);
              const colors = [
                { from: 'blue-400', to: 'blue-600', bg: 'blue-500' },
                { from: 'purple-400', to: 'purple-600', bg: 'purple-500' },
                { from: 'pink-400', to: 'pink-600', bg: 'pink-500' },
                { from: 'green-400', to: 'green-600', bg: 'green-500' },
                { from: 'orange-400', to: 'orange-600', bg: 'orange-500' },
                { from: 'cyan-400', to: 'cyan-600', bg: 'cyan-500' },
              ];
              const color = colors[index % colors.length];
              const emoji = platform.toLowerCase().includes('uber') ? '🚗' :
                           platform.toLowerCase().includes('door') ? '🍔' :
                           platform.toLowerCase().includes('lyft') ? '🚕' :
                           platform.toLowerCase().includes('instacart') ? '🛒' :
                           platform.toLowerCase().includes('upwork') || platform.toLowerCase().includes('freelance') ? '💼' :
                           platform.toLowerCase().includes('fiverr') ? '🎨' : '💰';

              return (
                <div key={platform} className={`bg-slate-900/50 backdrop-blur-xl rounded-lg p-5 border border-white/10 hover:border-${color.bg}/50 transition-all`}>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <div className="text-2xl">{emoji}</div>
                      <div>
                        <h3 className="text-base font-bold text-white font-space-grotesk">{platform}</h3>
                        <p className="text-xs text-slate-400">Income source</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-xl font-black bg-gradient-to-r from-${color.from} to-${color.to} bg-clip-text text-transparent font-space-grotesk`}>
                        ${amount.toFixed(0)}
                      </div>
                      <div className="text-xs text-slate-400">{percentage}% of income</div>
                    </div>
                  </div>
                  <div className="h-1.5 bg-slate-800 rounded-full mb-2 overflow-hidden">
                    <div className={`h-full bg-gradient-to-r from-${color.from} to-${color.to} rounded-full`} style={{width: `${percentage}%`}}></div>
                  </div>
                  <p className={`text-xs text-${color.from}`}>
                    {index === 0 && <><strong>Top earner!</strong> Keep up the great work</>}
                    {index === 1 && <><strong>Strong performer:</strong> Solid contribution to your income</>}
                    {index === 2 && <><strong>Good progress:</strong> Room to grow this source</>}
                    {index > 2 && <><strong>Emerging source:</strong> Consider scaling this up</>}
                  </p>
                </div>
              );
            })}
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
            {(() => {
              const score = parsedIncome?.stability?.score || 0;
              const healthScore = Math.min(100, Math.max(0, score));
              const rating = healthScore >= 80 ? 'Excellent' :
                            healthScore >= 60 ? 'Good' :
                            healthScore >= 40 ? 'Fair' : 'Needs work';
              const color = healthScore >= 80 ? 'green' :
                           healthScore >= 60 ? 'blue' :
                           healthScore >= 40 ? 'yellow' : 'red';

              return (
                <>
                  <div className={`w-16 h-16 rounded-full bg-gradient-to-br from-${color}-500/20 to-${color}-500/20 border-4 border-${color}-500/30 flex items-center justify-center`}>
                    <div className="text-xl font-black text-white font-space-grotesk">{healthScore}</div>
                  </div>
                  <div>
                    <div className="text-base font-bold text-white mb-1">{rating}</div>
                    <div className="text-xs text-slate-400">
                      {healthScore >= 60 ? `Better than ${healthScore}% of gig workers` : 'Room for improvement'}
                    </div>
                  </div>
                </>
              );
            })()}
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Income stability</span>
              <span className={(parsedIncome?.stability?.score ?? 0) >= 70 ? 'text-green-400 font-semibold' : 'text-yellow-400 font-semibold'}>
                {(parsedIncome?.stability?.score ?? 0) >= 70 ? '✓ Strong' : '⚠ Variable'}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Tax savings</span>
              <span className={parsedIncome?.stability?.weeklyAverage ? 'text-green-400 font-semibold' : 'text-yellow-400 font-semibold'}>
                {parsedIncome?.stability?.weeklyAverage ? '✓ On track' : '⚠ Needs setup'}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Emergency fund</span>
              <span className="text-yellow-400 font-semibold">⚠ Building</span>
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
            <h3 className="text-sm font-bold text-white mb-2 font-space-grotesk group-hover:text-purple-400 transition-colors">The gig worker&apos;s guide to health insurance</h3>
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
  );
}

// Import missing Globe icon
import { Globe } from 'lucide-react';
