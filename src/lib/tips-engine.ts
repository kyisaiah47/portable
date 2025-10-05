/**
 * Personalized Tips Engine
 *
 * Generates context-aware tips based on user's:
 * - Income patterns
 * - Platform mix
 * - Stability score
 * - Tax readiness
 * - Benefits enrollment
 * - City location
 */

export interface UserStats {
  totalIncome: number;
  platforms: string[];
  platformCount: number;
  stabilityScore: number;
  stabilityRating: string;
  hasTaxData: boolean;
  hasBenefits: boolean;
  city?: string;
}

export interface Tip {
  id: string;
  title: string;
  description: string;
  category: 'income' | 'tax' | 'benefits' | 'platform' | 'city';
  priority: 'high' | 'medium' | 'low';
  action?: string;
  actionLink?: string;
  icon: string;
  color: string;
}

/**
 * City-specific benchmarks and tips
 */
const CITY_DATA: Record<string, {
  avgHourly: { [key: string]: number };
  peakHours: string;
  hotspots: string[];
  tips: string[];
}> = {
  'New York': {
    avgHourly: { uber: 28, lyft: 26, doordash: 22 },
    peakHours: 'Friday-Saturday 7PM-2AM, Weekday mornings 7-9AM',
    hotspots: ['Manhattan Midtown', 'Brooklyn Heights', 'Queens LIC'],
    tips: [
      'Surge pricing peaks during Broadway show times (8PM)',
      'Airport runs (JFK/LGA) are most profitable 5-7AM',
      'Avoid Midtown during lunch rush - too much traffic',
    ],
  },
  'San Francisco': {
    avgHourly: { uber: 32, lyft: 30, doordash: 24 },
    peakHours: 'Weekday commute 7-9AM, 5-7PM',
    hotspots: ['Mission District', 'Marina', 'Financial District'],
    tips: [
      'Tech shuttle times (8-9AM, 6-7PM) create high demand',
      'Mission District dinner rush (7-9PM) best for delivery',
      'Avoid SoMa during conferences - parking nightmare',
    ],
  },
  'Los Angeles': {
    avgHourly: { uber: 24, lyft: 22, doordash: 20 },
    peakHours: 'Friday-Saturday nights, Sunday brunch',
    hotspots: ['West Hollywood', 'Santa Monica', 'Downtown LA'],
    tips: [
      'LAX runs are most profitable early morning (5-8AM)',
      'WeHo nightlife (10PM-2AM) has consistent surge',
      'Avoid freeway during rush hour - surface streets faster',
    ],
  },
  'Chicago': {
    avgHourly: { uber: 25, lyft: 23, doordash: 21 },
    peakHours: 'Weekend nights, Cubs/Sox game days',
    hotspots: ['Wrigleyville', 'River North', 'Loop'],
    tips: [
      'Game days at Wrigley = 2-3x surge pricing',
      'River North bar close (2-3AM) very profitable',
      'Winter = less drivers = higher rates',
    ],
  },
  'Austin': {
    avgHourly: { uber: 22, lyft: 20, doordash: 19 },
    peakHours: 'Thursday-Saturday nights, SXSW/ACL',
    hotspots: ['6th Street', 'Rainey Street', 'Domain'],
    tips: [
      'SXSW/ACL weeks = 3-5x normal earnings',
      '6th Street bar close (2AM) guaranteed surge',
      'UT game days = easy money near campus',
    ],
  },
};

/**
 * Generate personalized tips based on user stats
 */
