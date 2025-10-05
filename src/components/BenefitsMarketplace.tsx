'use client';

import { useState } from 'react';
import { Heart, Building2, AlertTriangle, Calculator, CheckCircle, ArrowRight, Shield, ExternalLink } from 'lucide-react';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import {
  RadialBarChart,
  RadialBar,
  PolarAngleAxis,
} from 'recharts';

interface Benefit {
  id: number;
  name: string;
  provider: string;
  category: 'health' | 'retirement' | 'emergency' | 'tax';
  monthlyCost: number;
  description: string;
  features: string[];
  link: string;
}

export default function BenefitsMarketplace() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [annualIncome, setAnnualIncome] = useState<number>(50000);
  const [monthlyContribution, setMonthlyContribution] = useState<number>(500);
  const [currentAge, setCurrentAge] = useState<number>(30);
  const [retirementAge, setRetirementAge] = useState<number>(65);

  const benefits: Benefit[] = [
    {
      id: 1,
      name: 'ACA Health Insurance',
      provider: 'HealthCare.gov',
      category: 'health',
      monthlyCost: 150,
      description: 'Federal marketplace for health insurance with subsidies available',
      features: ['Income-based subsidies', 'All 10 essential health benefits', 'Pre-existing conditions covered', 'Preventive care at no cost'],
      link: 'https://www.healthcare.gov',
    },
    {
      id: 2,
      name: 'Vanguard Traditional IRA',
      provider: 'Vanguard',
      category: 'retirement',
      monthlyCost: 0,
      description: 'Low-cost retirement savings with tax-deferred growth',
      features: ['$0 account fees', 'Low expense ratios (0.04%)', 'Tax deduction on contributions', 'Invest up to $7,000/year'],
      link: 'https://investor.vanguard.com/ira/traditional-ira',
    },
    {
      id: 3,
      name: 'Fidelity Roth IRA',
      provider: 'Fidelity',
      category: 'retirement',
      monthlyCost: 0,
      description: 'Tax-free retirement withdrawals, ideal for gig workers',
      features: ['$0 account fees', 'Tax-free growth', 'No required distributions', 'Mobile app trading'],
      link: 'https://www.fidelity.com/retirement-ira/roth-ira',
    },
    {
      id: 4,
      name: 'Betterment IRA',
      provider: 'Betterment',
      category: 'retirement',
      monthlyCost: 0,
      description: 'Automated retirement investing with robo-advisor',
      features: ['0.25% annual fee', 'Auto-rebalancing', 'Tax-loss harvesting', 'Goal-based planning'],
      link: 'https://www.betterment.com/ira',
    },
    {
      id: 5,
      name: 'TurboTax Self-Employed',
      provider: 'TurboTax',
      category: 'tax',
      monthlyCost: 15,
      description: 'Full-service tax prep for 1099 contractors and gig workers',
      features: ['Quarterly tax estimates', 'Mileage deduction tracking', 'Schedule C support', 'Audit defense'],
      link: 'https://turbotax.intuit.com/personal-taxes/self-employment-taxes',
    },
    {
      id: 6,
      name: 'H&R Block Self-Employed',
      provider: 'H&R Block',
      category: 'tax',
      monthlyCost: 12,
      description: 'Expert tax help for freelancers and independent workers',
      features: ['Live CPA support', 'Quarterly payment reminders', 'Multi-state filing', 'Business expense tracking'],
      link: 'https://www.hrblock.com/online-tax-filing/self-employed-tax-software',
    },
    {
      id: 7,
      name: 'IRS Tax Guide',
      provider: 'IRS.gov',
      category: 'tax',
      monthlyCost: 0,
      description: 'Official quarterly tax payment guide and forms',
      features: ['Form 1040-ES', 'Payment vouchers', 'Tax calendar', 'Self-employment tax guidance'],
      link: 'https://www.irs.gov/businesses/small-businesses-self-employed/self-employed-individuals-tax-center',
    },
    {
      id: 8,
      name: 'High-Yield Savings Account',
      provider: 'Marcus by Goldman Sachs',
      category: 'emergency',
      monthlyCost: 0,
      description: 'FDIC-insured emergency fund with 4.5% APY',
      features: ['4.5% APY', 'No fees', 'FDIC insured', 'Instant transfers'],
      link: 'https://www.marcus.com/us/en/savings/high-yield-savings',
    },
  ];

  const categories = [
    { id: 'all', name: 'All Benefits', icon: '📋' },
    { id: 'health', name: 'Health', icon: '🏥' },
    { id: 'retirement', name: 'Retirement', icon: '🏛️' },
    { id: 'emergency', name: 'Emergency', icon: '🚨' },
    { id: 'tax', name: 'Tax', icon: '📊' },
  ];

  const filteredBenefits = selectedCategory === 'all'
    ? benefits
    : benefits.filter(benefit => benefit.category === selectedCategory);

  const getCategoryColor = (category: string) => {
    const colors = {
      health: 'bg-red-500/20 text-red-400 border-red-500/30',
      retirement: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      emergency: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
      tax: 'bg-green-500/20 text-green-400 border-green-500/30',
    };
    return colors[category as keyof typeof colors] || 'bg-slate-700/50 text-slate-300 border-white/10';
  };

  const getCategoryIcon = (category: string) => {
    const icons = {
      health: Heart,
      retirement: Building2,
      emergency: AlertTriangle,
      tax: Calculator,
    };
    return icons[category as keyof typeof icons] || Shield;
  };

  return (
    <div className="space-y-8">
      {/* Hero message */}
      <div className="bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 backdrop-blur-sm border border-white/10 rounded-lg p-8">
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-2 font-space-grotesk">
          Build your safety net
        </h1>
        <p className="text-base md:text-lg text-slate-300">
          Health coverage, retirement savings, and emergency funds designed for gig workers. No employer required.
        </p>
      </div>

      {/* Progress Rings - Benefits Coverage */}
      <div className="bg-gradient-to-br from-slate-900/80 via-slate-900/50 to-slate-900/80 backdrop-blur-xl rounded-lg p-8 border border-white/10">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-white font-space-grotesk">Your safety net progress</h2>
          <p className="text-xs text-slate-400">Track your coverage across key areas</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Emergency Fund Ring */}
          <div className="flex flex-col items-center">
            <div className="relative w-40 h-40">
              <ChartContainer
                config={{
                  coverage: { label: 'Coverage', color: '#22c55e' },
                }}
                className="h-full w-full"
              >
                <RadialBarChart
                  data={[{ name: 'Emergency Fund', value: 40, fill: '#22c55e' }]}
                  startAngle={90}
                  endAngle={-270}
                  innerRadius="70%"
                  outerRadius="100%"
                >
                  <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                  <RadialBar dataKey="value" background cornerRadius={10} />
                </RadialBarChart>
              </ChartContainer>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-3xl font-black text-green-400 font-space-grotesk">40%</div>
                  <div className="text-xs text-slate-400">Complete</div>
                </div>
              </div>
            </div>
            <div className="mt-4 text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <AlertTriangle className="w-4 h-4 text-green-400" />
                <h3 className="text-sm font-bold text-white">Emergency Fund</h3>
              </div>
              <p className="text-xs text-slate-400">1.2 of 3 months covered</p>
              <p className="text-xs text-green-400 mt-1 font-semibold">$3,600 saved</p>
            </div>
          </div>

          {/* Retirement Ring */}
          <div className="flex flex-col items-center">
            <div className="relative w-40 h-40">
              <ChartContainer
                config={{
                  coverage: { label: 'Coverage', color: '#8b5cf6' },
                }}
                className="h-full w-full"
              >
                <RadialBarChart
                  data={[{ name: 'Retirement', value: 25, fill: '#8b5cf6' }]}
                  startAngle={90}
                  endAngle={-270}
                  innerRadius="70%"
                  outerRadius="100%"
                >
                  <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                  <RadialBar dataKey="value" background cornerRadius={10} />
                </RadialBarChart>
              </ChartContainer>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-3xl font-black text-purple-400 font-space-grotesk">25%</div>
                  <div className="text-xs text-slate-400">Complete</div>
                </div>
              </div>
            </div>
            <div className="mt-4 text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Building2 className="w-4 h-4 text-purple-400" />
                <h3 className="text-sm font-bold text-white">Retirement</h3>
              </div>
              <p className="text-xs text-slate-400">Contributing $500/mo</p>
              <p className="text-xs text-purple-400 mt-1 font-semibold">On track for 35 years</p>
            </div>
          </div>

          {/* Health Coverage Ring */}
          <div className="flex flex-col items-center">
            <div className="relative w-40 h-40">
              <ChartContainer
                config={{
                  coverage: { label: 'Coverage', color: '#ef4444' },
                }}
                className="h-full w-full"
              >
                <RadialBarChart
                  data={[{ name: 'Health', value: 100, fill: '#ef4444' }]}
                  startAngle={90}
                  endAngle={-270}
                  innerRadius="70%"
                  outerRadius="100%"
                >
                  <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                  <RadialBar dataKey="value" background cornerRadius={10} />
                </RadialBarChart>
              </ChartContainer>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-3xl font-black text-red-400 font-space-grotesk">100%</div>
                  <div className="text-xs text-slate-400">Complete</div>
                </div>
              </div>
            </div>
            <div className="mt-4 text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Heart className="w-4 h-4 text-red-400" />
                <h3 className="text-sm font-bold text-white">Health Insurance</h3>
              </div>
              <p className="text-xs text-slate-400">ACA Marketplace</p>
              <p className="text-xs text-red-400 mt-1 font-semibold">$180/mo with subsidy</p>
            </div>
          </div>
        </div>

        {/* Overall Summary */}
        <div className="mt-8 pt-6 border-t border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">Overall Benefits Coverage</p>
              <p className="text-xs text-slate-500 mt-1">You're covering 2 of 3 core areas</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-black text-blue-400 font-space-grotesk">67%</div>
              <p className="text-xs text-slate-400">Safety net strength</p>
            </div>
          </div>
        </div>
      </div>

      {/* Explainer text */}
      <div className="space-y-4 text-base text-slate-300 leading-relaxed">
        <p>
          Traditional benefits are tied to full-time jobs. You get health insurance, a 401(k), paid time off, and life insurance because your employer sponsors them. But when you&apos;re working for yourself, <span className="bg-gradient-to-r from-red-400 to-red-500 bg-clip-text text-transparent font-semibold">you lose access to all of that</span>. It&apos;s not because you don&apos;t qualify—it&apos;s because the system wasn&apos;t built for independent workers.
        </p>
        <p>
          That&apos;s where Portable comes in. We&apos;ve curated trusted providers for <span className="bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent font-semibold">health insurance</span> (HealthCare.gov), <span className="bg-gradient-to-r from-purple-400 to-purple-500 bg-clip-text text-transparent font-semibold">retirement savings</span> (Vanguard, Fidelity, Betterment IRAs), <span className="bg-gradient-to-r from-orange-400 to-orange-500 bg-clip-text text-transparent font-semibold">emergency funds</span> (high-yield savings), and <span className="bg-gradient-to-r from-pink-400 to-pink-500 bg-clip-text text-transparent font-semibold">tax tools</span> (TurboTax, H&R Block, IRS guides).
        </p>
        <p>
          <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent font-semibold">We&apos;re not selling you anything</span> — just pointing you to the best current tools. We don&apos;t charge fees, and we don&apos;t have referral partnerships (yet). This is just honest guidance for what works. Most gig workers start with health insurance, then add emergency savings and retirement as their income stabilizes.
        </p>
        <p>
          You shouldn&apos;t have to choose between flexibility and security. With Portable, you can have both.
        </p>
      </div>

      {/* Divider */}
      <div className="border-t border-white/10 mt-8"></div>

      {/* Calculators */}
      <div>
        <div className="mb-4">
          <h2 className="text-xl font-bold text-white font-space-grotesk">Financial calculators</h2>
          <p className="text-xs text-slate-400">Plan your benefits budget</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Health Insurance Premium Calculator */}
          <div className="bg-gradient-to-br from-red-500/10 to-pink-500/10 backdrop-blur-xl rounded-lg p-6 border border-red-500/20">
            <div className="flex items-center space-x-2 mb-4">
              <Heart className="w-5 h-5 text-red-400" />
              <h3 className="text-lg font-bold text-white font-space-grotesk">Health Insurance Calculator</h3>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm text-slate-300 mb-2 block">Annual Income</label>
                <input
                  type="number"
                  value={annualIncome}
                  onChange={(e) => setAnnualIncome(Number(e.target.value))}
                  className="w-full bg-slate-900/50 border border-white/10 rounded-lg px-4 py-2 text-white"
                />
              </div>

              {(() => {
                // ACA subsidy calculation (simplified)
                const fpl = 14580; // 2024 Federal Poverty Level for 1 person
                const incomeAsPercentOfFPL = annualIncome / fpl;
                const isEligibleForSubsidy = incomeAsPercentOfFPL >= 1.0 && incomeAsPercentOfFPL <= 4.0;

                let maxPremiumPercent = 0;
                if (incomeAsPercentOfFPL <= 1.5) maxPremiumPercent = 0.02;
                else if (incomeAsPercentOfFPL <= 2.0) maxPremiumPercent = 0.04;
                else if (incomeAsPercentOfFPL <= 2.5) maxPremiumPercent = 0.06;
                else if (incomeAsPercentOfFPL <= 3.0) maxPremiumPercent = 0.08;
                else if (incomeAsPercentOfFPL <= 4.0) maxPremiumPercent = 0.085;

                const maxMonthlyPremium = (annualIncome * maxPremiumPercent) / 12;
                const avgMarketplacePremium = 450; // Average premium
                const monthlySubsidy = isEligibleForSubsidy ? Math.max(0, avgMarketplacePremium - maxMonthlyPremium) : 0;
                const finalMonthlyPremium = avgMarketplacePremium - monthlySubsidy;

                return (
                  <div className="bg-slate-900/50 rounded-lg p-4 border border-white/10">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-400">Marketplace Premium</span>
                        <span className="text-sm font-bold text-white">${avgMarketplacePremium}/mo</span>
                      </div>
                      {isEligibleForSubsidy ? (
                        <>
                          <div className="flex items-center justify-between text-green-400">
                            <span className="text-sm">ACA Subsidy</span>
                            <span className="text-sm font-bold">-${Math.round(monthlySubsidy)}/mo</span>
                          </div>
                          <div className="border-t border-white/10 pt-2 mt-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-bold text-white">Your Cost</span>
                              <span className="text-lg font-black text-green-400 font-space-grotesk">
                                ${Math.round(finalMonthlyPremium)}/mo
                              </span>
                            </div>
                          </div>
                          <p className="text-xs text-slate-400 mt-2">
                            ✅ You qualify for subsidies! Your max premium is {(maxPremiumPercent * 100).toFixed(1)}% of income.
                          </p>
                        </>
                      ) : (
                        <>
                          <div className="border-t border-white/10 pt-2 mt-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-bold text-white">Your Cost</span>
                              <span className="text-lg font-black text-white font-space-grotesk">${avgMarketplacePremium}/mo</span>
                            </div>
                          </div>
                          <p className="text-xs text-slate-400 mt-2">
                            {incomeAsPercentOfFPL < 1.0
                              ? '⚠️ Income too low for ACA subsidies. Check Medicaid eligibility in your state.'
                              : '⚠️ Income above 400% FPL. No subsidies available, but you can still enroll.'}
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>

          {/* Retirement Calculator */}
          <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 backdrop-blur-xl rounded-lg p-6 border border-blue-500/20">
            <div className="flex items-center space-x-2 mb-4">
              <Building2 className="w-5 h-5 text-blue-400" />
              <h3 className="text-lg font-bold text-white font-space-grotesk">Retirement Calculator</h3>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm text-slate-300 mb-2 block">Current Age</label>
                  <input
                    type="number"
                    value={currentAge}
                    onChange={(e) => setCurrentAge(Number(e.target.value))}
                    className="w-full bg-slate-900/50 border border-white/10 rounded-lg px-4 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-sm text-slate-300 mb-2 block">Retirement Age</label>
                  <input
                    type="number"
                    value={retirementAge}
                    onChange={(e) => setRetirementAge(Number(e.target.value))}
                    className="w-full bg-slate-900/50 border border-white/10 rounded-lg px-4 py-2 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm text-slate-300 mb-2 block">Monthly Contribution</label>
                <input
                  type="number"
                  value={monthlyContribution}
                  onChange={(e) => setMonthlyContribution(Number(e.target.value))}
                  className="w-full bg-slate-900/50 border border-white/10 rounded-lg px-4 py-2 text-white"
                />
              </div>

              {(() => {
                const yearsToRetirement = Math.max(1, retirementAge - currentAge);
                const monthsToRetirement = yearsToRetirement * 12;
                const annualReturn = 0.07; // 7% average annual return
                const monthlyReturn = Math.pow(1 + annualReturn, 1 / 12) - 1;

                // Future value of annuity formula
                const futureValue =
                  monthlyContribution * ((Math.pow(1 + monthlyReturn, monthsToRetirement) - 1) / monthlyReturn);

                const totalContributions = monthlyContribution * monthsToRetirement;
                const investmentGains = futureValue - totalContributions;

                return (
                  <div className="bg-slate-900/50 rounded-lg p-4 border border-white/10">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-400">Years to Retirement</span>
                        <span className="text-sm font-bold text-white">{yearsToRetirement} years</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-400">Total Contributions</span>
                        <span className="text-sm font-bold text-white">${totalContributions.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center justify-between text-green-400">
                        <span className="text-sm">Investment Gains (7%)</span>
                        <span className="text-sm font-bold">+${Math.round(investmentGains).toLocaleString()}</span>
                      </div>
                      <div className="border-t border-white/10 pt-2 mt-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-bold text-white">Projected Balance</span>
                          <span className="text-lg font-black text-green-400 font-space-grotesk">
                            ${Math.round(futureValue).toLocaleString()}
                          </span>
                        </div>
                      </div>
                      <p className="text-xs text-slate-400 mt-2">
                        💡 At ${monthlyContribution}/mo, you'll have ${Math.round(futureValue / 12 / 30).toLocaleString()}/mo in retirement
                        (assuming 30-year withdrawal).
                      </p>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-white/10"></div>

      {/* Retirement Account Comparison */}
      <div>
        <div className="mb-4">
          <h2 className="text-xl font-bold text-white font-space-grotesk">Retirement account comparison</h2>
          <p className="text-xs text-slate-400">Choose the right account for your situation</p>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {/* Traditional IRA */}
          <div className="bg-slate-900/50 backdrop-blur-xl rounded-lg p-6 border border-white/10">
            <h3 className="text-lg font-bold text-white mb-2 font-space-grotesk">Traditional IRA</h3>
            <p className="text-sm text-slate-400 mb-4">Tax deduction now, pay taxes in retirement</p>

            <div className="space-y-3">
              <div className="flex items-start space-x-2">
                <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-white font-semibold">Tax deduction today</p>
                  <p className="text-xs text-slate-400">Lower your taxable income now</p>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-white font-semibold">Tax-deferred growth</p>
                  <p className="text-xs text-slate-400">No taxes on gains until withdrawal</p>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <AlertTriangle className="w-4 h-4 text-orange-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-white font-semibold">Taxes in retirement</p>
                  <p className="text-xs text-slate-400">Withdrawals taxed as income</p>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-white/10">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-slate-400">2024 Contribution Limit</span>
                <span className="text-sm font-bold text-white">$7,000</span>
              </div>
              <p className="text-xs text-slate-400">Best for: High earners who want tax deductions now</p>
            </div>
          </div>

          {/* Roth IRA */}
          <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-xl rounded-lg p-6 border border-purple-500/20">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-bold text-white font-space-grotesk">Roth IRA</h3>
              <div className="text-xs font-bold text-purple-400 bg-purple-500/20 px-2 py-1 rounded">RECOMMENDED</div>
            </div>
            <p className="text-sm text-slate-400 mb-4">Pay taxes now, tax-free withdrawals forever</p>

            <div className="space-y-3">
              <div className="flex items-start space-x-2">
                <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-white font-semibold">Tax-free growth</p>
                  <p className="text-xs text-slate-400">Never pay taxes on gains</p>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-white font-semibold">Tax-free withdrawals</p>
                  <p className="text-xs text-slate-400">All money yours in retirement</p>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-white font-semibold">Withdraw contributions anytime</p>
                  <p className="text-xs text-slate-400">Emergency access if needed</p>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-purple-500/20">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-slate-400">2024 Contribution Limit</span>
                <span className="text-sm font-bold text-white">$7,000</span>
              </div>
              <p className="text-xs text-slate-400">Best for: Gig workers expecting higher income later</p>
            </div>
          </div>

          {/* SEP IRA */}
          <div className="bg-slate-900/50 backdrop-blur-xl rounded-lg p-6 border border-white/10">
            <h3 className="text-lg font-bold text-white mb-2 font-space-grotesk">SEP IRA</h3>
            <p className="text-sm text-slate-400 mb-4">Self-employed, higher contribution limits</p>

            <div className="space-y-3">
              <div className="flex items-start space-x-2">
                <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-white font-semibold">Much higher limits</p>
                  <p className="text-xs text-slate-400">Up to 25% of net income</p>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-white font-semibold">Tax deductible</p>
                  <p className="text-xs text-slate-400">Lower taxable income</p>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-white font-semibold">Easy setup</p>
                  <p className="text-xs text-slate-400">Less paperwork than 401(k)</p>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-white/10">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-slate-400">2024 Contribution Limit</span>
                <span className="text-sm font-bold text-white">$69,000</span>
              </div>
              <p className="text-xs text-slate-400">Best for: High-earning freelancers</p>
            </div>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-white/10"></div>

      {/* Emergency Fund Tracker */}
      <div>
        <div className="mb-4">
          <h2 className="text-xl font-bold text-white font-space-grotesk">Emergency fund goal</h2>
          <p className="text-xs text-slate-400">Aim for 3-6 months of expenses</p>
        </div>

        {(() => {
          const monthlyExpenses = annualIncome / 12 * 0.6; // Assume 60% of income for expenses
          const goalAmount = monthlyExpenses * 6; // 6 months
          const currentSavings = 5000; // Mock data - could be user input
          const progress = (currentSavings / goalAmount) * 100;

          return (
            <div className="bg-gradient-to-br from-orange-500/10 to-yellow-500/10 backdrop-blur-xl rounded-lg p-6 border border-orange-500/20">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm text-slate-400">Target: 6 months expenses</p>
                  <p className="text-3xl font-black text-white font-space-grotesk">${Math.round(goalAmount).toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-slate-400">Current Savings</p>
                  <p className="text-2xl font-bold text-orange-400 font-space-grotesk">${currentSavings.toLocaleString()}</p>
                </div>
              </div>

              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-slate-300">Progress</span>
                  <span className="text-sm font-bold text-white">{progress.toFixed(1)}%</span>
                </div>
                <div className="h-4 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-orange-500 to-yellow-600 rounded-full transition-all"
                    style={{ width: `${Math.min(progress, 100)}%` }}
                  ></div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 text-center">
                <div>
                  <p className="text-xs text-slate-400 mb-1">Monthly Goal</p>
                  <p className="text-lg font-bold text-white font-space-grotesk">${Math.round(monthlyExpenses).toLocaleString()}</p>
                </div>
                <div>
                  <div>
                  <p className="text-xs text-slate-400 mb-1">Remaining</p>
                  <p className="text-lg font-bold text-white font-space-grotesk">${Math.round(goalAmount - currentSavings).toLocaleString()}</p>
                </div>
                </div>
                <div>
                  <p className="text-xs text-slate-400 mb-1">Months Covered</p>
                  <p className="text-lg font-bold text-green-400 font-space-grotesk">{(currentSavings / monthlyExpenses).toFixed(1)}</p>
                </div>
              </div>

              <p className="text-xs text-slate-400 mt-4">
                💡 Save ${Math.round((goalAmount - currentSavings) / 12).toLocaleString()}/mo for 12 months to reach your goal
              </p>
            </div>
          );
        })()}
      </div>

      {/* Divider */}
      <div className="border-t border-white/10"></div>

      {/* Marketplace */}
      <div>
        <div className="mb-4">
          <h2 className="text-xl font-bold text-white font-space-grotesk">Trusted providers</h2>
          <p className="text-xs text-slate-400">Curated tools to build your safety net - {filteredBenefits.length} resources</p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2 mb-6">
          {categories.map((category) => {
            const CategoryIcon = category.id === 'all' ? Shield : getCategoryIcon(category.id);
            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  selectedCategory === category.id
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                    : 'bg-slate-800/50 text-slate-400 hover:text-white border border-white/10 hover:bg-slate-800'
                }`}
              >
                <CategoryIcon className="w-4 h-4" />
                <span>{category.name}</span>
              </button>
            );
          })}
        </div>

        {/* Benefits Grid */}
        <div className="grid md:grid-cols-2 gap-4">
          {filteredBenefits.map((benefit) => {
            const CategoryIcon = getCategoryIcon(benefit.category);
            return (
              <div key={benefit.id} className="bg-slate-900/50 backdrop-blur-xl rounded-lg p-5 border border-white/10 hover:border-purple-500/50 transition-all">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center">
                      <CategoryIcon className="w-4 h-4 text-purple-400" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white font-space-grotesk mb-1">{benefit.name}</h3>
                      <p className="text-xs text-slate-400 mb-2">{benefit.provider}</p>
                      <span className={`inline-block px-2 py-0.5 rounded text-xs font-semibold border ${getCategoryColor(benefit.category)}`}>
                        {benefit.category}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-black bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent font-space-grotesk">
                      {benefit.monthlyCost === 0 ? 'Free' : `$${benefit.monthlyCost}`}
                    </div>
                    {benefit.monthlyCost > 0 && (
                      <div className="text-xs text-slate-400">/month</div>
                    )}
                  </div>
                </div>

                <p className="text-sm text-slate-400 mb-4">{benefit.description}</p>

                <div className="space-y-2 mb-4">
                  {benefit.features.map((feature, index) => (
                    <div key={index} className="flex items-center text-xs text-slate-400">
                      <CheckCircle className="w-3 h-3 text-slate-500 mr-2 flex-shrink-0" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>

                <a
                  href={benefit.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 px-4 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity flex items-center justify-center space-x-2"
                >
                  <span>Visit {benefit.provider}</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            );
          })}
        </div>

        {filteredBenefits.length === 0 && (
          <div className="bg-slate-900/50 backdrop-blur-xl rounded-lg p-8 border border-white/10 text-center">
            <Shield className="w-8 h-8 text-slate-500 mx-auto mb-3" />
            <h3 className="text-base font-bold text-white mb-2 font-space-grotesk">No benefits found</h3>
            <p className="text-sm text-slate-400">Try selecting a different category to see more options</p>
          </div>
        )}
      </div>
    </div>
  );
}