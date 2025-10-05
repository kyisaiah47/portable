import {
  parseTransaction,
  parseTransactions,
  calculateStabilityScore,
  type Transaction,
} from './income-parser';

// Mock bank transactions (like what you'd get from a bank statement or Plaid)
const mockTransactions: Transaction[] = [
  // Uber payments
  {
    id: '1',
    date: new Date('2024-06-01'),
    description: 'UBER DRIVER PARTNER PAYMENT',
    amount: 450.25,
    type: 'credit',
  },
  {
    id: '2',
    date: new Date('2024-06-08'),
    description: 'UBER BV WEEKLY EARNINGS',
    amount: 520.50,
    type: 'credit',
  },
  {
    id: '3',
    date: new Date('2024-06-15'),
    description: 'Uber Technologies Inc',
    amount: 480.75,
    type: 'credit',
  },
  {
    id: '4',
    date: new Date('2024-06-22'),
    description: 'UBER TRIP EARNINGS WEEKLY',
    amount: 495.00,
    type: 'credit',
  },

  // DoorDash payments
  {
    id: '5',
    date: new Date('2024-06-03'),
    description: 'DOORDASH DASHER PAYMENT',
    amount: 320.50,
    type: 'credit',
  },
  {
    id: '6',
    date: new Date('2024-06-10'),
    description: 'DoorDash Weekly Payment',
    amount: 285.75,
    type: 'credit',
  },
  {
    id: '7',
    date: new Date('2024-06-17'),
    description: 'DD DRIVER WEEKLY DEPOSIT',
    amount: 310.00,
    type: 'credit',
  },
  {
    id: '8',
    date: new Date('2024-06-24'),
    description: 'DOORDASH INC PAYMENT',
    amount: 295.50,
    type: 'credit',
  },

  // Upwork payments
  {
    id: '9',
    date: new Date('2024-06-05'),
    description: 'UPWORK FREELANCE PAYMENT',
    amount: 850.00,
    type: 'credit',
  },
  {
    id: '10',
    date: new Date('2024-06-19'),
    description: 'Upwork Project Payment',
    amount: 1200.00,
    type: 'credit',
  },

  // Fiverr payment
  {
    id: '11',
    date: new Date('2024-06-12'),
    description: 'FIVERR INC WITHDRAWAL',
    amount: 450.00,
    type: 'credit',
  },

  // YouTube/AdSense
  {
    id: '12',
    date: new Date('2024-06-21'),
    description: 'GOOGLE ADSENSE PAYMENT',
    amount: 680.50,
    type: 'credit',
  },

  // Airbnb
  {
    id: '13',
    date: new Date('2024-06-07'),
    description: 'AIRBNB PAYOUT',
    amount: 750.00,
    type: 'credit',
  },
  {
    id: '14',
    date: new Date('2024-06-20'),
    description: 'Air BnB Host Payment',
    amount: 820.00,
    type: 'credit',
  },

  // Non-gig transactions (should be filtered out)
  {
    id: '15',
    date: new Date('2024-06-02'),
    description: 'SALARY DEPOSIT - ABC CORP',
    amount: 3500.00,
    type: 'credit',
  },
  {
    id: '16',
    date: new Date('2024-06-05'),
    description: 'GAS STATION PURCHASE',
    amount: 45.00,
    type: 'debit',
  },
  {
    id: '17',
    date: new Date('2024-06-10'),
    description: 'GROCERY STORE',
    amount: 120.50,
    type: 'debit',
  },
];

// Run tests
console.log('🧪 Testing Income Parser\n');
console.log('=' .repeat(80));

// Test 1: Parse individual transactions
console.log('\n📋 Test 1: Individual Transaction Parsing\n');
const testTransactions = [
  mockTransactions[0], // Uber
  mockTransactions[4], // DoorDash
  mockTransactions[8], // Upwork
  mockTransactions[14], // Non-gig salary
];

testTransactions.forEach((transaction) => {
  const result = parseTransaction(transaction);
  if (result) {
    console.log(`✅ ${result.platform} (${result.category})`);
    console.log(`   Amount: $${result.amount.toFixed(2)}`);
    console.log(`   Description: ${result.description}`);
    console.log(`   Confidence: ${result.confidence}`);
  } else {
    console.log(`❌ No platform detected`);
    console.log(`   Description: ${transaction.description}`);
  }
  console.log('');
});

// Test 2: Parse all transactions
console.log('=' .repeat(80));
console.log('\n📊 Test 2: Full Statement Parsing\n');

const parsed = parseTransactions(mockTransactions);

console.log(`Total Gig Income: $${parsed.totalIncome.toFixed(2)}`);
console.log(`Number of Payments: ${parsed.income.length}`);
console.log(`Date Range: ${parsed.startDate?.toLocaleDateString()} - ${parsed.endDate?.toLocaleDateString()}`);
console.log(`\nIncome by Platform:\n`);

// Sort platforms by total amount
const sortedPlatforms = Array.from(parsed.byPlatform.entries())
  .map(([platform, payments]) => ({
    platform,
    payments,
    total: payments.reduce((sum, p) => sum + p.amount, 0),
    count: payments.length,
  }))
  .sort((a, b) => b.total - a.total);

sortedPlatforms.forEach(({ platform, total, count, payments }) => {
  const category = payments[0].category;
  const icon = payments[0].platform === platform ? getPlatformIcon(category) : '💰';
  console.log(`${icon} ${platform}`);
  console.log(`   Total: $${total.toFixed(2)}`);
  console.log(`   Payments: ${count}`);
  console.log(`   Avg per payment: $${(total / count).toFixed(2)}`);
  console.log(`   Category: ${category}`);
  console.log('');
});

// Test 3: Calculate stability score
console.log('=' .repeat(80));
console.log('\n📈 Test 3: Income Stability Score\n');

const stability = calculateStabilityScore(parsed.income);

console.log(`Overall Score: ${stability.score}/100 (${stability.rating.toUpperCase()})`);
console.log(`\nScore Breakdown:`);
console.log(`  Diversification: ${stability.factors.diversification}/40`);
console.log(`  Consistency: ${stability.factors.consistency}/30`);
console.log(`  Frequency: ${stability.factors.frequency}/30`);
console.log('');

if (stability.rating === 'excellent') {
  console.log('💪 Excellent income stability! You\'re crushing it.');
} else if (stability.rating === 'good') {
  console.log('👍 Good income stability. Keep it up!');
} else if (stability.rating === 'fair') {
  console.log('📊 Fair income stability. Consider diversifying across more platforms.');
} else {
  console.log('⚠️  Income stability could be improved. Try adding more platforms.');
}

console.log('\n' + '='.repeat(80));
console.log('\n✅ All tests completed!\n');

// Helper function to get icon by category
function getPlatformIcon(category: string): string {
  const icons: Record<string, string> = {
    rideshare: '🚗',
    delivery: '🍔',
    freelance: '💼',
    creator: '📹',
    rental: '🏠',
    other: '💰',
  };
  return icons[category] || '💰';
}

// Export for use in other tests
export { mockTransactions };