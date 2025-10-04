/**
 * Performance Testing Script for Portable
 *
 * Tests database performance with large transaction volumes (10,000+)
 * Simulates real-world gig worker transaction patterns
 *
 * Usage:
 *   npm install --save-dev @faker-js/faker
 *   npx tsx scripts/performance-test.ts
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('❌ Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// Test configuration
const TEST_CONFIG = {
  numTransactions: 10000,
  batchSize: 500, // Insert 500 at a time to avoid timeouts
  userId: '', // Will be created during test
  platforms: ['Uber', 'Lyft', 'DoorDash', 'Uber Eats', 'Grubhub', 'Instacart', 'Upwork', 'Fiverr'],
};

interface PerformanceMetrics {
  operation: string;
  duration: number;
  recordsProcessed: number;
  recordsPerSecond: number;
}

const metrics: PerformanceMetrics[] = [];

function recordMetric(operation: string, duration: number, recordsProcessed: number) {
  const metric = {
    operation,
    duration,
    recordsProcessed,
    recordsPerSecond: Math.round(recordsProcessed / (duration / 1000)),
  };
  metrics.push(metric);
  console.log(`✓ ${operation}: ${duration}ms (${metric.recordsPerSecond} records/sec)`);
}

async function createTestUser(): Promise<string> {
  console.log('\n📝 Creating test user...');
  const startTime = Date.now();

  // Create auth user
  const testEmail = `perf-test-${Date.now()}@portable.test`;
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email: testEmail,
    password: 'test-password-123',
    email_confirm: true,
    user_metadata: {
      first_name: 'Performance',
      last_name: 'Test',
    },
  });

  if (authError || !authData.user) {
    throw new Error(`Failed to create auth user: ${authError?.message}`);
  }

  const userId = authData.user.id;

  // Create portable_users entry
  const { error: userError } = await supabase
    .from('portable_users')
    .insert({
      id: userId,
      email: testEmail,
      first_name: 'Performance',
      last_name: 'Test',
    });

  if (userError) {
    throw new Error(`Failed to create portable_users entry: ${userError.message}`);
  }

  recordMetric('Create test user', Date.now() - startTime, 1);
  return userId;
}

function generateTransactions(userId: string, count: number) {
  const transactions = [];
  const startDate = new Date();
  startDate.setFullYear(startDate.getFullYear() - 1); // 1 year of transactions

  for (let i = 0; i < count; i++) {
    // Random date within last year
    const date = new Date(startDate.getTime() + Math.random() * 365 * 24 * 60 * 60 * 1000);

    // Random platform
    const platform = TEST_CONFIG.platforms[Math.floor(Math.random() * TEST_CONFIG.platforms.length)];

    // Random amount (gig income typically $10-$150 per transaction)
    const amount = Math.round((Math.random() * 140 + 10) * 100) / 100;

    transactions.push({
      id: crypto.randomUUID(),
      user_id: userId,
      plaid_transaction_id: `perf-test-${i}`,
      account_id: 'test-account',
      date: date.toISOString().split('T')[0],
      amount,
      name: `${platform.toUpperCase()} PAYMENT`,
      merchant_name: platform,
      category: ['Income'],
      pending: false,
    });
  }

  return transactions;
}

async function insertTransactions(userId: string) {
  console.log(`\n💾 Inserting ${TEST_CONFIG.numTransactions.toLocaleString()} transactions in batches of ${TEST_CONFIG.batchSize}...`);
  const startTime = Date.now();

  const transactions = generateTransactions(userId, TEST_CONFIG.numTransactions);
  const batches = [];

  for (let i = 0; i < transactions.length; i += TEST_CONFIG.batchSize) {
    batches.push(transactions.slice(i, i + TEST_CONFIG.batchSize));
  }

  console.log(`Created ${batches.length} batches`);

  for (let i = 0; i < batches.length; i++) {
    const batchStartTime = Date.now();
    const { error } = await supabase
      .from('portable_transactions')
      .insert(batches[i]);

    if (error) {
      throw new Error(`Batch ${i + 1} failed: ${error.message}`);
    }

    const batchDuration = Date.now() - batchStartTime;
    console.log(`  Batch ${i + 1}/${batches.length}: ${batchDuration}ms (${Math.round(TEST_CONFIG.batchSize / (batchDuration / 1000))} records/sec)`);
  }

  recordMetric(`Insert ${TEST_CONFIG.numTransactions.toLocaleString()} transactions`, Date.now() - startTime, TEST_CONFIG.numTransactions);
}

async function testQueryPerformance(userId: string) {
  console.log('\n🔍 Testing query performance...\n');

  // Test 1: Fetch all transactions (unoptimized)
  const test1Start = Date.now();
  const { data: allTransactions, error: err1 } = await supabase
    .from('portable_transactions')
    .select('*')
    .eq('user_id', userId);

  if (err1) throw err1;
  recordMetric('Fetch all transactions (SELECT *)', Date.now() - test1Start, allTransactions?.length || 0);

  // Test 2: Fetch with date filter
  const test2Start = Date.now();
  const threeMonthsAgo = new Date();
  threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

  const { data: recentTransactions, error: err2 } = await supabase
    .from('portable_transactions')
    .select('*')
    .eq('user_id', userId)
    .gte('date', threeMonthsAgo.toISOString().split('T')[0]);

  if (err2) throw err2;
  recordMetric('Fetch last 3 months (indexed date)', Date.now() - test2Start, recentTransactions?.length || 0);

  // Test 3: Aggregate query (income by platform)
  const test3Start = Date.now();
  const { data: platformData, error: err3 } = await supabase
    .from('portable_transactions')
    .select('merchant_name, amount')
    .eq('user_id', userId)
    .gt('amount', 0);

  if (err3) throw err3;

  // Client-side aggregation
  const byPlatform = new Map<string, number>();
  platformData?.forEach(tx => {
    const platform = tx.merchant_name || 'Other';
    byPlatform.set(platform, (byPlatform.get(platform) || 0) + tx.amount);
  });

  recordMetric('Aggregate by platform (client-side)', Date.now() - test3Start, platformData?.length || 0);

  // Test 4: Count query
  const test4Start = Date.now();
  const { count, error: err4 } = await supabase
    .from('portable_transactions')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId);

  if (err4) throw err4;
  recordMetric('Count transactions', Date.now() - test4Start, count || 0);

  // Test 5: Pagination (fetch page 1 of 100)
  const test5Start = Date.now();
  const { data: page1, error: err5 } = await supabase
    .from('portable_transactions')
    .select('*')
    .eq('user_id', userId)
    .order('date', { ascending: false })
    .range(0, 99);

  if (err5) throw err5;
  recordMetric('Paginated query (100 records)', Date.now() - test5Start, page1?.length || 0);

  // Test 6: Income parsing simulation (client-side processing)
  const test6Start = Date.now();
  const { data: allTxForParsing, error: err6 } = await supabase
    .from('portable_transactions')
    .select('date, amount, name, merchant_name')
    .eq('user_id', userId);

  if (err6) throw err6;

  // Simulate income parsing
  const incomeData: any[] = [];
  const platformMap = new Map<string, any>();

  allTxForParsing?.forEach(tx => {
    if (tx.amount > 0) {
      incomeData.push({
        date: new Date(tx.date),
        amount: tx.amount,
        platform: tx.merchant_name || 'Other',
      });

      const platform = tx.merchant_name || 'Other';
      if (!platformMap.has(platform)) {
        platformMap.set(platform, { total: 0, count: 0 });
      }
      const platformStats = platformMap.get(platform);
      platformStats.total += tx.amount;
      platformStats.count += 1;
    }
  });

  const totalIncome = incomeData.reduce((sum, item) => sum + item.amount, 0);

  recordMetric('Parse income data (client-side)', Date.now() - test6Start, incomeData.length);
  console.log(`   Total income: $${totalIncome.toLocaleString()}`);
  console.log(`   Platforms: ${platformMap.size}`);
}

async function testDatabaseIndexes() {
  console.log('\n📊 Checking database indexes...\n');

  // Query to check indexes
  const { data: indexes, error } = await supabase.rpc('get_table_indexes', {
    p_tablename: 'portable_transactions'
  });

  if (error) {
    console.log('⚠️  Could not query indexes (expected - RPC function may not exist)');
    console.log('   To check indexes manually, run:');
    console.log('   SELECT indexname, indexdef FROM pg_indexes WHERE tablename = \'portable_transactions\';');
  } else {
    console.log('Indexes:', indexes);
  }
}

async function cleanup(userId: string) {
  console.log('\n🧹 Cleaning up test data...');
  const startTime = Date.now();

  // Delete transactions
  await supabase
    .from('portable_transactions')
    .delete()
    .eq('user_id', userId);

  // Delete user
  await supabase
    .from('portable_users')
    .delete()
    .eq('id', userId);

  // Delete auth user
  await supabase.auth.admin.deleteUser(userId);

  recordMetric('Cleanup test data', Date.now() - startTime, TEST_CONFIG.numTransactions + 1);
}

function printSummary() {
  console.log('\n' + '='.repeat(80));
  console.log('📈 PERFORMANCE TEST SUMMARY');
  console.log('='.repeat(80) + '\n');

  console.log(`Total operations: ${metrics.length}`);
  console.log(`Total records processed: ${metrics.reduce((sum, m) => sum + m.recordsProcessed, 0).toLocaleString()}`);
  console.log(`Total time: ${metrics.reduce((sum, m) => sum + m.duration, 0).toLocaleString()}ms\n`);

  console.log('Detailed Metrics:\n');
  console.table(metrics.map(m => ({
    Operation: m.operation,
    Duration: `${m.duration}ms`,
    Records: m.recordsProcessed.toLocaleString(),
    'Records/sec': m.recordsPerSecond.toLocaleString(),
  })));

  console.log('\n' + '='.repeat(80));
  console.log('🎯 RECOMMENDATIONS');
  console.log('='.repeat(80) + '\n');

  // Find slowest operations
  const sorted = [...metrics].sort((a, b) => b.duration - a.duration);
  const slowest = sorted.slice(0, 3);

  console.log('Slowest Operations:');
  slowest.forEach((m, i) => {
    console.log(`${i + 1}. ${m.operation}: ${m.duration}ms`);
    if (m.recordsPerSecond < 100) {
      console.log(`   ⚠️  Performance concern: ${m.recordsPerSecond} records/sec`);
    }
  });

  console.log('\n📝 Optimization Recommendations:');
  console.log('1. ✅ Ensure indexes exist on user_id, date, and plaid_item_id');
  console.log('2. ✅ Use pagination for large result sets (LIMIT/OFFSET)');
  console.log('3. ✅ Implement query result caching for parsed income data');
  console.log('4. ✅ Consider materialized views for aggregated income data');
  console.log('5. ✅ Use SELECT only needed columns, not SELECT *');
  console.log('6. ⚠️  For very large datasets (100k+ transactions), consider:');
  console.log('    - Archiving old transactions (>2 years)');
  console.log('    - Supabase connection pooling (PgBouncer)');
  console.log('    - Database read replicas for analytics queries\n');
}

async function main() {
  console.log('🚀 Starting Portable Performance Test\n');
  console.log(`Testing with ${TEST_CONFIG.numTransactions.toLocaleString()} transactions`);
  console.log(`Batch size: ${TEST_CONFIG.batchSize}`);
  console.log(`Platforms: ${TEST_CONFIG.platforms.join(', ')}\n`);

  try {
    // Create test user
    const userId = await createTestUser();
    TEST_CONFIG.userId = userId;

    // Insert large volume of transactions
    await insertTransactions(userId);

    // Test various query patterns
    await testQueryPerformance(userId);

    // Check indexes
    await testDatabaseIndexes();

    // Cleanup
    await cleanup(userId);

    // Print summary
    printSummary();

    console.log('\n✅ Performance test completed successfully!\n');
  } catch (error) {
    console.error('\n❌ Performance test failed:', error);
    process.exit(1);
  }
}

main();
