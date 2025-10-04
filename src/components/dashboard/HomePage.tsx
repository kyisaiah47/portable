'use client';

import { DollarSign, Receipt, Shield, ArrowRight, Heart, PiggyBank, Briefcase, BarChart3, TrendingDown, Users, BookOpen, Wallet, Target, FileText, Calendar } from 'lucide-react';
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

      {/* Dynamic Insights & Key Metrics */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Earnings Card */}
        <div className="bg-gradient-to-br from-blue-900/40 via-blue-900/20 to-slate-900/40 backdrop-blur-xl rounded-lg p-6 border border-blue-500/20">
          <div className="flex items-center justify-between mb-2">
            <DollarSign className="w-5 h-5 text-blue-400" />
            <span className="text-xs text-blue-400 font-semibold">+12%</span>
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
            <span className="text-xs text-purple-400 font-semibold">68%</span>
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
            <span className="text-xs text-pink-400 font-semibold">1.2 mo</span>
          </div>
          <div className="text-3xl font-black text-white font-space-grotesk mb-1">
            $3,200
          </div>
          <div className="text-xs text-slate-400">Emergency fund</div>
        </div>

        {/* Next Deadline Card */}
        <div className="bg-gradient-to-br from-orange-900/40 via-orange-900/20 to-slate-900/40 backdrop-blur-xl rounded-lg p-6 border border-orange-500/20">
          <div className="flex items-center justify-between mb-2">
            <Calendar className="w-5 h-5 text-orange-400" />
            <span className="text-xs text-orange-400 font-semibold">2 weeks</span>
          </div>
          <div className="text-xl font-black text-white font-space-grotesk mb-1">
            Q3 Taxes
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
          {/* Uber */}
          <div className="bg-slate-900/50 backdrop-blur-xl rounded-lg p-5 border border-white/10 hover:border-blue-500/50 transition-all">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-2">
                <div className="text-2xl">🚗</div>
                <div>
                  <h3 className="text-base font-bold text-white font-space-grotesk">Uber</h3>
                  <p className="text-xs text-slate-400">Rideshare</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xl font-black bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent font-space-grotesk">$1,890</div>
                <div className="text-xs text-slate-400">44% of income</div>
              </div>
            </div>
            <div className="h-1.5 bg-slate-800 rounded-full mb-2 overflow-hidden">
              <div className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full" style={{width: '44%'}}></div>
            </div>
            <p className="text-xs text-blue-400"><strong>Your best hours:</strong> 5-9pm weekdays when surge hits</p>
          </div>

          {/* DoorDash */}
          <div className="bg-slate-900/50 backdrop-blur-xl rounded-lg p-5 border border-white/10 hover:border-purple-500/50 transition-all">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-2">
                <div className="text-2xl">🍔</div>
                <div>
                  <h3 className="text-base font-bold text-white font-space-grotesk">DoorDash</h3>
                  <p className="text-xs text-slate-400">Delivery</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xl font-black bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent font-space-grotesk">$1,290</div>
                <div className="text-xs text-slate-400">30% of income</div>
              </div>
            </div>
            <div className="h-1.5 bg-slate-800 rounded-full mb-2 overflow-hidden">
              <div className="h-full bg-gradient-to-r from-purple-500 to-purple-600 rounded-full" style={{width: '30%'}}></div>
            </div>
            <p className="text-xs text-purple-400"><strong>Pro tip:</strong> Downtown & university = stacked orders</p>
          </div>

          {/* Upwork */}
          <div className="bg-slate-900/50 backdrop-blur-xl rounded-lg p-5 border border-white/10 hover:border-pink-500/50 transition-all">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-2">
                <div className="text-2xl">💼</div>
                <div>
                  <h3 className="text-base font-bold text-white font-space-grotesk">Upwork</h3>
                  <p className="text-xs text-slate-400">Freelance</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xl font-black bg-gradient-to-r from-pink-400 to-pink-600 bg-clip-text text-transparent font-space-grotesk">$1,120</div>
                <div className="text-xs text-slate-400">26% of income</div>
              </div>
            </div>
            <div className="h-1.5 bg-slate-800 rounded-full mb-2 overflow-hidden">
              <div className="h-full bg-gradient-to-r from-pink-500 to-pink-600 rounded-full" style={{width: '26%'}}></div>
            </div>
            <p className="text-xs text-pink-400"><strong>Real talk:</strong> Bump your rate 15%. You&apos;re undercharging.</p>
          </div>
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
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-500/20 to-emerald-500/20 border-4 border-green-500/30 flex items-center justify-center">
              <div className="text-xl font-black text-white font-space-grotesk">78</div>
            </div>
            <div>
              <div className="text-base font-bold text-white mb-1">Looking good</div>
              <div className="text-xs text-slate-400">Better than 65% of gig workers</div>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Emergency fund</span>
              <span className="text-green-400 font-semibold">✓ On track</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Retirement</span>
              <span className="text-yellow-400 font-semibold">⚠ Needs work</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Health coverage</span>
              <span className="text-green-400 font-semibold">✓ Active</span>
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
