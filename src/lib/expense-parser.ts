/**
 * Expense Parser for Gig Worker Deductions
 *
 * Parses transactions and classifies deductible business expenses using regex patterns.
 * Supports category-specific deductions for rideshare, delivery, freelance, and creator work.
 */

import { Transaction } from './income-parser';

export interface ExpensePattern {
  name: string;
  category: 'vehicle' | 'equipment' | 'supplies' | 'software' | 'phone' | 'home-office' | 'other';
  patterns: RegExp[];
  deductionRate: number; // Percentage deductible (100 = fully deductible)
  gigTypes: string[]; // Which gig types this applies to
}

export interface ParsedExpense {
  category: string;
  subcategory: string;
  amount: number;
  date: Date;
  description: string;
  deductionRate: number;
  deductibleAmount: number;
  gigTypes: string[];
}

// Expense detection patterns
export const EXPENSE_PATTERNS: ExpensePattern[] = [
  // Vehicle/Gas
  {
    name: 'Gas Station',
    category: 'vehicle',
    patterns: [
      /shell/i,
      /chevron/i,
      /exxon/i,
      /mobil/i,
      /bp\s/i,
      /arco/i,
      /76\s/i,
      /valero/i,
      /conoco/i,
      /citgo/i,
      /gas\sstation/i,
      /fuel/i,
      /gas\s&\sgo/i,
    ],
    deductionRate: 100,
    gigTypes: ['rideshare', 'delivery'],
  },
  {
    name: 'Car Maintenance',
    category: 'vehicle',
    patterns: [
      /jiffy\slube/i,
      /auto\szone/i,
      /o'reilly/i,
      /napa\sauto/i,
      /pep\sboys/i,
      /car\swash/i,
      /auto\srepair/i,
      /mechanic/i,
      /oil\schange/i,
      /tire/i,
      /valvoline/i,
    ],
    deductionRate: 100,
    gigTypes: ['rideshare', 'delivery'],
  },
  {
    name: 'Tolls & Parking',
    category: 'vehicle',
    patterns: [
      /toll/i,
      /parking/i,
      /e-zpass/i,
      /fastrak/i,
      /sunpass/i,
    ],
    deductionRate: 100,
    gigTypes: ['rideshare', 'delivery'],
  },

  // Phone/Data
  {
    name: 'Phone Bill',
    category: 'phone',
    patterns: [
      /verizon/i,
      /at&t/i,
      /t-mobile/i,
      /sprint/i,
      /mint\smobile/i,
      /visible/i,
      /cricket/i,
      /metro\s*pcs/i,
      /boost\smobile/i,
    ],
    deductionRate: 80, // 80% business use typical
    gigTypes: ['rideshare', 'delivery', 'freelance', 'creator'],
  },

  // Equipment
  {
    name: 'Hot Bags & Equipment',
    category: 'equipment',
    patterns: [
      /amazon.*bag/i,
      /insulated\sbag/i,
      /grubhub\sgear/i,
      /doordash\sgear/i,
      /cooler/i,
    ],
    deductionRate: 100,
    gigTypes: ['delivery'],
  },
  {
    name: 'Camera & Video Equipment',
    category: 'equipment',
    patterns: [
      /canon/i,
      /nikon/i,
      /sony.*camera/i,
      /gopro/i,
      /dji/i,
      /ring\slight/i,
      /microphone/i,
      /mic\s/i,
      /rode/i,
      /blue\syeti/i,
      /webcam/i,
      /logitech/i,
    ],
    deductionRate: 100,
    gigTypes: ['creator'],
  },
  {
    name: 'Computer & Electronics',
    category: 'equipment',
    patterns: [
      /apple\sstore/i,
      /best\sbuy/i,
      /laptop/i,
      /macbook/i,
      /dell/i,
      /lenovo/i,
      /ipad/i,
      /tablet/i,
      /monitor/i,
      /keyboard/i,
      /mouse/i,
    ],
    deductionRate: 100,
    gigTypes: ['freelance', 'creator'],
  },

  // Software & Subscriptions
  {
    name: 'Software Subscriptions',
    category: 'software',
    patterns: [
      /adobe/i,
      /canva/i,
      /figma/i,
      /notion/i,
      /dropbox/i,
      /google\sworkspace/i,
      /microsoft\s365/i,
      /office\s365/i,
      /zoom/i,
      /slack/i,
      /github/i,
      /aws/i,
      /heroku/i,
      /vercel/i,
      /netlify/i,
    ],
    deductionRate: 100,
    gigTypes: ['freelance', 'creator'],
  },

  // Home Office
  {
    name: 'Internet Service',
    category: 'home-office',
    patterns: [
      /comcast/i,
      /xfinity/i,
      /spectrum/i,
      /cox\scommunications/i,
      /att\sinternet/i,
      /verizon\sfios/i,
      /centurylink/i,
      /frontier/i,
    ],
    deductionRate: 50, // 50% business use typical
    gigTypes: ['freelance', 'creator'],
  },
  {
    name: 'Office Supplies',
    category: 'supplies',
    patterns: [
      /staples/i,
      /office\sdepot/i,
      /amazon.*office/i,
      /paper/i,
      /pen/i,
      /notebook/i,
      /desk/i,
      /chair/i,
    ],
    deductionRate: 100,
    gigTypes: ['freelance', 'creator'],
  },
];

/**
 * Parse a transaction and classify it as a business expense
 */
export function parseExpense(transaction: Transaction): ParsedExpense | null {
  // Only parse debit transactions (expenses)
  if (transaction.type !== 'debit' || transaction.amount <= 0) {
    return null;
  }

  const description = transaction.description.toLowerCase();

  // Try to match against known expense patterns
  for (const pattern of EXPENSE_PATTERNS) {
    for (const regex of pattern.patterns) {
      if (regex.test(transaction.description)) {
        const deductibleAmount = transaction.amount * (pattern.deductionRate / 100);
        return {
          category: pattern.category,
          subcategory: pattern.name,
          amount: transaction.amount,
          date: transaction.date,
          description: transaction.description,
          deductionRate: pattern.deductionRate,
          deductibleAmount,
          gigTypes: pattern.gigTypes,
        };
      }
    }
  }

  return null;
}

/**
 * Parse multiple transactions and group by category
 */
export function parseExpenses(transactions: Transaction[]): {
  expenses: ParsedExpense[];
  byCategory: Map<string, ParsedExpense[]>;
  totalExpenses: number;
  totalDeductions: number;
  potentialTaxSavings: number; // Assuming 30% tax rate
} {
  const expenses: ParsedExpense[] = [];
  const byCategory = new Map<string, ParsedExpense[]>();
  let totalExpenses = 0;
  let totalDeductions = 0;

  for (const transaction of transactions) {
    const parsed = parseExpense(transaction);
    if (parsed) {
      expenses.push(parsed);
      totalExpenses += parsed.amount;
      totalDeductions += parsed.deductibleAmount;

      // Group by category
      if (!byCategory.has(parsed.category)) {
        byCategory.set(parsed.category, []);
      }
      byCategory.get(parsed.category)!.push(parsed);
    }
  }

  const potentialTaxSavings = totalDeductions * 0.30; // 30% tax rate

  return {
    expenses,
    byCategory,
    totalExpenses,
    totalDeductions,
    potentialTaxSavings,
  };
}