/**
 * Shared types for the hybrid (regex + Claude) transaction classification pipeline.
 *
 * Kept dependency-free so both client code and server API routes can import it
 * without pulling in browser- or server-only modules.
 */

export type IncomeCategory =
  | 'rideshare'
  | 'delivery'
  | 'freelance'
  | 'creator'
  | 'rental'
  | 'other';

export type ExpenseCategory =
  | 'vehicle'
  | 'equipment'
  | 'supplies'
  | 'software'
  | 'phone'
  | 'home-office'
  | 'other';

export interface TransactionClassification {
  /** Matches Transaction.id */
  id: string;
  kind: 'income' | 'expense' | 'none';
  /** Which pass produced this classification */
  source: 'regex' | 'ai';
  /** 0..1 */
  confidence: number;

  // Income fields (kind === 'income')
  platform?: string;
  incomeCategory?: IncomeCategory;

  // Expense fields (kind === 'expense')
  expenseCategory?: ExpenseCategory;
  subcategory?: string;
  deductible?: boolean;
  /** Percentage deductible, 0-100 */
  deductionRate?: number;
  /** Short IRS-style explanation of why this is (or is not) deductible */
  rationale?: string;
}

/** Minimal transaction shape sent to the classify API (no PII beyond the statement line). */
export interface ClassifiableTransaction {
  id: string;
  date: string; // ISO date
  description: string;
  amount: number;
  type: 'credit' | 'debit';
}

export interface ClassifyResponse {
  classifications: TransactionClassification[];
  model: string;
  batches: number;
}
