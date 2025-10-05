export interface PlatformMetrics {
  platform: string;
  totalEarnings: number;
  averagePerTrip: number;
  tripCount: number;
  earningsPerHour: number | null; // Requires time tracking
  consistency: number; // 0-100 score
  trend: 'up' | 'down' | 'stable';
  trendPercentage: number;
  bestDays: string[]; // Days of week
  bestHours: string[]; // Time ranges
}

export interface PlatformComparison {
  platforms: PlatformMetrics[];
  topPerformer: string;
  mostConsistent: string;
  bestHourlyRate: string;
  recommendations: string[];
}

export function analyzePlatformPerformance(
  transactions: Array<{
    date: Date;
    amount: number;
    platform: string;
    merchant_name?: string;
  }>
): PlatformComparison {
  // Group transactions by platform
  const platformMap = new Map<string, typeof transactions>();

  transactions.forEach((tx) => {
    if (!platformMap.has(tx.platform)) {
      platformMap.set(tx.platform, []);
    }
    platformMap.get(tx.platform)!.push(tx);
  });

  // Calculate metrics for each platform
  const platformMetrics: PlatformMetrics[] = [];

  platformMap.forEach((txs, platform) => {
    const totalEarnings = txs.reduce((sum, tx) => sum + tx.amount, 0);
    const tripCount = txs.length;
    const averagePerTrip = totalEarnings / tripCount;

    // Calculate consistency (based on standard deviation)
    const amounts = txs.map((tx) => tx.amount);
    const avg = totalEarnings / tripCount;
    const variance =
      amounts.reduce((sum, amount) => sum + Math.pow(amount - avg, 2), 0) / tripCount;
    const stdDev = Math.sqrt(variance);
    const coefficientOfVariation = (stdDev / avg) * 100;
    const consistency = Math.max(0, Math.min(100, 100 - coefficientOfVariation));

    // Calculate trend (compare last 2 weeks vs previous 2 weeks)
    const now = new Date();
    const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
    const fourWeeksAgo = new Date(now.getTime() - 28 * 24 * 60 * 60 * 1000);

    const recentEarnings = txs
      .filter((tx) => tx.date >= twoWeeksAgo)
      .reduce((sum, tx) => sum + tx.amount, 0);

    const previousEarnings = txs
      .filter((tx) => tx.date >= fourWeeksAgo && tx.date < twoWeeksAgo)
      .reduce((sum, tx) => sum + tx.amount, 0);

    let trend: 'up' | 'down' | 'stable' = 'stable';
    let trendPercentage = 0;

    if (previousEarnings > 0) {
      trendPercentage = ((recentEarnings - previousEarnings) / previousEarnings) * 100;
      if (trendPercentage > 10) trend = 'up';
      else if (trendPercentage < -10) trend = 'down';
    }

    // Analyze best days and hours
    const dayMap = new Map<string, number>();
    const hourMap = new Map<number, number>();

    txs.forEach((tx) => {
      const day = tx.date.toLocaleDateString('en-US', { weekday: 'long' });
      const hour = tx.date.getHours();

      dayMap.set(day, (dayMap.get(day) || 0) + tx.amount);
      hourMap.set(hour, (hourMap.get(hour) || 0) + tx.amount);
    });

    const bestDays = Array.from(dayMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([day]) => day);

    const bestHours = Array.from(hourMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([hour]) => formatHourRange(hour));

    platformMetrics.push({
      platform,
      totalEarnings,
      averagePerTrip,
      tripCount,
      earningsPerHour: null, // Would need time tracking
      consistency: Math.round(consistency),
      trend,
      trendPercentage: Math.round(trendPercentage),
      bestDays,
      bestHours,
    });
  });

  // Sort by total earnings
  platformMetrics.sort((a, b) => b.totalEarnings - a.totalEarnings);

  // Identify top performers
  const topPerformer = platformMetrics[0]?.platform || 'N/A';
  const mostConsistent =
    platformMetrics.sort((a, b) => b.consistency - a.consistency)[0]?.platform || 'N/A';
  const bestHourlyRate =
    platformMetrics.filter((p) => p.earningsPerHour).sort((a, b) => b.earningsPerHour! - a.earningsPerHour!)[0]
      ?.platform || 'N/A';

  // Re-sort by earnings for final output
  platformMetrics.sort((a, b) => b.totalEarnings - a.totalEarnings);

  // Generate recommendations
  const recommendations = generateRecommendations(platformMetrics);

  return {
    platforms: platformMetrics,
    topPerformer,
    mostConsistent,
    bestHourlyRate,
    recommendations,
  };
}

