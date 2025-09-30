/**
 * Income Parser for Gig Platforms
 *
 * Parses bank transactions and classifies them by gig platform using regex patterns.
 * Supports Uber, Lyft, DoorDash, Instacart, Upwork, Fiverr, YouTube, Airbnb, and more.
 */

export interface Transaction {
  id: string;
  date: Date;
  description: string;
  amount: number;
  type: 'credit' | 'debit';
}

export interface ParsedIncome {
  platform: string;
  category: 'rideshare' | 'delivery' | 'freelance' | 'creator' | 'rental' | 'other';
  amount: number;
  date: Date;
  description: string;
  confidence: 'high' | 'medium' | 'low';
}

export interface PlatformPattern {
  name: string;
  category: 'rideshare' | 'delivery' | 'freelance' | 'creator' | 'rental' | 'other';
  patterns: RegExp[];
  icon: string;
}

// Platform detection patterns
export const PLATFORM_PATTERNS: PlatformPattern[] = [
  // Rideshare
  {
    name: 'Uber',
    category: 'rideshare',
    patterns: [
      /uber.*driver/i,
      /uber.*partner/i,
      /uber.*trip/i,
      /uber.*earning/i,
      /uber bv/i,
      /uber technologies/i,
    ],
    icon: '🚗',
  },
  {
    name: 'Lyft',
    category: 'rideshare',
    patterns: [
      /lyft.*driver/i,
      /lyft.*earning/i,
      /lyft.*payment/i,
      /lyft inc/i,
    ],
    icon: '🚗',
  },

  // Delivery
  {
    name: 'DoorDash',
    category: 'delivery',
    patterns: [
      /doordash/i,
      /door dash/i,
      /dasher.*payment/i,
      /dd.*driver/i,
    ],
    icon: '🍔',
  },
  {
    name: 'Instacart',
    category: 'delivery',
    patterns: [
      /instacart/i,
      /insta cart/i,
      /ic.*shopper/i,
    ],
    icon: '🛒',
  },
  {
    name: 'Grubhub',
    category: 'delivery',
    patterns: [
      /grubhub/i,
      /grub hub/i,
      /gh.*driver/i,
    ],
    icon: '🍕',
  },
  {
    name: 'Uber Eats',
    category: 'delivery',
    patterns: [
      /uber.*eats/i,
      /ubereats/i,
    ],
    icon: '🍔',
  },
  {
    name: 'Postmates',
    category: 'delivery',
    patterns: [
      /postmates/i,
      /post mates/i,
    ],
    icon: '📦',
  },

  // Freelance Platforms
  {
    name: 'Upwork',
    category: 'freelance',
    patterns: [
      /upwork/i,
      /odesk/i,
      /elance/i,
    ],
    icon: '💼',
  },
  {
    name: 'Fiverr',
    category: 'freelance',
    patterns: [
      /fiverr/i,
      /fiver/i,
    ],
    icon: '💼',
  },
  {
    name: 'Freelancer',
    category: 'freelance',
    patterns: [
      /freelancer\.com/i,
      /freelancer inc/i,
    ],
    icon: '💼',
  },
  {
    name: 'Toptal',
    category: 'freelance',
    patterns: [
      /toptal/i,
    ],
    icon: '💼',
  },

  // Creator Platforms
  {
    name: 'YouTube',
    category: 'creator',
    patterns: [
      /youtube.*partner/i,
      /youtube.*payment/i,
      /google.*adsense/i,
      /adsense.*payment/i,
    ],
    icon: '📹',
  },
  {
    name: 'Twitch',
    category: 'creator',
    patterns: [
      /twitch/i,
      /amazon.*twitch/i,
    ],
    icon: '🎮',
  },
  {
    name: 'Patreon',
    category: 'creator',
    patterns: [
      /patreon/i,
    ],
    icon: '🎨',
  },
  {
    name: 'OnlyFans',
    category: 'creator',
    patterns: [
      /onlyfans/i,
      /only fans/i,
    ],
    icon: '📸',
  },
  {
    name: 'Substack',
    category: 'creator',
    patterns: [
      /substack/i,
    ],
    icon: '✍️',
  },

  // Rental Platforms
  {
    name: 'Airbnb',
    category: 'rental',
    patterns: [
      /airbnb/i,
      /air bnb/i,
      /bnb.*payment/i,
    ],
    icon: '🏠',
  },
  {
    name: 'Vrbo',
    category: 'rental',
    patterns: [
      /vrbo/i,
      /homeaway/i,
    ],
    icon: '🏠',
  },
  {
    name: 'Turo',
    category: 'rental',
    patterns: [
      /turo/i,
    ],
    icon: '🚙',
  },
];

/**
 * Parse a transaction and classify it by platform
 */
