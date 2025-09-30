/**
 * Centralized Content Registry
 *
 * All tips, guides, and resources in one place for easy filtering
 * by city, gig type, and category.
 */

export type ContentCategory = 'income' | 'tax' | 'benefits' | 'platform' | 'city' | 'guide';
export type GigType = 'rideshare' | 'delivery' | 'freelance' | 'creator' | 'rental' | 'all';
export type City = 'New York' | 'San Francisco' | 'Los Angeles' | 'Chicago' | 'Austin' | 'all';

export interface ContentItem {
  id: string;
  type: 'tip' | 'guide' | 'resource';
  title: string;
  description: string;
  category: ContentCategory;
  gigTypes: GigType[];
  cities: City[];
  priority: 'high' | 'medium' | 'low';
  icon: string;
  color: string;
  action?: string;
  actionLink?: string;
  readTime?: string; // For guides
  tags?: string[];
}

/**
 * City-specific data and benchmarks
 */
export const CITY_DATA: Record<string, {
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
 * Master content registry
 */
export const CONTENT_REGISTRY: ContentItem[] = [
  // Tax Tips
  {
    id: 'quarterly-tax-reminder',
    type: 'tip',
    title: 'Set aside for Q2 taxes',
    description: 'Based on your current income, you should save about 30% for quarterly estimated taxes. Due June 15th.',
    category: 'tax',
    gigTypes: ['all'],
    cities: ['all'],
    priority: 'high',
    icon: '📊',
    color: 'orange',
    action: 'View tax calendar',
    actionLink: '/dashboard?tab=taxes',
  },
  {
    id: 'mileage-tracking',
    type: 'tip',
    title: 'Track your mileage',
    description: 'Standard mileage deduction is $0.67/mile. Most rideshare/delivery drivers leave $2000+ on the table by not tracking miles properly.',
    category: 'tax',
    gigTypes: ['rideshare', 'delivery'],
    cities: ['all'],
    priority: 'medium',
    icon: '🚗',
    color: 'blue',
    action: 'Set up tracking',
  },

  // Platform Diversification
  {
    id: 'diversify-platforms',
    type: 'tip',
    title: 'Diversify your income streams',
    description: 'Top earners work 3+ platforms to smooth out slow periods and maximize earnings.',
    category: 'platform',
    gigTypes: ['all'],
    cities: ['all'],
    priority: 'high',
    icon: '🎯',
    color: 'blue',
    action: 'Add a platform',
  },
  {
    id: 'uber-doordash-stack',
    type: 'tip',
    title: 'Pair Uber with DoorDash',
    description: 'Uber drivers who also do DoorDash earn 40% more on average. Stack orders during your Uber downtime.',
    category: 'income',
    gigTypes: ['rideshare', 'delivery'],
    cities: ['all'],
    priority: 'high',
    icon: '💰',
    color: 'green',
    action: 'Connect DoorDash',
  },

  // Benefits
  {
    id: 'health-insurance',
    type: 'tip',
    title: 'You can afford health insurance',
    description: 'Health plans start at $150/mo with subsidies. Protect yourself and your earnings.',
    category: 'benefits',
    gigTypes: ['all'],
    cities: ['all'],
    priority: 'high',
    icon: '🏥',
    color: 'red',
    action: 'Browse plans',
    actionLink: '/dashboard?tab=benefits',
  },

  // City-Specific Tips - New York
  {
    id: 'ny-benchmark',
    type: 'tip',
    title: 'New York average: $28/hr',
    description: 'Rideshare drivers in New York average $28/hr. Peak earnings: Friday-Saturday 7PM-2AM, Weekday mornings 7-9AM.',
    category: 'city',
    gigTypes: ['rideshare'],
    cities: ['New York'],
    priority: 'medium',
    icon: '📍',
    color: 'purple',
  },
  {
    id: 'ny-hotspots',
    type: 'tip',
    title: 'Best zones in New York',
    description: 'Manhattan Midtown, Brooklyn Heights, Queens LIC. These areas have the highest order volume and tips.',
    category: 'city',
    gigTypes: ['rideshare', 'delivery'],
    cities: ['New York'],
    priority: 'medium',
    icon: '🗺️',
    color: 'blue',
  },
  {
    id: 'ny-broadway-surge',
    type: 'tip',
    title: 'New York insider tip',
    description: 'Surge pricing peaks during Broadway show times (8PM)',
    category: 'city',
    gigTypes: ['rideshare'],
    cities: ['New York'],
    priority: 'low',
    icon: '💡',
    color: 'yellow',
  },

  // City-Specific Tips - San Francisco
  {
    id: 'sf-benchmark',
    type: 'tip',
    title: 'San Francisco average: $32/hr',
    description: 'Rideshare drivers in San Francisco average $32/hr. Peak earnings: Weekday commute 7-9AM, 5-7PM.',
    category: 'city',
    gigTypes: ['rideshare'],
    cities: ['San Francisco'],
    priority: 'medium',
    icon: '📍',
    color: 'purple',
  },
  {
    id: 'sf-hotspots',
    type: 'tip',
    title: 'Best zones in San Francisco',
    description: 'Mission District, Marina, Financial District. These areas have the highest order volume and tips.',
    category: 'city',
    gigTypes: ['rideshare', 'delivery'],
    cities: ['San Francisco'],
    priority: 'medium',
    icon: '🗺️',
    color: 'blue',
  },
  {
    id: 'sf-tech-shuttle',
    type: 'tip',
    title: 'San Francisco insider tip',
    description: 'Tech shuttle times (8-9AM, 6-7PM) create high demand',
    category: 'city',
    gigTypes: ['rideshare'],
    cities: ['San Francisco'],
    priority: 'low',
    icon: '💡',
    color: 'yellow',
  },

  // City-Specific Tips - Los Angeles
  {
    id: 'la-benchmark',
    type: 'tip',
    title: 'Los Angeles average: $24/hr',
    description: 'Rideshare drivers in Los Angeles average $24/hr. Peak earnings: Friday-Saturday nights, Sunday brunch.',
    category: 'city',
    gigTypes: ['rideshare'],
    cities: ['Los Angeles'],
    priority: 'medium',
    icon: '📍',
    color: 'purple',
  },
  {
    id: 'la-hotspots',
    type: 'tip',
    title: 'Best zones in Los Angeles',
    description: 'West Hollywood, Santa Monica, Downtown LA. These areas have the highest order volume and tips.',
    category: 'city',
    gigTypes: ['rideshare', 'delivery'],
    cities: ['Los Angeles'],
    priority: 'medium',
    icon: '🗺️',
    color: 'blue',
  },
  {
    id: 'la-lax',
    type: 'tip',
    title: 'Los Angeles insider tip',
    description: 'LAX runs are most profitable early morning (5-8AM)',
    category: 'city',
    gigTypes: ['rideshare'],
    cities: ['Los Angeles'],
    priority: 'low',
    icon: '💡',
    color: 'yellow',
  },

  // City-Specific Tips - Chicago
  {
    id: 'chi-benchmark',
    type: 'tip',
    title: 'Chicago average: $25/hr',
    description: 'Rideshare drivers in Chicago average $25/hr. Peak earnings: Weekend nights, Cubs/Sox game days.',
    category: 'city',
    gigTypes: ['rideshare'],
    cities: ['Chicago'],
    priority: 'medium',
    icon: '📍',
    color: 'purple',
  },
  {
    id: 'chi-hotspots',
    type: 'tip',
    title: 'Best zones in Chicago',
    description: 'Wrigleyville, River North, Loop. These areas have the highest order volume and tips.',
    category: 'city',
    gigTypes: ['rideshare', 'delivery'],
    cities: ['Chicago'],
    priority: 'medium',
    icon: '🗺️',
    color: 'blue',
  },
  {
    id: 'chi-wrigley',
    type: 'tip',
    title: 'Chicago insider tip',
    description: 'Game days at Wrigley = 2-3x surge pricing',
    category: 'city',
    gigTypes: ['rideshare'],
    cities: ['Chicago'],
    priority: 'low',
    icon: '💡',
    color: 'yellow',
  },

  // City-Specific Tips - Austin
  {
    id: 'aus-benchmark',
    type: 'tip',
    title: 'Austin average: $22/hr',
    description: 'Rideshare drivers in Austin average $22/hr. Peak earnings: Thursday-Saturday nights, SXSW/ACL.',
    category: 'city',
    gigTypes: ['rideshare'],
    cities: ['Austin'],
    priority: 'medium',
    icon: '📍',
    color: 'purple',
  },
  {
    id: 'aus-hotspots',
    type: 'tip',
    title: 'Best zones in Austin',
    description: '6th Street, Rainey Street, Domain. These areas have the highest order volume and tips.',
    category: 'city',
    gigTypes: ['rideshare', 'delivery'],
    cities: ['Austin'],
    priority: 'medium',
    icon: '🗺️',
    color: 'blue',
  },
  {
    id: 'aus-sxsw',
    type: 'tip',
    title: 'Austin insider tip',
    description: 'SXSW/ACL weeks = 3-5x normal earnings',
    category: 'city',
    gigTypes: ['rideshare', 'delivery'],
    cities: ['Austin'],
    priority: 'low',
    icon: '💡',
    color: 'yellow',
  },

  // Guides - Rideshare
  {
    id: 'guide-uber-surge-nyc',
    type: 'guide',
    title: 'Mastering Uber Surge in NYC',
    description: 'Learn when and where surge pricing peaks in New York City, and how to position yourself for maximum earnings.',
    category: 'guide',
    gigTypes: ['rideshare'],
    cities: ['New York'],
    priority: 'high',
    icon: '📖',
    color: 'blue',
    readTime: '4 min read',
    tags: ['surge', 'uber', 'strategy'],
  },
  {
    id: 'guide-multi-app',
    type: 'guide',
    title: 'Multi-App Strategy for Drivers',
    description: 'How to run Uber, Lyft, and DoorDash simultaneously without getting deactivated. Proven system from $100K/year drivers.',
    category: 'guide',
    gigTypes: ['rideshare', 'delivery'],
    cities: ['all'],
    priority: 'high',
    icon: '📖',
    color: 'green',
    readTime: '5 min read',
    tags: ['strategy', 'multi-app', 'income'],
  },

  // Guides - Delivery
  {
    id: 'guide-doordash-zones-sf',
    type: 'guide',
    title: 'Best DoorDash Zones in San Francisco',
    description: 'Mission, Marina, and SOMA ranked by order volume, tips, and parking availability.',
    category: 'guide',
    gigTypes: ['delivery'],
    cities: ['San Francisco'],
    priority: 'high',
    icon: '📖',
    color: 'orange',
    readTime: '3 min read',
    tags: ['doordash', 'zones', 'tips'],
  },
  {
    id: 'guide-delivery-tax-deductions',
    type: 'guide',
    title: 'Tax Deductions for Delivery Drivers',
    description: 'Complete guide to mileage tracking, hot bags, phone bills, and other deductible expenses.',
    category: 'guide',
    gigTypes: ['delivery'],
    cities: ['all'],
    priority: 'medium',
    icon: '📖',
    color: 'purple',
    readTime: '6 min read',
    tags: ['tax', 'deductions', 'mileage'],
  },

  // Guides - Freelance
  {
    id: 'guide-upwork-pricing',
    type: 'guide',
    title: 'How to Raise Your Rates on Upwork',
    description: 'Step-by-step guide to increasing your hourly rate without losing clients. Includes email templates.',
    category: 'guide',
    gigTypes: ['freelance'],
    cities: ['all'],
    priority: 'high',
    icon: '📖',
    color: 'green',
    readTime: '5 min read',
    tags: ['upwork', 'pricing', 'negotiation'],
  },
  {
    id: 'guide-freelance-taxes',
    type: 'guide',
    title: 'Quarterly Tax Guide for Freelancers',
    description: 'When to pay, how much to set aside, and which forms to file. Avoid IRS penalties.',
    category: 'guide',
    gigTypes: ['freelance'],
    cities: ['all'],
    priority: 'medium',
    icon: '📖',
    color: 'orange',
    readTime: '7 min read',
    tags: ['tax', 'quarterly', 'freelance'],
  },

  // Guides - Creator
  {
    id: 'guide-youtube-monetization',
    type: 'guide',
    title: 'YouTube Monetization Breakdown',
    description: 'Ad revenue, sponsorships, memberships - how much you actually make per view and how to maximize it.',
    category: 'guide',
    gigTypes: ['creator'],
    cities: ['all'],
    priority: 'high',
    icon: '📖',
    color: 'red',
    readTime: '6 min read',
    tags: ['youtube', 'monetization', 'income'],
  },
  {
    id: 'guide-content-creator-expenses',
    type: 'guide',
    title: 'Tax Write-offs for Content Creators',
    description: 'Camera gear, editing software, home studio - what you can deduct and how to document it.',
    category: 'guide',
    gigTypes: ['creator'],
    cities: ['all'],
    priority: 'medium',
    icon: '📖',
    color: 'purple',
    readTime: '5 min read',
    tags: ['tax', 'deductions', 'equipment'],
  },
];

/**
 * Filter content by city and gig type
 */
export function filterContent(
  cities: City[],
  gigTypes: GigType[],
  contentType?: 'tip' | 'guide' | 'resource'
): ContentItem[] {
  let filtered = CONTENT_REGISTRY;

  // Filter by content type
  if (contentType) {
    filtered = filtered.filter(item => item.type === contentType);
  }

  // Filter by cities (show if city is 'all' or matches selected)
  if (cities.length > 0) {
    filtered = filtered.filter(item =>
      item.cities.includes('all') || item.cities.some(city => cities.includes(city))
    );
  }

  // Filter by gig types (show if gigType is 'all' or matches selected)
  if (gigTypes.length > 0) {
    filtered = filtered.filter(item =>
      item.gigTypes.includes('all') || item.gigTypes.some(type => gigTypes.includes(type))
    );
  }

  // Sort by priority
  const priorityOrder = { high: 0, medium: 1, low: 2 };
  return filtered.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
}

/**
 * Get tips only
 */
export function getTips(cities: City[], gigTypes: GigType[]): ContentItem[] {
  return filterContent(cities, gigTypes, 'tip');
}

/**
 * Get guides only
 */
export function getGuides(cities: City[], gigTypes: GigType[]): ContentItem[] {
  return filterContent(cities, gigTypes, 'guide');
}

/**
 * Get supported cities
 */
export function getSupportedCities(): City[] {
  return ['New York', 'San Francisco', 'Los Angeles', 'Chicago', 'Austin'];
}

/**
 * Get supported gig types
 */
export function getSupportedGigTypes(): GigType[] {
  return ['rideshare', 'delivery', 'freelance', 'creator', 'rental'];
}