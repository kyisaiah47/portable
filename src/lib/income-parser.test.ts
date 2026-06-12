/**
 * Tests for the regex income parser — the zero-cost first pass of the hybrid
 * classification pipeline. Claude handles whatever these patterns miss
 * (see hybrid-classifier.ts / /api/classify), so the regex layer stays fully
 * testable offline.
 */

import { describe, test, expect } from 'vitest';
import {
  parseTransaction,
  parseTransactions,
  calculateStabilityScore,
  type Transaction,
} from './income-parser';

// Mock bank transactions (like what you'd get from a bank statement or Plaid)
export const mockTransactions: Transaction[] = [
  // Uber payments
  { id: '1', date: new Date('2024-06-01'), description: 'UBER DRIVER PARTNER PAYMENT', amount: 450.25, type: 'credit' },
  { id: '2', date: new Date('2024-06-08'), description: 'UBER BV WEEKLY EARNINGS', amount: 520.5, type: 'credit' },
  { id: '3', date: new Date('2024-06-15'), description: 'Uber Technologies Inc', amount: 480.75, type: 'credit' },
  { id: '4', date: new Date('2024-06-22'), description: 'UBER TRIP EARNINGS WEEKLY', amount: 495.0, type: 'credit' },

  // DoorDash payments
  { id: '5', date: new Date('2024-06-03'), description: 'DOORDASH DASHER PAYMENT', amount: 320.5, type: 'credit' },
  { id: '6', date: new Date('2024-06-10'), description: 'DoorDash Weekly Payment', amount: 285.75, type: 'credit' },
  { id: '7', date: new Date('2024-06-17'), description: 'DD DRIVER WEEKLY DEPOSIT', amount: 310.0, type: 'credit' },
  { id: '8', date: new Date('2024-06-24'), description: 'DOORDASH INC PAYMENT', amount: 295.5, type: 'credit' },

  // Upwork payments
  { id: '9', date: new Date('2024-06-05'), description: 'UPWORK FREELANCE PAYMENT', amount: 850.0, type: 'credit' },
  { id: '10', date: new Date('2024-06-19'), description: 'Upwork Project Payment', amount: 1200.0, type: 'credit' },

  // Fiverr payment
  { id: '11', date: new Date('2024-06-12'), description: 'FIVERR INC WITHDRAWAL', amount: 450.0, type: 'credit' },

  // YouTube/AdSense
  { id: '12', date: new Date('2024-06-21'), description: 'GOOGLE ADSENSE PAYMENT', amount: 680.5, type: 'credit' },

  // Airbnb
  { id: '13', date: new Date('2024-06-07'), description: 'AIRBNB PAYOUT', amount: 750.0, type: 'credit' },
  { id: '14', date: new Date('2024-06-20'), description: 'Air BnB Host Payment', amount: 820.0, type: 'credit' },

  // Non-gig transactions (should be filtered out)
  { id: '15', date: new Date('2024-06-02'), description: 'SALARY DEPOSIT - ABC CORP', amount: 3500.0, type: 'credit' },
  { id: '16', date: new Date('2024-06-05'), description: 'GAS STATION PURCHASE', amount: 45.0, type: 'debit' },
  { id: '17', date: new Date('2024-06-10'), description: 'GROCERY STORE', amount: 120.5, type: 'debit' },
];

describe('parseTransaction (regex first pass)', () => {
  test('detects Uber rideshare income with high confidence', () => {
    const result = parseTransaction(mockTransactions[0]);
    expect(result).not.toBeNull();
    expect(result!.platform).toBe('Uber');
    expect(result!.category).toBe('rideshare');
    expect(result!.amount).toBe(450.25);
    expect(result!.confidence).toBe('high');
  });

  test('detects DoorDash delivery income', () => {
    const result = parseTransaction(mockTransactions[4]);
    expect(result).not.toBeNull();
    expect(result!.platform).toBe('DoorDash');
    expect(result!.category).toBe('delivery');
  });

  test('detects Upwork freelance income', () => {
    const result = parseTransaction(mockTransactions[8]);
    expect(result).not.toBeNull();
    expect(result!.platform).toBe('Upwork');
    expect(result!.category).toBe('freelance');
  });

  test('detects YouTube/AdSense creator income', () => {
    const result = parseTransaction(mockTransactions[11]);
    expect(result).not.toBeNull();
    expect(result!.platform).toBe('YouTube');
    expect(result!.category).toBe('creator');
  });

  test('detects Airbnb rental income', () => {
    const result = parseTransaction(mockTransactions[12]);
    expect(result).not.toBeNull();
    expect(result!.platform).toBe('Airbnb');
    expect(result!.category).toBe('rental');
  });

  test('does not classify W-2 salary as gig income (left for Claude / none)', () => {
    expect(parseTransaction(mockTransactions[14])).toBeNull();
  });

  test('ignores debit transactions', () => {
    expect(parseTransaction(mockTransactions[15])).toBeNull();
    expect(parseTransaction(mockTransactions[16])).toBeNull();
  });

  test('flags generic contractor payments with medium confidence', () => {
    const result = parseTransaction({
      id: 'generic',
      date: new Date('2024-06-01'),
      description: 'ACH CONTRACTOR PAYMENT 00482',
      amount: 500,
      type: 'credit',
    });
    expect(result).not.toBeNull();
    expect(result!.platform).toBe('Other Gig Work');
    expect(result!.confidence).toBe('medium');
  });
});

describe('parseTransactions (full statement)', () => {
  test('aggregates totals, platforms, and date range', () => {
    const parsed = parseTransactions(mockTransactions);

    // 14 gig payments, salary + debits excluded
    expect(parsed.income).toHaveLength(14);
    expect(parsed.totalIncome).toBeCloseTo(7908.75, 2);

    expect(Array.from(parsed.byPlatform.keys()).sort()).toEqual(
      ['Airbnb', 'DoorDash', 'Fiverr', 'Uber', 'Upwork', 'YouTube'].sort()
    );
    expect(parsed.byPlatform.get('Uber')).toHaveLength(4);
    expect(parsed.byPlatform.get('DoorDash')).toHaveLength(4);

    expect(parsed.startDate?.toISOString().slice(0, 10)).toBe('2024-06-01');
    expect(parsed.endDate?.toISOString().slice(0, 10)).toBe('2024-06-24');
  });
});

describe('calculateStabilityScore', () => {
  test('scores a diversified, frequent earner highly', () => {
    const parsed = parseTransactions(mockTransactions);
    const stability = calculateStabilityScore(parsed.income);

    expect(stability.score).toBeGreaterThanOrEqual(60);
    expect(stability.score).toBeLessThanOrEqual(100);
    expect(['excellent', 'good']).toContain(stability.rating);
    // 6 platforms -> max diversification
    expect(stability.factors.diversification).toBe(40);
  });

  test('returns zero for no income', () => {
    const stability = calculateStabilityScore([]);
    expect(stability.score).toBe(0);
    expect(stability.rating).toBe('poor');
  });
});
