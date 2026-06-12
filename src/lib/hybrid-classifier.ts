/**
 * Hybrid transaction classification pipeline.
 *
 * Pass 1 (zero cost): the existing regex parsers classify obvious hits
 * (known gig platforms, known expense merchants).
 * Pass 2 (Claude): everything the regex pass missed or matched with low
 * confidence is sent to the server-side /api/classify route, which batches
 * the remainder through Claude.
 *
 * If the AI pass fails (offline, no key, rate limit), we degrade gracefully
 * to regex-only results.
 */

import { Transaction, ParsedIncome, parseTransaction } from './income-parser';
import { ParsedExpense, parseExpense } from './expense-parser';
import type {
  TransactionClassification,
  ClassifiableTransaction,
  ClassifyResponse,
} from './classification-types';

const REGEX_HIGH_CONFIDENCE = 0.95;
const REGEX_MEDIUM_CONFIDENCE = 0.7;
/** Classifications below this confidence get a second opinion from Claude */
const AI_ESCALATION_THRESHOLD = 0.9;

export interface HybridClassificationResult {
  /** Transaction id -> classification (only ids that classified as income/expense) */
  classifications: Map<string, TransactionClassification>;
  /** True if the Claude pass ran successfully */
  aiUsed: boolean;
  /** Populated if the Claude pass was attempted but failed */
  aiError: string | null;
  /** How many transactions were sent to Claude */
  aiTransactionCount: number;
}

/**
 * Zero-cost first pass: classify a transaction with the regex parsers.
 * Returns null when nothing matches.
 */
export function classifyWithRegex(tx: Transaction): TransactionClassification | null {
  const income = parseTransaction(tx);
  if (income) {
    return {
      id: tx.id,
      kind: 'income',
      source: 'regex',
      confidence: income.confidence === 'high' ? REGEX_HIGH_CONFIDENCE : REGEX_MEDIUM_CONFIDENCE,
      platform: income.platform,
      incomeCategory: income.category,
    };
  }

  const expense = parseExpense(tx);
  if (expense) {
    return {
      id: tx.id,
      kind: 'expense',
      source: 'regex',
      confidence: REGEX_HIGH_CONFIDENCE,
      expenseCategory: expense.category as TransactionClassification['expenseCategory'],
      subcategory: expense.subcategory,
      deductible: true,
      deductionRate: expense.deductionRate,
      rationale: `Matched known ${expense.subcategory} merchant pattern (${expense.deductionRate}% deductible for ${expense.gigTypes.join('/')} work).`,
    };
  }

  return null;
}

function toClassifiable(tx: Transaction): ClassifiableTransaction {
  return {
    id: tx.id,
    date: tx.date.toISOString().split('T')[0],
    description: tx.description,
    amount: tx.amount,
    type: tx.type,
  };
}

/**
 * Run the full hybrid pipeline over a set of transactions.
 */
export async function classifyTransactions(
  transactions: Transaction[]
): Promise<HybridClassificationResult> {
  const classifications = new Map<string, TransactionClassification>();
  const needsAI: Transaction[] = [];

  // Pass 1: regex
  for (const tx of transactions) {
    const regexResult = classifyWithRegex(tx);
    if (regexResult && regexResult.confidence >= AI_ESCALATION_THRESHOLD) {
      classifications.set(tx.id, regexResult);
    } else {
      if (regexResult) {
        // Keep the low-confidence regex result as a fallback if AI fails
        classifications.set(tx.id, regexResult);
      }
      needsAI.push(tx);
    }
  }

  if (needsAI.length === 0) {
    return { classifications, aiUsed: false, aiError: null, aiTransactionCount: 0 };
  }

  // Pass 2: Claude (server-side route keeps the API key off the client)
  try {
    const res = await fetch('/api/classify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ transactions: needsAI.map(toClassifiable) }),
    });

    if (!res.ok) {
      const body = await res.json().catch(() => null);
      throw new Error(body?.error || `Classification API returned ${res.status}`);
    }

    const data: ClassifyResponse = await res.json();
    for (const c of data.classifications) {
      if (c.kind === 'none') continue;
      classifications.set(c.id, { ...c, source: 'ai' });
    }

    return {
      classifications,
      aiUsed: true,
      aiError: null,
      aiTransactionCount: needsAI.length,
    };
  } catch (err) {
    return {
      classifications,
      aiUsed: false,
      aiError: err instanceof Error ? err.message : 'AI classification failed',
      aiTransactionCount: needsAI.length,
    };
  }
}