function formatHourRange(hour: number): string {
  const start = hour;
  const end = (hour + 1) % 24;
  const formatHour = (h: number) => {
    if (h === 0) return '12 AM';
    if (h < 12) return `${h} AM`;
    if (h === 12) return '12 PM';
    return `${h - 12} PM`;
  };
  return `${formatHour(start)} - ${formatHour(end)}`;
}

function generateRecommendations(platforms: PlatformMetrics[]): string[] {
  const recommendations: string[] = [];

  // Check for platform diversification
  if (platforms.length === 1) {
    recommendations.push(
      `You're only earning from ${platforms[0].platform}. Consider adding 1-2 more platforms to increase income stability by up to 40%.`
    );
  } else if (platforms.length >= 3) {
    recommendations.push(
      `Great job! You're diversified across ${platforms.length} platforms, which significantly reduces income volatility.`
    );
  }

  // Check for declining platforms
  const decliningPlatforms = platforms.filter(
    (p) => p.trend === 'down' && p.trendPercentage < -15
  );
  if (decliningPlatforms.length > 0) {
    const platformNames = decliningPlatforms.map((p) => p.platform).join(', ');
    recommendations.push(
      `Your earnings on ${platformNames} are down ${Math.abs(
        decliningPlatforms[0].trendPercentage
      )}% over the last 2 weeks. Consider shifting hours to better-performing platforms or adjusting your strategy.`
    );
  }

  // Check for growing platforms
  const growingPlatforms = platforms.filter((p) => p.trend === 'up' && p.trendPercentage > 15);
  if (growingPlatforms.length > 0) {
    const best = growingPlatforms[0];
    recommendations.push(
      `${best.platform} is trending up ${best.trendPercentage}%! Consider allocating more time here, especially on ${best.bestDays[0]}s during ${best.bestHours[0]}.`
    );
  }

  // Check for low consistency
  const inconsistentPlatforms = platforms.filter((p) => p.consistency < 50);
  if (inconsistentPlatforms.length > 0) {
    recommendations.push(
      `Earnings on ${inconsistentPlatforms[0].platform} are inconsistent. Focus on peak hours (${inconsistentPlatforms[0].bestHours.join(
        ', '
      )}) to maximize per-trip earnings.`
    );
  }

  // Compare average per trip
  if (platforms.length >= 2) {
    const sorted = [...platforms].sort((a, b) => b.averagePerTrip - a.averagePerTrip);
    const highest = sorted[0];
    const lowest = sorted[sorted.length - 1];

    if (highest.averagePerTrip > lowest.averagePerTrip * 1.5) {
      recommendations.push(
        `${highest.platform} pays $${highest.averagePerTrip.toFixed(
          2
        )} per trip vs ${lowest.platform}'s $${lowest.averagePerTrip.toFixed(
          2
        )}. Prioritize ${highest.platform} for higher earnings per effort.`
      );
    }
  }

  // Best days recommendation
  const topPlatform = platforms[0];
  if (topPlatform && topPlatform.bestDays.length > 0) {
    recommendations.push(
      `Your top earning days on ${topPlatform.platform} are ${topPlatform.bestDays.join(
        ', '
      )}. Plan your schedule around these peak days.`
    );
  }

  return recommendations.slice(0, 5); // Max 5 recommendations
}

// Helper to get platform icon based on name
export function getPlatformIcon(platform: string): string {
  const icons: Record<string, string> = {
    Uber: '🚗',
    Lyft: '🚙',
    DoorDash: '🍔',
    'Uber Eats': '🍕',
    Grubhub: '🥡',
    Instacart: '🛒',
    Upwork: '💼',
    Fiverr: '🎨',
    Airbnb: '🏠',
    Turo: '🚘',
    Rover: '🐕',
    TaskRabbit: '🔨',
    Etsy: '🎁',
    Other: '💰',
  };

  return icons[platform] || '💰';
}

// Helper to get platform color based on name
export function getPlatformColor(platform: string): string {
  const colors: Record<string, string> = {
    Uber: '#000000',
    Lyft: '#FF00BF',
    DoorDash: '#FF3008',
    'Uber Eats': '#06C167',
    Grubhub: '#F63440',
    Instacart: '#00A862',
    Upwork: '#6FDA44',
    Fiverr: '#1DBF73',
    Airbnb: '#FF5A5F',
    Turo: '#121214',
    Rover: '#00BFA5',
    TaskRabbit: '#1CA69A',
    Etsy: '#F56400',
    Other: '#6B7280',
  };

  return colors[platform] || '#6B7280';
}