export function parseTransaction(transaction: Transaction): ParsedIncome | null {
  // Only parse credit transactions (income)
  if (transaction.type !== 'credit' || transaction.amount <= 0) {
    return null;
  }

  const description = transaction.description.toLowerCase();

  // Try to match against known platforms
  for (const platform of PLATFORM_PATTERNS) {
    for (const pattern of platform.patterns) {
      if (pattern.test(transaction.description)) {
        return {
          platform: platform.name,
          category: platform.category,
          amount: transaction.amount,
          date: transaction.date,
          description: transaction.description,
          confidence: 'high',
        };
      }
    }
  }

  // Check for generic gig keywords if no specific platform matched
  const genericGigPatterns = [
    /contractor.*payment/i,
    /freelance.*payment/i,
    /gig.*payment/i,
    /1099.*payment/i,
  ];

  for (const pattern of genericGigPatterns) {
    if (pattern.test(transaction.description)) {
      return {
        platform: 'Other Gig Work',
        category: 'other',
        amount: transaction.amount,
        date: transaction.date,
        description: transaction.description,
        confidence: 'medium',
      };
    }
  }

  return null;
}

/**
 * Parse multiple transactions and group by platform
 */
export function parseTransactions(transactions: Transaction[]): {
  income: ParsedIncome[];
  byPlatform: Map<string, ParsedIncome[]>;
  totalIncome: number;
  startDate: Date | null;
  endDate: Date | null;
} {
  const income: ParsedIncome[] = [];
  const byPlatform = new Map<string, ParsedIncome[]>();
  let totalIncome = 0;
  let startDate: Date | null = null;
  let endDate: Date | null = null;

  for (const transaction of transactions) {
    const parsed = parseTransaction(transaction);
    if (parsed) {
      income.push(parsed);
      totalIncome += parsed.amount;

      // Group by platform
      if (!byPlatform.has(parsed.platform)) {
        byPlatform.set(parsed.platform, []);
      }
      byPlatform.get(parsed.platform)!.push(parsed);

      // Track date range
      if (!startDate || transaction.date < startDate) {
        startDate = transaction.date;
      }
      if (!endDate || transaction.date > endDate) {
        endDate = transaction.date;
      }
    }
  }

  return {
    income,
    byPlatform,
    totalIncome,
    startDate,
    endDate,
  };
}

/**
 * Calculate income stability score based on consistency and diversification
 */
export function calculateStabilityScore(income: ParsedIncome[]): {
  score: number;
  rating: 'excellent' | 'good' | 'fair' | 'poor';
  factors: {
    consistency: number;
    diversification: number;
    frequency: number;
  };
} {
  if (income.length === 0) {
    return {
      score: 0,
      rating: 'poor',
      factors: { consistency: 0, diversification: 0, frequency: 0 },
    };
  }

  // Group by platform
  const platforms = new Set(income.map((i) => i.platform));
  const platformCount = platforms.size;

  // Calculate diversification score (0-40 points)
  let diversificationScore = 0;
  if (platformCount === 1) diversificationScore = 10;
  else if (platformCount === 2) diversificationScore = 25;
  else if (platformCount >= 3) diversificationScore = 40;

  // Calculate consistency score based on frequency (0-30 points)
  const sortedIncome = income.sort((a, b) => a.date.getTime() - b.date.getTime());
  const daysBetweenPayments: number[] = [];
  for (let i = 1; i < sortedIncome.length; i++) {
    const days = Math.abs(
      (sortedIncome[i].date.getTime() - sortedIncome[i - 1].date.getTime()) / (1000 * 60 * 60 * 24)
    );
    daysBetweenPayments.push(days);
  }

  const avgDaysBetween =
    daysBetweenPayments.length > 0
      ? daysBetweenPayments.reduce((sum, days) => sum + days, 0) / daysBetweenPayments.length
      : 30;

  let consistencyScore = 0;
  if (avgDaysBetween <= 3) consistencyScore = 30; // Multiple payments per week
  else if (avgDaysBetween <= 7) consistencyScore = 25; // Weekly
  else if (avgDaysBetween <= 14) consistencyScore = 20; // Biweekly
  else if (avgDaysBetween <= 30) consistencyScore = 15; // Monthly
  else consistencyScore = 10;

  // Calculate frequency score based on total number of payments (0-30 points)
  let frequencyScore = 0;
  if (income.length >= 20) frequencyScore = 30;
  else if (income.length >= 10) frequencyScore = 20;
  else if (income.length >= 5) frequencyScore = 15;
  else frequencyScore = 10;

  const totalScore = diversificationScore + consistencyScore + frequencyScore;

  let rating: 'excellent' | 'good' | 'fair' | 'poor';
  if (totalScore >= 80) rating = 'excellent';
  else if (totalScore >= 60) rating = 'good';
  else if (totalScore >= 40) rating = 'fair';
  else rating = 'poor';

  return {
    score: totalScore,
    rating,
    factors: {
      consistency: consistencyScore,
      diversification: diversificationScore,
      frequency: frequencyScore,
    },
  };
}