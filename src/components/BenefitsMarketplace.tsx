'use client';

import { useState } from 'react';
import { Heart, Building2, AlertTriangle, Calculator, CheckCircle, ArrowRight, Shield } from 'lucide-react';

interface Benefit {
  id: number;
  name: string;
  provider: string;
  category: 'health' | 'retirement' | 'emergency' | 'tax';
  monthlyCost: number;
  description: string;
  features: string[];
  enrolled: boolean;
}

export default function BenefitsMarketplace() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const benefits: Benefit[] = [
    {
      id: 1,
      name: 'Basic Health Plan',
      provider: 'Stride Health',
      category: 'health',
      monthlyCost: 89,
      description: 'Essential health coverage for gig workers',
      features: ['Doctor visits', 'Prescription coverage', 'Emergency care', 'Telehealth'],
      enrolled: true,
    },
    {
      id: 2,
      name: 'Retirement Savings Plan',
      provider: 'Guideline',
      category: 'retirement',
      monthlyCost: 0,
      description: 'IRA with automatic contributions from earnings',
      features: ['Tax-advantaged savings', 'Investment options', 'Professional management', 'Mobile app'],
      enrolled: false,
    },
    {
      id: 3,
      name: 'Emergency Fund Builder',
      provider: 'GigBenefits',
      category: 'emergency',
      monthlyCost: 0,
      description: 'Automated emergency savings with instant access',
      features: ['2% auto-save', 'Instant access', 'FDIC insured', 'Goal tracking'],
      enrolled: true,
    },
    {
      id: 4,
      name: 'Tax Prep & Quarterly Estimates',
      provider: 'FreeTaxUSA',
      category: 'tax',
      monthlyCost: 15,
      description: '1099 tax preparation and quarterly payment assistance',
      features: ['Quarterly estimates', 'Deduction tracking', 'Tax filing', 'Audit support'],
      enrolled: false,
    },
    {
      id: 5,
      name: 'Premium Health Plan',
      provider: 'Blue Cross',
      category: 'health',
      monthlyCost: 189,
      description: 'Comprehensive health coverage with dental and vision',
      features: ['Full medical coverage', 'Dental included', 'Vision included', 'Specialist access'],
      enrolled: false,
    },
    {
      id: 6,
      name: 'Short-term Disability',
      provider: 'Principal',
      category: 'emergency',
      monthlyCost: 25,
      description: 'Income protection for illness or injury',
      features: ['60% income replacement', 'Up to 6 months', 'Quick approval', '24/7 support'],
      enrolled: false,
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

  const enrolledBenefits = benefits.filter(b => b.enrolled);
  const totalMonthlyCost = enrolledBenefits.reduce((sum, b) => sum + b.monthlyCost, 0);

  const handleEnroll = (benefitId: number) => {
    console.log('Enrolling in benefit:', benefitId);
  };

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

      {/* Divider */}
      <div className="border-t border-white/10"></div>

      {/* Current Benefits */}
      <div>
        <div className="mb-4">
          <h2 className="text-xl font-bold text-white font-space-grotesk">Your active benefits</h2>
          <p className="text-xs text-slate-400">Currently enrolled coverage - {enrolledBenefits.length} active</p>
        </div>

        {enrolledBenefits.length > 0 ? (
          <div className="space-y-4">
            {enrolledBenefits.map((benefit) => {
              const CategoryIcon = getCategoryIcon(benefit.category);
              return (
                <div key={benefit.id} className="bg-slate-900/50 backdrop-blur-xl rounded-lg p-5 border border-white/10 hover:border-green-500/50 transition-all">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                        <CategoryIcon className="w-5 h-5 text-green-400" />
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-white font-space-grotesk">{benefit.name}</h3>
                        <p className="text-xs text-slate-400">{benefit.provider}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-black bg-gradient-to-r from-green-400 to-emerald-600 bg-clip-text text-transparent font-space-grotesk">
                        {benefit.monthlyCost === 0 ? 'Free' : `$${benefit.monthlyCost}`}
                      </div>
                      <div className="text-xs text-slate-400">/month</div>
                    </div>
                  </div>
                </div>
              );
            })}

            <div className="bg-gradient-to-br from-green-500/10 via-emerald-500/10 to-green-500/10 backdrop-blur-sm border border-green-500/30 rounded-lg p-5">
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-base font-bold text-white font-space-grotesk">Total Monthly Investment</div>
                  <div className="text-xs text-slate-400">Only {((totalMonthlyCost / 3500) * 100).toFixed(1)}% of your monthly income</div>
                </div>
                <div className="text-2xl font-black bg-gradient-to-r from-green-400 to-emerald-600 bg-clip-text text-transparent font-space-grotesk">
                  ${totalMonthlyCost}/mo
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-slate-900/50 backdrop-blur-xl rounded-lg p-8 border border-white/10 text-center">
            <AlertTriangle className="w-8 h-8 text-slate-500 mx-auto mb-3" />
            <h3 className="text-base font-bold text-white mb-2 font-space-grotesk">No benefits yet</h3>
            <p className="text-sm text-slate-400">Start building your safety net by exploring our marketplace below</p>
          </div>
        )}
      </div>

      {/* Divider */}
      <div className="border-t border-white/10"></div>

      {/* Marketplace */}
      <div>
        <div className="mb-4">
          <h2 className="text-xl font-bold text-white font-space-grotesk">Benefits marketplace</h2>
          <p className="text-xs text-slate-400">Find the perfect coverage for your needs - {filteredBenefits.filter(b => !b.enrolled).length} available</p>
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

                {benefit.enrolled ? (
                  <div className="bg-slate-800/50 border border-white/10 rounded-lg p-3 text-center">
                    <CheckCircle className="w-4 h-4 text-green-400 mx-auto mb-1" />
                    <span className="text-xs font-semibold text-slate-300">Currently Enrolled</span>
                  </div>
                ) : (
                  <button
                    onClick={() => handleEnroll(benefit.id)}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 px-4 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity flex items-center justify-center space-x-2"
                  >
                    <span>Enroll Now</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
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