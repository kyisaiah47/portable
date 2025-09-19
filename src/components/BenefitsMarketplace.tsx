'use client';

import { useState } from 'react';

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
      health: 'bg-red-100 text-red-800',
      retirement: 'bg-blue-100 text-blue-800',
      emergency: 'bg-orange-100 text-orange-800',
      tax: 'bg-green-100 text-green-800',
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Your Current Benefits
        </h2>
        {enrolledBenefits.length > 0 ? (
          <div className="space-y-3">
            {enrolledBenefits.map((benefit) => (
              <div key={benefit.id} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div>
                  <h3 className="font-medium text-gray-900">{benefit.name}</h3>
                  <p className="text-sm text-gray-600">{benefit.provider}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-green-600">
                    {benefit.monthlyCost === 0 ? 'Free' : `$${benefit.monthlyCost}/mo`}
                  </p>
                  <span className={`px-2 py-1 rounded-full text-xs ${getCategoryColor(benefit.category)}`}>
                    {benefit.category}
                  </span>
                </div>
              </div>
            ))}
            <div className="border-t pt-3 mt-3">
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-900">Total Monthly Cost:</span>
                <span className="font-bold text-lg text-green-600">
                  ${totalMonthlyCost}/mo
                </span>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-gray-600">No benefits enrolled yet. Browse the marketplace below to get started.</p>
        )}
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Benefits Marketplace
        </h2>

        <div className="flex flex-wrap gap-2 mb-6">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedCategory === category.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category.icon} {category.name}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredBenefits.map((benefit) => (
            <div key={benefit.id} className="border border-gray-200 rounded-lg p-6 hover:border-gray-300 transition-colors">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">{benefit.name}</h3>
                  <p className="text-sm text-gray-600">{benefit.provider}</p>
                  <span className={`inline-block px-2 py-1 rounded-full text-xs mt-2 ${getCategoryColor(benefit.category)}`}>
                    {benefit.category}
                  </span>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg text-gray-900">
                    {benefit.monthlyCost === 0 ? 'Free' : `$${benefit.monthlyCost}`}
                  </p>
                  {benefit.monthlyCost > 0 && (
                    <p className="text-sm text-gray-500">/month</p>
                  )}
                </div>
              </div>

              <p className="text-gray-700 mb-4">{benefit.description}</p>

              <ul className="space-y-1 mb-4">
                {benefit.features.map((feature, index) => (
                  <li key={index} className="flex items-center text-sm text-gray-600">
                    <svg className="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>

              {benefit.enrolled ? (
                <button
                  disabled
                  className="w-full bg-green-100 text-green-700 py-2 px-4 rounded-md font-medium"
                >
                  ✓ Enrolled
                </button>
              ) : (
                <button
                  onClick={() => handleEnroll(benefit.id)}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-md font-medium hover:bg-blue-700"
                >
                  Enroll Now
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}