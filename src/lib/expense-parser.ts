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
      /sunoco/i,
      /marathon/i,
      /phillips\s*66/i,
      /sinclair/i,
      /costco\sgas/i,
      /sam's\sclub\sgas/i,
      /gas\sstation/i,
      /fuel/i,
      /gas\s&\sgo/i,
      /\bgas\b/i,
      /gasoline/i,
      /petrol/i,
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
      /midas/i,
      /firestone/i,
      /goodyear/i,
      /discount\stire/i,
      /brake/i,
      /tune[-\s]up/i,
      /smog\scheck/i,
      /inspection/i,
      /transmission/i,
      /battery/i,
      /muffler/i,
      /alignment/i,
    ],
    deductionRate: 100,
    gigTypes: ['rideshare', 'delivery'],
  },
  {
    name: 'Car Insurance',
    category: 'vehicle',
    patterns: [
      /geico/i,
      /progressive/i,
      /state\sfarm/i,
      /allstate/i,
      /farmers\sinsurance/i,
      /liberty\smutual/i,
      /usaa/i,
      /nationwide/i,
      /auto\sinsurance/i,
      /car\sinsurance/i,
      /vehicle\sinsurance/i,
    ],
    deductionRate: 100,
    gigTypes: ['rideshare', 'delivery'],
  },
  {
    name: 'Car Lease/Loan',
    category: 'vehicle',
    patterns: [
      /car\spayment/i,
      /auto\sloan/i,
      /vehicle\sloan/i,
      /lease\spayment/i,
      /toyota\sfinancial/i,
      /ford\scredit/i,
      /gm\sfinancial/i,
      /honda\sfinancial/i,
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
    name: 'Hot Bags & Delivery Equipment',
    category: 'equipment',
    patterns: [
      /amazon.*bag/i,
      /insulated\sbag/i,
      /grubhub\sgear/i,
      /doordash\sgear/i,
      /uber\seats\sbag/i,
      /cooler/i,
      /thermal\sbag/i,
      /pizza\sbag/i,
      /delivery\sbag/i,
      /food\swarmer/i,
      /cart/i,
      /dolly/i,
      /hand\struck/i,
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
      /\bmic\b/i,
      /rode/i,
      /blue\syeti/i,
      /shure/i,
      /audio[-\s]technica/i,
      /webcam/i,
      /logitech/i,
      /elgato/i,
      /tripod/i,
      /gimbal/i,
      /lighting/i,
      /softbox/i,
      /video\sequipment/i,
      /camera\sgear/i,
      /lens/i,
      /sd\scard/i,
      /memory\scard/i,
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
      /final\scut/i,
      /premiere/i,
      /davinci\sresolve/i,
      /grammarly/i,
      /quickbooks/i,
      /freshbooks/i,
      /asana/i,
      /trello/i,
      /monday\.com/i,
      /clickup/i,
      /airtable/i,
    ],
    deductionRate: 100,
    gigTypes: ['freelance', 'creator'],
  },
  {
    name: 'Platform Fees',
    category: 'software',
    patterns: [
      /upwork\sfee/i,
      /fiverr\sfee/i,
      /etsy\sfee/i,
      /ebay\sfee/i,
      /amazon\sfee/i,
      /stripe\sfee/i,
      /paypal\sfee/i,
      /square\sfee/i,
      /patreon\sfee/i,
      /platform\sfee/i,
      /transaction\sfee/i,
      /processing\sfee/i,
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