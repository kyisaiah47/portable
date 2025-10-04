// Demo data generator for new users

export interface DemoTransaction {
  id: string;
  user_id: string;
  account_id: string;
  date: string;
  name: string;
  amount: number;
  category: string | null;
  pending: boolean;
  iso_currency_code: string;
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
      id: `demo-uber-${userId}-${week}`,
      user_id: userId,
      account_id: 'demo-account',
      date: weekDate.toISOString(),
      name: 'UBER DRIVER PARTNER PAYMENT',
      amount,
      category: 'income',
      pending: false,
      iso_currency_code: 'USD',
    });
    totalIncome += amount;
  }

  // DoorDash earnings - 4 weeks
  for (let week = 0; week < 4; week++) {
    const weekDate = new Date(thirtyDaysAgo.getTime() + (week * 7 + 2) * 24 * 60 * 60 * 1000);
    const amount = 300 + Math.random() * 100; // $300-400/week
    transactions.push({
      id: `demo-doordash-${userId}-${week}`,
      user_id: userId,
      account_id: 'demo-account',
      date: weekDate.toISOString(),
      name: 'DOORDASH DASHER PAYMENT',
      amount,
      category: 'income',
      pending: false,
      iso_currency_code: 'USD',
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
      id: `demo-upwork-${userId}-${i}`,
      user_id: userId,
      account_id: 'demo-account',
      date: date.toISOString(),
      name: 'UPWORK FREELANCE PAYMENT',
      amount,
      category: 'income',
      pending: false,
      iso_currency_code: 'USD',
    });
    totalIncome += amount;
  });

  // Calculate income by platform
  const platforms = {
    'Uber': 0,
    'DoorDash': 0,
    'Upwork': 0,
  };

  const incomeData: any[] = [];

  transactions.forEach(tx => {
    if (tx.name.includes('UBER')) {
      platforms['Uber'] += tx.amount;
      incomeData.push({
        date: tx.date,
        amount: tx.amount,
        platform: 'Uber',
      });
    } else if (tx.name.includes('DOORDASH')) {
      platforms['DoorDash'] += tx.amount;
      incomeData.push({
        date: tx.date,
        amount: tx.amount,
        platform: 'DoorDash',
      });
    } else if (tx.name.includes('UPWORK')) {
      platforms['Upwork'] += tx.amount;
      incomeData.push({
        date: tx.date,
        amount: tx.amount,
        platform: 'Upwork',
      });
    }
  });

  // Calculate stability metrics
  const weeklyAverages = [
    platforms['Uber'] / 4,
    platforms['DoorDash'] / 4,
  ];
  const avgWeekly = weeklyAverages.reduce((a, b) => a + b, 0) / weeklyAverages.length;
  const variance = weeklyAverages.reduce((sum, val) => sum + Math.pow(val - avgWeekly, 2), 0) / weeklyAverages.length;
  const stdDev = Math.sqrt(variance);
  const variability = (stdDev / avgWeekly) * 100;
  const stabilityScore = Math.max(0, Math.min(100, 100 - variability));

  const parsedIncome = {
    user_id: userId,
    total_income: totalIncome,
    start_date: thirtyDaysAgo.toISOString(),
    end_date: now.toISOString(),
    platforms,
    stability_score: Math.round(stabilityScore),
    stability_rating: stabilityScore >= 75 ? 'Stable' : stabilityScore >= 50 ? 'Moderate' : 'Variable',
    weekly_average: avgWeekly,
    variability: Math.round(variability),
    income_data: incomeData,
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
      .upsert(transactions, { onConflict: 'id' });

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