export function generateTips(stats: UserStats): Tip[] {
  const tips: Tip[] = [];

  // Income Optimization Tips
  if (stats.stabilityScore < 60) {
    tips.push({
      id: 'diversify-platforms',
      title: 'Diversify your income streams',
      description: `You're currently working on ${stats.platformCount} platform${stats.platformCount === 1 ? '' : 's'}. Top earners work 3+ platforms to smooth out slow periods and maximize earnings.`,
      category: 'platform',
      priority: 'high',
      action: 'Add a platform',
      icon: '🎯',
      color: 'blue',
    });
  }

  if (stats.platformCount === 1) {
    const platform = stats.platforms[0];
    const suggestions = {
      'Uber': ['DoorDash', 'Instacart'],
      'Lyft': ['Uber Eats', 'DoorDash'],
      'DoorDash': ['Uber', 'Instacart'],
      'Upwork': ['Fiverr', 'Toptal'],
      'YouTube': ['Patreon', 'Twitch'],
    };

    const recommended = suggestions[platform as keyof typeof suggestions] || ['DoorDash', 'Uber'];

    tips.push({
      id: 'platform-suggestion',
      title: `Pair ${platform} with ${recommended[0]}`,
      description: `${platform} drivers who also do ${recommended[0]} earn 40% more on average. Stack orders during your ${platform} downtime.`,
      category: 'income',
      priority: 'high',
      action: `Connect ${recommended[0]}`,
      icon: '💰',
      color: 'green',
    });
  }

  // Tax Tips
  if (stats.hasTaxData && stats.totalIncome > 0) {
    const quarterlyTax = Math.round((stats.totalIncome * 4 * 0.30) / 4);
    tips.push({
      id: 'tax-reminder',
      title: `Set aside $${quarterlyTax.toLocaleString()} for Q2 taxes`,
      description: 'Based on your current income, you should save about 30% for quarterly estimated taxes. Due June 15th.',
      category: 'tax',
      priority: 'high',
      action: 'View tax calendar',
      actionLink: '/dashboard?tab=taxes',
      icon: '📊',
      color: 'orange',
    });
  }

  // Benefits Tips
  if (!stats.hasBenefits && stats.totalIncome > 2000) {
    tips.push({
      id: 'health-insurance',
      title: 'You can afford health insurance',
      description: `At $${stats.totalIncome.toLocaleString()}/month income, health plans start at $150/mo with subsidies. Protect yourself and your earnings.`,
      category: 'benefits',
      priority: 'high',
      action: 'Browse plans',
      actionLink: '/dashboard?tab=benefits',
      icon: '🏥',
      color: 'red',
    });
  }

  // Lowercase platforms for matching
  const userPlatforms = stats.platforms.map(p => p.toLowerCase());

  // City-Specific Tips
  if (stats.city && CITY_DATA[stats.city]) {
    const cityData = CITY_DATA[stats.city];

    // Add city-specific hourly benchmark
    if (userPlatforms.includes('uber') || userPlatforms.includes('lyft')) {
      const avgRate = cityData.avgHourly.uber || 25;
      tips.push({
        id: 'city-benchmark',
        title: `${stats.city} average: $${avgRate}/hr`,
        description: `Rideshare drivers in ${stats.city} average $${avgRate}/hr. Peak earnings: ${cityData.peakHours}.`,
        category: 'city',
        priority: 'medium',
        icon: '📍',
        color: 'purple',
      });
    }

    // Add best hotspots
    tips.push({
      id: 'hotspots',
      title: `Best zones in ${stats.city}`,
      description: cityData.hotspots.join(', ') + '. These areas have the highest order volume and tips.',
      category: 'city',
      priority: 'medium',
      icon: '🗺️',
      color: 'blue',
    });

    // Add a random city-specific tip
    const randomTip = cityData.tips[Math.floor(Math.random() * cityData.tips.length)];
    tips.push({
      id: 'city-insider',
      title: `${stats.city} insider tip`,
      description: randomTip,
      category: 'city',
      priority: 'low',
      icon: '💡',
      color: 'yellow',
    });
  }

  // Income milestones
  if (stats.totalIncome >= 5000) {
    tips.push({
      id: 'high-earner',
      title: 'You\'re in the top 20%',
      description: `At $${stats.totalIncome.toLocaleString()}/month, you're earning more than 80% of gig workers. Consider opening a Solo 401(k) for tax-advantaged retirement savings.`,
      category: 'income',
      priority: 'medium',
      action: 'Learn about retirement',
      icon: '🎉',
      color: 'green',
    });
  }

  // Stability tips
  if (stats.stabilityRating === 'excellent') {
    tips.push({
      id: 'stability-praise',
      title: 'Your income is rock solid',
      description: `With a ${stats.stabilityScore}/100 stability score, you're in great shape. Focus on scaling up or adding passive income streams.`,
      category: 'income',
      priority: 'low',
      icon: '💪',
      color: 'green',
    });
  } else if (stats.stabilityRating === 'poor') {
    tips.push({
      id: 'stability-warning',
      title: 'Stabilize your income',
      description: 'Your income fluctuates significantly. Add more platforms and aim for weekly payment cadence to improve cash flow predictability.',
      category: 'platform',
      priority: 'high',
      icon: '⚠️',
      color: 'red',
    });
  }

  // Deduction tip
  if (userPlatforms.some(p => ['uber', 'lyft', 'doordash'].includes(p))) {
    tips.push({
      id: 'mileage-tracking',
      title: 'Track your mileage',
      description: 'Standard mileage deduction is $0.67/mile. Most rideshare/delivery drivers leave $2000+ on the table by not tracking miles properly.',
      category: 'tax',
      priority: 'medium',
      action: 'Set up tracking',
      icon: '🚗',
      color: 'blue',
    });
  }

  // Sort by priority
  const priorityOrder = { high: 0, medium: 1, low: 2 };
  return tips.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
}

/**
 * Get city list
 */
export function getSupportedCities(): string[] {
  return Object.keys(CITY_DATA);
}