/**
 * Build income results (same shape as parseTransactions) from classifications.
 */
export function buildIncomeResults(
  transactions: Transaction[],
  classifications: Map<string, TransactionClassification>
): {
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

  for (const tx of transactions) {
    const c = classifications.get(tx.id);
    if (!c || c.kind !== 'income') continue;
    if (tx.type !== 'credit' || tx.amount <= 0) continue;

    const item: ParsedIncome = {
      platform: c.platform || 'Other Gig Work',
      category: c.incomeCategory || 'other',
      amount: tx.amount,
      date: tx.date,
      description: tx.description,
      confidence: c.confidence >= 0.9 ? 'high' : c.confidence >= 0.7 ? 'medium' : 'low',
    };

    income.push(item);
    totalIncome += item.amount;

    if (!byPlatform.has(item.platform)) byPlatform.set(item.platform, []);
    byPlatform.get(item.platform)!.push(item);

    if (!startDate || tx.date < startDate) startDate = tx.date;
    if (!endDate || tx.date > endDate) endDate = tx.date;
  }

  return { income, byPlatform, totalIncome, startDate, endDate };
}

export interface HybridParsedExpense extends ParsedExpense {
  source: 'regex' | 'ai';
  rationale?: string;
  confidence: number;
}

/**
 * Build expense results (same shape as parseExpenses) from classifications.
 */
export function buildExpenseResults(
  transactions: Transaction[],
  classifications: Map<string, TransactionClassification>
): {
  expenses: HybridParsedExpense[];
  byCategory: Map<string, HybridParsedExpense[]>;
  totalExpenses: number;
  totalDeductions: number;
  potentialTaxSavings: number;
} {
  const expenses: HybridParsedExpense[] = [];
  const byCategory = new Map<string, HybridParsedExpense[]>();
  let totalExpenses = 0;
  let totalDeductions = 0;

  for (const tx of transactions) {
    const c = classifications.get(tx.id);
    if (!c || c.kind !== 'expense' || c.deductible === false) continue;
    if (tx.type !== 'debit') continue;

    const amount = Math.abs(tx.amount);
    if (amount === 0) continue;

    const deductionRate = c.deductionRate ?? 100;
    const expense: HybridParsedExpense = {
      category: c.expenseCategory || 'other',
      subcategory: c.subcategory || 'Business Expense',
      amount,
      date: tx.date,
      description: tx.description,
      deductionRate,
      deductibleAmount: amount * (deductionRate / 100),
      gigTypes: [],
      source: c.source,
      rationale: c.rationale,
      confidence: c.confidence,
    };

    expenses.push(expense);
    totalExpenses += expense.amount;
    totalDeductions += expense.deductibleAmount;

    if (!byCategory.has(expense.category)) byCategory.set(expense.category, []);
    byCategory.get(expense.category)!.push(expense);
  }

  return {
    expenses,
    byCategory,
    totalExpenses,
    totalDeductions,
    potentialTaxSavings: totalDeductions * 0.3,
  };
}

/**
 * Build expense results for display from transactions that may already carry a
 * stored classification (loaded from the database). Falls back to the regex
 * parser per-transaction when no stored classification exists, so the
 * dashboard keeps working even before any AI pass has run.
 */
export function buildExpensesFromTransactions(transactions: Transaction[]): ReturnType<
  typeof buildExpenseResults
> {
  const classifications = new Map<string, TransactionClassification>();
  for (const tx of transactions) {
    if (tx.classification && tx.classification.kind !== 'none') {
      classifications.set(tx.id, tx.classification);
    } else {
      const regexResult = classifyWithRegex(tx);
      if (regexResult) classifications.set(tx.id, regexResult);
    }
  }
  return buildExpenseResults(transactions, classifications);
}
