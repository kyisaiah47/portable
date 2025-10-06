// Demo data generator for new users

export interface DemoTransaction {
  user_id: string;
  plaid_transaction_id: string;
  account_id: string;
  date: string;
  name: string;
  amount: number;
  category: string[] | null;
  pending: boolean;
}

export function generateDemoData(userId: string): {
  transactions: DemoTransaction[];
  parsedIncome: any;
} {
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  // Generate realistic gig income transactions
  const transactions: DemoTransaction[] = [];
  let totalIncome = 0;

  // Uber earnings - 4 weeks
  for (let week = 0; week < 4; week++) {
    const weekDate = new Date(thirtyDaysAgo.getTime() + week * 7 * 24 * 60 * 60 * 1000);
    const amount = 450 + Math.random() * 150; // $450-600/week
    transactions.push({
      user_id: userId,
      plaid_transaction_id: `demo-uber-${userId}-${week}`,
      account_id: 'demo-account',
      date: weekDate.toISOString().split('T')[0],
      name: 'UBER DRIVER PARTNER PAYMENT',
      amount,
      category: null,
      pending: false,
    });
    totalIncome += amount;
  }

  // DoorDash earnings - 4 weeks
  for (let week = 0; week < 4; week++) {
    const weekDate = new Date(thirtyDaysAgo.getTime() + (week * 7 + 2) * 24 * 60 * 60 * 1000);
    const amount = 300 + Math.random() * 100; // $300-400/week
    transactions.push({
      user_id: userId,
      plaid_transaction_id: `demo-doordash-${userId}-${week}`,
      account_id: 'demo-account',
      date: weekDate.toISOString().split('T')[0],
      name: 'DOORDASH DASHER PAYMENT',
      amount,
      category: null,
      pending: false,
    });
    totalIncome += amount;
  }

  // Upwork payments - 2 projects
  const upworkDates = [
    new Date(thirtyDaysAgo.getTime() + 10 * 24 * 60 * 60 * 1000),
    new Date(thirtyDaysAgo.getTime() + 24 * 24 * 60 * 60 * 1000),
  ];
  upworkDates.forEach((date, i) => {
    const amount = 800 + Math.random() * 400; // $800-1200
    transactions.push({
      user_id: userId,
      plaid_transaction_id: `demo-upwork-${userId}-${i}`,
      account_id: 'demo-account',
      date: date.toISOString().split('T')[0],
      name: 'UPWORK FREELANCE PAYMENT',
      amount,
      category: null,
      pending: false,
    });
    totalIncome += amount;
  });

  // Calculate income by platform
  const platformsMap = new Map<string, any[]>();

  transactions.forEach(tx => {
    let platform = '';
    if (tx.name.includes('UBER')) {
      platform = 'Uber';
    } else if (tx.name.includes('DOORDASH')) {
      platform = 'DoorDash';
    } else if (tx.name.includes('UPWORK')) {
      platform = 'Upwork';
    }

    if (platform) {
      if (!platformsMap.has(platform)) {
        platformsMap.set(platform, []);
      }
      platformsMap.get(platform)!.push({
        date: tx.date,
        amount: tx.amount,
        description: tx.name,
      });
    }
  });

  // Build by_platform object with full structure
  const platforms: Record<string, any> = {};
  platformsMap.forEach((items, platform) => {
    platforms[platform] = {
      total: items.reduce((sum, item) => sum + item.amount, 0),
      count: items.length,
      items: items,
    };
  });

  // Calculate stability metrics
  const weeklyAverages = [
    platforms['Uber']?.total / 4 || 0,
    platforms['DoorDash']?.total / 4 || 0,
  ];
  const avgWeekly = weeklyAverages.reduce((a, b) => a + b, 0) / weeklyAverages.length;
  const variance = weeklyAverages.reduce((sum, val) => sum + Math.pow(val - avgWeekly, 2), 0) / weeklyAverages.length;
  const stdDev = Math.sqrt(variance);
  const variability = (stdDev / avgWeekly) * 100;
  const stabilityScore = Math.max(0, Math.min(100, 100 - variability));

  const parsedIncome = {
    user_id: userId,
    total_income: totalIncome,
    start_date: thirtyDaysAgo.toISOString().split('T')[0],
    end_date: now.toISOString().split('T')[0],
    by_platform: platforms,
    stability: {
      score: Math.round(stabilityScore),
      rating: stabilityScore >= 75 ? 'Stable' : stabilityScore >= 50 ? 'Moderate' : 'Variable',
      weeklyAverage: avgWeekly,
      variability: Math.round(variability),
    },
  };

  return {
    transactions,
    parsedIncome,
  };
}

export async function seedDemoData(userId: string, supabase: any) {
  const { transactions, parsedIncome } = generateDemoData(userId);

  try {
    // Insert transactions
    const { error: txError } = await supabase
      .from('portable_transactions')
      .upsert(transactions, { onConflict: 'plaid_transaction_id' });

    if (txError) throw txError;

    // Insert parsed income
    const { error: incomeError } = await supabase
      .from('portable_parsed_income')
      .upsert(parsedIncome, { onConflict: 'user_id' });

    if (incomeError) throw incomeError;

    console.log('Demo data seeded successfully for user:', userId);
    return true;
  } catch (error) {
    console.error('Failed to seed demo data:', error);
    return false;
  }
}
