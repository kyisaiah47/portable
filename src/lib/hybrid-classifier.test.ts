/**
 * Tests for the hybrid classification pipeline (regex pass + result builders).
 * The Claude pass is exercised via a mocked fetch — no network calls.
 */

import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  classifyWithRegex,
  classifyTransactions,
  buildIncomeResults,
  buildExpenseResults,
  buildExpensesFromTransactions,
} from './hybrid-classifier';
import type { Transaction } from './income-parser';
import type { TransactionClassification } from './classification-types';

const uberIncome: Transaction = {
  id: 'tx-1',
  date: new Date('2024-06-01'),
  description: 'UBER DRIVER PARTNER PAYMENT',
  amount: 450.25,
  type: 'credit',
};

const gasExpense: Transaction = {
  id: 'tx-2',
  date: new Date('2024-06-02'),
  description: 'Shell Gas Station',
  amount: -45.23,
  type: 'debit',
};

const phoneExpense: Transaction = {
  id: 'tx-3',
  date: new Date('2024-06-03'),
  description: 'Verizon Wireless Bill',
  amount: -85.0,
  type: 'debit',
};

const unknownCredit: Transaction = {
  id: 'tx-4',
  date: new Date('2024-06-04'),
  description: 'ZELLE FROM JOHNSON CONSTRUCTION LLC',
  amount: 600.0,
  type: 'credit',
};

describe('classifyWithRegex (zero-cost first pass)', () => {
  test('classifies known platform income', () => {
    const c = classifyWithRegex(uberIncome);
    expect(c).not.toBeNull();
    expect(c!.kind).toBe('income');
    expect(c!.platform).toBe('Uber');
    expect(c!.source).toBe('regex');
    expect(c!.confidence).toBeGreaterThanOrEqual(0.9);
  });

  test('classifies known expense merchants with deduction rate', () => {
    const c = classifyWithRegex(phoneExpense);
    expect(c).not.toBeNull();
    expect(c!.kind).toBe('expense');
    expect(c!.expenseCategory).toBe('phone');
    expect(c!.deductionRate).toBe(80);
    expect(c!.rationale).toBeTruthy();
  });

  test('returns null for unknown transactions (escalated to Claude)', () => {
    expect(classifyWithRegex(unknownCredit)).toBeNull();
  });
});

describe('classifyTransactions (hybrid orchestration)', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  test('only sends regex misses to the AI route', async () => {
    const aiResult: TransactionClassification = {
      id: 'tx-4',
      kind: 'income',
      source: 'ai',
      confidence: 0.8,
      platform: 'Other Gig Work',
      incomeCategory: 'other',
    };
    (fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
      json: async () => ({ classifications: [aiResult], model: 'claude-sonnet-4-6', batches: 1 }),
    });

    const result = await classifyTransactions([uberIncome, gasExpense, unknownCredit]);

    expect(fetch).toHaveBeenCalledTimes(1);
    const body = JSON.parse((fetch as ReturnType<typeof vi.fn>).mock.calls[0][1].body);
    expect(body.transactions.map((t: { id: string }) => t.id)).toEqual(['tx-4']);

    expect(result.aiUsed).toBe(true);
    expect(result.classifications.get('tx-1')!.source).toBe('regex');
    expect(result.classifications.get('tx-2')!.source).toBe('regex');
    expect(result.classifications.get('tx-4')!.source).toBe('ai');
  });

  test('skips the AI call entirely when regex classifies everything', async () => {
    const result = await classifyTransactions([uberIncome, gasExpense]);
    expect(fetch).not.toHaveBeenCalled();
    expect(result.aiUsed).toBe(false);
    expect(result.aiError).toBeNull();
    expect(result.classifications.size).toBe(2);
  });

  test('degrades gracefully to regex-only when the AI route fails', async () => {
    (fetch as ReturnType<typeof vi.fn>).mockRejectedValue(new Error('network down'));

    const result = await classifyTransactions([uberIncome, unknownCredit]);
    expect(result.aiUsed).toBe(false);
    expect(result.aiError).toContain('network down');
    expect(result.classifications.get('tx-1')!.platform).toBe('Uber');
    expect(result.classifications.has('tx-4')).toBe(false);
  });
});

describe('result builders', () => {
  test('buildIncomeResults matches the legacy parseTransactions shape', async () => {
    vi.stubGlobal('fetch', vi.fn());
    const { classifications } = await classifyTransactions([uberIncome, gasExpense]);
    vi.unstubAllGlobals();

    const income = buildIncomeResults([uberIncome, gasExpense], classifications);
    expect(income.totalIncome).toBeCloseTo(450.25, 2);
    expect(income.income).toHaveLength(1);
    expect(income.byPlatform.get('Uber')).toHaveLength(1);
    expect(income.startDate?.toISOString().slice(0, 10)).toBe('2024-06-01');
  });

  test('buildExpenseResults applies partial deduction rates', async () => {
    vi.stubGlobal('fetch', vi.fn());
    const { classifications } = await classifyTransactions([gasExpense, phoneExpense]);
    vi.unstubAllGlobals();

    const expenses = buildExpenseResults([gasExpense, phoneExpense], classifications);
    expect(expenses.expenses).toHaveLength(2);
    expect(expenses.totalExpenses).toBeCloseTo(130.23, 2);
    // gas 100% + phone 80%
    expect(expenses.totalDeductions).toBeCloseTo(45.23 + 85.0 * 0.8, 2);
    expect(expenses.byCategory.has('vehicle')).toBe(true);
    expect(expenses.byCategory.has('phone')).toBe(true);
  });

  test('buildExpensesFromTransactions prefers stored AI classifications', () => {
    const aiClassified: Transaction = {
      ...unknownCredit,
      id: 'tx-5',
      description: 'SQ *CAR DETAILING SUPPLY',
      amount: -60,
      type: 'debit',
      classification: {
        id: 'tx-5',
        kind: 'expense',
        source: 'ai',
        confidence: 0.85,
        expenseCategory: 'vehicle',
        subcategory: 'Car Maintenance',
        deductible: true,
        deductionRate: 100,
        rationale: 'Cleaning supplies for a rideshare vehicle are ordinary and necessary.',
      },
    };

    const result = buildExpensesFromTransactions([aiClassified, gasExpense]);
    expect(result.expenses).toHaveLength(2);
    const ai = result.expenses.find((e) => e.description.includes('DETAILING'));
    expect(ai!.source).toBe('ai');
    expect(ai!.rationale).toContain('rideshare');
  });
});
