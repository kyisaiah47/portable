'use client';

import { useState } from 'react';
import { Heart, Building2, AlertTriangle, Calculator, CheckCircle, ArrowRight, Star, Shield } from 'lucide-react';

interface BenefitsMarketplaceProps {
  userId: string;
}

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

export default function BenefitsMarketplace({ userId }: BenefitsMarketplaceProps) {
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
      {/* Current Benefits */}
      <div className="bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:border-white/20 transition-all">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-xl flex items-center justify-center border border-green-500/20">
              <CheckCircle className="w-6 h-6 text-green-400" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white font-space-grotesk">Your Active Benefits</h2>
              <p className="text-sm text-slate-400">Currently enrolled coverage</p>
            </div>
          </div>
          <div className="bg-slate-800/50 rounded-full px-4 py-2 border border-white/10">
            <span className="text-sm font-medium text-slate-300">
              {enrolledBenefits.length} active
            </span>
          </div>
        </div>

        {enrolledBenefits.length > 0 ? (
          <div className="space-y-4">
            {enrolledBenefits.map((benefit) => {
              const CategoryIcon = getCategoryIcon(benefit.category);
              return (
                <div key={benefit.id} className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-green-500/50 hover:shadow-2xl hover:shadow-green-500/20 transition-all duration-200 group">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-xl flex items-center justify-center border border-green-500/20 group-hover:scale-105 transition-transform">
                        <CategoryIcon className="w-6 h-6 text-green-400" />
                      </div>
                      <div>
                        <h3 className="font-medium text-white">{benefit.name}</h3>
                        <p className="text-sm text-slate-400">{benefit.provider}</p>
                        <span className={`inline-block px-2 py-1 rounded-md text-xs mt-2 border ${getCategoryColor(benefit.category)}`}>
                          {benefit.category}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-white">
                        {benefit.monthlyCost === 0 ? 'Free' : `$${benefit.monthlyCost}`}
                      </p>
                      <p className="text-sm text-slate-400">/month</p>
                    </div>
                  </div>
                </div>
              );
            })}

            <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-6 border border-white/10">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-slate-300">Total Monthly Investment:</span>
                <span className="text-xl font-bold text-white">
                  ${totalMonthlyCost}/mo
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                That's only {((totalMonthlyCost / 3500) * 100).toFixed(1)}% of your monthly income
              </p>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-8 border border-white/10">
              <AlertTriangle className="w-8 h-8 text-slate-500 mx-auto mb-4" />
              <h3 className="text-sm font-medium text-white mb-2">No Benefits Yet</h3>
              <p className="text-sm text-slate-400">Start building your safety net by exploring our marketplace below</p>
            </div>
          </div>
        )}
      </div>

      {/* Marketplace */}
      <div className="bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:border-white/20 transition-all">
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl flex items-center justify-center border border-blue-500/20">
              <Shield className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white font-space-grotesk">Benefits Marketplace</h2>
              <p className="text-sm text-slate-400">Find the perfect coverage for your needs</p>
            </div>
          </div>
          <div className="bg-slate-800/50 rounded-md px-3 py-1 border border-white/10">
            <span className="text-sm text-slate-300">
              {filteredBenefits.filter(b => !b.enrolled).length} available
            </span>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-3 mb-8">
          {categories.map((category) => {
            const CategoryIcon = category.id === 'all' ? Shield : getCategoryIcon(category.id);
            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm transition-all ${
                  selectedCategory === category.id
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                    : 'bg-slate-800/50 text-slate-400 hover:text-white border border-white/10 hover:border-white/20'
                }`}
              >
                <CategoryIcon className="w-4 h-4" />
                <span>{category.name}</span>
              </button>
            );
          })}
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredBenefits.map((benefit) => {
            const CategoryIcon = getCategoryIcon(benefit.category);
            return (
              <div key={benefit.id} className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-8 border border-white/10 hover:border-purple-500/50 hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-200 group">
                <div className="flex items-start justify-between mb-8">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl flex items-center justify-center border border-purple-500/20 group-hover:scale-105 transition-transform">
                      <CategoryIcon className="w-6 h-6 text-purple-400" />
                    </div>
                    <div>
                      <h3 className="font-medium text-white mb-1">{benefit.name}</h3>
                      <p className="text-sm text-slate-400 mb-2">{benefit.provider}</p>
                      <span className={`inline-block px-2 py-1 rounded-md text-xs border ${getCategoryColor(benefit.category)}`}>
                        {benefit.category}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-white">
                      {benefit.monthlyCost === 0 ? 'Free' : `$${benefit.monthlyCost}`}
                    </p>
                    {benefit.monthlyCost > 0 && (
                      <p className="text-sm text-slate-400">/month</p>
                    )}
                  </div>
                </div>

                <p className="text-sm text-slate-400 mb-6">{benefit.description}</p>

                <div className="space-y-2 mb-6">
                  {benefit.features.map((feature, index) => (
                    <div key={index} className="flex items-center text-sm text-slate-400">
                      <CheckCircle className="w-4 h-4 text-slate-500 mr-3 flex-shrink-0" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>

                {benefit.enrolled ? (
                  <div className="bg-slate-700/50 border border-white/10 rounded-md p-4 text-center">
                    <CheckCircle className="w-5 h-5 text-green-400 mx-auto mb-2" />
                    <span className="text-sm font-medium text-slate-300">Currently Enrolled</span>
                  </div>
                ) : (
                  <button
                    onClick={() => handleEnroll(benefit.id)}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 px-4 rounded-md text-sm font-medium hover:opacity-90 transition-opacity flex items-center justify-center space-x-2"
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
          <div className="text-center py-12">
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-8 border border-white/10">
              <Shield className="w-8 h-8 text-slate-500 mx-auto mb-4" />
              <h3 className="text-sm font-medium text-white mb-2">No Benefits Found</h3>
              <p className="text-sm text-slate-400">Try selecting a different category to see more options</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}