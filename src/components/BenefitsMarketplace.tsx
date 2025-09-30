'use client';

import { useState } from 'react';
import { Heart, Building2, AlertTriangle, Calculator, CheckCircle, ArrowRight, Shield, ExternalLink } from 'lucide-react';

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