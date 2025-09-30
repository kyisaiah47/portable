'use client';

import { useState } from 'react';
import BenefitsMarketplace from './BenefitsMarketplace';
import { BarChart3, DollarSign, PiggyBank, Shield, LogOut, User, FileText, Zap, Globe, ArrowRight, Heart, Wallet, Briefcase, Receipt, BookOpen, Users, Target, Upload } from 'lucide-react';
import { SiUber, SiLyft, SiDoordash, SiInstacart, SiGrubhub, SiUbereats, SiUpwork, SiFiverr, SiFreelancer, SiToptal, SiYoutube, SiTwitch, SiPatreon, SiOnlyfans, SiSubstack, SiAirbnb } from 'react-icons/si';
import { parseTransactions, calculateStabilityScore, type Transaction } from '@/lib/income-parser';

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
  const [activeTab, setActiveTab] = useState('home');
  const [parsedIncome, setParsedIncome] = useState<any>(() => {
    // Load from localStorage on mount
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('parsedIncome');
      if (saved) {
        try {
          const data = JSON.parse(saved);
          // Reconstruct Date objects
          if (data?.parsed?.income) {
            data.parsed.income = data.parsed.income.map((item: any) => ({
              ...item,
              date: new Date(item.date),
            }));
          }
          if (data?.parsed?.startDate) {
            data.parsed.startDate = new Date(data.parsed.startDate);
          }
          if (data?.parsed?.endDate) {
            data.parsed.endDate = new Date(data.parsed.endDate);
          }
          return data;
        } catch (e) {
          console.error('Error loading parsed income from localStorage:', e);
        }
      }
    }
    return null;
  });

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('parsedIncome');
    onLogout();
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const lines = text.split('\n');
      const transactions: Transaction[] = [];

      // Skip header
      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        const [date, description, amount, type] = line.split(',');
        if (date && description && amount && type) {
          transactions.push({
            id: `${i}`,
            date: new Date(date),
            description,
            amount: parseFloat(amount),
            type: type.trim() as 'credit' | 'debit',
          });
        }
      }

      const parsed = parseTransactions(transactions);
      const stability = calculateStabilityScore(parsed.income);
      const incomeData = { parsed, stability };

      // Save to localStorage
      setParsedIncome(incomeData);
      localStorage.setItem('parsedIncome', JSON.stringify(incomeData));
    };

    reader.readAsText(file);
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
                  { id: 'home', label: 'Home', icon: BarChart3 },
                  { id: 'income', label: 'Income', icon: DollarSign },
                  { id: 'benefits', label: 'Benefits', icon: Shield },
                  { id: 'taxes', label: 'Taxes', icon: FileText },
                  { id: 'learn', label: 'Learn', icon: BookOpen }
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

        {activeTab === 'home' && (
          <div className="space-y-8">
            {/* Hero message - SHORT AND PUNCHY */}
            <div className="bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 backdrop-blur-sm border border-white/10 rounded-lg p-8">
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-2 font-space-grotesk">
                You&apos;re crushing it, {user.firstName}
              </h1>
              <p className="text-base md:text-lg text-slate-300">
                {parsedIncome
                  ? `$${parsedIncome.parsed.totalIncome.toLocaleString()} earned. Auto-saved ${Math.round(parsedIncome.parsed.totalIncome * 0.30).toLocaleString()} for taxes.`
                  : '$4,300 earned this month. Auto-saved $876 for benefits and $1,075 for taxes.'
                } Most people don&apos;t have their shit this together.
              </p>
            </div>

            {/* Financial Health Score */}
            <div>
              <div className="mb-4">
                <h2 className="text-xl font-bold text-white font-space-grotesk">Financial Health Score</h2>
                <p className="text-xs text-slate-400">Your complete financial picture at a glance</p>
              </div>

              {(() => {
                // Calculate health score components
                const incomeScore = parsedIncome?.stability.score || 0;
                const taxScore = parsedIncome ? 30 : 0; // 30 points if they have income data uploaded
                const benefitsScore = 0; // TODO: Track enrolled benefits
                const totalScore = Math.min(100, incomeScore + taxScore + benefitsScore);

                const getRating = (score: number) => {
                  if (score >= 80) return { label: 'Excellent', color: 'green' };
                  if (score >= 60) return { label: 'Good', color: 'blue' };
                  if (score >= 40) return { label: 'Fair', color: 'yellow' };
                  return { label: 'Needs Work', color: 'red' };
                };

                const rating = getRating(totalScore);
                const colorClasses = {
                  green: 'from-green-500 to-emerald-600',
                  blue: 'from-blue-500 to-blue-600',
                  yellow: 'from-yellow-500 to-orange-600',
                  red: 'from-red-500 to-red-600',
                };

                return (
                  <div className="bg-gradient-to-br from-slate-900/80 via-slate-900/50 to-slate-900/80 backdrop-blur-xl rounded-lg p-8 border border-white/10">
                    <div className="flex flex-col md:flex-row items-center gap-8">
                      {/* Score circle */}
                      <div className="relative">
                        <svg className="transform -rotate-90 w-40 h-40">
                          <circle
                            cx="80"
                            cy="80"
                            r="70"
                            stroke="currentColor"
                            strokeWidth="12"
                            fill="transparent"
                            className="text-slate-800"
                          />
                          <circle
                            cx="80"
                            cy="80"
                            r="70"
                            stroke="url(#gradient)"
                            strokeWidth="12"
                            fill="transparent"
                            strokeDasharray={`${2 * Math.PI * 70}`}
                            strokeDashoffset={`${2 * Math.PI * 70 * (1 - totalScore / 100)}`}
                            className="transition-all duration-1000 ease-out"
                            strokeLinecap="round"
                          />
                          <defs>
                            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                              <stop offset="0%" className="text-blue-500" stopColor="currentColor" />
                              <stop offset="100%" className="text-purple-600" stopColor="currentColor" />
                            </linearGradient>
                          </defs>
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <div className="text-5xl font-black text-white font-space-grotesk">{totalScore}</div>
                          <div className="text-xs text-slate-400">/ 100</div>
                        </div>
                      </div>

                      {/* Score breakdown */}
                      <div className="flex-1 w-full">
                        <div className="mb-6">
                          <div className={`inline-block px-4 py-2 rounded-full bg-gradient-to-r ${colorClasses[rating.color]} text-white font-bold text-sm mb-2`}>
                            {rating.label}
                          </div>
                          <p className="text-slate-300 text-sm">
                            {totalScore >= 80 && "You're crushing it! Your financial foundation is rock solid."}
                            {totalScore >= 60 && totalScore < 80 && "You're doing well! A few improvements will get you to excellent."}
                            {totalScore >= 40 && totalScore < 60 && "You're on the right track. Focus on the items below to improve."}
                            {totalScore < 40 && "Let's build your financial foundation. Start with income tracking."}
                          </p>
                        </div>

                        <div className="space-y-4">
                          {/* Income stability */}
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center space-x-2">
                                <BarChart3 className="w-4 h-4 text-blue-400" />
                                <span className="text-sm font-semibold text-white">Income Stability</span>
                              </div>
                              <span className="text-sm font-bold text-slate-300">{incomeScore}/40</span>
                            </div>
                            <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-1000"
                                style={{ width: `${(incomeScore / 40) * 100}%` }}
                              ></div>
                            </div>
                          </div>

                          {/* Tax readiness */}
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center space-x-2">
                                <Receipt className="w-4 h-4 text-purple-400" />
                                <span className="text-sm font-semibold text-white">Tax Readiness</span>
                              </div>
                              <span className="text-sm font-bold text-slate-300">{taxScore}/30</span>
                            </div>
                            <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-purple-500 to-purple-600 rounded-full transition-all duration-1000"
                                style={{ width: `${(taxScore / 30) * 100}%` }}
                              ></div>
                            </div>
                          </div>

                          {/* Benefits coverage */}
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center space-x-2">
                                <Shield className="w-4 h-4 text-pink-400" />
                                <span className="text-sm font-semibold text-white">Benefits Coverage</span>
                              </div>
                              <span className="text-sm font-bold text-slate-300">{benefitsScore}/30</span>
                            </div>
                            <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-pink-500 to-pink-600 rounded-full transition-all duration-1000"
                                style={{ width: `${(benefitsScore / 30) * 100}%` }}
                              ></div>
                            </div>
                            {benefitsScore === 0 && (
                              <p className="text-xs text-slate-400 mt-1">
                                <span className="text-pink-400 font-semibold">+30 points available:</span> Add health coverage to boost your score
                              </p>
                            )}
                          </div>
                        </div>

                        {totalScore < 100 && (
                          <div className="mt-6 pt-6 border-t border-white/10">
                            <p className="text-xs font-semibold text-slate-400 mb-2">NEXT MILESTONE</p>
                            <p className="text-sm text-white">
                              {!parsedIncome && "Upload your bank statement to calculate your stability score → +40 points"}
                              {parsedIncome && benefitsScore === 0 && "Add health insurance to reach 'Excellent' status → +30 points"}
                              {parsedIncome && totalScore >= 70 && totalScore < 100 && "You're almost there! Keep building your safety net."}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Divider */}
            <div className="border-t border-white/10"></div>

            {/* Recommended for you - TOP OF FEED */}
            <div>
              <div className="mb-4">
                <h2 className="text-lg font-bold text-white font-space-grotesk">Recommended for you</h2>
                <p className="text-xs text-slate-400">Personalized based on your activity</p>
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
        )}

        {activeTab === 'income' && (
          <div className="space-y-8">
            {/* Hero greeting with upload */}
            <div className="bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 backdrop-blur-sm border border-white/10 rounded-lg p-8">
              <div className="flex items-start justify-between gap-6">
                <div className="flex-1">
                  <h1 className="text-2xl md:text-3xl font-bold text-white mb-2 font-space-grotesk">
                    Where your money&apos;s coming from
                  </h1>
                  <p className="text-base md:text-lg text-slate-300">
                    Track every dollar across platforms. See your patterns. Get personalized tips to earn more.
                  </p>
                </div>
                <label className="cursor-pointer flex-shrink-0">
                  <input
                    type="file"
                    accept=".csv"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <div className="bg-slate-900/80 backdrop-blur-xl rounded-lg p-3 border border-white/20 hover:border-blue-500/50 hover:bg-slate-800 transition-all text-center max-w-[120px]">
                    <Upload className="w-5 h-5 text-blue-400 mx-auto mb-1" />
                    <p className="text-xs font-semibold text-white mb-0.5">Upload CSV</p>
                    <p className="text-[10px] text-slate-400 leading-tight">Parse your bank statement</p>
                  </div>
                </label>
              </div>
            </div>

            {/* Explainer text */}
            <div className="space-y-4 text-base text-slate-300 leading-relaxed">
              <p>
                Connect your gig platforms and we&apos;ll automatically track <span className="bg-gradient-to-r from-blue-400 to-blue-500 bg-clip-text text-transparent font-semibold">all your income in one place</span>. No more logging into five different apps to see what you made this month. We pull everything together—Uber, DoorDash, Upwork, Fiverr, Instacart, and 50+ other platforms—into a single unified timeline.
              </p>
              <p>
                We analyze your earning patterns across every platform you work on, calculate your <span className="bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent font-semibold">safe-to-spend amount</span> after taxes and expenses, and give you a <span className="bg-gradient-to-r from-purple-400 to-purple-500 bg-clip-text text-transparent font-semibold">stability score</span> based on consistency and diversification. Think of it as a financial health check designed specifically for gig workers.
              </p>
              <p>
                Here&apos;s the data: <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent font-semibold">top earners work 3+ platforms simultaneously</span> to maximize income and improve their stability scores. Multi-platform workers earn 40% more on average and have significantly better income stability during slow periods. We&apos;ll show you personalized tips to boost your earnings based on your city, work schedule, and income mix.
              </p>
            </div>

            {/* Divider */}
            <div className="border-t border-white/10 mt-8"></div>

            {/* Parsed Results */}
            {parsedIncome && (
              <>
                {/* Stats Cards */}
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 backdrop-blur-xl rounded-lg p-5 border border-green-500/20">
                    <div className="text-xs text-green-400 mb-1 font-semibold">Total Income Detected</div>
                    <div className="text-3xl font-black text-white font-space-grotesk">
                      ${parsedIncome.parsed.totalIncome.toFixed(2)}
                    </div>
                    <div className="text-xs text-slate-400 mt-1">{parsedIncome.parsed.income.length} payments</div>
                  </div>
                  <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 backdrop-blur-xl rounded-lg p-5 border border-blue-500/20">
                    <div className="text-xs text-blue-400 mb-1 font-semibold">Platforms Found</div>
                    <div className="text-3xl font-black text-white font-space-grotesk">
                      {parsedIncome.parsed.byPlatform.size}
                    </div>
                    <div className="text-xs text-slate-400 mt-1">
                      {Array.from(parsedIncome.parsed.byPlatform.keys()).slice(0, 3).join(', ')}
                      {parsedIncome.parsed.byPlatform.size > 3 && '...'}
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-xl rounded-lg p-5 border border-purple-500/20">
                    <div className="text-xs text-purple-400 mb-1 font-semibold">Stability Score</div>
                    <div className="text-3xl font-black text-white font-space-grotesk">
                      {parsedIncome.stability.score}/100
                    </div>
                    <div className="text-xs text-slate-400 mt-1 uppercase font-semibold">{parsedIncome.stability.rating}</div>
                  </div>
                </div>

                {/* Platform Breakdown */}
                <div>
                  <div className="mb-4">
                    <h2 className="text-xl font-bold text-white font-space-grotesk">Detected platforms</h2>
                    <p className="text-xs text-slate-400">Income breakdown by platform</p>
                  </div>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Array.from(parsedIncome.parsed.byPlatform.entries())
                      .map((entry) => {
                        const [platform, payments] = entry as [string, any[]];
                        return {
                          platform,
                          payments,
                          total: payments.reduce((sum: number, p: any) => sum + p.amount, 0),
                          count: payments.length,
                          category: payments[0]?.category || 'other',
                        };
                      })
                      .sort((a, b) => b.total - a.total)
                      .map(({ platform, total, count, category }) => {
                        // Map platforms to brand icons
                        const platformIconMap: Record<string, any> = {
                          'Uber': SiUber,
                          'Lyft': SiLyft,
                          'DoorDash': SiDoordash,
                          'Instacart': SiInstacart,
                          'Grubhub': SiGrubhub,
                          'Uber Eats': SiUbereats,
                          'Upwork': SiUpwork,
                          'Fiverr': SiFiverr,
                          'Freelancer': SiFreelancer,
                          'Toptal': SiToptal,
                          'YouTube': SiYoutube,
                          'Twitch': SiTwitch,
                          'Patreon': SiPatreon,
                          'OnlyFans': SiOnlyfans,
                          'Substack': SiSubstack,
                          'Airbnb': SiAirbnb,
                        };

                        // Fallback category icons
                        const categoryIconMap: Record<string, any> = {
                          'rideshare': DollarSign,
                          'delivery': Receipt,
                          'freelance': Briefcase,
                          'creator': Target,
                          'rental': Globe,
                          'other': DollarSign,
                        };

                        const IconComponent = platformIconMap[platform] || categoryIconMap[category];

                        return (
                          <div key={platform} className="bg-slate-900/50 backdrop-blur-xl rounded-lg p-5 border border-white/10">
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex items-center space-x-2">
                                <div className="w-10 h-10 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg flex items-center justify-center">
                                  <IconComponent className="w-5 h-5 text-blue-400" />
                                </div>
                                <div>
                                  <h3 className="text-base font-bold text-white font-space-grotesk">{platform}</h3>
                                  <p className="text-xs text-slate-400">{count} payments</p>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-xl font-black bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent font-space-grotesk">
                                  ${total.toFixed(2)}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              </>
            )}

            {/* Divider */}
            <div className="border-t border-white/10"></div>

            {/* Unified Income Timeline */}
            <div>
              <div className="mb-4">
                <h2 className="text-xl font-bold text-white font-space-grotesk">Unified income timeline</h2>
                <p className="text-xs text-slate-400">See all your earnings in one place, month by month</p>
              </div>
              <div className="bg-slate-900/50 backdrop-blur-xl rounded-lg p-5 border border-white/10">
                <div className="space-y-4">
                  {/* June */}
                  <div className="border-b border-white/10 pb-4 last:border-0 last:pb-0">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-base font-bold text-white font-space-grotesk">June 2024</h3>
                      <div className="text-xl font-black bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent font-space-grotesk">$4,300</div>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="text-xs">
                        <div className="text-slate-400">Uber</div>
                        <div className="text-white font-semibold">$1,890</div>
                      </div>
                      <div className="text-xs">
                        <div className="text-slate-400">DoorDash</div>
                        <div className="text-white font-semibold">$1,290</div>
                      </div>
                      <div className="text-xs">
                        <div className="text-slate-400">Upwork</div>
                        <div className="text-white font-semibold">$1,120</div>
                      </div>
                    </div>
                  </div>

                  {/* May */}
                  <div className="border-b border-white/10 pb-4 last:border-0 last:pb-0">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-base font-bold text-white font-space-grotesk">May 2024</h3>
                      <div className="text-xl font-black bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent font-space-grotesk">$3,900</div>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="text-xs">
                        <div className="text-slate-400">Uber</div>
                        <div className="text-white font-semibold">$1,750</div>
                      </div>
                      <div className="text-xs">
                        <div className="text-slate-400">DoorDash</div>
                        <div className="text-white font-semibold">$1,200</div>
                      </div>
                      <div className="text-xs">
                        <div className="text-slate-400">Upwork</div>
                        <div className="text-white font-semibold">$950</div>
                      </div>
                    </div>
                  </div>

                  {/* April */}
                  <div className="border-b border-white/10 pb-4 last:border-0 last:pb-0">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-base font-bold text-white font-space-grotesk">April 2024</h3>
                      <div className="text-xl font-black bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent font-space-grotesk">$4,100</div>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="text-xs">
                        <div className="text-slate-400">Uber</div>
                        <div className="text-white font-semibold">$1,920</div>
                      </div>
                      <div className="text-xs">
                        <div className="text-slate-400">DoorDash</div>
                        <div className="text-white font-semibold">$1,350</div>
                      </div>
                      <div className="text-xs">
                        <div className="text-slate-400">Upwork</div>
                        <div className="text-white font-semibold">$830</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-white/10"></div>

            {/* Safe-to-Spend Calculator */}
            <div>
              <div className="mb-4">
                <h2 className="text-xl font-bold text-white font-space-grotesk">Safe-to-spend calculator</h2>
                <p className="text-xs text-slate-400">Real talk: Here&apos;s what you actually have to spend this month</p>
              </div>
              <div className="bg-slate-900/50 backdrop-blur-xl rounded-lg p-5 border border-white/10">
                <div className="space-y-4">
                  {/* Gross */}
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-bold text-white font-space-grotesk">Gross Income</h3>
                      <p className="text-xs text-slate-400">All platforms combined</p>
                    </div>
                    <div className="text-xl font-black text-white font-space-grotesk">$4,300</div>
                  </div>

                  <div className="border-t border-white/10"></div>

                  {/* Tax set-aside */}
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-bold text-white font-space-grotesk">Tax Set-Aside (28%)</h3>
                      <p className="text-xs text-slate-400">Auto-saved for quarterly payments</p>
                    </div>
                    <div className="text-xl font-black text-orange-400 font-space-grotesk">-$1,204</div>
                  </div>

                  <div className="border-t border-white/10"></div>

                  {/* Business expenses */}
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-bold text-white font-space-grotesk">Business Expenses</h3>
                      <p className="text-xs text-slate-400">Gas, phone, car maintenance</p>
                    </div>
                    <div className="text-xl font-black text-red-400 font-space-grotesk">-$540</div>
                  </div>

                  <div className="border-t border-white/10"></div>

                  {/* Net income */}
                  <div className="flex items-center justify-between bg-gradient-to-br from-green-500/10 via-emerald-500/10 to-green-500/10 rounded-lg p-4 border border-green-500/30">
                    <div>
                      <h3 className="text-lg font-black text-white font-space-grotesk">Safe to Spend</h3>
                      <p className="text-xs text-green-400">Your actual take-home</p>
                    </div>
                    <div className="text-2xl font-black bg-gradient-to-r from-green-400 to-emerald-600 bg-clip-text text-transparent font-space-grotesk">$2,556</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-white/10"></div>

            {/* Income stability score */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-slate-900/50 backdrop-blur-xl rounded-lg p-5 border border-white/10">
                <div className="mb-4">
                  <h2 className="text-lg font-bold text-white font-space-grotesk">Income stability score</h2>
                  <p className="text-xs text-slate-400">Based on consistency & diversification</p>
                </div>
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 border-4 border-blue-500/30 flex items-center justify-center">
                    <div className="text-2xl font-black text-white font-space-grotesk">78</div>
                  </div>
                  <div>
                    <div className="text-base font-bold text-white mb-1">Strong & steady</div>
                    <div className="text-xs text-slate-400">Better than 65% of users</div>
                  </div>
                </div>
                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full" style={{width: '78%'}}></div>
                </div>
              </div>

              {/* Quick tip */}
              <div className="bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 backdrop-blur-sm border border-white/10 rounded-lg p-5">
                <div className="flex items-start space-x-3 mb-3">
                  <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Zap className="w-4 h-4 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white font-space-grotesk mb-2">Boost your score</h3>
                    <p className="text-sm text-slate-300">Adding Instacart could add $800/mo and bump your stability score to 85+. Multi-platform workers earn 40% more on average.</p>
                  </div>
                </div>
                <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 px-4 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity">
                  Connect Instacart
                </button>
              </div>
            </div>
          </div>
        )}
        {activeTab === 'benefits' && <BenefitsMarketplace />}

        {activeTab === 'taxes' && (
          <div className="space-y-8">
            {/* Hero message */}
            <div className="bg-gradient-to-br from-orange-500/10 via-yellow-500/10 to-orange-500/10 backdrop-blur-sm border border-white/10 rounded-lg p-8">
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-2 font-space-grotesk">
                Stay ahead of tax season
              </h1>
              <p className="text-base md:text-lg text-slate-300">
                Set aside the right amount each month. Track every deduction. Never get caught off guard.
              </p>
            </div>

            {/* Explainer text */}
            <div className="space-y-4 text-base text-slate-300 leading-relaxed">
              <p>
                When you work for yourself, <span className="bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent font-semibold">you&apos;re responsible for quarterly estimated taxes</span>. Miss a payment and you&apos;ll owe penalties. Underpay and you&apos;ll get hit with a surprise bill in April. But here&apos;s the problem: most gig workers have no idea how much to set aside, when to pay, or what they can deduct.
              </p>
              <p>
                We automatically calculate your <span className="bg-gradient-to-r from-blue-400 to-blue-500 bg-clip-text text-transparent font-semibold">quarterly estimates</span> based on your actual income across all platforms. We scan your expenses to find <span className="bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent font-semibold">every deduction you&apos;re eligible for</span>—and we do it by gig type, because rideshare drivers have different write-offs than freelancers. Mileage for Uber drivers. Software subscriptions for Upwork designers. Hot bags for DoorDash couriers. Equipment for creators. We track it all.
              </p>
              <p>
                Our <span className="bg-gradient-to-r from-purple-400 to-purple-500 bg-clip-text text-transparent font-semibold">missed deduction detector</span> scans your transactions and flags expenses you might not have realized were deductible. The average Portable user saves <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent font-semibold">$2,800 per year</span> by maximizing deductions and avoiding penalties. We send you reminders before deadlines, auto-calculate what you owe, and even show you smart nudges based on your specific situation.
              </p>
              <p>
                Tax season doesn&apos;t have to be scary. With the right tools, it&apos;s just another Tuesday.
              </p>
            </div>

            {/* Divider */}
            <div className="border-t border-white/10 mt-8"></div>

            {/* Quarterly estimates - Keep floating gradient cards */}
            <div>
              <div className="mb-4">
                <h2 className="text-xl font-bold text-white font-space-grotesk">Quarterly estimates</h2>
                <p className="text-xs text-slate-400">
                  {parsedIncome
                    ? `Based on ${parsedIncome.parsed.totalIncome.toLocaleString('en-US', { style: 'currency', currency: 'USD' })} total income. ~30% set aside recommended.`
                    : 'Auto-calculated based on your income. We remind you before deadlines.'
                  }
                </p>
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                {(() => {
                  // Calculate quarterly estimates (30% of income divided by 4)
                  const totalIncome = parsedIncome?.parsed.totalIncome || 14200;
                  const annualizedIncome = totalIncome * 4; // Assume current period represents 1 quarter
                  const quarterlyTax = (annualizedIncome * 0.30) / 4;

                  const quarters = [
                    { name: 'Q1 2024', due: 'April 15', color: 'orange', isPast: true },
                    { name: 'Q2 2024', due: 'June 15', color: 'blue', isPast: false },
                    { name: 'Q3 2024', due: 'Sept 15', color: 'purple', isPast: false },
                  ];

                  return quarters.map((quarter) => {
                    const colorClasses = {
                      orange: {
                        blur: 'from-orange-500 to-red-600',
                        bg: 'from-orange-600 to-red-700',
                        border: 'border-orange-400/50',
                        text: 'text-orange-200',
                      },
                      blue: {
                        blur: 'from-blue-500 to-blue-600',
                        bg: 'from-blue-600 to-blue-700',
                        border: 'border-blue-400/50',
                        text: 'text-blue-200',
                      },
                      purple: {
                        blur: 'from-purple-500 to-purple-600',
                        bg: 'from-purple-600 to-purple-700',
                        border: 'border-purple-400/50',
                        text: 'text-purple-200',
                      },
                    }[quarter.color];

                    return (
                      <div key={quarter.name} className="group relative">
                        <div className={`absolute inset-0 bg-gradient-to-br ${colorClasses.blur} rounded-lg blur opacity-50 group-hover:opacity-75 transition-opacity`}></div>
                        <div className={`relative bg-gradient-to-br ${colorClasses.bg} rounded-lg p-8 border ${colorClasses.border} transform group-hover:-translate-y-1 transition-transform`}>
                          <div className={`text-xs ${colorClasses.text} font-semibold mb-2 uppercase tracking-wider`}>{quarter.name}</div>
                          <div className="text-4xl font-black text-white mb-2 font-space-grotesk">
                            ${Math.round(quarterlyTax).toLocaleString()}
                          </div>
                          <div className={`${colorClasses.text} text-sm mb-4`}>Due {quarter.due}</div>
                          {quarter.isPast ? (
                            <button className="w-full bg-white text-orange-700 py-2 px-4 rounded-lg text-sm font-bold hover:opacity-90 transition-opacity">
                              Pay Now
                            </button>
                          ) : (
                            <button className="w-full bg-white/20 backdrop-blur-sm text-white py-2 px-4 rounded-lg text-sm font-bold hover:bg-white/30 transition-colors border border-white/30">
                              Set Reminder
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  });
                })()}
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-white/10"></div>

            {/* Missed Deductions Detector */}
            <div>
              <div className="mb-4">
                <h2 className="text-xl font-bold text-white font-space-grotesk">Missed deductions detector</h2>
                <p className="text-xs text-slate-400">We found $2,340 in potential write-offs based on your work type</p>
              </div>

              {/* Rideshare deductions */}
              <div className="mb-6">
                <h3 className="text-base font-bold text-white mb-3 font-space-grotesk flex items-center space-x-2">
                  <span>🚗</span>
                  <span>Rideshare (Uber)</span>
                </h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-slate-900/50 backdrop-blur-xl rounded-lg p-5 border border-white/10">
                    <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center mb-3">
                      <Receipt className="w-4 h-4 text-blue-400" />
                    </div>
                    <h4 className="text-sm font-bold text-white mb-1 font-space-grotesk">Mileage</h4>
                    <p className="text-xs text-slate-400 mb-2">$0.67/mile deduction</p>
                    <div className="text-lg font-black bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent font-space-grotesk">$1,240</div>
                  </div>

                  <div className="bg-slate-900/50 backdrop-blur-xl rounded-lg p-5 border border-white/10">
                    <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center mb-3">
                      <Receipt className="w-4 h-4 text-purple-400" />
                    </div>
                    <h4 className="text-sm font-bold text-white mb-1 font-space-grotesk">Gas & Tolls</h4>
                    <p className="text-xs text-slate-400 mb-2">Fuel & bridge tolls</p>
                    <div className="text-lg font-black bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent font-space-grotesk">$420</div>
                  </div>

                  <div className="bg-slate-900/50 backdrop-blur-xl rounded-lg p-5 border border-white/10">
                    <div className="w-8 h-8 bg-pink-500/20 rounded-lg flex items-center justify-center mb-3">
                      <Receipt className="w-4 h-4 text-pink-400" />
                    </div>
                    <h4 className="text-sm font-bold text-white mb-1 font-space-grotesk">Car Maintenance</h4>
                    <p className="text-xs text-slate-400 mb-2">Oil, repairs, washes</p>
                    <div className="text-lg font-black bg-gradient-to-r from-pink-400 to-pink-600 bg-clip-text text-transparent font-space-grotesk">$380</div>
                  </div>

                  <div className="bg-slate-900/50 backdrop-blur-xl rounded-lg p-5 border border-white/10">
                    <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center mb-3">
                      <Receipt className="w-4 h-4 text-green-400" />
                    </div>
                    <h4 className="text-sm font-bold text-white mb-1 font-space-grotesk">Phone Bill</h4>
                    <p className="text-xs text-slate-400 mb-2">Business use portion</p>
                    <div className="text-lg font-black bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent font-space-grotesk">$180</div>
                  </div>
                </div>
              </div>

              {/* Delivery deductions */}
              <div className="mb-6">
                <h3 className="text-base font-bold text-white mb-3 font-space-grotesk flex items-center space-x-2">
                  <span>🍔</span>
                  <span>Delivery (DoorDash)</span>
                </h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="bg-slate-900/50 backdrop-blur-xl rounded-lg p-5 border border-white/10">
                    <div className="w-8 h-8 bg-orange-500/20 rounded-lg flex items-center justify-center mb-3">
                      <Receipt className="w-4 h-4 text-orange-400" />
                    </div>
                    <h4 className="text-sm font-bold text-white mb-1 font-space-grotesk">Mileage</h4>
                    <p className="text-xs text-slate-400 mb-2">$0.67/mile deduction</p>
                    <div className="text-lg font-black bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent font-space-grotesk">$680</div>
                  </div>

                  <div className="bg-slate-900/50 backdrop-blur-xl rounded-lg p-5 border border-white/10">
                    <div className="w-8 h-8 bg-red-500/20 rounded-lg flex items-center justify-center mb-3">
                      <Receipt className="w-4 h-4 text-red-400" />
                    </div>
                    <h4 className="text-sm font-bold text-white mb-1 font-space-grotesk">Hot Bags</h4>
                    <p className="text-xs text-slate-400 mb-2">Insulated gear</p>
                    <div className="text-lg font-black bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent font-space-grotesk">$45</div>
                  </div>

                  <div className="bg-slate-900/50 backdrop-blur-xl rounded-lg p-5 border border-white/10">
                    <div className="w-8 h-8 bg-yellow-500/20 rounded-lg flex items-center justify-center mb-3">
                      <Receipt className="w-4 h-4 text-yellow-400" />
                    </div>
                    <h4 className="text-sm font-bold text-white mb-1 font-space-grotesk">Parking</h4>
                    <p className="text-xs text-slate-400 mb-2">Meters & lots</p>
                    <div className="text-lg font-black bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent font-space-grotesk">$120</div>
                  </div>
                </div>
              </div>

              {/* Freelance deductions */}
              <div>
                <h3 className="text-base font-bold text-white mb-3 font-space-grotesk flex items-center space-x-2">
                  <span>💼</span>
                  <span>Freelance (Upwork)</span>
                </h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-slate-900/50 backdrop-blur-xl rounded-lg p-5 border border-white/10">
                    <div className="w-8 h-8 bg-indigo-500/20 rounded-lg flex items-center justify-center mb-3">
                      <Receipt className="w-4 h-4 text-indigo-400" />
                    </div>
                    <h4 className="text-sm font-bold text-white mb-1 font-space-grotesk">Software</h4>
                    <p className="text-xs text-slate-400 mb-2">Adobe, Canva, tools</p>
                    <div className="text-lg font-black bg-gradient-to-r from-indigo-400 to-indigo-600 bg-clip-text text-transparent font-space-grotesk">$340</div>
                  </div>

                  <div className="bg-slate-900/50 backdrop-blur-xl rounded-lg p-5 border border-white/10">
                    <div className="w-8 h-8 bg-violet-500/20 rounded-lg flex items-center justify-center mb-3">
                      <Receipt className="w-4 h-4 text-violet-400" />
                    </div>
                    <h4 className="text-sm font-bold text-white mb-1 font-space-grotesk">Equipment</h4>
                    <p className="text-xs text-slate-400 mb-2">Laptop, monitor, etc</p>
                    <div className="text-lg font-black bg-gradient-to-r from-violet-400 to-violet-600 bg-clip-text text-transparent font-space-grotesk">$850</div>
                  </div>

                  <div className="bg-slate-900/50 backdrop-blur-xl rounded-lg p-5 border border-white/10">
                    <div className="w-8 h-8 bg-fuchsia-500/20 rounded-lg flex items-center justify-center mb-3">
                      <Receipt className="w-4 h-4 text-fuchsia-400" />
                    </div>
                    <h4 className="text-sm font-bold text-white mb-1 font-space-grotesk">Home Office</h4>
                    <p className="text-xs text-slate-400 mb-2">Dedicated workspace</p>
                    <div className="text-lg font-black bg-gradient-to-r from-fuchsia-400 to-fuchsia-600 bg-clip-text text-transparent font-space-grotesk">$240</div>
                  </div>

                  <div className="bg-slate-900/50 backdrop-blur-xl rounded-lg p-5 border border-white/10">
                    <div className="w-8 h-8 bg-cyan-500/20 rounded-lg flex items-center justify-center mb-3">
                      <Receipt className="w-4 h-4 text-cyan-400" />
                    </div>
                    <h4 className="text-sm font-bold text-white mb-1 font-space-grotesk">Internet</h4>
                    <p className="text-xs text-slate-400 mb-2">Business use portion</p>
                    <div className="text-lg font-black bg-gradient-to-r from-cyan-400 to-cyan-600 bg-clip-text text-transparent font-space-grotesk">$180</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-white/10"></div>

            {/* Smart Tax Nudges */}
            <div>
              <div className="mb-4">
                <h2 className="text-xl font-bold text-white font-space-grotesk">Smart tax nudges</h2>
                <p className="text-xs text-slate-400">Personalized tips based on your income & expenses</p>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 backdrop-blur-sm border border-white/10 rounded-lg p-5">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Zap className="w-4 h-4 text-blue-400" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white font-space-grotesk mb-2">Track your mileage better</h3>
                      <p className="text-sm text-slate-300">You&apos;re leaving $400/mo on the table. Enable auto-tracking and capture every deductible mile.</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-orange-500/10 via-yellow-500/10 to-orange-500/10 backdrop-blur-sm border border-white/10 rounded-lg p-5">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-orange-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Zap className="w-4 h-4 text-orange-400" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white font-space-grotesk mb-2">Set up quarterly auto-pay</h3>
                      <p className="text-sm text-slate-300">Never miss a deadline. We&apos;ll auto-transfer the right amount from your savings to the IRS.</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-green-500/10 via-emerald-500/10 to-green-500/10 backdrop-blur-sm border border-white/10 rounded-lg p-5">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Zap className="w-4 h-4 text-green-400" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white font-space-grotesk mb-2">Deduct that new laptop</h3>
                      <p className="text-sm text-slate-300">Saw your $1,200 purchase. If it&apos;s for work, you can write off 100% this year under Section 179.</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-purple-500/10 backdrop-blur-sm border border-white/10 rounded-lg p-5">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Zap className="w-4 h-4 text-purple-400" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white font-space-grotesk mb-2">You&apos;re ready for tax season</h3>
                      <p className="text-sm text-slate-300">All your 1099s are here, deductions tracked, quarterly payments on schedule. You&apos;re ahead of 95% of gig workers.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'learn' && (
          <div className="space-y-8">
            {/* Hero message */}
            <div className="bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-purple-500/10 backdrop-blur-sm border border-white/10 rounded-lg p-8">
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-2 font-space-grotesk">
                Learn & grow your gig business
              </h1>
              <p className="text-base md:text-lg text-slate-300">
                City-specific guides, tax tips, and strategies from top earners. Everything you need to level up.
              </p>
            </div>

            {/* Explainer text */}
            <div className="space-y-4 text-base text-slate-300 leading-relaxed">
              <p>
                Every gig platform has its own tricks, strategies, and hidden features. <span className="bg-gradient-to-r from-blue-400 to-blue-500 bg-clip-text text-transparent font-semibold">Uber surge patterns in New York City</span> are completely different from Chicago. The best zones for DoorDash in San Francisco won&apos;t work in Austin. How you price yourself on Upwork depends on your reviews, your competition, and your positioning.
              </p>
              <p>
                We&apos;ve built a <span className="bg-gradient-to-r from-purple-400 to-purple-500 bg-clip-text text-transparent font-semibold">knowledge base designed specifically for gig workers</span>. Every article is 3-4 minutes long, focused on actionable strategies, and personalized to your gig type and city. Filter by rideshare, delivery, freelance, or creator work. Get <span className="bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent font-semibold">city-specific tips</span> that actually matter in your market.
              </p>
              <p>
                Learn how to maximize surge pricing. How to stack orders across multiple apps without getting deactivated. How to raise your rates on Upwork without losing clients. How to track mileage for maximum tax deductions. These aren&apos;t generic blog posts—they&apos;re <span className="bg-gradient-to-r from-pink-400 to-pink-500 bg-clip-text text-transparent font-semibold">practical playbooks</span> from top earners in your exact situation.
              </p>
              <p>
                The difference between struggling and thriving in the gig economy often comes down to knowing what the top 10% know. Now you do too.
              </p>
            </div>

            {/* Divider */}
            <div className="border-t border-white/10 mt-8"></div>

            {/* Filter tabs */}
            <div>
              <div className="mb-4">
                <h2 className="text-xl font-bold text-white font-space-grotesk">Browse by gig type</h2>
                <p className="text-xs text-slate-400">Personalized articles based on how you work</p>
              </div>
              <div className="flex flex-wrap gap-2 mb-6">
                <button className="px-4 py-2 bg-blue-500/20 border border-blue-500/30 rounded-lg text-sm font-semibold text-blue-400 hover:bg-blue-500/30 transition-colors">
                  All
                </button>
                <button className="px-4 py-2 bg-slate-800/50 border border-white/10 rounded-lg text-sm font-semibold text-slate-400 hover:bg-slate-800 transition-colors">
                  🚗 Rideshare
                </button>
                <button className="px-4 py-2 bg-slate-800/50 border border-white/10 rounded-lg text-sm font-semibold text-slate-400 hover:bg-slate-800 transition-colors">
                  🍔 Delivery
                </button>
                <button className="px-4 py-2 bg-slate-800/50 border border-white/10 rounded-lg text-sm font-semibold text-slate-400 hover:bg-slate-800 transition-colors">
                  💼 Freelance
                </button>
                <button className="px-4 py-2 bg-slate-800/50 border border-white/10 rounded-lg text-sm font-semibold text-slate-400 hover:bg-slate-800 transition-colors">
                  📹 Creator
                </button>
              </div>
            </div>

            {/* Income Optimization category */}
            <div>
              <div className="mb-4">
                <h2 className="text-lg font-bold text-white font-space-grotesk">Income Optimization</h2>
                <p className="text-xs text-slate-400">Strategies to earn more per hour</p>
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-slate-900/50 backdrop-blur-xl rounded-lg p-5 border border-white/10 hover:border-blue-500/50 transition-all cursor-pointer group">
                  <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center mb-3">
                    <BookOpen className="w-4 h-4 text-blue-400" />
                  </div>
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded font-semibold">NYC</span>
                    <span className="text-xs text-slate-400">🚗 Rideshare</span>
                  </div>
                  <h3 className="text-sm font-bold text-white mb-2 font-space-grotesk group-hover:text-blue-400 transition-colors">Uber surge hacks in New York City</h3>
                  <p className="text-xs text-slate-400 mb-3">Learn the exact zones and times when surge hits highest in Manhattan, Brooklyn, and Queens.</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-blue-400">3 min read</span>
                    <ArrowRight className="w-3 h-3 text-slate-400 group-hover:text-blue-400 transition-colors" />
                  </div>
                </div>

                <div className="bg-slate-900/50 backdrop-blur-xl rounded-lg p-5 border border-white/10 hover:border-purple-500/50 transition-all cursor-pointer group">
                  <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center mb-3">
                    <BookOpen className="w-4 h-4 text-purple-400" />
                  </div>
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-xs text-slate-400">🍔 Delivery</span>
                  </div>
                  <h3 className="text-sm font-bold text-white mb-2 font-space-grotesk group-hover:text-purple-400 transition-colors">Multi-apping: How to stack orders efficiently</h3>
                  <p className="text-xs text-slate-400 mb-3">Run DoorDash, Uber Eats, and Instacart simultaneously without getting deactivated.</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-purple-400">4 min read</span>
                    <ArrowRight className="w-3 h-3 text-slate-400 group-hover:text-purple-400 transition-colors" />
                  </div>
                </div>

                <div className="bg-slate-900/50 backdrop-blur-xl rounded-lg p-5 border border-white/10 hover:border-pink-500/50 transition-all cursor-pointer group">
                  <div className="w-8 h-8 bg-pink-500/20 rounded-lg flex items-center justify-center mb-3">
                    <BookOpen className="w-4 h-4 text-pink-400" />
                  </div>
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-xs text-slate-400">💼 Freelance</span>
                  </div>
                  <h3 className="text-sm font-bold text-white mb-2 font-space-grotesk group-hover:text-pink-400 transition-colors">Real talk: Bump your rate 15%</h3>
                  <p className="text-xs text-slate-400 mb-3">How to confidently raise your prices on Upwork and Fiverr without losing clients.</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-pink-400">3 min read</span>
                    <ArrowRight className="w-3 h-3 text-slate-400 group-hover:text-pink-400 transition-colors" />
                  </div>
                </div>

                <div className="bg-slate-900/50 backdrop-blur-xl rounded-lg p-5 border border-white/10 hover:border-green-500/50 transition-all cursor-pointer group">
                  <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center mb-3">
                    <BookOpen className="w-4 h-4 text-green-400" />
                  </div>
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded font-semibold">SF</span>
                    <span className="text-xs text-slate-400">🍔 Delivery</span>
                  </div>
                  <h3 className="text-sm font-bold text-white mb-2 font-space-grotesk group-hover:text-green-400 transition-colors">Best DoorDash zones in San Francisco</h3>
                  <p className="text-xs text-slate-400 mb-3">Mission District, Marina, and Downtown hotspots where you&apos;ll get the highest-paying orders.</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-green-400">3 min read</span>
                    <ArrowRight className="w-3 h-3 text-slate-400 group-hover:text-green-400 transition-colors" />
                  </div>
                </div>

                <div className="bg-slate-900/50 backdrop-blur-xl rounded-lg p-5 border border-white/10 hover:border-orange-500/50 transition-all cursor-pointer group">
                  <div className="w-8 h-8 bg-orange-500/20 rounded-lg flex items-center justify-center mb-3">
                    <BookOpen className="w-4 h-4 text-orange-400" />
                  </div>
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-xs text-slate-400">📹 Creator</span>
                  </div>
                  <h3 className="text-sm font-bold text-white mb-2 font-space-grotesk group-hover:text-orange-400 transition-colors">How Fiverr reviews affect your rates</h3>
                  <p className="text-xs text-slate-400 mb-3">The exact rating threshold where you can charge 2x more and still get orders.</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-orange-400">4 min read</span>
                    <ArrowRight className="w-3 h-3 text-slate-400 group-hover:text-orange-400 transition-colors" />
                  </div>
                </div>

                <div className="bg-slate-900/50 backdrop-blur-xl rounded-lg p-5 border border-white/10 hover:border-indigo-500/50 transition-all cursor-pointer group">
                  <div className="w-8 h-8 bg-indigo-500/20 rounded-lg flex items-center justify-center mb-3">
                    <BookOpen className="w-4 h-4 text-indigo-400" />
                  </div>
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-xs text-slate-400">🚗 Rideshare</span>
                  </div>
                  <h3 className="text-sm font-bold text-white mb-2 font-space-grotesk group-hover:text-indigo-400 transition-colors">Peak hour strategies for Lyft drivers</h3>
                  <p className="text-xs text-slate-400 mb-3">When to go online, where to wait, and how to maximize bonuses during rush hour.</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-indigo-400">3 min read</span>
                    <ArrowRight className="w-3 h-3 text-slate-400 group-hover:text-indigo-400 transition-colors" />
                  </div>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-white/10"></div>

            {/* Tax Guides category */}
            <div>
              <div className="mb-4">
                <h2 className="text-lg font-bold text-white font-space-grotesk">Tax Guides</h2>
                <p className="text-xs text-slate-400">Everything you need to file confidently</p>
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-slate-900/50 backdrop-blur-xl rounded-lg p-5 border border-white/10 hover:border-blue-500/50 transition-all cursor-pointer group">
                  <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center mb-3">
                    <Receipt className="w-4 h-4 text-blue-400" />
                  </div>
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-xs text-slate-400">🚗 Rideshare</span>
                  </div>
                  <h3 className="text-sm font-bold text-white mb-2 font-space-grotesk group-hover:text-blue-400 transition-colors">Mileage deductions explained for Uber drivers</h3>
                  <p className="text-xs text-slate-400 mb-3">The standard mileage method vs. actual expenses. Which saves you more money?</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-blue-400">4 min read</span>
                    <ArrowRight className="w-3 h-3 text-slate-400 group-hover:text-blue-400 transition-colors" />
                  </div>
                </div>

                <div className="bg-slate-900/50 backdrop-blur-xl rounded-lg p-5 border border-white/10 hover:border-purple-500/50 transition-all cursor-pointer group">
                  <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center mb-3">
                    <FileText className="w-4 h-4 text-purple-400" />
                  </div>
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-xs text-slate-400">🍔 Delivery</span>
                  </div>
                  <h3 className="text-sm font-bold text-white mb-2 font-space-grotesk group-hover:text-purple-400 transition-colors">How to file quarterly taxes as a DoorDash driver</h3>
                  <p className="text-xs text-slate-400 mb-3">Step-by-step guide to calculating and paying estimated taxes every quarter.</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-purple-400">3 min read</span>
                    <ArrowRight className="w-3 h-3 text-slate-400 group-hover:text-purple-400 transition-colors" />
                  </div>
                </div>

                <div className="bg-slate-900/50 backdrop-blur-xl rounded-lg p-5 border border-white/10 hover:border-pink-500/50 transition-all cursor-pointer group">
                  <div className="w-8 h-8 bg-pink-500/20 rounded-lg flex items-center justify-center mb-3">
                    <Receipt className="w-4 h-4 text-pink-400" />
                  </div>
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-xs text-slate-400">💼 Freelance</span>
                  </div>
                  <h3 className="text-sm font-bold text-white mb-2 font-space-grotesk group-hover:text-pink-400 transition-colors">Home office deductions for freelancers</h3>
                  <p className="text-xs text-slate-400 mb-3">Exactly what you can write off if you work from home, from rent to utilities.</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-pink-400">3 min read</span>
                    <ArrowRight className="w-3 h-3 text-slate-400 group-hover:text-pink-400 transition-colors" />
                  </div>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-white/10"></div>

            {/* Benefits Explained category */}
            <div>
              <div className="mb-4">
                <h2 className="text-lg font-bold text-white font-space-grotesk">Benefits Explained</h2>
                <p className="text-xs text-slate-400">Coverage, savings, and protection for gig workers</p>
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-slate-900/50 backdrop-blur-xl rounded-lg p-5 border border-white/10 hover:border-green-500/50 transition-all cursor-pointer group">
                  <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center mb-3">
                    <Heart className="w-4 h-4 text-green-400" />
                  </div>
                  <h3 className="text-sm font-bold text-white mb-2 font-space-grotesk group-hover:text-green-400 transition-colors">The gig worker&apos;s guide to health insurance</h3>
                  <p className="text-xs text-slate-400 mb-3">Everything you need to know about getting affordable coverage without an employer.</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-green-400">4 min read</span>
                    <ArrowRight className="w-3 h-3 text-slate-400 group-hover:text-green-400 transition-colors" />
                  </div>
                </div>

                <div className="bg-slate-900/50 backdrop-blur-xl rounded-lg p-5 border border-white/10 hover:border-orange-500/50 transition-all cursor-pointer group">
                  <div className="w-8 h-8 bg-orange-500/20 rounded-lg flex items-center justify-center mb-3">
                    <Target className="w-4 h-4 text-orange-400" />
                  </div>
                  <h3 className="text-sm font-bold text-white mb-2 font-space-grotesk group-hover:text-orange-400 transition-colors">Retirement planning for freelancers</h3>
                  <p className="text-xs text-slate-400 mb-3">Solo 401(k)s, SEP IRAs, and other retirement accounts designed for independent workers.</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-orange-400">3 min read</span>
                    <ArrowRight className="w-3 h-3 text-slate-400 group-hover:text-orange-400 transition-colors" />
                  </div>
                </div>

                <div className="bg-slate-900/50 backdrop-blur-xl rounded-lg p-5 border border-white/10 hover:border-indigo-500/50 transition-all cursor-pointer group">
                  <div className="w-8 h-8 bg-indigo-500/20 rounded-lg flex items-center justify-center mb-3">
                    <Wallet className="w-4 h-4 text-indigo-400" />
                  </div>
                  <h3 className="text-sm font-bold text-white mb-2 font-space-grotesk group-hover:text-indigo-400 transition-colors">Building an emergency fund on variable income</h3>
                  <p className="text-xs text-slate-400 mb-3">Proven strategies to save consistently even when your earnings fluctuate month to month.</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-indigo-400">3 min read</span>
                    <ArrowRight className="w-3 h-3 text-slate-400 group-hover:text-indigo-400 transition-colors" />
                  </div>
                </div>

                <div className="bg-slate-900/50 backdrop-blur-xl rounded-lg p-5 border border-white/10 hover:border-blue-500/50 transition-all cursor-pointer group">
                  <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center mb-3">
                    <Shield className="w-4 h-4 text-blue-400" />
                  </div>
                  <h3 className="text-sm font-bold text-white mb-2 font-space-grotesk group-hover:text-blue-400 transition-colors">Disability insurance for gig workers</h3>
                  <p className="text-xs text-slate-400 mb-3">What happens if you can&apos;t work? Short-term disability coverage options explained.</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-blue-400">4 min read</span>
                    <ArrowRight className="w-3 h-3 text-slate-400 group-hover:text-blue-400 transition-colors" />
                  </div>
                </div>

                <div className="bg-slate-900/50 backdrop-blur-xl rounded-lg p-5 border border-white/10 hover:border-purple-500/50 transition-all cursor-pointer group">
                  <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center mb-3">
                    <PiggyBank className="w-4 h-4 text-purple-400" />
                  </div>
                  <h3 className="text-sm font-bold text-white mb-2 font-space-grotesk group-hover:text-purple-400 transition-colors">HSA vs FSA: Which saves you more money?</h3>
                  <p className="text-xs text-slate-400 mb-3">Tax-advantaged health savings accounts compared. Understand which one fits your situation.</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-purple-400">3 min read</span>
                    <ArrowRight className="w-3 h-3 text-slate-400 group-hover:text-purple-400 transition-colors" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8 px-6 bg-slate-900/50 backdrop-blur-xl mt-16">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center space-x-2">
              <div className="flex -space-x-2">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-blue-600"></div>
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-purple-600"></div>
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-pink-500 to-pink-600"></div>
              </div>
              <span className="text-xl font-bold text-white font-space-grotesk">Portable</span>
            </div>
            <div className="text-sm text-slate-500">© 2025 Portable Financial Ltd. All rights reserved.</div>
          </div>
        </div>
      </footer>
    </div>
  );
}